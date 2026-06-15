/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShoppingBag, Star, Menu as Hamburger, X, 
  MapPin, Clock, Plus, Minus, Send, Phone, ArrowRight,
  Wifi, Music, Coffee, Sparkles, Heart, Check,
  SendHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react';
import { MenuItem, Promotion, CafeSettings, Review, OrderItem, Order, GalleryItem } from '../types';
// @ts-ignore
import logoImg from '../assets/images/regenerated_image_1780051135628.png';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1920&q=80'
];

interface LandingPageProps {
  menuItems: MenuItem[];
  promotions: Promotion[];
  settings: CafeSettings;
  galleryPhotos?: GalleryItem[];
  reviews: Review[];
  onPlaceOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setView: (view: 'customer' | 'admin') => void;
}

const GALLERY_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', title: 'Area Duduk Indoor yang Estetik', category: 'interior' },
  { url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80', title: 'Proses Pembuatan Kopi Saring', category: 'seduh' },
  { url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', title: 'Area Deck Terbuka (Al Fresco)', category: 'interior' },
  { url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80', title: 'Kopi Flat White yang Lembut', category: 'kopi' },
  { url: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=800&q=80', title: 'Ekstraksi Espresso Khas Kulle', category: 'seduh' },
  { url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', title: 'Nasi Goreng Kulle yang Lezat', category: 'kuliner' },
];

const tabLabels: Record<string, string> = {
  home: 'Beranda',
  about: 'Tentang Kulle',
  menu: 'Menu',
  bestseller: 'Menu Terlaris',
  gallery: 'Galeri',
  testimonials: 'Ulasan',
  contact: 'Kontak'
};

export default function LandingPage({
  menuItems,
  promotions,
  settings,
  galleryPhotos = [],
  reviews,
  onPlaceOrder,
  isDarkMode,
  toggleDarkMode,
  setView
}: LandingPageProps) {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic Hero images from settings or fallback to defaults
  const activeHeroImages = [
    settings?.heroImageUrl1 || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80',
    settings?.heroImageUrl2 || 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1920&q=80',
    settings?.heroImageUrl3 || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80',
    settings?.heroImageUrl4 || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1920&q=80'
  ];

  // Hero Carousel State
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  // Auto rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % activeHeroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeHeroImages.length]);
  
  // Menu Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Gallery Lightbox State
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; title: string } | null>(null);
  
  // Testimonial State
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  
  // Cart States
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  
  // Checkout Info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('Meja 1');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris'>('qris');
  const [orderNotes, setOrderNotes] = useState('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<string | null>(null);

  // Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // WhatsApp Quick Chat State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState('Halo, saya ingin bertanya tentang reservasi atau menu di Kulle Kopi!');

  // Handle auto-rotation for reviews & bounds check
  useEffect(() => {
    if (reviews.length === 0) {
      if (currentReviewIdx !== 0) setCurrentReviewIdx(0);
      return;
    }
    if (currentReviewIdx >= reviews.length) {
      setCurrentReviewIdx(reviews.length - 1);
    }
    const interval = setInterval(() => {
      setCurrentReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length, currentReviewIdx]);

  // Handle scroll detection for blur navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prevCart.map((ci) => 
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { id: 'ci_' + Date.now() + Math.random().toString(36).substr(2, 5), menuItem: item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((ci) => ci.id !== id));
      return;
    }
    setCart((prev) => prev.map((ci) => ci.id === id ? { ...ci, quantity: newQty } : ci));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    onPlaceOrder({
      customerName,
      customerEmail: customerEmail || 'guest@kullekopi.cafe',
      customerPhone,
      items: cart,
      total: cartTotal,
      notes: orderNotes,
      tableNumber,
      paymentMethod
    });

    setLastPlacedOrder(orderId);
    setCheckoutStep('success');
    setCart([]);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 4000);
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(whatsappMsg);
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  // Filtering Logic
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesList = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'black coffee', label: 'Kopi Hitam' },
    { id: 'white coffee', label: 'Kopi Susu' },
    { id: 'non kopi', label: 'Non-Kopi' },
    { id: 'juice', label: 'Jus Segar' },
    { id: 'makanan berat', label: 'Makanan Berat' },
    { id: 'makanan ringan', label: 'Camilan' }
  ];

  return (
    <div id="landing-page" className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#060D1E] text-slate-100' : 'bg-white text-gray-800'}`}>
      
      {/* 1. TOP UTILITY HEADER */}
      <div className={`text-center py-2 px-4 transition-colors text-xs tracking-widest font-mono uppercase ${isDarkMode ? 'bg-[#0a152d] text-[#0F52BA]' : 'bg-slate-100 text-[#0F52BA]'}`}>
        ✨ #SahabatKulle • Pesan dari Meja Anda Secara Digital <span className="hidden sm:inline">• Buka Setiap Hari 07:00 - 23:00</span>
      </div>

      {/* 2. STICKY GLASSMORPHIC NAVBAR */}
      <nav id="navbar" className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md border-b ' + (isDarkMode ? 'bg-[#060D1E]/80 border-[#0F52BA]/20' : 'bg-white/80 border-slate-200/50 shadow-sm') : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center space-x-2 group">
              <div id="logo-icon" className="w-[140px] h-[35px] overflow-hidden group-hover:scale-105 transition-transform border border-slate-700/20 dark:border-slate-800 flex items-left justify-left bg-transparent">
                <img 
                  src={logoImg} 
                  alt="Kulle Kopi Logo" 
                  className="w-full h-full object-contain transition-all"
                  style={!isDarkMode ? { filter: 'brightness(0) saturate(100%) invert(21%) sepia(87%) saturate(3062%) hue-rotate(212deg) brightness(94%) contrast(101%)' } : {}}
                  referrerPolicy="no-referrer"
                />
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {['home', 'about', 'menu', 'bestseller', 'gallery', 'testimonials', 'contact'].map((tab) => (
                <a
                  key={tab}
                  href={`#${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium tracking-wide capitalize transition-colors py-2 relative ${activeTab === tab ? 'text-[#0F52BA]' : (isDarkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-[#0F52BA]')}`}
                >
                  {tabLabels[tab] || tabLabels['home']}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F52BA] dark:bg-[#0F52BA] rounded-full"
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Utility Toggles (Cart + DarkMode + Portal View Button) */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button 
                id="toggle-theme"
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg border transition-all ${isDarkMode ? 'border-slate-800 text-yellow-400 bg-slate-900/50 hover:bg-slate-900' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                aria-label="Toggle visual theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              <button
                id="view-cart-btn"
                onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
                className="relative p-2.5 rounded-xl bg-gradient-to-tr from-[#0F52BA] to-blue-500 hover:opacity-90 transition-opacity text-white flex items-center shadow-lg shadow-blue-500/10"
              >
                <ShoppingBag className="w-5 h-5 mr-1" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-ping-once border border-white">
                    {cartItemCount}
                  </span>
                )}
                <span className="text-xs font-semibold px-1">Keranjang</span>
              </button>

              <button
                id="admin-portal-switch"
                onClick={() => setView('admin')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${isDarkMode ? 'border-slate-800 text-slate-300 bg-slate-900/50 hover:border-cyan-500/30' : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-blue-500/20'}`}
              >
                Login Admin 🔒
              </button>
            </div>

            {/* Mobile Actions Menu Trigger */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                id="mobile-cart-btn"
                onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
                className="p-2 relative text-[#0F52BA] dark:text-cyan-400"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Hamburger className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Area */}
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-menu-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden border-b px-4 pt-2 pb-6 space-y-3 ${isDarkMode ? 'bg-[#060D1E] border-slate-800' : 'bg-white border-slate-200'}`}
          >
            {['home', 'about', 'menu', 'bestseller', 'gallery', 'testimonials', 'contact'].map((tab) => (
              <a
                key={tab}
                href={`#${tab}`}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide ${activeTab === tab ? (isDarkMode ? 'bg-slate-900 text-cyan-400' : 'bg-slate-100 text-[#0F52BA]') : (isDarkMode ? 'text-slate-300 hover:bg-slate-900/50' : 'text-gray-600 hover:bg-slate-50')}`}
              >
                {tab === 'bestseller' ? '🔥 Menu Terlaris' : (tabLabels[tab] || tabLabels['home']).toUpperCase()}
              </a>
            ))}
            <div className="flex items-center justify-between px-4 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">Tema Visual</span>
              <button 
                id="mobile-theme-toggle"
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-lg border text-xs flex items-center space-x-1"
              >
                <span>{isDarkMode ? '☀️ Terang' : '🌙 Gelap'}</span>
              </button>
            </div>
            <div className="pt-2">
              <button
                id="mobile-admin-switch"
                onClick={() => { setView('admin'); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-[#0F52BA]/10 text-[#0F52BA] dark:bg-cyan-500/10 dark:text-cyan-400 rounded-lg text-xs font-semibold"
              >
                Masuk ke Dashboard Admin 🔑
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* 3. HERO SECTION */}
      <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay Screen */}
        <div className="absolute inset-0 z-0">
          {activeHeroImages.map((imgUrl, idx) => (
            <img 
              key={idx}
              src={imgUrl} 
              alt={`Kulle Kopi Background ${idx + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover filter brightness-[0.35] contrast-[1.05] transition-all duration-[1200ms] ease-in-out ${currentHeroIdx === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
              referrerPolicy="no-referrer"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060D1E]/40 via-transparent to-[#060D1E]/95 z-10" />
        </div>

        {/* Carousel Prev & Next Controls */}
        <button
          onClick={() => setCurrentHeroIdx((prev) => (prev - 1 + activeHeroImages.length) % activeHeroImages.length)}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/30 dark:bg-slate-900/40 text-white/70 hover:text-white hover:bg-black/60 dark:hover:bg-[#0F52BA]/60 transition-all border border-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => setCurrentHeroIdx((prev) => (prev + 1) % activeHeroImages.length)}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/30 dark:bg-slate-900/40 text-white/70 hover:text-white hover:bg-black/60 dark:hover:bg-[#0F52BA]/60 transition-all border border-white/10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Dots Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {activeHeroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${currentHeroIdx === idx ? 'bg-blue-400 w-6' : 'bg-white/40 hover:bg-white/60 w-2'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full border border-[#0F52BA]/10 pointer-events-none" />
        <div className="absolute right-[-5%] top-[25%] h-[400px] w-[400px] rounded-full border-2 border-[#0F52BA]/20 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#0F52BA]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-[#0F52BA]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#0F52BA]"
          >
            Nikmati Seduhan Kopi Premium
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-8xl font-light leading-[0.95] text-white font-serif max-w-3xl mx-auto"
          >
            Seni <span className="font-serif font-bold italic text-[#0F52BA]">Kopi</span> &amp;{" "}
            <span className="block font-serif font-bold tracking-tight text-white">Suasana Nyaman.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-xs sm:text-sm text-slate-300 tracking-[0.2em] font-light max-w-xl mx-auto uppercase font-sans leading-relaxed"
          >
            {settings.tagline || "Kemewahan rasa kopi pilihan untuk mengawali setiap suasana nyaman Anda hari ini."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => {
                const menuSec = document.getElementById('menu');
                if (menuSec) menuSec.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl border border-[#0F52BA] dark:border-cyan-400 hover:bg-[#0F52BA] hover:text-white text-[#0F52BA] dark:text-cyan-300 font-bold text-[10px] tracking-widest uppercase backdrop-blur-sm bg-white/5 transition-all"
            >
              Lihat Menu
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4. ABOUT SECTION (STORY & FEATURES) */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div id="about-split-view" className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Split layout - Left side */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase font-mono tracking-widest text-[#0F52BA] dark:text-cyan-400 font-bold bg-blue-50 dark:bg-[#0a1f44] px-3.5 py-1.5 rounded-full inline-block">
                  {settings.aboutPill || 'WARISAN AUTENTIK'}
                </span>
                <h2 className="text-3xl sm:text-6xl font-light font-serif tracking-tight leading-tight">
                  {settings.aboutTitle ? (
                    <span>
                      {settings.aboutTitle.includes('Kulle Kopi') ? (
                        <>
                          {settings.aboutTitle.split('Kulle Kopi')[0]}
                          <span className="font-serif font-bold italic text-[#0F52BA] dark:text-cyan-400">Kulle Kopi</span>
                          {settings.aboutTitle.split('Kulle Kopi')[1]}
                        </>
                      ) : (
                        settings.aboutTitle
                      )}
                    </span>
                  ) : (
                    <>
                      Menciptakan Momen Indah di <span className="font-serif font-bold italic text-[#0F52BA] dark:text-cyan-400">Kulle Kopi</span>
                    </>
                  )}
                </h2>
              </div>

              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {settings.aboutDescription || 'Didirikan di atas nilai ketepatan rasa, kehangatan pelayanan, dan kualitas terbaik, Kulle Kopi memadukan biji kopi Arabika pilihan dengan menu kuliner lezat yang menonjolkan kekayaan lokal dan kenyamanan modern. Di sini, kopi bukan sekadar minuman, melainkan sebuah cerita rasa yang diracik khusus untuk menginspirasi Anda.'}
              </p>

              {/* Info Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#0F52BA]/10 text-[#0F52BA] dark:text-cyan-300 flex items-center justify-center mb-4">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase">{settings.aboutFeature1Title || '☕ BIJI KOPI PILIHAN'}</h4>
                  <p className="text-xs text-slate-400 mt-2">{settings.aboutFeature1Desc || '100% biji kopi Arabika single-origin Kintamani & Toraja yang disangrai perlahan untuk mengoptimalkan keaslian rasa.'}</p>
                </div>

                <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#0F52BA]/10 text-[#0F52BA] dark:text-cyan-300 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase">{settings.aboutFeature2Title || '🍔 MAKANAN LEZAT'}</h4>
                  <p className="text-xs text-slate-400 mt-2">{settings.aboutFeature2Desc || 'Disajikan segar setiap hari oleh juru masak profesional kami untuk menghadirkan rasa yang istimewa.'}</p>
                </div>
              </div>

              {/* Amenity Icons Wrap */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Wifi className="w-4 h-4 text-emerald-400" /> Internet WiFi Fiber Sangat Cepat
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Music className="w-4 h-4 text-purple-400" /> Pertunjukan Musik Jazz Mingguan
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Heart className="w-4 h-4 text-red-400" /> Tempat Duduk yang Nyaman &amp; Ergonomis
                </span>
              </div>
            </div>

            {/* Split layout - Right side */}
            <div className="lg:col-span-5 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500 border border-slate-200 dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=80" 
                  alt="Kulle Kopi Lounge Interior" 
                  className="w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060D1E]/80 via-transparent to-transparent" />
                
                {/* Float Card Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/40 border border-white/20 text-white flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-lg text-cyan-300 font-mono">4.9 ★</h5>
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Rating Kuliner</p>
                  </div>
                  <div className="border-l border-white/10 h-10" />
                  <div>
                    <h5 className="font-bold text-lg font-mono">1.000+</h5>
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Pengunjung Mingguan</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. MENU SECTION */}
      <section id="menu" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-[#0F52BA] dark:text-cyan-400 font-bold tracking-[0.2em]">
              Menu yang Dikreasikan Sempurna
            </span>
            <h2 className="text-3xl sm:text-6xl font-light font-serif tracking-tight text-white">
              Kreasi <span className="font-serif font-bold italic text-[#0F52BA] dark:text-cyan-400">Kuliner</span> Kami
            </h2>
            <div className="w-12 h-[2px] bg-[#0F52BA] dark:bg-cyan-400 mx-auto" />
          </div>

          {/* Filter Bar + Search Bar Container */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12">
            {/* Search */}
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Cari kopi atau hidangan lezat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500' : 'bg-white border-slate-200 placeholder-slate-400 focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA]'}`}
              />
            </div>

            {/* Category tabs */}
            <div id="category-scroller" className="flex flex-wrap justify-center items-center gap-2 max-w-full overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id.replace(' ', '-')}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 ${selectedCategory === cat.id ? 'bg-[#0F52BA] text-white border-[#0F52BA] shadow-lg shadow-blue-500/10' : (isDarkMode ? 'bg-slate-900/40 text-slate-300 border-slate-800 hover:border-slate-700' : 'bg-slate-50 text-gray-700 border-slate-100 hover:bg-slate-100')}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Item Cards Grid */}
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400">Tidak ada hidangan yang cocok dengan pilihan pencarian Anda.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 bg-[#0F52BA]/15 text-[#0F52BA] rounded-xl text-xs font-semibold"
              >
                Hapus Filter
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredMenuItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    id={`menu-card-${item.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className={`rounded-2xl border transition-all overflow-hidden relative flex flex-col group ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15 hover:border-[#0F52BA]/40' : 'bg-white border-slate-100 hover:border-slate-300/60 shadow-md shadow-slate-100'}`}
                  >
                    {/* Item Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 border-b border-inherit">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                      
                      {/* Rating details badge */}
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-lg backdrop-blur-md bg-white/95 text-slate-900 font-bold text-[10px] shadow flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> {item.rating}
                      </span>

                      {/* Best seller status */}
                      {item.isBestSeller && (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-mono tracking-widest text-[8px] font-black uppercase shadow animate-pulse">
                          TERLARIS 🔥
                        </span>
                      )}

                      {/* Stock availability indicator */}
                      {!item.isAvailable || item.stock === 0 ? (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                            HABIS HARI INI
                          </span>
                        </div>
                      ) : item.stock <= 5 ? (
                        <span className="absolute bottom-3 left-3 px-2 py-1 bg-orange-600/90 text-white text-[9px] font-bold rounded">
                          Sisa {item.stock} porsi!
                        </span>
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#0F52BA] dark:text-cyan-400 font-bold mt-1">
                          {categoriesList.find(c => c.id === item.category)?.label || item.category}
                        </div>
                        <h3 className="font-extrabold text-base tracking-tight">{item.name}</h3>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="font-extrabold text-sm font-mono text-slate-800 dark:text-white">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        
                        <button
                          id={`add-to-cart-${item.id}`}
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable || item.stock === 0}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 ${(!item.isAvailable || item.stock === 0) ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-[#0F52BA] to-blue-500 hover:brightness-110 text-white hover:scale-[1.03]'}`}
                        >
                          <Plus className="w-3.5 h-3.5" /> TAMBAH
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>

      {/* 7. BEST SELLER SECTION */}
      <section id="bestseller" className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-[#030915]' : 'bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-[#0F52BA] dark:text-cyan-400 font-bold tracking-[0.2em]">
                Pemenang Penghargaan &amp; Favorit Pelanggan
              </span>
              <h2 className="text-3xl sm:text-6xl font-light font-serif tracking-tight text-white">
                Pilihan Menu <span className="font-serif font-bold italic text-[#0F52BA] dark:text-cyan-400">Andalan</span> Kami
              </h2>
            </div>
            <p className="text-xs max-w-xs text-slate-400 mt-4 md:mt-0 font-mono">
              Diseduh dingin secara khusus dan dimasak segar setiap hari dengan teknik tradisional terbaik oleh barista dan koki ahli kami.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Best Seller Card 1: Es Kopi Kareng */}
            {menuItems.find(i => i.id === 'm3') && (
              <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row gap-8 group ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/20' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                {/* Image panel */}
                <div className="w-full md:w-1/2 h-64 md:h-full min-h-[220px] rounded-2xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"
                    alt="Es Kopi Kareng"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 py-1 px-2 text-[9px] font-bold rounded uppercase bg-yellow-500 text-slate-900 tracking-wider">
                    ⭐ 5.0 (500+ Ulasan)
                  </div>
                </div>
                {/* Detail panel */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#0F52BA] dark:text-cyan-400 font-bold">Kopi Dingin Legendaris</span>
                    <h3 className="text-2xl font-extrabold tracking-tight mt-1">Es Kopi Kareng</h3>
                    <p className={`text-xs leading-relaxed mt-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Minuman terlaris nomor 1 Kulle Kopi. Cita rasa berlapis memadukan madu alami, krim kental segar, nektar bunga kelapa, dan ekstrak ganda kopi Arabika Toraja.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-6">
                    <span className="text-lg font-bold font-mono text-[#0F52BA] dark:text-cyan-300">Rp 38.000</span>
                    <button
                      onClick={() => handleAddToCart(menuItems.find(i => i.id === 'm3')!)}
                      className="px-4 py-2 bg-[#0F52BA] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10"
                    >
                      PESAN SEKARANG
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Best Seller Card 2: Nasi Goreng Kulle */}
            {menuItems.find(i => i.id === 'm5') && (
              <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row gap-8 group ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/20' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                {/* Image panel */}
                <div className="w-full md:w-1/2 h-64 md:h-full min-h-[220px] rounded-2xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80"
                    alt="Nasi Goreng Kulle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 py-1 px-2 text-[9px] font-bold rounded uppercase bg-yellow-500 text-slate-900 tracking-wider">
                    ⭐ 4.9 (380+ Ulasan)
                  </div>
                </div>
                {/* Detail panel */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#0F52BA] dark:text-cyan-400 font-bold">Seni Masak Wajan Orisinil</span>
                    <h3 className="text-2xl font-extrabold tracking-tight mt-1">Nasi Goreng Kulle</h3>
                    <p className={`text-xs leading-relaxed mt-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Hidangan ikonik kami. Nasi lokal harum yang dikaramelisasi di wajan bersuhu tinggi dengan pasta cabai manis resep rahasia kami, disajikan dengan irisan daging ayam bumbu panggang, udang segar, dan acar.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-6">
                    <span className="text-lg font-bold font-mono text-[#0F52BA] dark:text-cyan-300">Rp 55.000</span>
                    <button
                      onClick={() => handleAddToCart(menuItems.find(i => i.id === 'm5')!)}
                      className="px-4 py-2 bg-[#0F52BA] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10"
                    >
                      PESAN SEKARANG
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. GALLERY SECTION */}
      <section id="gallery" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-[#0F52BA] dark:text-cyan-400 font-bold">
            Rasakan Suasana Kafe Kami
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Galeri Kulle Kopi
          </h2>
          <div className="w-16 h-1 bg-[#0F52BA] dark:bg-cyan-400 mx-auto rounded-full" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(galleryPhotos && galleryPhotos.length > 0 ? galleryPhotos : GALLERY_PHOTOS).map((photo, idx) => (
            <motion.div
              key={'id' in photo ? photo.id : idx}
              id={`gallery-item-${idx}`}
              onClick={() => setActiveLightboxImg(photo)}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer relative rounded-2xl overflow-hidden h-72 border border-slate-200 dark:border-slate-800 bg-slate-100"
            >
              <img 
                src={photo.url} 
                alt={photo.title}
                className="w-full h-full object-cover transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black mb-1">{photo.category}</span>
                <h4 className="font-bold text-white text-base leading-snug">{photo.title}</h4>
                <p className="text-[10px] text-slate-300 mt-2 flex items-center gap-1">Klik untuk memperbesar <ArrowRight className="w-3 h-3" /></p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Lightbox Dialog Modal */}
        <AnimatePresence>
          {activeLightboxImg && (
            <motion.div
              id="lightbox-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightboxImg(null)}
              className="fixed inset-0 bg-[#0A1F44]/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full bg-[#060D1E] rounded-3xl overflow-hidden border border-[#0F52BA]/20 relative"
              >
                <button
                  onClick={() => setActiveLightboxImg(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <img 
                  src={activeLightboxImg.url} 
                  alt={activeLightboxImg.title} 
                  className="w-full max-h-[70vh] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6 text-white text-center">
                  <h3 className="text-lg font-bold uppercase tracking-wide">{activeLightboxImg.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-mono">Momen Spesial Kulle Kopi</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section id="testimonials" className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-[#030814]' : 'bg-slate-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <span className="text-xs uppercase font-mono tracking-widest text-[#0F52BA] dark:text-cyan-400 font-bold">
            Ulasan Pengunjung
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-12">
            Dicintai #SahabatKulle
          </h2>

          <div className="min-h-[220px] flex items-center justify-center">
            {reviews.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIdx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 md:p-12 rounded-3xl border text-left flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/25' : 'bg-white border-slate-200'}`}
                >
                  <img
                    src={reviews[currentReviewIdx].avatar}
                    alt={reviews[currentReviewIdx].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#0F52BA] shadow-lg shadow-blue-500/10"
                  />
                  <div className="text-center md:text-left space-y-4">
                    <div className="flex justify-center md:justify-start">
                      {Array.from({ length: reviews[currentReviewIdx].rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>

                    <p className={`text-base font-medium italic ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                      "{reviews[currentReviewIdx].comment}"
                    </p>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{reviews[currentReviewIdx].name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-wider">{reviews[currentReviewIdx].date} • Penilai Terverifikasi</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Slider Controls */}
          <div className="flex justify-center gap-3 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentReviewIdx(idx)}
                className={`w-3.5 h-3.5 rounded-full transition-all ${currentReviewIdx === idx ? 'bg-[#0F52BA] w-8' : 'bg-slate-300 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT SECTION */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left panel */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-[#0F52BA] dark:text-cyan-400 font-bold">
                Kunjungi Kami di Jeneponto
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Lokasi Kulle Kopi
              </h2>
            </div>
            
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Kulle Coffee & Eatery merupakan salah satu café modern yang cukup populer di Kabupaten Jeneponto, Sulawesi Selatan. Café ini mengusung konsep coffee shop kekinian dengan perpaduan suasana cozy, modern, dan instagramable yang cocok untuk nongkrong, bekerja, diskusi, maupun berkumpul bersama teman dan keluarga.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F52BA]/10 text-[#0F52BA] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Alamat Kami</h4>
                  <p className="text-xs text-slate-400 mt-1">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F52BA]/10 text-[#0F52BA] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Jam Buka</h4>
                  <p className="text-xs text-slate-400 mt-1">{settings.openingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F52BA]/10 text-[#0F52BA] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Hotline Kontak</h4>
                  <p className="text-xs text-slate-400 mt-1">{settings.contactPhone}</p>
                  <p className="text-xs text-slate-400">{settings.contactEmail}</p>
                </div>
              </div>
            </div>

            {/* Direct Instant Action Links */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4">
              <a 
                href={settings.instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2.5 rounded-xl border border-[#0F52BA]/30 hover:border-[#0F52BA] text-[#0F52BA] dark:text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                Follow Instagram 📸
              </a>
              <button 
                onClick={() => setIsWhatsAppOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                Chat WhatsApp 💬
              </button>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-2xl overflow-hidden h-72 border border-slate-200 dark:border-slate-800 bg-slate-100 relative">
              <iframe 
                src="https://maps.google.com/maps?q=Kulle%20Kopi,%20Kec.%20Binamu,%20Kabupaten%20Jeneponto,%20Sulawesi%20Selatan&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                className="w-full h-full border-0 brightness-[1.03]" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer"
                title="Kulle Kopi Google Map Spot"
              />
            </div>

            {/* In-app Customer feedback form */}
            <div className={`p-6 md:p-8 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-slate-50 border-slate-200/50'}`}>
              <h3 className="text-lg font-bold">Pertanyaan &amp; Reservasi Meja</h3>
              
              <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Nama Lengkap</label>
                    <input
                      required
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="contoh: Raditya"
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Alamat Email</label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contoh: raditya@mail.com"
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Pesan / Permintaan</label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tulis pertanyaan atau jadwal reservasi meja Anda di sini..."
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none resize-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                  />
                </div>

                <button
                  id="submit-contact"
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-tr from-[#0F52BA] to-blue-500 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Send className="w-4 h-4" /> KIRIM PERTANYAAN
                </button>

                {contactSubmitted && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-500 font-bold text-center mt-2"
                  >
                    ✓ Terima kasih! Tim kami akan menghubungi Anda kembali lewat email dalam waktu 24 jam.
                  </motion.p>
                )}
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 11. INTUITIVE FLOATING CART SLIDE-OVER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-neutral-900"
            />

            {/* Panel */}
            <motion.div
              id="sidebar-cart"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`relative w-full max-w-md h-full flex flex-col justify-between shadow-2xl ${isDarkMode ? 'bg-[#081226] text-slate-100 border-l border-[#0F52BA]/20' : 'bg-white text-slate-800'}`}
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0F52BA] dark:text-cyan-400" />
                  <h3 className="text-lg font-extrabold">Cangkir Kulle Anda</h3>
                </div>
                <button
                  id="close-cart-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {checkoutStep === 'cart' && (
                  <>
                    {cart.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <span className="text-4xl">☕</span>
                        <h4 className="font-bold text-sm">Cangkir Anda Masih Kosong</h4>
                        <p className="text-xs text-slate-400">Silakan lihat Menu kami dan tambahkan hidangan favorit Anda ke keranjang!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border flex gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/50'}`}>
                            <img
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              className="w-16 h-16 rounded-lg object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 space-y-2">
                              <h4 className="font-bold text-xs">{item.menuItem.name}</h4>
                              <p className="text-[11px] text-slate-400 font-mono">Rp {item.menuItem.price.toLocaleString('id')}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                                  <button
                                    onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                                    className="p-1 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                                    className="p-1 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-xs font-extrabold font-mono">
                                  Rp {(item.menuItem.price * item.quantity).toLocaleString('id')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === 'details' && (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                    <h4 className="font-bold text-sm tracking-tight">Isi Detail Pemesanan</h4>
                    <p className="text-[11px] text-slate-400">Struk pemesanan akan dibuat otomatis dan terhubung ke sistem kasir kami.</p>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Nama Kontak *</label>
                      <input
                        required
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="contoh: Aditya"
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Nomor Telepon *</label>
                      <input
                        required
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="contoh: 08123456789"
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Alamat Email</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="contoh: aditya@mail.com"
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Nomor Meja</label>
                        <select
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                        >
                          {Array.from({ length: 15 }).map((_, idx) => (
                            <option key={idx} value={`Meja ${idx + 1}`}>Meja {idx + 1}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Metode Pembayaran</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                        >
                          <option value="qris">E-Wallet QRIS 📱</option>
                          <option value="card">Kartu Debit / Kredit 💳</option>
                          <option value="cash">Bayar di Kasir 💵</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Catatan Tambahan</label>
                      <textarea
                        rows={2}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="contoh: es sedikit, sup hangat, rasa pedas..."
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none resize-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>

                    <button
                      id="confirm-checkout"
                      type="submit"
                      className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-sm rounded-xl hover:translate-y-[-1px] transition-all shadow-md"
                    >
                      KONFIRMASI &amp; PESAN SEKARANG
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="w-full text-center text-xs text-slate-400 hover:text-slate-200 mt-2 underline"
                    >
                      Kembali ke Keranjang
                    </button>
                  </form>
                )}

                {checkoutStep === 'success' && (
                  <div className="text-center py-16 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-2xl">
                      ✓
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-[#0F52BA] dark:text-cyan-400 text-lg uppercase tracking-wider">Pesanan Berhasil Dikirim!</h4>
                      <p className="text-emerald-500 font-bold font-mono text-sm">{lastPlacedOrder}</p>
                      <p className="text-xs text-slate-400 px-4">
                        Pesanan Anda telah berhasil masuk ke dashboard admin Kulle Kopi! Koki dapur kami sedang mulai menyiapkan pesanan Anda.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl relative border border-slate-800 bg-slate-900/50 text-left space-y-2 text-xs">
                      <p className="font-bold text-slate-300">Simulator alur pesanan langsung:</p>
                      <p className="text-slate-400">
                        🔑 Masuk ke <span className="underline font-bold text-white cursor-pointer" onClick={() => { setView('admin'); setIsCartOpen(false); }}>Panel Admin</span> menggunakan tombol di bagian atas untuk mengelola pesanan ini.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setCheckoutStep('cart');
                      }}
                      className="px-6 py-2.5 bg-[#0F52BA] text-white text-xs font-semibold rounded-lg"
                    >
                      Bagus, Lanjutkan
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer summary info */}
              {checkoutStep === 'cart' && cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span>Total Hidangan Terpilih</span>
                    <span className="text-base font-extrabold font-mono text-[#0F52BA] dark:text-cyan-300">
                      Rp {cartTotal.toLocaleString('id')}
                    </span>
                  </div>
                  
                  <button
                    id="checkout-next-btn"
                    onClick={() => setCheckoutStep('details')}
                    className="w-full py-3 bg-gradient-to-r from-[#0F52BA] to-blue-500 hover:brightness-110 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg"
                  >
                    LANJUT KE DETAIL PESANAN <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 12. WHATSAPP CHAT DRAWER */}
      <AnimatePresence>
        {isWhatsAppOpen && (
          <div className="fixed bottom-6 right-6 z-50 max-w-xs w-full">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-[#081226] border-[#0F52BA]/30 text-white' : 'bg-white text-slate-800 border-slate-200'}`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">RESEPSIONIS KULLE</span>
                </div>
                <button onClick={() => setIsWhatsAppOpen(false)} className="text-slate-400 hover:text-red-500 font-bold text-xs">✕</button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-400">Ketik pesan di bawah ini untuk mengirimkannya langsung ke WhatsApp resmi kami.</p>
                <textarea
                  rows={2}
                  value={whatsappMsg}
                  onChange={(e) => setWhatsappMsg(e.target.value)}
                  className={`w-full p-2 text-xs rounded border outline-none resize-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              <button
                onClick={handleWhatsAppSend}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <SendHorizontal className="w-3.5 h-3.5" /> Hubungi WhatsApp
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING QUICK ORDERS CART BUTTON */}
      {cartItemCount > 0 && !isCartOpen && (
        <motion.button
          id="floating-cart-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
          className="fixed bottom-6 right-6 z-30 p-4 rounded-full bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white shadow-2xl shadow-blue-500/20 flex items-center gap-2 font-bold text-xs"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{cartItemCount} Menu • Rp {cartTotal.toLocaleString('id')}</span>
        </motion.button>
      )}

      {/* 13. FOOTER AREA */}
      <footer id="footer" className="bg-[#0A1F44] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          {/* Brand profile */}
          <div className="space-y-4">
            <div className="h-12 flex items-center bg-transparent">
              <img 
                src={logoImg} 
                alt="Kulle Kopi Logo" 
                className="h-full w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light uppercase tracking-wider">
              {settings.tagline}
            </p>
            <div className="flex space-x-3 pt-2">
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                📸
              </a>
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                💬
              </a>
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                📱
              </a>
            </div>
          </div>

          {/* Quick connections */}
          <div className="space-y-4 col-span-1">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest text-cyan-400">Tautan Langsung</h4>
            <div className="flex flex-col space-y-2 text-xs">
              <a href="#about" className="hover:text-[#0F52BA] transition-colors">{tabLabels['about']}</a>
              <a href="#menu" className="hover:text-[#0F52BA] transition-colors">{tabLabels['menu']}</a>
              <a href="#bestseller" className="hover:text-[#0F52BA] transition-colors">{tabLabels['bestseller']}</a>
              <a href="#testimonials" className="hover:text-[#0F52BA] transition-colors">{tabLabels['testimonials']}</a>
              <span className="text-yellow-400 underline cursor-pointer" onClick={() => setView('admin')}>
                🔑 Admin Portal
              </span>
            </div>
          </div>

          {/* Location summary */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest text-cyan-400">Alamat Lengkap</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.address}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Jam Buka: {settings.openingHours}
            </p>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest text-cyan-400">Buletin Kulle Club</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daftar untuk mendapatkan undangan khusus ke pelatihan seduh kopi bulanan dan kedatangan biji kopi premium baru.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih telah berlangganan! Periksa email Anda untuk mendapatkan kode diskon.'); }} className="flex gap-2">
              <input
                required
                type="email"
                placeholder="email@domain.com"
                className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-slate-500 outline-none w-full"
              />
              <button type="submit" className="px-3 bg-gradient-to-tr from-[#0F52BA] to-blue-500 hover:brightness-110 text-white rounded-lg text-xs font-bold font-mono">
                SUB
              </button>
            </form>
          </div>
        </div>

        {/* Legal area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>© {new Date().getFullYear()} Kulle Kopi Cafe &amp; Lounges Co. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="font-mono text-[9px]">Didesain dengan Estetika Blue Sapphire &amp; Glassmorphism.</p>
        </div>
      </footer>

    </div>
  );
}
