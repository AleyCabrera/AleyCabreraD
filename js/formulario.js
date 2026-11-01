
    const form = document.getElementById("myForm");
    const status = document.getElementById("form-status");

    form.addEventListener("submit", async function(event) {
        event.preventDefault(); // 1. Evita que el navegador abra la nueva pestaña

        const data = new FormData(form);

        // 2. Envía los datos a Formspree en segundo plano
        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // 3. Si todo sale bien: Limpiamos el formulario y mostramos mensaje
                form.reset(); 
                status.innerHTML = "¡Gracias! Tu mensaje ha sido enviado con éxito.";
                status.style.color = "green";
                status.style.display = "block";
                
                // Opcional: Ocultar el mensaje después de 5 segundos
                setTimeout(() => { status.style.display = "none"; }, 5000);
            } else {
                // Si hay un error en Formspree
                response.json().then(data => {
                    status.innerHTML = "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.";
                    status.style.color = "red";
                    status.style.display = "block";
                });
            }
        }).catch(error => {
            // Si hay un error de red
            status.innerHTML = "Error de conexión. Revisa tu internet e inténtalo de nuevo.";
            status.style.color = "red";
            status.style.display = "block";
        });
    });
