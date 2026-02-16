import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from './usuarios.service';

const AUTH_KEY = 'crud_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly router: Router
  ) {}

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(AUTH_KEY));
  }

  getAuthenticatedUsername(): string | null {
    return localStorage.getItem(AUTH_KEY);
  }

  login(username: string, password: string): boolean {
    const user = this.usuariosService.findByCredentials(username.trim(), password.trim());
    if (!user) {
      return false;
    }
    localStorage.setItem(AUTH_KEY, user.username);
    return true;
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    this.router.navigate(['/login']);
  }
}
