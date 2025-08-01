// Inicializar Firebase
const firebaseConfig = {
    // Reemplaza con tu configuración de Firebase (obtén desde Firebase Console)
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_ID",
    appId: "TU_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const stripe = Stripe('tu_clave_publicable'); // Reemplaza con tu clave de Stripe

// Cargar destinos dinámicamente
async function cargarDestinos() {
    const destinosGrid = document.querySelector('.destinos-grid');
    destinosGrid.innerHTML = '';
    const snapshot = await db.collection('destinos').get();
    snapshot.forEach(async doc => {
        const destino = doc.data();
        // Obtener nombre del hotel
        const hotelDoc = await db.collection('hoteles').doc(destino.hotel_id).get();
        const nombreHotel = hotelDoc.exists ? hotelDoc.data().nombre : 'Sin hotel';
        destinosGrid.innerHTML += `
            <div class="destino-card">
                <div class="carousel">
                    <div class="carousel-images">
                        ${destino.imagenes.map((img, index) => `<img src="${img}" alt="${destino.nombre}" class="${index === 0 ? 'active' : ''}">`).join('')}
                    </div>
                    <button class="carousel-prev">❮</button>
                    <button class="carousel-next">❯</button>
                </div>
                <h3>${destino.nombre}</h3>
                <p>${destino.descripcion}</p>
                <p><strong>Actividades:</strong> ${destino.actividades.join(', ')}</p>
                <p><strong>Paquete completo:</strong> $${destino.precio_completo} USD</p>
                <p><strong>Paquete básico:</strong> $${destino.precio_basico} USD</p>
                <p><strong>Hotel:</strong> <a href="#" class="hotel-link" data-hotel-id="${destino.hotel_id}">${nombreHotel}</a></p>
                <button class="reservar-btn" data-destino-id="${doc.id}" data-precio-completo="${destino.precio_completo}" data-precio-basico="${destino.precio_basico}">Reservar</button>
            </div>
        `;
    });
    inicializarCarruseles();
    inicializarEventos();
}

// Inicializar carruseles
function inicializarCarruseles() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-images img');
        let currentImage = 0;
        carousel.querySelector('.carousel-next').addEventListener('click', () => {
            images[currentImage].classList.remove('active');
            currentImage = (currentImage + 1) % images.length;
            images[currentImage].classList.add('active');
        });
        carousel.querySelector('.carousel-prev').addEventListener('click', () => {
            images[currentImage].classList.remove('active');
            currentImage = (currentImage - 1 + images.length) % images.length;
            images[currentImage].classList.add('active');
        });
    });
}

// Inicializar eventos de modales
function inicializarEventos() {
    document.querySelectorAll('.hotel-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const hotelId = link.getAttribute('data-hotel-id');
            const hotelDoc = await db.collection('hoteles').doc(hotelId).get();
            if (!hotelDoc.exists) return alert('Hotel no encontrado');
            const hotel = hotelDoc.data();
            const hotelModal = document.getElementById('hotel-modal');
            hotelModal.querySelector('.modal-content').innerHTML = `
                <span class="close-btn">&times;</span>
                <div class="carousel">
                    ${hotel.imagenes.map((img, index) => `<img src="${img}" alt="${hotel.nombre}" class="${index === 0 ? 'active' : ''}">`).join('')}
                    <button class="carousel-prev">❮</button>
                    <button class="carousel-next">❯</button>
                </div>
                <h3>${hotel.nombre}</h3>
                <p>${hotel.descripcion}</p>
                <p><strong>Valoración:</strong> ⭐${'★'.repeat(Math.floor(hotel.valoracion))}${'☆'.repeat(5 - Math.floor(hotel.valoracion))} (${hotel.valoracion}/5)</p>
                <p><strong>Incluye:</strong> ${hotel.incluye.join(', ')}</p>
            `;
            hotelModal.style.display = 'flex';
            inicializarCarruseles();
        });
    });

    document.querySelectorAll('.reservar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const destinoId = btn.getAttribute('data-destino-id');
            const precioCompleto = btn.getAttribute('data-precio-completo');
            const precioBasico = btn.getAttribute('data-precio-basico');
            const paqueteSelect = document.getElementById('paquete');
            paqueteSelect.innerHTML = `
                <option value="completo">Paquete completo ($${precioCompleto})</option>
                <option value="basico">Paquete básico ($${precioBasico})</option>
            `;
            document.getElementById('reserva-form').setAttribute('data-destino-id', destinoId);
            document.getElementById('reserva-modal').style.display = 'flex';
        });
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('hotel-modal').style.display = 'none';
            document.getElementById('reserva-modal').style.display = 'none';
        });
    });
}

// Formulario de reserva con Stripe
document.getElementById('reserva-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        personas: parseInt(document.getElementById('personas').value),
        fecha: document.getElementById('fecha').value,
        paquete: document.getElementById('paquete').value,
        destino_id: document.getElementById('reserva-form').getAttribute('data-destino-id')
    };

    const destinoDoc = await db.collection('destinos').doc(formData.destino_id).get();
    const precio = formData.paquete === 'completo' ? destinoDoc.data().precio_completo * 100 : destinoDoc.data().precio_basico * 100;

    // Crear sesión de pago
    const response = await fetch('https://us-central1-TU_PROYECTO.cloudfunctions.net/crearPago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: precio,
            currency: 'usd',
            metadata: { destino_id: formData.destino_id }
        })
    });
    const session = await response.json();

    // Guardar reserva
    const reservaRef = await db.collection('reservas').add({
        ...formData,
        estado: 'pendiente',
        payment_intent_id: session.id
    });

    // Redirigir a Stripe
    stripe.redirectToCheckout({ sessionId: session.id });
});

// Panel de administración
async function cargarHotelesEnFormulario() {
    const hotelSelect = document.getElementById('admin-hotel_id');
    hotelSelect.innerHTML = '<option value="">Seleccione un hotel</option>';
    const snapshot = await db.collection('hoteles').get();
    snapshot.forEach(doc => {
        const hotel = doc.data();
        hotelSelect.innerHTML += `<option value="${doc.id}">${hotel.nombre}</option>`;
    });
}

document.getElementById('admin-destino-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        nombre: document.getElementById('admin-nombre').value,
        descripcion: document.getElementById('admin-descripcion').value,
        actividades: document.getElementById('admin-actividades').value.split(',').map(item => item.trim()),
        precio_completo: parseFloat(document.getElementById('admin-precio_completo').value),
        precio_basico: parseFloat(document.getElementById('admin-precio_basico').value),
        hotel_id: document.getElementById('admin-hotel_id').value,
        imagenes: document.getElementById('admin-imagenes').value.split(',').map(item => item.trim())
    };

    await db.collection('destinos').add(data);
    alert('Destino agregado con éxito');
    cargarDestinos();
});

cargarHotelesEnFormulario();
cargarDestinos();