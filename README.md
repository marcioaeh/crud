# CRUD de Usuarios con Angular (documentado paso a paso)

Este proyecto es un ejemplo **didáctico** de un CRUD en Angular con una sola entidad: `usuarios`.

Incluye:

- Login con usuario/contraseña.
- Pantalla protegida con guard (`authGuard`).
- CRUD completo de usuarios:
  - Crear
  - Listar (tabla)
  - Editar
  - Eliminar
- Persistencia en `localStorage` (sin backend, ideal para estudiar la lógica).

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

### ¿Qué hace cada parte?

- **`usuario.model.ts`**: define la forma del objeto usuario (`id`, `nombre`, etc.).
- **`usuarios.service.ts`**: lógica de negocio del CRUD y `localStorage`.
- **`auth.service.ts`**: login/logout y control de sesión.
- **`auth.guard.ts`**: protege la ruta `/usuarios` para que solo entre un usuario autenticado.
- **`login-page.component.ts`**: formulario de login.
- **`usuarios-page.component.ts`**: formulario de alta/edición + tabla + botones de acciones.
- **`app.routes.ts`**: rutas principales de la aplicación.

---

## 2) Modelo de datos

La tabla lógica `usuarios` tiene estos campos:

- `id`: número autoincremental.
- `nombre`: texto.
- `apellido`: texto.
- `fechaIngreso`: fecha (`YYYY-MM-DD`).
- `username`: texto único para login.
- `password`: texto.

> Nota didáctica: en producción, la contraseña **no** se guarda en texto plano y siempre hay backend + hash.

---

## 3) Flujo de autenticación

1. El usuario entra a `/login`.
2. Se validan credenciales con `UsuariosService.findByCredentials`.
3. Si son correctas, se guarda `crud_auth_user` en `localStorage`.
4. El guard permite entrar a `/usuarios`.
5. Al cerrar sesión, se limpia esa clave y se redirige al login.

---

## 4) Flujo CRUD

En la pantalla `/usuarios`:

1. Se cargan usuarios desde `localStorage`.
2. Formulario permite crear o editar según `editId`.
3. Se valida que `username` no esté repetido.
4. La tabla muestra los usuarios y acciones:
   - **Editar**: rellena formulario.
   - **Eliminar**: borra registro.

---

## 5) Cómo ejecutar en local

> Requiere Node.js y npm con acceso al registro de paquetes.

```bash
npm install
npm start
```

Luego abrir `http://localhost:4200`.

---

## 6) Ideas para seguir estudiando

- Migrar de `localStorage` a una API REST real (Node/Spring/.NET).
- Añadir `ReactiveForms` y validaciones personalizadas.
- Cifrar/hashear contraseña en backend.
- Implementar roles (`admin`, `operador`, etc.).
- Añadir paginación, búsqueda y ordenamiento en la tabla.

---

## 7) Nota de seguridad

Este proyecto está pensado para **aprendizaje**. Para producción:

- Nunca guardar contraseñas en texto plano.
- Nunca confiar autenticación solo en frontend.
- Usar JWT/sesiones con backend seguro.
