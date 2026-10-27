import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { DataService, UserData } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, DataTableComponent],
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit {
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  users = signal<UserData[]>([]);
  columns: TableColumn[] = [
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'full_name', label: 'Nombre Completo' },
    { key: 'role', label: 'Rol' },
    { key: 'created_at', label: 'Fecha de Registro' }
  ];

  constructor() {
    addIcons({ logOutOutline });
  }

  async ngOnInit() {
    await this.notificationService.showLoading('Cargando usuarios...');
    try {
      const usersData = await this.dataService.getUsers();
      this.users.set(usersData);
      await this.notificationService.hideLoading();
    } catch (error: any) {
      console.error('Error loading users:', error);
      await this.notificationService.hideLoading();
      await this.notificationService.showError('Error al cargar los usuarios');
    }
  }

  async signOut() {
    const confirmed = await this.notificationService.showConfirm('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?');
    if (confirmed) {
      await this.notificationService.showLoading('Cerrando sesión...');
      try {
        await this.authService.signOut();
        await this.notificationService.hideLoading();
        await this.notificationService.showSuccess('Sesión cerrada correctamente');
      } catch (error: any) {
        await this.notificationService.hideLoading();
        await this.notificationService.showError('Error al cerrar sesión');
      }
    }
  }
}
