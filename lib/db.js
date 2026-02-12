// Base de datos usando Vercel KV (Redis)
// Almacenamiento PERMANENTE y confiable

import { kv } from '@vercel/kv';

const CODES_KEY = 'dexter_codes';

// Obtener todos los códigos
export async function getAllCodes() {
  try {
    const codes = await kv.get(CODES_KEY);
    return codes || [];
  } catch (error) {
    console.error('Error obteniendo códigos:', error);
    return [];
  }
}

// Agregar nuevo código
export async function addCode(codeData) {
  try {
    const codes = await getAllCodes();
    codes.push(codeData);
    await kv.set(CODES_KEY, codes);
    return codeData;
  } catch (error) {
    console.error('Error agregando código:', error);
    throw error;
  }
}

// Buscar código específico
export async function findCode(codeStr) {
  try {
    const codes = await getAllCodes();
    return codes.find(c => c.code === codeStr);
  } catch (error) {
    console.error('Error buscando código:', error);
    return null;
  }
}

// Marcar código como usado
export async function markCodeAsUsed(codeStr) {
  try {
    const codes = await getAllCodes();
    const index = codes.findIndex(c => c.code === codeStr);
    
    if (index !== -1 && !codes[index].used) {
      codes[index].used = true;
      codes[index].usedAt = new Date().toISOString();
      await kv.set(CODES_KEY, codes);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error marcando código:', error);
    throw error;
  }
}
