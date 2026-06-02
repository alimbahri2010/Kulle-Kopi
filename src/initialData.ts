/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, Review, Order, Customer, InventoryItem, Employee, Promotion, CafeSettings, GalleryItem } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Espresso',
    description: 'Double shot espresso khas racikan kami. Kaya, pekat, dengan aroma cokelat hitam dan crema cokelat keemasan yang sempurna.',
    category: 'black coffee',
    price: 28000,
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1510972527409-cef1903972fa?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: false,
    stock: 150
  },
  {
    id: 'm2',
    name: 'Kopi Susu Kulle',
    description: 'Kopi susu klasik yang lembut, diseduh dari biji kopi Arabika pilihan dan dicampur susu organik premium hangat.',
    category: 'white coffee',
    price: 34000,
    rating: 4.9,
    reviewsCount: 205,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: true,
    stock: 120
  },
  {
    id: 'm3',
    name: 'Es Kopi Kareng',
    description: 'Es kopi susu andalan kami yang legendaris. Dibuat dengan espresso cold-brew premium, sirup gula kelapa alami, dan susu berkualitas tinggi.',
    category: 'white coffee',
    price: 38000,
    rating: 5.0,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: true,
    stock: 200
  },
  {
    id: 'm4',
    name: 'Kyoto Matcha Ritual',
    description: 'Bubuk matcha Kyoto murni diseduh dengan sempurna, disajikan dengan susu hangat dan sentuhan manis vanilla blossom.',
    category: 'non kopi',
    price: 38000,
    rating: 4.7,
    reviewsCount: 158,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: false,
    stock: 80
  },
  {
    id: 'm5',
    name: 'Nasi Goreng Kulle',
    description: 'Nasi goreng melati wajan premium yang dipadukan dengan rempah-rempah lokal beraroma khas, disajikan dengan ayam panggang empuk, udang segar, telur mata sapi, dan kerupuk udang renyah.',
    category: 'makanan berat',
    price: 55000,
    rating: 4.9,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: true,
    stock: 60
  },
  {
    id: 'm6',
    name: 'Sop Ubi Premium',
    description: 'Kelezatan kuliner lokal dengan potongan daging sapi empuk dalam kuah kaldu iga beraroma harum, dipadukan dengan potongan singkong goreng, mi laksa, telur rebus, dan bawang goreng renyah.',
    category: 'makanan berat',
    price: 48000,
    rating: 4.8,
    reviewsCount: 194,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: true,
    stock: 45
  },
  {
    id: 'm7',
    name: 'Kulle Burger Premium',
    description: 'Daging sapi Wagyu premium panggang yang disajikan di dalam roti brioche panggang, dilengkapi dengan keju cheddar Inggris meleleh, karamelisasi bawang bombay, dan truffle aioli.',
    category: 'makanan berat',
    price: 68000,
    rating: 4.6,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: false,
    stock: 50
  },
  {
    id: 'm8',
    name: 'Artisan Avocado Sandwich',
    description: 'Roti sourdough panggang lokal dengan alpukat Hass segar yang dihaluskan, telur rebus organik, taburan keju feta, dan tomat ceri.',
    category: 'makanan ringan',
    price: 45000,
    rating: 4.8,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: true,
    stock: 40
  },
  {
    id: 'm9',
    name: 'Pisang Goreng Premium',
    description: 'Pisang raja lokal goreng renyah keemasan dengan taburan gula kayu manis, disajikan dengan madu alami dan keju parut gula palem premium.',
    category: 'makanan ringan',
    price: 28000,
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1566843972142-a7fcb70de554?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: false,
    stock: 110
  },
  {
    id: 'm10',
    name: 'Jus Jeruk Segar Dingin',
    description: '100% jus murni diperas dari jeruk Valencia manis segar, disajikan murni tanpa tambahan gula atau pemanis buatan.',
    category: 'juice',
    price: 32000,
    rating: 4.7,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: false,
    stock: 90
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Rian Wijaya',
    rating: 5,
    comment: 'Es Kopi Kareng rasanya juara sekali! Perpaduan gula kelapa alami dan espresonya sangat pas. Suasananya nyaman, cocok untuk WFC.',
    date: '2026-05-27',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'r2',
    name: 'Nadia Syafira',
    rating: 5,
    comment: 'Nasi Goreng Kulle dan Sop Ubi rasanya lezat sekali! Kuah sopnya gurih, kental, dan sangat cocok dinikmati saat santai. Desain kafe sangat estetik.',
    date: '2026-05-26',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'r3',
    name: 'Andrew Tan',
    rating: 5,
    comment: 'Desain kafe berkelas, pelayanannya ramah, dan koneksi internetnya sangat cepat. Sangat merekomendasikan Avocado Sandwich dengan telur rebus setengah matang.',
    date: '2026-05-25',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'r4',
    name: 'Safira Amanda',
    rating: 4,
    comment: 'Kyoto Matcha di sini rasanya pekat dan autentik. Penyajian piring dan cangkirnya sangat indah. Suasana premium tapi tetap hangat dan bersahabat.',
    date: '2026-05-24',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9302',
    customerName: 'Aditya Pratama',
    customerEmail: 'aditya.pratama@gmail.com',
    customerPhone: '08123456789',
    items: [
      { id: 'oi1', menuItem: INITIAL_MENU_ITEMS[2], quantity: 2 }, // Es Kopi Kareng
      { id: 'oi2', menuItem: INITIAL_MENU_ITEMS[4], quantity: 1 }  // Nasi Goreng Kulle
    ],
    total: 131000,
    status: 'completed',
    notes: 'Nasi gorengnya pedas ya!',
    createdAt: '2026-05-29T01:12:00Z',
    tableNumber: 'Meja 5',
    paymentMethod: 'qris'
  },
  {
    id: 'ORD-9303',
    customerName: 'Karin Lestari',
    customerEmail: 'karin.les@gmail.com',
    customerPhone: '08198765432',
    items: [
      { id: 'oi3', menuItem: INITIAL_MENU_ITEMS[1], quantity: 1 }, // Kopi Susu Kulle
      { id: 'oi4', menuItem: INITIAL_MENU_ITEMS[7], quantity: 1 }  // Artisan Avocado Sandwich
    ],
    total: 79000,
    status: 'processing',
    notes: 'Minta latte art bentuk hati.',
    createdAt: '2026-05-29T01:45:00Z',
    tableNumber: 'Meja 12',
    paymentMethod: 'card'
  },
  {
    id: 'ORD-9304',
    customerName: 'Michael Wong',
    customerEmail: 'm.wong@outlook.com',
    customerPhone: '08112233445',
    items: [
      { id: 'oi5', menuItem: INITIAL_MENU_ITEMS[0], quantity: 1 }, // Espresso
      { id: 'oi6', menuItem: INITIAL_MENU_ITEMS[5], quantity: 1 }  // Sop Ubi Premium
    ],
    total: 76000,
    status: 'pending',
    createdAt: '2026-05-29T02:02:00Z',
    tableNumber: 'Meja 3',
    paymentMethod: 'cash'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Aditya Pratama',
    email: 'aditya.pratama@gmail.com',
    phone: '08123456789',
    totalOrders: 14,
    totalSpent: 840000,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    lastOrder: '2026-05-29'
  },
  {
    id: 'c2',
    name: 'Karin Lestari',
    email: 'karin.les@gmail.com',
    phone: '08198765432',
    totalOrders: 8,
    totalSpent: 412000,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    lastOrder: '2026-05-29'
  },
  {
    id: 'c3',
    name: 'Michael Wong',
    email: 'm.wong@outlook.com',
    phone: '08112233445',
    totalOrders: 21,
    totalSpent: 1650000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    lastOrder: '2026-05-29'
  },
  {
    id: 'c4',
    name: 'Stefani Melia',
    email: 'stef.melia@gmail.com',
    phone: '08223344556',
    totalOrders: 5,
    totalSpent: 228000,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    lastOrder: '2026-05-23'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Biji Kopi Arabika', stock: 24.5, unit: 'kg', minStock: 5.0, category: 'Bahan Baku Minuman', supplier: 'Kintamani Coffee Co.' },
  { id: 'i2', name: 'Gula Kelapa Premium', stock: 12.0, unit: 'kg', minStock: 2.5, category: 'Pemanis Alami', supplier: 'Aroma Alam Raya' },
  { id: 'i3', name: 'Susu Segar Organik', stock: 45, unit: 'Liter', minStock: 10, category: 'Susu', supplier: 'Greenfields Indonesia' },
  { id: 'i4', name: 'Wagyu Beef Patty', stock: 8, unit: 'pcs', minStock: 15, category: 'Daging', supplier: 'Meat Prime Specialist' },
  { id: 'i5', name: 'Matcha Kyoto Powder', stock: 1.2, unit: 'kg', minStock: 0.5, category: 'Bubuk Teh', supplier: 'Kyoto Import Direct' },
  { id: 'i6', name: 'Singkong Manis Lokal', stock: 18.0, unit: 'kg', minStock: 4.0, category: 'Sayuran', supplier: 'Petani Lokal Mandiri' }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Ibrahim Kulle', role: 'Admin', email: 'ibrahim@kullekopi.cafe', shift: 'Full Time', status: 'active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
  { id: 'e2', name: 'Sarah Meisya', role: 'Barista', email: 'sarah.barista@kullekopi.cafe', shift: 'Morning (07:00 - 15:00)', status: 'active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { id: 'e3', name: 'Rahmat Hidayat', role: 'Chef', email: 'rahmat@kullekopi.cafe', shift: 'Morning (07:00 - 15:00)', status: 'active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
  { id: 'e4', name: 'Doni Saputra', role: 'Waiter', email: 'doni@kullekopi.cafe', shift: 'Evening (15:00 - 23:00)', status: 'active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  { id: 'p1', code: 'KULLEKAREN', description: 'Dapatkan diskon 15% untuk Es Kopi Kareng andalan kami!', discountPercent: 15, isActive: true, type: 'discount', bannerImage: 'https://images.unsplash.com/photo-1510972527409-cef1903972fa?auto=format&fit=crop&w=1200&q=80', validUntil: '2026-06-30' },
  { id: 'p2', code: 'MORNINGBREW', description: 'Diskon pagi khusus 10% untuk seluruh pilihan Kopi Hitam dari jam 07:00 hingga 11:00.', discountPercent: 10, isActive: false, type: 'campaign', bannerImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', validUntil: '2026-07-15' },
  { id: 'p3', code: 'WAGYUSTEAL', description: 'Diskon 20% untuk Wagyu Burger spesial selama sesi live music jazz.', discountPercent: 20, isActive: false, type: 'event', bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80', validUntil: '2026-05-31' }
];

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
  aboutPill: 'WARISAN AUTENTIK',
  aboutTitle: 'Menciptakan Momen Indah di Kulle Kopi',
  aboutDescription: 'Didirikan di atas nilai ketepatan rasa, kehangatan pelayanan, dan kualitas terbaik, Kulle Kopi memadukan biji kopi Arabika pilihan dengan menu kuliner lezat yang menonjolkan kekayaan lokal dan kenyamanan modern. Di sini, kopi bukan sekadar minuman, melainkan sebuah cerita rasa yang diracik khusus untuk menginspirasi Anda.',
  aboutFeature1Title: '☕ BIJI KOPI PILIHAN',
  aboutFeature1Desc: '100% biji kopi Arabika single-origin Kintamani & Toraja yang disangrai perlahan untuk mengoptimalkan keaslian rasa.',
  aboutFeature2Title: '🍔 MAKANAN LEZAT',
  aboutFeature2Desc: 'Disajikan segar setiap hari oleh juru masak profesional kami untuk menghadirkan rasa yang istimewa.'
};

export const INITIAL_GALLERY_PHOTOS: GalleryItem[] = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', title: 'Area Duduk Indoor yang Estetik', category: 'interior' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80', title: 'Proses Pembuatan Kopi Saring', category: 'seduh' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', title: 'Area Deck Terbuka (Al Fresco)', category: 'interior' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80', title: 'Kopi Flat White yang Lembut', category: 'kopi' },
  { id: 'g5', url: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=800&q=80', title: 'Ekstraksi Espresso Khas Kulle', category: 'seduh' },
  { id: 'g6', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', title: 'Nasi Goreng Kulle yang Lezat', category: 'kuliner' }
];
