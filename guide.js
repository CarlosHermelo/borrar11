document.addEventListener('DOMContentLoaded', () => {
    // Solo se ejecuta una vez
    if (localStorage.getItem('pamiTourCompleted')) return;

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

    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.className = 'tour-popup';
    document.body.appendChild(popup);

    let currentStep = 0;

    function showStep(index) {
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
                popup.classList.remove('active');
                setTimeout(() => showStep(currentStep), 300);
            }, 3000);
        }, 600);
    }

    function finishTour() {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.remove();
            popup.remove();
            localStorage.setItem('pamiTourCompleted', 'true');
        }, 500);
    }

    // Iniciar con un pequeño delay
    setTimeout(() => {
        overlay.classList.add('visible');
        showStep(0);
    }, 1000);
});
