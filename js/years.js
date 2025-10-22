// js/years.js
// Obtiene el año actual
    const currentYear = new Date().getFullYear();
    
    // Inserta el año dentro del elemento con id="year"
    document.getElementById("year").textContent = currentYear;
