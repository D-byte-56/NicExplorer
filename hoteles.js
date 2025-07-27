document.querySelectorAll('.valoracion').forEach(valoracion => {
    const estrellas = valoracion.querySelectorAll('.estrella');
    const textoValoracion = valoracion.querySelector('.valoracion-texto');
    let valorActual = 0;

    estrellas.forEach(estrella => {
        estrella.addEventListener('click', () => {
            valorActual = parseInt(estrella.getAttribute('data-value'));
            estrellas.forEach(e => e.classList.remove('activa'));
            for (let i = 0; i < valorActual; i++) {
                estrellas[i].classList.add('activa');
            }
            textoValoracion.textContent = ` (${valorActual} valoraciones)`;
        });

        estrella.addEventListener('mouseover', () => {
            const valorHover = parseInt(estrella.getAttribute('data-value'));
            estrellas.forEach(e => e.classList.remove('activa'));
            for (let i = 0; i < valorHover; i++) {
                estrellas[i].classList.add('activa');
            }
        });

        estrella.addEventListener('mouseout', () => {
            estrellas.forEach(e => e.classList.remove('activa'));
            for (let i = 0; i < valorActual; i++) {
                estrellas[i].classList.add('activa');
            }
        });
    });
});