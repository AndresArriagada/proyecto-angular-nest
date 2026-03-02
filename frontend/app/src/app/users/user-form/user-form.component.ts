import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  users: User[] = [];
  newUser: User = {
    nombre: '',
    email: '',
    edad: undefined
  };
  editingUser: User | null = null;
  message: string = '';

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.message = 'Error al cargar usuarios';
      }
    );
  }

  createUser(): void {
    if (!this.newUser.nombre || !this.newUser.email) {
      this.message = 'Por favor, completa nombre y email';
      return;
    }

    this.usersService.createUser(this.newUser).subscribe(
      (data) => {
        this.message = 'Usuario creado exitosamente';
        this.users.push(data);
        this.resetForm();
      },
      (error) => {
        console.error('Error al crear usuario:', error);
        this.message = 'Error al crear usuario';
      }
    );
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
  }

  updateUser(): void {
    if (!this.editingUser || !this.editingUser.id) return;

    this.usersService.updateUser(this.editingUser.id, this.editingUser).subscribe(
      (data) => {
        this.message = 'Usuario actualizado exitosamente';
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = data;
        }
        this.editingUser = null;
      },
      (error) => {
        console.error('Error al actualizar usuario:', error);
        this.message = 'Error al actualizar usuario';
      }
    );
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;

    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usersService.deleteUser(id).subscribe(
        () => {
          this.message = 'Usuario eliminado exitosamente';
          this.users = this.users.filter(u => u.id !== id);
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
          this.message = 'Error al eliminar usuario';
        }
      );
    }
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  resetForm(): void {
    this.newUser = {
      nombre: '',
      email: '',
      edad: undefined
    };
  }
}
