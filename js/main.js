/**
 * ===================================================
 * PORTFOLIO APPLICATION - MAIN ENTRY POINT
 * ===================================================
 * @version 1.0.0
 * @description Aplicación principal del portafolio con gestión de temas,
 *              animaciones, audio, sistema de estado y WhatsApp
 * ===================================================
 */

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

const APP_CONFIG = {
    /** @type {Object} Configuración de animaciones */
    animations: {
        typingDuration: 100,        // ms por carácter
        numberIncrementSteps: 50,    // Pasos para contadores
        mouseRotateIntensity: 20,    // Intensidad de rotación 3D
        perspectiveValue: 1000,      // Valor de perspectiva
        throttleLimit: 16,           // Límite para throttle (60fps)
        crossfadeDuration: 2000,     // Duración de crossfade de audio
        defaultVolume: 0.5            // Volumen por defecto
    },
    
    /** @type {Object} Selectores DOM */
    selectors: {
        body: 'body',
        themeToggle: '.theme-toggle i',
        statNumbers: '.stat-number',
        heroTitleHighlight: '.hero-content h1 span.highlight',
        heroVisual: '.hero-visual',
        systemStatus: '.system-status',
        whatsappButton: '.whatsapp-button',
        audioControl: '#audioControl',
        audioElement: '#bgAudio',
        statusText: '.status-text',
        whatsappTooltip: '.whatsapp-tooltip',
        audioIcon: 'i'
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
    }
};

// ============================================================================
// UTILIDADES
// ============================================================================

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
    extractNumberFromString(str) {
        return parseInt(str.replace(/[^0-9]/g, '')) || 0;
    },

    /**
     * Preserva el sufijo del número
     * @param {string} originalText - Texto original
     * @param {number} number - Número procesado
     * @returns {string}
     */
    preserveNumberSuffix(originalText, number) {
        const suffix = originalText.replace(/[0-9]/g, '');
        return number + suffix;
    },

    /**
     * Throttle para eventos de alto rendimiento
     * @param {Function} func - Función a throttle
     * @param {number} limit - Límite en ms
     * @returns {Function}
     */
    throttle(func, limit) {
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
    debounce(func, wait) {
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
    isMobile() {
        return window.innerWidth <= 768;
    },

    /**
     * Formatea número de teléfono
     * @param {string} phone - Número de teléfono
     * @returns {string}
     */
    formatPhoneNumber(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    },

    /**
     * Obtener hora actual
     * @returns {number}
     */
    getCurrentHour() {
        return new Date().getHours();
    },

    /**
     * Dispara evento personalizado
     * @param {string} eventName - Nombre del evento
     * @param {Object} detail - Datos del evento
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    },

    /**
     * Guarda en localStorage con manejo de errores
     * @param {string} key - Llave
     * @param {any} value - Valor
     */
    safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`Error guardando ${key}:`, e);
        }
    },

    /**
     * Lee de localStorage con manejo de errores
     * @param {string} key - Llave
     * @param {any} defaultValue - Valor por defecto
     * @returns {any}
     */
    safeStorageGet(key, defaultValue = null) {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            console.warn(`Error leyendo ${key}:`, e);
            return defaultValue;
        }
    }
};

// ============================================================================
// MÓDULO DE ESTADO GLOBAL
// ============================================================================

const AppState = {
    /** @type {Object} Estado de la aplicación */
    state: {
        currentTheme: null,
        animationFrame: null,
        typingInterval: null,
        modules: new Map()
    },

    /**
     * Obtiene el estado
     * @returns {Object}
     */
    get() {
        return this.state;
    },

    /**
     * Actualiza el estado
     * @param {Object} updates - Actualizaciones
     */
    set(updates) {
        Object.assign(this.state, updates);
    },

    /**
     * Registra un módulo
     * @param {string} name - Nombre del módulo
     * @param {Object} instance - Instancia del módulo
     */
    registerModule(name, instance) {
        this.state.modules.set(name, instance);
    },

    /**
     * Obtiene un módulo registrado
     * @param {string} name - Nombre del módulo
     * @returns {Object|undefined}
     */
    getModule(name) {
        return this.state.modules.get(name);
    },

    /**
     * Limpia el estado
     */
    cleanup() {
        Utils.cleanupAnimations(this.state);
        this.state.modules.forEach(module => module.destroy?.());
        this.state.modules.clear();
    }
};

// ============================================================================
// MÓDULO DE TEMA
// ============================================================================

const ThemeManager = {
    /** @type {Object} Referencias DOM */
    elements: {},

    /**
     * Inicializa el módulo
     */
    init() {
        this.cacheElements();
        this.loadSavedTheme();
        this.setupListeners();
        AppState.registerModule('theme', this);
    },

    /**
     * Cachea elementos DOM
     */
    cacheElements() {
        this.elements = {
            body: document.querySelector(APP_CONFIG.selectors.body),
            toggleIcon: document.querySelector(APP_CONFIG.selectors.themeToggle),
            toggleButton: document.querySelector(APP_CONFIG.selectors.themeToggle)?.parentElement
        };
    },

    /**
     * Carga tema guardado
     */
    loadSavedTheme() {
        const savedTheme = Utils.safeStorageGet(APP_CONFIG.storage.theme, APP_CONFIG.classes.darkTheme);
        const { body, toggleIcon } = this.elements;
        
        if (!body) return;

        body.classList.remove(APP_CONFIG.classes.darkTheme, APP_CONFIG.classes.lightTheme);
        body.classList.add(savedTheme);
        
        this.updateIcon(savedTheme);
        AppState.set({ currentTheme: savedTheme });
    },

    /**
     * Actualiza icono del tema
     * @param {string} theme - Tema actual
     */
    updateIcon(theme) {
        const { toggleIcon } = this.elements;
        if (!toggleIcon) return;

        const isDark = theme === APP_CONFIG.classes.darkTheme;
        toggleIcon.classList.remove(APP_CONFIG.classes.faSun, APP_CONFIG.classes.faMoon);
        toggleIcon.classList.add(isDark ? APP_CONFIG.classes.faSun : APP_CONFIG.classes.faMoon);
    },

    /**
     * Cambia entre temas
     */
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
    },

    /**
     * Configura listeners
     */
    setupListeners() {
        this.elements.toggleButton?.addEventListener('click', () => this.toggle());
    },

    /**
     * Limpia el módulo
     */
    destroy() {
        this.elements.toggleButton?.removeEventListener('click', this.toggle);
    }
};

// ============================================================================
// MÓDULO DE ANIMACIONES
// ============================================================================

const AnimationManager = {
    /** @type {Object} Observadores */
    observers: new Map(),

    /**
     * Inicializa el módulo
     */
    init() {
        this.setupStatNumbers();
        this.setupTypeWriter();
        this.setupHeroVisualEffects();
        AppState.registerModule('animations', this);
    },

    /**
     * Configura animación de contadores
     */
    setupStatNumbers() {
        const stats = document.querySelectorAll(APP_CONFIG.selectors.statNumbers);
        
        stats.forEach(stat => {
            const observer = new IntersectionObserver(
                (entries) => this.handleStatIntersection(entries, stat),
                { threshold: 0.5 }
            );
            
            this.observers.set(stat, observer);
            observer.observe(stat);
        });
    },

    /**
     * Maneja intersección de estadísticas
     * @param {Array} entries - Entradas del observer
     * @param {Element} stat - Elemento de estadística
     */
    handleStatIntersection(entries, stat) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateNumber(stat);
                this.observers.get(stat)?.unobserve(stat);
                this.observers.delete(stat);
            }
        });
    },

    /**
     * Anima un contador
     * @param {Element} statElement - Elemento a animar
     */
    animateNumber(statElement) {
        const originalText = statElement.textContent;
        const targetValue = Utils.extractNumberFromString(originalText);
        
        if (targetValue === 0) return;

        let currentValue = 0;
        const increment = targetValue / APP_CONFIG.animations.numberIncrementSteps;

        const updateNumber = () => {
            if (currentValue < targetValue) {
                currentValue += increment;
                if (currentValue > targetValue) currentValue = targetValue;
                
                const displayNumber = Math.floor(currentValue);
                statElement.textContent = Utils.preserveNumberSuffix(originalText, displayNumber);
                
                AppState.set({ animationFrame: requestAnimationFrame(updateNumber) });
            } else {
                statElement.textContent = originalText;
                AppState.set({ animationFrame: null });
            }
        };

        AppState.set({ animationFrame: requestAnimationFrame(updateNumber) });
    },

    /**
     * Configura efecto de máquina de escribir
     */
    setupTypeWriter() {
        const titleHighlight = document.querySelector(APP_CONFIG.selectors.heroTitleHighlight);
        if (!titleHighlight) return;

        const observer = new IntersectionObserver(
            (entries) => this.handleTitleIntersection(entries, titleHighlight),
            { threshold: 0.5 }
        );
        
        observer.observe(titleHighlight);
    },

    /**
     * Maneja intersección del título
     * @param {Array} entries - Entradas del observer
     * @param {Element} element - Elemento del título
     */
    handleTitleIntersection(entries, element) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.typeWriterEffect(element);
            }
        });
    },

    /**
     * Efecto de máquina de escribir
     * @param {Element} element - Elemento a animar
     */
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
    },

    /**
     * Configura efectos de movimiento en hero visual
     */
    setupHeroVisualEffects() {
        const heroVisual = document.querySelector(APP_CONFIG.selectors.heroVisual);
        if (!heroVisual) return;

        const handleMouseMove = Utils.throttle(
            (e) => this.handleHeroMouseMove(e, heroVisual),
            APP_CONFIG.animations.throttleLimit
        );

        heroVisual.addEventListener('mousemove', handleMouseMove);
        heroVisual.addEventListener('mouseleave', () => this.resetHeroTransform(heroVisual));
        
        // Soporte táctil
        heroVisual.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMouseMove(e.touches[0]);
        });
        
        heroVisual.addEventListener('touchend', () => this.resetHeroTransform(heroVisual));
    },

    /**
     * Maneja movimiento del mouse
     * @param {Event} event - Evento del mouse
     * @param {Element} element - Elemento hero
     */
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
    },

    /**
     * Resetea transformación
     * @param {Element} element - Elemento a resetear
     */
    resetHeroTransform(element) {
        element.style.transform = `perspective(${APP_CONFIG.animations.perspectiveValue}px) rotateX(0) rotateY(0)`;
        element.style.transition = 'transform 0.5s ease';
    },

    /**
     * Limpia el módulo
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
};

// ============================================================================
// MÓDULO DE SYSTEM STATUS
// ============================================================================

const SystemStatus = {
    /** @type {Object} Referencias DOM */
    elements: {},
    
    /** @type {number|null} Intervalo de actualización */
    statusInterval: null,

    /**
     * Inicializa el módulo
     */
    init() {
        this.cacheElements();
        if (!this.elements.container) return;
        
        this.setupStatusUpdates();
        this.setupEventListeners();
        AppState.registerModule('systemStatus', this);
    },

    /**
     * Cachea elementos DOM
     */
    cacheElements() {
        this.elements = {
            container: document.querySelector(APP_CONFIG.selectors.systemStatus),
            statusText: document.querySelector(`${APP_CONFIG.selectors.systemStatus} ${APP_CONFIG.selectors.statusText}`)
        };
    },

    /**
     * Configura actualizaciones periódicas
     */
    setupStatusUpdates() {
        this.statusInterval = setInterval(() => this.toggleStatus(), 30000);
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        if (!this.elements.container) return;
        
        this.elements.container.addEventListener('click', () => this.toggleStatus());
        this.elements.container.addEventListener('mouseenter', () => this.showTooltip());
        this.elements.container.addEventListener('mouseleave', () => this.hideTooltip());
    },

    /**
     * Cambia estado online/offline
     */
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
    },

    /**
     * Anima el click
     */
    animateClick() {
        if (!this.elements.container) return;
        
        this.elements.container.style.transform = 'scale(1.05)';
        setTimeout(() => {
            if (this.elements.container) {
                this.elements.container.style.transform = '';
            }
        }, 200);
    },

    /**
     * Muestra tooltip
     */
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
        
        // Forzar reflow y animar
        tooltip.offsetHeight;
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    },

    /**
     * Oculta tooltip
     */
    hideTooltip() {
        const tooltip = document.querySelector(`.${APP_CONFIG.classes.statusTooltip}`);
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => tooltip.remove(), 300);
        }
    },

    /**
     * Actualiza texto del estado
     * @param {string} text - Nuevo texto
     */
    setStatus(text) {
        if (this.elements.statusText) {
            this.elements.statusText.textContent = text;
        }
    },

    /**
     * Limpia el módulo
     */
    destroy() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
        }
        this.hideTooltip();
    }
};

// ============================================================================
// MÓDULO DE WHATSAPP
// ============================================================================

const WhatsAppManager = {
    /** @type {Object} Referencias DOM */
    elements: {},

    /**
     * Inicializa el módulo
     */
    init() {
        this.cacheElements();
        if (!this.elements.button) return;
        
        this.setupEventListeners();
        this.checkMobile();
        AppState.registerModule('whatsapp', this);
    },

    /**
     * Cachea elementos DOM
     */
    cacheElements() {
        this.elements = {
            button: document.querySelector(APP_CONFIG.selectors.whatsappButton),
            tooltip: document.querySelector(`${APP_CONFIG.selectors.whatsappButton} ${APP_CONFIG.selectors.whatsappTooltip}`)
        };
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        this.elements.button.addEventListener('click', () => this.trackClick());
        this.elements.button.addEventListener('mouseenter', () => this.updateTooltipMessage());
    },

    /**
     * Verifica si es móvil
     */
    checkMobile() {
        if (Utils.isMobile()) {
            this.elements.button.removeAttribute('data-tooltip');
        }
    },

    /**
     * Trackea clicks
     */
    trackClick() {
        console.log(`WhatsApp button clicked - Número: ${APP_CONFIG.contacts.whatsapp}`);
        
        this.elements.button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (this.elements.button) {
                this.elements.button.style.transform = '';
            }
        }, 200);
    },

    /**
     * Actualiza mensaje del tooltip según hora
     */
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
    },

    /**
     * Muestra badge de no leídos
     * @param {number} count - Número de mensajes
     */
    setUnreadCount(count) {
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
    },

    /**
     * Limpia el módulo
     */
    destroy() {
        this.elements.button?.removeEventListener('click', this.trackClick);
        this.elements.button?.removeEventListener('mouseenter', this.updateTooltipMessage);
    }
};

// ============================================================================
// MÓDULO DE AUDIO
// ============================================================================

const AudioManager = {
    /** @type {Object} Referencias DOM */
    elements: {},
    
    /** @type {Object} Estado del audio */
    state: {
        isPlaying: false,
        isMuted: false,
        currentVolume: APP_CONFIG.animations.defaultVolume
    },

    /**
     * Inicializa el módulo
     */
    init() {
        this.cacheElements();
        if (!this.elements.audio || !this.elements.button) return;
        
        this.loadPreference();
        this.setupEventListeners();
        this.setupAudioEvents();
        AppState.registerModule('audio', this);
    },

    /**
     * Cachea elementos DOM
     */
    cacheElements() {
        this.elements = {
            audio: document.getElementById('bgAudio'),
            button: document.getElementById('audioControl'),
            icon: document.querySelector(`${APP_CONFIG.selectors.audioControl} ${APP_CONFIG.selectors.audioIcon}`)
        };
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        this.elements.button.addEventListener('click', () => this.toggle());
        window.addEventListener('beforeunload', () => this.savePreference());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    },

    /**
     * Configura eventos de audio
     */
    setupAudioEvents() {
        this.elements.audio.addEventListener('error', (e) => this.handleError(e));
        this.elements.audio.addEventListener('canplay', () => this.handleCanPlay());
        this.elements.audio.addEventListener('play', () => this.handlePlay());
        this.elements.audio.addEventListener('pause', () => this.handlePause());
    },

    /**
     * Maneja toggle de audio
     */
    toggle() {
        if (this.state.isMuted) {
            this.unmute();
        } else if (this.state.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        
        this.updateButtonState();
    },

    /**
     * Reproduce audio
     */
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
            console.warn('Reproducción automática bloqueada:', error);
            this.handlePlaybackError();
        }
    },

    /**
     * Pausa audio
     */
    pause() {
        this.elements.audio.pause();
        this.state.isPlaying = false;
        this.state.isMuted = false;
        Utils.dispatchEvent('audioStateChange', { state: 'audioPaused', ...this.state });
    },

    /**
     * Silencia audio
     */
    mute() {
        this.elements.audio.pause();
        this.state.isPlaying = false;
        this.state.isMuted = true;
        Utils.dispatchEvent('audioStateChange', { state: 'audioMuted', ...this.state });
    },

    /**
     * Activa audio
     */
    unmute() {
        this.play();
    },

    /**
     * Maneja error de reproducción
     */
    handlePlaybackError() {
        this.elements.button.classList.add(APP_CONFIG.classes.blocked);
        
        const enableAudio = () => {
            this.play();
            this.elements.button.classList.remove(APP_CONFIG.classes.blocked);
            document.removeEventListener('click', enableAudio);
        };
        
        document.addEventListener('click', enableAudio, { once: true });
    },

    /**
     * Maneja error de audio
     * @param {Event} e - Evento de error
     */
    handleError(e) {
        console.error('Error cargando audio:', e);
        this.elements.button.classList.add(APP_CONFIG.classes.error);
        this.elements.button.setAttribute('aria-label', APP_CONFIG.defaults.audioError);
    },

    /**
     * Maneja evento canplay
     */
    handleCanPlay() {
        console.log('Audio listo para reproducir');
    },

    /**
     * Maneja evento play
     */
    handlePlay() {
        console.log('Audio reproduciendo');
    },

    /**
     * Maneja evento pause
     */
    handlePause() {
        console.log('Audio pausado');
    },

    /**
     * Actualiza estado del botón
     */
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
    },

    /**
     * Carga preferencia guardada
     */
    loadPreference() {
        const saved = Utils.safeStorageGet(APP_CONFIG.storage.audioPreference);
        
        if (saved?.wasPlaying) {
            document.addEventListener('click', () => this.play(), { once: true });
        }
    },

    /**
     * Guarda preferencia
     */
    savePreference() {
        Utils.safeStorageSet(APP_CONFIG.storage.audioPreference, {
            wasPlaying: this.state.isPlaying,
            timestamp: Date.now()
        });
    },

    /**
     * Maneja cambio de visibilidad
     */
    handleVisibilityChange() {
        if (document.hidden && this.state.isPlaying) {
            this.elements.audio.volume = 0.1;
        } else if (!document.hidden && this.state.isPlaying) {
            this.elements.audio.volume = this.state.currentVolume;
        }
    },

    /**
     * Cambia pista de audio
     * @param {string} src - Nueva fuente de audio
     */
    changeTrack(src) {
        if (!src) return;
        
        const wasPlaying = this.state.isPlaying;
        
        if (APP_CONFIG.animations.crossfadeEnabled) {
            this.crossfadeTo(src);
        } else {
            this.elements.audio.src = src;
            this.elements.audio.load();
            if (wasPlaying) this.play();
        }
    },

    /**
     * Crossfade entre pistas
     * @param {string} src - Nueva fuente
     */
    crossfadeTo(src) {
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
    },

    /**
     * Limpia el módulo
     */
    destroy() {
        this.savePreference();
        this.elements.button?.removeEventListener('click', this.toggle);
        window.removeEventListener('beforeunload', this.savePreference);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
};

// ============================================================================
// MÓDULO DE ANALÍTICAS
// ============================================================================

const AnalyticsManager = {
    /**
     * Inicializa el módulo
     */
    init() {
        this.setupListeners();
        AppState.registerModule('analytics', this);
    },

    /**
     * Configura listeners
     */
    setupListeners() {
        document.addEventListener('themeChanged', (e) => this.trackThemeChange(e));
        document.addEventListener('typingComplete', () => this.trackTypingComplete());
        document.addEventListener('audioStateChange', (e) => this.trackAudioState(e));
    },

    /**
     * Trackea cambio de tema
     * @param {CustomEvent} e - Evento
     */
    trackThemeChange(e) {
        console.log(`Theme changed to: ${e.detail.theme}`);
        
        if (window.gtag) {
            window.gtag('event', 'theme_change', { theme: e.detail.theme });
        }
    },

    /**
     * Trackea typing completado
     */
    trackTypingComplete() {
        console.log('Typing animation completed');
    },

    /**
     * Trackea estado de audio
     * @param {CustomEvent} e - Evento
     */
    trackAudioState(e) {
        if (window.gtag) {
            window.gtag('event', 'audio_control', {
                action: e.detail.state,
                playing: e.detail.isPlaying
            });
        }
    },

    /**
     * Limpia el módulo
     */
    destroy() {
        document.removeEventListener('themeChanged', this.trackThemeChange);
        document.removeEventListener('typingComplete', this.trackTypingComplete);
        document.removeEventListener('audioStateChange', this.trackAudioState);
    }
};

// ============================================================================
// MÓDULO DE OPTIMIZACIÓN DE RENDIMIENTO
// ============================================================================

const PerformanceOptimizer = {
    /** @type {MediaQueryList} Media query para reduced motion */
    motionQuery: null,

    /**
     * Inicializa el módulo
     */
    init() {
        this.checkReducedMotion();
        this.optimizeAnimations();
        AppState.registerModule('performance', this);
    },

    /**
     * Verifica preferencia de reducción de movimiento
     */
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
    },

    /**
     * Desactiva animaciones
     */
    disableAnimations() {
        document.documentElement.style.setProperty('--transition-base', '0s');
        document.documentElement.style.setProperty('--transition-smooth', '0s');
        Utils.cleanupAnimations(AppState.get());
    },

    /**
     * Activa animaciones
     */
    enableAnimations() {
        document.documentElement.style.setProperty('--transition-base', '0.2s ease');
        document.documentElement.style.setProperty('--transition-smooth', '0.3s ease');
    },

    /**
     * Optimiza animaciones
     */
    optimizeAnimations() {
        const heroVisual = document.querySelector(APP_CONFIG.selectors.heroVisual);
        if (heroVisual) {
            heroVisual.style.willChange = 'transform';
            
            setTimeout(() => {
                heroVisual.style.willChange = 'auto';
            }, 1000);
        }
    },

    /**
     * Limpia el módulo
     */
    destroy() {
        this.motionQuery?.removeEventListener('change', this.checkReducedMotion);
    }
};

// ============================================================================
// INICIALIZADOR PRINCIPAL
// ============================================================================

const App = {
    /**
     * Inicializa la aplicación
     */
    init() {
        console.log('🚀 Inicializando aplicación...');
        
        // Limpiar estado previo
        AppState.cleanup();
        
        // Inicializar módulos
        ThemeManager.init();
        AnimationManager.init();
        SystemStatus.init();
        WhatsAppManager.init();
        AudioManager.init();
        AnalyticsManager.init();
        PerformanceOptimizer.init();
        
        console.log('✅ Aplicación inicializada correctamente');
    },

    /**
     * Reinicia la aplicación
     */
    restart() {
        this.destroy();
        this.init();
    },

    /**
     * Limpia la aplicación
     */
    destroy() {
        console.log('🧹 Limpiando aplicación...');
        AppState.cleanup();
        console.log('✅ Aplicación limpiada');
    }
};

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => App.init());

window.addEventListener('beforeunload', () => App.destroy());

window.addEventListener('popstate', () => {
    App.destroy();
    App.init();
});

// ============================================================================
// EXPORTS (para uso en módulos)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App,
        AppState,
        APP_CONFIG,
        ThemeManager,
        AnimationManager,
        SystemStatus,
        WhatsAppManager,
        AudioManager,
        AnalyticsManager,
        PerformanceOptimizer
    };
}