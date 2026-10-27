import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline } from 'ionicons/icons';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
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
    IonButton,
    IonIcon
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userProfile = signal<UserProfile | null>(null);

  constructor() {
    addIcons({ personCircleOutline, logOutOutline });
  }

  ngOnInit() {
    this.authService.userProfile$.subscribe(profile => {
      this.userProfile.set(profile);
    });
  }

  async signOut() {
    await this.authService.signOut();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}
