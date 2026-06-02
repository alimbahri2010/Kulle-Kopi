/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MenuItem, Order, Customer, InventoryItem, Employee, Promotion, CafeSettings, OrderItem, GalleryItem } from './types';
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

export default function App() {
  // Portal View Router State ('customer' | 'admin')
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  
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

  // Load state from local storage on bootstrap
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('kulle_dark_mode');
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === 'true');
      }

      const storedItems = localStorage.getItem('kulle_menu_items');
      setMenuItems(storedItems ? JSON.parse(storedItems) : INITIAL_MENU_ITEMS);

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

      const storedSettings = localStorage.getItem('kulle_settings');
      setSettings(storedSettings ? JSON.parse(storedSettings) : INITIAL_SETTINGS);

      const storedGallery = localStorage.getItem('kulle_gallery_photos');
      setGalleryPhotos(storedGallery ? JSON.parse(storedGallery) : INITIAL_GALLERY_PHOTOS);
    } catch (e) {
      console.error('Error loading data from storage:', e);
      // Fallback to static
      setMenuItems(INITIAL_MENU_ITEMS);
      setOrders(INITIAL_ORDERS);
      setCustomers(INITIAL_CUSTOMERS);
      setInventory(INITIAL_INVENTORY);
      setEmployees(INITIAL_EMPLOYEES);
      setPromotions(INITIAL_PROMOTIONS);
      setSettings(INITIAL_SETTINGS);
      setGalleryPhotos(INITIAL_GALLERY_PHOTOS);
    }
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

  // Synchronize state helpers to local storage
  const handleUpdateMenu = (updated: MenuItem[]) => {
    setMenuItems(updated);
    localStorage.setItem('kulle_menu_items', JSON.stringify(updated));
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

  const handleUpdateSettings = (updated: CafeSettings) => {
    setSettings(updated);
    localStorage.setItem('kulle_settings', JSON.stringify(updated));
  };

  const handleUpdateGallery = (updated: GalleryItem[]) => {
    setGalleryPhotos(updated);
    localStorage.setItem('kulle_gallery_photos', JSON.stringify(updated));
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
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
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
          reviews={INITIAL_REVIEWS}
          onPlaceOrder={handlePlaceOrder}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          setView={setView}
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
          onUpdateMenu={handleUpdateMenu}
          onUpdateOrders={handleUpdateOrders}
          onUpdateInventory={handleUpdateInventory}
          onUpdateEmployees={handleUpdateEmployees}
          onUpdatePromotions={handleUpdatePromotions}
          onUpdateSettings={handleUpdateSettings}
          onUpdateGallery={handleUpdateGallery}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          setView={setView}
        />
      )}
    </div>
  );
}
