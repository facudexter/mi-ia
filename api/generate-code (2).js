import { getAllCodes, addCode } from './_storage.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });
  }

  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Código inválido o no proporcionado' 
      });
    }

    if (!code.startsWith('DEXTER-') || code.length < 15) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formato de código inválido' 
      });
    }

    const codes = getAllCodes();
    const exists = codes.find(c => c.code === code);
    
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        error: 'Este código ya existe' 
      });
    }

    const newCode = {
      code: code,
      createdAt: new Date().toISOString(),
      used: false,
      usedAt: null
    };

    addCode(newCode);

    return res.status(200).json({
      success: true,
      message: 'Código generado correctamente',
      code: newCode
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error del servidor: ' + error.message
    });
  }
}
