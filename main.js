// main.js
        document.addEventListener('DOMContentLoaded', function () {
            // Preloader
            window.addEventListener('load', function () {
                const preloader = document.querySelector('.preloader');
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 800);
                }, 3500);
            });

            // Control de audio
            const audioControl = document.getElementById('audioControl');
            const bgAudio = document.getElementById('bgAudio');
            let audioPlaying = false;

            // Configurar volumen fijo al 20%
            bgAudio.volume = 0.2;

            audioControl.addEventListener('click', function () {
                if (audioPlaying) {
                    bgAudio.pause();
                    audioControl.innerHTML = '<i class="fas fa-volume-mute"></i>';
                } else {
                    bgAudio.play();
                    audioControl.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
                audioPlaying = !audioPlaying;
            });

            // Asegurar que el volumen siempre sea 30%, incluso si se intenta cambiar
            bgAudio.addEventListener('volumechange', function() {
                if (bgAudio.volume !== 0.2) {
                    bgAudio.volume = 0.2;
                }
            });

            // Menú móvil
            const menuToggle = document.getElementById('menuToggle');
            const cyberNav = document.querySelector('.cyber-nav');

            menuToggle.addEventListener('click', function () {
                this.classList.toggle('active');
                cyberNav.classList.toggle('active');
            });

            // Efecto glitch en el texto principal
            document.addEventListener('DOMContentLoaded', function() {
            const glitchText = document.querySelector('.glitch-text');
            
            // Reiniciar animaciones periódicamente para mayor efecto
            setInterval(() => {
                glitchText.style.animation = 'none';
                setTimeout(() => {
                    glitchText.style.animation = '';
                }, 10);
            }, 8000);
            });

            // Efecto typing cíclico
            const roles = ["Desarrollador de Software", "Analista en Ciberseguridad", "Apasionado por la IA", "Apasionado por La tecnología"];
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const typingEl = document.getElementById("typing-text");
            
            function typeRole() {
                const currentRole = roles[roleIndex];
                
                if (!isDeleting && charIndex < currentRole.length) {
                    // Escribiendo
                    typingEl.textContent = currentRole.substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(typeRole, 100);
                } else if (!isDeleting) {
                    // Cambiar a modo borrado después de una pausa
                    isDeleting = true;
                    setTimeout(typeRole, 1500);
                } else if (isDeleting && charIndex > 0) {
                    // Borrando
                    typingEl.textContent = currentRole.substring(0, charIndex - 1);
                    charIndex--;
                    setTimeout(typeRole, 50);
                } else {
                    // Cambiar al siguiente rol
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeRole, 300);
                }
            }
        
            // Iniciar el efecto
            typeRole();

            // Efecto de máquina de escribir
            const typewriterText = document.getElementById('typewriter-text');
            const textToType = 'const portfolio = { skills: ["Full-Stack", "Ciberseguridad"], experiencia: "Junior" };';

            let i = 0;
            function typeWriter() {
                if (i < textToType.length) {
                    typewriterText.innerHTML += textToType.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            window.onload = typeWriter;

            // Efecto de scroll suave
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                });
            });

            // Animación de habilidades al aparecer
            const skillItems = document.querySelectorAll('.skill-item');
            const skillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target.querySelector('.progress-bar');
                        const level = progressBar.getAttribute('data-level');
                        progressBar.style.width = level + '%';
                        skillObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            skillItems.forEach(item => {
                skillObserver.observe(item);
            });

            // Contadores animados
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(value => {
                const target = parseInt(value.getAttribute('data-count'));
                const increment = target / 50;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    value.textContent = Math.floor(current);

                    if (current >= target) {
                        value.textContent = target;
                        clearInterval(timer);
                    }
                }, 20);
            });


            // Efecto de hover en tarjetas de proyecto
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        duration: 0.5,
                        ease: "power2.out",
                        y: -10,
                        boxShadow: "0 15px 30px rgba(0, 240, 255, 0.3)"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        duration: 0.5,
                        ease: "power2.out",
                        y: 0,
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)"
                    });
                });
            });
        });

        // Efecto holográfico para la sección de contacto
        function initContactHologram() {
            const hologram = document.querySelector('.contact-hologram');
            const contactInfo = document.querySelector('.contact-info');

            if (!hologram || !contactInfo) return;

            // Efecto de movimiento con el cursor
            contactInfo.addEventListener('mousemove', (e) => {
                const x = e.clientX - contactInfo.getBoundingClientRect().left;
                const y = e.clientY - contactInfo.getBoundingClientRect().top;

                const centerX = contactInfo.offsetWidth / 2;
                const centerY = contactInfo.offsetHeight / 2;

                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;

                hologram.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });

            // Resetear posición al salir
            contactInfo.addEventListener('mouseleave', () => {
                hologram.style.transform = 'rotateX(0) rotateY(0)';
            });
        }

        document.addEventListener('DOMContentLoaded', initContactHologram);

        // Validación de formulario
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Validación simple
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;

                if (name && email && message) {
                    // Simular envío
                    const submitBtn = contactForm.querySelector('.submit-btn');
                    submitBtn.disabled = true;
                    submitBtn.querySelector('.button-text').textContent = 'ENVIANDO...';

                    // Simular tiempo de envío
                    setTimeout(() => {
                        submitBtn.querySelector('.button-text').textContent = 'MENSAJE ENVIADO!';
                        submitBtn.style.backgroundColor = '#27c93f';

                        // Resetear después de 2 segundos
                        setTimeout(() => {
                            contactForm.reset();
                            submitBtn.disabled = false;
                            submitBtn.querySelector('.button-text').textContent = 'ENVIAR MENSAJE';
                            submitBtn.style.backgroundColor = 'transparent';

                            // Mostrar notificación
                            showNotification('Mensaje enviado con éxito!');
                        }, 2000);
                    }, 1500);
                }
            });
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'cyber-notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            // Animación de entrada
            gsap.from(notification, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out"
            });

            // Ocultar después de 3 segundos
            setTimeout(() => {
                gsap.to(notification, {
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => notification.remove()
                });
            }, 3000);
        }

        // Animación de habilidades
        document.addEventListener('DOMContentLoaded', function () {
            const skillLevels = document.querySelectorAll('.skill-level');

            const animateSkills = () => {
                skillLevels.forEach(level => {
                    const width = level.getAttribute('data-level');
                    level.style.width = '0';
                    setTimeout(() => {
                        level.style.width = width + '%';
                    }, 500);
                });
            };

            // Animar cuando la sección sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkills();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(document.querySelector('.skills-section'));
        });

        // particles-config.js - Configuración de partículas
        document.addEventListener('DOMContentLoaded', function () {
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    particles: {
                        number: {
                            value: 80,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: "#00f0ff"
                        },
                        shape: {
                            type: "circle"
                        },
                        opacity: {
                            value: 0.5,
                            random: true
                        },
                        size: {
                            value: 3,
                            random: true
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: "#00f0ff",
                            opacity: 0.4,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: "none",
                            random: true,
                            straight: false,
                            out_mode: "out"
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: true,
                                mode: "repulse"
                            },
                            onclick: {
                                enable: true,
                                mode: "push"
                            }
                        }
                    }
                });
            }
        });

        // wolf-logo.js
        function initHourglass() {
            const canvas = document.getElementById('hourglassCanvas');
            if (!canvas || typeof THREE === 'undefined') return;

            // 1. CONFIGURACIÓN BÁSICA
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            renderer.setSize(80, 80);
            renderer.setPixelRatio(window.devicePixelRatio);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.z = 3.2; // Ajustado para el tamaño aumentado

            // 2. MATERIALES
            const wireframeMaterial = new THREE.MeshPhongMaterial({
                color: 0x00f0ff,
                emissive: 0x003333,
                specular: 0x00ffff,
                shininess: 100,
                transparent: true,
                opacity: 0.9,
                wireframe: true
            });

            const solidMaterial = new THREE.MeshPhongMaterial({
                color: 0x00f0ff,
                emissive: 0x002222,
                specular: 0x00ffff,
                shininess: 80,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });

            // 3. GEOMETRÍA DEL RELOJ DE ARENA MIXTO (TAMAÑO AUMENTADO)
            const hourglassGroup = new THREE.Group();
            
            // PARTE SUPERIOR (WIREFRAME)
            const topGroup = new THREE.Group();
            
            // Cono superior wireframe (más grande)
            const topCone = new THREE.ConeGeometry(1.0, 1.5, 16); // Aumentado
            const topMesh = new THREE.Mesh(topCone, wireframeMaterial);
            topMesh.position.y = 1.0; // Ajustado
            topMesh.rotation.x = Math.PI;
            topGroup.add(topMesh);

            // Base superior wireframe (más grande)
            const topBase = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 16); // Aumentado
            const topBaseMesh = new THREE.Mesh(topBase, wireframeMaterial);
            topBaseMesh.position.y = 1.6; // Ajustado
            topGroup.add(topBaseMesh);

            hourglassGroup.add(topGroup);

            // PARTE INFERIOR (SÓLIDA)
            const bottomGroup = new THREE.Group();
            
            // Cono inferior sólido (más grande)
            const bottomCone = new THREE.ConeGeometry(1.0, 1.5, 16); // Aumentado
            const bottomMesh = new THREE.Mesh(bottomCone, solidMaterial);
            bottomMesh.position.y = -1.0; // Ajustado
            bottomGroup.add(bottomMesh);

            // Base inferior sólida (más grande)
            const bottomBase = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 16); // Aumentado
            const bottomBaseMesh = new THREE.Mesh(bottomBase, solidMaterial);
            bottomBaseMesh.position.y = -1.6; // Ajustado
            bottomGroup.add(bottomBaseMesh);

            hourglassGroup.add(bottomGroup);

            // CONECTOR CENTRAL (más grueso)
            const connector = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12); // Aumentado
            const connectorMesh = new THREE.Mesh(connector, wireframeMaterial);
            connectorMesh.position.y = 0;
            hourglassGroup.add(connectorMesh);

            scene.add(hourglassGroup);

            // 4. ILUMINACIÓN
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);

            const directionalLight1 = new THREE.DirectionalLight(0x00ffff, 1.2);
            directionalLight1.position.set(2, 3, 4);
            scene.add(directionalLight1);

            const directionalLight2 = new THREE.DirectionalLight(0x00aaff, 0.6);
            directionalLight2.position.set(-2, -2, 3);
            scene.add(directionalLight2);

            // 5. ANIMACIÓN SUAVE
            function animate() {
                requestAnimationFrame(animate);
                
                hourglassGroup.rotation.x += 0.002;
                hourglassGroup.rotation.y += 0.004;
                
                renderer.render(scene, camera);
            }

            // 6. ESCALA FINAL - AUMENTADA para llenar más el espacio
            hourglassGroup.scale.set(0.75, 0.75, 0.75); // Aumentado de 0.65 a 0.75

            // 7. CENTRADO
            function centerHourglass() {
                hourglassGroup.position.set(0, 0, 0);
                renderer.render(scene, camera);
            }

            // Iniciar
            centerHourglass();
            animate();

            // Reforzar centrado
            setTimeout(centerHourglass, 100);
        }

        // Iniciar automáticamente
        if (typeof THREE !== 'undefined') {
            initHourglass();
        } else {
            window.addEventListener('load', initHourglass);
        }

        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', initWolfLogo);
