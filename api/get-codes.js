// API para obtener todos los códigos
// Archivo: /api/get-codes.js

const fs = require('fs');
const path = require('path');

const CODES_FILE = path.join('/tmp', 'codes.json');

// Asegurar archivo
function ensureCodesFile() {
  if (!fs.existsSync(CODES_FILE)) {
    fs.writeFileSync(CODES_FILE, JSON.stringify([]));
  }
}

// Leer códigos
function readCodes() {
  ensureCodesFile();
  try {
    const data = fs.readFileSync(CODES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const codes = readCodes();

    return res.status(200).json({
      success: true,
      codes: codes
    });

  } catch (error) {
    console.error('Error obteniendo códigos:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};
