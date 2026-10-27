import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { DataService, Product } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, DataTableComponent],
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss']
})
export class ProductsPage implements OnInit {
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  products = signal<Product[]>([]);
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'price', label: 'Precio (€)' },
    { key: 'category', label: 'Categoría' },
    { key: 'stock', label: 'Stock' },
    { key: 'description', label: 'Descripción' }
  ];

  constructor() {
    addIcons({ logOutOutline });
  }

  async ngOnInit() {
    await this.notificationService.showLoading('Cargando productos...');
    try {
      const productsData = await this.dataService.getProducts();
      this.products.set(productsData);
      await this.notificationService.hideLoading();
    } catch (error: any) {
      console.error('Error loading products:', error);
      await this.notificationService.hideLoading();
      await this.notificationService.showError('Error al cargar los productos');
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
