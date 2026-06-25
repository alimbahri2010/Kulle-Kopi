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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%25231E120C"/><circle cx="200" cy="150" r="80" fill="%25233D2514" stroke="%25235C381E" stroke-width="8"/><circle cx="200" cy="150" r="70" fill="%252324150B"/><ellipse cx="200" cy="140" rx="40" ry="25" fill="%25238F5A3C" opacity="0.4"/><text x="200" y="155" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523E6C5B3" text-anchor="middle">ESPRESSO</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%25232C1D11"/><circle cx="200" cy="150" r="80" fill="%25238B5A2B" stroke="%2523A0522D" stroke-width="8"/><path d="M 200 110 C 170 110, 160 140, 200 180 C 240 140, 230 110, 200 110 Z" fill="%2523FFF8DC" opacity="0.85"/><text x="200" y="215" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523FFF" text-anchor="middle">LATTE ART</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%25231E293B"/><rect x="150" y="70" width="100" height="160" rx="15" fill="%2523451A03" stroke="%252338BDF8" stroke-width="4"/><line x1="210" y1="50" x2="180" y2="180" stroke="%2523EF4444" stroke-width="6"/><rect x="170" y="110" width="30" height="30" rx="5" fill="%2523BAE6FD" opacity="0.4" transform="rotate(15 185 125)"/><rect x="190" y="150" width="30" height="30" rx="5" fill="%2523BAE6FD" opacity="0.4" transform="rotate(-10 205 165)"/><text x="200" y="260" font-family="sans-serif" font-weight="bold" font-size="14" fill="%252306B6D4" text-anchor="middle">ICE COFFEE KARENG</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%2523064E3B"/><circle cx="200" cy="150" r="80" fill="%2523047857" stroke="%2523059669" stroke-width="6"/><circle cx="200" cy="150" r="70" fill="%252310B981"/><path d="M160 140 Q200 100 240 140 T320 140" fill="none" stroke="%252334D399" stroke-width="4" opacity="0.4"/><text x="200" y="255" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523A7F3D0" text-anchor="middle">KYOTO MATCHA</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%25237C2D12"/><circle cx="200" cy="150" r="90" fill="%2523E2E8F0" stroke="%2523CBD5E1" stroke-width="6"/><circle cx="200" cy="150" r="75" fill="%2523D97706"/><circle cx="180" cy="140" r="30" fill="%2523FFF"/><circle cx="180" cy="140" r="14" fill="%2523FBBF24"/><circle cx="220" cy="170" r="15" fill="%2523EF4444" opacity="0.8"/><text x="200" y="265" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523FEF3C7" text-anchor="middle">NASI GORENG KULLE</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%25231E3A8A"/><path d="M120 150 C120 220, 280 220, 280 150 Z" fill="%2523F1F5F9" stroke="%2523E2E8F0" stroke-width="6"/><path d="M110 150 L290 150" stroke="%2523E2E8F0" stroke-width="6"/><path d="M160 120 Q170 90 165 80 M200 120 Q210 90 205 80 M240 120 Q250 90 245 80" fill="none" stroke="%252393C5FD" stroke-width="4" stroke-linecap="round"/><circle cx="170" cy="165" r="12" fill="%2523EAB308"/><circle cx="220" cy="170" r="15" fill="%2523B45309"/><text x="200" y="255" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523BFDBFE" text-anchor="middle">SOP UBI PREMIUM</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%2523451A03"/><path d="M140 120 Q200 70 260 120 Z" fill="%2523D97706"/><rect x="130" y="120" width="140" height="12" rx="4" fill="%252322C55E"/><rect x="135" y="132" width="130" height="15" rx="5" fill="%252378350F"/><path d="M130 147 L270 147 L250 160 L150 160 Z" fill="%2523EAB308"/><path d="M140 160 Q200 180 260 160 Z" fill="%2523D97706"/><text x="200" y="240" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523FEF3C7" text-anchor="middle">WAGYU BURGER</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%2523065F46"/><rect x="130" y="100" width="140" height="100" rx="10" fill="%2523D97706" stroke="%252392400E" stroke-width="6"/><path d="M140 110 Q200 140 260 110 Q240 180 200 180 Q160 180 140 110 Z" fill="%252310B981"/><circle cx="200" cy="140" r="15" fill="%2523047857"/><text x="200" y="245" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523D1FAE5" text-anchor="middle">AVOCADO TOAST</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%252378350F"/><circle cx="200" cy="150" r="90" fill="%2523FEF3C7"/><path d="M140 150 Q200 110 260 150 Q200 170 140 150 Z" fill="%2523D97706" stroke="%2523B45309" stroke-width="4"/><path d="M160 130 Q220 90 280 130 Q220 150 160 130 Z" fill="%2523D97706" stroke="%2523B45309" stroke-width="4"/><text x="200" y="260" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523FDE68A" text-anchor="middle">PISANG GORENG</text></svg>',
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
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%25237C2D12"/><path d="M160 90 L170 210 Q200 220 230 210 L240 90 Z" fill="%2523F59E0B" stroke="%2523FFF" stroke-width="4"/><line x1="150" y1="90" x2="250" y2="90" stroke="%2523FFF" stroke-width="6"/><circle cx="230" cy="80" r="25" fill="%2523F97316"/><text x="200" y="260" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2523FFEDD5" text-anchor="middle">ORANGE JUICE</text></svg>',
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
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%25230F52BA"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">R</text></svg>'
  },
  {
    id: 'r2',
    name: 'Nadia Syafira',
    rating: 5,
    comment: 'Nasi Goreng Kulle dan Sop Ubi rasanya lezat sekali! Kuah sopnya gurih, kental, dan sangat cocok dinikmati saat santai. Desain kafe sangat estetik.',
    date: '2026-05-26',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%2523EC4899"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">N</text></svg>'
  },
  {
    id: 'r3',
    name: 'Andrew Tan',
    rating: 5,
    comment: 'Desain kafe berkelas, pelayanannya ramah, dan koneksi internetnya sangat cepat. Sangat merekomendasikan Avocado Sandwich dengan telur rebus setengah matang.',
    date: '2026-05-25',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%252310B981"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">A</text></svg>'
  },
  {
    id: 'r4',
    name: 'Safira Amanda',
    rating: 4,
    comment: 'Kyoto Matcha di sini rasanya pekat dan autentik. Penyajian piring dan cangkirnya sangat indah. Suasana premium tapi tetap hangat dan bersahabat.',
    date: '2026-05-24',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%25238B5CF6"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">S</text></svg>'
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
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%25230F52BA"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">A</text></svg>',
    lastOrder: '2026-05-29'
  },
  {
    id: 'c2',
    name: 'Karin Lestari',
    email: 'karin.les@gmail.com',
    phone: '08198765432',
    totalOrders: 8,
    totalSpent: 412000,
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%2523EC4899"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">K</text></svg>',
    lastOrder: '2026-05-29'
  },
  {
    id: 'c3',
    name: 'Michael Wong',
    email: 'm.wong@outlook.com',
    phone: '08112233445',
    totalOrders: 21,
    totalSpent: 1650000,
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%252310B981"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">M</text></svg>',
    lastOrder: '2026-05-29'
  },
  {
    id: 'c4',
    name: 'Stefani Melia',
    email: 'stef.melia@gmail.com',
    phone: '08223344556',
    totalOrders: 5,
    totalSpent: 228000,
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%25238B5CF6"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">S</text></svg>',
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
  { id: 'e1', name: 'Ibrahim Kulle', role: 'Admin', email: 'ibrahim@kullekopi.cafe', shift: 'Full Time', status: 'active', avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%25233B82F6"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">I</text></svg>' },
  { id: 'e2', name: 'Sarah Meisya', role: 'Barista', email: 'sarah.barista@kullekopi.cafe', shift: 'Morning (07:00 - 15:00)', status: 'active', avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%2523F43F5E"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">S</text></svg>' },
  { id: 'e3', name: 'Rahmat Hidayat', role: 'Chef', email: 'rahmat@kullekopi.cafe', shift: 'Morning (07:00 - 15:00)', status: 'active', avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%2523D97706"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">R</text></svg>' },
  { id: 'e4', name: 'Doni Saputra', role: 'Waiter', email: 'doni@kullekopi.cafe', shift: 'Evening (15:00 - 23:00)', status: 'active', avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%252314B8A6"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">D</text></svg>' }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  { id: 'p1', code: 'KULLEKAREN', description: 'Dapatkan diskon 15% untuk Es Kopi Kareng andalan kami!', discountPercent: 15, isActive: true, type: 'discount', bannerImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400"><rect width="1200" height="400" fill="%25231E293B"/><circle cx="600" cy="200" r="150" fill="%25230F52BA" opacity="0.3"/><text x="600" y="210" font-family="sans-serif" font-weight="bold" font-size="42" fill="%252338BDF8" text-anchor="middle">PROMO DISKON 15% - KULLEKAREN</text></svg>', validUntil: '2026-06-30' },
  { id: 'p2', code: 'MORNINGBREW', description: 'Diskon pagi khusus 10% untuk seluruh pilihan Kopi Hitam dari jam 07:00 hingga 11:00.', discountPercent: 10, isActive: false, type: 'campaign', bannerImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400"><rect width="1200" height="400" fill="%25230F172A"/><circle cx="600" cy="200" r="150" fill="%2523F59E0B" opacity="0.2"/><text x="600" y="210" font-family="sans-serif" font-weight="bold" font-size="42" fill="%2523FBBF24" text-anchor="middle">MORNING BREW - DISKON 10%</text></svg>', validUntil: '2026-07-15' },
  { id: 'p3', code: 'WAGYUSTEAL', description: 'Diskon 20% untuk Wagyu Burger spesial selama sesi live music jazz.', discountPercent: 20, isActive: false, type: 'event', bannerImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400"><rect width="1200" height="400" fill="%2523311005"/><circle cx="600" cy="200" r="150" fill="%2523EF4444" opacity="0.2"/><text x="600" y="210" font-family="sans-serif" font-weight="bold" font-size="42" fill="%2523F87171" text-anchor="middle">WAGYU BURGER EVENT - DISKON 20%</text></svg>', validUntil: '2026-05-31' }
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

export const INITIAL_GALLERY_PHOTOS: GalleryItem[] = [
  { id: 'g1', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%25230F172A"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%25231E293B" stroke="%252338BDF8" stroke-width="4"/><text x="400" y="310" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2523F8FAFC" text-anchor="middle">AREA DUDUK INDOOR ESTETIK</text></svg>', title: 'Area Duduk Indoor yang Estetik', category: 'interior' },
  { id: 'g2', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%25231E1B4B"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%2523312E81" stroke="%2523818CF8" stroke-width="4"/><text x="400" y="310" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2523F8FAFC" text-anchor="middle">PROSES PEMBUATAN KOPI SARING</text></svg>', title: 'Proses Pembuatan Kopi Saring', category: 'seduh' },
  { id: 'g3', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%2523062F4F"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%252313334C" stroke="%252300C9A7" stroke-width="4"/><text x="400" y="310" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2523F8FAFC" text-anchor="middle">AREA DECK TERBUKA (AL FRESCO)</text></svg>', title: 'Area Deck Terbuka (Al Fresco)', category: 'interior' },
  { id: 'g4', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%25234A2E1B"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%25235C3A21" stroke="%2523D97706" stroke-width="4"/><text x="400" y="310" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2523F8FAFC" text-anchor="middle">KOPI FLAT WHITE YANG LEMBUT</text></svg>', title: 'Kopi Flat White yang Lembut', category: 'kopi' },
  { id: 'g5', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%25232C1D11"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%25234A2E1B" stroke="%2523A16207" stroke-width="4"/><text x="400" y="310" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2523F8FAFC" text-anchor="middle">EKSTRAKSI ESPRESSO KHAS KULLE</text></svg>', title: 'Ekstraksi Espresso Khas Kulle', category: 'seduh' },
  { id: 'g6', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%25237C2D12"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%25239A3412" stroke="%2523F97316" stroke-width="4"/><text x="400" y="310" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2523F8FAFC" text-anchor="middle">NASI GORENG KULLE YANG LEZAT</text></svg>', title: 'Nasi Goreng Kulle yang Lezat', category: 'kuliner' }
];
