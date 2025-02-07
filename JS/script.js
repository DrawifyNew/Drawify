let isDragging = false;
let startX, startY;
let offsetX = -500, offsetY = -500;
let scale = 0.4;
let canvas = document.querySelector('canvas');

// Ensure the canvas starts centered by setting the initial position
window.addEventListener('load', () => {
    updateTransform(); // Apply the initial transform
});

// Event listener for spacebar press to start dragging
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        document.body.style.cursor = 'grab';
        
        document.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }
});

// Event listener for spacebar release to stop dragging
document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        document.body.style.cursor = 'default';
        
        document.removeEventListener('mousedown', startDragging);
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
    }
});

// Event listener for zooming with the mouse wheel
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    
    // Adjust zoom sensitivity here
    scale *= delta > 0 ? 0.9 : 1.1;
    
    // Limit minimum and maximum zoom
    scale = Math.min(Math.max(0.1, scale), 10);
    updateTransform();
}, { passive: false });

// Start dragging function
function startDragging(e) {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    document.body.style.cursor = 'grabbing';
}

// Drag function
function drag(e) {
    if (!isDragging) return;
    
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    updateTransform();
}

// Update the transform properties of the canvas
function updateTransform() {
    canvas.style.transform = 
        `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// Stop dragging function
function stopDragging() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}














/*-------------------Pop-Up--------------------*/

// Get the modal and the help link
const modal = document.getElementById('helpModal');
const helpLink = document.getElementById('helpLink');
const closeBtn = document.getElementById('closeBtn');

// Open the modal when the Help link is clicked
helpLink.addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the link from navigating
    modal.style.display = 'block';  // Show the modal
});

// Close the modal when the close button is clicked
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';  // Hide the modal
});

// Close the modal if the user clicks outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';  // Hide the modal
    }
});


/*-------------------tool-bar--------------------*/

// Get all tool buttons
const toolButtons = document.querySelectorAll('.tool-btn');
const canvasContainer = document.querySelector('.canvas-container');

// Function to handle tool selection
function selectTool(event) {
    // Remove active class from all buttons
    toolButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update cursor based on selected tool
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

// Add click event listener to each tool button
toolButtons.forEach(button => {
    button.addEventListener('click', selectTool);
});
