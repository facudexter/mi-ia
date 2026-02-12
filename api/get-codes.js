import { getAllCodes } from '../lib/db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });
  }

  try {
    // Obtener todos los códigos de la base de datos
    const codes = await getAllCodes();

    return res.status(200).json({
      success: true,
      codes: codes,
      total: codes.length,
      active: codes.filter(c => !c.used).length,
      used: codes.filter(c => c.used).length
    });

  } catch (error) {
    console.error('❌ Error en get-codes:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error obteniendo códigos del servidor',
      codes: []
    });
  }
}
