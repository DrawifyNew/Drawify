let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
let scale = 1;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        document.body.style.cursor = 'grab';
        
        document.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        document.body.style.cursor = 'default';
        
        document.removeEventListener('mousedown', startDragging);
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
    }
});

// Add wheel event listener for zooming
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    // Adjust zoom sensitivity here
    scale *= delta > 0 ? 0.9 : 1.1;
    // Limit minimum and maximum zoom
    scale = Math.min(Math.max(0.1, scale), 10);
    updateTransform();
}, { passive: false });

function startDragging(e) {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    document.body.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging) return;
    
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    updateTransform();
}

function updateTransform() {
    document.querySelector('canvas').style.transform = 
        `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

function stopDragging() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}