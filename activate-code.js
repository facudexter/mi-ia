// API endpoint para activar códigos de compra
// Archivo: /api/activate-code.js

const fs = require('fs');
const path = require('path');

// Path to codes database (en producción usarías una DB real)
const CODES_FILE = path.join(process.cwd(), 'data', 'codes.json');

// Asegurar que existe el directorio data
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(CODES_FILE)) {
    fs.writeFileSync(CODES_FILE, JSON.stringify([]));
  }
}

// Leer códigos
function readCodes() {
  ensureDataDir();
  try {
    const data = fs.readFileSync(CODES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Guardar códigos
function saveCodes(codes) {
  ensureDataDir();
  fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
}

module.exports = async (req, res) => {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Código no proporcionado' 
      });
    }

    // Normalizar código
    const normalizedCode = code.trim().toUpperCase();

    // Leer todos los códigos
    const codes = readCodes();

    // Buscar el código
    const codeIndex = codes.findIndex(c => c.code === normalizedCode);

    if (codeIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Código no encontrado' 
      });
    }

    const foundCode = codes[codeIndex];

    // Verificar si ya fue usado
    if (foundCode.used) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este código ya fue usado' 
      });
    }

    // Marcar como usado
    codes[codeIndex].used = true;
    codes[codeIndex].usedAt = new Date().toISOString();

    // Guardar cambios
    saveCodes(codes);

    // Retornar éxito con información del plan
    const response = {
      success: true,
      messages: foundCode.messages,
      unlimited: foundCode.plan === 'unlimited'
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error activando código:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};
