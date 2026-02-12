// Storage global compartido entre todas las funciones
// Funciona en Vercel sin dependencias adicionales

if (!global.codesDatabase) {
  global.codesDatabase = [];
}

export function getAllCodes() {
  return global.codesDatabase || [];
}

export function addCode(codeData) {
  if (!global.codesDatabase) {
    global.codesDatabase = [];
  }
  global.codesDatabase.push(codeData);
  return codeData;
}

export function findCode(codeStr) {
  const codes = global.codesDatabase || [];
  return codes.find(c => c.code === codeStr);
}

export function markCodeAsUsed(codeStr) {
  if (!global.codesDatabase) {
    global.codesDatabase = [];
    return false;
  }
  
  const index = global.codesDatabase.findIndex(c => c.code === codeStr);
  if (index !== -1 && !global.codesDatabase[index].used) {
    global.codesDatabase[index].used = true;
    global.codesDatabase[index].usedAt = new Date().toISOString();
    return true;
  }
  return false;
}
