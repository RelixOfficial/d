/*
Project: Vercel Express-like Serverless Decode App
Using npm module: webcrack (latest)
Structure:

├── api
│   └── decode.js        # serverless function handling file upload + decode
├── public
│   └── index.html       # simple form UI
├── package.json         # dependencies & scripts
└── vercel.json          # Vercel config
*/

// api/decode.js
const multer = require('multer');
const { webcrack } = require('webcrack');

// Disable built-in body parsing so Multer can handle multipart
export const config = { api: { bodyParser: false } };

const upload = multer();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      res.status(500).send('Upload Error');
      return;
    }
    try {
      const buffer = req.file.buffer;
      // Decode using webcrack module
      const decoded = await webcrack(buffer.toString());

      // Generate download filename
      const original = req.file.originalname;
      const base = original.replace(/\.[^/.]+$/, '');
      const filename = `decode-${base}.js`;

      // Send as attachment
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/javascript');
      res.send(decoded);
    } catch (e) {
      res.status(500).send('Decode Error: ' + e.message);
    }
  });
}


// public/index.html


// package.json


// vercel.json
