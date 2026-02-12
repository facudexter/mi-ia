// API para validar y activar códigos de acceso permanente (UN SOLO USO)
// Archivo: /api/activate-code.js

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

    const normalizedCode = code.trim().toUpperCase();
    const codes = readCodes();
    const codeIndex = codes.findIndex(c => c.code === normalizedCode);

    // Verificar si el código existe
    if (codeIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Código no encontrado o inválido' 
      });
    }

    const foundCode = codes[codeIndex];

    // Verificar si ya fue usado
    if (foundCode.used) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este código ya fue usado anteriormente' 
      });
    }

    // ✅ Marcar como usado
    codes[codeIndex].used = true;
    codes[codeIndex].usedAt = new Date().toISOString();
    saveCodes(codes);

    // Responder éxito
    return res.status(200).json({
      success: true,
      message: '🎉 Acceso permanente activado correctamente'
    });

  } catch (error) {
    console.error('Error activando código:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};
