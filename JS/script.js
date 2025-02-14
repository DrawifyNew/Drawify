let isDragging = false;
let isSpacePressed = false;
let drawing = false;
let startX, startY;
let offsetX = -500, offsetY = -500;
let scale = 0.4;
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");

// Initialize the drawing color
let drawColor = "#000000";

// Update the drawing color when the color picker value changes
document.getElementById('colorPicker').addEventListener('input', (e) => {
    drawColor = e.target.value;
});

// Ensure the canvas starts with the correct position
window.addEventListener('load', () => {
    updateTransform();
    loadSavedImage();
});

// Press spacebar to activate panning
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        isSpacePressed = true;
        document.body.style.cursor = 'grab';
    }
});

// Release spacebar to stop panning
document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        isSpacePressed = false;
        document.body.style.cursor = 'default';
    }
});

// Mouse down: draw or pan
canvas.addEventListener("mousedown", (e) => {
    if (isSpacePressed) {
        // Start dragging
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        document.body.style.cursor = 'grabbing';
    } else {
        // Start drawing
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = drawColor;  // Set the stroke color to the selected color
    }
});

// Mouse move: draw or pan
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

// Mouse up: stop drawing or dragging
canvas.addEventListener("mouseup", () => {
    isDragging = false;
    drawing = false;
    if (isSpacePressed) {
        document.body.style.cursor = 'grab';
    }
});

// Mouse leave canvas: stop drawing
canvas.addEventListener("mouseleave", () => {
    drawing = false;
});

// Update transform for panning and zooming
function updateTransform() {
    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// Zoom with scroll wheel
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    scale *= delta > 0 ? 0.9 : 1.1;
    scale = Math.min(Math.max(0.1, scale), 10);
    updateTransform();
}, { passive: false });

// Save drawing
window.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    const savedImage = document.getElementById('savedImage');

    if (saveButton && canvas) {
        saveButton.addEventListener('click', () => {
            const image = canvas.toDataURL('image/png');
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

// Load saved image (if any)
function loadSavedImage() {
    const urlParams = new URLSearchParams(window.location.search);
    const imageSrc = urlParams.get('image');
    if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }
}

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


// Recent color js

let recentColors = [];

// Load recent colors from local storage
function loadRecentColors() {
    const storedColors = localStorage.getItem('recentColors');
    if (storedColors) {
        recentColors = JSON.parse(storedColors);
        renderRecentColors();
    }
}

// Save recent colors to local storage
function saveRecentColors() {
    localStorage.setItem('recentColors', JSON.stringify(recentColors));
}

// Add recent color to the list
function addRecentColor(color) {
    if (!recentColors.includes(color)) {
        recentColors.push(color);
        if (recentColors.length > 5) {
            recentColors.shift();
        }
        saveRecentColors();
        renderRecentColors();
    }
}

// Render recent colors
function renderRecentColors() {
    const colorList = document.getElementById('colorList');
    colorList.innerHTML = '';
    recentColors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color-block';
        colorButton.style.backgroundColor = color;
        colorButton.addEventListener('click', () => {
            drawColor = color;
            document.getElementById('colorPicker').value = color;
        });
        colorList.appendChild(colorButton);
    });
}

// Load recent colors when the page loads 
window.addEventListener('load', () => {
    loadRecentColors();
});

// Add event listener to recent colors
document.getElementById('colorList').addEventListener('click', (e) => {
    if (e.target.classList.contains('color-block')) {
        drawColor = e.target.style.backgroundColor;
        document.getElementById('colorPicker').value = drawColor;
    }
});

// Update the drawing color when the color picker value changes
document.getElementById('colorPicker').addEventListener('change', (e) => {
    drawColor = e.target.value;
    addRecentColor(drawColor);
});