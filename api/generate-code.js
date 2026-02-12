// API para generar nuevos códigos de acceso
// Archivo: /api/generate-code.js

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

// Guardar códigos
function saveCodes(codes) {
  ensureCodesFile();
  fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Código no proporcionado' 
      });
    }

    const codes = readCodes();

    // Verificar que el código no exista ya
    const exists = codes.find(c => c.code === code);
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este código ya existe' 
      });
    }

    // Crear nuevo código
    const newCode = {
      code: code,
      createdAt: new Date().toISOString(),
      used: false,
      usedAt: null
    };

    codes.push(newCode);
    saveCodes(codes);

    return res.status(200).json({
      success: true,
      message: 'Código generado correctamente',
      code: newCode
    });

  } catch (error) {
    console.error('Error generando código:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};
