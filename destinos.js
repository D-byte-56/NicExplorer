// Inicializar Swiper
const swiper = new Swiper('.swiper-container', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Inicializar Swiper para el modal
const modalSwiper = new Swiper('.modal-swiper', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

function openHotelModal(destination) {
    const modal = document.getElementById('hotel-modal');
    const hotelTitle = document.getElementById('hotel-title');
    const hotelImages = document.getElementById('hotel-images');
    const hotelDescription = document.getElementById('hotel-description');
    const hotelPrice = document.getElementById('hotel-price');

    // Datos de ejemplo para el hotel (puedes reemplazar con datos dinámicos)
    let hotelData;
    if (destination === 'sanJuan') {
        hotelData = {
            name: 'Hotel 3 estrellas San Juan',
            images: [
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
                'https://images.unsplash.com/photo-1586611295666-1ef4e5f0c9fc',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945'
            ],
            description: 'Un hotel acogedor cerca de la playa con vistas espectaculares al atardecer. Incluye desayuno buffet y acceso a Wi-Fi.',
            price: '$250'
        };
    } else if (destination === 'ometepe') {
        hotelData = {
            name: 'Hotel 3 estrellas Ometepe',
            images: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470'
            ],
            description: 'Hotel con vistas a los volcanes, ideal para relajarse. Ofrece desayuno incluido y tours guiados.',
            price: '$250'
        };
    }

    hotelTitle.textContent = hotelData.name;
    hotelImages.innerHTML = hotelData.images.map(img => `<div class="swiper-slide"><img src="${img}" alt="${hotelData.name}"></div>`).join('');
    hotelDescription.textContent = hotelData.description;
    hotelPrice.textContent = hotelData.price;

    modalSwiper.update(); // Actualizar el Swiper del modal
    modal.style.display = 'flex';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('hotel-modal').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });
});