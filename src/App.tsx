/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MenuItem, Order, Customer, InventoryItem, Employee, Promotion, CafeSettings, OrderItem, GalleryItem, Review } from './types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_INVENTORY, 
  INITIAL_EMPLOYEES, 
  INITIAL_PROMOTIONS, 
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_GALLERY_PHOTOS
} from './initialData';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './supabaseClient';

export default function App() {
  // Portal View Router State ('customer' | 'admin')
  const [view, setView] = useState<'customer' | 'admin'>(() => {
    if (window.location.pathname === '/login' || window.location.pathname === '/admin') {
      return 'admin';
    }
    return 'customer';
  });

  const handleUpdateCustomers = (updated: Customer[]) => {
    setCustomers(updated);
    localStorage.setItem('kulle_customers', JSON.stringify(updated));
  };

  // Custom router function that modifies window history state
  const handleSetView = (newView: 'customer' | 'admin') => {
    setView(newView);
    if (newView === 'customer') {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          if (window.location.pathname !== '/login') {
            window.history.pushState({}, '', '/login');
          }
        } else {
          if (window.location.pathname !== '/') {
            window.history.pushState({}, '', '/');
          }
        }
      }).catch(() => {
        if (window.location.pathname !== '/login') {
          window.history.pushState({}, '', '/login');
        }
      });
    }
  };

  // Sync back and forward browser buttons
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/login' || window.location.pathname === '/admin') {
        setView('admin');
      } else {
        setView('customer');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Dark mode visual state representation
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Business States (with local storage bindings)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [settings, setSettings] = useState<CafeSettings>(INITIAL_SETTINGS);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load state from Supabase or fallback to Local Storage / INITIAL_DATA
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const storedTheme = localStorage.getItem('kulle_dark_mode');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'true');
        }

        // --- 1. Load Settings ---
        let loadedSettings = INITIAL_SETTINGS;
        const storedSettings = localStorage.getItem('kulle_settings');
        const isSettingsDirty = localStorage.getItem('kulle_settings_dirty') === 'true';
        if (storedSettings) {
          try { loadedSettings = JSON.parse(storedSettings); } catch (err) {}
        }
        setSettings(loadedSettings);

        if (!isSettingsDirty) {
          try {
            const { data: dbSettings, error: errSettings } = await supabase
              .from('settings')
              .select('*')
              .maybeSingle();
            if (!errSettings && dbSettings) {
              setSettings(dbSettings);
            }
          } catch (e) {
            console.log('Tabel "settings" belum siap di Supabase, menggunakan data lokal.');
          }
        }

        // --- 2. Load Reviews ---
        let loadedReviews = INITIAL_REVIEWS;
        const storedReviews = localStorage.getItem('kulle_reviews');
        const isReviewsDirty = localStorage.getItem('kulle_reviews_dirty') === 'true';
        if (storedReviews) {
          try { loadedReviews = JSON.parse(storedReviews); } catch (err) {}
        }
        setReviews(loadedReviews);

        if (!isReviewsDirty) {
          try {
            const { data: dbReviews, error: errReviews } = await supabase
              .from('reviews')
              .select('*')
              .order('date', { ascending: false });
            if (!errReviews && dbReviews && dbReviews.length > 0) {
              setReviews(dbReviews);
            }
          } catch (e) {
            console.log('Tabel "reviews" belum siap di Supabase, menggunakan data lokal.');
          }
        }

        // --- 3. Load Menu Items ---
        let loadedMenu = INITIAL_MENU_ITEMS;
        const storedItems = localStorage.getItem('kulle_menu_items');
        const isMenuDirty = localStorage.getItem('kulle_menu_items_dirty') === 'true';
        if (storedItems) {
          try { loadedMenu = JSON.parse(storedItems); } catch (err) {}
        }
        setMenuItems(loadedMenu);

        if (!isMenuDirty) {
          try {
            const { data: dbMenu, error: errMenu } = await supabase
              .from('menu_items')
              .select('*');
            if (!errMenu && dbMenu && dbMenu.length > 0) {
              setMenuItems(dbMenu);
            }
          } catch (e) {
            console.log('Tabel "menu_items" belum siap di Supabase, menggunakan data lokal.');
          }
        }

        // --- 4. Load Gallery Photos ---
        let loadedGallery = INITIAL_GALLERY_PHOTOS;
        const storedGallery = localStorage.getItem('kulle_gallery_photos');
        const isGalleryDirty = localStorage.getItem('kulle_gallery_dirty') === 'true';
        if (storedGallery) {
          try { loadedGallery = JSON.parse(storedGallery); } catch (err) {}
        }
        setGalleryPhotos(loadedGallery);

        if (!isGalleryDirty) {
          try {
            const { data: dbGallery, error: errGallery } = await supabase
              .from('gallery_items')
              .select('*');
            if (!errGallery && dbGallery && dbGallery.length > 0) {
              setGalleryPhotos(dbGallery);
            }
          } catch (e) {
            console.log('Tabel "gallery_items" belum siap di Supabase, menggunakan data lokal.');
          }
        }

        // --- 5. Load Other local-only states ---
        const storedOrders = localStorage.getItem('kulle_orders');
        setOrders(storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS);

        const storedCustomers = localStorage.getItem('kulle_customers');
        setCustomers(storedCustomers ? JSON.parse(storedCustomers) : INITIAL_CUSTOMERS);

        const storedInventory = localStorage.getItem('kulle_inventory');
        setInventory(storedInventory ? JSON.parse(storedInventory) : INITIAL_INVENTORY);

        const storedEmployees = localStorage.getItem('kulle_employees');
        setEmployees(storedEmployees ? JSON.parse(storedEmployees) : INITIAL_EMPLOYEES);

        const storedPromos = localStorage.getItem('kulle_promotions');
        setPromotions(storedPromos ? JSON.parse(storedPromos) : INITIAL_PROMOTIONS);

      } catch (e) {
        console.error('Error loading bootstrap data:', e);
      }
    };

    loadAllData();
  }, []);

  // Update DOM hierarchy on theme change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kulle_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Synchronize favicon dynamically
  useEffect(() => {
    if (settings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.faviconUrl;
    }
  }, [settings.faviconUrl]);

  // Synchronize state helpers to local storage and sync to Supabase
  const handleUpdateMenu = async (updated: MenuItem[]) => {
    const deletedIds = menuItems.filter(item => !updated.some(u => u.id === item.id)).map(item => item.id);
    setMenuItems(updated);
    localStorage.setItem('kulle_menu_items', JSON.stringify(updated));
    try {
      let syncError = false;
      if (deletedIds.length > 0) {
        const { error } = await supabase.from('menu_items').delete().in('id', deletedIds);
        if (error) {
          console.error('Supabase delete error:', error);
          syncError = true;
        }
      }
      if (updated.length > 0) {
        const { error } = await supabase.from('menu_items').upsert(updated);
        if (error) {
          console.error('Supabase upsert error:', error);
          syncError = true;
        }
      }
      
      if (syncError) {
        localStorage.setItem('kulle_menu_items_dirty', 'true');
      } else {
        localStorage.removeItem('kulle_menu_items_dirty');
      }
    } catch (e) {
      console.log('Sinkronisasi menu ke Supabase ditunda (tabel belum terbentuk).');
      localStorage.setItem('kulle_menu_items_dirty', 'true');
    }
  };

  const handleUpdateOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('kulle_orders', JSON.stringify(updated));
  };

  const handleUpdateInventory = (updated: InventoryItem[]) => {
    setInventory(updated);
    localStorage.setItem('kulle_inventory', JSON.stringify(updated));
  };

  const handleUpdateEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    localStorage.setItem('kulle_employees', JSON.stringify(updated));
  };

  const handleUpdatePromotions = (updated: Promotion[]) => {
    setPromotions(updated);
    localStorage.setItem('kulle_promotions', JSON.stringify(updated));
  };

  const handleUpdateSettings = async (updated: CafeSettings) => {
    setSettings(updated);
    localStorage.setItem('kulle_settings', JSON.stringify(updated));
    try {
      const { error } = await supabase.from('settings').upsert({ id: 'current_settings', ...updated });
      if (error) {
        console.error('Supabase settings upsert error:', error);
        localStorage.setItem('kulle_settings_dirty', 'true');
      } else {
        localStorage.removeItem('kulle_settings_dirty');
      }
    } catch (e) {
      console.log('Sinkronisasi settings ke Supabase ditunda (tabel belum terbentuk).');
      localStorage.setItem('kulle_settings_dirty', 'true');
    }
  };

  const handleUpdateGallery = async (updated: GalleryItem[]) => {
    const deletedIds = galleryPhotos.filter(item => !updated.some(u => u.id === item.id)).map(item => item.id);
    setGalleryPhotos(updated);
    localStorage.setItem('kulle_gallery_photos', JSON.stringify(updated));
    try {
      let syncError = false;
      if (deletedIds.length > 0) {
        const { error } = await supabase.from('gallery_items').delete().in('id', deletedIds);
        if (error) {
          console.error('Supabase gallery delete error:', error);
          syncError = true;
        }
      }
      if (updated.length > 0) {
        const { error } = await supabase.from('gallery_items').upsert(updated);
        if (error) {
          console.error('Supabase gallery upsert error:', error);
          syncError = true;
        }
      }

      if (syncError) {
        localStorage.setItem('kulle_gallery_dirty', 'true');
      } else {
        localStorage.removeItem('kulle_gallery_dirty');
      }
    } catch (e) {
      console.log('Sinkronisasi galeri foto ke Supabase ditunda (tabel belum terbentuk).');
      localStorage.setItem('kulle_gallery_dirty', 'true');
    }
  };

  const handleUpdateReviews = async (updated: Review[]) => {
    const deletedIds = reviews.filter(item => !updated.some(u => u.id === item.id)).map(item => item.id);
    setReviews(updated);
    localStorage.setItem('kulle_reviews', JSON.stringify(updated));
    try {
      let syncError = false;
      if (deletedIds.length > 0) {
        const { error } = await supabase.from('reviews').delete().in('id', deletedIds);
        if (error) {
          console.error('Supabase reviews delete error:', error);
          syncError = true;
        }
      }
      if (updated.length > 0) {
        const { error } = await supabase.from('reviews').upsert(updated);
        if (error) {
          console.error('Supabase reviews upsert error:', error);
          syncError = true;
        }
      }

      if (syncError) {
        localStorage.setItem('kulle_reviews_dirty', 'true');
      } else {
        localStorage.removeItem('kulle_reviews_dirty');
      }
    } catch (e) {
      console.log('Sinkronisasi ulasan ke Supabase ditunda (tabel belum terbentuk).');
      localStorage.setItem('kulle_reviews_dirty', 'true');
    }
  };

  const handleDeleteSeededData = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data contoh? Ini akan mengosongkan semua menu, ulasan, pesanan, pelanggan, inventaris, promosi, dan galeri untuk memulai dari awal.")) {
      // Clear localStorage
      localStorage.setItem('kulle_menu_items', JSON.stringify([]));
      localStorage.setItem('kulle_orders', JSON.stringify([]));
      localStorage.setItem('kulle_customers', JSON.stringify([]));
      localStorage.setItem('kulle_inventory', JSON.stringify([]));
      localStorage.setItem('kulle_employees', JSON.stringify([]));
      localStorage.setItem('kulle_promotions', JSON.stringify([]));
      localStorage.setItem('kulle_gallery_photos', JSON.stringify([]));
      localStorage.setItem('kulle_reviews', JSON.stringify([]));
      
      // Reset local states
      setMenuItems([]);
      setOrders([]);
      setCustomers([]);
      setInventory([]);
      setEmployees([]);
      setPromotions([]);
      setGalleryPhotos([]);
      setReviews([]);

      // Clear Supabase tables if connected
      try {
        let dbCleanFailed = false;
        const { error: errMenu } = await supabase.from('menu_items').delete().neq('id', 'dummy_id_never_exists');
        if (errMenu) dbCleanFailed = true;
        const { error: errGallery } = await supabase.from('gallery_items').delete().neq('id', 'dummy_id_never_exists');
        if (errGallery) dbCleanFailed = true;
        const { error: errReviews } = await supabase.from('reviews').delete().neq('id', 'dummy_id_never_exists');
        if (errReviews) dbCleanFailed = true;

        if (dbCleanFailed) {
          localStorage.setItem('kulle_menu_items_dirty', 'true');
          localStorage.setItem('kulle_gallery_dirty', 'true');
          localStorage.setItem('kulle_reviews_dirty', 'true');
        } else {
          localStorage.removeItem('kulle_menu_items_dirty');
          localStorage.removeItem('kulle_gallery_dirty');
          localStorage.removeItem('kulle_reviews_dirty');
        }
      } catch (e) {
        console.log('Error deleting Supabase seeded data:', e);
        localStorage.setItem('kulle_menu_items_dirty', 'true');
        localStorage.setItem('kulle_gallery_dirty', 'true');
        localStorage.setItem('kulle_reviews_dirty', 'true');
      }
      
      alert("Semua data contoh berhasil dihapus. Kafe Anda sekarang kosong dan siap diisi!");
    }
  };

  // Live order checkout pipeline simulation (online ordering integration)
  const handlePlaceOrder = (newOrderInfo: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const orderDate = new Date().toISOString();
    
    const newCompleteOrder: Order = {
      ...newOrderInfo,
      id: orderId,
      status: 'pending',
      createdAt: orderDate
    };

    // 1. Log the active order
    const nextOrders = [newCompleteOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('kulle_orders', JSON.stringify(nextOrders));

    // 2. Adjust Menu Item level stock counts automatically
    const updatedMenu = menuItems.map((item) => {
      const purchasedInOrder = newOrderInfo.items.find(oi => oi.menuItem.id === item.id);
      if (purchasedInOrder) {
        const remainingStock = Math.max(0, item.stock - purchasedInOrder.quantity);
        return {
          ...item,
          stock: remainingStock,
          isAvailable: remainingStock > 0
        };
      }
      return item;
    });
    setMenuItems(updatedMenu);
    localStorage.setItem('kulle_menu_items', JSON.stringify(updatedMenu));

    // 3. Update customer profiles or create a new guest catalog entry
    const existingCustIdx = customers.findIndex(c => c.phone === newOrderInfo.customerPhone);
    let nextCustomers = [...customers];

    if (existingCustIdx > -1) {
      // Update
      const existing = nextCustomers[existingCustIdx];
      nextCustomers[existingCustIdx] = {
        ...existing,
        totalOrders: existing.totalOrders + 1,
        totalSpent: existing.totalSpent + newOrderInfo.total,
        lastOrder: new Date().toISOString().split('T')[0]
      };
    } else {
      // Create new Customer
      const newCust: Customer = {
        id: 'c_' + Date.now(),
        name: newOrderInfo.customerName,
        email: newOrderInfo.customerEmail,
        phone: newOrderInfo.customerPhone,
        totalOrders: 1,
        totalSpent: newOrderInfo.total,
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="%25230F52BA"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="32" fill="%2523FFF" text-anchor="middle">C</text></svg>',
        lastOrder: new Date().toISOString().split('T')[0]
      };
      nextCustomers = [newCust, ...nextCustomers];
    }
    setCustomers(nextCustomers);
    localStorage.setItem('kulle_customers', JSON.stringify(nextCustomers));

    // 4. Update core raw inventory ingredient stock levels as a gourmet simulation
    // For example: ordering coffee decreases Arabica Beans and Fresh Milk raw stock levels slightly
    const coffeeItemsCount = newOrderInfo.items.filter(oi => oi.menuItem.category.includes('coffee')).reduce((acc, current) => acc + current.quantity, 0);
    if (coffeeItemsCount > 0) {
      const updatedInv = inventory.map((invItem) => {
        if (invItem.name.includes('Arabica')) {
          return { ...invItem, stock: Math.max(0, invItem.stock - (0.015 * coffeeItemsCount)) }; // 15g per shot
        }
        if (invItem.name.includes('Milk')) {
          return { ...invItem, stock: Math.max(0, invItem.stock - (0.2 * coffeeItemsCount)) }; // 200ml per cup
        }
        return invItem;
      });
      setInventory(updatedInv);
      localStorage.setItem('kulle_inventory', JSON.stringify(updatedInv));
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#060D1E]' : 'bg-slate-50'}`}>
      {view === 'customer' ? (
        <LandingPage 
          menuItems={menuItems}
          promotions={promotions}
          settings={settings}
          galleryPhotos={galleryPhotos}
          reviews={reviews}
          onPlaceOrder={handlePlaceOrder}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          setView={handleSetView}
        />
      ) : (
        <AdminDashboard 
          menuItems={menuItems}
          orders={orders}
          customers={customers}
          inventory={inventory}
          employees={employees}
          promotions={promotions}
          settings={settings}
          galleryPhotos={galleryPhotos}
          reviews={reviews}
          onUpdateMenu={handleUpdateMenu}
          onUpdateOrders={handleUpdateOrders}
          onUpdateCustomers={handleUpdateCustomers}
          onUpdateInventory={handleUpdateInventory}
          onUpdateEmployees={handleUpdateEmployees}
          onUpdatePromotions={handleUpdatePromotions}
          onUpdateSettings={handleUpdateSettings}
          onUpdateGallery={handleUpdateGallery}
          onUpdateReviews={handleUpdateReviews}
          onDeleteSeededData={handleDeleteSeededData}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          setView={handleSetView}
        />
      )}
    </div>
  );
}
