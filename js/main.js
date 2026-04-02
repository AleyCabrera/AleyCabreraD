/**
 * ========================================================================
 * PORTFOLIO APPLICATION - MAIN ENTRY POINT
 * ========================================================================
 * @version 2.0.0
 * @author Aley Cabrera
 * @description Aplicación principal del portafolio con gestión de temas,
 *              animaciones, audio, sistema de estado y WhatsApp
 * ========================================================================
 */

// js/main.js - VERSIÓN FUNCIONAL

(function() {
    'use strict';
    
    console.log('🚀 Inicializando aplicación...');
    
    // ============================================
    // CONFIGURACIÓN
    // ============================================
    
    const CONFIG = {
        debug: true,
        typingDuration: 100,
        throttleLimit: 16,
        defaultVolume: 0.5
    };
    
    // ============================================
    // FUNCIÓN PRINCIPAL - DOM CONTENT LOADED
    // ============================================
    
    function init() {
        console.log('📦 DOM cargado, iniciando componentes...');
        
        // 1. Toggle Theme
        initThemeToggle();
        
        // 2. Menú Hamburguesa
        initHamburgerMenu();
        
        // 3. Animación de números (Hero stats: 3+, 3, 2, 1)
        initHeroStats();
        
        // 4. Animación de números (Sección En Números)
        initNumbersStats();
        
        // 5. Animación de barras de habilidades
        initSkillBars();
        
        // 6. Animación de categorías de aptitudes
        initAptitudesCategories();
        
        // 7. Efecto de escritura en título
        initTypeWriter();
        
        // 8. Efecto 3D en Hero Visual
        initHeroVisual3D();
        
        // 9. Botón volver arriba
        initBackToTop();
        
        // 10. Cuadrados flotantes (logo)
        initCuadradosFlotantes();
        
        // 11. WhatsApp Button con tooltip dinámico
        initWhatsAppButton();
        
        // 12. Audio Control
        initAudioControl();
        
        // 13. System Status dinámico
        initSystemStatus();
        
        console.log('✅ Todos los componentes inicializados');
    }
    
    // ============================================
    // 1. TOGGLE THEME (CORREGIDO)
    // ============================================
    
    function initThemeToggle() {
        // Crear función global para que funcione el onclick del HTML
        window.toggleTheme = function() {
            const body = document.body;
            const themeIcon = document.querySelector('.theme-toggle i');
            
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                localStorage.setItem('theme', 'light-theme');
                console.log('🌞 Cambiado a tema claro');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', 'dark-theme');
                console.log('🌙 Cambiado a tema oscuro');
            }
        };
        
        // Cargar tema guardado
        const savedTheme = localStorage.getItem('theme');
        const body = document.body;
        const themeIcon = document.querySelector('.theme-toggle i');
        
        if (savedTheme === 'light-theme') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
        
        console.log('✅ Theme toggle inicializado');
    }
    
// ============================================
// 2. MENÚ HAMBURGUESA - VERSIÓN CORREGIDA
// Basada en el código que funciona
// ============================================

function initHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuToggle || !navLinks) {
        console.warn('Menú hamburguesa: elementos no encontrados');
        return;
    }
    
    // Función para toggle del menú
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
    
    // Event listener para el botón hamburguesa
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Smooth scroll + cerrar menú para los enlaces
    const links = navLinks.querySelectorAll('a');
    links.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Verificar si es un enlace interno (empieza con #)
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); // Prevenir el salto brusco
                    
                    // Cerrar el menú primero
                    closeMenu();
                    
                    // Hacer smooth scroll después de cerrar el menú
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Opcional: Actualizar la URL sin recargar
                        history.pushState(null, null, targetId);
                        console.log(`📍 Navegando a: ${targetId}`);
                    }, 100);
                }
            } else if (targetId && !targetId.startsWith('#')) {
                // Para enlaces externos, solo cerrar menú
                closeMenu();
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnHamburger = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Cerrar menú al redimensionar la ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    console.log('✅ Menú hamburguesa inicializado correctamente');
}
    
    // ============================================
    // 3. HERO STATS (3+, 3, 2, 1)
    // ============================================
    
    function initHeroStats() {
        const stats = document.querySelectorAll('.hero-stats .stat-number');
        console.log(`🎯 Hero stats encontradas: ${stats.length}`);
        
        if (stats.length === 0) return;
        
        const animated = new WeakSet();
        
        stats.forEach(stat => {
            const originalText = stat.textContent;
            const match = originalText.match(/(\d+)(\+?)/);
            const targetValue = match ? parseInt(match[1]) : 0;
            const hasPlus = match ? match[2] === '+' : false;
            const suffix = originalText.replace(/[\d+]/g, '');
            
            stat.dataset.original = originalText;
            stat.dataset.target = targetValue;
            stat.dataset.suffix = suffix;
            stat.dataset.hasPlus = hasPlus;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated.has(stat)) {
                        animateHeroNumber(stat);
                        animated.add(stat);
                        observer.unobserve(stat);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
        
        function animateHeroNumber(stat) {
            const target = parseInt(stat.dataset.target) || 0;
            const original = stat.dataset.original;
            const suffix = stat.dataset.suffix || '';
            const hasPlus = stat.dataset.hasPlus === 'true';
            
            if (target === 0) {
                stat.textContent = original;
                return;
            }
            
            let current = 0;
            const steps = 25;
            const increment = target / steps;
            
            function update() {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    
                    let display = Math.floor(current);
                    let text = display + suffix;
                    
                    if (hasPlus && display === target) {
                        text = display + '+';
                    }
                    
                    stat.textContent = text;
                    requestAnimationFrame(update);
                } else {
                    stat.textContent = original;
                    console.log(`✅ Hero stat animado: ${original}`);
                }
            }
            
            requestAnimationFrame(update);
        }
        
        console.log('✅ Hero stats inicializadas');
    }
    
    // ============================================
    // 4. NUMBERS STATS (Sección En Números)
    // ============================================
    
    function initNumbersStats() {
        const stats = document.querySelectorAll('.stats-grid .stat-number');
        console.log(`🔢 Numbers stats encontradas: ${stats.length}`);
        
        if (stats.length === 0) return;
        
        const animated = new WeakSet();
        
        stats.forEach(stat => {
            const targetValue = stat.getAttribute('data-target');
            if (!targetValue) return;
            
            stat.dataset.target = targetValue;
            stat.dataset.original = stat.textContent;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated.has(stat)) {
                        animateNumberStat(stat);
                        animated.add(stat);
                        observer.unobserve(stat);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
        
        function animateNumberStat(stat) {
            const target = parseInt(stat.dataset.target) || 0;
            if (target === 0) return;
            
            let current = 0;
            const steps = 60;
            const increment = target / steps;
            let animating = true;
            
            function update() {
                if (!animating) return;
                
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    stat.textContent = target;
                    animating = false;
                }
            }
            
            requestAnimationFrame(update);
        }
        
        console.log('✅ Numbers stats inicializadas');
    }
    
    // ============================================
    // 5. SKILL BARS (Barras de habilidades)
    // ============================================
    
    function initSkillBars() {
        const bars = document.querySelectorAll('.prof-progress');
        console.log(`📊 Skill bars encontradas: ${bars.length}`);
        
        if (bars.length === 0) return;
        
        bars.forEach(bar => {
            const targetWidth = bar.style.width;
            if (!targetWidth) return;
            
            bar.style.width = '0';
            bar.style.transition = 'none';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                        bar.style.width = targetWidth;
                        observer.unobserve(bar);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(bar);
        });
        
        console.log('✅ Skill bars inicializadas');
    }
    
    // ============================================
    // 6. APTITUDES CATEGORIES
    // ============================================
    
    function initAptitudesCategories() {
        const categories = document.querySelectorAll('.aptitudes-category');
        console.log(`🎨 Aptitudes categories encontradas: ${categories.length}`);
        
        if (categories.length === 0) return;
        
        categories.forEach((category, index) => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(category);
        });
        
        // También animar los items individuales
        const listItems = document.querySelectorAll('.aptitudes-list li');
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-10px)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, index * 50);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(item);
        });
        
        console.log('✅ Aptitudes categories inicializadas');
    }
    
    // ============================================
    // 7. TYPEWRITER EFFECT
    // ============================================
    
    function initTypeWriter() {
        const element = document.querySelector('.hero-content h1 span.highlight');
        if (!element) {
            console.warn('Typewriter: elemento no encontrado');
            return;
        }
        
        const originalText = element.textContent;
        element.dataset.original = originalText;
        element.textContent = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriterEffect(element);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
        
        function typeWriterEffect(el) {
            const text = el.dataset.original;
            if (!text) return;
            
            const chars = text.split('');
            let index = 0;
            
            const interval = setInterval(() => {
                if (index < chars.length) {
                    el.textContent += chars[index];
                    index++;
                } else {
                    clearInterval(interval);
                    console.log('✅ Typewriter completado');
                }
            }, CONFIG.typingDuration);
        }
        
        console.log('✅ Typewriter inicializado');
    }
    
    // ============================================
    // 8. HERO VISUAL 3D
    // ============================================
    
    function initHeroVisual3D() {
        const heroVisual = document.querySelector('.hero-visual');
        if (!heroVisual) return;
        
        let isMoving = false;
        
        function handleMouseMove(e) {
            if (isMoving) return;
            isMoving = true;
            
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            let angleX = (y - centerY) / 20;
            let angleY = (centerX - x) / 20;
            
            angleX = Math.max(-12, Math.min(12, angleX));
            angleY = Math.max(-12, Math.min(12, angleY));
            
            heroVisual.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            heroVisual.style.transition = 'transform 0.1s ease-out';
            
            setTimeout(() => { isMoving = false; }, 16);
        }
        
        function resetTransform() {
            heroVisual.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            heroVisual.style.transition = 'transform 0.5s ease-out';
        }
        
        heroVisual.addEventListener('mousemove', handleMouseMove);
        heroVisual.addEventListener('mouseleave', resetTransform);
        
        console.log('✨ Hero visual 3D inicializado');
    }
    
    // ============================================
    // 9. BACK TO TOP BUTTON
    // ============================================
    
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 500) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            backToTop.style.transform = 'scale(0.8)';
            setTimeout(() => { backToTop.style.transform = ''; }, 200);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        console.log('🔝 Back to top inicializado');
    }
    
    // ============================================
    // 10. CUADRADOS FLOTANTES
    // ============================================
    
    function initCuadradosFlotantes() {
        const cuadrados = document.querySelectorAll('.cuad');
        console.log(`🎨 Cuadrados flotantes encontrados: ${cuadrados.length}`);
        
        if (cuadrados.length === 0) return;
        
        // Encender cuadrados secuencialmente
        cuadrados.forEach((cuad, index) => {
            setTimeout(() => {
                cuad.classList.add('encendido');
            }, index * 500);
        });
        
        // Efecto de brillo aleatorio
        setInterval(() => {
            const randomIndex = Math.floor(Math.random() * cuadrados.length);
            const cuad = cuadrados[randomIndex];
            cuad.style.transform = 'scale(1.05)';
            setTimeout(() => {
                if (cuad) cuad.style.transform = '';
            }, 200);
        }, 8000);
        
        // Click en cuadrados
        cuadrados.forEach((cuad, index) => {
            cuad.addEventListener('click', () => {
                cuad.style.transform = 'scale(0.9)';
                setTimeout(() => { cuad.style.transform = ''; }, 150);
                console.log(`Cuadrado ${index + 1} clickeado`);
            });
        });
        
        console.log('✅ Cuadrados flotantes inicializados');
    }
    
    // ============================================
    // 11. WHATSAPP BUTTON
    // ============================================
    
    function initWhatsAppButton() {
        const whatsappBtn = document.querySelector('.whatsapp-button');
        if (!whatsappBtn) return;
        
        const tooltip = whatsappBtn.querySelector('.whatsapp-tooltip');
        
        function updateTooltip() {
            if (!tooltip) return;
            
            const hour = new Date().getHours();
            let message = 'Contáctame';
            
            if (hour >= 9 && hour <= 18) {
                message = '🟢 ¡Disponible ahora! 💬';
                tooltip.style.borderColor = '#25D366';
                tooltip.style.color = '#25D366';
            } else {
                message = '⏰ Deja tu mensaje 💫';
                tooltip.style.borderColor = '#64748b';
                tooltip.style.color = '#64748b';
            }
            
            tooltip.textContent = message;
        }
        
        updateTooltip();
        setInterval(updateTooltip, 30000);
        
        whatsappBtn.addEventListener('click', () => {
            console.log('WhatsApp clickeado');
            whatsappBtn.style.transform = 'scale(0.95)';
            setTimeout(() => { whatsappBtn.style.transform = ''; }, 150);
        });
        
        console.log('✅ WhatsApp button inicializado');
    }
    
    // ============================================
    // 12. AUDIO CONTROL
    // ============================================
    
    function initAudioControl() {
        const audio = document.getElementById('bgAudio');
        const audioBtn = document.getElementById('audioControl');
        
        if (!audio || !audioBtn) {
            console.warn('Audio control: elementos no encontrados');
            return;
        }
        
        let isPlaying = false;
        
        function updateButton() {
            if (isPlaying) {
                audioBtn.classList.add('playing');
                audioBtn.setAttribute('aria-label', 'Pausar música');
            } else {
                audioBtn.classList.remove('playing');
                audioBtn.setAttribute('aria-label', 'Reproducir música');
            }
        }
        
        audioBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
            } else {
                audio.play().catch(e => console.log('Autoplay bloqueado:', e));
                isPlaying = true;
            }
            updateButton();
        });
        
        audio.volume = 0.5;
        audio.loop = true;
        
        console.log('✅ Audio control inicializado');
    }
    
    // ============================================
    // 13. SYSTEM STATUS DINÁMICO
    // ============================================
    
    function initSystemStatus() {
        const statusDiv = document.querySelector('.system-status');
        const statusText = document.querySelector('.status-text');
        
        if (!statusDiv || !statusText) return;
        
        const statusMessages = [
            'system_online',
            'monitoring_network',
            'scanning_ports',
            'security_active',
            'firewall_engaged'
        ];
        
        let index = 0;
        
        setInterval(() => {
            index = (index + 1) % statusMessages.length;
            statusText.textContent = statusMessages[index];
            
            // Efecto de typing
            statusText.classList.add('typing');
            setTimeout(() => {
                statusText.classList.remove('typing');
            }, 500);
        }, 8000);
        
        statusDiv.addEventListener('click', () => {
            const isOffline = statusDiv.classList.contains('offline');
            if (isOffline) {
                statusDiv.classList.remove('offline');
                statusText.textContent = 'system_online';
            } else {
                statusDiv.classList.add('offline');
                statusText.textContent = 'system_offline';
            }
        });
        
        console.log('📡 System status inicializado');
    }
    
    // ============================================
    // INICIAR CUANDO EL DOM ESTÉ LISTO
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();