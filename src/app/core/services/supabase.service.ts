import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUser();
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  private async loadUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    this.currentUserSubject.next(user);
    
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }
}
