import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  created_at?: string;
}

export interface UserData {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabaseService = inject(SupabaseService);

  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async createProduct(product: Product): Promise<Product> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteProduct(id: number): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  // Users/Profiles
  async getUsers(): Promise<UserData[]> {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async updateUserRole(id: string, role: 'admin' | 'user'): Promise<UserData> {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Dashboard stats
  async getDashboardStats() {
    const [productsResult, usersResult] = await Promise.all([
      this.supabaseService.client.from('products').select('id', { count: 'exact', head: true }),
      this.supabaseService.client.from('profiles').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalProducts: productsResult.count || 0,
      totalUsers: usersResult.count || 0
    };
  }
}
