import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRole = route.data['role'] as 'admin' | 'user';
  const currentRole = authService.getRole();

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRole && currentRole !== expectedRole) {
    // Redirect based on role
    if (currentRole === 'admin') {
      router.navigate(['/dashboard']);
    } else {
      router.navigate(['/profile']);
    }
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.isAdmin()) {
    router.navigate(['/profile']);
    return false;
  }

  return true;
};
