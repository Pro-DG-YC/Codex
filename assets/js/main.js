/*
    Archivo JavaScript principal.
    - Controla el menú móvil accesible.
    - Implementa el slider automático del hero con controles manuales.
    - Gestiona el mensaje de éxito simulado del formulario de contacto.
    - Actualiza dinámicamente el año del pie de página.
*/

document.addEventListener('DOMContentLoaded', () => {
    activarMenuMovil();
    iniciarSliderHero();
    prepararFormularioContacto();
    actualizarAnio();
});

function activarMenuMovil() {
    const botonToggle = document.querySelector('.navegacion__toggle');
    const listaMenu = document.querySelector('.navegacion__lista');

    if (!botonToggle || !listaMenu) return;

    botonToggle.addEventListener('click', () => {
        const expandido = botonToggle.getAttribute('aria-expanded') === 'true';
        botonToggle.setAttribute('aria-expanded', String(!expandido));
        botonToggle.setAttribute('aria-label', expandido ? 'Abrir menú' : 'Cerrar menú');
        listaMenu.classList.toggle('activo');
    });

    listaMenu.querySelectorAll('a').forEach((enlace) => {
        enlace.addEventListener('click', () => {
            botonToggle.setAttribute('aria-expanded', 'false');
            botonToggle.setAttribute('aria-label', 'Abrir menú');
            listaMenu.classList.remove('activo');
        });
    });
}

function iniciarSliderHero() {
    const slider = document.querySelector('[data-slider]');
    if (!slider) return;

    const diapositivas = Array.from(slider.querySelectorAll('.hero__slide'));
    const indicadores = Array.from(slider.querySelectorAll('.hero__indicador'));
    const botonPrev = slider.querySelector('[data-prev]');
    const botonNext = slider.querySelector('[data-next]');
    const intervalo = 5000; // 5 segundos
    let indiceActual = 0;
    let temporizador;

    const mostrarDiapositiva = (indice) => {
        diapositivas.forEach((slide, i) => {
            slide.classList.toggle('activo', i === indice);
        });
        indicadores.forEach((indicador, i) => {
            indicador.classList.toggle('activo', i === indice);
        });
        indiceActual = indice;
    };

    const avanzar = () => {
        const siguiente = (indiceActual + 1) % diapositivas.length;
        mostrarDiapositiva(siguiente);
    };

    const retroceder = () => {
        const anterior = (indiceActual - 1 + diapositivas.length) % diapositivas.length;
        mostrarDiapositiva(anterior);
    };

    const reiniciarTemporizador = () => {
        clearInterval(temporizador);
        temporizador = setInterval(avanzar, intervalo);
    };

    if (botonPrev) {
        botonPrev.addEventListener('click', () => {
            retroceder();
            reiniciarTemporizador();
        });
    }

    if (botonNext) {
        botonNext.addEventListener('click', () => {
            avanzar();
            reiniciarTemporizador();
        });
    }

    indicadores.forEach((indicador) => {
        indicador.addEventListener('click', () => {
            const indice = Number(indicador.dataset.indicador);
            mostrarDiapositiva(indice);
            reiniciarTemporizador();
        });
    });

    // Inicia el slider al cargar la página.
    mostrarDiapositiva(indiceActual);
    temporizador = setInterval(avanzar, intervalo);
}

function prepararFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    const mensaje = document.getElementById('mensaje-formulario');

    if (!formulario || !mensaje) return;

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            mensaje.textContent = 'Por favor, completa correctamente todos los campos.';
            mensaje.style.color = '#d93025';
            return;
        }

        // Simula un envío exitoso sin realizar petición real.
        mensaje.textContent = '¡Gracias! Hemos recibido tu solicitud y te contactaremos pronto.';
        mensaje.style.color = '#1f3c88';
        formulario.reset();
    });
}

function actualizarAnio() {
    const elementoAnio = document.getElementById('anio-actual');
    if (!elementoAnio) return;
    const anio = new Date().getFullYear();
    elementoAnio.textContent = anio;
}
