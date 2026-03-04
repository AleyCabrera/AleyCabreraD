// ===== VARIABLES GLOBALES =====
const APP = {
    // Configuración
    config: {
        animationDuration: 100, // ms para typing
        numberIncrementSteps: 50, // pasos para contador
        mouseRotateIntensity: 20, // intensidad de rotación
        perspectiveValue: 1000 // valor de perspectiva 3D
    },
    
    // Selectores
    selectors: {
        body: 'body',
        themeToggle: '.theme-toggle i',
        statNumbers: '.stat-number',
        heroTitleHighlight: '.hero-content h1 span.highlight',
        heroVisual: '.hero-visual'
    },
    
    // Clases CSS
    classes: {
        darkTheme: 'dark-theme',
        lightTheme: 'light-theme',
        faSun: 'fa-sun',
        faMoon: 'fa-moon'
    },
    
    // Estado de la aplicación
    state: {
        currentTheme: null,
        animationFrame: null,
        typingInterval: null
    }
};

// ===== UTILIDADES =====
const Utils = {
    /**
     * Limpia y detiene animaciones activas
     */
    cleanupAnimations() {
        if (APP.state.animationFrame) {
            cancelAnimationFrame(APP.state.animationFrame);
            APP.state.animationFrame = null;
        }
        
        if (APP.state.typingInterval) {
            clearInterval(APP.state.typingInterval);
            APP.state.typingInterval = null;
        }
    },
    
    /**
     * Extrae número de un string (ej: "42+" -> 42)
     */
    extractNumberFromString(str) {
        return parseInt(str.replace(/[^0-9]/g, '')) || 0;
    },
    
    /**
     * Preserva el sufijo del número (ej: "+", "%", etc)
     */
    preserveNumberSuffix(originalText, number) {
        const suffix = originalText.replace(/[0-9]/g, '');
        return number + suffix;
    },
    
    /**
     * Throttle para eventos de alto rendimiento
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
    }
};

// ===== MODULO DE TEMA =====
const ThemeManager = {
    /**
     * Inicializa el manejador de temas
     */
    init() {
        this.loadSavedTheme();
        this.setupToggleListener();
    },
    
    /**
     * Carga el tema guardado en localStorage
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || APP.classes.darkTheme;
        const body = document.querySelector(APP.selectors.body);
        const toggle = document.querySelector(APP.selectors.themeToggle);
        
        body.classList.remove(APP.classes.darkTheme, APP.classes.lightTheme);
        body.classList.add(savedTheme);
        
        // Actualizar icono
        if (toggle) {
            toggle.classList.remove(APP.classes.faSun, APP.classes.faMoon);
            toggle.classList.add(savedTheme === APP.classes.darkTheme ? 
                APP.classes.faSun : APP.classes.faMoon);
        }
        
        APP.state.currentTheme = savedTheme;
    },
    
    /**
     * Cambia entre temas oscuro/claro
     */
    toggle() {
        const body = document.querySelector(APP.selectors.body);
        const toggle = document.querySelector(APP.selectors.themeToggle);
        
        if (!body || !toggle) return;
        
        const isDark = body.classList.contains(APP.classes.darkTheme);
        const newTheme = isDark ? APP.classes.lightTheme : APP.classes.darkTheme;
        const newIcon = isDark ? APP.classes.faMoon : APP.classes.faSun;
        const oldIcon = isDark ? APP.classes.faSun : APP.classes.faMoon;
        
        // Actualizar clases
        body.classList.remove(APP.classes.darkTheme, APP.classes.lightTheme);
        body.classList.add(newTheme);
        
        // Actualizar icono
        toggle.classList.remove(oldIcon);
        toggle.classList.add(newIcon);
        
        // Guardar preferencia
        localStorage.setItem('theme', newTheme);
        APP.state.currentTheme = newTheme;
        
        // Disparar evento personalizado
        this.dispatchThemeChangeEvent(newTheme);
    },
    
    /**
     * Configura el listener del botón de tema
     */
    setupToggleListener() {
        const toggle = document.querySelector(APP.selectors.themeToggle)?.parentElement;
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    },
    
    /**
     * Dispara evento de cambio de tema
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', { 
            detail: { theme } 
        });
        document.dispatchEvent(event);
    }
};

// ===== MODULO DE ANIMACIONES =====
const AnimationManager = {
    /**
     * Inicializa todas las animaciones
     */
    init() {
        this.setupStatNumbers();
        this.setupTypeWriter();
        this.setupHeroVisualEffects();
    },
    
    /**
     * Configura animación de contadores
     */
    setupStatNumbers() {
        const stats = document.querySelectorAll(APP.selectors.statNumbers);
        
        stats.forEach(stat => {
            // Usar Intersection Observer para animar solo cuando son visibles
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateNumber(stat);
                        observer.unobserve(stat);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    },
    
    /**
     * Anima un contador específico
     */
    animateNumber(statElement) {
        const originalText = statElement.textContent;
        const targetValue = Utils.extractNumberFromString(originalText);
        
        if (targetValue === 0) return;
        
        let currentValue = 0;
        const increment = targetValue / APP.config.numberIncrementSteps;
        
        const updateNumber = () => {
            if (currentValue < targetValue) {
                currentValue += increment;
                if (currentValue > targetValue) currentValue = targetValue;
                
                const displayNumber = Math.floor(currentValue);
                statElement.textContent = Utils.preserveNumberSuffix(originalText, displayNumber);
                
                APP.state.animationFrame = requestAnimationFrame(updateNumber);
            } else {
                statElement.textContent = originalText;
                APP.state.animationFrame = null;
            }
        };
        
        APP.state.animationFrame = requestAnimationFrame(updateNumber);
    },
    
    /**
     * Configura efecto de máquina de escribir
     */
    setupTypeWriter() {
        const titleHighlight = document.querySelector(APP.selectors.heroTitleHighlight);
        if (!titleHighlight) return;
        
        // Usar observer para iniciar solo cuando es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.typeWriterEffect(titleHighlight);
                    observer.unobserve(titleHighlight);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(titleHighlight);
    },
    
    /**
     * Efecto de máquina de escribir
     */
    typeWriterEffect(element) {
        const originalText = element.textContent;
        const textArray = originalText.split('');
        
        element.textContent = '';
        let index = 0;
        
        // Limpiar intervalo anterior si existe
        if (APP.state.typingInterval) {
            clearInterval(APP.state.typingInterval);
        }
        
        APP.state.typingInterval = setInterval(() => {
            if (index < textArray.length) {
                element.textContent += textArray[index];
                index++;
            } else {
                clearInterval(APP.state.typingInterval);
                APP.state.typingInterval = null;
                
                // Disparar evento cuando termina
                this.dispatchTypingCompleteEvent();
            }
        }, APP.config.animationDuration);
    },
    
    /**
     * Dispara evento de typing completado
     */
    dispatchTypingCompleteEvent() {
        const event = new CustomEvent('typingComplete');
        document.dispatchEvent(event);
    },
    
    /**
     * Configura efectos de movimiento en hero visual
     */
    setupHeroVisualEffects() {
        const heroVisual = document.querySelector(APP.selectors.heroVisual);
        if (!heroVisual) return;
        
        // Usar throttle para mejor rendimiento
        const handleMouseMove = Utils.throttle((e) => {
            this.handleHeroMouseMove(e, heroVisual);
        }, 16); // ~60fps
        
        heroVisual.addEventListener('mousemove', handleMouseMove);
        
        heroVisual.addEventListener('mouseleave', () => {
            this.resetHeroTransform(heroVisual);
        });
        
        // Soporte para dispositivos táctiles
        heroVisual.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMouseMove(e.touches[0]);
        });
        
        heroVisual.addEventListener('touchend', () => {
            this.resetHeroTransform(heroVisual);
        });
    },
    
    /**
     * Maneja movimiento del mouse en hero visual
     */
    handleHeroMouseMove(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / APP.config.mouseRotateIntensity;
        const angleY = (centerX - x) / APP.config.mouseRotateIntensity;
        
        // Limitar ángulos para evitar rotaciones extremas
        const limitedAngleX = Math.max(-15, Math.min(15, angleX));
        const limitedAngleY = Math.max(-15, Math.min(15, angleY));
        
        element.style.transform = `perspective(${APP.config.perspectiveValue}px) rotateX(${limitedAngleX}deg) rotateY(${limitedAngleY}deg)`;
        element.style.transition = 'transform 0.1s ease';
    },
    
    /**
     * Resetea la transformación del hero visual
     */
    resetHeroTransform(element) {
        element.style.transform = `perspective(${APP.config.perspectiveValue}px) rotateX(0) rotateY(0)`;
        element.style.transition = 'transform 0.5s ease';
    }
};

// ===== MODULO DE ANALÍTICAS =====
const Analytics = {
    /**
     * Inicializa tracking de eventos
     */
    init() {
        this.trackThemeChanges();
        this.trackAnimations();
    },
    
    /**
     * Trackea cambios de tema
     */
    trackThemeChanges() {
        document.addEventListener('themeChanged', (e) => {
            console.log(`Theme changed to: ${e.detail.theme}`);
            // Aquí puedes enviar a Google Analytics, etc
            if (window.gtag) {
                gtag('event', 'theme_change', {
                    'theme': e.detail.theme
                });
            }
        });
    },
    
    /**
     * Trackea animaciones completadas
     */
    trackAnimations() {
        document.addEventListener('typingComplete', () => {
            console.log('Typing animation completed');
        });
    }
};

// ===== MODULO DE RENDIMIENTO =====
const PerformanceOptimizer = {
    /**
     * Optimiza para reducción de movimiento
     */
    init() {
        this.checkReducedMotion();
        this.optimizeAnimations();
    },
    
    /**
     * Verifica preferencia de reducción de movimiento
     */
    checkReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            this.disableAnimations();
        }
        
        mediaQuery.addEventListener('change', (e) => {
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
        Utils.cleanupAnimations();
    },
    
    /**
     * Activa animaciones
     */
    enableAnimations() {
        document.documentElement.style.setProperty('--transition-base', '0.2s ease');
        document.documentElement.style.setProperty('--transition-smooth', '0.3s ease');
    },
    
    /**
     * Optimizaciones generales de animaciones
     */
    optimizeAnimations() {
        // Usar will-change para elementos animados
        const heroVisual = document.querySelector(APP.selectors.heroVisual);
        if (heroVisual) {
            heroVisual.style.willChange = 'transform';
        }
        
        // Limpiar will-change después de la animación
        setTimeout(() => {
            if (heroVisual) {
                heroVisual.style.willChange = 'auto';
            }
        }, 1000);
    }
};

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
    // Limpiar animaciones previas
    Utils.cleanupAnimations();
    
    // Inicializar módulos
    ThemeManager.init();
    AnimationManager.init();
    Analytics.init();
    PerformanceOptimizer.init();
    
    console.log('Aplicación inicializada correctamente');
});

// ===== CLEANUP EN DESCARGA =====
window.addEventListener('beforeunload', () => {
    Utils.cleanupAnimations();
});

// ===== SOPORTE PARA NAVEGACIÓN CON HISTORY =====
window.addEventListener('popstate', () => {
    Utils.cleanupAnimations();
    AnimationManager.init();
});

// Exportar para uso en otros módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP, ThemeManager, AnimationManager, Analytics, PerformanceOptimizer };
}

// ===== SYSTEM STATUS MODULE =====
const SystemStatus = {
    element: null,
    statusInterval: null,
    
    init() {
        this.element = document.querySelector('.system-status');
        if (!this.element) return;
        
        this.setupStatusUpdates();
        this.setupEventListeners();
    },
    
    setupStatusUpdates() {
        // Simular cambios de estado cada 30 segundos
        this.statusInterval = setInterval(() => {
            this.toggleStatus();
        }, 30000);
    },
    
    setupEventListeners() {
        if (!this.element) return;
        
        // Click para cambiar estado manualmente
        this.element.addEventListener('click', () => {
            this.toggleStatus();
        });
        
        // Mostrar información adicional al hover
        this.element.addEventListener('mouseenter', () => {
            this.showTooltip();
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    },
    
    toggleStatus() {
        if (!this.element) return;
        
        const isOnline = this.element.classList.contains('offline');
        const statusText = this.element.querySelector('.status-text');
        
        if (isOnline) {
            this.element.classList.remove('offline');
            statusText.textContent = 'system_online';
        } else {
            this.element.classList.add('offline');
            statusText.textContent = 'system_offline';
        }
        
        // Animar cambio
        this.element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            if (this.element) {
                this.element.style.transform = '';
            }
        }, 200);
    },
    
    showTooltip() {
        // Crear tooltip si no existe
        if (!document.querySelector('.status-tooltip')) {
            const tooltip = document.createElement('div');
            tooltip.className = 'status-tooltip';
            tooltip.textContent = 'Uptime: 99.9% | Latencia: 23ms';
            
            // Estilos del tooltip
            tooltip.style.cssText = `
                position: fixed;
                bottom: 60px;
                right: 20px;
                background: var(--bg-elevated);
                color: var(--text-primary);
                font-family: var(--font-mono);
                font-size: 0.7rem;
                padding: 0.5rem 1rem;
                border-radius: var(--border-radius-sm);
                border: 1px solid var(--border-color);
                z-index: calc(var(--z-fixed) - 1);
                backdrop-filter: blur(4px);
                opacity: 0;
                transform: translateY(10px);
                transition: var(--transition-base);
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            // Forzar reflow para animación
            tooltip.offsetHeight;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        }
    },
    
    hideTooltip() {
        const tooltip = document.querySelector('.status-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => tooltip.remove(), 300);
        }
    },
    
    // Actualizar texto dinámicamente
    setStatus(text) {
        if (!this.element) return;
        const statusText = this.element.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = text;
        }
    },
    
    // Limpiar intervalo
    destroy() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
        }
        this.hideTooltip();
    }
};

// ===== WHATSAPP BUTTON MODULE =====
const WhatsAppButton = {
    init() {
        this.button = document.querySelector('.whatsapp-button');
        if (!this.button) return;
        
        this.setupEventListeners();
        this.checkMobile();
    },
    
    setupEventListeners() {
        // Tracking de clics
        this.button.addEventListener('click', (e) => {
            this.trackClick();
        });
        
        // Mostrar mensaje personalizado en hover (opcional)
        this.button.addEventListener('mouseenter', () => {
            this.updateTooltipMessage();
        });
    },
    
    checkMobile() {
        // Detectar si es móvil para ajustar comportamiento
        if (window.innerWidth <= 768) {
            this.button.removeAttribute('data-tooltip');
        }
    },
    
    trackClick() {
        // Aquí puedes agregar tracking con Google Analytics
        console.log('WhatsApp button clicked - Número: 3234737757');
        
        // Si quieres animación al hacer click
        this.button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (this.button) {
                this.button.style.transform = '';
            }
        }, 200);
    },
    
    updateTooltipMessage() {
        const tooltip = this.button.querySelector('.whatsapp-tooltip');
        if (tooltip) {
            // Puedes cambiar el mensaje según el contexto
            const hours = new Date().getHours();
            let message = 'Contáctame';
            
            if (hours >= 9 && hours <= 18) {
                message = '¡Disponible ahora!';
            } else {
                message = 'Deja tu mensaje';
            }
            
            tooltip.textContent = message;
        }
    },
    
    // Mostrar badge de no leídos (opcional)
    setUnreadCount(count) {
        let badge = this.button.querySelector('.badge');
        
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge';
                this.button.appendChild(badge);
            }
            badge.textContent = count > 9 ? '9+' : count;
        } else if (badge) {
            badge.remove();
        }
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    WhatsAppButton.init();
    
    // Ejemplo: simular mensajes no leídos después de 5 segundos
    setTimeout(() => {
        WhatsAppButton.setUnreadCount(2);
    }, 5000);
});

// ===== AUDIO CONTROL MODULE =====
const AudioManager = {
    audio: null,
    button: null,
    icon: null,
    isPlaying: false,
    isMuted: false,
    
    // Configuración
    config: {
        storageKey: 'audio_preference',
        defaultVolume: 0.5,
        fadeDuration: 2000,
        crossfadeEnabled: true
    },
    
    init() {
        this.audio = document.getElementById('bgAudio');
        this.button = document.getElementById('audioControl');
        
        if (!this.audio || !this.button) return;
        
        this.icon = this.button.querySelector('i');
        this.loadPreference();
        this.setupEventListeners();
        this.setupAudioEvents();
    },
    
    setupEventListeners() {
        // Click en el botón
        this.button.addEventListener('click', () => this.toggleAudio());
        
        // Guardar preferencia al cerrar
        window.addEventListener('beforeunload', () => this.savePreference());
        
        // Manejar visibilidad de página
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    },
    
    setupAudioEvents() {
        // Error al cargar audio
        this.audio.addEventListener('error', (e) => {
            console.error('Error cargando audio:', e);
            this.button.classList.add('error');
            this.button.setAttribute('aria-label', 'Error al cargar audio');
        });
        
        // Audio listo para reproducir
        this.audio.addEventListener('canplay', () => {
            console.log('Audio listo para reproducir');
        });
        
        // Reproducción automática bloqueada
        this.audio.addEventListener('play', () => {
            console.log('Audio reproduciendo');
        });
        
        this.audio.addEventListener('pause', () => {
            console.log('Audio pausado');
        });
    },
    
    toggleAudio() {
        if (this.isMuted) {
            this.unmuteAudio();
        } else if (this.isPlaying) {
            this.pauseAudio();
        } else {
            this.playAudio();
        }
        
        this.updateButtonState();
    },
    
    async playAudio() {
        try {
            // Configurar volumen
            this.audio.volume = this.config.defaultVolume;
            
            // Intentar reproducir
            await this.audio.play();
            
            this.isPlaying = true;
            this.isMuted = false;
            
            // Disparar evento personalizado
            this.dispatchEvent('audioStarted');
            
        } catch (error) {
            console.warn('Reproducción automática bloqueada:', error);
            this.handlePlaybackError();
        }
    },
    
    pauseAudio() {
        this.audio.pause();
        this.isPlaying = false;
        this.isMuted = false;
        this.dispatchEvent('audioPaused');
    },
    
    muteAudio() {
        this.audio.pause();
        this.isPlaying = false;
        this.isMuted = true;
        this.dispatchEvent('audioMuted');
    },
    
    unmuteAudio() {
        this.playAudio();
    },
    
    handlePlaybackError() {
        // Mostrar indicador de reproducción bloqueada
        this.button.classList.add('blocked');
        
        // Opción para activar con interacción del usuario
        const enableAudio = () => {
            this.playAudio();
            this.button.classList.remove('blocked');
            document.removeEventListener('click', enableAudio);
        };
        
        document.addEventListener('click', enableAudio, { once: true });
    },
    
    updateButtonState() {
        // Remover clases existentes
        this.button.classList.remove('playing', 'muted', 'blocked');
        
        if (this.isMuted) {
            this.button.classList.add('muted');
            this.button.setAttribute('aria-label', 'Activar música');
        } else if (this.isPlaying) {
            this.button.classList.add('playing');
            this.button.setAttribute('aria-label', 'Pausar música');
        } else {
            this.button.setAttribute('aria-label', 'Reproducir música');
        }
    },
    
    loadPreference() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                const pref = JSON.parse(saved);
                
                // Restaurar preferencia (pero no reproducir automáticamente)
                if (pref.wasPlaying) {
                    // Marcamos para intentar reproducir después de interacción
                    document.addEventListener('click', () => {
                        this.playAudio();
                    }, { once: true });
                }
            }
        } catch (e) {
            console.warn('Error cargando preferencia:', e);
        }
    },
    
    savePreference() {
        try {
            const preference = {
                wasPlaying: this.isPlaying,
                timestamp: Date.now()
            };
            localStorage.setItem(this.config.storageKey, JSON.stringify(preference));
        } catch (e) {
            console.warn('Error guardando preferencia:', e);
        }
    },
    
    handleVisibilityChange() {
        if (document.hidden && this.isPlaying) {
            // Pausar cuando la pestaña no está visible
            this.audio.volume = 0.1; // Bajar volumen en lugar de pausar
        } else if (!document.hidden && this.isPlaying) {
            // Restaurar volumen cuando vuelve
            this.audio.volume = this.config.defaultVolume;
        }
    },
    
    dispatchEvent(eventName) {
        const event = new CustomEvent('audioStateChange', { 
            detail: { 
                state: eventName,
                isPlaying: this.isPlaying,
                isMuted: this.isMuted
            } 
        });
        document.dispatchEvent(event);
    },
    
    // Método para cambiar la pista de audio
    changeTrack(src) {
        if (!src) return;
        
        const wasPlaying = this.isPlaying;
        
        if (this.config.crossfadeEnabled) {
            this.crossfadeTo(src);
        } else {
            this.audio.src = src;
            this.audio.load();
            if (wasPlaying) {
                this.playAudio();
            }
        }
    },
    
    crossfadeTo(src) {
        const currentVolume = this.audio.volume;
        const fadeOut = setInterval(() => {
            if (this.audio.volume > 0.05) {
                this.audio.volume -= 0.05;
            } else {
                clearInterval(fadeOut);
                this.audio.src = src;
                this.audio.load();
                this.audio.volume = 0;
                this.playAudio();
                
                // Fade in
                const fadeIn = setInterval(() => {
                    if (this.audio.volume < currentVolume) {
                        this.audio.volume += 0.05;
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 100);
            }
        }, 100);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
});

// ===== INTEGRACIÓN CON EL TEMA =====
document.addEventListener('themeChanged', (e) => {
    // Actualizar colores si es necesario
    const audioControl = document.getElementById('audioControl');
    if (audioControl) {
        audioControl.style.transition = 'all 0.3s ease';
    }
});

// ===== INTEGRACIÓN CON ANALÍTICAS =====
document.addEventListener('audioStateChange', (e) => {
    // Aquí puedes enviar eventos a Google Analytics
    if (window.gtag) {
        gtag('event', 'audio_control', {
            'action': e.detail.state,
            'playing': e.detail.isPlaying
        });
    }
});

// ===== SYSTEM STATUS MODULE ===== //

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    SystemStatus.init();
});

// Limpiar al descargar la página
window.addEventListener('beforeunload', () => {
    SystemStatus.destroy();
});