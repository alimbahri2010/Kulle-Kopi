/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'black coffee' | 'white coffee' | 'non kopi' | 'juice' | 'makanan berat' | 'makanan ringan';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isAvailable: boolean;
  isBestSeller: boolean;
  stock: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  tableNumber: string;
  paymentMethod: 'cash' | 'card' | 'qris';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  avatar: string;
  lastOrder: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  category: string;
  supplier: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Admin' | 'Barista' | 'Chef' | 'Waiter' | 'Cashier';
  email: string;
  shift: 'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)' | 'Full Time';
  status: 'active' | 'inactive';
  avatar: string;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  isActive: boolean;
  type: 'discount' | 'event' | 'campaign';
  bannerImage: string;
  validUntil: string;
}

export interface CafeSettings {
  brandName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  themeColor: string;
  faviconUrl?: string;
  aboutPill?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutFeature1Title?: string;
  aboutFeature1Desc?: string;
  aboutFeature2Title?: string;
  aboutFeature2Desc?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

