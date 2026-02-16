import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { AuthService } from '../services/auth.service';
import { UsuariosService } from '../services/usuarios.service';

type UsuarioForm = Omit<Usuario, 'id'>;

const EMPTY_FORM: UsuarioForm = {
  nombre: '',
  apellido: '',
  fechaIngreso: '',
  username: '',
  password: ''
};

/**
 * Pantalla principal del CRUD.
 *
 * Contiene:
 * - Formulario de alta/edición.
 * - Tabla de usuarios.
 * - Acciones de editar/eliminar.
 */
@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container">
      <header class="header card">
        <div>
          <h1>CRUD de usuarios</h1>
          <p>Sesión activa: <strong>{{ currentUsername }}</strong></p>
        </div>
        <button type="button" class="btn btn-secondary" (click)="logout()">Cerrar sesión</button>
      </header>

      <section class="card">
        <h2>{{ editId !== null ? 'Editar usuario' : 'Crear usuario' }}</h2>
        <form class="form-grid" (ngSubmit)="onSave()">
          <label>
            Nombre
            <input name="nombre" [(ngModel)]="form.nombre" required />
          </label>

          <label>
            Apellido
            <input name="apellido" [(ngModel)]="form.apellido" required />
          </label>

          <label>
            Fecha de ingreso
            <input type="date" name="fechaIngreso" [(ngModel)]="form.fechaIngreso" required />
          </label>

          <label>
            Usuario
            <input name="username" [(ngModel)]="form.username" required />
          </label>

          <label>
            Contraseña
            <input type="password" name="password" [(ngModel)]="form.password" required />
          </label>

          <p *ngIf="message" [class.error]="isError" [class.ok]="!isError">{{ message }}</p>

          <div class="actions">
            <button class="btn btn-primary" type="submit">{{ editId !== null ? 'Actualizar' : 'Guardar' }}</button>
            <button *ngIf="editId !== null" class="btn" type="button" (click)="cancelEdit()">Cancelar</button>
          </div>
        </form>
      </section>

      <section class="card">
        <h2>Tabla usuarios</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Fecha ingreso</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuarios">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.apellido }}</td>
                <td>{{ usuario.fechaIngreso }}</td>
                <td>{{ usuario.username }}</td>
                <td class="action-buttons">
                  <button class="btn btn-secondary" (click)="startEdit(usuario)">Editar</button>
                  <button class="btn btn-danger" (click)="remove(usuario.id)">Eliminar</button>
                </td>
              </tr>
              <tr *ngIf="usuarios.length === 0">
                <td colspan="6">Aún no hay usuarios registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      .container {
        max-width: 1080px;
        margin: 0 auto;
        padding: 1rem;
        display: grid;
        gap: 1rem;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .form-grid {
        display: grid;
        gap: 0.85rem;
      }

      label {
        display: grid;
        gap: 0.35rem;
      }

      input {
        border: 1px solid #cfd8dc;
        border-radius: 6px;
        padding: 0.55rem 0.65rem;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .ok {
        color: #2e7d32;
      }

      .error {
        color: #d32f2f;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        border-bottom: 1px solid #eceff1;
        text-align: left;
        padding: 0.65rem;
      }

      .action-buttons {
        display: flex;
        gap: 0.4rem;
      }
    `
  ]
})
export class UsuariosPageComponent implements OnInit {
  usuarios: Usuario[] = [];
  form: UsuarioForm = { ...EMPTY_FORM };
  editId: number | null = null;
  message = '';
  isError = false;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly authService: AuthService
  ) {}

  get currentUsername(): string {
    return this.authService.getAuthenticatedUsername() ?? 'desconocido';
  }

  ngOnInit(): void {
    this.refresh();
  }

  onSave(): void {
    this.clearMessage();

    const validationError = this.validateForm();
    if (validationError) {
      this.setMessage(validationError, true);
      return;
    }

    if (this.usuariosService.existsUsername(this.form.username, this.editId ?? undefined)) {
      this.setMessage('El nombre de usuario ya existe.', true);
      return;
    }

    if (this.editId !== null) {
      const ok = this.usuariosService.updateUsuario(this.editId, { ...this.form });
      this.setMessage(ok ? 'Usuario actualizado correctamente.' : 'No se pudo actualizar.', !ok);

      if (ok) {
        this.cancelEdit();
      }
    } else {
      this.usuariosService.createUsuario({ ...this.form });
      this.setMessage('Usuario creado correctamente.', false);
      this.form = { ...EMPTY_FORM };
    }

    this.refresh();
  }

  startEdit(usuario: Usuario): void {
    this.editId = usuario.id;
    this.form = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      fechaIngreso: usuario.fechaIngreso,
      username: usuario.username,
      password: usuario.password
    };
    this.clearMessage();
  }

  cancelEdit(): void {
    this.editId = null;
    this.form = { ...EMPTY_FORM };
    this.clearMessage();
  }

  remove(id: number): void {
    const confirmDelete = confirm('¿Seguro que deseas eliminar este usuario?');
    if (!confirmDelete) {
      return;
    }

    this.clearMessage();
    const ok = this.usuariosService.deleteUsuario(id);
    this.setMessage(ok ? 'Usuario eliminado.' : 'No se encontró el usuario.', !ok);

    if (this.editId === id) {
      this.cancelEdit();
    }

    this.refresh();
  }

  logout(): void {
    this.authService.logout();
  }

  private refresh(): void {
    this.usuarios = this.usuariosService.getUsuarios();
  }

  /**
   * Validaciones mínimas para mantener ejemplo simple y didáctico.
   */
  private validateForm(): string | null {
    if (!this.form.nombre.trim() || !this.form.apellido.trim() || !this.form.username.trim() || !this.form.password.trim()) {
      return 'Completa todos los campos de texto.';
    }

    if (!this.form.fechaIngreso) {
      return 'Debes seleccionar la fecha de ingreso.';
    }

    const selectedDate = new Date(this.form.fechaIngreso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return 'La fecha de ingreso no puede ser futura.';
    }

    return null;
  }

  private setMessage(message: string, isError: boolean): void {
    this.message = message;
    this.isError = isError;
  }

  private clearMessage(): void {
    this.message = '';
    this.isError = false;
  }
}
