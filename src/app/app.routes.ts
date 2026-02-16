import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginPageComponent } from './pages/login-page.component';
import { UsuariosPageComponent } from './pages/usuarios-page.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent },
  { path: 'usuarios', component: UsuariosPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
