document.addEventListener('DOMContentLoaded', () => {
    const steps = [
        { id: 'nombre', message: 'Ingresá tu nombre tal como figura en tu DNI.' },
        { id: 'apellido', message: 'Ingresá tu apellido completo.' },
        { id: 'dni', message: 'Tu número de documento sin puntos ni espacios.' },
        { id: 'sexo', message: 'Seleccioná tu sexo según tu documento.' },
        { id: 'afiliado', message: 'Tu número de afiliación lo encontrás en tu credencial PAMI.' },
        { id: 'btn-continuar', message: '¡Listo! Hacé clic acá para continuar con tu consulta.' }
    ];

    // Aseguramos que el botón tenga un ID para referenciarlo
    const btnContinuar = document.querySelector('.btn-continuar');
    if (btnContinuar) btnContinuar.id = 'btn-continuar';

    let overlay, popup;
    let currentStep = 0;
    let tourActive = false;

    function createTourElements() {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'tour-overlay';
            document.body.appendChild(overlay);
        }
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'tour-popup';
            document.body.appendChild(popup);
        }
    }

    function showStep(index) {
        if (!tourActive) return;

        if (index >= steps.length) {
            finishTour();
            return;
        }

        const step = steps[index];
        const target = document.getElementById(step.id);

        if (!target) {
            showStep(index + 1);
            return;
        }

        popup.innerHTML = step.message;
        popup.classList.remove('active');

        // Scroll suave al campo
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            if (!tourActive) return;
            const rect = target.getBoundingClientRect();
            const scrollY = window.scrollY;

            // Posicionar arriba del campo
            popup.style.left = `${rect.left}px`;
            popup.style.top = `${rect.top + scrollY - popup.offsetHeight - 20}px`;
            popup.className = 'tour-popup active arrow-bottom';

            // Ajustar si se sale por arriba
            if (rect.top < popup.offsetHeight + 40) {
                popup.style.top = `${rect.bottom + scrollY + 20}px`;
                popup.className = 'tour-popup active arrow-top';
            }

            currentStep++;

            // Tiempo que dura cada mensaje
            setTimeout(() => {
                if (!tourActive) return;
                popup.classList.remove('active');
                setTimeout(() => showStep(currentStep), 300);
            }, 3000);
        }, 600);
    }

    function startTour() {
        if (tourActive) return;
        tourActive = true;
        currentStep = 0;
        createTourElements();
        overlay.classList.add('visible');
        showStep(0);
    }

    function finishTour() {
        tourActive = false;
        if (overlay) overlay.classList.remove('visible');
        if (popup) popup.classList.remove('active');

        setTimeout(() => {
            if (overlay) overlay.remove();
            if (popup) popup.remove();
            overlay = null;
            popup = null;
            localStorage.setItem('pamiTourCompleted', 'true');
        }, 500);
    }

    // Botón para repetir el tutorial
    const btnTutorial = document.getElementById('btn-tutorial');
    if (btnTutorial) {
        btnTutorial.addEventListener('click', startTour);
    }

    // Auto-ejecución solo la primera vez
    if (!localStorage.getItem('pamiTourCompleted')) {
        setTimeout(startTour, 1000);
    }
});
