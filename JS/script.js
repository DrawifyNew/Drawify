let isDragging = false;
let isSpacePressed = false;
let drawing = false;
let startX, startY;
let offsetX = -500, offsetY = -500;
let scale = 0.4;
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");

// Zorg ervoor dat het canvas start met de juiste positie
window.addEventListener('load', () => {
    updateTransform();
});

// Spatiebalk indrukken -> pannen activeren
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        isSpacePressed = true;
        document.body.style.cursor = 'grab';
    }
});

// Spatiebalk loslaten -> pannen stoppen
document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        isSpacePressed = false;
        document.body.style.cursor = 'default';
    }
});

// Muis indrukken: tekenen of pannen
canvas.addEventListener("mousedown", (e) => {
    if (isSpacePressed) {
        // Begin met slepen
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        document.body.style.cursor = 'grabbing';
    } else {
        // Begin met tekenen
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
});

// Muis bewegen: tekenen of pannen
canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        updateTransform();
    } else if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

// Muis loslaten: stoppen met tekenen of slepen
canvas.addEventListener("mouseup", () => {
    isDragging = false;
    drawing = false;
    if (isSpacePressed) {
        document.body.style.cursor = 'grab';
    }
});

// Muis verlaat canvas: stoppen met tekenen
canvas.addEventListener("mouseleave", () => {
    drawing = false;
});

// Update transform voor pannen en zoomen
function updateTransform() {
    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// Zoomen met scrollwiel
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    scale *= delta > 0 ? 0.9 : 1.1;
    scale = Math.min(Math.max(0.1, scale), 10);
    updateTransform();
}, { passive: false });

/*------------------- Drawing --------------------*/
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
    if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
});

canvas.addEventListener("mouseleave", () => {
    drawing = false;
});

/*------------------- Save Drawing --------------------*/
window.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    const savedImage = document.getElementById('savedImage');

    if (saveButton && savedImage && canvas) {
        saveButton.addEventListener('click', () => {
            const image = canvas.toDataURL('image/png');
            savedImage.src = image;

            fetch('/save-drawing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image }),
            })
            .then(response => response.json())
            .then(data => console.log('Image successfully saved:', data))
            .catch(error => console.error('Error:', error));
        });
    }
});

/*------------------- Pop-Up --------------------*/
const modal = document.getElementById('helpModal');
const helpLink = document.getElementById('helpLink');
const closeBtn = document.getElementById('closeBtn');

helpLink.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

/*------------------- Tool Bar --------------------*/
const toolButtons = document.querySelectorAll('.tool-btn');
const canvasContainer = document.querySelector('.canvas-container');

function selectTool(event) {
    toolButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    switch(event.target.id) {
        case 'select-tool':
            canvasContainer.style.cursor = 'default';
            break;
        case 'pan-tool':
            canvasContainer.style.cursor = 'grab';
            break;
        case 'zoom-tool':
            canvasContainer.style.cursor = 'zoom-in';
            break;
    }
}

toolButtons.forEach(button => {
    button.addEventListener('click', selectTool);
});
