import { Injectable, inject } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private loading: HTMLIonLoadingElement | null = null;

  async showSuccess(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'success',
      position: 'top',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  async showError(message: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'danger',
      position: 'top',
      icon: 'alert-circle-outline'
    });
    await toast.present();
  }

  async showWarning(message: string, duration: number = 2500) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'warning',
      position: 'top',
      icon: 'warning-outline'
    });
    await toast.present();
  }

  async showInfo(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'primary',
      position: 'top',
      icon: 'information-circle-outline'
    });
    await toast.present();
  }

  async showLoading(message: string = 'Cargando...') {
    this.loading = await this.loadingController.create({
      message,
      spinner: 'crescent'
    });
    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  async showAlert(header: string, message: string, buttons: any[] = ['OK']) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }

  async showConfirm(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Confirmar',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }
}
