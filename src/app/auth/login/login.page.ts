import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonText, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logInOutline, eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
    IonIcon
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  constructor() {
    addIcons({ logInOutline, eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline });
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return new Promise(resolve => {
        setTimeout(() => {
          if (control.value && control.value.includes('test')) {
            resolve({ invalidEmail: true });
          } else {
            resolve(null);
          }
        }, 300);
      });
    };
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notificationService.showError('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    await this.notificationService.showLoading('Iniciando sesión...');

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.signIn(email, password);
      await this.notificationService.hideLoading();
      await this.notificationService.showSuccess('¡Inicio de sesión exitoso!');
      this.router.navigate(['/profile']);
    } catch (error: any) {
      await this.notificationService.hideLoading();
      const message = error.message || 'Error al iniciar sesión';
      this.errorMessage.set(message);
      await this.notificationService.showError(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
