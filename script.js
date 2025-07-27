//lenguaje.js

const translations = {
  es: {
    titulo_hero: "Descubre Nicaragua",
    descripcion_hero: "Tu aventura te espera en el corazón de Centroamérica.",
    buscar_btn: "Explorar Destinos"
  },
  en: {
    titulo_hero: "Discover Nicaragua",
    descripcion_hero: "Your adventure awaits in the heart of Central America.",
    buscar_btn: "Search"
  },
  fr: {
    titulo_hero: "Découvrez le Nicaragua",
    descripcion_hero: "Votre aventure vous attend au cœur de l'Amérique centrale.",
    buscar_btn: "Rechercher"
  },
  de: {
    titulo_hero: "Entdecke Nicaragua",
    descripcion_hero: "Dein Abenteuer erwartet dich im Herzen Mittelamerikas.",
    buscar_btn: "Suchen"
  }
};
 
//carrousel de destinos
// script.js
// script.js
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.destino-card');
    cards.forEach(card => {
        const carouselImages = card.querySelectorAll('.carousel-image');
        const prevBtn = card.querySelector('.carousel-prev');
        const nextBtn = card.querySelector('.carousel-next');
        let currentIndex = 0;

        if (carouselImages.length === 0) {
            console.log('No se encontraron imágenes en el carrusel.');
            return;
        }

        function updateCarousel() {
            carouselImages.forEach((img, index) => {
                img.classList.remove('active');
                if (index === currentIndex) {
                    img.classList.add('active');
                }
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselImages.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < carouselImages.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        // Inicia con la primera imagen activa
        updateCarousel();
    });
});