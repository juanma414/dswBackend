# Referencia de API - Autenticación con JWT

## Endpoints de Autenticación

### POST /api/user/register
**Registrar nuevo usuario**

**Request:**
```json
{
  "userName": "Juan",
  "userLastName": "Pérez",
  "userRol": "developer",
  "userEmail": "juan@example.com",
  "userPassword": "password123"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

---

### POST /api/user/login
**Iniciar sesión**

**Request:**
```json
{
  "userEmail": "juan@example.com",
  "userPassword": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

---

## Usar el Token en Requisitos Autenticados

Incluir el token en el header `Authorization`:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/user/profile
```

**JavaScript:**
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('/api/user/1', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Estructura del JWT (sin firmar)

Cuando decodifiques el token, verás:

```json
{
  "userId": 123,
  "userEmail": "juan@example.com",
  "userRol": "developer",
  "userName": "Juan",
  "iat": 1709700000,
  "exp": 1709786400
}
```

**Campos:**
- `userId`: ID del usuario en BD
- `userEmail`: Email del usuario
- `userRol`: Rol (administrator, developer, etc.)
- `userName`: Nombre del usuario
- `iat`: Momento de creación (Unix timestamp)
- `exp`: Momento de expiración (Unix timestamp) - 24 horas

---

## Frontend - Setup Recomendado

### 1. Guardar token después de login
```typescript
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    // Redirigir a dashboard
  }
};
```

### 2. Interceptor de HTTP (ejemplo con Axios)
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api'
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### 3. Service para decodificar JWT en el frontend
```typescript
import { jwtDecode } from 'jwt-decode';

export interface UserData {
  userId: number;
  userEmail: string;
  userRol: string;
  userName: string;
}

export class AuthService {
  static getCurrentUser(): UserData | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem('authToken');
  }
}
```

### 4. Guard para rutas protegidas (Angular)
```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (AuthService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

---

## Errores Comunes

### 401 - Unauthorized
**Causas:**
- Token no incluido en el header
- Token expirado
- Token inválido o corrupto
- Formato incorrecto: debe ser `Bearer <token>`

### 403 - Forbidden
**Causas:**
- Usuario no tiene permisos suficientes
- Requiere rol de administrador

---

## Cambios de Seguridad

❌ **ANTES (inseguro):**
```json
{
  "data": {
    "userId": 1,
    "userRol": "administrator",  // ← Visible en localStorage sin protección
    "userName": "Juan"
  }
}
```

✅ **AHORA (seguro):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // ← Firmado criptográficamente
}
```

El rol está ahora firmado en el JWT. Si un usuario intenta modificarlo en el localStorage:
1. El token se corrompe
2. El backend valida la firma
3. El token es rechazado
4. El usuario recibe error 401
