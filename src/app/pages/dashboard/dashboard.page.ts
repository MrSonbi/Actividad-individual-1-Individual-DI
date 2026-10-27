import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard, IonCardContent, IonSpinner } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline, peopleOutline, bagOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { StatWidgetComponent } from '../../shared/components/stat-widget/stat-widget.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonSpinner,
    StatWidgetComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private notificationService = inject(NotificationService);

  stats = signal({ totalProducts: 0, totalUsers: 0 });
  isLoading = signal(true);

  chartData = signal({
    labels: ['Productos', 'Usuarios'],
    values: [0, 0]
  });

  Math = Math;

  constructor() {
    addIcons({ logOutOutline, peopleOutline, bagOutline });
  }

  async ngOnInit() {
    await this.notificationService.showLoading('Cargando estadísticas...');
    try {
      const statsData = await this.dataService.getDashboardStats();
      this.stats.set(statsData);
      this.chartData.set({
        labels: ['Productos', 'Usuarios'],
        values: [statsData.totalProducts, statsData.totalUsers]
      });
      await this.notificationService.hideLoading();
    } catch (error: any) {
      console.error('Error loading stats:', error);
      await this.notificationService.hideLoading();
      await this.notificationService.showError('Error al cargar las estadísticas');
    } finally {
      this.isLoading.set(false);
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
