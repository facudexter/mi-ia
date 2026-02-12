import { findCode, markCodeAsUsed } from './_storage.js';

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
        error: 'Por favor ingresá un código válido' 
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode.startsWith('DEXTER-') || normalizedCode.length < 15) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formato de código inválido' 
      });
    }

    const foundCode = findCode(normalizedCode);

    if (!foundCode) {
      return res.status(404).json({ 
        success: false, 
        error: 'Código no encontrado' 
      });
    }

    if (foundCode.used) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este código ya fue usado anteriormente' 
      });
    }

    const marked = markCodeAsUsed(normalizedCode);
    
    if (!marked) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error activando el código' 
      });
    }

    return res.status(200).json({
      success: true,
      message: '🎉 ¡Código activado! Acceso permanente desbloqueado'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error del servidor: ' + error.message
    });
  }
}
