import { getAllCodes, addCode } from '../lib/db.js';

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

    // Validar código
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Código inválido o no proporcionado' 
      });
    }

    // Validar formato DEXTER-XXXXXXXX
    if (!code.startsWith('DEXTER-') || code.length < 15) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formato de código inválido. Debe ser DEXTER-XXXXXXXX' 
      });
    }

    // Verificar duplicados
    const codes = await getAllCodes();
    const exists = codes.find(c => c.code === code);
    
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        error: 'Este código ya existe. Genera uno nuevo.' 
      });
    }

    // Crear código nuevo
    const newCode = {
      code: code,
      createdAt: new Date().toISOString(),
      used: false,
      usedAt: null
    };

    // Guardar en base de datos
    await addCode(newCode);

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Código generado y guardado correctamente',
      code: newCode
    });

  } catch (error) {
    console.error('❌ Error en generate-code:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error del servidor. Contactá al administrador.' 
    });
  }
}
