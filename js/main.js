// Autor: Aley Cabrera

// Inicializa el efecto de escritura en los elementos HTML del documento al cargar la página de Inicio
document.addEventListener("DOMContentLoaded", () => {
    const texts = [
        { id: "typing1", text: "Hola, mi nombre es" },
        { id: "typing2", text: "ALEY CABRERA D." },
        { id: "typing3", text: "Transformamos ideas en soluciones digitales seguras e innovadoras." },
        { id: "typing4", text: "Desarrollo software full stack y estrategias de ciberseguridad para crear aplicaciones robustas, escalables y accesibles que protegen tus datos y potencian tu modelo negocio." },
    ];

    const typingSpeed = 60; // Velocidad de escritura (ms por carácter)
    const delayBetweenSections = 1000; // Pausa entre secciones (ms)
    const delayBeforeRestart = 6000; // Pausa antes de reiniciar (ms)

    const typingEffect = (elementId, text, isLastParagraph) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        let index = 0;
        let cursor = element.querySelector(".cursor") || document.createElement("span");
        cursor.className = "cursor";
        element.appendChild(cursor);

        const type = () => {
            if (index < text.length) {
                element.textContent = text.slice(0, index + 1); // Escribe el texto
                element.appendChild(cursor); // Coloca el cursor al final
                index++;
                setTimeout(() => requestAnimationFrame(type), typingSpeed); // Controla la velocidad
            } else {
                if (isLastParagraph) {
                    cursor.classList.add("blink"); // Parpadeo del cursor en el último párrafo
                } else {
                    cursor.remove(); // Elimina el cursor si no es el último párrafo
                }
            }
        };

        type(); // Inicia la animación
    };

    const startTyping = () => {
        let totalDelay = 0;

        // Limpia el contenido de todos los elementos antes de reiniciar
        texts.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = "";
        });

        // Inicia el efecto para cada texto
        texts.forEach(({ id, text }, index) => {
            const isLastParagraph = index === texts.length - 1;
            setTimeout(() => {
                typingEffect(id, text, isLastParagraph);
            }, totalDelay);
            totalDelay += text.length * typingSpeed + delayBetweenSections;
        });

        // Programa el reinicio del efecto
        setTimeout(startTyping, totalDelay + delayBeforeRestart);
    };

    startTyping(); // Inicia el efecto al cargar la página
});


// Actualizacion de la fecha en el footer
document.addEventListener('DOMContentLoaded', function() {
        const yearSpan = document.querySelector('.derechos');
        const currentYear = new Date().getFullYear(); // Obtiene el año actual
        yearSpan.innerHTML = `&copy; ${currentYear} Aley Cabrera. Todos los derechos reservados.`;
    });


// Efecto de desplazamiento suave al hacer clic en los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
})


// Efecto de desplazamiento suave al hacer clic en los enlaces de certificaciones
function toggleCertificaciones(element) {
            let container = element.nextElementSibling;
            let arrow = element.querySelector('.arrow');
            let logo = container.nextElementSibling; // Obtiene el logo

            if (container.classList.contains('active')) {
                container.classList.remove('active');
                arrow.classList.remove('active');
                setTimeout(() => {
                    logo.style.opacity = "1";
                    logo.style.pointerEvents = "auto";
                }, 300); // Espera la animación antes de mostrar el logo
            } else {
                container.classList.add('active');
                arrow.classList.add('active');
                logo.style.opacity = "0";
                logo.style.pointerEvents = "none";
            }
}

// menu toggle para dispositivos moviles
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.querySelector(".lista");

    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
});


