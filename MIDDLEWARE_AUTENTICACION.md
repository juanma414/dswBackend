# Protección de Rutas con Autenticación

## Cómo Usar el Middleware de Autenticación

Se han creado dos middlewares en `src/utils/auth.middleware.ts`:

1. **`authMiddleware`**: Verifica que el usuario esté autenticado (tiene un JWT válido)
2. **`adminMiddleware`**: Verifica que el usuario sea administrador

---

## Ejemplo 1: Ruta Protegida (Solo Autenticados)

En `src/users/user.routers.ts`:

```typescript
import { Router } from 'express';
import { authMiddleware } from '../utils/auth.middleware.js';
import * as userController from './user.controler.js';

export const userRouter = Router();

// Rutas públicas
userRouter.post('/login', userController.login);
userRouter.post('/register', userController.add);

// Rutas protegidas - requieren autenticación
userRouter.get('/:id', authMiddleware, userController.findOne);
userRouter.put('/:id', authMiddleware, userController.update);
userRouter.delete('/:id', authMiddleware, userController.deleteUser);
```

---

## Ejemplo 2: Ruta Solo para Administradores

```typescript
import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../utils/auth.middleware.js';
import * as userController from './user.controler.js';

export const userRouter = Router();

// Rutas público
userRouter.post('/login', userController.login);

// Ruta protegida - solo administradores
userRouter.get('/all', authMiddleware, adminMiddleware, userController.findAll);
userRouter.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);
```

---

## Cómo Funcionan los Middlewares

### authMiddleware

```
Requisición con header:
┌─────────────────────────────────────────────────┐
│ Authorization: Bearer eyJhbGciOiJIUzI1NiIs...   │
└─────────────────────────────────────────────────┘
                        ↓
        Middleware extrae el token
                        ↓
        Valida la firma del JWT
                        ↓
        Si es válido: agrega req.user = datos
        Si no: responde 401 Unauthorized
```

### adminMiddleware

```
Después del authMiddleware:
┌──────────────────────────┐
│ req.user = {             │
│   userId: 1,             │
│   userRol: "developer"   │
│ }                        │
└──────────────────────────┘
        ↓
  Verifica req.user.userRol
        ↓
  Si es "administrator": continúa
  Si no: responde 403 Forbidden
```

---

## Flujo Completo de una Requisición Autenticada

```
Cliente envía:
┌────────────────────────────────────────────────────────────┐
│ GET /api/user/1                                            │
│ Headers:                                                    │
│   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ik... │
└────────────────────────────────────────────────────────────┘
              ↓
        authMiddleware
              ↓
  ¿Token válido? → No → 401 Unauthorized (FIN)
              ├→ Sí ↓
              ↓
  req.user = {
    userId: 1,
    userEmail: "juan@example.com",
    userRol: "developer"
  }
              ↓
        Llama al controller
              ↓
  findOne() ejecuta con req.user disponible
              ↓
  Respuesta 200 con datos
```

---

## Acceder a los Datos del Usuario en Controllers

En el controlador, puedes acceder a los datos del usuario autenticado:

```typescript
import { AuthenticatedRequest, authMiddleware } from '../utils/auth.middleware.js';

async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // Datos del usuario autenticado:
    console.log(req.user.userId);    // 1
    console.log(req.user.userEmail); // "juan@example.com"
    console.log(req.user.userRol);   // "developer" o "administrator"
    console.log(req.user.userName);  // "Juan"

    // Buscar datos adicionales del usuario en BD si es necesario
    const userClass = await em.findOneOrFail(user, { userId: req.user.userId });
    res.status(200).json({ message: 'Perfil obtenido', data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
```

---

## Validaciones en Controllers Después de Autenticación

```typescript
async function updateUserEmail(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const targetUserId = Number.parseInt(req.params.id);

    // Solo los administradores pueden modificar otros usuarios
    // Los usuarios comunes solo pueden modificarse a sí mismos
    if (req.user.userRol !== 'administrator' && req.user.userId !== targetUserId) {
      return res.status(403).json({ 
        message: 'No tienes permisos para modificar este usuario' 
      });
    }

    // Continuar con la actualización...
    const userClass = await em.findOneOrFail(user, { userId: targetUserId });
    em.assign(userClass, req.body);
    await em.flush();

    res.status(200).json({ message: 'Usuario actualizado', data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
```

---

## Errores Esperados

### Token Ausente o Inválido
```bash
curl -X GET http://localhost:3000/api/user/1
```
Respuesta:
```json
{
  "message": "Token no proporcionado o formato inválido"
}
```
Status: 401

### Token Expirado
```bash
curl -X GET http://localhost:3000/api/user/1 \
  -H "Authorization: Bearer <token_expirado>"
```
Respuesta:
```json
{
  "message": "Token inválido o expirado"
}
```
Status: 401

### Usuario Sin Permisos de Admin
```bash
curl -X DELETE http://localhost:3000/api/user/99 \
  -H "Authorization: Bearer <token_developer>"
```
Respuesta:
```json
{
  "message": "Acceso denegado - se requiere rol de administrador"
}
```
Status: 403

---

## Próximos Pasos

1. ✅ Backend genera JWT
2. ✅ Middleware de autenticación
3. **Frontend debe:**
   - Instalar `jwt-decode`
   - Guardar token en localStorage
   - Enviar token en cada requisición autenticada
   - Implementar guards de rutas
   - Mostrar datos del usuario desde el JWT decodificado
