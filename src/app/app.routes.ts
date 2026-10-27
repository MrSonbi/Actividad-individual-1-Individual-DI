import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.page').then((m) => m.UsersPage),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then((m) => m.ProductsPage),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
