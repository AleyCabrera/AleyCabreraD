// Actualiza el año en el footer automáticamente
document.addEventListener('DOMContentLoaded', function() {
    const footerDiv = document.querySelector('.footer div:first-child');
    if (footerDiv) {
        const currentYear = new Date().getFullYear();
        footerDiv.textContent = `© ${currentYear} Aley Cabrera · Ingeniería IT/OT`;
    }
});