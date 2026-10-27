import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  full_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  
  public currentRole = signal<'admin' | 'user' | null>(null);
  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.supabaseService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.isAuthenticated.set(true);
        await this.loadUserProfile(user);
      } else {
        this.isAuthenticated.set(false);
        this.currentRole.set(null);
        this.userProfileSubject.next(null);
      }
    });
  }

  private async loadUserProfile(user: User) {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data && !error) {
      const profile: UserProfile = {
        id: data.id,
        email: user.email || '',
        role: data.role || 'user',
        full_name: data.full_name
      };
      this.userProfileSubject.next(profile);
      this.currentRole.set(profile.role);
    } else {
      // If profile doesn't exist, create it as user
      const newProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        role: 'user',
        full_name: user.user_metadata?.['full_name'] || ''
      };
      await this.supabaseService.client.from('profiles').upsert({
        id: user.id,
        email: user.email,
        role: 'user',
        full_name: newProfile.full_name
      });
      this.userProfileSubject.next(newProfile);
      this.currentRole.set('user');
    }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) throw error;
    this.router.navigate(['/login']);
  }

  getRole(): 'admin' | 'user' | null {
    return this.currentRole();
  }

  isAdmin(): boolean {
    return this.currentRole() === 'admin';
  }

  isUser(): boolean {
    return this.currentRole() === 'user';
  }
}
