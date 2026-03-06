const door = document.getElementById('door');
const background = document.querySelector('.full-bg');

if (door && background) {
    door.addEventListener('dblclick', () => {
        // Prendi posizione della porta relativa allo sfondo
        const rect = door.getBoundingClientRect();
        const bgRect = background.getBoundingClientRect();

        // Calcola percentuali per transform-origin
        const originX = ((rect.left + rect.width / 2 - bgRect.left) / bgRect.width) * 100;
        const originY = ((rect.top + rect.height / 2 - bgRect.top) / bgRect.height) * 100;

        // Imposta il punto di origine dello zoom
        background.style.transformOrigin = `${originX}% ${originY}%`;

        // Zoom
        background.classList.add('zoomed');

        // Dopo 1 secondo, vai a galleria.html
        setTimeout(() => {
            window.location.href = 'workinprogress.html';
        }, 1000);
    });
}