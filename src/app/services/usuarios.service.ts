import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

/**
 * Clave de almacenamiento para la tabla lógica "usuarios".
 */
const STORAGE_KEY = 'crud_usuarios';

/**
 * Servicio que encapsula todas las operaciones CRUD de usuarios.
 *
 * Objetivo didáctico:
 * - Centralizar la lógica de negocio.
 * - Evitar manipular localStorage directamente desde los componentes.
 * - Mantener componentes más limpios y enfocados en la UI.
 */
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private usuarios: Usuario[] = this.loadUsuarios();

  /**
   * Devuelve usuarios ordenados por id para facilitar lectura en la tabla.
   */
  getUsuarios(): Usuario[] {
    return [...this.usuarios].sort((a, b) => a.id - b.id);
  }

  /**
   * Crea un usuario asignando id incremental.
   */
  createUsuario(payload: Omit<Usuario, 'id'>): Usuario {
    const nextId = this.usuarios.length ? Math.max(...this.usuarios.map((u) => u.id)) + 1 : 1;
    const nuevo: Usuario = { id: nextId, ...this.normalizePayload(payload) };
    this.usuarios.push(nuevo);
    this.saveUsuarios();
    return nuevo;
  }

  /**
   * Actualiza un usuario existente por id.
   */
  updateUsuario(id: number, payload: Omit<Usuario, 'id'>): boolean {
    const index = this.usuarios.findIndex((usuario) => usuario.id === id);
    if (index < 0) {
      return false;
    }

    this.usuarios[index] = { id, ...this.normalizePayload(payload) };
    this.saveUsuarios();
    return true;
  }

  /**
   * Elimina un usuario. Retorna true si realmente hubo cambios.
   */
  deleteUsuario(id: number): boolean {
    const initialLength = this.usuarios.length;
    this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
    const changed = this.usuarios.length !== initialLength;

    if (changed) {
      this.saveUsuarios();
    }

    return changed;
  }

  /**
   * Busca un usuario por credenciales para login.
   */
  findByCredentials(username: string, password: string): Usuario | null {
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();
    return (
      this.usuarios.find(
        (usuario) => usuario.username === normalizedUsername && usuario.password === normalizedPassword
      ) ?? null
    );
  }

  /**
   * Verifica si el username ya existe.
   *
   * @param excludeId id opcional para ignorar al editar un usuario ya existente.
   */
  existsUsername(username: string, excludeId?: number): boolean {
    const normalizedUsername = username.trim();
    return this.usuarios.some((usuario) => usuario.username === normalizedUsername && usuario.id !== excludeId);
  }

  private saveUsuarios(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.usuarios));
  }

  /**
   * Carga usuarios desde localStorage.
   * Si no existe data, crea un usuario semilla para demo.
   */
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

  /**
   * Limpia espacios para guardar valores consistentes.
   */
  private normalizePayload(payload: Omit<Usuario, 'id'>): Omit<Usuario, 'id'> {
    return {
      nombre: payload.nombre.trim(),
      apellido: payload.apellido.trim(),
      fechaIngreso: payload.fechaIngreso,
      username: payload.username.trim(),
      password: payload.password.trim()
    };
  }
}
