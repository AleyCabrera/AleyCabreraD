// Configuración de animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el Intersection Observer para animaciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agregar clase de animación cuando el elemento es visible
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, 100);
                
                // Si es una tarjeta de habilidad, animar la barra de progreso
                if (entry.target.classList.contains('skill-card')) {
                    animateSkillBar(entry.target);
                }
                
                // Si es una tarjeta de estadísticas, animar los contadores
                if (entry.target.querySelector('.stat-value')) {
                    const statItems = entry.target.querySelectorAll('.stat-item');
                    statItems.forEach((item, index) => {
                        setTimeout(() => {
                            animateValueCounter(item);
                        }, index * 300);
                    });
                }
            } else {
                // Opcional: remover la clase cuando no es visible
                // entry.target.classList.remove('animate-in');
            }
        });
    }, observerOptions);

    // Observar todas las secciones y elementos que deben animarse
    const sections = document.querySelectorAll('section, .skill-card, .project-card, .post-card, .stat-item, .detail-card');
    sections.forEach((section, index) => {
        section.classList.add('scroll-animate');
        // Establecer índice para delays escalonados
        section.style.setProperty('--i', index + 1);
        observer.observe(section);
    });

    // Función para animar barras de habilidades
    function animateSkillBar(skillCard) {
        const skillLevel = skillCard.querySelector('.skill-level');
        if (!skillLevel) return;
        
        const dataLevel = skillLevel.getAttribute('data-level');
        const skillPercent = skillCard.querySelector('.skill-percent');
        
        // Reiniciar la animación
        skillLevel.style.width = '0';
        
        setTimeout(() => {
            skillLevel.style.width = dataLevel + '%';
        }, 200);
        
        // Animar el contador porcentual si existe
        if (skillPercent) {
            let current = 0;
            const target = parseInt(dataLevel);
            const duration = 1500;
            const steps = Math.min(duration / 16, target); // Limitar pasos
            const stepSize = target / steps;
            
            const timer = setInterval(() => {
                current += stepSize;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                skillPercent.textContent = Math.round(current) + '%';
            }, duration / steps);
        }
    }

    // Función para animar contadores de estadísticas
    function animateValueCounter(statItem) {
        const statValue = statItem.querySelector('.stat-value');
        if (!statValue) return;
        
        const target = parseInt(statValue.getAttribute('data-count'));
        let current = 0;
        const duration = 2000;
        const steps = Math.min(duration / 16, target); // Limitar pasos
        const stepSize = target / steps;
        
        const timer = setInterval(() => {
            current += stepSize;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            statValue.textContent = Math.round(current);
        }, duration / steps);
    }

    // También observar elementos específicos dentro de las secciones
    setTimeout(() => {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.style.setProperty('--i', index + 1);
            observer.observe(card);
        });

        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.setProperty('--i', index + 1);
            observer.observe(card);
        });

        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.style.setProperty('--i', index + 1);
            observer.observe(item);
        });
    }, 500);
});