import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

const STORAGE_KEY = 'crud_usuarios';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private usuarios: Usuario[] = this.loadUsuarios();

  getUsuarios(): Usuario[] {
    return [...this.usuarios].sort((a, b) => a.id - b.id);
  }

  createUsuario(payload: Omit<Usuario, 'id'>): Usuario {
    const nextId = this.usuarios.length ? Math.max(...this.usuarios.map((u) => u.id)) + 1 : 1;
    const nuevo: Usuario = { id: nextId, ...payload };
    this.usuarios.push(nuevo);
    this.saveUsuarios();
    return nuevo;
  }

  updateUsuario(id: number, payload: Omit<Usuario, 'id'>): boolean {
    const index = this.usuarios.findIndex((usuario) => usuario.id === id);
    if (index < 0) {
      return false;
    }
    this.usuarios[index] = { id, ...payload };
    this.saveUsuarios();
    return true;
  }

  deleteUsuario(id: number): boolean {
    const initialLength = this.usuarios.length;
    this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
    const changed = this.usuarios.length !== initialLength;
    if (changed) {
      this.saveUsuarios();
    }
    return changed;
  }

  findByCredentials(username: string, password: string): Usuario | null {
    return this.usuarios.find((usuario) => usuario.username === username && usuario.password === password) ?? null;
  }

  existsUsername(username: string, excludeId?: number): boolean {
    return this.usuarios.some((usuario) => usuario.username === username && usuario.id !== excludeId);
  }

  private saveUsuarios(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.usuarios));
  }

  private loadUsuarios(): Usuario[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seedUsers: Usuario[] = [
        {
          id: 1,
          nombre: 'Admin',
          apellido: 'General',
          fechaIngreso: '2025-01-01',
          username: 'admin',
          password: 'admin123'
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers));
      return seedUsers;
    }

    try {
      const parsed = JSON.parse(raw) as Usuario[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
