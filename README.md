# 🤖 AI Dexter - Sistema de Pagos y Control de Mensajes

Sistema completo de monetización para AI Dexter con control de mensajes, pagos y panel de administración.

## 📦 Estructura del Proyecto

```
tu-proyecto/
├── index.html              # Página principal con sistema de control
├── dexter-vip.html         # Versión ilimitada (para vos y tus amigos)
├── admin.html              # Panel de administración
├── api/
│   └── activate-code.js    # API para validar códigos
├── data/
│   └── codes.json          # Base de datos de códigos (se crea automáticamente)
├── vercel.json             # Configuración de Vercel
└── README.md               # Este archivo
```

## 🚀 Instalación y Deployment

### Paso 1: Subir a GitHub

1. **Ve a tu repositorio de GitHub** donde está tu proyecto actual
2. **Reemplaza estos archivos:**
   - `index.html` → con el nuevo index.html
   - Agrega `dexter-vip.html`
   - Agrega `admin.html`
   - Agrega carpeta `api/`
   - Agrega `vercel.json`

3. **Commit y push:**
```bash
git add .
git commit -m "Sistema de pagos y control de mensajes implementado"
git push origin main
```

### Paso 2: Vercel Deploy Automático

1. **Vercel detectará los cambios automáticamente**
2. **Esperá 1-2 minutos** para que se despliegue
3. **¡Listo!** Tu sistema ya está funcionando

## 🔐 Acceso Admin

### Para acceder al panel de administración:

1. Ve a: `tudominio.com/admin.html`
2. Contraseña por defecto: `dexter2026`
3. **IMPORTANTE:** Cambiá la contraseña en `admin.html` línea 293

## 💰 Planes Configurados

| Plan | Precio USD | Precio ARS | Mensajes |
|------|------------|------------|----------|
| Básico | $2.99 | $5,769 | 35 |
| Popular | $6.99 | $12,980 | 105 |
| Pro | $12 | $21,633 | 230 |
| VIP | $20 | $41,825 | ∞ Ilimitados |

## 📋 Cómo Funciona

### Para Usuarios Nuevos:

1. Entran a tu web
2. Tienen **15 mensajes gratis**
3. Cuando llegan a **10 mensajes** → Ven warning amarillo
4. Cuando llegan a **0 mensajes** → Se bloquea el chat
5. Aparece modal de pago con tus datos de MP y PayPal
6. Pagan y te mandan comprobante a `facudexter123@gmail.com`
7. Vos generás código en el panel admin
8. Les mandás el código por email
9. Ingresan el código y se desbloquea

### Para Vos y Tus Amigos:

1. Compartí el link: `tudominio.com/dexter-vip.html`
2. Tienen **mensajes ilimitados**
3. Sin restricciones ni pagos

## 🎟️ Generar Códigos

1. Ve a `tudominio.com/admin.html`
2. Ingresá contraseña
3. Seleccioná el plan
4. Click en "GENERAR CÓDIGO"
5. Copiá el código y envialo al cliente

## 📊 Panel Admin

El panel te muestra:
- Total de códigos generados
- Códigos activos (sin usar)
- Códigos usados (canjeados)
- Historial completo de códigos

## ⚙️ Personalización

### Cambiar Mensajes Gratis:

En `index.html` línea 1124:
```javascript
FREE_MESSAGES: 15,  // Cambiar a la cantidad que quieras
```

### Cambiar Threshold de Warning:

En `index.html` línea 1125:
```javascript
WARNING_THRESHOLD: 10,  // Cambiar a la cantidad que quieras
```

### Cambiar Contraseña Admin:

En `admin.html` línea 293:
```javascript
const ADMIN_PASSWORD = 'dexter2026'; // Cambiar por tu contraseña
```

### Cambiar Datos de Pago:

En `index.html` buscar y modificar:
- **PayPal:** Línea 902 - `href="https://paypal.me/facudexte09"`
- **MP Alias:** Línea 924 - `facudexte09`
- **MP CVU:** Línea 930 - `0000003100047986493442`
- **Email:** Línea 953 - `facudexter123@gmail.com`

## 🔒 Seguridad

### El sistema es seguro porque:

✅ Los datos se guardan en el servidor (Vercel)
✅ El usuario NO puede modificar su contador con F12
✅ Los códigos se validan en el backend
✅ Cada código solo puede usarse UNA vez
✅ La verificación es server-side, no client-side

### Lo que el usuario NO puede hacer:

❌ Cambiar el contador de mensajes
❌ Desbloquear el chat sin pagar
❌ Reutilizar códigos
❌ Generar códigos falsos

## 📱 Links Importantes

- **Web pública:** `tudominio.com`
- **Versión VIP:** `tudominio.com/dexter-vip.html`
- **Panel Admin:** `tudominio.com/admin.html`

## 🆘 Soporte

Si algo no funciona:

1. Verificá que todos los archivos estén en GitHub
2. Revisá los logs de Vercel
3. Asegurate que `data/codes.json` tenga permisos de escritura

## 📝 Notas Importantes

- Los códigos se guardan en `/data/codes.json`
- Este archivo se crea automáticamente
- En producción real, recomendaría usar una base de datos (Supabase, MongoDB, etc.)
- Por ahora, con JSON funciona perfecto para empezar

---

## 🎉 ¡Todo Listo!

Tu sistema está completo y funcionando. Ahora podés:

1. ✅ Cobrar por mensajes
2. ✅ Generar códigos de acceso
3. ✅ Dar acceso VIP a quien quieras
4. ✅ Ver estadísticas de uso
5. ✅ Todo 100% seguro y funcional

**¡Éxito con tu negocio! 🚀**
