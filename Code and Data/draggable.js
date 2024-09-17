document.addEventListener('DOMContentLoaded', (event) => {
    const draggable = document.querySelector('.draggable');
    const lockButton = document.getElementById('lockButton');
    let isDragging = false;
    let isLocked = false;
    let offsetX, offsetY;

    lockButton.addEventListener('click', () => {
        isLocked = !isLocked;
        lockButton.innerHTML = isLocked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-unlock"></i>';
    });

    draggable.addEventListener('mousedown', (e) => {
        if (!isLocked) {
            isDragging = true;
            offsetX = e.clientX - draggable.getBoundingClientRect().left;
            offsetY = e.clientY - draggable.getBoundingClientRect().top;
            draggable.style.position = 'absolute';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && !isLocked) {
            draggable.style.left = `${e.clientX - offsetX + window.scrollX}px`;
            draggable.style.top = `${e.clientY - offsetY + window.scrollY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (!isLocked) {
            isDragging = false;
            // Save the position to session storage
            sessionStorage.setItem('controlsPosition', JSON.stringify({
                left: draggable.style.left,
                top: draggable.style.top
            }));
        }
    });

    // Load the position from session storage
    const savedPosition = JSON.parse(sessionStorage.getItem('controlsPosition'));
    if (savedPosition) {
        draggable.style.left = savedPosition.left;
        draggable.style.top = savedPosition.top;
    }
});
