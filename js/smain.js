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

(function() {
    'use strict';

    // ========================================================================
    // CONFIGURACIÓN GLOBAL
    // ========================================================================

    const APP_CONFIG = {
        /** @type {Object} Configuración de animaciones */
        animations: {
            typingDuration: 100,
            numberIncrementSteps: 50,
            mouseRotateIntensity: 20,
            perspectiveValue: 1000,
            throttleLimit: 16,
            crossfadeDuration: 2000,
            defaultVolume: 0.5,
            observerThreshold: 0.3,
            statsThreshold: 0.5
        },
        
        /** @type {Object} Selectores DOM */
        selectors: {
            body: 'body',
            themeToggle: '.theme-toggle i',
            statNumbers: '.stat-number',  // ← Solo una vez
            heroTitleHighlight: '.hero-content h1 span.highlight',
            heroVisual: '.hero-visual',
            statsSection: '.stats-section',
            systemStatus: '.system-status',
            whatsappButton: '.whatsapp-button',
            audioControl: '#audioControl',
            audioElement: '#bgAudio',
            statusText: '.status-text',
            whatsappTooltip: '.whatsapp-tooltip',
            audioIcon: 'i',
            profProgress: '.prof-progress',
            aptitudesCategory: '.aptitudes-category'
        },
        
        /** @type {Object} Clases CSS */
        classes: {
            darkTheme: 'dark-theme',
            lightTheme: 'light-theme',
            faSun: 'fa-sun',
            faMoon: 'fa-moon',
            offline: 'offline',
            playing: 'playing',
            muted: 'muted',
            blocked: 'blocked',
            error: 'error',
            badge: 'badge',
            statusTooltip: 'status-tooltip'
        },
        
        /** @type {Object} Storage keys */
        storage: {
            theme: 'theme',
            audioPreference: 'audio_preference'
        },
        
        /** @type {Object} Números y contactos */
        contacts: {
            whatsapp: '573234737757'
        },
        
        /** @type {Object} Textos por defecto */
        defaults: {
            systemOnline: 'system_online',
            systemOffline: 'system_offline',
            statusTooltip: 'Uptime: 99.9% | Latencia: 23ms',
            whatsappMessage: 'Contáctame',
            whatsappAvailable: '¡Disponible ahora!',
            whatsappOffline: 'Deja tu mensaje',
            audioPlay: 'Reproducir música',
            audioPause: 'Pausar música',
            audioActivate: 'Activar música',
            audioError: 'Error al cargar audio'
        },
        
        /** @type {Object} Logs de depuración */
        debug: {
            enabled: true,
            prefix: '🔧'
        }
    };

    // ========================================================================
    // UTILIDADES
    // ========================================================================

    const Logger = {
        log: (...args) => APP_CONFIG.debug.enabled && console.log(APP_CONFIG.debug.prefix, ...args),
        warn: (...args) => APP_CONFIG.debug.enabled && console.warn('⚠️', ...args),
        error: (...args) => console.error('❌', ...args),
        group: (label) => APP_CONFIG.debug.enabled && console.group(label),
        groupEnd: () => APP_CONFIG.debug.enabled && console.groupEnd()
    };

    const Utils = {
        /**
         * Limpia todas las animaciones activas
         * @param {Object} state - Estado de la aplicación
         */
        cleanupAnimations(state) {
            if (state?.animationFrame) {
                cancelAnimationFrame(state.animationFrame);
                state.animationFrame = null;
            }
            
            if (state?.typingInterval) {
                clearInterval(state.typingInterval);
                state.typingInterval = null;
            }
        },

        /**
         * Extrae número de un string
         * @param {string} str - String con número
         * @returns {number}
         */
        extractNumberFromString: (str) => parseInt(str.replace(/[^0-9]/g, '')) || 0,

        /**
         * Preserva el sufijo del número
         * @param {string} originalText - Texto original
         * @param {number} number - Número procesado
         * @returns {string}
         */
        preserveNumberSuffix: (originalText, number) => {
            const suffix = originalText.replace(/[0-9]/g, '');
            return number + suffix;
        },

        /**
         * Throttle para eventos de alto rendimiento
         * @param {Function} func - Función a throttle
         * @param {number} limit - Límite en ms
         * @returns {Function}
         */
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Debounce para eventos
         * @param {Function} func - Función a debounce
         * @param {number} wait - Tiempo de espera
         * @returns {Function}
         */
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        /**
         * Verifica si es dispositivo móvil
         * @returns {boolean}
         */
        isMobile: () => window.innerWidth <= 768,

        /**
         * Formatea número de teléfono
         * @param {string} phone - Número de teléfono
         * @returns {string}
         */
        formatPhoneNumber: (phone) => phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),

        /**
         * Obtener hora actual
         * @returns {number}
         */
        getCurrentHour: () => new Date().getHours(),

        /**
         * Dispara evento personalizado
         * @param {string} eventName - Nombre del evento
         * @param {Object} detail - Datos del evento
         */
        dispatchEvent: (eventName, detail = {}) => {
            const event = new CustomEvent(eventName, { detail });
            document.dispatchEvent(event);
        },

        /**
         * Guarda en localStorage con manejo de errores
         * @param {string} key - Llave
         * @param {any} value - Valor
         */
        safeStorageSet: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                Logger.warn(`Error guardando ${key}:`, e);
            }
        },

        /**
         * Lee de localStorage con manejo de errores
         * @param {string} key - Llave
         * @param {any} defaultValue - Valor por defecto
         * @returns {any}
         */
        safeStorageGet: (key, defaultValue = null) => {
            try {
                const saved = localStorage.getItem(key);
                return saved ? JSON.parse(saved) : defaultValue;
            } catch (e) {
                Logger.warn(`Error leyendo ${key}:`, e);
                return defaultValue;
            }
        },

        /**
         * Crea un Intersection Observer con configuración estándar
         * @param {Function} callback - Función a ejecutar
         * @param {number} threshold - Umbral de visibilidad
         * @returns {IntersectionObserver}
         */
        createObserver: (callback, threshold = 0.3) => {
            return new IntersectionObserver(callback, { threshold });
        }
    };

    // ========================================================================
    // MÓDULO DE ESTADO GLOBAL
    // ========================================================================

    const AppState = (() => {
        const state = {
            currentTheme: null,
            animationFrame: null,
            typingInterval: null,
            modules: new Map()
        };

        return {
            get: () => state,
            set: (updates) => Object.assign(state, updates),
            registerModule: (name, instance) => state.modules.set(name, instance),
            getModule: (name) => state.modules.get(name),
            cleanup: () => {
                Utils.cleanupAnimations(state);
                state.modules.forEach(module => module.destroy?.());
                state.modules.clear();
            }
        };
    })();

    // ========================================================================
    // MÓDULO BASE (Abstracto)
    // ========================================================================

    class BaseModule {
        constructor(name) {
            this.name = name;
            this.elements = {};
            this.observers = new Map();
        }

        init() {
            this.cacheElements();
            this.setupEventListeners();
            AppState.registerModule(this.name, this);
            Logger.log(`✅ Módulo ${this.name} inicializado`);
        }

        cacheElements() {
            // Implementar en subclases
        }

        setupEventListeners() {
            // Implementar en subclases
        }

        destroy() {
            this.observers.forEach(observer => observer.disconnect());
            this.observers.clear();
        }
    }

    // ========================================================================
    // MÓDULO DE TEMA
    // ========================================================================

    class ThemeManager extends BaseModule {
        constructor() {
            super('theme');
        }

        cacheElements() {
            this.elements = {
                body: document.querySelector(APP_CONFIG.selectors.body),
                toggleIcon: document.querySelector(APP_CONFIG.selectors.themeToggle),
                toggleButton: document.querySelector(APP_CONFIG.selectors.themeToggle)?.parentElement
            };
        }

        loadSavedTheme() {
            const savedTheme = Utils.safeStorageGet(APP_CONFIG.storage.theme, APP_CONFIG.classes.darkTheme);
            const { body, toggleIcon } = this.elements;
            
            if (!body) return;

            body.classList.remove(APP_CONFIG.classes.darkTheme, APP_CONFIG.classes.lightTheme);
            body.classList.add(savedTheme);
            
            this.updateIcon(savedTheme);
            AppState.set({ currentTheme: savedTheme });
        }

        updateIcon(theme) {
            const { toggleIcon } = this.elements;
            if (!toggleIcon) return;

            const isDark = theme === APP_CONFIG.classes.darkTheme;
            toggleIcon.classList.remove(APP_CONFIG.classes.faSun, APP_CONFIG.classes.faMoon);
            toggleIcon.classList.add(isDark ? APP_CONFIG.classes.faSun : APP_CONFIG.classes.faMoon);
        }

        toggle() {
            const { body, toggleIcon } = this.elements;
            if (!body || !toggleIcon) return;

            const isDark = body.classList.contains(APP_CONFIG.classes.darkTheme);
            const newTheme = isDark ? APP_CONFIG.classes.lightTheme : APP_CONFIG.classes.darkTheme;
            
            body.classList.remove(APP_CONFIG.classes.darkTheme, APP_CONFIG.classes.lightTheme);
            body.classList.add(newTheme);
            
            this.updateIcon(newTheme);
            Utils.safeStorageSet(APP_CONFIG.storage.theme, newTheme);
            AppState.set({ currentTheme: newTheme });
            
            Utils.dispatchEvent('themeChanged', { theme: newTheme });
        }

        setupEventListeners() {
            this.elements.toggleButton?.addEventListener('click', () => this.toggle());
        }

        destroy() {
            this.elements.toggleButton?.removeEventListener('click', this.toggle);
            super.destroy();
        }

        init() {
            this.cacheElements();
            this.loadSavedTheme();
            this.setupEventListeners();
            AppState.registerModule(this.name, this);
        }
    }

    // ========================================================================
    // MÓDULO DE ANIMACIONES
    // ========================================================================

    /**
 * ========================================================================
 * MÓDULO DE ANIMACIONES - CORREGIDO CON SECCIONES SEPARADAS
 * ========================================================================
 */

/**
 * ========================================================================
 * MÓDULO DE ANIMACIONES - VERSIÓN CORREGIDA
 * ========================================================================
 */

class AnimationManager extends BaseModule {
    constructor() {
        super('animations');
        // Control estricto de qué elementos ya fueron animados
        this.animatedElements = new WeakSet();
    }

    init() {
        Logger.group('🎬 Inicializando AnimationManager');
        
        // Configurar cada sección por separado
        this.setupHeroStats();      // Sección hero-stats (3+, 3, 2, 1)
        this.setupNumbersSection(); // Sección En Números (6, 25, 800, 300)
        this.setupSkillBars();
        this.setupAptitudesAnimations();
        this.setupTypeWriter();
        this.setupHeroVisualEffects();
        this.setupBackToTop();
        
        super.init();
        Logger.groupEnd();
        
        // Diagnóstico automático
        setTimeout(() => this.diagnoseStats(), 1000);
    }

    /**
     * Configura SOLO las estadísticas del hero (parte superior)
     */
    setupHeroStats() {
        const heroStats = document.querySelectorAll('.hero-stats .stat-number');
        Logger.log('🎯 Hero stats encontradas:', heroStats.length);
        
        heroStats.forEach(stat => {
            // Si ya fue animado, lo ignoramos
            if (this.animatedElements.has(stat)) return;
            
            // Guardar el texto original (ej: "3+", "3", "2", "1")
            const originalText = stat.textContent;
            const targetValue = this.extractNumberFromString(originalText);
            const suffix = originalText.replace(/\d+/g, '');
            
            // IMPORTANTE: No cambiar el texto aquí, solo guardar datos
            stat.dataset.heroOriginal = originalText;
            stat.dataset.heroTarget = targetValue;
            stat.dataset.heroSuffix = suffix;
            
            Logger.log(`Hero stat preparado: ${originalText} → target: ${targetValue}`);
            
            // Observer para cuando sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(stat)) {
                        Logger.log(`🎬 Animando hero stat: ${originalText}`);
                        this.animateHeroNumber(stat);
                        this.animatedElements.add(stat);
                        observer.unobserve(stat);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    }

    /**
     * Configura SOLO la sección "En Números"
     */
    setupNumbersSection() {
        const numbersStats = document.querySelectorAll('.stats-grid .stat-number');
        Logger.log('🔢 Numbers stats encontradas:', numbersStats.length);
        
        numbersStats.forEach(stat => {
            // Si ya fue animado, lo ignoramos
            if (this.animatedElements.has(stat)) return;
            
            // Obtener datos del atributo data-target
            const targetValue = stat.getAttribute('data-target');
            const currentText = stat.textContent;
            
            if (!targetValue) {
                Logger.warn('Stat sin data-target:', stat);
                return;
            }
            
            // Guardar datos
            stat.dataset.numbersTarget = targetValue;
            stat.dataset.numbersOriginal = currentText;
            
            Logger.log(`Number stat preparado: ${currentText} → target: ${targetValue}`);
            
            // Observer para cuando sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(stat)) {
                        Logger.log(`🎬 Animando number stat: ${targetValue}`);
                        this.animateNumbersStat(stat);
                        this.animatedElements.add(stat);
                        observer.unobserve(stat);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    }

    /**
     * Anima las estadísticas del hero
     */
    animateHeroNumber(statElement) {
        const targetValue = parseInt(statElement.dataset.heroTarget) || 0;
        const originalText = statElement.dataset.heroOriginal;
        const suffix = statElement.dataset.heroSuffix || '';
        
        if (targetValue === 0) {
            statElement.textContent = originalText;
            return;
        }

        let currentValue = 0;
        // Hero stats: animación más rápida y directa
        const steps = 20;
        const increment = targetValue / steps;
        
        const animate = () => {
            if (currentValue < targetValue) {
                currentValue += increment;
                if (currentValue > targetValue) currentValue = targetValue;
                
                const displayNumber = Math.floor(currentValue);
                statElement.textContent = displayNumber + suffix;
                
                requestAnimationFrame(animate);
            } else {
                // Al final, mostrar el texto original completo
                statElement.textContent = originalText;
                Logger.log(`✅ Hero stat animado: ${originalText}`);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Anima las estadísticas de la sección "En Números"
     */
    animateNumbersStat(statElement) {
        const targetValue = parseInt(statElement.dataset.numbersTarget) || 0;
        const originalText = statElement.dataset.numbersOriginal;
        
        if (targetValue === 0) {
            statElement.textContent = originalText;
            return;
        }

        let currentValue = 0;
        // Numbers stats: animación más suave y controlada
        const steps = 50;
        const increment = targetValue / steps;
        
        // Flag para evitar animaciones múltiples
        let isAnimating = true;
        
        const animate = () => {
            if (!isAnimating) return;
            
            if (currentValue < targetValue) {
                currentValue += increment;
                if (currentValue > targetValue) currentValue = targetValue;
                
                const displayNumber = Math.floor(currentValue);
                statElement.textContent = displayNumber;
                
                requestAnimationFrame(animate);
            } else {
                // Asegurar que muestra el valor exacto al final
                statElement.textContent = targetValue;
                Logger.log(`✅ Number stat animado: ${targetValue}`);
                isAnimating = false;
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Extrae número de un string (para hero stats)
     */
    extractNumberFromString(str) {
        if (!str) return 0;
        const match = str.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }

    /**
     * DIAGNÓSTICO - Para verificar qué está pasando
     */
    diagnoseStats() {
        console.group('🔍 DIAGNÓSTICO DE ESTADÍSTICAS');
        
        // Hero stats
        const heroStats = document.querySelectorAll('.hero-stats .stat-number');
        console.log('Hero stats:', heroStats.length);
        heroStats.forEach((stat, i) => {
            console.log(`Hero[${i}]:`, {
                texto: stat.textContent,
                original: stat.dataset.heroOriginal,
                target: stat.dataset.heroTarget,
                animada: this.animatedElements.has(stat)
            });
        });
        
        // Numbers stats
        const numbersStats = document.querySelectorAll('.stats-grid .stat-number');
        console.log('Numbers stats:', numbersStats.length);
        numbersStats.forEach((stat, i) => {
            console.log(`Numbers[${i}]:`, {
                texto: stat.textContent,
                target: stat.dataset.numbersTarget,
                original: stat.dataset.numbersOriginal,
                animada: this.animatedElements.has(stat)
            });
        });
        
        console.groupEnd();
    }

    // Limpiar al destruir
    destroy() {
        this.animatedElements = new WeakSet();
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        super.destroy();
    }

    // ========================================================================
    // MÉTODOS EXISTENTES (sin cambios)
    // ========================================================================
    
    setupSkillBars() {
        const skillBars = document.querySelectorAll(APP_CONFIG.selectors.profProgress);
        
        skillBars.forEach(bar => {
            const observer = Utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bar.style.transition = 'width 1s ease-in-out';
                        observer.unobserve(bar);
                    }
                });
            });
            
            this.observers.set(bar, observer);
            observer.observe(bar);
        });
    }

    setupBackToTop() {
        this.backToTopButton = document.getElementById('backToTop');
        if (!this.backToTopButton) return;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            if (window.scrollY > 500) {
                this.backToTopButton.classList.add('visible');
            } else {
                this.backToTopButton.classList.remove('visible');
            }
        }, 100));
        
        this.backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollToTop();
        });
        
        Logger.log('🔝 Botón volver arriba configurado');
    }

    smoothScrollToTop() {
        this.backToTopButton.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.backToTopButton.style.transform = '';
        }, 200);
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupTypeWriter() {
        const titleHighlight = document.querySelector(APP_CONFIG.selectors.heroTitleHighlight);
        if (!titleHighlight) return;

        const observer = Utils.createObserver(
            (entries) => this.handleTitleIntersection(entries, titleHighlight),
            APP_CONFIG.animations.statsThreshold
        );
        
        this.observers.set(titleHighlight, observer);
        observer.observe(titleHighlight);
    }

    handleTitleIntersection(entries, element) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.typeWriterEffect(element);
                this.observers.get(element)?.unobserve(element);
                this.observers.delete(element);
            }
        });
    }

    typeWriterEffect(element) {
        const originalText = element.textContent;
        const textArray = originalText.split('');
        
        element.textContent = '';
        let index = 0;

        if (AppState.get().typingInterval) {
            clearInterval(AppState.get().typingInterval);
        }

        const interval = setInterval(() => {
            if (index < textArray.length) {
                element.textContent += textArray[index];
                index++;
            } else {
                clearInterval(interval);
                AppState.set({ typingInterval: null });
                Utils.dispatchEvent('typingComplete');
            }
        }, APP_CONFIG.animations.typingDuration);

        AppState.set({ typingInterval: interval });
    }

    setupHeroVisualEffects() {
        const heroVisual = document.querySelector(APP_CONFIG.selectors.heroVisual);
        if (!heroVisual) return;

        const handleMouseMove = Utils.throttle(
            (e) => this.handleHeroMouseMove(e, heroVisual),
            APP_CONFIG.animations.throttleLimit
        );

        heroVisual.addEventListener('mousemove', handleMouseMove);
        heroVisual.addEventListener('mouseleave', () => this.resetHeroTransform(heroVisual));
        
        heroVisual.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMouseMove(e.touches[0]);
        });
        
        heroVisual.addEventListener('touchend', () => this.resetHeroTransform(heroVisual));
    }

    handleHeroMouseMove(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / APP_CONFIG.animations.mouseRotateIntensity;
        const angleY = (centerX - x) / APP_CONFIG.animations.mouseRotateIntensity;
        
        const limitedAngleX = Math.max(-15, Math.min(15, angleX));
        const limitedAngleY = Math.max(-15, Math.min(15, angleY));
        
        element.style.transform = `perspective(${APP_CONFIG.animations.perspectiveValue}px) rotateX(${limitedAngleX}deg) rotateY(${limitedAngleY}deg)`;
        element.style.transition = 'transform 0.1s ease';
    }

    resetHeroTransform(element) {
        element.style.transform = `perspective(${APP_CONFIG.animations.perspectiveValue}px) rotateX(0) rotateY(0)`;
        element.style.transition = 'transform 0.5s ease';
    }

    setupAptitudesAnimations() {
        Logger.log('🎨 Configurando animaciones de aptitudes');
        
        const profBars = document.querySelectorAll(APP_CONFIG.selectors.profProgress);
        
        profBars.forEach(bar => {
            const targetWidth = bar.style.width;
            
            bar.style.width = '0';
            bar.style.transition = 'none';
            
            const observer = Utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bar.style.transition = 'width 1s ease-in-out';
                        bar.style.width = targetWidth;
                        observer.unobserve(bar);
                    }
                });
            });
            
            this.observers.set(bar, observer);
            observer.observe(bar);
        });
        
        const categories = document.querySelectorAll(APP_CONFIG.selectors.aptitudesCategory);
        
        categories.forEach((category, index) => {
            const observer = Utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('aptitude-visible');
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, 0.2);
            
            this.observers.set(category, observer);
            observer.observe(category);
        });
    }
}

    // ========================================================================
    // MÓDULO DE SYSTEM STATUS
    // ========================================================================

    class SystemStatus extends BaseModule {
        constructor() {
            super('systemStatus');
            this.statusInterval = null;
        }

        cacheElements() {
            this.elements = {
                container: document.querySelector(APP_CONFIG.selectors.systemStatus),
                statusText: document.querySelector(`${APP_CONFIG.selectors.systemStatus} ${APP_CONFIG.selectors.statusText}`)
            };
        }

        setupStatusUpdates() {
            this.statusInterval = setInterval(() => this.toggleStatus(), 30000);
        }

        setupEventListeners() {
            if (!this.elements.container) return;
            
            this.elements.container.addEventListener('click', () => this.toggleStatus());
            this.elements.container.addEventListener('mouseenter', () => this.showTooltip());
            this.elements.container.addEventListener('mouseleave', () => this.hideTooltip());
        }

        toggleStatus() {
            if (!this.elements.container || !this.elements.statusText) return;

            const isOnline = this.elements.container.classList.contains(APP_CONFIG.classes.offline);
            
            if (isOnline) {
                this.elements.container.classList.remove(APP_CONFIG.classes.offline);
                this.elements.statusText.textContent = APP_CONFIG.defaults.systemOnline;
            } else {
                this.elements.container.classList.add(APP_CONFIG.classes.offline);
                this.elements.statusText.textContent = APP_CONFIG.defaults.systemOffline;
            }

            this.animateClick();
        }

        animateClick() {
            if (!this.elements.container) return;
            
            this.elements.container.style.transform = 'scale(1.05)';
            setTimeout(() => {
                if (this.elements.container) {
                    this.elements.container.style.transform = '';
                }
            }, 200);
        }

        showTooltip() {
            if (document.querySelector(`.${APP_CONFIG.classes.statusTooltip}`)) return;

            const tooltip = document.createElement('div');
            tooltip.className = APP_CONFIG.classes.statusTooltip;
            tooltip.textContent = APP_CONFIG.defaults.statusTooltip;
            
            Object.assign(tooltip.style, {
                position: 'fixed',
                bottom: '60px',
                right: '20px',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid var(--border-color)',
                zIndex: 'calc(var(--z-fixed) - 1)',
                backdropFilter: 'blur(4px)',
                opacity: '0',
                transform: 'translateY(10px)',
                transition: 'var(--transition-base)',
                pointerEvents: 'none'
            });

            document.body.appendChild(tooltip);
            
            tooltip.offsetHeight;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        }

        hideTooltip() {
            const tooltip = document.querySelector(`.${APP_CONFIG.classes.statusTooltip}`);
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
                setTimeout(() => tooltip.remove(), 300);
            }
        }

        setStatus(text) {
            if (this.elements.statusText) {
                this.elements.statusText.textContent = text;
            }
        }

        destroy() {
            if (this.statusInterval) {
                clearInterval(this.statusInterval);
            }
            this.hideTooltip();
            super.destroy();
        }

        init() {
            this.cacheElements();
            if (!this.elements.container) return;
            
            this.setupStatusUpdates();
            this.setupEventListeners();
            AppState.registerModule(this.name, this);
        }
    }

    // ========================================================================
    // MÓDULO DE WHATSAPP
    // ========================================================================

    class WhatsAppManager extends BaseModule {
        constructor() {
            super('whatsapp');
        }

        cacheElements() {
            this.elements = {
                button: document.querySelector(APP_CONFIG.selectors.whatsappButton),
                tooltip: document.querySelector(`${APP_CONFIG.selectors.whatsappButton} ${APP_CONFIG.selectors.whatsappTooltip}`)
            };
        }

        setupEventListeners() {
            if (!this.elements.button) return;
            
            this.elements.button.addEventListener('click', () => this.trackClick());
            this.elements.button.addEventListener('mouseenter', () => this.updateTooltipMessage());
        }

        checkMobile() {
            if (Utils.isMobile()) {
                this.elements.button?.removeAttribute('data-tooltip');
            }
        }

        trackClick() {
            Logger.log(`WhatsApp clicked - ${APP_CONFIG.contacts.whatsapp}`);
            
            this.elements.button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (this.elements.button) {
                    this.elements.button.style.transform = '';
                }
            }, 200);
        }

        updateTooltipMessage() {
            if (!this.elements.tooltip) return;

            const hour = Utils.getCurrentHour();
            let message = APP_CONFIG.defaults.whatsappMessage;
            
            if (hour >= 9 && hour <= 18) {
                message = APP_CONFIG.defaults.whatsappAvailable;
            } else {
                message = APP_CONFIG.defaults.whatsappOffline;
            }
            
            this.elements.tooltip.textContent = message;
        }

        setUnreadCount(count) {
            if (!this.elements.button) return;
            
            let badge = this.elements.button.querySelector(`.${APP_CONFIG.classes.badge}`);
            
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = APP_CONFIG.classes.badge;
                    this.elements.button.appendChild(badge);
                }
                badge.textContent = count > 9 ? '9+' : count;
            } else if (badge) {
                badge.remove();
            }
        }

        destroy() {
            this.elements.button?.removeEventListener('click', this.trackClick);
            this.elements.button?.removeEventListener('mouseenter', this.updateTooltipMessage);
            super.destroy();
        }

        init() {
            this.cacheElements();
            if (!this.elements.button) return;
            
            this.setupEventListeners();
            this.checkMobile();
            AppState.registerModule(this.name, this);
        }
    }

    // ========================================================================
    // MÓDULO DE AUDIO
    // ========================================================================

    class AudioManager extends BaseModule {
        constructor() {
            super('audio');
            this.state = {
                isPlaying: false,
                isMuted: false,
                currentVolume: APP_CONFIG.animations.defaultVolume
            };
        }

        cacheElements() {
            this.elements = {
                audio: document.getElementById('bgAudio'),
                button: document.getElementById('audioControl'),
                icon: document.querySelector(`${APP_CONFIG.selectors.audioControl} ${APP_CONFIG.selectors.audioIcon}`)
            };
        }

        setupEventListeners() {
            if (!this.elements.button || !this.elements.audio) return;
            
            this.elements.button.addEventListener('click', () => this.toggle());
            window.addEventListener('beforeunload', () => this.savePreference());
            document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        }

        setupAudioEvents() {
            if (!this.elements.audio) return;
            
            this.elements.audio.addEventListener('error', (e) => this.handleError(e));
            this.elements.audio.addEventListener('canplay', () => this.handleCanPlay());
            this.elements.audio.addEventListener('play', () => this.handlePlay());
            this.elements.audio.addEventListener('pause', () => this.handlePause());
        }

        toggle() {
            if (this.state.isMuted) {
                this.unmute();
            } else if (this.state.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
            
            this.updateButtonState();
        }

        async play() {
            try {
                this.elements.audio.volume = this.state.currentVolume;
                await this.elements.audio.play();
                
                this.state.isPlaying = true;
                this.state.isMuted = false;
                
                Utils.dispatchEvent('audioStateChange', { 
                    state: 'audioStarted',
                    ...this.state 
                });
            } catch (error) {
                Logger.warn('Reproducción automática bloqueada:', error);
                this.handlePlaybackError();
            }
        }

        pause() {
            this.elements.audio.pause();
            this.state.isPlaying = false;
            this.state.isMuted = false;
            Utils.dispatchEvent('audioStateChange', { state: 'audioPaused', ...this.state });
        }

        mute() {
            this.elements.audio.pause();
            this.state.isPlaying = false;
            this.state.isMuted = true;
            Utils.dispatchEvent('audioStateChange', { state: 'audioMuted', ...this.state });
        }

        unmute() {
            this.play();
        }

        handlePlaybackError() {
            this.elements.button.classList.add(APP_CONFIG.classes.blocked);
            
            const enableAudio = () => {
                this.play();
                this.elements.button.classList.remove(APP_CONFIG.classes.blocked);
                document.removeEventListener('click', enableAudio);
            };
            
            document.addEventListener('click', enableAudio, { once: true });
        }

        handleError(e) {
            Logger.error('Error cargando audio:', e);
            this.elements.button.classList.add(APP_CONFIG.classes.error);
            this.elements.button.setAttribute('aria-label', APP_CONFIG.defaults.audioError);
        }

        handleCanPlay() {
            Logger.log('Audio listo para reproducir');
        }

        handlePlay() {
            Logger.log('Audio reproduciendo');
        }

        handlePause() {
            Logger.log('Audio pausado');
        }

        updateButtonState() {
            this.elements.button.classList.remove(
                APP_CONFIG.classes.playing,
                APP_CONFIG.classes.muted,
                APP_CONFIG.classes.blocked
            );
            
            if (this.state.isMuted) {
                this.elements.button.classList.add(APP_CONFIG.classes.muted);
                this.elements.button.setAttribute('aria-label', APP_CONFIG.defaults.audioActivate);
            } else if (this.state.isPlaying) {
                this.elements.button.classList.add(APP_CONFIG.classes.playing);
                this.elements.button.setAttribute('aria-label', APP_CONFIG.defaults.audioPause);
            } else {
                this.elements.button.setAttribute('aria-label', APP_CONFIG.defaults.audioPlay);
            }
        }

        loadPreference() {
            const saved = Utils.safeStorageGet(APP_CONFIG.storage.audioPreference);
            
            if (saved?.wasPlaying) {
                document.addEventListener('click', () => this.play(), { once: true });
            }
        }

        savePreference() {
            Utils.safeStorageSet(APP_CONFIG.storage.audioPreference, {
                wasPlaying: this.state.isPlaying,
                timestamp: Date.now()
            });
        }

        handleVisibilityChange() {
            if (!this.elements.audio) return;
            
            if (document.hidden && this.state.isPlaying) {
                this.elements.audio.volume = 0.1;
            } else if (!document.hidden && this.state.isPlaying) {
                this.elements.audio.volume = this.state.currentVolume;
            }
        }

        changeTrack(src) {
            if (!src || !this.elements.audio) return;
            
            const wasPlaying = this.state.isPlaying;
            
            if (APP_CONFIG.animations.crossfadeEnabled) {
                this.crossfadeTo(src);
            } else {
                this.elements.audio.src = src;
                this.elements.audio.load();
                if (wasPlaying) this.play();
            }
        }

        crossfadeTo(src) {
            if (!this.elements.audio) return;
            
            const currentVolume = this.elements.audio.volume;
            
            const fadeOut = setInterval(() => {
                if (this.elements.audio.volume > 0.05) {
                    this.elements.audio.volume -= 0.05;
                } else {
                    clearInterval(fadeOut);
                    this.elements.audio.src = src;
                    this.elements.audio.load();
                    this.elements.audio.volume = 0;
                    this.play();
                    
                    const fadeIn = setInterval(() => {
                        if (this.elements.audio.volume < currentVolume) {
                            this.elements.audio.volume += 0.05;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 100);
                }
            }, 100);
        }

        destroy() {
            this.savePreference();
            this.elements.button?.removeEventListener('click', this.toggle);
            window.removeEventListener('beforeunload', this.savePreference);
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            super.destroy();
        }

        /**
 * Configura el botón de volver arriba
 */
setupBackToTop() {
    this.backToTopButton = document.getElementById('backToTop');
    if (!this.backToTopButton) return;
    
    // Mostrar/ocultar según scroll
    window.addEventListener('scroll', Utils.throttle(() => {
        if (window.scrollY > 500) {
            this.backToTopButton.classList.add('visible');
        } else {
            this.backToTopButton.classList.remove('visible');
        }
    }, 100));
    
    // Click para volver arriba con animación suave
    this.backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.smoothScrollToTop();
    });
    
    Logger.log('🔝 Botón volver arriba configurado');
}

/**
 * Scroll suave hacia arriba
 */
smoothScrollToTop() {
    // Animación de salida del botón
    this.backToTopButton.style.transform = 'scale(0.8)';
    setTimeout(() => {
        this.backToTopButton.style.transform = '';
    }, 200);
    
    // Scroll suave
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

init() {
    Logger.group('🎬 Inicializando AnimationManager');
    
    this.setupStatNumbers();
    this.setupStatsSection();
    this.setupSkillBars();
    this.setupAptitudesAnimations();
    this.setupTypeWriter();
    this.setupHeroVisualEffects();
    this.setupBackToTop();  // ← NUEVA LÍNEA
    
    super.init();
    Logger.groupEnd();
}

        init() {
            this.cacheElements();
            if (!this.elements.audio || !this.elements.button) return;
            
            this.loadPreference();
            this.setupEventListeners();
            this.setupAudioEvents();
            AppState.registerModule(this.name, this);
        }
    }

    // ========================================================================
    // MÓDULO DE ANALÍTICAS
    // ========================================================================

    class AnalyticsManager extends BaseModule {
        constructor() {
            super('analytics');
        }

        setupEventListeners() {
            document.addEventListener('themeChanged', (e) => this.trackThemeChange(e));
            document.addEventListener('typingComplete', () => this.trackTypingComplete());
            document.addEventListener('audioStateChange', (e) => this.trackAudioState(e));
        }

        trackThemeChange(e) {
            Logger.log(`Theme changed to: ${e.detail.theme}`);
            
            if (window.gtag) {
                window.gtag('event', 'theme_change', { theme: e.detail.theme });
            }
        }

        trackTypingComplete() {
            Logger.log('Typing animation completed');
        }

        trackAudioState(e) {
            if (window.gtag) {
                window.gtag('event', 'audio_control', {
                    action: e.detail.state,
                    playing: e.detail.isPlaying
                });
            }
        }

        destroy() {
            document.removeEventListener('themeChanged', this.trackThemeChange);
            document.removeEventListener('typingComplete', this.trackTypingComplete);
            document.removeEventListener('audioStateChange', this.trackAudioState);
            super.destroy();
        }
    }

    // ========================================================================
    // MÓDULO DE OPTIMIZACIÓN DE RENDIMIENTO
    // ========================================================================

    class PerformanceOptimizer extends BaseModule {
        constructor() {
            super('performance');
            this.motionQuery = null;
        }

        checkReducedMotion() {
            this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (this.motionQuery.matches) {
                this.disableAnimations();
            }
            
            this.motionQuery.addEventListener('change', (e) => {
                if (e.matches) {
                    this.disableAnimations();
                } else {
                    this.enableAnimations();
                }
            });
        }

        disableAnimations() {
            document.documentElement.style.setProperty('--transition-base', '0s');
            document.documentElement.style.setProperty('--transition-smooth', '0s');
            Utils.cleanupAnimations(AppState.get());
        }

        enableAnimations() {
            document.documentElement.style.setProperty('--transition-base', '0.2s ease');
            document.documentElement.style.setProperty('--transition-smooth', '0.3s ease');
        }

        optimizeAnimations() {
            const heroVisual = document.querySelector(APP_CONFIG.selectors.heroVisual);
            if (heroVisual) {
                heroVisual.style.willChange = 'transform';
                
                setTimeout(() => {
                    heroVisual.style.willChange = 'auto';
                }, 1000);
            }
        }

        destroy() {
            this.motionQuery?.removeEventListener('change', this.checkReducedMotion);
            super.destroy();
        }

        init() {
            this.checkReducedMotion();
            this.optimizeAnimations();
            AppState.registerModule(this.name, this);
        }
    }

    // ========================================================================
    // INICIALIZADOR PRINCIPAL
    // ========================================================================

    const App = {
        modules: [],

        init() {
            Logger.group('🚀 Inicializando aplicación');
            
            AppState.cleanup();
            
            this.modules = [
                new ThemeManager(),
                new AnimationManager(),
                new SystemStatus(),
                new WhatsAppManager(),
                new AudioManager(),
                new AnalyticsManager(),
                new PerformanceOptimizer()
            ];
            
            this.modules.forEach(module => module.init());
            
            Logger.log('✅ Aplicación inicializada correctamente');
            Logger.groupEnd();
        },

        restart() {
            this.destroy();
            this.init();
        },

        destroy() {
            Logger.group('🧹 Limpiando aplicación');
            AppState.cleanup();
            Logger.log('✅ Aplicación limpiada');
            Logger.groupEnd();
        },

        getModule(name) {
            return this.modules.find(m => m.name === name);
        }
    };

    // ========================================================================
    // INICIALIZACIÓN
    // ========================================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

    window.addEventListener('beforeunload', () => App.destroy());

    window.addEventListener('popstate', () => {
        App.destroy();
        App.init();
    });

    // ========================================================================
    // EXPORTS
    // ========================================================================

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { App, AppState, APP_CONFIG };
    }

    window.PortfolioApp = App;

})();

// ========================================================================
// DIAGNÓSTICO - Agregar temporalmente
// ========================================================================

setTimeout(() => {
    console.group('🔍 DIAGNÓSTICO DE APTITUDES');
    
    // Verificar elementos
    const categories = document.querySelectorAll('.aptitudes-category');
    console.log('Categorías encontradas:', categories.length);
    
    categories.forEach((cat, i) => {
        console.log(`Categoría ${i}:`, {
            clases: cat.className,
            estilosInline: cat.style.cssText,
            opacity: window.getComputedStyle(cat).opacity,
            transform: window.getComputedStyle(cat).transform
        });
    });
    
    // Verificar porcentajes
    const percentages = document.querySelectorAll('.apt-percent');
    console.log('Porcentajes encontrados:', percentages.length);
    
    percentages.forEach((p, i) => {
        console.log(`Porcentaje ${i}:`, {
            texto: p.textContent,
            clases: p.className,
            display: window.getComputedStyle(p).display
        });
    });
    
    console.groupEnd();
}, 2000);