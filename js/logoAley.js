const logo = document.querySelector('.logo_aley');

        if (logo) {
            // 1. EFECTO DE ENCENDIDO al cargar
            setTimeout(() => {
                logo.classList.add('encendido');
                console.log('✨ Logo encendido');
            }, 100);

            // 2. EFECTO PULSANTE después de 1.5s
            setTimeout(() => {
                logo.classList.add('pulsing');
                console.log('💫 Efecto pulsante activado');
            }, 1500);

            // 3. DESTELLO ALEATORIO (cada 6-10 segundos)
            setInterval(() => {
                const glowOriginal = logo.style.filter;
                logo.style.filter = 'drop-shadow(0 0 35px rgba(37, 99, 235, 0.9))';
                logo.style.transform = 'scale(1.01)';

                setTimeout(() => {
                    if (logo.classList.contains('pulsing')) {
                        logo.style.filter = '';
                    } else {
                        logo.style.filter = 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))';
                    }
                    logo.style.transform = '';
                }, 250);

                console.log('⚡ Brillo aleatorio');
            }, 8000);

            // 4. EFECTO DE CLICK
            logo.addEventListener('click', () => {
                logo.classList.add('click-effect');
                console.log('🖱️ Logo clickeado');

                setTimeout(() => {
                    logo.classList.remove('click-effect');
                }, 150);
            });

            // 5. HOVER manual (ya está en CSS, pero añadimos log)
            logo.addEventListener('mouseenter', () => {
                console.log('🔆 Hover activado');
            });

            console.log('✅ Efectos aplicados a tu PNG');
        } else {
            console.error('❌ No se encontró la imagen /logo_aley.png');
        }