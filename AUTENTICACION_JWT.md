# Migración de Autenticación a JWT

## Cambios Realizados

### Backend
1. **Se instaló `jsonwebtoken`** - para generar y validar tokens JWT
2. **Archivo: `src/utils/jwt.utils.ts`** - contiene funciones para:
   - `generateToken()`: genera un JWT con datos del usuario
   - `verifyToken()`: valida un token
   - `decodeToken()`: decodifica un token sin validar

3. **Archivo: `src/utils/auth.middleware.ts`** - contiene middlewares de autenticación:
   - `authMiddleware`: valida que exista un token JWT válido
   - `adminMiddleware`: valida que el usuario sea administrador

4. **Archivo: `src/users/user.controler.ts`** - modificados:
   - `login()`: ahora devuelve un JWT en lugar de datos del usuario
   - `add()` (register): ahora devuelve un JWT después del registro

## Response del Backend

### Login/Register (antes - INSEGURO)
```json
{
  "message": "Login exitoso",
  "data": {
    "userId": 1,
    "userName": "Juan",
    "userEmail": "juan@example.com",
    "userRol": "administrator"
  },
  "success": true
}
```

### Login/Register (ahora - SEGURO)
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

## Instrucciones para el Frontend

### 1. Guardar el token en localStorage
```javascript
// Después de login exitoso
const response = await fetch('/api/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userEmail, userPassword })
});

const data = await response.json();

// Guardar el token - NO guardar datos del usuario planos
if (data.success) {
  localStorage.setItem('authToken', data.token);
}
```

### 2. Usar el token en requisitos autenticados
```javascript
// Para cualquier llamada que requiera autenticación
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
};

const response = await fetch('/api/user/profile', {
  method: 'GET',
  headers
});
```

### 3. Decodificar el JWT en el Frontend
```javascript
// Instalar: npm install jwt-decode
import { jwtDecode } from 'jwt-decode';

// Obtener datos del usuario desde el token
const token = localStorage.getItem('authToken');
if (token) {
  const decoded = jwtDecode(token);
  console.log(decoded.userRol); // 'administrator' o 'developer'
  console.log(decoded.userName);
}
```

### 4. Logout
```javascript
localStorage.removeItem('authToken');
```

### 5. Verificar si el usuario está autenticado
```javascript
function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    // Verificar si el token no ha expirado
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
```

## Seguridad Mejorada

✅ **Antes**: El rol estaba en el localStorage en texto plano - un usuario podía modificarlo directamente

❌ **Ahora**: El rol está firmado en el JWT - si se intenta modificar, la firma será inválida y el backend lo rechazará

## Notas Importantes

- Cambiar `JWT_SECRET` en `src/utils/jwt.utils.ts` a una variable de entorno en producción
- El token expira en 24 horas (configurable en `jwt.utils.ts`)
- SIEMPRE usar HTTPS en producción para proteger los tokens en tránsito
- El frontend NO debe descodificar el rol y usarlo para control de acceso local - siempre validar en el backend
