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














/*------------------------------------------------------*/

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

