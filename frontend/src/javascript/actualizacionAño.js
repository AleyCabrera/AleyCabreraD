document.addEventListener('DOMContentLoaded', function() {
        const yearSpan = document.querySelector('.derechos');
        const currentYear = new Date().getFullYear(); // Obtiene el año actual
        yearSpan.innerHTML = `&copy; ${currentYear} Aley Cabrera. Todos los derechos reservados.`;
    });