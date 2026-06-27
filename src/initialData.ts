/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, Review, Order, Customer, InventoryItem, Employee, Promotion, CafeSettings, GalleryItem, Reservation, CoffeeBrand } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [];

export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_PROMOTIONS: Promotion[] = [];

export const INITIAL_SETTINGS: CafeSettings = {
  brandName: 'KULLE KOPI',
  tagline: 'KOPI NIKMAT • MAKANAN LEZAT • SUASANA NYAMAN',
  contactEmail: 'hello@kullekopi.cafe',
  contactPhone: '+62 812-3456-7890',
  address: 'Jl. Pahlawan, Empoang, Kec. Binamu, Kabupaten Jeneponto, Sulawesi Selatan 92311',
  openingHours: 'Setiap Hari: 07:00 - 23:00',
  instagramUrl: 'https://instagram.com/kullekopi',
  facebookUrl: 'https://facebook.com/kullekopi',
  whatsappNumber: '+6281234567890',
  themeColor: '#0F52BA',
  faviconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="6" fill="%25230F52BA"/><path d="M12 10 L12 22 C12 24, 20 24, 20 22 L20 10" fill="none" stroke="%2523FFF" stroke-width="2"/><path d="M20 12 C23 12, 23 16, 20 16" fill="none" stroke="%2523FFF" stroke-width="2"/></svg>',
  aboutPill: 'WARISAN AUTENTIK',
  aboutTitle: 'Menciptakan Momen Indah di Kulle Kopi',
  aboutDescription: 'Didirikan di atas nilai ketepatan rasa, kehangatan pelayanan, dan kualitas terbaik, Kulle Kopi memadukan biji kopi Arabika pilihan dengan menu kuliner lezat yang menonjolkan kekayaan lokal dan kenyamanan modern. Di sini, kopi bukan sekadar minuman, melainkan sebuah cerita rasa yang diracik khusus untuk menginspirasi Anda.',
  aboutFeature1Title: '☕ BIJI KOPI PILIHAN',
  aboutFeature1Desc: '100% biji kopi Arabika single-origin Kintamani & Toraja yang disangrai perlahan untuk mengoptimalkan keaslian rasa.',
  aboutFeature2Title: '🍔 MAKANAN LEZAT',
  aboutFeature2Desc: 'Disajikan segar setiap hari oleh juru masak profesional kami untuk menghadirkan rasa yang istimewa.',
  disableOrderButtons: false
};

export const INITIAL_GALLERY_PHOTOS: GalleryItem[] = [];

export const INITIAL_RESERVATIONS: Reservation[] = [];

export const INITIAL_COFFEE_BRANDS: CoffeeBrand[] = [];


