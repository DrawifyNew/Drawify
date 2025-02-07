import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Workaround for `__dirname` in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Parse JSON body
app.use(bodyParser.json());

// Serve static files from the root folder (current working directory)
app.use(express.static(__dirname));

// Endpoint to save the drawing
app.post('/save-drawing', (req, res) => {
  const { image } = req.body;

  // Remove the data URL prefix
  const base64Data = image.replace(/^data:image\/png;base64,/, '');

  // Save the image to a file
  const imagePath = path.join(__dirname, 'saved-image.png'); // Saving in the root directory
  fs.writeFile(imagePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ success: false });
    }
    console.log('Image saved successfully');
    res.json({ success: true, imageUrl: '/saved-image.png' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});