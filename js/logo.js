(function () {
            // Elementos de los cuadrados
            const cuad1 = document.getElementById('cuad1');
            const cuad2 = document.getElementById('cuad2');
            const cuad3 = document.getElementById('cuad3');

            // --- SECUENCIA INFINITA FIJA (SIN BOTONES, SIN MANIPULACIÓN) ---
            // La secuencia es automática, en bucle, y no se puede detener desde la UI.

            // Función que apaga todo (uso interno)
            function apagarTodo() {
                cuad1.classList.remove('encendido');
                cuad2.classList.remove('encendido');
                cuad3.classList.remove('encendido');
            }

            // Función que ejecuta un ciclo: enciende 1, luego 2, luego 3, espera, apaga todos, repite.
            function iniciarCicloInfinito() {
                // estados del ciclo
                // usaremos timeouts encadenados para una secuencia precisa y limpia

                // Paso 1: apagar todo al inicio del ciclo (por si acaso)
                apagarTodo();

                // timeout para encender cuadrado pequeño (c1)
                setTimeout(() => {
                    cuad1.classList.add('encendido');
                }, 200);  // 0.2s

                // timeout para encender mediano (c2) (manteniendo pequeño)
                setTimeout(() => {
                    cuad2.classList.add('encendido');
                }, 700);  // 0.7s

                // timeout para encender grande (c3) (ambos anteriores ya encendidos)
                setTimeout(() => {
                    cuad3.classList.add('encendido');
                }, 1200); // 1.2s

                // timeout para APAGAR TODO después de que hayan lucido juntos
                setTimeout(() => {
                    apagarTodo();
                }, 2200); // 2.2s (los tres encendidos durante 1 segundo aprox)

                // el ciclo total dura 2200ms + un pequeño silencio.
                // Repetimos cada 3000ms (3 segundos) para que haya un breve lapso con todo apagado
                // y se note el "prender y apagar" constante.
            }

            // Ejecutar ciclo cada 3000ms (3 seg) -> bucle infinito
            // pero también hay que considerar que los timeouts internos del ciclo anterior no deben solaparse.
            // Vamos a usar setInterval que llama a "iniciarCicloInfinito" cada 3s, pero antes de cada llamada
            // debemos limpiar los timeouts previos (por seguridad) y apagar cualquier resto.
            let timeoutIds = [];

            function limpiarTimeouts() {
                timeoutIds.forEach(id => clearTimeout(id));
                timeoutIds = [];
            }

            // Versión mejorada: guardamos cada timeout para poder cancelar antes del siguiente ciclo
            function ejecutarCicloConTimeouts() {
                // limpiar timeouts anteriores (por si el ciclo anterior aún tenía algún remanente)
                limpiarTimeouts();
                // apagar todos los cuadrados (estado inicial)
                apagarTodo();

                // programar cada paso y guardar el id
                const t1 = setTimeout(() => cuad1.classList.add('encendido'), 200);
                const t2 = setTimeout(() => cuad2.classList.add('encendido'), 700);
                const t3 = setTimeout(() => cuad3.classList.add('encendido'), 1200);
                const t4 = setTimeout(() => apagarTodo(), 2200);  // apagar a los 2.2s

                timeoutIds.push(t1, t2, t3, t4);
            }

            // Iniciar el intervalo que llama a ejecutarCicloConTimeouts cada 3000ms
            // Pero también queremos que el primer ciclo arranque inmediatamente, no espere 3s.
            ejecutarCicloConTimeouts();  // primer ciclo instantáneo

            // Luego cada 3000ms repetir (incluye 800ms de pausa con todo apagado entre ciclos)
            const intervalo = setInterval(() => {
                ejecutarCicloConTimeouts();
            }, 3000); // 3 segundos

            // No proporcionamos ningún botón para detener/alterar.
            // La secuencia es fija e infinita, tal como pides.

            // Opcional: si el usuario hiciera clic en los cuadrados, no debe interrumpir.
            // Pero mejor prevenimos cualquier interferencia bloqueando eventos.
            cuad1.addEventListener('click', (e) => e.stopPropagation());
            cuad2.addEventListener('click', (e) => e.stopPropagation());
            cuad3.addEventListener('click', (e) => e.stopPropagation());

            // También limpiamos todo si por algún motivo se descargara la página (no necesario)
            window.addEventListener('beforeunload', () => {
                clearInterval(intervalo);
                limpiarTimeouts();
            });

            // Aseguramos que si hay algún error, no se detenga.
        })();