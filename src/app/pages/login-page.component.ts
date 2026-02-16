import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Componente de login.
 *
 * Muestra una validación simple de credenciales contra los usuarios
 * registrados en localStorage mediante AuthService.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="login-container">
      <section class="card login-card">
        <h1>Ingreso al sistema</h1>
        <p class="helper">Usa un usuario creado en el CRUD para iniciar sesión.</p>

        <form (ngSubmit)="onSubmit()">
          <label>
            Usuario
            <input type="text" name="username" [(ngModel)]="username" required />
          </label>

          <label>
            Contraseña
            <input type="password" name="password" [(ngModel)]="password" required />
          </label>

          <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
          <button type="submit" class="btn btn-primary">Entrar</button>
        </form>

        <hr />
        <p class="demo-data"><strong>Demo inicial:</strong> admin / admin123</p>
      </section>
    </main>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1rem;
      }

      .login-card {
        width: min(420px, 100%);
      }

      form {
        display: grid;
        gap: 0.85rem;
      }

      label {
        display: grid;
        gap: 0.4rem;
        font-size: 0.95rem;
      }

      input {
        border: 1px solid #cfd8dc;
        border-radius: 6px;
        padding: 0.55rem 0.65rem;
      }

      .helper {
        color: #455a64;
      }

      .error {
        color: #d32f2f;
      }

      .demo-data {
        color: #546e7a;
        font-size: 0.9rem;
      }
    `
  ]
})
export class LoginPageComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/usuarios']);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Completa usuario y contraseña.';
      return;
    }

    if (!this.authService.login(this.username, this.password)) {
      this.errorMessage = 'Usuario o contraseña inválidos.';
      return;
    }

    this.router.navigate(['/usuarios']);
  }
}
