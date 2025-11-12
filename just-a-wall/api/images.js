// api/images.js
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join('/tmp', 'wall-images.json');

// Helper to read data
const readData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Read error:', error);
  }
  return { images: [] };
};

// Helper to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Write error:', error);
    return false;
  }
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Get images
    const data = readData();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    // Save images
    const { images } = req.body;
    const success = writeData({ images });
    
    if (success) {
      return res.status(200).json({ success: true, images });
    } else {
      return res.status(500).json({ success: false, error: 'Failed to save' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}