import { findCode, markCodeAsUsed } from '../lib/db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });
  }

  try {
    const { code } = req.body;

    // Validar que se envió un código
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Por favor ingresá un código válido' 
      });
    }

    // Normalizar código (mayúsculas, sin espacios)
    const normalizedCode = code.trim().toUpperCase();

    // Validar formato básico
    if (!normalizedCode.startsWith('DEXTER-') || normalizedCode.length < 15) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formato de código inválido. Debe ser DEXTER-XXXXXXXX' 
      });
    }

    // Buscar código en la base de datos
    const foundCode = await findCode(normalizedCode);

    // Verificar si el código existe
    if (!foundCode) {
      return res.status(404).json({ 
        success: false, 
        error: 'Código no encontrado. Verificá que esté bien escrito.' 
      });
    }

    // Verificar si ya fue usado
    if (foundCode.used) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este código ya fue usado anteriormente. Cada código es de un solo uso.' 
      });
    }

    // ✅ Marcar código como usado en la base de datos
    const marked = await markCodeAsUsed(normalizedCode);
    
    if (!marked) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error activando el código. Intentá de nuevo.' 
      });
    }

    // 🎉 Código activado exitosamente
    return res.status(200).json({
      success: true,
      message: '🎉 ¡Código activado! Acceso permanente desbloqueado'
    });

  } catch (error) {
    console.error('❌ Error en activate-code:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error del servidor. Intentá de nuevo en unos segundos.' 
    });
  }
}
