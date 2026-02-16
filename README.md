# CRUD de Usuarios con Angular (documentado para estudio)

Este proyecto es un ejemplo **didáctico** de CRUD + login en Angular, con una sola tabla lógica llamada `usuarios`.

## ¿Qué incluye?

- Login con usuario y contraseña.
- Ruta protegida con `authGuard`.
- CRUD completo de usuarios:
  - Crear
  - Listar (tabla)
  - Editar
  - Eliminar
- Persistencia en `localStorage` para no depender de backend.
- Validaciones básicas de formulario (campos obligatorios y fecha no futura).

> Usuario demo inicial: `admin` / `admin123`

---

## 1) Estructura del proyecto

```text
src/
  app/
    app.component.ts
    app.routes.ts
    guards/
      auth.guard.ts
    models/
      usuario.model.ts
    pages/
      login-page.component.ts
      usuarios-page.component.ts
    services/
      auth.service.ts
      usuarios.service.ts
  index.html
  main.ts
  styles.css
```

### Rol de cada archivo principal

- `app.routes.ts`: define rutas (`/login`, `/usuarios`) y protección.
- `auth.guard.ts`: bloquea `/usuarios` sin sesión.
- `usuario.model.ts`: contrato de datos de usuario.
- `usuarios.service.ts`: CRUD + persistencia + normalización de datos.
- `auth.service.ts`: login/logout y gestión de sesión.
- `login-page.component.ts`: formulario de acceso.
- `usuarios-page.component.ts`: formulario CRUD, validaciones y tabla.

---

## 2) Tabla `usuarios`

Campos del modelo:

- `id`: number autoincremental
- `nombre`: string
- `apellido`: string
- `fechaIngreso`: string (formato `YYYY-MM-DD`)
- `username`: string único
- `password`: string

---

## 3) Flujo de autenticación

1. El usuario entra a `/login`.
2. `AuthService.login` valida con `UsuariosService.findByCredentials`.
3. Si es correcto, se guarda `crud_auth_user` en `localStorage`.
4. El guard permite acceder a `/usuarios`.
5. Al cerrar sesión, se borra la clave y vuelve a `/login`.

---

## 4) Flujo CRUD

En `/usuarios`:

1. Se cargan usuarios desde `localStorage`.
2. El formulario crea o actualiza según si existe `editId`.
3. Se valida:
   - campos obligatorios,
   - fecha de ingreso no futura,
   - `username` no repetido.
4. La tabla permite editar o eliminar registros.

---

## 5) Ejecución local

```bash
npm install
npm start
```

Luego abrir `http://localhost:4200`.

---

## 6) Guía de estudio sugerida

### Paso A: Modelo
Lee `usuario.model.ts` y relaciona cada propiedad con los inputs del formulario.

### Paso B: Servicio CRUD
Revisa `usuarios.service.ts` en este orden:

1. `loadUsuarios()`
2. `getUsuarios()`
3. `createUsuario()`
4. `updateUsuario()`
5. `deleteUsuario()`

### Paso C: Autenticación
Revisa `auth.service.ts` y `auth.guard.ts` para entender sesión y rutas protegidas.

### Paso D: UI y eventos
En `usuarios-page.component.ts`, sigue el flujo de:

- `onSave()`
- `startEdit()`
- `remove()`
- `validateForm()`

---

## 7) Mejoras futuras recomendadas

- Migrar a backend real (Node/Nest, Spring, .NET, etc.).
- Reemplazar `localStorage` por API REST + base de datos.
- Guardar contraseñas con hash (bcrypt/argon2) en backend.
- Implementar roles y permisos.
- Usar Reactive Forms con validaciones avanzadas.

---

## Nota de seguridad

Este proyecto es para **aprendizaje**.

En producción:

- No guardar contraseñas en texto plano.
- No confiar autenticación solo en frontend.
- Usar backend seguro y tokens/sesiones robustas.
