let slideIndices = [1, 1]; // Para los sliders de imágenes de destinos
let basePrice = 0;
let currentSlide = 0;
let images = [];

function plusSlides(n, no) {
    showSlides(slideIndices[no] += n, no);
}

function showSlides(n, no) {
    let i;
    let slides = document.getElementsByClassName("slideshow-container")[no].getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndices[no] = 1 }
    if (n < 1) { slideIndices[no] = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndices[no] - 1].style.display = "block";
}

// Inicializa sliders de imágenes
for (let i = 0; i < slideIndices.length; i++) {
    showSlides(slideIndices[i], i);
}

// Toggle para expandir/colapsar destinos
function toggleDestination(index) {
    let content = document.getElementsByClassName("destination-content")[index];
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

// Inicializa colapsados
document.querySelectorAll(".destination-content").forEach(content => {
    content.style.display = "none";
});

// Para carruseles de tarjetas (paquetes, hoteles, restaurantes)
let carouselIndices = {
    packages: [0, 0],
    hotels: [0, 0],
    restaurants: [0, 0]
};

function plusCarousel(n, type, destIndex) {
    let currentIndex = carouselIndices[type][destIndex] + n;
    showCarousel(currentIndex, type, destIndex);
}

function showCarousel(index, type, destIndex) {
    let carousel = document.querySelectorAll(`.${type}-carousel`)[destIndex];
    let track = carousel.querySelector('.carousel-track');
    let cards = track.children;
    let visibleCards = window.innerWidth > 768 ? 3 : 1;
    let maxIndex = cards.length - visibleCards;

    if (index > maxIndex) { index = maxIndex; }
    if (index < 0) { index = 0; }

    carouselIndices[type][destIndex] = index;
    track.style.transform = `translateX(-${index * (100 / visibleCards)}%)`;
}

function plusCardSlides(element, n) {
    let container = element.closest('.card-slideshow');
    let index = parseInt(container.dataset.index || 1) + n;
    let slides = container.getElementsByClassName('mySlides');
    if (index > slides.length) { index = 1; }
    if (index < 1) { index = slides.length; }
    container.dataset.index = index;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[index - 1].style.display = "block";
}

// Inicializa todos los sub-carruseles
document.querySelectorAll('.card-slideshow').forEach(container => {
    let slides = container.getElementsByClassName('mySlides');
    if (slides.length > 0) {
        slides[0].style.display = "block";
        container.dataset.index = 1;
    }
});

function setRating(element, rating) {
    let stars = element.parentElement.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = 'gold';
        } else {
            star.style.color = 'gray';
        }
    });
    element.parentElement.querySelector('input[name="rating"]').value = rating;
}

function openDetailsModal(pkg, price) {
    basePrice = price;
    let details = '';
    let imageUrls = [];
    if (pkg === 'aventura') {
        imageUrls = [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeYoJc8jfZOFf4Yggo_C0gt8IkgrTcX4N2OQ&s',
            'https://procolombia.co/sites/default/files/procolombia/news/images/hoteles-01.webp',
            'https://via.placeholder.com/800?text=Foto+Hotel+3'
        ];
        details = `
            <h3>Paquete Aventura</h3>
            <div class="carousel">
                ${imageUrls.map((url, index) => `<img src="${url}" alt="Foto ${index + 1}" class="${index === 0 ? 'active' : ''}">`).join('')}
                <a class="prev" onclick="changeSlide(-1)">&#10094;</a>
                <a class="next" onclick="changeSlide(1)">&#10095;</a>
            </div>
            <p>El hotel cuenta con 50 habitaciones, piscinas, restaurante y vistas al volcán.</p>
        `;
    } else if (pkg === 'surf') {
        imageUrls = [
            'https://via.placeholder.com/800?text=Foto+Hotel+1',
            'https://via.placeholder.com/800?text=Foto+Hotel+2',
            'https://via.placeholder.com/800?text=Foto+Hotel+3'
        ];
        details = `
            <h3>Paquete Surf y Playa</h3>
            <div class="carousel">
                ${imageUrls.map((url, index) => `<img src="${url}" alt="Foto ${index + 1}" class="${index === 0 ? 'active' : ''}">`).join('')}
                <a class="prev" onclick="changeSlide(-1)">&#10094;</a>
                <a class="next" onclick="changeSlide(1)">&#10095;</a>
            </div>
            <p>El hotel cuenta con 30 habitaciones, acceso directo a la playa y equipo de surf disponible.</p>
        `;
    }
    images = imageUrls;
    document.getElementById('package-details').innerHTML = details;
    document.getElementById('details-modal').style.display = 'block';
    currentSlide = 0;
    updatePrice();
}

function closeDetailsModal() {
    document.getElementById('details-modal').style.display = 'none';
}

function openReservationModal() {
    closeDetailsModal();
    document.getElementById('reservation-modal').style.display = 'block';
    updatePrice();
    document.getElementById('servicio-adicional').addEventListener('change', function() {
        if (this.value === 'transporte') {
            document.getElementById('transporte-info').style.display = 'block';
        } else {
            document.getElementById('transporte-info').style.display = 'none';
        }
    });
}

function closeReservationModal() {
    document.getElementById('reservation-modal').style.display = 'none';
}

function incrementAdults() {
    let num = parseInt(document.getElementById('num-adultos').value);
    document.getElementById('num-adultos').value = num + 1;
    updatePrice();
}

function decrementAdults() {
    let num = parseInt(document.getElementById('num-adultos').value);
    if (num > 1) {
        document.getElementById('num-adultos').value = num - 1;
        updatePrice();
    }
}

function updatePrice() {
    let num = parseInt(document.getElementById('num-adultos').value || 1);
    let total = basePrice * num;
    document.getElementById('precio-total').innerText = '$' + total;
}

function submitReservation() {
    alert('¡Reserva realizada con éxito!');
    closeReservationModal();
}

function changeSlide(n) {
    currentSlide = (currentSlide + n + images.length) % images.length;
    const slides = document.querySelectorAll('.carousel img');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}