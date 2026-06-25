/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Activity, ShoppingBag, Users, Calendar, Settings, 
  Search, Bell, User, LayoutDashboard, UtensilsCrossed, PackageOpen, 
  HelpCircle, LogOut, Check, X, ShieldAlert, Plus, Eye, Printer, 
  Tag, Compass, Sparkles, Filter, ToggleLeft, Edit, Trash2, CheckCircle2,
  DollarSign, RefreshCcw, Landmark, Upload, Image, Info, MessageSquare, Star
 } from 'lucide-react';
import { MenuItem, Order, Customer, InventoryItem, Employee, Promotion, CafeSettings, OrderStatus, Category, GalleryItem, Review } from '../types';
import { supabase } from '../supabaseClient';
// @ts-ignore
import logoImg from '../assets/images/regenerated_image_1780051135628.png';
// @ts-ignore
import heroImg2 from '../assets/images/regenerated_image_1781558986012.jpg';
// @ts-ignore
import heroImg3 from '../assets/images/regenerated_image_1781558820689.jpg';
// @ts-ignore
import heroImg4 from '../assets/images/regenerated_image_1781558991574.jpg';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  orders: Order[];
  customers: Customer[];
  inventory: InventoryItem[];
  employees: Employee[];
  promotions: Promotion[];
  settings: CafeSettings;
  galleryPhotos: GalleryItem[];
  reviews: Review[];
  onUpdateMenu: (updated: MenuItem[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  onUpdateCustomers?: (updated: Customer[]) => void;
  onUpdateInventory: (updated: InventoryItem[]) => void;
  onUpdateEmployees: (updated: Employee[]) => void;
  onUpdatePromotions: (updated: Promotion[]) => void;
  onUpdateSettings: (settings: CafeSettings) => void;
  onUpdateGallery: (updated: GalleryItem[]) => void;
  onUpdateReviews: (updated: Review[]) => void;
  onDeleteSeededData?: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setView: (view: 'customer' | 'admin') => void;
}

export default function AdminDashboard({
  menuItems,
  orders,
  customers,
  inventory,
  employees,
  promotions,
  settings,
  galleryPhotos,
  reviews,
  onUpdateMenu,
  onUpdateOrders,
  onUpdateCustomers,
  onUpdateInventory,
  onUpdateEmployees,
  onUpdatePromotions,
  onUpdateSettings,
  onUpdateGallery,
  onUpdateReviews,
  onDeleteSeededData,
  isDarkMode,
  toggleDarkMode,
  setView
}: AdminDashboardProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState<'Admin' | 'Barista' | 'Chef'>('Admin');
  const [authError, setAuthError] = useState('');
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Registration states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<Array<{ fullName: string; email: string; password: string }>>(() => {
    const saved = localStorage.getItem('kulle_registered_users');
    return saved ? JSON.parse(saved) : [
      { fullName: 'Admin Kulle', email: 'admin', password: 'admin123' },
      { fullName: 'Admin Kulle', email: 'admin@kullekopi.cafe', password: 'admin123' }
    ];
  });

  // Layout navigation state
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');

  // Synchronize with Supabase Auth session and protect private views
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Protect private pages: if there is no session, redirect to '/login'
        if (window.location.pathname !== '/login') {
          window.history.pushState({}, '', '/login');
        }
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        if (window.location.pathname === '/login') {
          window.history.pushState({}, '', '/');
        }
      } else {
        setIsAuthenticated(false);
        if (window.location.pathname !== '/login') {
          window.history.pushState({}, '', '/login');
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  const [sidebarCollapsible, setSidebarCollapsible] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    'New pending table order ORD-9304 arrived.',
    'Inventory Warning: Arabica beans dropping below min threshold!',
    'Promotion CAMPAIGN "MORNINGBREW" successfully launched.'
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search logic states inside dashboard views
  const [dashSearchInput, setDashSearchInput] = useState('');

  // detail modal states
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [showPrintInvoice, setShowPrintInvoice] = useState<Order | null>(null);

  // --- Dynamic Form Addition/Modification States ---
  // Menu Item
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuFormName, setMenuFormName] = useState('');
  const [menuFormPrice, setMenuFormPrice] = useState(30000);
  const [menuFormDesc, setMenuFormDesc] = useState('');
  const [menuFormCategory, setMenuFormCategory] = useState<Category>('black coffee');
  const [menuFormImage, setMenuFormImage] = useState('');
  const [menuFormStock, setMenuFormStock] = useState(100);
  const [menuFormBestSeller, setMenuFormBestSeller] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  // Inventory
  const [invFormOpen, setInvFormOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);
  const [invName, setInvName] = useState('');
  const [invStock, setInvStock] = useState(10);
  const [invUnit, setInvUnit] = useState('kg');
  const [invMin, setInvMin] = useState(5);
  const [invCategory, setInvCategory] = useState('Supplier Core');
  const [invSupplier, setInvSupplier] = useState('');

  // Employees
  const [empFormOpen, setEmpFormOpen] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState<'Barista' | 'Chef' | 'Waiter' | 'Cashier'>('Barista');
  const [empEmail, setEmpEmail] = useState('');
  const [empShift, setEmpShift] = useState<'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)'>('Morning (07:00 - 15:00)');

  // Promotion
  const [promoFormOpen, setPromoFormOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoDisc, setPromoDisc] = useState(15);
  const [promoType, setPromoType] = useState<'discount' | 'event' | 'campaign'>('discount');

  // Cafe Settings State Modification
  const [settingsBrand, setSettingsBrand] = useState(settings.brandName);
  const [settingsTagline, setSettingsTagline] = useState(settings.tagline);
  const [settingsHours, setSettingsHours] = useState(settings.openingHours);
  const [settingsAddr, setSettingsAddr] = useState(settings.address);
  const [settingsPhone, setSettingsPhone] = useState(settings.contactPhone);
  const [settingsEmail, setSettingsEmail] = useState(settings.contactEmail);
  const [settingsWA, setSettingsWA] = useState(settings.whatsappNumber);
  const [settingsFavicon, setSettingsFavicon] = useState(settings.faviconUrl || '');
  const [settingsHero1, setSettingsHero1] = useState(settings.heroImageUrl1 || '');
  const [settingsHero2, setSettingsHero2] = useState(settings.heroImageUrl2 || '');
  const [settingsHero3, setSettingsHero3] = useState(settings.heroImageUrl3 || '');
  const [settingsHero4, setSettingsHero4] = useState(settings.heroImageUrl4 || '');
  const [settingsDisableOrderButtons, setSettingsDisableOrderButtons] = useState(settings.disableOrderButtons || false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Tentang Kulle states
  const [aboutPill, setAboutPill] = useState(settings.aboutPill || 'WARISAN AUTENTIK');
  const [aboutTitle, setAboutTitle] = useState(settings.aboutTitle || 'Menciptakan Momen Indah di Kulle Kopi');
  const [aboutDescription, setAboutDescription] = useState(settings.aboutDescription || 'Didirikan di atas nilai ketepatan rasa, kehangatan pelayanan, dan kualitas terbaik, Kulle Kopi memadukan biji kopi Arabika pilihan dengan menu kuliner lezat yang menonjolkan kekayaan lokal dan kenyamanan modern. Di sini, kopi bukan sekadar minuman, melainkan sebuah cerita rasa yang diracik khusus untuk menginspirasi Anda.');
  const [aboutFeature1Title, setAboutFeature1Title] = useState(settings.aboutFeature1Title || '☕ BIJI KOPI PILIHAN');
  const [aboutFeature1Desc, setAboutFeature1Desc] = useState(settings.aboutFeature1Desc || '100% biji kopi Arabika single-origin Kintamani & Toraja yang disangrai perlahan untuk mengoptimalkan keaslian rasa.');
  const [aboutFeature2Title, setAboutFeature2Title] = useState(settings.aboutFeature2Title || '🍔 MAKANAN LEZAT');
  const [aboutFeature2Desc, setAboutFeature2Desc] = useState(settings.aboutFeature2Desc || 'Disajikan segar setiap hari oleh juru masak profesional kami untuk menghadirkan rasa yang istimewa.');
  const [aboutSavedSuccess, setAboutSavedSuccess] = useState(false);

  // Gallery Modification States
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryFormTitle, setGalleryFormTitle] = useState('');
  const [galleryFormCategory, setGalleryFormCategory] = useState('interior');
  const [galleryFormImage, setGalleryFormImage] = useState('');
  const [isDraggingGalleryImage, setIsDraggingGalleryImage] = useState(false);

  // Reviews Modification States
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewFormName, setReviewFormName] = useState('');
  const [reviewFormComment, setReviewFormComment] = useState('');
  const [reviewFormRating, setReviewFormRating] = useState(5);
  const [reviewFormDate, setReviewFormDate] = useState('');
  const [reviewFormAvatar, setReviewFormAvatar] = useState('');

  // Customer Modification States
  const [custFormOpen, setCustFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [custFormName, setCustFormName] = useState('');
  const [custFormEmail, setCustFormEmail] = useState('');
  const [custFormPhone, setCustFormPhone] = useState('');
  const [custFormTotalOrders, setCustFormTotalOrders] = useState(0);
  const [custFormTotalSpent, setCustFormTotalSpent] = useState(0);
  const [custFormAvatar, setCustFormAvatar] = useState('');

  // Custom Confirmation Dialog State for bypassing sandboxed iframe restrictions
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);


  // Authentication validation
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setIsAuthenticated(true);
        setAuthError('');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Terjadi kesalahan sistem saat masuk.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPassword) {
      setRegError('Semua field wajib diisi.');
      return;
    }
    setRegError('');
    setRegSuccess('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            full_name: regFullName,
          }
        }
      });

      if (error) {
        setRegError(error.message);
      } else {
        // Prepare the sign-in form
        setAuthEmail(regEmail.trim());
        setAuthPassword('');
        setSignupSuccessMsg("Your account has been created. Please check your email and verify your address before logging in.");
        
        // Reset full registration states
        setRegFullName('');
        setRegEmail('');
        setRegPassword('');
        
        // Redirect to Sign In page
        setIsRegisterMode(false);
      }
    } catch (err: any) {
      setRegError(err?.message || 'Terjadi kesalahan sistem saat mendaftar.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setForgotSuccess(false);
        setForgotEmail('');
      }, 3000);
    }
  };

  // --- BUSINESS LOGIC DISPATCHERS ---

  // Order state togglers
  const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status };
      }
      return ord;
    });
    onUpdateOrders(updated);
    if (selectedOrderDetails?.id === orderId) {
      setSelectedOrderDetails({ ...selectedOrderDetails, status });
    }
    
    // Add custom real-time event log
    const eventName = `Order ${orderId} marked as ${status.toUpperCase()} successfully.`;
    setNotifications((prev) => [eventName, ...prev.slice(0, 5)]);
  };

  // Menu Modifiers
  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuFormName || !menuFormDesc) return;

    if (editingMenuItem) {
      // Modify
      const updated = menuItems.map((item) => {
        if (item.id === editingMenuItem.id) {
          return {
            ...item,
            name: menuFormName,
            price: Number(menuFormPrice),
            description: menuFormDesc,
            category: menuFormCategory,
            image: menuFormImage || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
            stock: Number(menuFormStock),
            isBestSeller: menuFormBestSeller
          };
        }
        return item;
      });
      onUpdateMenu(updated);
    } else {
      // Create new
      const newItem: MenuItem = {
        id: 'm_' + Date.now(),
        name: menuFormName,
        price: Number(menuFormPrice),
        description: menuFormDesc,
        category: menuFormCategory,
        image: menuFormImage || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(menuFormStock),
        isAvailable: true,
        isBestSeller: menuFormBestSeller
      };
      onUpdateMenu([...menuItems, newItem]);
    }

    setItemFormOpen(false);
    resetMenuForm();
  };

  const handleEditMenuClick = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormName(item.name);
    setMenuFormPrice(item.price);
    setMenuFormDesc(item.description);
    setMenuFormCategory(item.category);
    setMenuFormImage(item.image);
    setMenuFormStock(item.stock);
    setMenuFormBestSeller(item.isBestSeller);
    setItemFormOpen(true);
  };

  const handleDeleteMenuItem = (id: string) => {
    setDeleteConfirmState({
      isOpen: true,
      title: "Konfirmasi Hapus Menu",
      message: "Apakah Anda yakin ingin menghapus hidangan ini dari katalog Kulle? Perubahan ini akan langsung disimpan dan disinkronkan.",
      onConfirm: () => {
        onUpdateMenu(menuItems.filter(i => i.id !== id));
      }
    });
  };

  const resetMenuForm = () => {
    setEditingMenuItem(null);
    setMenuFormName('');
    setMenuFormPrice(30000);
    setMenuFormDesc('');
    setMenuFormCategory('black coffee');
    setMenuFormImage('');
    setMenuFormStock(100);
    setMenuFormBestSeller(false);
  };

  const handleImageUploadChange = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar tidak boleh melebihi 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setMenuFormImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUploadChange(e.dataTransfer.files[0]);
    }
  };

  // Inventory Save
  const handleSaveInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName) return;
    
    if (editingInventoryItem) {
      const updated = inventory.map(item => 
        item.id === editingInventoryItem.id 
          ? {
              ...item,
              name: invName,
              stock: Number(invStock),
              unit: invUnit,
              minStock: Number(invMin),
              category: invCategory,
              supplier: invSupplier || 'General Distributor'
            }
          : item
      );
      onUpdateInventory(updated);
      setEditingInventoryItem(null);
    } else {
      const newItem: InventoryItem = {
        id: 'i_' + Date.now(),
        name: invName,
        stock: Number(invStock),
        unit: invUnit,
        minStock: Number(invMin),
        category: invCategory,
        supplier: invSupplier || 'General Distributor'
      };
      onUpdateInventory([...inventory, newItem]);
    }
    
    setInvFormOpen(false);
    setInvName('');
    setInvStock(10);
    setInvUnit('kg');
    setInvMin(5);
    setInvCategory('Supplier Core');
    setInvSupplier('');
  };

  // Employee Save
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail) return;
    const newItem: Employee = {
      id: 'e_' + Date.now(),
      name: empName,
      role: empRole as any,
      email: empEmail,
      shift: empShift as any,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    onUpdateEmployees([...employees, newItem]);
    setEmpFormOpen(false);
    setEmpName('');
    setEmpEmail('');
  };

  // Promotion Save
  const handleSavePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || !promoDesc) return;
    const newItem: Promotion = {
      id: 'p_' + Date.now(),
      code: promoCode.toUpperCase().replace(/\s+/g, ''),
      description: promoDesc,
      discountPercent: Number(promoDisc),
      isActive: true,
      type: promoType,
      bannerImage: 'https://images.unsplash.com/photo-1510972527409-cef1903972fa?auto=format&fit=crop&w=600&q=80',
      validUntil: '2026-12-31'
    };
    onUpdatePromotions([...promotions, newItem]);
    setPromoFormOpen(false);
    setPromoCode('');
    setPromoDesc('');
  };

  const togglePromotionActive = (id: string) => {
    const updated = promotions.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p);
    onUpdatePromotions(updated);
  };

  // Cafe settings updates
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      brandName: settingsBrand,
      tagline: settingsTagline,
      openingHours: settingsHours,
      address: settingsAddr,
      contactPhone: settingsPhone,
      contactEmail: settingsEmail,
      whatsappNumber: settingsWA,
      faviconUrl: settingsFavicon,
      heroImageUrl1: settingsHero1,
      heroImageUrl2: settingsHero2,
      heroImageUrl3: settingsHero3,
      heroImageUrl4: settingsHero4,
      disableOrderButtons: settingsDisableOrderButtons,
      themeColor: '#0F52BA'
    });
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  const handleSaveAboutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      aboutPill,
      aboutTitle,
      aboutDescription,
      aboutFeature1Title,
      aboutFeature1Desc,
      aboutFeature2Title,
      aboutFeature2Desc
    });
    setAboutSavedSuccess(true);
    setTimeout(() => setAboutSavedSuccess(false), 3000);
  };

  // --- GALLERY MODIFICATION LOGIC ---
  const handleOpenAddGallery = () => {
    setEditingGalleryItem(null);
    setGalleryFormTitle('');
    setGalleryFormCategory('interior');
    setGalleryFormImage('');
    setGalleryFormOpen(true);
  };

  const handleOpenEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryFormTitle(item.title);
    setGalleryFormCategory(item.category);
    setGalleryFormImage(item.url);
    setGalleryFormOpen(true);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormImage) {
      alert("Silakan unggah atau isi URL foto terlebih dahulu.");
      return;
    }

    if (editingGalleryItem) {
      // Edit
      const updatedList = galleryPhotos.map((photo) => 
        photo.id === editingGalleryItem.id 
          ? { ...photo, title: galleryFormTitle, category: galleryFormCategory, url: galleryFormImage } 
          : photo
      );
      onUpdateGallery(updatedList);
    } else {
      // Create
      const newItem: GalleryItem = {
        id: 'g_' + Date.now(),
        title: galleryFormTitle || 'Foto Baru Kulle Cafe',
        category: galleryFormCategory,
        url: galleryFormImage
      };
      onUpdateGallery([...galleryPhotos, newItem]);
    }
    setGalleryFormOpen(false);
  };

  const handleDeleteGallery = (id: string) => {
    setDeleteConfirmState({
      isOpen: true,
      title: "Konfirmasi Hapus Galeri",
      message: "Apakah Anda yakin ingin menghapus foto galeri ini? Foto ini akan langsung dihapus dari media promosi Kulle.",
      onConfirm: () => {
        const updatedList = galleryPhotos.filter(photo => photo.id !== id);
        onUpdateGallery(updatedList);
      }
    });
  };

  const handleGalleryImageUploadChange = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar tidak boleh melebihi 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setGalleryFormImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- REVIEWS MODIFICATION LOGIC ---
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setReviewFormName('');
    setReviewFormComment('');
    setReviewFormRating(5);
    setReviewFormDate(new Date().toISOString().split('T')[0]);
    setReviewFormAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
    setReviewFormOpen(true);
  };

  const handleOpenEditReview = (item: Review) => {
    setEditingReview(item);
    setReviewFormName(item.name);
    setReviewFormComment(item.comment);
    setReviewFormRating(item.rating);
    setReviewFormDate(item.date);
    setReviewFormAvatar(item.avatar);
    setReviewFormOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormName || !reviewFormComment) {
      alert("Silakan isi nama dan komentar ulasan terlebih dahulu.");
      return;
    }

    if (editingReview) {
      // Edit
      const updatedList = reviews.map((r) => 
        r.id === editingReview.id 
          ? { ...r, name: reviewFormName, comment: reviewFormComment, rating: Number(reviewFormRating), date: reviewFormDate, avatar: reviewFormAvatar } 
          : r
      );
      onUpdateReviews(updatedList);
    } else {
      // Create
      const newItem: Review = {
        id: 'rev_' + Date.now(),
        name: reviewFormName,
        comment: reviewFormComment,
        rating: Number(reviewFormRating),
        date: reviewFormDate || new Date().toISOString().split('T')[0],
        avatar: reviewFormAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      onUpdateReviews([newItem, ...reviews]);
    }
    setReviewFormOpen(false);
  };

  const handleDeleteReview = (id: string) => {
    setDeleteConfirmState({
      isOpen: true,
      title: "Konfirmasi Hapus Ulasan",
      message: "Apakah Anda yakin ingin menghapus ulasan pelanggan ini? Data ini akan langsung disinkronkan.",
      onConfirm: () => {
        const updatedList = reviews.filter(r => r.id !== id);
        onUpdateReviews(updatedList);
      }
    });
  };

  const handleReviewAvatarUploadChange = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar avatar tidak boleh melebihi 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setReviewFormAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddCustomer = () => {
    setEditingCustomer(null);
    setCustFormName('');
    setCustFormEmail('');
    setCustFormPhone('');
    setCustFormTotalOrders(0);
    setCustFormTotalSpent(0);
    setCustFormAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
    setCustFormOpen(true);
  };

  const handleOpenEditCustomer = (item: Customer) => {
    setEditingCustomer(item);
    setCustFormName(item.name);
    setCustFormEmail(item.email);
    setCustFormPhone(item.phone);
    setCustFormTotalOrders(item.totalOrders);
    setCustFormTotalSpent(item.totalSpent);
    setCustFormAvatar(item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
    setCustFormOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custFormName || !custFormEmail) {
      alert("Silakan isi nama dan email pelanggan terlebih dahulu.");
      return;
    }

    if (editingCustomer) {
      // Edit
      const updatedList = customers.map((c) => 
        c.id === editingCustomer.id 
          ? { 
              ...c, 
              name: custFormName, 
              email: custFormEmail, 
              phone: custFormPhone, 
              totalOrders: Number(custFormTotalOrders), 
              totalSpent: Number(custFormTotalSpent), 
              avatar: custFormAvatar 
            } 
          : c
      );
      if (onUpdateCustomers) {
        onUpdateCustomers(updatedList);
      }
    } else {
      // Create
      const newItem: Customer = {
        id: 'cust_' + Date.now(),
        name: custFormName,
        email: custFormEmail,
        phone: custFormPhone,
        totalOrders: Number(custFormTotalOrders) || 0,
        totalSpent: Number(custFormTotalSpent) || 0,
        avatar: custFormAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        lastOrder: new Date().toLocaleDateString('id-ID')
      };
      if (onUpdateCustomers) {
        onUpdateCustomers([newItem, ...customers]);
      }
    }
    setCustFormOpen(false);
  };

  const handleCustAvatarUploadChange = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar avatar tidak boleh melebihi 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCustFormAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };


  const handleHeroUploadChange = (file: File, slideIdx: number) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("Ukuran gambar hero tidak boleh melebihi 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (slideIdx === 1) setSettingsHero1(reader.result);
        if (slideIdx === 2) setSettingsHero2(reader.result);
        if (slideIdx === 3) setSettingsHero3(reader.result);
        if (slideIdx === 4) setSettingsHero4(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- METRIC STATISTICS CALCULATORS ---
  const totalCompletedOrders = orders.filter(o => o.status === 'completed');
  const totalSalesVal = totalCompletedOrders.reduce((acc, current) => acc + current.total, 0);
  const totalRegisteredCustomers = customers.length;
  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-cyan-400';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-400';
    }
  };

  // Active user filtering stats
  const filteredOrdersList = orders.filter((ord) => 
    ord.customerName.toLowerCase().includes(dashSearchInput.toLowerCase()) || 
    ord.id.toLowerCase().includes(dashSearchInput.toLowerCase())
  );

  const filteredMenuList = menuItems.filter((i) => 
    i.name.toLowerCase().includes(dashSearchInput.toLowerCase()) || 
    i.category.toLowerCase().includes(dashSearchInput.toLowerCase())
  );

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;

  // Render Secure Auth Form if not authorized
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${isDarkMode ? 'bg-[#030915]' : 'bg-slate-50'}`}>
        <div className="absolute top-4 left-4 z-40">
          <button 
            onClick={() => setView('customer')}
            className="px-4 py-2 bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white rounded-xl text-xs font-bold"
          >
            ← Back to Customer Website
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-md ${isDarkMode ? 'bg-[#091122] border-[#0F52BA]/20' : 'bg-white border-slate-200'}`}
        >
          {forgotPasswordOpen ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-3xl">☕</span>
                <h3 className="text-xl font-extrabold text-white">Reset Admin Password</h3>
                <p className="text-xs text-slate-400">Provide authorization username linked to Kulle administration logs.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Admin Username</label>
                <input
                  required
                  type="text"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin"
                  className={`w-full p-3 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white font-bold text-sm"
              >
                REQUEST SECURITY KEY
              </button>

              {forgotSuccess && (
                <p className="text-xs text-emerald-500 font-bold text-center">
                  ✓ Reset key transmitted. Check admin console files/logs.
                </p>
              )}

              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200"
              >
                Return to Access Gateway
              </button>
            </form>
          ) : isRegisterMode ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-[#0F52BA]/15 rounded-xl flex items-center justify-center text-[#0F52BA] text-xl font-bold">
                  📝
                </div>
                <h2 style={{ color: isDarkMode ? '#ffffff' : '#0f52ba' }} className="text-2xl font-black tracking-tight mt-2">Daftar Akun Baru</h2>
                <p className="text-xs text-slate-400">Silakan lengkapi formulir pendaftaran di bawah</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Nama Lengkap</label>
                  <input
                    required
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Contoh: Alim Bahri"
                    className={`w-full p-3 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Email Address</label>
                  <input
                    required
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Contoh: alimbahri@gmail.com"
                    className={`w-full p-3 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Password</label>
                  <input
                    required
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className={`w-full p-3 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              {regError && <p className="text-xs text-red-500 font-bold">{regError}</p>}
              {regSuccess && <p className="text-xs text-emerald-500 font-bold">{regSuccess}</p>}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:translate-y-[-1px] transition-all shadow"
              >
                DAFTAR AKUN BARU
              </button>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <button type="button" onClick={() => setIsRegisterMode(false)} className="hover:text-[#0F52BA] dark:hover:text-cyan-400 underline font-semibold">
                  Sudah punya akun? Masuk
                </button>
                <button type="button" onClick={() => setView('customer')} className="underline">
                  Back to Site
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-[#0F52BA]/15 rounded-xl flex items-center justify-center text-[#0F52BA] text-xl font-bold">
                  ☕
                </div>
                <h2 style={{ color: isDarkMode ? '#ffffff' : '#000000' }} className="text-2xl font-black tracking-tight mt-2">Kulle Kopi Admin</h2>
                <p className="text-xs text-slate-400">Secure Access Gateway • Authorized Personnel Only</p>
              </div>

              {signupSuccessMsg && (
                <div className="p-3.5 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl font-bold leading-relaxed text-center">
                  {signupSuccessMsg}
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Username / Email</label>
                  <input
                    required
                    type="text"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="@gmail.com"
                    className={`w-full p-3 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Authorization Password</label>
                  <input
                    required
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="password"
                    className={`w-full p-3 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              {authError && <p className="text-xs text-red-500 font-bold">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:translate-y-[-1px] transition-all shadow"
              >
                AUTHORIZE SECURE ENTRY
              </button>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <button type="button" onClick={() => setForgotPasswordOpen(true)} className="hover:text-amber-500">
                  Forgot Password?
                </button>
                <button type="button" onClick={() => { setIsRegisterMode(true); setSignupSuccessMsg(''); setAuthError(''); }} className="hover:text-[#0F52BA] dark:hover:text-cyan-400 underline font-semibold">
                  Register Akun
                </button>
              </div>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setView('customer')} className="text-xs text-slate-400 underline hover:text-slate-200">
                  Back to Site
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  // Authorized Admin Pane Render
  const getTabTitle = (tabId: string) => {
    switch (tabId) {
      case 'dashboard': return 'Dasbor Utama';
      case 'menu': return 'Katalog Menu';
      case 'orders': return 'Kelola Pesanan';
      case 'customers': return 'Data Pelanggan';
      case 'analytics': return 'Analitik Penjualan';
      case 'inventory': return 'Stok Bahan Baku';
      case 'promotions': return 'Kode Promo & Diskon';
      case 'gallery': return 'Galeri Foto Cafe';
      case 'about_kulle': return 'Tentang Kulle';
      case 'reviews': return 'Ulasan & Review';
      case 'settings': return 'Pengaturan Utama';
      default: return tabId.toUpperCase();
    }
  };

  return (
    <div id="admin-workspace" className={`min-h-screen font-sans flex transition-colors duration-500 ${isDarkMode ? 'bg-[#060D1E] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* SIDEBAR AREA (COLLAPSIBLE, BLUE GLOW DESIGN) */}
      <aside 
        id="sidebar" 
        className={`bg-[#0A1F44] text-white transition-all duration-300 relative border-r border-[#0F52BA]/25 flex flex-col justify-between ${sidebarCollapsible ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* Logo brand title panel */}
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            {!sidebarCollapsible && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center bg-transparent">
                  <img 
                    src={logoImg} 
                    alt="Kulle Logo" 
                    className="w-full h-full object-contain transition-all"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <span style={{ color: '#ffffff' }} className="text-sm font-black tracking-wider uppercase">Kulle Admin</span>
                  <span className="text-[8px] text-slate-400 tracking-widest uppercase font-mono">Operations Portal</span>
                </div>
              </div>
            )}
            <button 
              id="collapse-sidebar"
              onClick={() => setSidebarCollapsible(!sidebarCollapsible)}
              className="text-slate-400 hover:text-white"
            >
              {sidebarCollapsible ? '→' : '←'}
            </button>
          </div>

          {/* Sidebar Menu Item list */}
          <nav className="p-4 space-y-1.5 flex-1 select-none">
            {[
              { id: 'dashboard', label: 'Dasbor Utama', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
              { id: 'menu', label: 'Katalog Menu', icon: <UtensilsCrossed className="w-4.5 h-4.5" /> },
              { id: 'orders', label: 'Kelola Pesanan', icon: <ShoppingBag className="w-4.5 h-4.5" /> },
              { id: 'customers', label: 'Data Pelanggan', icon: <Users className="w-4.5 h-4.5" /> },
              { id: 'analytics', label: 'Analitik Penjualan', icon: <BarChart3 className="w-4.5 h-4.5" /> },
              { id: 'inventory', label: 'Stok Bahan Baku', icon: <PackageOpen className="w-4.5 h-4.5" /> },
              { id: 'gallery', label: 'Edit Galeri', icon: <Image className="w-4.5 h-4.5" /> },
              { id: 'about_kulle', label: 'Tentang Kulle', icon: <Info className="w-4.5 h-4.5" /> },
              { id: 'reviews', label: 'Kelola Ulasan', icon: <MessageSquare className="w-4.5 h-4.5" /> },
              { id: 'settings', label: 'Pengaturan Utama', icon: <Settings className="w-4.5 h-4.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`sidebar-tab-${tab.id}`}
                onClick={() => { setActiveSidebarTab(tab.id); setDashSearchInput(''); }}
                className={`w-full flex items-center p-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeSidebarTab === tab.id ? 'bg-[#0F52BA] text-white shadow-lg shadow-blue-500/15 border-l-4 border-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'}`}
              >
                <div className="shrink-0">{tab.icon}</div>
                {!sidebarCollapsible && <span className="ml-3 truncate">{tab.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer area */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {!sidebarCollapsible && (
            <div className="flex items-center gap-2 px-2 py-1 bg-[#06142a] rounded-lg border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow shadow-emerald-500/50" />
              <div className="text-[10px]">
                <p className="font-bold text-slate-300">Tampilan {authRole === 'Admin' ? 'Admin' : authRole === 'Barista' ? 'Barista' : 'Koki'}</p>
                <p className="text-slate-400 font-mono text-[9px] truncate">{authEmail}</p>
              </div>
            </div>
          )}

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }}
            className="w-full flex items-center p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-xs font-bold"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!sidebarCollapsible && <span className="ml-3">Keluar Akun</span>}
          </button>
        </div>
      </aside>

      {/* WORKSPACE MAIN BODY */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* TOPBAR PANEL AREA */}
        <header className={`h-20 border-b flex items-center justify-between px-8 ${isDarkMode ? 'bg-[#081226]/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-black uppercase tracking-wider text-slate-400">
              {getTabTitle(activeSidebarTab)}
            </h1>
            
            <div className="hidden sm:flex items-center text-xs text-slate-400 font-mono gap-1">
              <span>Waktu: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            
            {/* In-app visual theme toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg border text-xs ${isDarkMode ? 'border-slate-800 bg-slate-900 text-yellow-400' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl p-4 z-40 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Umpan Operasional</span>
                      <button onClick={() => setNotifications([])} className="text-[10px] text-red-500 underline">Hapus Semua</button>
                    </div>

                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4 text-center">Tidak ada notifikasi baru.</p>
                      ) : (
                        notifications.map((n, idx) => (
                           <div key={idx} className="p-2 border-b border-slate-800/10 last:border-0 text-xs text-slate-300">
                             <p>{n}</p>
                           </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setView('customer')}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0F52BA]/15 text-[#0F52BA] hover:bg-[#0F52BA]/20 transition-all border border-[#0F52BA]/15 flex items-center gap-1"
              >
                <span>Lihat Halaman Utama 🌐</span>
              </button>
            </div>

          </div>
        </header>

        {/* WORKSPACE WORK AREA SCROLLBAR */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* ==============================================
              VIEW 1: DASHBOARD OVERVIEW
              ============================================== */}
          {activeSidebarTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Highlight alerts */}
              {lowStockCount > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <ShieldAlert className="w-5 h-5 animate-bounce" /> Peringatan Stok: {lowStockCount} bahan baku hampir habis!
                  </span>
                  <button 
                    onClick={() => setActiveSidebarTab('inventory')}
                    className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded uppercase animate-pulse"
                  >
                    Perbarui Stok
                  </button>
                </div>
              )}

              {/* Stats blocks metrics grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Pendapatan Terjual (Selesai)', val: `Rp ${totalSalesVal.toLocaleString('id-ID')}`, icon: <DollarSign className="w-5 h-5 text-[#0F52BA] dark:text-cyan-400" />, detail: 'Dihitung otomatis dari pesanan selesai' },
                  { label: 'Pesanan Aktif Dalam Antrean', val: activeOrdersCount, icon: <RefreshCcw className="w-5 h-5 text-[#0F52BA] dark:text-cyan-400" />, detail: 'Jumlah pesanan tertunda/diproses' },
                  { label: 'Pelanggan Terdaftar', val: totalRegisteredCustomers, icon: <Users className="w-5 h-5 text-[#0F52BA] dark:text-cyan-400" />, detail: 'Akun pelanggan yang terdaftar' },
                  { label: 'Menu Hidangan Aktif', val: menuItems.length, icon: <UtensilsCrossed className="w-5 h-5 text-[#0F52BA] dark:text-cyan-400" />, detail: 'Makanan & minuman tayang di beranda' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-6 rounded-none border-l-4 border-l-[#0F52BA] border-t border-r border-b transition-all duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#0A1F44] border-white/10 shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-sans">{stat.label}</span>
                      <div className="p-2 bg-[#0F52BA]/10 text-[#0F52BA] dark:text-cyan-300">{stat.icon}</div>
                    </div>
                    <p className="text-2xl font-extrabold font-mono mt-4 tracking-tight">{stat.val}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase">{stat.detail}</p>
                  </div>
                ))}
              </div>

              {/* Analytical custom beautiful SVG path chart & table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SVG Line chart (Sales trend) */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-extrabold text-base tracking-tight text-white">Tren Pendapatan Harian Kulle</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Simulator metrik penjualan operasional dalam 7 jam aktif terakhir</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 rounded-lg">KALKULASI LANGSUNG (LIVE)</span>
                  </div>

                  {/* CUSTOM SUPER HIGH-END GRAPHICAL SVG CHART */}
                  <div className="h-64 relative w-full flex items-end">
                    
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] dark:opacity-[0.1]">
                      <div className="border-t border-white w-full" />
                      <div className="border-t border-white w-full" />
                      <div className="border-t border-white w-full" />
                      <div className="border-t border-white w-full" />
                    </div>

                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      {/* Gradient Definitions */}
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0F52BA" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#0F52BA" stopOpacity="0"/>
                        </linearGradient>
                      </defs>

                      {/* Smooth Area Under Line */}
                      <path 
                        d="M 0,200 L 0,150 Q 80,105 160,140 T 320,80 T 500,60 L 500,200 Z" 
                        fill="url(#chartGrad)"
                      />

                      {/* Line Path */}
                      <path 
                        d="M 0,150 Q 80,105 160,140 T 320,80 T 500,60" 
                        fill="none" 
                        stroke="#0F52BA" 
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Glowing points */}
                      <circle cx="160" cy="140" r="5" fill="#22d3ee" className="animate-pulse" />
                      <circle cx="320" cy="80" r="5" fill="#22d3ee" className="animate-pulse" />
                      <circle cx="500" cy="60" r="5" fill="#22d3ee" className="animate-pulse" />
                    </svg>

                    {/* Chart Overlay Tooltip Popovers */}
                    <div className="absolute top-[35%] left-[30%] text-center">
                      <span className="px-2 py-1 rounded bg-[#060D1E] text-[10px] font-bold text-[#0F52BA] dark:text-cyan-400 border border-[#0F52BA]/30 font-mono">Rp 480rb</span>
                    </div>
                    <div className="absolute top-[20%] left-[62%] text-center">
                      <span className="px-2 py-1 rounded bg-[#060D1E] text-[10px] font-bold text-[#0F52BA] dark:text-cyan-400 border border-[#0F52BA]/30 font-mono">Rp 840rb</span>
                    </div>
                  </div>

                  {/* X-Axis hours notation */}
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-4 border-t border-slate-800/20 pt-2 uppercase">
                    <span>07:00 Pagi</span>
                    <span>10:00 (Puncak Kopi Hitam)</span>
                    <span>13:00 (Makan Siang)</span>
                    <span>16:00 (Camilan Sore)</span>
                    <span>20:00 (Puncak Musik Jazz)</span>
                  </div>
                </div>

                {/* Operations side activity feed */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight mb-4 text-white">Catatan Aktivitas Operasional</h3>
                    <div className="space-y-4">
                      {orders.map((ord, idx) => (
                        <div key={ord.id} className="flex gap-3 text-xs border-b border-slate-800/10 pb-3 last:border-0 last:pb-0">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${ord.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <div className="text-slate-700 dark:text-slate-300">
                            <p className="font-bold">{ord.customerName} memesan {ord.items.length} hidangan</p>
                            <p className="text-slate-400 text-[10px] font-mono mt-0.5">{ord.tableNumber} • Rp {ord.total.toLocaleString('id')} • {ord.paymentMethod.toUpperCase()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSidebarTab('orders')}
                    className="w-full mt-6 py-2.5 border border-slate-350 dark:border-slate-800 hover:border-[#0F52BA]/65 rounded-xl text-center font-bold text-xs"
                  >
                    BUKA PANEL ANTRIAN PESANAN
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==============================================
              VIEW 2: MENU CATALOG (ADD/EDIT/DELETE DISHES)
              ============================================== */}
          {activeSidebarTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Daftar Menu Kopi & Makanan Kulle</h3>
                  <p className="text-xs text-slate-400">Daftar lengkap katalog kuliner yang diterbitkan ke halaman utama secara real-time.</p>
                </div>
                
                <button
                  id="add-new-menu-btn"
                  onClick={() => { resetMenuForm(); setItemFormOpen(true); }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Plus className="w-4.5 h-4.5" /> TAMBAH MENU KATALOG BARU
                </button>
              </div>

              {/* Grid lists of catalog items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuList.map((item) => (
                  <div 
                    key={item.id} 
                    id={`admin-menu-${item.id}`}
                    className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-white border-slate-100'}`}
                  >
                    <div className="h-36 relative bg-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] font-mono uppercase bg-slate-900 text-cyan-400 rounded-md font-extrabold">
                        {item.category}
                      </span>
                      {item.isBestSeller && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[8px] font-bold bg-amber-500 text-white rounded font-mono">
                          TERLARIS
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-extrabold text-sm tracking-tight">{item.name}</h4>
                        <p className="text-slate-490 text-xs mt-1 font-mono">Stok: {item.stock} porsi tersedia</p>
                      </div>

                      <div className="flex items-center justify-between font-mono font-bold text-xs pt-2 border-t border-slate-800/10">
                        <span>Rp {item.price.toLocaleString('id')}</span>
                        <div className="flex space-x-1">
                          <button
                            id={`edit-menu-${item.id}`}
                            onClick={() => handleEditMenuClick(item)}
                            className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-mono rounded"
                          >
                            Ubah
                          </button>
                          <button
                            id={`delete-menu-${item.id}`}
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-1 px-2.5 bg-red-900/40 hover:bg-red-800 text-red-200 text-[10px] font-mono rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==============================================
              VIEW 3: ORDERS ENGINE
              ============================================== */}
          {activeSidebarTab === 'orders' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-white">Kelola & Proses Pesanan Pelanggan</h3>
                <p className="text-xs text-slate-400">Tandai pesanan sebagai sedang diproses, selesai, atau cetak struk pembayaran asli untuk kasir.</p>
              </div>

              {/* Table ledger */}
              <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-white border-slate-200'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`${isDarkMode ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-50 text-slate-650'} font-bold border-b border-inherit uppercase font-mono`}>
                        <th className="p-4.5">ID Pesanan</th>
                        <th className="p-4.5">Nama Pelanggan</th>
                        <th className="p-4.5">Menu yang Dipesan</th>
                        <th className="p-4.5">Info Meja & Bayar</th>
                        <th className="p-4.5">Total Tagihan</th>
                        <th className="p-4.5">Status</th>
                        <th className="p-4.5 text-right font-sans">Aksi Operasional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/10 dark:divide-slate-800/50">
                      {filteredOrdersList.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/20">
                          <td className="p-4.5 font-bold font-mono text-[#0F52BA] dark:text-cyan-400">{ord.id}</td>
                          <td className="p-4.5">
                            <p className="font-bold">{ord.customerName}</p>
                            <p className="text-slate-400 text-[10px] font-mono">{ord.customerPhone}</p>
                          </td>
                          <td className="p-4.5">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                              {ord.items.map(i => `${i.menuItem.name} (x${i.quantity})`).join(', ')}
                            </span>
                          </td>
                          <td className="p-4.5 font-mono text-[11px] uppercase">
                            <span>{ord.tableNumber}</span> • <span className="underline">{ord.paymentMethod}</span>
                          </td>
                          <td className="p-4.5 font-bold font-mono text-slate-900 dark:text-slate-100">
                            Rp {ord.total.toLocaleString('id')}
                          </td>
                          <td className="p-4.5">
                            <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border ${getStatusColor(ord.status)}`}>
                              {ord.status === 'pending' ? 'MENUNGGU' : ord.status === 'processing' ? 'DIPROSES' : ord.status === 'completed' ? 'SELESAI' : 'BATAL'}
                            </span>
                          </td>
                          <td className="p-4.5 text-right space-x-1 shrink-0">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-semibold"
                            >
                              Detail
                            </button>
                            {ord.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(ord.id, 'processing')}
                                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold"
                              >
                                Terima Pesanan
                              </button>
                            )}
                            {ord.status === 'processing' && (
                              <button
                                onClick={() => handleStatusUpdate(ord.id, 'completed')}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                              >
                                Siap Sajikan
                              </button>
                            )}
                            <button
                              onClick={() => setShowPrintInvoice(ord)}
                              className="p-1.5 bg-slate-900 hover:bg-slate-850 text-amber-400 rounded text-[11px] font-semibold"
                              title="Cetak Struk"
                            >
                              Cetak Struk 🖨️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==============================================
              VIEW 4: CUSTOMERS BASE
              ============================================== */}
          {activeSidebarTab === 'customers' && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Daftar Pelanggan Terdaftar Kulle</h3>
                  <p className="text-xs text-slate-400">Daftar riwayat checkout akun premium beserta total pengeluaran transaksi kuliner.</p>
                </div>
                <button
                  onClick={handleOpenAddCustomer}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer self-start md:self-auto transition-all"
                >
                  <Plus className="w-4 h-4" /> TAMBAH PELANGGAN
                </button>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {customers.map((c) => (
                  <div key={c.id} className={`p-6 rounded-2xl border flex flex-col items-center text-center space-y-4 ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/10' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <img 
                      src={c.avatar} 
                      alt={c.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#0F52BA]"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm tracking-tight">{c.name}</h4>
                      <p className="text-slate-400 text-xs mt-0.5">{c.email}</p>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 text-xs border-t border-slate-800/10 pt-4">
                      <div>
                        <p className="text-slate-400 text-[9px] uppercase font-mono">Pesanan Dibuat</p>
                        <p className="font-bold text-slate-700 dark:text-wrap font-mono mt-1">{c.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] uppercase font-mono">Total Transaksi</p>
                        <p className="font-bold text-emerald-500 font-mono mt-1">Rp {c.totalSpent.toLocaleString('id')}</p>
                      </div>
                    </div>

                    <div className="w-full pt-3 mt-2 border-t border-slate-800/10 dark:border-slate-800/40 flex gap-2">
                      <button
                        onClick={() => handleOpenEditCustomer(c)}
                        className="flex-1 py-1.5 text-[10px] font-bold text-[#0F52BA] hover:text-white bg-[#0F52BA]/10 hover:bg-[#0F52BA] rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Edit Pelanggan"
                      >
                        <Edit className="w-3 h-3" /> EDIT
                      </button>
                      <button
                        onClick={() => {
                          if (onUpdateCustomers) {
                            setDeleteConfirmState({
                              isOpen: true,
                              title: "Konfirmasi Hapus Pelanggan",
                              message: `Apakah Anda yakin ingin menghapus pelanggan "${c.name}"? Data riwayat ini akan dihapus dari portal operasional Kulle.`,
                              onConfirm: () => {
                                onUpdateCustomers(customers.filter((cust) => cust.id !== c.id));
                              }
                            });
                          }
                        }}
                        className="flex-1 py-1.5 text-[10px] font-bold text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Hapus Pelanggan"
                      >
                        <Trash2 className="w-3 h-3" /> HAPUS
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==============================================
              VIEW 5: GOURMET ANALYTICS
              ============================================== */}
          {activeSidebarTab === 'analytics' && (
            <div className="space-y-8">
              
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-white">Tren Analitik Penjualan Kulle</h3>
                <p className="text-xs text-slate-400">Representasi visual kinerja menu kuliner, produk terlaris, dan jam layanan puncak.</p>
              </div>

              {/* Main statistical visual */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Visual block 1: Top beverage share */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h4 className="font-bold text-sm mb-4">Pangsa Volume Minuman</h4>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Es Kopi Karen', orders: '512 pesanan', percent: '42%' },
                      { name: 'Kopi Susu Kulle', orders: '205 pesanan', percent: '28%' },
                      { name: 'Matcha Kyoto', orders: '158 pesanan', percent: '18%' },
                      { name: 'Espresso', orders: '124 pesanan', percent: '12%' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                          <span className="font-mono text-slate-400">({item.percent})</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="bg-[#0F52BA] h-full" style={{ width: item.percent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual block 2: Wok plates chef dishes share */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h4 className="font-bold text-sm mb-4">Pangsa Makanan Utama</h4>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Nasi Goreng Kulle', orders: '380 pesanan', percent: '45%' },
                      { name: 'Artisan Avocado Sandwich', orders: '220 pesanan', percent: '25%' },
                      { name: 'Sop Ubi Premium', orders: '194 pesanan', percent: '20%' },
                      { name: 'The Kulle Wagyu Burger', orders: '142 pesanan', percent: '10%' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                          <span className="font-mono text-slate-400">({item.percent})</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-400 to-[#0F52BA] h-full" style={{ width: item.percent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual block 3: Peak Operations hours */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-[#0F52BA]/15' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h4 className="font-bold text-sm mb-4">Kepadatan Jam Operasional Utama</h4>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {[
                      { label: 'Seduhan Pagi', desc: '07:00 - 11:00 pagi', density: 'Ramai ☕' },
                      { label: 'Makan Siang', desc: '11:00 - 14:00 siang', density: 'Sangat Padat 🍔' },
                      { label: 'Kopi & Camilan', desc: '14:00 - 17:00 sore', density: 'Sedang 📶' },
                      { label: 'Musik Malam', desc: '19:00 - 23:00 malam', density: 'Santai 🎵' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-2 bg-slate-850 rounded-xl flex flex-col justify-between">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-1">{item.desc}</p>
                        <p className="text-[9px] text-[#0F52BA] dark:text-cyan-400 font-black mt-2">{item.density}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==============================================
              VIEW 6: RAW INVENTORY
              ============================================== */}
          {activeSidebarTab === 'inventory' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Stok Persediaan Bahan Baku Kulle</h3>
                  <p className="text-xs text-slate-400">Daftar bahan baku, jumlah persediaan, dan batas minimum stok.</p>
                </div>

                <button 
                  id="add-inventory-btn"
                  onClick={() => setInvFormOpen(true)}
                  className="px-4 py-2 bg-[#0F52BA] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> TAMBAH BAHAN BAKU
                </button>
              </div>

              {/* Table list */}
              <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#0a142c] border-slate-800' : 'bg-white border-slate-200'}`}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`${isDarkMode ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-50 text-slate-650'} font-bold border-b border-inherit font-mono`}>
                      <th className="p-4">ID Bahan</th>
                      <th className="p-4">Nama Bahan Baku</th>
                      <th className="p-4">Jumlah Persediaan</th>
                      <th className="p-4">Jumlah Minimum</th>
                      <th className="p-4">Kategori Klasifikasi</th>
                      <th className="p-4">Pemasok Utama</th>
                      <th className="p-4 text-right font-sans">Aksi Manajemen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-805/10 dark:divide-slate-800/60">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-905">
                        <td className="p-4 font-mono font-bold text-cyan-400">{item.id}</td>
                        <td className="p-4 font-bold">{item.name}</td>
                        <td className="p-4 font-mono font-bold">
                          <span className={item.stock <= item.minStock ? 'text-amber-500 font-black' : (isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                            {item.stock} {item.unit}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-400">{item.minStock} {item.unit}</td>
                        <td className="p-4 uppercase tracking-wider text-[10px] font-mono">{item.category}</td>
                        <td className="p-4 font-mono text-slate-400">{item.supplier}</td>
                        <td className="p-4 text-right space-x-1 sm:space-x-2">
                          <button
                            onClick={() => {
                              const updated = inventory.map(i => i.id === item.id ? { ...i, stock: Number(i.stock) + 10 } : i);
                              onUpdateInventory(updated);
                            }}
                            className="p-1 px-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-[10px] rounded font-bold uppercase font-mono transition-all"
                            title="Tambah 10 stok otomatis"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => {
                              setEditingInventoryItem(item);
                              setInvName(item.name);
                              setInvStock(item.stock);
                              setInvUnit(item.unit);
                              setInvMin(item.minStock);
                              setInvCategory(item.category);
                              setInvSupplier(item.supplier || '');
                              setInvFormOpen(true);
                            }}
                            className="p-1 px-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-cyan-400 text-[10px] rounded font-bold uppercase font-mono transition-all"
                            title="Edit bahan baku"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmState({
                                isOpen: true,
                                title: "Konfirmasi Hapus Bahan Baku",
                                message: `Apakah Anda yakin ingin menghapus bahan baku "${item.name}"? Data ini akan langsung disinkronkan.`,
                                onConfirm: () => {
                                  const updated = inventory.filter(i => i.id !== item.id);
                                  onUpdateInventory(updated);
                                }
                              });
                            }}
                            className="p-1 px-2 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 text-[10px] rounded font-bold uppercase font-mono transition-all"
                            title="Hapus bahan baku"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}



          {/* ==============================================
              VIEW 8: CAMPAIGN CODES (PROMOTIONS)
              ============================================== */}
          {activeSidebarTab === 'promotions' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Promo & Kupon Diskon Interaktif</h3>
                  <p className="text-xs text-slate-400">Kode diskon, deskripsi promo, dan status kampanye yang diterbitkan di beranda.</p>
                </div>

                <button
                  id="add-campaign-btn"
                  onClick={() => setPromoFormOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Plus className="w-4.5 h-4.5" /> BUAT KODE PROMOSI BARU
                </button>
              </div>

              {/* Listing cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                  <div key={promo.id} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-slate-800' : 'bg-white border-slate-100'} relative overflow-hidden flex flex-col justify-between`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black font-mono tracking-wider text-[#0F52BA] dark:text-cyan-400 uppercase">
                          {promo.code}
                        </span>
                        
                        <button
                          onClick={() => togglePromotionActive(promo.id)}
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${promo.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700/40 text-slate-400 line-through'}`}
                        >
                          {promo.isActive ? '● AKTIF' : '○ DINAKTIFKAN'}
                        </button>
                      </div>

                      <p className="text-xs leading-relaxed">{promo.description}</p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-800/10 dark:border-slate-800/40 flex justify-between items-center text-xs text-slate-400">
                      <span>Diskon Potongan: <span className="font-black text-emerald-500">{promo.discountPercent}% OFF</span></span>
                      <span className="font-mono text-[9px]">Berlaku Hingga: {promo.validUntil}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==============================================
              VIEW 8.5: EDIT TENTANG KULLE
              ============================================== */}
          {activeSidebarTab === 'about_kulle' && (
            <div className="max-w-2xl">
              
              <div className="mb-6">
                <h3 className="text-xl font-extrabold tracking-tight text-white">Edit Tentang Kulle</h3>
                <p className="text-xs text-slate-400">Sesuaikan cerita, judul utama, deskripsi paragraf, dan dua kartu fitur pada bagian Tentang Kulle.</p>
              </div>

              <form onSubmit={handleSaveAboutSettings} className="space-y-6">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Label / Kategori Atas (Pill Label)</label>
                  <input
                    required
                    type="text"
                    value={aboutPill}
                    onChange={(e) => setAboutPill(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Judul Utama (Title)</label>
                  <input
                    required
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                  />
                  <p className="text-[10px] text-slate-450">Tip: Kata "Kulle Kopi" pada judul akan otomatis diberi warna biru/cyan khas brand.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-470">Paragraf Deskripsi Utama</label>
                  <textarea
                    required
                    rows={4}
                    value={aboutDescription}
                    onChange={(e) => setAboutDescription(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                  />
                </div>

                <div className="p-4 rounded-xl border border-dashed border-slate-700/30 dark:border-slate-800 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#0F52BA] dark:text-cyan-400 block mb-2">Kartu Fitur 1 (Kiri)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Judul Fitur 1</label>
                      <input
                        required
                        type="text"
                        value={aboutFeature1Title}
                        onChange={(e) => setAboutFeature1Title(e.target.value)}
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Deskripsi Fitur 1</label>
                      <input
                        required
                        type="text"
                        value={aboutFeature1Desc}
                        onChange={(e) => setAboutFeature1Desc(e.target.value)}
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-slate-700/30 dark:border-slate-800 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#0F52BA] dark:text-cyan-400 block mb-2">Kartu Fitur 2 (Kanan)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Judul Fitur 2</label>
                      <input
                        required
                        type="text"
                        value={aboutFeature2Title}
                        onChange={(e) => setAboutFeature2Title(e.target.value)}
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Deskripsi Fitur 2</label>
                      <input
                        required
                        type="text"
                        value={aboutFeature2Desc}
                        onChange={(e) => setAboutFeature2Desc(e.target.value)}
                        className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0F52BA] to-blue-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow shadow-blue-500/20"
                >
                  SIMPAN PERUBAHAN TENTANG KULLE
                </button>

                {aboutSavedSuccess && (
                  <p className="text-xs text-emerald-500 font-bold">✓ Cerita Tentang Kulle berhasil diperbarui! Perubahan ditampilkan di halaman depan real-time.</p>
                )}
              </form>

            </div>
          )}

          {/* ==============================================
              VIEW 8.8: MANAGE CUSTOMER REVIEWS
              ============================================== */}
          {activeSidebarTab === 'reviews' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Kelola Ulasan & Klien Kulle</h3>
                  <p className="text-xs text-slate-400">Tambah, ubah, atau hapus ulasan loyal pelanggan yang tampil di bagian testimoni landing page.</p>
                </div>

                <button
                  id="add-review-btn"
                  onClick={handleOpenAddReview}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Plus className="w-4.5 h-4.5" /> TAMBAH ULASAN BARU
                </button>
              </div>

              {/* Total Summary Stats for Reviews */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-slate-800' : 'bg-white border-slate-100'} flex items-center gap-4`}>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-[#0F52BA] dark:text-cyan-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Ulasan</p>
                    <p className="text-lg font-black">{reviews.length} Ulasan</p>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-slate-800' : 'bg-white border-slate-100'} flex items-center gap-4`}>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Rata-rata Rating</p>
                    <p className="text-lg font-black">
                      {reviews.length > 0 
                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                        : '0.0'} / 5.0
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-slate-800' : 'bg-white border-slate-100'} flex items-center gap-4`}>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Diterbitkan Aktif</p>
                    <p className="text-lg font-black">Aktif Semua</p>
                  </div>
                </div>
              </div>

              {/* Testimonial List Board */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 animate-fade-in">
                    <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-400">Belum Ada Ulasan Terdaftar</p>
                    <p className="text-xs text-slate-500 mt-1">Ulasan baru yang ditambahkan di sini akan langsung tampil pada Landing Page.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((rev) => (
                      <div 
                        key={rev.id} 
                        className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:shadow-md ${isDarkMode ? 'bg-[#0a142c] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="space-y-3">
                          {/* Top Author Row */}
                          <div className="flex items-center gap-3">
                            <img 
                              src={rev.avatar} 
                              alt={rev.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-700/35 bg-slate-900 shadow-sm" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="text-xs font-bold font-sans">{rev.name}</h4>
                              <p className="text-[10px] font-mono text-slate-500">{rev.date || 'Tanggal tidak diset'}</p>
                            </div>
                            
                            {/* Stars rating align right */}
                            <div className="ml-auto flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'text-slate-705 text-slate-700'}`} 
                                />
                              ))}
                            </div>
                          </div>

                          {/* Comment block */}
                          <p className={`text-xs leading-relaxed italic ${isDarkMode ? 'text-slate-350 text-slate-300' : 'text-slate-600'}`}>
                            "{rev.comment}"
                          </p>
                        </div>

                        {/* Card bottom actions row */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-850/40 dark:border-slate-800">
                          <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                            Verified Reviewer
                          </span>

                          <div className="flex gap-2">
                            <button
                              id={`edit-review-btn-${rev.id}`}
                              onClick={() => handleOpenEditReview(rev)}
                              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs flex items-center gap-1 font-semibold transition-all cursor-pointer"
                              title="Ubah Ulasan"
                            >
                              <Edit className="w-3.5 h-3.5" /> Ubah
                            </button>
                            <button
                              id={`delete-review-btn-${rev.id}`}
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs flex items-center gap-1 font-semibold transition-all cursor-pointer"
                              title="Hapus Ulasan"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==============================================
              VIEW 9: CORE SETTINGS (UPDATE CAFE DATA)
              ============================================== */}
          {activeSidebarTab === 'settings' && (
            <div className="max-w-2xl">
              
              <div className="mb-6">
                <h3 className="text-xl font-extrabold tracking-tight text-white">Pengaturan Utama Kulle Cafe</h3>
                <p className="text-xs text-slate-400">Perbarui alamat, jam operasional, nomor WhatsApp, dan slogan brand secara instan.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Nama Brand (Merek)</label>
                    <input
                      required
                      type="text"
                      value={settingsBrand}
                      onChange={(e) => setSettingsBrand(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Deskripsi Slogan / Tagline</label>
                    <input
                      required
                      type="text"
                      value={settingsTagline}
                      onChange={(e) => setSettingsTagline(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Email Kontak</label>
                    <input
                      required
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Nomor Telepon Kontak</label>
                    <input
                      required
                      type="text"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Alamat Kantor Aktif</label>
                  <input
                    required
                    type="text"
                    value={settingsAddr}
                    onChange={(e) => setSettingsAddr(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Nomor Utama WhatsApp</label>
                    <input
                      required
                      type="text"
                      value={settingsWA}
                      onChange={(e) => setSettingsWA(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Jam Buka Operasional</label>
                    <input
                      required
                      type="text"
                      value={settingsHours}
                      onChange={(e) => setSettingsHours(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                    />
                  </div>
                </div>

                {/* -----------------------------------------------
                    TOMBOL TAMBAH PESANAN (ENABLE/DISABLE CONFIGURATION)
                    ----------------------------------------------- */}
                <div id="booking-feature-admin-card" className={`p-5 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/10' : 'border-slate-100 bg-slate-50'} space-y-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Fitur Pemesanan Pelanggan</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sembunyikan atau aktifkan tombol "Tambah Pesanan" di menu reguler landing page.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSettingsDisableOrderButtons(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${!settingsDisableOrderButtons ? 'bg-emerald-600 border-emerald-600 text-white' : (isDarkMode ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}`}
                      >
                        Aktif (Tampil)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsDisableOrderButtons(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${settingsDisableOrderButtons ? 'bg-red-650 border-red-600 text-white bg-red-600' : (isDarkMode ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600' : 'border-slate-200 text-slate-600 hover:bg-slate-100')}`}
                      >
                        Nonaktif (Sembunyikan)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800/60 dark:border-slate-800 bg-slate-900/10 space-y-4">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="w-full md:w-auto flex flex-wrap items-center gap-4">
                      {/* High-Resolution Zoomed Favicon Detail */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 dark:bg-slate-950/80">
                        {settingsFavicon ? (
                          <div className="relative group">
                            <img src={settingsFavicon} className="w-14 h-14 rounded-lg object-cover shadow-md border border-slate-700/30 bg-slate-900" alt="Favicon Zoom" />
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] font-mono font-bold bg-blue-600 text-white rounded whitespace-nowrap">64x64 PX</span>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-[#0F52BA]/10 border border-dashed border-[#0F52BA]/30 flex items-center justify-center text-slate-500 text-[10px] font-medium">
                            Kosong
                          </div>
                        )}
                        <span className="text-[9px] font-semibold text-slate-400 mt-2">Detail Ikon</span>
                      </div>

                      {/* Larger Simulator Tab Display */}
                      <div className="flex-grow">
                        <p className="text-[10px] font-mono uppercase text-slate-500 mb-1.5 text-left">Simulasi Tab Browser:</p>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2.5 w-full md:w-80 shadow-md">
                          {/* Browser Window Window Bar */}
                          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-900">
                            <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                          </div>
                          {/* Realistic Simulated Tab */}
                          <div className="flex items-center gap-2 bg-[#1e293b]/75 border border-slate-800 rounded-lg px-3 py-2 max-w-[210px]">
                            {settingsFavicon ? (
                              <img src={settingsFavicon} className="w-5 h-5 rounded object-cover shadow-sm bg-slate-900" alt="Favicon" />
                            ) : (
                              <div className="w-5 h-5 rounded bg-[#0F52BA]/20 animate-pulse"></div>
                            )}
                            <span className="text-[11px] font-bold text-slate-200 truncate pr-1">
                              {settingsBrand || 'Kulle Kopi'}
                            </span>
                            <span className="text-[9px] text-slate-500 hover:text-slate-400 font-bold ml-auto cursor-pointer">×</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 max-w-sm">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Unggah File Ikon (.png, .jpg, .ico)</label>
                      <div className="flex items-center gap-2">
                        <label className={`flex-grow flex items-center justify-center border border-dashed rounded-lg p-2.5 text-[11px] font-medium cursor-pointer transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-blue-500 text-slate-350 hover:text-white' : 'bg-white border-slate-200 hover:border-blue-500 text-slate-600'}`}>
                          <span>📂 Pilih Gambar/Ikon Baru</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 1 * 1024 * 1024) {
                                alert("Ukuran gambar ikon (favicon) tidak boleh melebihi 1MB.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setSettingsFavicon(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {settingsFavicon && (
                          <button
                            type="button"
                            onClick={() => setSettingsFavicon('')}
                            className="px-3 py-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg border border-red-500/20 transition-all font-semibold"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>



                {/* -----------------------------------------------
                    HERO CAROUSEL IMAGES (4 SLOT CONFIGURATION)
                    ----------------------------------------------- */}
                <div className="p-6 rounded-2xl border border-slate-800/60 dark:border-slate-800 bg-slate-900/10 space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Foto Hero Banner (Carousel Slideshow)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Atur 4 gambar utama yang berganti otomatis di bagian atas beranda landing page.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Slot 1 */}
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F52BA] dark:text-cyan-400 font-bold">Slot Foto 1 (Utama)</span>
                        <span className="text-[9px] font-mono text-slate-500">Image #1</span>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900/60 group">
                        {settingsHero1 ? (
                          <img src={settingsHero1} className="w-full h-full object-cover" alt="Hero 1 Preview" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px] p-3 text-center">
                            <span>Membuka default Unsplash Rasa Kopi</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className={`flex-grow flex items-center justify-center border border-dashed rounded p-1.5 text-[10px] font-semibold cursor-pointer transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white' : 'bg-white border-slate-200 hover:border-blue-500 text-slate-600'}`}>
                            <span>📂 Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') setSettingsHero1(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setSettingsHero1('')}
                            className="px-2.5 py-1.5 text-[10px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/20 transition-all"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Slot 2 */}
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F52BA] dark:text-cyan-400 font-bold">Slot Foto 2</span>
                        <span className="text-[9px] font-mono text-slate-500">Image #2</span>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900/60 group">
                        <img src={settingsHero2 || heroImg2} className="w-full h-full object-cover" alt="Hero 2 Preview" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className={`flex-grow flex items-center justify-center border border-dashed rounded p-1.5 text-[10px] font-semibold cursor-pointer transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white' : 'bg-white border-slate-200 hover:border-blue-500 text-slate-600'}`}>
                            <span>📂 Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') setSettingsHero2(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setSettingsHero2('')}
                            className="px-2.5 py-1.5 text-[10px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/20 transition-all"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Slot 3 */}
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F52BA] dark:text-cyan-400 font-bold">Slot Foto 3</span>
                        <span className="text-[9px] font-mono text-slate-500">Image #3</span>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900/60 group">
                        <img src={settingsHero3 || heroImg3} className="w-full h-full object-cover" alt="Hero 3 Preview" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className={`flex-grow flex items-center justify-center border border-dashed rounded p-1.5 text-[10px] font-semibold cursor-pointer transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white' : 'bg-white border-slate-200 hover:border-blue-500 text-slate-600'}`}>
                            <span>📂 Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') setSettingsHero3(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setSettingsHero3('')}
                            className="px-2.5 py-1.5 text-[10px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/20 transition-all"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Slot 4 */}
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F52BA] dark:text-cyan-400 font-bold">Slot Foto 4</span>
                        <span className="text-[9px] font-mono text-slate-500">Image #4</span>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900/60 group">
                        <img src={settingsHero4 || heroImg4} className="w-full h-full object-cover" alt="Hero 4 Preview" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className={`flex-grow flex items-center justify-center border border-dashed rounded p-1.5 text-[10px] font-semibold cursor-pointer transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white' : 'bg-white border-slate-200 hover:border-blue-500 text-slate-600'}`}>
                            <span>📂 Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') setSettingsHero4(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setSettingsHero4('')}
                            className="px-2.5 py-1.5 text-[10px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/20 transition-all"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#0F52BA] to-blue-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow shadow-blue-500/20"
                  >
                    SIMPAN KONFIGURASI SITUS
                  </button>
                </div>

                {settingsSavedSuccess && (
                  <p className="text-xs text-emerald-500 font-bold">✓ Pengaturan utama sukses disimpan! Landing page berhasil diperbarui secara real-time.</p>
                )}
              </form>

              {/* -----------------------------------------------
                  DELETE SEEDED DATA SECTION
                  ----------------------------------------------- */}
              <div className={`mt-8 p-6 rounded-2xl border ${isDarkMode ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50/50'} space-y-4`}>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">Pembersihan Data Contoh (Seeded Data)</h4>
                  <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-650'} mt-0.5`}>Hapus semua data contoh bawaan untuk memulai pengisian data kafe Anda sendiri dari awal yang bersih.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteSeededData) {
                      onDeleteSeededData();
                    } else {
                      alert("Fungsi penghapusan belum terhubung.");
                    }
                  }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/10 cursor-pointer"
                >
                  HAPUS SEMUA DATA CONTOH
                </button>
              </div>

            </div>
          )}

          {/* ==============================================
              VIEW 10: EDIT GALLERY (MANAGE CAFE GENERAL PHOTOS)
              ============================================== */}
          {activeSidebarTab === 'gallery' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">Galeri & Foto Kulle Kopi</h3>
                  <p className="text-xs text-slate-400">Atur foto interior, suasana seduh, kopi, dan kuliner untuk ditampilkan di landing page.</p>
                </div>

                <button
                  id="add-gallery-item-btn"
                  onClick={handleOpenAddGallery}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F52BA] to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Plus className="w-4.5 h-4.5" /> TAMBAH FOTO BARU
                </button>
              </div>

              {/* Gallery list cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(galleryPhotos || []).map((photo, idx) => (
                  <div key={photo.id || idx} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0a142c] border-slate-800' : 'bg-white border-slate-100'} flex flex-col justify-between overflow-hidden gap-4`}>
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-700/20">
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-black/70 text-cyan-400 border border-cyan-400/20">{photo.category}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">{photo.title}</h4>
                      </div>
                    </div>

                    <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-800/10 dark:border-slate-800/40">
                      <button
                        onClick={() => handleOpenEditGallery(photo)}
                        className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${isDarkMode ? 'border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        title="Edit detail"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteGallery(photo.id)}
                        className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${isDarkMode ? 'border-slate-800/80 text-rose-450 hover:bg-rose-500/10 hover:border-rose-500/30' : 'border-slate-200 text-rose-600 hover:bg-rose-50'}`}
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ==============================================
          GLOBAL INTERACTIVE DIALOG MODALS & OVERLAYS
      {/* MODAL 1: ORDER DETAIL DIALOG */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrderDetails(null)} className="absolute inset-0 bg-[#0A1F44]" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-lg w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-880'}`}>
              <div className="flex justify-between items-center pb-3 border-b border-inherit">
                <span className="font-extrabold text-sm font-mono text-[#0F52BA] dark:text-cyan-400">Detail Log Pesanan {selectedOrderDetails.id}</span>
                <button onClick={() => setSelectedOrderDetails(null)} className="text-slate-400 hover:text-red-500 font-bold text-sm">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <p>Nama Akun Pelanggan: <span className="font-bold">{selectedOrderDetails.customerName}</span></p>
                <p>Nomor Telepon: <span className="font-mono">{selectedOrderDetails.customerPhone}</span></p>
                <p>Meja / Penempatan: <span className="font-mono text-cyan-400 uppercase font-black">{selectedOrderDetails.tableNumber}</span></p>
                <p>Metode Pembayaran: <span className="font-mono uppercase font-black">{selectedOrderDetails.paymentMethod}</span></p>
                {selectedOrderDetails.notes && <p className="p-2 border border-blue-900/40 rounded italic bg-[#0d1c3a] text-slate-300">Catatan: "{selectedOrderDetails.notes}"</p>}
              </div>

              <div className="border-t border-slate-800/10 pt-3 space-y-2 text-xs">
                <p className="font-bold uppercase tracking-widest text-[#0F52BA] dark:text-cyan-400">Menu Masakan Terpilih:</p>
                {selectedOrderDetails.items.map((it) => (
                  <div key={it.id} className="flex justify-between font-mono text-slate-700 dark:text-slate-300">
                    <span>{it.menuItem.name} (x{it.quantity})</span>
                    <span>Rp {(it.menuItem.price * it.quantity).toLocaleString('id')}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-slate-800/20 pt-2 flex justify-between font-bold text-sm">
                  <span>Total Keseluruhan</span>
                  <span className="font-mono text-emerald-500">Rp {selectedOrderDetails.total.toLocaleString('id')}</span>
                </div>
              </div>

              <div className="border-t border-slate-800/20 pt-3 flex flex-wrap gap-2 justify-end">
                <span className="text-xs uppercase font-mono tracking-widest flex items-center pr-3">Status Operasional:</span>
                <button onClick={() => handleStatusUpdate(selectedOrderDetails.id, 'processing')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] rounded font-bold">Terima Pesanan</button>
                <button onClick={() => handleStatusUpdate(selectedOrderDetails.id, 'completed')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] rounded font-bold">Siap Sajikan</button>
                <button onClick={() => handleStatusUpdate(selectedOrderDetails.id, 'cancelled')} className="px-3 py-1.5 bg-red-600 hover:bg-red-750 text-white text-[11px] rounded font-bold">Batal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: PRINT PRE-READY CASHIER RECEIPT */}
      <AnimatePresence>
        {showPrintInvoice && (
          <div id="receipt-print-dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setShowPrintInvoice(null)} className="absolute inset-0 bg-[#0A1F44]/90" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative max-w-sm w-full bg-white text-slate-900 border-2 border-slate-900 p-8 space-y-6 shadow-2xl rounded-sm">
              <button onClick={() => setShowPrintInvoice(null)} className="absolute top-2.5 right-2 text-slate-400 hover:text-red-500 font-bold text-base">✕</button>
              
              <div className="text-center space-y-1 border-b-2 border-dashed border-slate-900 pb-4 font-mono">
                <h3 className="font-black text-lg tracking-wider">··· KULLE KOPI ···</h3>
                <p className="text-[10px]">Jl. Sapphire Blue No. 44, Jakarta</p>
                <p className="text-[10px]">Hotline: {settings.contactPhone}</p>
              </div>

              <div className="font-mono text-[10px] space-y-1">
                <p>Kunci Transaksi: <span className="font-bold">{showPrintInvoice.id}</span></p>
                <p>Waktu Cetak: {new Date(showPrintInvoice.createdAt).toLocaleString()}</p>
                <p>Nomor Meja: {showPrintInvoice.tableNumber}</p>
                <p>Nama Kasir: Administrator</p>
                <p>Metode: {showPrintInvoice.paymentMethod.toUpperCase()}</p>
              </div>

              <div className="border-t-2 border-dashed border-slate-900 pt-4 space-y-2 font-mono text-[11px]">
                {showPrintInvoice.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.menuItem.name} x{it.quantity}</span>
                    <span>Rp {(it.menuItem.price * it.quantity).toLocaleString('id')}</span>
                  </div>
                ))}
                
                <div className="border-t border-dashed border-slate-400 pt-2 flex justify-between font-black text-xs">
                  <span>Total Pembayaran</span>
                  <span>Rp {showPrintInvoice.total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-center font-mono text-[9px] pt-4 border-t-2 border-dashed border-slate-900 space-y-0.5">
                <p>··· TERIMA KASIH ATAS KUNJUNGAN ANDA ···</p>
                <p>KOPI NIKMAT • MAKANAN LEZAT • SUASANA HANGAT</p>
              </div>

              <button 
                onClick={() => { window.print(); }}
                className="w-full py-2 bg-slate-950 text-white rounded font-mono font-bold text-xs"
              >
                CETAK STRUK SEKARANG
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CREATION MENU FORM DRAWER */}
      <AnimatePresence>
        {itemFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setItemFormOpen(false)} className="absolute inset-0 bg-[#0A1F44]" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-lg w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}>
              <div className="flex justify-between items-center pb-3 border-b border-inherit">
                <h3 className="font-bold text-sm uppercase font-mono">{editingMenuItem ? 'Ubah Katalog Kulle' : 'Tambah Spesifikasi Katalog Baru'}</h3>
                <button onClick={() => setItemFormOpen(false)} className="text-slate-400 hover:text-red-500 font-bold text-sm">✕</button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-404 font-bold">Nama Hidangan</label>
                    <input
                      required
                      type="text"
                      value={menuFormName}
                      onChange={(e) => setMenuFormName(e.target.value)}
                      placeholder="Contoh: Cappuccino"
                      className={`w-full p-2 rounded border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-205'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-404 font-bold">Harga (Rp)</label>
                    <input
                      required
                      type="number"
                      value={menuFormPrice}
                      onChange={(e) => setMenuFormPrice(Number(e.target.value))}
                      className={`w-full p-2 rounded border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-205'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-404 font-bold">Kategori</label>
                    <select
                      value={menuFormCategory}
                      onChange={(e) => setMenuFormCategory(e.target.value as Category)}
                      className={`w-full p-2 rounded border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/50 border-slate-205'}`}
                    >
                      <option value="black coffee">Black Coffee</option>
                      <option value="white coffee">White Coffee</option>
                      <option value="non kopi">Non Coffee</option>
                      <option value="juice">Juice</option>
                      <option value="makanan berat">Makanan Berat</option>
                      <option value="makanan ringan">Makanan Ringan</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-slate-404 font-bold">Foto Produk (Image/Upload)</label>
                    <div
                      onDragOver={handleImageDragOver}
                      onDragLeave={handleImageDragLeave}
                      onDrop={handleImageDrop}
                      onClick={() => document.getElementById('menuFormFileInput')?.click()}
                      className={`relative border border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${isDraggingImage ? 'border-cyan-400 bg-cyan-500/10' : (isDarkMode ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700' : 'border-slate-300 bg-slate-50 hover:bg-slate-100')}`}
                      style={{ minHeight: '100px' }}
                    >
                      <input
                        type="file"
                        id="menuFormFileInput"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUploadChange(e.target.files[0]);
                          }
                        }}
                      />
                      
                      {menuFormImage ? (
                        <div className="flex flex-col items-center gap-1.5 w-full">
                          <div className="relative group/preview w-14 h-14 rounded-lg overflow-hidden border border-slate-700/55">
                            <img src={menuFormImage} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-all">
                              <span className="text-[8px] text-white font-mono bg-red-600 px-1 py-0.5 rounded cursor-pointer" onClick={(e) => { e.stopPropagation(); setMenuFormImage(''); }}>Hapus</span>
                            </div>
                          </div>
                          <p className="text-[8px] font-mono text-slate-404 text-center truncate max-w-xs uppercase">
                            {menuFormImage.startsWith('data:') ? '✓ Unggahan Lokal' : '✓ Link URL Aktif'}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-900 text-cyan-400' : 'bg-white text-[#0F52BA] shadow-sm'} mb-0.5`}>
                            <Upload className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-[9px] font-semibold text-slate-300">
                            <span className="text-cyan-400 font-bold">Pilih foto</span> atau seret file
                          </p>
                          <p className="text-[8px] text-slate-500">Maksimal 5MB</p>
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      value={menuFormImage}
                      onChange={(e) => setMenuFormImage(e.target.value)}
                      placeholder="Atau tempel link URL foto..."
                      className={`w-full p-2 rounded border text-[10px] outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400' : 'bg-slate-50 border-slate-205 placeholder-slate-400 focus:border-[#0F52BA]'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-404 font-bold">Stok Awal</label>
                    <input
                      type="number"
                      value={menuFormStock}
                      onChange={(e) => setMenuFormStock(Number(e.target.value))}
                      className={`w-full p-2 rounded border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-205'}`}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-5">
                    <input
                      type="checkbox"
                      id="best-seller-check"
                      checked={menuFormBestSeller}
                      onChange={(e) => setMenuFormBestSeller(e.target.checked)}
                      className="rounded border"
                    />
                    <label htmlFor="best-seller-check" className="text-[10px] font-mono uppercase text-slate-405 font-bold">Tandai Menu Terlaris 🔥</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-404 font-bold">Deskripsi Hidangan</label>
                  <textarea
                    required
                    rows={3}
                    value={menuFormDesc}
                    onChange={(e) => setMenuFormDesc(e.target.value)}
                    placeholder="Masukkan deskripsi lezat hidangan kuliner ini..."
                    className={`w-full p-2 rounded border outline-none resize-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-205'}`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0F52BA] hover:bg-blue-600 font-bold text-white rounded text-xs uppercase"
                >
                  SIMPAN SPESIFIKASI KATALOG
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: GALLERY ITEM FORM DRAWER */}
      <AnimatePresence>
        {galleryFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setGalleryFormOpen(false)} className="absolute inset-0 bg-[#0A1F44]/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-md w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}>
              <div className="flex justify-between items-center pb-3 border-b border-inherit">
                <h3 className="font-bold text-sm uppercase font-mono">{editingGalleryItem ? 'Edit Foto Galeri' : 'Tambah Foto Galeri Baru'}</h3>
                <button onClick={() => setGalleryFormOpen(false)} className="text-slate-400 hover:text-red-500 font-bold text-sm">✕</button>
              </div>

              <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-404 font-bold text-slate-400">Judul Foto / Deskripsi Singkat</label>
                  <input
                    required
                    type="text"
                    value={galleryFormTitle}
                    onChange={(e) => setGalleryFormTitle(e.target.value)}
                    placeholder="Contoh: Suasana sore hari yang hangat"
                    className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-404 font-bold text-slate-400">Kategori Galeri</label>
                  <select
                    value={galleryFormCategory}
                    onChange={(e) => setGalleryFormCategory(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="interior">Interior / Eksterior Kafe</option>
                    <option value="seduh">Proses Penyeduhan Kopi</option>
                    <option value="kopi">Menu Kopi (Minuman)</option>
                    <option value="kuliner">Menu Makanan / Kuliner</option>
                  </select>
                </div>

                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[10px] font-mono uppercase text-slate-420 font-bold text-slate-400">Foto Galeri (Unggah/Upload)</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingGalleryImage(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingGalleryImage(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingGalleryImage(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleGalleryImageUploadChange(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => document.getElementById('galleryFormFileInput')?.click()}
                    className={`relative border border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${isDraggingGalleryImage ? 'border-cyan-400 bg-cyan-500/10' : (isDarkMode ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700' : 'border-slate-300 bg-slate-50 hover:bg-slate-100')}`}
                    style={{ minHeight: '130px' }}
                  >
                    <input
                      type="file"
                      id="galleryFormFileInput"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleGalleryImageUploadChange(e.target.files[0]);
                        }
                      }}
                    />
                    
                    {galleryFormImage ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="relative group/preview w-20 h-20 rounded-xl overflow-hidden border border-slate-700/50">
                          <img src={galleryFormImage} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-all">
                            <span className="text-[9px] text-white font-mono bg-red-600 px-1.5 py-0.5 rounded cursor-pointer" onClick={(e) => { e.stopPropagation(); setGalleryFormImage(''); }}>Hapus</span>
                          </div>
                        </div>
                        <p className="text-[9px] font-mono text-slate-400 text-center truncate max-w-xs">
                          {galleryFormImage.startsWith('data:') ? '✓ Unggahan Sukses' : '✓ Link URL Aktif'}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className={`p-2 rounded-xl h-9 w-9 flex items-center justify-center ${isDarkMode ? 'bg-slate-900 text-cyan-400' : 'bg-slate-100 text-[#0F52BA]'} mb-1`}>
                          <Upload className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400">
                          <span className="text-cyan-400 hover:underline">Pilih foto</span> atau seret file ke sini
                        </p>
                        <p className="text-[9px] text-slate-500">Maksimal 5MB</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={galleryFormImage}
                    onChange={(e) => setGalleryFormImage(e.target.value)}
                    placeholder="Atau tempel tautan URL gambar..."
                    className={`w-full p-2.5 rounded-xl border text-[10px] outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-[#0F52BA]'}`}
                  />
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGalleryFormOpen(false)}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-150 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#0F52BA] to-blue-500 font-bold text-white rounded-xl shadow shadow-blue-500/25"
                  >
                    SIMPAN FOTO
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: CREATION/EDIT INVENTORY INGREDIENT FORM */}
      <AnimatePresence>
        {invFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => { setInvFormOpen(false); setEditingInventoryItem(null); }} className="absolute inset-0 bg-[#0A1F44]" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-sm w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
              <div className="flex justify-between items-center pb-2 border-b border-inherit">
                <h4 className="font-bold text-sm uppercase font-mono">{editingInventoryItem ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}</h4>
                <button onClick={() => { setInvFormOpen(false); setEditingInventoryItem(null); }} className="text-slate-450 hover:text-red-500 font-bold">✕</button>
              </div>

              <form onSubmit={handleSaveInventory} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono uppercase text-slate-400">Nama Bahan Baku</label>
                  <input required type="text" value={invName} onChange={(e) => setInvName(e.target.value)} className={`w-full p-2 rounded outline-none border ${isDarkMode ? 'text-white bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-250'}`} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9.5px] font-mono uppercase text-slate-400">Stok Kuantitas</label>
                    <input type="number" value={invStock} onChange={(e) => setInvStock(Number(e.target.value))} className={`w-full p-2 rounded outline-none border ${isDarkMode ? 'text-white bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-250'}`} />
                  </div>
                  <div>
                    <label className="text-[9.5px] font-mono uppercase text-slate-400">Satuan</label>
                    <input type="text" value={invUnit} onChange={(e) => setInvUnit(e.target.value)} className={`w-full p-2 rounded outline-none border ${isDarkMode ? 'text-white bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-250'}`} />
                  </div>
                  <div>
                    <label className="text-[9.5px] font-mono uppercase text-slate-400">Batas Minimum</label>
                    <input type="number" value={invMin} onChange={(e) => setInvMin(Number(e.target.value))} className={`w-full p-2 rounded outline-none border ${isDarkMode ? 'text-white bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-250'}`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono uppercase text-slate-400">Kategori Klasifikasi</label>
                  <input type="text" value={invCategory} onChange={(e) => setInvCategory(e.target.value)} placeholder="contoh: Supplier Core, Camilan" className={`w-full p-2 rounded outline-none border ${isDarkMode ? 'text-white bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-250'}`} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono uppercase text-slate-400">Nama Representative Supplier Utama</label>
                  <input type="text" value={invSupplier} onChange={(e) => setInvSupplier(e.target.value)} className={`w-full p-2 rounded outline-none border ${isDarkMode ? 'text-white bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-250'}`} />
                </div>

                <button type="submit" className="w-full py-2 bg-[#0F52BA] text-white font-bold rounded uppercase hover:brightness-110 transition-all">
                  {editingInventoryItem ? 'Simpan Perubahan Bahan Baku' : 'Simpan Data Bahan Baku'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: ADD NEW EMPLOYEE SPECIFICS */}
      <AnimatePresence>
        {empFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setEmpFormOpen(false)} className="absolute inset-0 bg-[#0A1F44]" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-sm w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-205'}`}>
              <div className="flex justify-between items-center pb-2 border-b border-inherit">
                <h4 className="font-bold text-sm uppercase font-mono">Daftarkan Anggota Tim</h4>
                <button onClick={() => setEmpFormOpen(false)} className="text-slate-400 hover:text-red-555 font-bold">✕</button>
              </div>

              <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Nama Lengkap Staf</label>
                  <input required type="text" value={empName} onChange={(e) => setEmpName(e.target.value)} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Peran Utama Tim</label>
                  <select value={empRole} onChange={(e: any) => setEmpRole(e.target.value)} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded">
                    <option value="Barista">Kepala Barista</option>
                    <option value="Chef">Koki Utama Dapur</option>
                    <option value="Waiter">Pramusaji Pelanggan</option>
                    <option value="Cashier">Kasir Operasional</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Alamat Email Kerja</label>
                  <input required type="email" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Pembagian Shift</label>
                  <select value={empShift} onChange={(e: any) => setEmpShift(e.target.value)} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded">
                    <option value="Morning (07:00 - 15:00)">Shift Pagi (07:00 - 15:00)</option>
                    <option value="Evening (15:00 - 23:00)">Shift Sore/Malam (15:00 - 23:00)</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-2 bg-[#0F52BA] text-white font-bold rounded uppercase">
                  Tambahkan ke Jadwal Staf
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 6: ADD NEW PROMOTION CODE */}
      <AnimatePresence>
        {promoFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setPromoFormOpen(false)} className="absolute inset-0 bg-[#0A1F44]" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-sm w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-205'}`}>
              <div className="flex justify-between items-center pb-2 border-b border-inherit">
                <h4 className="font-bold text-sm uppercase font-mono">Buat Kampanye Promosi</h4>
                <button onClick={() => setPromoFormOpen(false)} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
              </div>

              <form onSubmit={handleSavePromotion} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Kode Kampanye Dinamis</label>
                  <input required type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded" placeholder="Contoh: HALOKULLE" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Potongan Diskon %</label>
                  <input required type="number" value={promoDisc} onChange={(e) => setPromoDisc(Number(e.target.value))} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Klasifikasi Kupon</label>
                  <select value={promoType} onChange={(e: any) => setPromoType(e.target.value)} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded">
                    <option value="discount">Kupon Diskon Langsung %</option>
                    <option value="campaign">Kampanye Pemasaran Luas</option>
                    <option value="event">Diskon Acara Spesial</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Teks Deskripsi (Diterbitkan ke Situs)</label>
                  <input required type="text" value={promoDesc} onChange={(e) => setPromoDesc(e.target.value)} className="w-full p-2 text-white bg-slate-950 border border-slate-800 rounded" placeholder="Contoh: Dapatkan diskon 15% untuk seduhan pertama di pagi hari!" />
                </div>

                <button type="submit" className="w-full py-2 bg-[#0F52BA] text-white font-bold rounded uppercase">
                  Luncurkan Kampanye Kupon
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 7: ADD / EDIT REVIEWS SPECIFICS */}
      <AnimatePresence>
        {reviewFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setReviewFormOpen(false)} className="absolute inset-0 bg-[#0A1F44]/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-sm w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-205 text-slate-800'}`}>
              <div className="flex justify-between items-center pb-2 border-b border-inherit">
                <h4 className="font-bold text-sm uppercase font-mono">{editingReview ? 'Ubah Ulasan Pelanggan' : 'Tambah Ulasan Pelanggan'}</h4>
                <button onClick={() => setReviewFormOpen(false)} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
              </div>

              <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Nama Pelanggan</label>
                  <input required type="text" value={reviewFormName} onChange={(e) => setReviewFormName(e.target.value)} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} placeholder="Contoh: Rian Pratama" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Rating Bintang (1 - 5)</label>
                  <select value={reviewFormRating} onChange={(e) => setReviewFormRating(Number(e.target.value))} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`}>
                    <option value="5">⭐⭐⭐⭐⭐ 5 Bintang</option>
                    <option value="4">⭐⭐⭐⭐ 4 Bintang</option>
                    <option value="3">⭐⭐⭐ 3 Bintang</option>
                    <option value="2">⭐⭐ 2 Bintang</option>
                    <option value="1">⭐ 1 Bintang</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Isi Komentar / Testimoni</label>
                  <textarea required rows={3} value={reviewFormComment} onChange={(e) => setReviewFormComment(e.target.value)} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} placeholder="Tulis masukan, kesan atau ulasan pelanggan terhadap Kulle Kopi..." />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Tanggal Ulasan</label>
                  <input type="date" value={reviewFormDate} onChange={(e) => setReviewFormDate(e.target.value)} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Foto Profil / Avatar</label>
                  <div className="flex items-center gap-3">
                    <img src={reviewFormAvatar} alt="Avatar Preview" className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-950" />
                    <div className="flex-1 flex flex-col gap-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="reviewAvatarFileInput"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleReviewAvatarUploadChange(e.target.files[0]);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('reviewAvatarFileInput')?.click()}
                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-wider text-left w-fit transition-all cursor-pointer"
                      >
                        Unggah Foto
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={reviewFormAvatar}
                    onChange={(e) => setReviewFormAvatar(e.target.value)}
                    placeholder="Atau masukkan tautan URL foto..."
                    className={`w-full p-2.5 mt-1 rounded-xl border text-[10px] outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-[#0F52BA]'}`}
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewFormOpen(false)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all text-center cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#0F52BA] to-blue-500 font-bold text-white rounded-xl shadow shadow-blue-500/25 cursor-pointer"
                  >
                    SIMPAN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 8: ADD / EDIT CUSTOMERS SPECIFICS */}
      <AnimatePresence>
        {custFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setCustFormOpen(false)} className="absolute inset-0 bg-[#0A1F44]/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-sm w-full rounded-2xl border p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
              <div className="flex justify-between items-center pb-2 border-b border-inherit">
                <h4 className="font-bold text-sm uppercase font-mono">{editingCustomer ? 'Edit Data Pelanggan' : 'Daftar Pelanggan Baru'}</h4>
                <button onClick={() => setCustFormOpen(false)} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
              </div>

              <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Nama Lengkap</label>
                  <input required type="text" value={custFormName} onChange={(e) => setCustFormName(e.target.value)} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} placeholder="Contoh: Budi Santoso" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Alamat Email</label>
                  <input required type="email" value={custFormEmail} onChange={(e) => setCustFormEmail(e.target.value)} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} placeholder="Contoh: budi@gmail.com" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">No. Telepon / WhatsApp</label>
                  <input required type="text" value={custFormPhone} onChange={(e) => setCustFormPhone(e.target.value)} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} placeholder="Contoh: 08123456789" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Total Pesanan</label>
                    <input type="number" min="0" value={custFormTotalOrders} onChange={(e) => setCustFormTotalOrders(Number(e.target.value))} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Total Pengeluaran (Rp)</label>
                    <input type="number" min="0" value={custFormTotalSpent} onChange={(e) => setCustFormTotalSpent(Number(e.target.value))} className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F52BA]'}`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Foto Profil / Avatar</label>
                  <div className="flex items-center gap-3">
                    <img src={custFormAvatar} alt="Avatar Preview" className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-950" />
                    <div className="flex-1 flex flex-col gap-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="custAvatarFileInput"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleCustAvatarUploadChange(e.target.files[0]);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('custAvatarFileInput')?.click()}
                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-wider text-left w-fit transition-all cursor-pointer"
                      >
                        Unggah Foto
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={custFormAvatar}
                    onChange={(e) => setCustFormAvatar(e.target.value)}
                    placeholder="Atau masukkan tautan URL foto..."
                    className={`w-full p-2.5 mt-1 rounded-xl border text-[10px] outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-[#0F52BA]'}`}
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustFormOpen(false)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all text-center cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#0F52BA] to-blue-500 font-bold text-white rounded-xl shadow shadow-blue-500/25 cursor-pointer"
                  >
                    SIMPAN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==============================================
          CUSTOM CONFIRMATION MODAL (BYPASS IFRAME LIMITATIONS)
          ============================================== */}
      <AnimatePresence>
        {deleteConfirmState && deleteConfirmState.isOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.6 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setDeleteConfirmState(null)} 
              className="absolute inset-0 bg-[#060D1E]" 
            />
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 10 }} 
              className={`relative max-w-md w-full rounded-2xl border p-6 space-y-4 shadow-2xl z-10 ${isDarkMode ? 'bg-slate-900 border-red-500/20 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
            >
              <div className="flex items-center gap-3 text-red-500">
                <ShieldAlert className="w-6 h-6 shrink-0 text-red-500 font-bold" />
                <h3 className="font-bold text-sm uppercase tracking-wider font-mono">{deleteConfirmState.title}</h3>
              </div>
              
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>
                {deleteConfirmState.message}
              </p>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmState(null)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  BATAL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteConfirmState.onConfirm();
                    setDeleteConfirmState(null);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-600 font-bold text-white text-xs rounded-xl shadow shadow-red-600/25 cursor-pointer hover:from-red-500 hover:to-rose-500 transition-all"
                >
                  YA, HAPUS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
