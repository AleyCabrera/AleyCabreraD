
// ===== DATOS DE CERTIFICACIONES =====
const certifications = [
    // SENA - 2025 (más recientes)
    { name: "Procesos de soporte tecnico para el mantenimiento de equipos de computo", institution: "SENA", category: "sena", icon: "fas fa-tools", date: "2025", tags: ["Soporte Técnico", "Mantenimiento"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertProceMante.pdf", credentialId: "SENA-2025-001" },
    { name: "Redes y Seguridad", institution: "SENA", category: "sena", icon: "fas fa-network-wired", date: "2025", tags: ["Redes", "Seguridad"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertRedSeg.pdf", credentialId: "SENA-2025-002" },
    { name: "Electronica: Electrotecnia Y Medidas", institution: "SENA", category: "sena", icon: "fas fa-microchip", date: "2025", tags: ["Electrónica", "Electrotecnia"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertElectronica.pdf", credentialId: "SENA-2025-003" },
    // SENA - 2024
    { name: "Modelos de calidad de software", institution: "SENA", category: "sena", icon: "fas fa-check-double", date: "2024", tags: ["Calidad", "Software"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertModCalSoft.pdf", credentialId: "SENA-2024-001" },
    { name: "Aplicacion de la metodologia scrum para proyectos de desarrollo de software", institution: "SENA", category: "sena", icon: "fas fa-chart-line", date: "2024", tags: ["Scrum", "Ágil"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertApMetScrum.pdf", credentialId: "SENA-2024-002" },
    { name: "Modulos, Estructura De Almacenamiento Y Poo Utilizando El Lenguaje De Programacion C++ (Nivel II)", institution: "SENA", category: "sena", icon: "fas fa-code", date: "2024", tags: ["C++", "POO", "Módulos"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertEstrLengProC%2B%2BII.pdf", credentialId: "SENA-2024-003" },
    { name: "Uso De Clases, Objetos, Metodos Y Archivos Secuenciales En Poo Con Lenguaje De Programacion C++ (Nivel III)", institution: "SENA", category: "sena", icon: "fas fa-code", date: "2024", tags: ["C++", "POO", "Clases"], link: "#", credentialId: "SENA-2024-004" },
    // SENA - 2023
    { name: "Metodologia de la programacion de sistemas informaticos", institution: "SENA", category: "sena", icon: "fas fa-code", date: "2023", tags: ["Programación", "Metodologías"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertMetProSiste.pdf", credentialId: "SENA-2023-001" },
    { name: "Conceptualizacion del lenguaje de programacion C++", institution: "SENA", category: "sena", icon: "fas fa-code", date: "2023", tags: ["C++", "Programación"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertConLengProC%2B%2B.pdf", credentialId: "SENA-2023-002" },
    { name: "Estructura Del Lenguaje De Programacion C++ (Nivel I)", institution: "SENA", category: "sena", icon: "fas fa-code", date: "2023", tags: ["C++", "Estructuras"], link: "https://github.com/AleyCabrera/AleyCabreraD/blob/main/assets/doc/certificaciones/CertEstrLengProC%2B%2BI.pdf", credentialId: "SENA-2023-003" },
    // Universidad de la Rioja
    { name: "Programación en Python", institution: "Fundación Universitaria Internacional de la Rioja", category: "otros", icon: "fab fa-python", date: "2023", tags: ["Python", "Programación"], link: "#", credentialId: "UNIR-2023-001" },
    // Platzi - 2024
    { name: "Fundamentos de programación", institution: "Platzi", category: "platzi", icon: "fas fa-laptop-code", date: "2024", tags: ["Programación", "Fundamentos"], link: "#", credentialId: "PLATZI-2024-001" },
    { name: "Fundamentos de programación y desarrollo web", institution: "Platzi", category: "platzi", icon: "fas fa-globe", date: "2024", tags: ["Web", "Programación"], link: "#", credentialId: "PLATZI-2024-002" },
    { name: "Ciberseguridad personal", institution: "Platzi", category: "platzi", icon: "fas fa-shield-alt", date: "2024", tags: ["Ciberseguridad", "Personal"], link: "#", credentialId: "PLATZI-2024-003" },
    { name: "Ciberseguridad para gerentes y directivos técnicos", institution: "Platzi", category: "platzi", icon: "fas fa-chalkboard-user", date: "2024", tags: ["Ciberseguridad", "Gerencia"], link: "#", credentialId: "PLATZI-2024-004" },
    { name: "Ciberseguridad en el trabajo", institution: "Platzi", category: "platzi", icon: "fas fa-briefcase", date: "2024", tags: ["Ciberseguridad", "Empresarial"], link: "#", credentialId: "PLATZI-2024-005" },
    { name: "Business Intelligence y Data Management", institution: "Platzi", category: "platzi", icon: "fas fa-chart-bar", date: "2024", tags: ["BI", "Datos"], link: "#", credentialId: "PLATZI-2024-006" },
    // Google (Coursera) - 2024
    { name: "Soporte de Tecnologías de la Información de Google", institution: "Google", category: "google", icon: "fab fa-google", date: "2024", tags: ["IT Support", "Google"], link: "#", credentialId: "GOOGLE-2024-001" },
    { name: "Google Cybersecurity", institution: "Google", category: "google", icon: "fas fa-shield-haltered", date: "2024", tags: ["Ciberseguridad", "Google"], link: "#", credentialId: "GOOGLE-2024-002" },
    // Coursera - 2024
    { name: "Ethical Hacking Essentials", institution: "E-council", category: "coursera", icon: "fas fa-user-secret", date: "2024", tags: ["Ethical Hacking", "Seguridad"], link: "#", credentialId: "EC-2024-001" },
    { name: "Ciberseguridad", institution: "Universidad de los Andes", category: "coursera", icon: "fas fa-university", date: "2024", tags: ["Ciberseguridad", "Universidad"], link: "#", credentialId: "UNIANDES-2024-001" },
    // CISCO - 2025 (más recientes)
    { name: "Conceptos basicos de redes", institution: "CISCO", category: "cisco", icon: "fas fa-network-wired", date: "2025", tags: ["Redes", "CISCO"], link: "#", credentialId: "CISCO-2025-001" },
    { name: "Direccionamiento de red y solución de problemas básicos", institution: "CISCO", category: "cisco", icon: "fas fa-diagram-project", date: "2025", tags: ["Direccionamiento", "Troubleshooting"], link: "#", credentialId: "CISCO-2025-002" },
    { name: "Dispositivos de red y configuración inicial", institution: "CISCO", category: "cisco", icon: "fas fa-router", date: "2025", tags: ["Dispositivos", "Configuración"], link: "#", credentialId: "CISCO-2025-003" },
    { name: "Fundamentos de ciberseguridad", institution: "CISCO", category: "cisco", icon: "fas fa-shield-alt", date: "2025", tags: ["Ciberseguridad", "Fundamentos"], link: "#", credentialId: "CISCO-2025-004" },
    { name: "Junior Cybersecurity Analyst Career Path", institution: "CISCO", category: "cisco", icon: "fas fa-chart-line", date: "2025", tags: ["Analista", "Ciberseguridad"], link: "#", credentialId: "CISCO-2025-005" },
    { name: "Soporte y seguridad de red", institution: "CISCO", category: "cisco", icon: "fas fa-headset", date: "2025", tags: ["Soporte", "Seguridad"], link: "#", credentialId: "CISCO-2025-006" },
    // Ministerio TIC - 2025
    { name: "Ciberseguridad", institution: "Tatelento Tech - Ministerio de las TIC", category: "otros", icon: "fas fa-building", date: "2025", tags: ["Ciberseguridad", "Gobierno"], link: "#", credentialId: "MINTIC-2025-001" },
    // UNAD - 2025
    { name: "Habilidades en Diseño de redes", institution: "UNAD", category: "otros", icon: "fas fa-network-wired", date: "2025", tags: ["Redes", "Diseño"], link: "#", credentialId: "UNAD-2025-001" },
    { name: "Habilidades en Ciberseguridad", institution: "UNAD", category: "otros", icon: "fas fa-shield-alt", date: "2025", tags: ["Ciberseguridad", "Habilidades"], link: "#", credentialId: "UNAD-2025-002" }
];

// ===== FUNCIÓN PARA ORDENAR POR FECHA (MÁS RECIENTE PRIMERO) =====
function sortByDate(certs) {
    return [...certs].sort((a, b) => {
        // Convertir año a número para comparación
        const yearA = parseInt(a.date);
        const yearB = parseInt(b.date);
        return yearB - yearA; // Más reciente primero
    });
}

// ===== FUNCIÓN PARA RENDERIZAR CON ORDENAMIENTO =====
function renderCertifications(filter = 'all') {
    const grid = document.getElementById('certsGrid');
    
    // Filtrar primero
    let filtered = filter === 'all' 
        ? [...certifications] 
        : certifications.filter(cert => cert.category === filter);
    
    // Ordenar por fecha (más reciente primero)
    filtered = sortByDate(filtered);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No hay certificaciones en esta categoría</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(cert => `
        <article class="cert-card">
            <div class="cert-header">
                <div class="cert-icon">
                    <i class="${cert.icon}"></i>
                </div>
                <span class="cert-institution">${cert.institution}</span>
                <span class="cert-year-badge">${cert.date}</span>
            </div>
            <h3>${cert.name}</h3>
            <div class="cert-date">
                <i class="far fa-calendar-alt"></i> ${cert.date}
            </div>
            <div class="cert-tags">
                ${cert.tags.map(tag => `<span class="cert-tag">${tag}</span>`).join('')}
            </div>
            <div class="cert-actions">
                <a href="${cert.link}" target="_blank" rel="noopener noreferrer" class="cert-verify-link" title="Verificar credencial">
                    <i class="fas fa-check-circle"></i> Verificar credencial
                    <span class="credential-id">${cert.credentialId}</span>
                </a>
            </div>
        </article>
    `).join('');
}

// ===== ACTUALIZAR CONTADORES =====
const counts = {
    total: certifications.length,
    cisco: certifications.filter(c => c.category === 'cisco').length,
    google: certifications.filter(c => c.category === 'google').length,
    sena: certifications.filter(c => c.category === 'sena').length,
    platzi: certifications.filter(c => c.category === 'platzi').length,
    coursera: certifications.filter(c => c.category === 'coursera').length,
    otros: certifications.filter(c => c.category === 'otros').length
};

// Actualizar contadores en la interfaz
document.getElementById('certCount').textContent = counts.total;
document.getElementById('totalCerts').textContent = counts.total;

// Actualizar badges de los filtros (opcional)
document.querySelectorAll('.filter-btn').forEach(btn => {
    const filter = btn.dataset.filter;
    if (filter !== 'all' && counts[filter]) {
        btn.innerHTML = `${btn.innerHTML.split('<')[0]} <span class="filter-count">${counts[filter]}</span>`;
    } else if (filter === 'all') {
        btn.innerHTML = `${btn.innerHTML.split('<')[0]} <span class="filter-count">${counts.total}</span>`;
    }
});

// ===== CONFIGURAR FILTROS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCertifications(btn.dataset.filter);
    });
});

// ===== RENDER INICIAL (ordenado por fecha) =====
renderCertifications('all');