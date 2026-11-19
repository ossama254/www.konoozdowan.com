import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  HERO_BANNERS,
  INITIAL_ABOUT_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_CURRENCIES,
  INITIAL_DOMESTIC_ZONES,
  INITIAL_HOME_SETTINGS,
  INITIAL_LOYALTY_SETTINGS,
  INITIAL_LOYALTY_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OFFERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_PROMO_CODES,
  INTERNATIONAL_COUNTRIES,
  LOYALTY_REWARDS,
} from '../data/mockCatalog';
import {
  AboutContactSettings,
  AboutPillar,
  AppView,
  AuthProvidersAvailability,
  AuthStatus,
  CartItem,
  CategoryId,
  ContactMessage,
  CurrencyCode,
  CurrencyConfig,
  CustomerProfile,
  DeliveryAddress,
  DomesticDeliveryZone,
  DomesticShippingZone,
  HeroBanner,
  HomePageSettings,
  InternationalCountryId,
  InternationalCountryOption,
  Language,
  LocalizedText,
  LoyaltyProgramSettings,
  LoyaltyReward,
  LoyaltyTier,
  LoyaltyTierConfig,
  LoyaltyTransaction,
  NotificationTopic,
  Order,
  OrderStatus,
  PaymentDetails,
  PaymentMethod,
  Product,
  PromoCode,
  PushNotificationItem,
  PushPreferences,
  RedeemedVoucher,
  ShippingScope,
  SpecialOffer,
  StoreCategory,
  ThemeMode,
  WeightOption,
} from '../types/store';
import {
  BrowserPermissionState,
  dispatchNativePushNotification,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
} from '../utils/pushNotifications';

interface StoreContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (text: LocalizedText) => string;

  theme: ThemeMode;
  themeByLang: Record<Language, ThemeMode>;
  setTheme: (mode: ThemeMode) => void;
  setThemeForLang: (targetLang: Language, mode: ThemeMode) => void;
  toggleTheme: () => void;

  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencies: CurrencyConfig[];
  currencyConfig: CurrencyConfig;
  currencySymbol: string;
  convertPrice: (yerAmount: number) => number;
  formatPrice: (yerAmount: number) => string;
  addCurrency: (cfg: Omit<CurrencyConfig, 'rateFromYer'>) => void;
  updateCurrency: (code: CurrencyCode, partial: Partial<Omit<CurrencyConfig, 'code' | 'rateFromYer'>>) => void;
  deleteCurrency: (code: CurrencyCode) => void;
  resetCurrencies: () => void;

  view: AppView;
  setView: (view: AppView) => void;
  profileTab: 'loyalty' | 'orders' | 'wishlist' | 'settings';
  setProfileTab: (tab: 'loyalty' | 'orders' | 'wishlist' | 'settings') => void;
  categories: StoreCategory[];
  addCategory: (cat: StoreCategory) => void;
  updateCategory: (id: string, label: LocalizedText) => void;
  deleteCategory: (id: string) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  authStatus: AuthStatus;
  currentCustomer: CustomerProfile | null;
  authProviders: AuthProvidersAvailability;
  continueAsGuest: () => Promise<void>;
  loginWithPhone: (
    phone: string,
    name?: string
  ) => Promise<{ ok: boolean; message?: string }>;
  logoutCustomer: () => Promise<void>;

  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, partial: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addProductWeight: (productId: string, weight: WeightOption) => void;
  updateProductWeight: (productId: string, weightId: string, price: number, stock: number, label?: LocalizedText) => void;
  deleteProductWeight: (productId: string, weightId: string) => void;
  updateProductImages: (productId: string, images: string[]) => void;
  resetProductImages: (productId: string) => void;
  addProductReview: (productId: string, author: string, rating: number, commentText: string) => void;

  cart: CartItem[];
  addToCart: (product: Product, weightId: string, quantity?: number) => void;
  updateCartQuantity: (cartKey: string, delta: number) => void;
  removeFromCart: (cartKey: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  promoCodes: PromoCode[];
  createPromoCode: (promo: PromoCode) => void;
  deletePromoCode: (code: string) => void;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { ok: boolean; message: LocalizedText };
  removePromoCode: () => void;

  offers: SpecialOffer[];
  createOffer: (offer: SpecialOffer) => void;
  updateOffer: (offerId: string, partial: Partial<SpecialOffer>) => void;
  deleteOffer: (offerId: string) => void;
  toggleOfferActive: (offerId: string) => void;
  claimOffer: (offer: SpecialOffer) => void;

  loyaltySettings: LoyaltyProgramSettings;
  updateLoyaltySettings: (partial: Partial<LoyaltyProgramSettings>) => void;
  updateLoyaltyTier: (
    tierId: LoyaltyTier,
    partial: Partial<Omit<LoyaltyTierConfig, 'id'>>
  ) => void;
  resetLoyaltySettings: () => void;
  loyaltyRewards: LoyaltyReward[];
  addLoyaltyReward: (reward: LoyaltyReward) => void;
  updateLoyaltyReward: (rewardId: string, partial: Partial<LoyaltyReward>) => void;
  deleteLoyaltyReward: (rewardId: string) => void;
  resetLoyaltyRewards: () => void;
  loyaltyPoints: number;
  lifetimePoints: number;
  adjustLoyaltyPoints: (delta: number, reason: LocalizedText, affectLifetime?: boolean) => void;
  setCustomerPointsBalances: (available: number, lifetime: number) => void;
  loyaltyTier: LoyaltyTier;
  tierMultiplier: number;
  nextTierThreshold: number;
  loyaltyTransactions: LoyaltyTransaction[];
  redeemedVouchers: RedeemedVoucher[];
  appliedVoucher: RedeemedVoucher | null;
  applyVoucher: (voucher: RedeemedVoucher | null) => void;
  redeemReward: (reward: LoyaltyReward) => { ok: boolean; message: LocalizedText };

  subtotal: number;
  discountAmount: number;
  shippingScope: ShippingScope;
  setShippingScope: (scope: ShippingScope) => void;
  domesticZones: DomesticShippingZone[];
  addDomesticZone: (zone: DomesticShippingZone) => void;
  updateDomesticZone: (id: string, partial: Partial<Omit<DomesticShippingZone, 'id'>>) => void;
  deleteDomesticZone: (id: string) => void;
  matchDomesticZoneByLocation: (
    lat?: number,
    lng?: number,
    locationText?: string
  ) => { zone: DomesticShippingZone; matchedBy: 'geo' | 'keyword'; distanceKm?: number } | null;
  domesticZone: DomesticDeliveryZone;
  setDomesticZone: (zone: DomesticDeliveryZone) => void;
  insideSanaaFee: number;
  outsideSanaaFee: number;
  internationalCountries: InternationalCountryOption[];
  addInternationalCountry: (country: InternationalCountryOption) => void;
  updateInternationalCountry: (id: string, partial: Partial<Omit<InternationalCountryOption, 'id'>>) => void;
  deleteInternationalCountry: (id: string) => void;
  internationalCountry: InternationalCountryId;
  setInternationalCountry: (country: InternationalCountryId) => void;
  customCountryName: string;
  setCustomCountryName: (name: string) => void;
  shippingFee: number;
  total: number;
  estimatedPointsEarned: number;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (threshold: number) => void;

  orders: Order[];
  placeOrder: (
    address: DeliveryAddress,
    paymentMethod: PaymentMethod,
    paymentDetails?: PaymentDetails
  ) => Order;
  advanceOrderStatus: (orderId: string) => void;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorderOrder: (order: Order) => void;

  notifications: PushNotificationItem[];
  unreadNotificationCount: number;
  activePushPopup: PushNotificationItem | null;
  dismissPushPopup: () => void;
  pushPreferences: PushPreferences;
  updatePushPreferences: (partial: Partial<PushPreferences>) => void;
  notificationPermission: BrowserPermissionState;
  requestPushPermission: () => Promise<BrowserPermissionState>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendPushNotification: (
    title: LocalizedText,
    body: LocalizedText,
    segment: PushNotificationItem['targetSegment'],
    options?: {
      category?: NotificationTopic;
      targetView?: AppView;
      productId?: string;
    }
  ) => void;

  heroBanners: HeroBanner[];
  addHeroBanner: (banner: HeroBanner) => void;
  updateHeroBanner: (id: string, partial: Partial<HeroBanner>) => void;
  deleteHeroBanner: (id: string) => void;
  moveHeroBanner: (id: string, direction: 'up' | 'down') => void;
  resetHeroBanners: () => void;
  homeSettings: HomePageSettings;
  updateHomeSettings: (partial: Partial<HomePageSettings>) => void;
  resetHomeSettings: () => void;

  aboutSettings: AboutContactSettings;
  updateAboutSettings: (partial: Partial<AboutContactSettings>) => void;
  addAboutPillar: (pillar: AboutPillar) => void;
  updateAboutPillar: (id: string, partial: Partial<AboutPillar>) => void;
  deleteAboutPillar: (id: string) => void;
  resetAboutSettings: () => void;

  contactMessages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markContactMessageRead: (id: string) => void;
  deleteContactMessage: (id: string) => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const DEFAULT_FREE_SHIPPING_THRESHOLD = 70000;

export function getTierInfo(
  lifetimePoints: number,
  tiers: LoyaltyTierConfig[] = INITIAL_LOYALTY_SETTINGS.tiers
): {
  tier: LoyaltyTier;
  multiplier: number;
  nextThreshold: number;
} {
  const sorted = [...tiers].sort((a, b) => a.minPoints - b.minPoints);
  let active = sorted[0] ?? { id: 'bronze' as LoyaltyTier, minPoints: 0, multiplier: 1 };
  let nextThreshold = sorted[sorted.length - 1]?.minPoints ?? 3000;

  for (let i = 0; i < sorted.length; i++) {
    if (lifetimePoints >= sorted[i].minPoints) {
      active = sorted[i];
      nextThreshold = sorted[i + 1]?.minPoints ?? sorted[i].minPoints;
    }
  }

  return {
    tier: active.id,
    multiplier: active.multiplier,
    nextThreshold,
  };
}

const WISHLIST_STORAGE_KEY = 'kunooz_doan_wishlist_v1';
const REVIEWS_STORAGE_KEY = 'kunooz_doan_reviews_v1';
const IMAGES_STORAGE_KEY = 'kunooz_doan_product_images_v1';
const ORDERS_STORAGE_KEY = 'kunooz_doan_orders_v1';
const OFFERS_STORAGE_KEY = 'kunooz_doan_offers_v1';
const CURRENCY_STORAGE_KEY = 'kunooz_doan_currency_v1';
const CURRENCIES_LIST_STORAGE_KEY = 'kunooz_doan_currencies_v1';
const CATEGORIES_STORAGE_KEY = 'kunooz_doan_categories_v1';
const PRODUCTS_STORAGE_KEY = 'kunooz_doan_products_v2';
const DOMESTIC_ZONES_STORAGE_KEY = 'kunooz_doan_domestic_zones_v1';
const INTL_COUNTRIES_STORAGE_KEY = 'kunooz_doan_intl_countries_v1';
const FREE_SHIPPING_STORAGE_KEY = 'kunooz_doan_free_shipping_v1';
const NOTIFICATIONS_STORAGE_KEY = 'kunooz_doan_notifications_v1';
const PUSH_PREFS_STORAGE_KEY = 'kunooz_doan_push_prefs_v1';
const LOYALTY_SETTINGS_STORAGE_KEY = 'kunooz_doan_loyalty_settings_v1';
const LOYALTY_REWARDS_STORAGE_KEY = 'kunooz_doan_loyalty_rewards_v1';
const LOYALTY_POINTS_STORAGE_KEY = 'kunooz_doan_loyalty_points_v1';
const LOYALTY_LIFETIME_STORAGE_KEY = 'kunooz_doan_loyalty_lifetime_v1';
const LOYALTY_TX_STORAGE_KEY = 'kunooz_doan_loyalty_tx_v1';
const LOYALTY_VOUCHERS_STORAGE_KEY = 'kunooz_doan_loyalty_vouchers_v1';
const HERO_BANNERS_STORAGE_KEY = 'kunooz_doan_hero_banners_v1';
const HOME_SETTINGS_STORAGE_KEY = 'kunooz_doan_home_settings_v1';
const ABOUT_SETTINGS_STORAGE_KEY = 'kunooz_doan_about_settings_v1';
const CONTACT_MESSAGES_STORAGE_KEY = 'kunooz_doan_contact_messages_v1';
const LANG_STORAGE_KEY = 'kunooz_doan_lang_v1';
const THEME_BY_LANG_STORAGE_KEY = 'kunooz_doan_theme_by_lang_v1';

const DEFAULT_PUSH_PREFERENCES: PushPreferences = {
  enabled: true,
  newHoney: true,
  seasonalDiscounts: true,
  loyaltyAlerts: true,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {
      // Ignore storage read error
    }
    return 'ar';
  });
  const [themeByLang, setThemeByLang] = useState<Record<Language, ThemeMode>>(() => {
    try {
      const saved = window.localStorage.getItem(THEME_BY_LANG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Record<Language, ThemeMode>>;
        return {
          ar: parsed.ar === 'dark' ? 'dark' : 'light',
          en: parsed.en === 'dark' ? 'dark' : 'light',
        };
      }
    } catch {
      // Ignore storage read error
    }
    return { ar: 'light', en: 'light' };
  });
  const theme: ThemeMode = themeByLang[lang];
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>(() => {
    try {
      const saved = window.localStorage.getItem(CURRENCIES_LIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_CURRENCIES;
  });
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && saved.trim()) {
        return saved;
      }
    } catch {
      // Ignore storage read error
    }
    return 'YER';
  });
  const [categories, setCategories] = useState<StoreCategory[]>(() => {
    try {
      const saved = window.localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_CATEGORIES;
  });
  const [view, setView] = useState<AppView>('home');
  const [profileTab, setProfileTab] = useState<'loyalty' | 'orders' | 'wishlist' | 'settings'>('loyalty');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('guest');
  const [currentCustomer, setCurrentCustomer] = useState<CustomerProfile | null>(null);
  const [authProviders, setAuthProviders] = useState<AuthProvidersAvailability>({
    guestAvailable: true,
    phoneAvailable: true,
  });
  const [shippingScope, setShippingScope] = useState<ShippingScope>('domestic');
  const [domesticZones, setDomesticZones] = useState<DomesticShippingZone[]>(() => {
    try {
      const saved = window.localStorage.getItem(DOMESTIC_ZONES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((z: DomesticShippingZone) => ({
            ...z,
            group:
              z.group ??
              (z.id.includes('outside') ? 'outside_sanaa' : 'inside_sanaa'),
            active: z.active ?? true,
          }));
        }
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_DOMESTIC_ZONES;
  });
  const [domesticZone, setDomesticZone] = useState<DomesticDeliveryZone>('inside_sanaa');
  const [freeShippingThreshold, setFreeShippingThresholdState] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem(FREE_SHIPPING_STORAGE_KEY);
      if (saved) {
        const num = Number(saved);
        if (!Number.isNaN(num) && num >= 0) return num;
      }
    } catch {
      // Ignore storage read error
    }
    return DEFAULT_FREE_SHIPPING_THRESHOLD;
  });
  const [internationalCountries, setInternationalCountries] = useState<InternationalCountryOption[]>(
    () => {
      try {
        const saved = window.localStorage.getItem(INTL_COUNTRIES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Ignore storage read error
      }
      return INTERNATIONAL_COUNTRIES;
    }
  );
  const [internationalCountry, setInternationalCountry] =
    useState<InternationalCountryId>('saudi_arabia');
  const [customCountryName, setCustomCountryName] = useState('');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }

      const rawReviews = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
      const rawImages = window.localStorage.getItem(IMAGES_STORAGE_KEY);
      const storedReviews = rawReviews
        ? (JSON.parse(rawReviews) as Record<string, Product['reviews']>)
        : {};
      const storedImages = rawImages
        ? (JSON.parse(rawImages) as Record<string, string[]>)
        : {};

      return INITIAL_PRODUCTS.map((p) => {
        let next = p;
        const customImgs = storedImages[p.id];
        if (Array.isArray(customImgs) && customImgs.length > 0) {
          next = { ...next, images: customImgs };
        }
        const extra = storedReviews[p.id];
        if (Array.isArray(extra) && extra.length > 0) {
          const totalCount = next.reviewCount + extra.length;
          const extraSum = extra.reduce((s, r) => s + r.rating, 0);
          const avg = Number(((next.rating * next.reviewCount + extraSum) / totalCount).toFixed(1));
          next = {
            ...next,
            reviews: [...extra, ...next.reviews],
            reviewCount: totalCount,
            rating: avg,
          };
        }
        return next;
      });
    } catch {
      // Ignore storage read error
    }
    return INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartKey: 'prod-sidr-royal_w-250',
      productId: 'prod-sidr-royal',
      weightId: 'w-250',
      name: INITIAL_PRODUCTS[0].name,
      weightLabel: INITIAL_PRODUCTS[0].weightOptions[0].label,
      image: INITIAL_PRODUCTS[0].images[0],
      unitPrice: INITIAL_PRODUCTS[0].weightOptions[0].price,
      quantity: 1,
    },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return ['prod-sidr-royal', 'prod-razqi-raisins'];
  });
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [offers, setOffers] = useState<SpecialOffer[]>(() => {
    try {
      const saved = window.localStorage.getItem(OFFERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_OFFERS;
  });

  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltyProgramSettings>(() => {
    try {
      const saved = window.localStorage.getItem(LOYALTY_SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.tiers) && parsed.tiers.length > 0) {
      return { ...INITIAL_LOYALTY_SETTINGS, ...parsed };
        }
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_LOYALTY_SETTINGS;
  });

  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(() => {
    try {
      const saved = window.localStorage.getItem(HERO_BANNERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return HERO_BANNERS;
  });

  const [homeSettings, setHomeSettings] = useState<HomePageSettings>(() => {
    try {
      const saved = window.localStorage.getItem(HOME_SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_HOME_SETTINGS, ...parsed };
        }
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_HOME_SETTINGS;
  });

  const [aboutSettings, setAboutSettings] = useState<AboutContactSettings>(() => {
    try {
      const saved = window.localStorage.getItem(ABOUT_SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_ABOUT_SETTINGS,
            ...parsed,
            pillars: Array.isArray(parsed.pillars) ? parsed.pillars : INITIAL_ABOUT_SETTINGS.pillars,
          };
        }
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_ABOUT_SETTINGS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = window.localStorage.getItem(CONTACT_MESSAGES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return [];
  });

  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(() => {
    try {
      const saved = window.localStorage.getItem(LOYALTY_REWARDS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return LOYALTY_REWARDS;
  });

  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem(LOYALTY_POINTS_STORAGE_KEY);
      if (saved !== null) {
        const num = Number(saved);
        if (!Number.isNaN(num) && num >= 0) return num;
      }
    } catch {
      // Ignore storage read error
    }
    return 625;
  });

  const [lifetimePoints, setLifetimePoints] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem(LOYALTY_LIFETIME_STORAGE_KEY);
      if (saved !== null) {
        const num = Number(saved);
        if (!Number.isNaN(num) && num >= 0) return num;
      }
    } catch {
      // Ignore storage read error
    }
    return 625;
  });

  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(() => {
    try {
      const saved = window.localStorage.getItem(LOYALTY_TX_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_LOYALTY_TRANSACTIONS;
  });

  const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[]>(() => {
    try {
      const saved = window.localStorage.getItem(LOYALTY_VOUCHERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return [];
  });
  const [appliedVoucher, setAppliedVoucher] = useState<RedeemedVoucher | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_ORDERS;
  });
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_NOTIFICATIONS;
  });
  const [pushPreferences, setPushPreferences] = useState<PushPreferences>(() => {
    try {
      const saved = window.localStorage.getItem(PUSH_PREFS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PUSH_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage read error
    }
    return DEFAULT_PUSH_PREFERENCES;
  });
  const [notificationPermission, setNotificationPermission] = useState<BrowserPermissionState>(() =>
    getBrowserNotificationPermission()
  );
  const [activePushPopup, setActivePushPopup] = useState<PushNotificationItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage write error
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
    } catch {
      // Ignore storage write error
    }
  }, [offers]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage write error
    }
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#12100E' : '#D97706');
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_BY_LANG_STORAGE_KEY, JSON.stringify(themeByLang));
    } catch {
      // Ignore storage write error
    }
  }, [themeByLang]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore storage write error
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch {
      // Ignore storage write error
    }
  }, [currency]);

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Ignore storage write error
    }
  }, [notifications]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PUSH_PREFS_STORAGE_KEY, JSON.stringify(pushPreferences));
    } catch {
      // Ignore storage write error
    }
  }, [pushPreferences]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CURRENCIES_LIST_STORAGE_KEY, JSON.stringify(currencies));
    } catch {
      // Ignore storage write error
    }
  }, [currencies]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // Ignore storage write error
    }
  }, [categories]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore storage write error
    }
  }, [products]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DOMESTIC_ZONES_STORAGE_KEY, JSON.stringify(domesticZones));
    } catch {
      // Ignore storage write error
    }
  }, [domesticZones]);

  useEffect(() => {
    try {
      window.localStorage.setItem(INTL_COUNTRIES_STORAGE_KEY, JSON.stringify(internationalCountries));
    } catch {
      // Ignore storage write error
    }
  }, [internationalCountries]);

  useEffect(() => {
    try {
      window.localStorage.setItem(FREE_SHIPPING_STORAGE_KEY, String(freeShippingThreshold));
    } catch {
      // Ignore storage write error
    }
  }, [freeShippingThreshold]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOYALTY_SETTINGS_STORAGE_KEY, JSON.stringify(loyaltySettings));
    } catch {
      // Ignore storage write error
    }
  }, [loyaltySettings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOYALTY_REWARDS_STORAGE_KEY, JSON.stringify(loyaltyRewards));
    } catch {
      // Ignore storage write error
    }
  }, [loyaltyRewards]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOYALTY_POINTS_STORAGE_KEY, String(loyaltyPoints));
    } catch {
      // Ignore storage write error
    }
  }, [loyaltyPoints]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOYALTY_LIFETIME_STORAGE_KEY, String(lifetimePoints));
    } catch {
      // Ignore storage write error
    }
  }, [lifetimePoints]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOYALTY_TX_STORAGE_KEY, JSON.stringify(loyaltyTransactions));
    } catch {
      // Ignore storage write error
    }
  }, [loyaltyTransactions]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOYALTY_VOUCHERS_STORAGE_KEY, JSON.stringify(redeemedVouchers));
    } catch {
      // Ignore storage write error
    }
  }, [redeemedVouchers]);

  useEffect(() => {
    try {
      window.localStorage.setItem(HERO_BANNERS_STORAGE_KEY, JSON.stringify(heroBanners));
    } catch {
      // Ignore storage write error
    }
  }, [heroBanners]);

  useEffect(() => {
    try {
      window.localStorage.setItem(HOME_SETTINGS_STORAGE_KEY, JSON.stringify(homeSettings));
    } catch {
      // Ignore storage write error
    }
  }, [homeSettings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ABOUT_SETTINGS_STORAGE_KEY, JSON.stringify(aboutSettings));
    } catch {
      // Ignore storage write error
    }
  }, [aboutSettings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CONTACT_MESSAGES_STORAGE_KEY, JSON.stringify(contactMessages));
    } catch {
      // Ignore storage write error
    }
  }, [contactMessages]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const refreshAuthSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) return;
      const data = (await res.json()) as {
        authStatus?: AuthStatus;
        customer?: CustomerProfile | null;
      };
      setAuthStatus(data.authStatus === 'customer' && data.customer ? 'customer' : 'guest');
      setCurrentCustomer(data.customer ?? null);
    } catch {
      // Offline / network fallback keeps guest mode
    }
  }, []);

  useEffect(() => {
    void refreshAuthSession();
    void (async () => {
      try {
        const res = await fetch('/api/auth/providers', { credentials: 'include' });
        if (res.ok) {
          const data = (await res.json()) as AuthProvidersAvailability;
          setAuthProviders(data);
        }
      } catch {
        // Ignore offline
      }
    })();

    void (async () => {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) return;
        const data = (await res.json()) as {
          reviews?: Array<{
            id: string;
            productId: string;
            author: string;
            rating: number;
            date: string;
            comment: LocalizedText;
            verifiedPurchase: boolean;
          }>;
        };
        if (!Array.isArray(data.reviews) || data.reviews.length === 0) return;
        const byProd: Record<string, Product['reviews']> = {};
        for (const rev of data.reviews) {
          if (!byProd[rev.productId]) byProd[rev.productId] = [];
          byProd[rev.productId].push({
            id: rev.id,
            author: rev.author,
            rating: rev.rating,
            date: rev.date,
            comment: rev.comment,
            verifiedPurchase: rev.verifiedPurchase,
          });
        }
        setProducts((prev) =>
          prev.map((p) => {
            const serverRevs = byProd[p.id];
            if (!serverRevs || serverRevs.length === 0) return p;
            const existingIds = new Set(p.reviews.map((r) => r.id));
            const uniqueNew = serverRevs.filter((r) => !existingIds.has(r.id));
            if (uniqueNew.length === 0) return p;
            const merged = [...uniqueNew, ...p.reviews];
            const totalCount = p.reviewCount + uniqueNew.length;
            const extraSum = uniqueNew.reduce((s, r) => s + r.rating, 0);
            const avg = Number(((p.rating * p.reviewCount + extraSum) / totalCount).toFixed(1));
            return { ...p, reviews: merged, reviewCount: totalCount, rating: avg };
          })
        );
      } catch {
        // Ignore offline
      }
    })();
  }, [refreshAuthSession]);

  const continueAsGuest = useCallback(async () => {
    try {
      await fetch('/api/auth/guest', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore offline
    }
    setAuthStatus('guest');
    setCurrentCustomer(null);
    setIsAuthModalOpen(false);
    showToast(lang === 'ar' ? 'تتصفح المتجر الآن كزائر فقط' : 'Continuing as Guest only');
  }, [lang, showToast]);

  const loginWithPhone = useCallback(
    async (phone: string, name?: string): Promise<{ ok: boolean; message?: string }> => {
      try {
        const res = await fetch('/api/auth/phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ phone, name }),
        });
        const data = (await res.json()) as {
          authStatus?: AuthStatus;
          customer?: CustomerProfile;
          messageAr?: string;
          messageEn?: string;
        };
        if (!res.ok || !data.customer) {
          return {
            ok: false,
            message: lang === 'ar' ? data.messageAr : data.messageEn,
          };
        }
        setAuthStatus('customer');
        setCurrentCustomer(data.customer);
        setIsAuthModalOpen(false);
        showToast(
          lang === 'ar'
            ? `أهلاً بك ${data.customer.displayName}، تم تسجيل الدخول برقم الهاتف`
            : `Welcome ${data.customer.displayName}, signed in via Phone`
        );
        return { ok: true };
      } catch {
        return {
          ok: false,
          message:
            lang === 'ar'
              ? 'تعذر الاتصال بالخادم لتسجيل الدخول.'
              : 'Network error while signing in.',
        };
      }
    },
    [lang, showToast]
  );

  const logoutCustomer = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore offline
    }
    setAuthStatus('guest');
    setCurrentCustomer(null);
    showToast(lang === 'ar' ? 'تم تسجيل الخروج والعودة لوضع الزائر' : 'Signed out to Guest mode');
  }, [lang, showToast]);

  const t = useCallback((text: LocalizedText) => text[lang], [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const setThemeForLang = useCallback(
    (targetLang: Language, mode: ThemeMode) => {
      setThemeByLang((prev) => ({ ...prev, [targetLang]: mode }));
      const langName = targetLang === 'ar' ? (lang === 'ar' ? 'العربية' : 'Arabic') : lang === 'ar' ? 'الإنجليزية' : 'English';
      showToast(
        lang === 'ar'
          ? `تم ضبط مظهر اللغة ${langName} على: ${mode === 'dark' ? 'الوضع الداكن' : 'الوضع الفاتح'}`
          : `${langName} theme set to ${mode === 'dark' ? 'Dark Mode' : 'Light Mode'}`
      );
    },
    [lang, showToast]
  );

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeForLang(lang, mode);
    },
    [lang, setThemeForLang]
  );

  const toggleTheme = useCallback(() => {
    const nextMode: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setThemeForLang(lang, nextMode);
  }, [lang, setThemeForLang, theme]);

  const currencyConfig = useMemo(
    () => currencies.find((c) => c.code === currency) ?? currencies[0] ?? INITIAL_CURRENCIES[0],
    [currencies, currency]
  );
  const currencySymbol = currencyConfig.symbol[lang];

  const convertPrice = useCallback(
    (yerAmount: number) => {
      const converted = yerAmount * currencyConfig.rateFromYer;
      return Number(converted.toFixed(currencyConfig.decimals));
    },
    [currencyConfig]
  );

  const formatPrice = useCallback(
    (yerAmount: number) => {
      const converted = yerAmount * currencyConfig.rateFromYer;
      if (currencyConfig.symbol.en === '$' || currencyConfig.code === 'USD') {
        return `$${converted.toFixed(currencyConfig.decimals)}`;
      }
      if (currencyConfig.decimals === 0) {
        const rounded = Number.isInteger(Number(converted.toFixed(2)))
          ? Math.round(converted).toString()
          : converted.toFixed(2);
        return `${rounded} ${currencyConfig.symbol[lang]}`;
      }
      return `${converted.toFixed(currencyConfig.decimals)} ${currencyConfig.symbol[lang]}`;
    },
    [currencyConfig, lang]
  );

  const setCurrency = useCallback(
    (next: CurrencyCode) => {
      const cfg = currencies.find((c) => c.code === next);
      if (!cfg) return;
      setCurrencyState(next);
      showToast(
        lang === 'ar'
          ? `تم تغيير العملة إلى ${cfg.name.ar} (${cfg.symbol.ar})`
          : `Currency switched to ${cfg.name.en} (${cfg.code})`
      );
    },
    [currencies, lang, showToast]
  );

  const addCurrency = useCallback(
    (cfg: Omit<CurrencyConfig, 'rateFromYer'>) => {
      const code = cfg.code.trim().toUpperCase();
      if (!code) return;
      const yerPerUnit = Math.max(0.01, cfg.yerPerUnit);
      const next: CurrencyConfig = {
        ...cfg,
        code,
        yerPerUnit,
        rateFromYer: 1 / yerPerUnit,
      };
      setCurrencies((prev) => [...prev.filter((c) => c.code !== code), next]);
      showToast(
        lang === 'ar' ? `تمت إضافة العملة وسعر الصرف (${code})` : `Currency ${code} added`
      );
    },
    [lang, showToast]
  );

  const updateCurrency = useCallback(
    (code: CurrencyCode, partial: Partial<Omit<CurrencyConfig, 'code' | 'rateFromYer'>>) => {
      setCurrencies((prev) =>
        prev.map((c) => {
          if (c.code !== code) return c;
          const nextYerPerUnit = c.isBase
            ? 1
            : Math.max(0.01, partial.yerPerUnit ?? c.yerPerUnit);
          return {
            ...c,
            ...partial,
            yerPerUnit: nextYerPerUnit,
            rateFromYer: c.isBase ? 1 : 1 / nextYerPerUnit,
          };
        })
      );
      showToast(lang === 'ar' ? `تم تحديث سعر صرف ${code}` : `Updated ${code} exchange rate`);
    },
    [lang, showToast]
  );

  const deleteCurrency = useCallback(
    (code: CurrencyCode) => {
      if (code === 'YER') return;
      setCurrencies((prev) => prev.filter((c) => c.code !== code));
      if (currency === code) {
        setCurrencyState('YER');
      }
      showToast(lang === 'ar' ? `تم حذف العملة (${code})` : `Deleted currency (${code})`);
    },
    [currency, lang, showToast]
  );

  const resetCurrencies = useCallback(() => {
    setCurrencies(INITIAL_CURRENCIES);
    showToast(
      lang === 'ar' ? 'تمت استعادة أسعار الصرف الافتراضية' : 'Restored default exchange rates'
    );
  }, [lang, showToast]);

  const tierInfo = useMemo(
    () => getTierInfo(lifetimePoints, loyaltySettings.tiers),
    [lifetimePoints, loyaltySettings.tiers]
  );

  const addToCart = useCallback(
    (product: Product, weightId: string, quantity = 1) => {
      const weight = product.weightOptions.find((w) => w.id === weightId) ?? product.weightOptions[0];
      if (!weight || weight.stock <= 0) return;

      const cartKey = `${product.id}_${weight.id}`;
      setCart((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          return prev.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: Math.min(weight.stock, item.quantity + quantity) }
              : item
          );
        }
        return [
          ...prev,
          {
            cartKey,
            productId: product.id,
            weightId: weight.id,
            name: product.name,
            weightLabel: weight.label,
            image: product.images[0],
            unitPrice: weight.price,
            quantity,
          },
        ];
      });
      showToast(
        lang === 'ar'
          ? `تمت إضافة ${product.name.ar} (${weight.label.ar}) إلى السلة`
          : `Added ${product.name.en} (${weight.label.en}) to cart`
      );
    },
    [lang, showToast]
  );

  const updateCartQuantity = useCallback((cartKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartKey !== cartKey) return item;
          if (item.isRewardItem && delta > 0) return item;
          return { ...item, quantity: item.quantity + delta };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((cartKey: string) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
    setAppliedVoucher(null);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
        showToast(
          exists
            ? lang === 'ar'
              ? 'تمت الإزالة من المفضلة'
              : 'Removed from wishlist'
            : lang === 'ar'
            ? 'تمت الإضافة إلى المفضلة'
            : 'Saved to wishlist'
        );
        return next;
      });
    },
    [lang, showToast]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    let disc = 0;
    if (appliedPromo && subtotal >= appliedPromo.minOrder) {
      disc +=
        appliedPromo.type === 'percent'
          ? (subtotal * appliedPromo.value) / 100
          : appliedPromo.value;
    }
    if (appliedVoucher && !appliedVoucher.used && subtotal >= appliedVoucher.minOrderAmount) {
      disc += appliedVoucher.discountAmount;
    }
    return Math.min(subtotal, Number(disc.toFixed(2)));
  }, [appliedPromo, appliedVoucher, subtotal]);

  const insideSanaaFee = useMemo(
    () =>
      domesticZones.find((z) => z.active !== false && (z.group ?? 'inside_sanaa') === 'inside_sanaa')
        ?.fee ??
      domesticZones[0]?.fee ??
      1000,
    [domesticZones]
  );
  const outsideSanaaFee = useMemo(
    () =>
      domesticZones.find((z) => z.active !== false && z.group === 'outside_sanaa')?.fee ??
      domesticZones[1]?.fee ??
      3000,
    [domesticZones]
  );

  const matchDomesticZoneByLocation = useCallback(
    (
      lat?: number,
      lng?: number,
      locationText?: string
    ): { zone: DomesticShippingZone; matchedBy: 'geo' | 'keyword'; distanceKm?: number } | null => {
      const activeZones = domesticZones.filter((z) => z.active !== false);
      if (activeZones.length === 0) return null;

      // 1) Try text/keyword match on coverageAreas or zone name first if user typed a neighborhood/city
      const cleanText = (locationText ?? '').trim().toLowerCase();
      if (cleanText.length >= 2) {
        for (const zone of activeZones) {
          const keywords = (zone.coverageAreas ?? '')
            .split(/[,،\n]+/)
            .map((k) => k.trim().toLowerCase())
            .filter((k) => k.length >= 2);
          if (
            keywords.some((kw) => cleanText.includes(kw)) ||
            cleanText.includes(zone.name.ar.toLowerCase()) ||
            cleanText.includes(zone.name.en.toLowerCase())
          ) {
            return { zone, matchedBy: 'keyword' };
          }
        }
      }

      // 2) Try geographic Haversine distance against zones that have coordinates & radiusKm
      if (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const calcKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
          const dLat = toRad(lat2 - lat1);
          const dLng = toRad(lng2 - lng1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
              Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        const geoMatches: { zone: DomesticShippingZone; dist: number; radius: number }[] = [];
        for (const zone of activeZones) {
          if (
            typeof zone.centerLat === 'number' &&
            typeof zone.centerLng === 'number' &&
            typeof zone.radiusKm === 'number' &&
            zone.radiusKm > 0
          ) {
            const dist = calcKm(lat, lng, zone.centerLat, zone.centerLng);
            if (dist <= zone.radiusKm) {
              geoMatches.push({ zone, dist, radius: zone.radiusKm });
            }
          }
        }
        if (geoMatches.length > 0) {
          // Prefer most specific (smallest radius), then nearest center
          geoMatches.sort((a, b) => a.radius - b.radius || a.dist - b.dist);
          return {
            zone: geoMatches[0].zone,
            matchedBy: 'geo',
            distanceKm: Number(geoMatches[0].dist.toFixed(1)),
          };
        }
      }

      return null;
    },
    [domesticZones]
  );

  const shippingFee = useMemo(() => {
    const payableItems = cart.some((item) => !item.isRewardItem);
    if (cart.length === 0 || (!payableItems && subtotal === 0)) return 0;
    if (shippingScope === 'international') {
      const country =
        internationalCountries.find((c) => c.id === internationalCountry) ??
        internationalCountries[0];
      return country ? country.shippingFee : 250;
    }
    if (subtotal >= freeShippingThreshold) return 0;
    const zone =
      domesticZones.find((z) => z.id === domesticZone) ?? domesticZones[0];
    return zone ? zone.fee : 1000;
  }, [
    cart,
    domesticZone,
    domesticZones,
    freeShippingThreshold,
    internationalCountries,
    internationalCountry,
    shippingScope,
    subtotal,
  ]);

  const total = useMemo(
    () => Math.max(0, Number((subtotal - discountAmount + shippingFee).toFixed(2))),
    [subtotal, discountAmount, shippingFee]
  );

  const estimatedPointsEarned = useMemo(() => {
    if (!loyaltySettings.enabled) return 0;
    return Math.round(
      Math.max(0, subtotal - discountAmount) * loyaltySettings.pointsPerYer * tierInfo.multiplier
    );
  }, [
    discountAmount,
    loyaltySettings.enabled,
    loyaltySettings.pointsPerYer,
    subtotal,
    tierInfo.multiplier,
  ]);

  const applyPromoCode = useCallback(
    (rawCode: string): { ok: boolean; message: LocalizedText } => {
      const normalized = rawCode.trim().toUpperCase();
      const found = promoCodes.find((p) => p.code.toUpperCase() === normalized && p.active);
      if (!found) {
        return {
          ok: false,
          message: { ar: 'رمز الخصم غير صالح أو منتهي الصلاحية', en: 'Promo code is invalid or expired' },
        };
      }
      if (subtotal < found.minOrder) {
        return {
          ok: false,
          message: {
            ar: `الحد الأدنى لاستخدام هذا الكود ${formatPrice(found.minOrder)}`,
            en: `Minimum order of ${formatPrice(found.minOrder)} required`,
          },
        };
      }
      setAppliedPromo(found);
      return {
        ok: true,
        message: { ar: `تم تفعيل الخصم (${found.code}) بنجاح`, en: `Promo code ${found.code} applied` },
      };
    },
    [formatPrice, promoCodes, subtotal]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  const applyVoucher = useCallback((voucher: RedeemedVoucher | null) => {
    setAppliedVoucher(voucher);
  }, []);

  const updateLoyaltySettings = useCallback(
    (partial: Partial<LoyaltyProgramSettings>) => {
      setLoyaltySettings((prev) => ({ ...prev, ...partial }));
      showToast(
        lang === 'ar' ? 'تم تحديث إعدادات برنامج حصاد النقاط' : 'Loyalty program settings updated'
      );
    },
    [lang, showToast]
  );

  const updateLoyaltyTier = useCallback(
    (tierId: LoyaltyTier, partial: Partial<Omit<LoyaltyTierConfig, 'id'>>) => {
      setLoyaltySettings((prev) => ({
        ...prev,
        tiers: prev.tiers.map((tier) => (tier.id === tierId ? { ...tier, ...partial } : tier)),
      }));
      showToast(lang === 'ar' ? 'تم تحديث بيانات مستوى العضوية' : 'Membership tier updated');
    },
    [lang, showToast]
  );

  const resetLoyaltySettings = useCallback(() => {
    setLoyaltySettings(INITIAL_LOYALTY_SETTINGS);
    showToast(
      lang === 'ar'
        ? 'تمت استعادة الإعدادات الافتراضية لبرنامج حصاد النقاط'
        : 'Loyalty settings restored to defaults'
    );
  }, [lang, showToast]);

  const addLoyaltyReward = useCallback(
    (reward: LoyaltyReward) => {
      setLoyaltyRewards((prev) => [reward, ...prev]);
      showToast(
        lang === 'ar'
          ? `تمت إضافة المكافأة: ${reward.title.ar}`
          : `Added reward: ${reward.title.en}`
      );
    },
    [lang, showToast]
  );

  const updateLoyaltyReward = useCallback(
    (rewardId: string, partial: Partial<LoyaltyReward>) => {
      setLoyaltyRewards((prev) =>
        prev.map((r) => (r.id === rewardId ? { ...r, ...partial } : r))
      );
      showToast(lang === 'ar' ? 'تم تحديث بيانات المكافأة بنجاح' : 'Loyalty reward updated');
    },
    [lang, showToast]
  );

  const deleteLoyaltyReward = useCallback(
    (rewardId: string) => {
      setLoyaltyRewards((prev) => prev.filter((r) => r.id !== rewardId));
      showToast(lang === 'ar' ? 'تم حذف المكافأة بنجاح' : 'Loyalty reward deleted');
    },
    [lang, showToast]
  );

  const resetLoyaltyRewards = useCallback(() => {
    setLoyaltyRewards(LOYALTY_REWARDS);
    showToast(
      lang === 'ar' ? 'تمت استعادة المكافآت الافتراضية' : 'Default loyalty rewards restored'
    );
  }, [lang, showToast]);

  const adjustLoyaltyPoints = useCallback(
    (delta: number, reason: LocalizedText, affectLifetime = false) => {
      if (delta === 0) return;
      setLoyaltyPoints((prev) => Math.max(0, prev + delta));
      if (affectLifetime && delta > 0) {
        setLifetimePoints((prev) => Math.max(0, prev + delta));
      }
      setLoyaltyTransactions((prev) => [
        {
          id: `ltx-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          type: delta >= 0 ? 'bonus' : 'redeem',
          points: delta,
          description: reason,
        },
        ...prev,
      ]);
      showToast(
        lang === 'ar'
          ? `تم تعديل رصيد النقاط (${delta > 0 ? `+${delta}` : delta})`
          : `Adjusted loyalty points (${delta > 0 ? `+${delta}` : delta})`
      );
    },
    [lang, showToast]
  );

  const setCustomerPointsBalances = useCallback(
    (available: number, lifetime: number) => {
      setLoyaltyPoints(Math.max(0, available));
      setLifetimePoints(Math.max(0, lifetime));
      showToast(
        lang === 'ar' ? 'تم تحديث رصيد نقاط العميل مباشرة' : 'Customer points balance updated'
      );
    },
    [lang, showToast]
  );

  const addHeroBanner = useCallback(
    (banner: HeroBanner) => {
      setHeroBanners((prev) => [...prev, banner]);
      showToast(
        lang === 'ar' ? `تمت إضافة شريحة العرض: ${banner.title.ar}` : `Added banner: ${banner.title.en}`
      );
    },
    [lang, showToast]
  );

  const updateHeroBanner = useCallback(
    (id: string, partial: Partial<HeroBanner>) => {
      setHeroBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...partial } : b)));
      showToast(lang === 'ar' ? 'تم تحديث شريحة العرض بنجاح' : 'Hero banner updated');
    },
    [lang, showToast]
  );

  const deleteHeroBanner = useCallback(
    (id: string) => {
      setHeroBanners((prev) => prev.filter((b) => b.id !== id));
      showToast(lang === 'ar' ? 'تم حذف شريحة العرض' : 'Hero banner deleted');
    },
    [lang, showToast]
  );

  const moveHeroBanner = useCallback((id: string, direction: 'up' | 'down') => {
    setHeroBanners((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }, []);

  const resetHeroBanners = useCallback(() => {
    setHeroBanners(HERO_BANNERS);
    showToast(lang === 'ar' ? 'تمت استعادة شرائح العرض الافتراضية' : 'Default hero banners restored');
  }, [lang, showToast]);

  const updateHomeSettings = useCallback(
    (partial: Partial<HomePageSettings>) => {
      setHomeSettings((prev) => ({ ...prev, ...partial }));
      showToast(lang === 'ar' ? 'تم حفظ إعدادات ونصوص الواجهة الرئيسية' : 'Home page settings saved');
    },
    [lang, showToast]
  );

  const resetHomeSettings = useCallback(() => {
    setHomeSettings(INITIAL_HOME_SETTINGS);
    showToast(
      lang === 'ar' ? 'تمت استعادة نصوص الواجهة الرئيسية الافتراضية' : 'Home page settings restored'
    );
  }, [lang, showToast]);

  const updateAboutSettings = useCallback(
    (partial: Partial<AboutContactSettings>) => {
      setAboutSettings((prev) => ({ ...prev, ...partial }));
      showToast(
        lang === 'ar' ? 'تم حفظ إعدادات صفحة من نحن وتواصل معنا' : 'About & Contact settings saved'
      );
    },
    [lang, showToast]
  );

  const addAboutPillar = useCallback(
    (pillar: AboutPillar) => {
      setAboutSettings((prev) => ({
        ...prev,
        pillars: [...prev.pillars, pillar],
      }));
      showToast(
        lang === 'ar' ? `تمت إضافة بطاقة: ${pillar.title.ar}` : `Added pillar: ${pillar.title.en}`
      );
    },
    [lang, showToast]
  );

  const updateAboutPillar = useCallback(
    (id: string, partial: Partial<AboutPillar>) => {
      setAboutSettings((prev) => ({
        ...prev,
        pillars: prev.pillars.map((p) => (p.id === id ? { ...p, ...partial } : p)),
      }));
      showToast(lang === 'ar' ? 'تم تحديث بيانات البطاقة بنجاح' : 'Pillar updated');
    },
    [lang, showToast]
  );

  const deleteAboutPillar = useCallback(
    (id: string) => {
      setAboutSettings((prev) => ({
        ...prev,
        pillars: prev.pillars.filter((p) => p.id !== id),
      }));
      showToast(lang === 'ar' ? 'تم حذف البطاقة' : 'Pillar deleted');
    },
    [lang, showToast]
  );

  const resetAboutSettings = useCallback(() => {
    setAboutSettings(INITIAL_ABOUT_SETTINGS);
    showToast(
      lang === 'ar'
        ? 'تمت استعادة الإعدادات الافتراضية لصفحة من نحن وتواصل معنا'
        : 'About & Contact settings restored to defaults'
    );
  }, [lang, showToast]);

  const submitContactMessage = useCallback(
    (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
      const created: ContactMessage = {
        ...msg,
        id: `cmsg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setContactMessages((prev) => [created, ...prev]);
    },
    []
  );

  const markContactMessageRead = useCallback((id: string) => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }, []);

  const deleteContactMessage = useCallback(
    (id: string) => {
      setContactMessages((prev) => prev.filter((m) => m.id !== id));
      showToast(lang === 'ar' ? 'تم حذف الرسالة' : 'Message deleted');
    },
    [lang, showToast]
  );

  const redeemReward = useCallback(
    (reward: LoyaltyReward): { ok: boolean; message: LocalizedText } => {
      if (!loyaltySettings.enabled) {
        return {
          ok: false,
          message: {
            ar: 'برنامج استبدال النقاط متوقف مؤقتاً من قبل الإدارة',
            en: 'Loyalty rewards redemption is temporarily paused by store admin',
          },
        };
      }
      if (reward.stock <= 0) {
        return {
          ok: false,
          message: {
            ar: 'عذراً، نفدت كمية هذه المكافأة حالياً',
            en: 'Sorry, this reward is currently out of stock',
          },
        };
      }
      if (loyaltyPoints < reward.pointsCost) {
        return {
          ok: false,
          message: {
            ar: 'رصيد نقاطك غير كافٍ لهذه المكافأة',
            en: 'Insufficient loyalty points for this reward',
          },
        };
      }

      setLoyaltyPoints((prev) => prev - reward.pointsCost);
      setLoyaltyRewards((prev) =>
        prev.map((r) => (r.id === reward.id ? { ...r, stock: Math.max(0, r.stock - 1) } : r))
      );
      const txId = `ltx-${Date.now()}`;
      setLoyaltyTransactions((prev) => [
        {
          id: txId,
          date: new Date().toISOString().slice(0, 10),
          type: 'redeem',
          points: -reward.pointsCost,
          description: {
            ar: `استبدال مكافأة: ${reward.title.ar}`,
            en: `Redeemed reward: ${reward.title.en}`,
          },
        },
        ...prev,
      ]);

      if (reward.type === 'discount') {
        const voucher: RedeemedVoucher = {
          id: `vch-${Date.now()}`,
          rewardId: reward.id,
          code: `REW-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          title: reward.title,
          discountAmount: reward.discountAmount ?? 25,
          minOrderAmount: reward.minOrderAmount ?? 0,
          used: false,
          createdAt: new Date().toISOString(),
        };
        setRedeemedVouchers((prev) => [voucher, ...prev]);
        setAppliedVoucher(voucher);
        showToast(
          lang === 'ar'
            ? `تم استبدال ${reward.title.ar} وتفعيلها في السلة`
            : `Redeemed ${reward.title.en} and applied to your cart`
        );
        return {
          ok: true,
          message: {
            ar: 'تم إصدار القسيمة وتطبيقها تلقائياً في سلتك',
            en: 'Voucher issued and automatically applied to your cart',
          },
        };
      }

      // Exclusive product reward -> add directly as 0 YER reward item in cart
      const cartKey = `reward_${reward.id}_${Date.now()}`;
      setCart((prev) => [
        ...prev,
        {
          cartKey,
          productId: reward.id,
          weightId: 'reward',
          name: reward.title,
          weightLabel: reward.weightLabel ?? { ar: 'هدية ولاء حصرية', en: 'Exclusive Reward' },
          image: reward.productImage ?? '/src/assets/images/product_sidr_jar_1794959132616.jpg',
          unitPrice: 0,
          quantity: 1,
          isRewardItem: true,
          rewardId: reward.id,
        },
      ]);
      showToast(
        lang === 'ar'
          ? `تمت إضافة ${reward.title.ar} مجاناً إلى سلتك`
          : `Added ${reward.title.en} free to your cart`
      );
      return {
        ok: true,
        message: {
          ar: 'تمت إضافة المنتج الحصري مجاناً إلى سلة التسوق',
          en: 'Exclusive reward product added free to your cart',
        },
      };
    },
    [lang, loyaltyPoints, loyaltySettings.enabled, showToast]
  );

  const placeOrder = useCallback(
    (
      address: DeliveryAddress,
      paymentMethod: PaymentMethod,
      paymentDetails?: PaymentDetails
    ): Order => {
      const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const earned = estimatedPointsEarned;

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        status: 'pending',
        items: [...cart],
        subtotal,
        discount: discountAmount,
        shippingFee,
        total,
        pointsEarned: earned,
        paymentMethod,
        paymentDetails,
        address,
        promoApplied: appliedPromo?.code ?? appliedVoucher?.code,
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Deduct product stock
      setProducts((prev) =>
        prev.map((prod) => ({
          ...prod,
          weightOptions: prod.weightOptions.map((w) => {
            const orderedItem = cart.find((c) => c.productId === prod.id && c.weightId === w.id);
            if (!orderedItem) return w;
            return { ...w, stock: Math.max(0, w.stock - orderedItem.quantity) };
          }),
        }))
      );

      // Mark voucher used
      if (appliedVoucher) {
        setRedeemedVouchers((prev) =>
          prev.map((v) => (v.id === appliedVoucher.id ? { ...v, used: true } : v))
        );
      }

      // Award loyalty points
      if (earned > 0) {
        setLoyaltyPoints((prev) => prev + earned);
        setLifetimePoints((prev) => prev + earned);
        setLoyaltyTransactions((prev) => [
          {
            id: `ltx-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            type: 'earn',
            points: earned,
            description: {
              ar: `نقاط مكتسبة من الطلب ${orderId}`,
              en: `Points earned from Order ${orderId}`,
            },
            orderId,
          },
          ...prev,
        ]);
      }

      clearCart();
      void fetch('/api/customer/order-recorded', { method: 'POST', credentials: 'include' }).catch(
        () => {}
      );
      return newOrder;
    },
    [
      appliedPromo,
      appliedVoucher,
      cart,
      clearCart,
      discountAmount,
      estimatedPointsEarned,
      shippingFee,
      subtotal,
      total,
    ]
  );

  const setOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      const labels: Record<OrderStatus, LocalizedText> = {
        pending: { ar: 'تم الطلب', en: 'Ordered' },
        confirmed: { ar: 'قيد التجهيز', en: 'Preparing' },
        out_for_delivery: { ar: 'جاري التوصيل', en: 'Out for Delivery' },
        delivered: { ar: 'تم التوصيل', en: 'Delivered' },
      };
      showToast(
        lang === 'ar'
          ? `تم تحديث حالة الطلب ${orderId} إلى: ${labels[status].ar}`
          : `Order ${orderId} updated to: ${labels[status].en}`
      );
    },
    [lang, showToast]
  );

  const advanceOrderStatus = useCallback(
    (orderId: string) => {
      const flow: OrderStatus[] = ['pending', 'confirmed', 'out_for_delivery', 'delivered'];
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const idx = flow.indexOf(o.status);
          const nextStatus = flow[Math.min(flow.length - 1, idx + 1)];
          return { ...o, status: nextStatus };
        })
      );
    },
    []
  );

  const reorderOrder = useCallback(
    (order: Order) => {
      const regularItems = order.items.filter((i) => !i.isRewardItem);
      setCart((prev) => {
        const next = [...prev];
        for (const item of regularItems) {
          const existing = next.find((c) => c.cartKey === item.cartKey);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            next.push({ ...item });
          }
        }
        return next;
      });
      setIsCartOpen(true);
      showToast(
        lang === 'ar'
          ? `تمت إعادة إضافة منتجات الطلب ${order.id} إلى السلة`
          : `Reordered items from ${order.id} into your cart`
      );
    },
    [lang, showToast]
  );

  const addCategory = useCallback(
    (cat: StoreCategory) => {
      setCategories((prev) => [...prev.filter((c) => c.id !== cat.id), cat]);
      showToast(
        lang === 'ar' ? `تمت إضافة التصنيف: ${cat.label.ar}` : `Category added: ${cat.label.en}`
      );
    },
    [lang, showToast]
  );

  const updateCategory = useCallback(
    (id: string, label: LocalizedText) => {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
      showToast(lang === 'ar' ? 'تم تحديث التصنيف بنجاح' : 'Category updated');
    },
    [lang, showToast]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (selectedCategory === id) setSelectedCategory('all');
      showToast(lang === 'ar' ? 'تم حذف التصنيف' : 'Category deleted');
    },
    [lang, selectedCategory, showToast]
  );

  const addProduct = useCallback(
    (product: Product) => {
      setProducts((prev) => [product, ...prev]);
      showToast(
        lang === 'ar' ? `تمت إضافة الصنف: ${product.name.ar}` : `Added product: ${product.name.en}`
      );
    },
    [lang, showToast]
  );

  const updateProduct = useCallback(
    (productId: string, partial: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...partial } : p))
      );
      setSelectedProduct((sel) => (sel && sel.id === productId ? { ...sel, ...partial } : sel));
      showToast(lang === 'ar' ? 'تم تعديل بيانات الصنف بنجاح' : 'Product details updated');
    },
    [lang, showToast]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      setWishlist((prev) => prev.filter((id) => id !== productId));
      setSelectedProduct((sel) => (sel?.id === productId ? null : sel));
      showToast(lang === 'ar' ? 'تم حذف الصنف من المتجر' : 'Product deleted');
    },
    [lang, showToast]
  );

  const addProductWeight = useCallback(
    (productId: string, weight: WeightOption) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, weightOptions: [...p.weightOptions, weight] } : p
        )
      );
      showToast(lang === 'ar' ? 'تمت إضافة خيار الوزن والسعر' : 'Weight option added');
    },
    [lang, showToast]
  );

  const updateProductWeight = useCallback(
    (productId: string, weightId: string, price: number, stock: number, label?: LocalizedText) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          return {
            ...p,
            weightOptions: p.weightOptions.map((w) =>
              w.id === weightId
                ? {
                    ...w,
                    price: Math.max(1, price),
                    stock: Math.max(0, stock),
                    ...(label ? { label } : {}),
                  }
                : w
            ),
          };
        })
      );
      showToast(lang === 'ar' ? 'تم تحديث السعر والمخزون بنجاح' : 'Price and inventory updated');
    },
    [lang, showToast]
  );

  const deleteProductWeight = useCallback(
    (productId: string, weightId: string) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId || p.weightOptions.length <= 1) return p;
          return {
            ...p,
            weightOptions: p.weightOptions.filter((w) => w.id !== weightId),
          };
        })
      );
      showToast(lang === 'ar' ? 'تم حذف خيار الوزن' : 'Weight option removed');
    },
    [lang, showToast]
  );

  const updateProductImages = useCallback(
    (productId: string, images: string[]) => {
      const cleaned = images.map((s) => s.trim()).filter(Boolean);
      if (cleaned.length === 0) return;
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, images: cleaned } : p))
      );
      setSelectedProduct((sel) =>
        sel && sel.id === productId ? { ...sel, images: cleaned } : sel
      );
      setCart((prev) =>
        prev.map((item) =>
          !item.isRewardItem && item.productId === productId
            ? { ...item, image: cleaned[0] }
            : item
        )
      );
      try {
        const raw = window.localStorage.getItem(IMAGES_STORAGE_KEY);
        const map = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
        map[productId] = cleaned;
        window.localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(map));
      } catch {
        // Ignore storage write error
      }
      showToast(lang === 'ar' ? 'تم تحديث صور المنتج بنجاح' : 'Product images updated');
    },
    [lang, showToast]
  );

  const resetProductImages = useCallback(
    (productId: string) => {
      const original = INITIAL_PRODUCTS.find((p) => p.id === productId);
      if (!original) return;
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, images: [...original.images] } : p))
      );
      setSelectedProduct((sel) =>
        sel && sel.id === productId ? { ...sel, images: [...original.images] } : sel
      );
      setCart((prev) =>
        prev.map((item) =>
          !item.isRewardItem && item.productId === productId
            ? { ...item, image: original.images[0] }
            : item
        )
      );
      try {
        const raw = window.localStorage.getItem(IMAGES_STORAGE_KEY);
        if (raw) {
          const map = JSON.parse(raw) as Record<string, string[]>;
          delete map[productId];
          window.localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(map));
        }
      } catch {
        // Ignore storage write error
      }
      showToast(
        lang === 'ar' ? 'تمت استعادة الصور الافتراضية للمنتج' : 'Restored default product images'
      );
    },
    [lang, showToast]
  );

  const addProductReview = useCallback(
    (productId: string, author: string, rating: number, commentText: string) => {
      const publicAuthorName =
        authStatus === 'customer' && currentCustomer?.displayName
          ? currentCustomer.displayName
          : author.trim() || (lang === 'ar' ? 'زائر' : 'Guest');

      const newReview = {
        id: `rev-${Date.now()}`,
        author: publicAuthorName,
        rating,
        date: new Date().toISOString().slice(0, 10),
        comment: { ar: commentText, en: commentText },
        verifiedPurchase: authStatus === 'customer',
      };

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          try {
            const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
            const map = raw ? (JSON.parse(raw) as Record<string, Product['reviews']>) : {};
            map[productId] = [newReview, ...(map[productId] ?? [])];
            window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(map));
          } catch {
            // Ignore storage write error
          }
          const updatedReviews = [newReview, ...p.reviews];
          const newCount = p.reviewCount + 1;
          const avg = Number(((p.rating * p.reviewCount + rating) / newCount).toFixed(1));
          const updated = {
            ...p,
            reviews: updatedReviews,
            reviewCount: newCount,
            rating: avg,
          };
          setSelectedProduct((sel) => (sel?.id === productId ? updated : sel));
          return updated;
        })
      );

      void fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          author: publicAuthorName,
          rating,
          comment: commentText,
        }),
      }).catch(() => {});

      showToast(lang === 'ar' ? 'شكراً لتقييمك! تم نشر رأيك' : 'Thank you! Your review is published');
    },
    [authStatus, currentCustomer, lang, showToast]
  );

  const createPromoCode = useCallback(
    (promo: PromoCode) => {
      setPromoCodes((prev) => [promo, ...prev.filter((p) => p.code !== promo.code)]);
      showToast(
        lang === 'ar' ? `تم إنشاء كود الخصم ${promo.code}` : `Promo code ${promo.code} created`
      );
    },
    [lang, showToast]
  );

  const deletePromoCode = useCallback(
    (code: string) => {
      setPromoCodes((prev) => prev.filter((p) => p.code !== code));
      if (appliedPromo?.code === code) setAppliedPromo(null);
      showToast(lang === 'ar' ? `تم حذف الكوبون ${code}` : `Deleted promo code ${code}`);
    },
    [appliedPromo, lang, showToast]
  );

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const dismissPushPopup = useCallback(() => {
    setActivePushPopup(null);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updatePushPreferences = useCallback((partial: Partial<PushPreferences>) => {
    setPushPreferences((prev) => ({ ...prev, ...partial }));
  }, []);

  const requestPushPermission = useCallback(async (): Promise<BrowserPermissionState> => {
    const result = await requestBrowserNotificationPermission();
    setNotificationPermission(result);
    if (result === 'granted') {
      setPushPreferences((prev) => ({ ...prev, enabled: true }));
      void dispatchNativePushNotification(
        lang === 'ar' ? 'تم تفعيل إشعارات كنوز دوعن' : 'Kunooz Doan Alerts Enabled',
        lang === 'ar'
          ? 'ستصلك تنبيهات فورية عند توفر عسل جديد أو خصومات موسمية.'
          : 'You will now receive alerts for new honey harvests and seasonal offers.',
        'kunooz-welcome-push'
      );
      showToast(
        lang === 'ar'
          ? 'تم تفعيل الإشعارات المنبثقة على جهازك بنجاح!'
          : 'Push notifications enabled on your device!'
      );
    } else if (result === 'denied') {
      showToast(
        lang === 'ar'
          ? 'تم حظر إشعارات المتصفح — يمكنك تفعيلها من إعدادات الموقع أو متابعة التنبيهات داخل التطبيق.'
          : 'Browser notifications blocked — in-app alerts remain active.'
      );
    } else {
      setPushPreferences((prev) => ({ ...prev, enabled: true }));
      showToast(
        lang === 'ar'
          ? 'تم تفعيل الإشعارات المنبثقة داخل التطبيق.'
          : 'In-app push alerts enabled.'
      );
    }
    return result;
  }, [lang, showToast]);

  const sendPushNotification = useCallback(
    (
      title: LocalizedText,
      body: LocalizedText,
      targetSegment: PushNotificationItem['targetSegment'],
      options?: {
        category?: NotificationTopic;
        targetView?: AppView;
        productId?: string;
      }
    ) => {
      const category = options?.category ?? 'new_honey';
      const item: PushNotificationItem = {
        id: `notif-${Date.now()}`,
        title,
        body,
        sentAt: new Date().toISOString(),
        targetSegment,
        category,
        targetView: options?.targetView,
        productId: options?.productId,
        read: false,
      };
      setNotifications((prev) => [item, ...prev]);

      const topicAllowed =
        pushPreferences.enabled &&
        ((category === 'new_honey' && pushPreferences.newHoney) ||
          (category === 'seasonal_discount' && pushPreferences.seasonalDiscounts) ||
          (category === 'loyalty' && pushPreferences.loyaltyAlerts));

      if (topicAllowed) {
        setActivePushPopup(item);
        setTimeout(() => {
          setActivePushPopup((curr) => (curr?.id === item.id ? null : curr));
        }, 6500);
        void dispatchNativePushNotification(t(title), t(body), item.id);
      } else {
        showToast(`${t(title)} — ${t(body)}`);
      }
    },
    [pushPreferences, showToast, t]
  );

  const createOffer = useCallback(
    (offer: SpecialOffer) => {
      setOffers((prev) => [offer, ...prev]);
      sendPushNotification(
        {
          ar: `خصم موسمي جديد: ${offer.title.ar}`,
          en: `New Seasonal Discount: ${offer.title.en}`,
        },
        {
          ar: `${offer.badgeText.ar} — متاح الآن في قسم العروض لفترة محدودة.`,
          en: `${offer.badgeText.en} — available now in Seasonal Offers.`,
        },
        'all',
        {
          category: 'seasonal_discount',
          targetView: 'offers',
          productId: offer.productId,
        }
      );
    },
    [sendPushNotification]
  );

  const updateOffer = useCallback(
    (offerId: string, partial: Partial<SpecialOffer>) => {
      setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, ...partial } : o)));
      showToast(lang === 'ar' ? 'تم تحديث بيانات العرض بنجاح' : 'Offer updated');
    },
    [lang, showToast]
  );

  const deleteOffer = useCallback(
    (offerId: string) => {
      setOffers((prev) => prev.filter((o) => o.id !== offerId));
      showToast(lang === 'ar' ? 'تم حذف العرض بنجاح' : 'Offer deleted');
    },
    [lang, showToast]
  );

  const toggleOfferActive = useCallback(
    (offerId: string) => {
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, active: !o.active } : o))
      );
      showToast(lang === 'ar' ? 'تم تحديث حالة العرض' : 'Offer status updated');
    },
    [lang, showToast]
  );

  const setFreeShippingThreshold = useCallback(
    (threshold: number) => {
      setFreeShippingThresholdState(Math.max(0, threshold));
      showToast(lang === 'ar' ? 'تم تحديث حد التوصيل المجاني' : 'Free shipping threshold updated');
    },
    [lang, showToast]
  );

  const addDomesticZone = useCallback(
    (zone: DomesticShippingZone) => {
      setDomesticZones((prev) => [...prev, zone]);
      showToast(
        lang === 'ar' ? `تمت إضافة منطقة التوصيل: ${zone.name.ar}` : `Added zone: ${zone.name.en}`
      );
    },
    [lang, showToast]
  );

  const updateDomesticZone = useCallback(
    (id: string, partial: Partial<Omit<DomesticShippingZone, 'id'>>) => {
      setDomesticZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...partial } : z)));
      showToast(lang === 'ar' ? 'تم تعديل سعر التوصيل المحلي' : 'Domestic delivery updated');
    },
    [lang, showToast]
  );

  const deleteDomesticZone = useCallback(
    (id: string) => {
      setDomesticZones((prev) => {
        const next = prev.filter((z) => z.id !== id);
        if (domesticZone === id && next[0]) {
          setDomesticZone(next[0].id);
        }
        return next;
      });
      showToast(lang === 'ar' ? 'تم حذف منطقة التوصيل' : 'Domestic zone deleted');
    },
    [domesticZone, lang, showToast]
  );

  const addInternationalCountry = useCallback(
    (country: InternationalCountryOption) => {
      setInternationalCountries((prev) => [...prev, country]);
      showToast(
        lang === 'ar'
          ? `تمت إضافة دولة الشحن: ${country.name.ar}`
          : `Added country: ${country.name.en}`
      );
    },
    [lang, showToast]
  );

  const updateInternationalCountry = useCallback(
    (id: string, partial: Partial<Omit<InternationalCountryOption, 'id'>>) => {
      setInternationalCountries((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...partial } : c))
      );
      showToast(lang === 'ar' ? 'تم تعديل سعر الشحن الدولي' : 'International shipping updated');
    },
    [lang, showToast]
  );

  const deleteInternationalCountry = useCallback(
    (id: string) => {
      setInternationalCountries((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (internationalCountry === id && next[0]) {
          setInternationalCountry(next[0].id);
        }
        return next;
      });
      showToast(lang === 'ar' ? 'تم حذف دولة الشحن' : 'International country deleted');
    },
    [internationalCountry, lang, showToast]
  );

  const claimOffer = useCallback(
    (offer: SpecialOffer) => {
      const product = products.find((p) => p.id === offer.productId);
      if (!product) return;
      const weight =
        product.weightOptions.find((w) => w.id === offer.weightId) ?? product.weightOptions[0];
      if (!weight || weight.stock <= 0) return;

      const cartKey = `offer_${offer.id}_${product.id}_${weight.id}`;
      setCart((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          return prev.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: Math.min(weight.stock, item.quantity + 1) }
              : item
          );
        }
        return [
          ...prev,
          {
            cartKey,
            productId: product.id,
            weightId: weight.id,
            name: offer.title,
            weightLabel: weight.label,
            image: product.images[0],
            unitPrice: offer.offerPrice,
            quantity: 1,
          },
        ];
      });
      setIsCartOpen(true);
      showToast(
        lang === 'ar'
          ? `تمت إضافة "${offer.title.ar}" بسعر العرض (${formatPrice(offer.offerPrice)}) إلى السلة`
          : `Added "${offer.title.en}" at offer price (${formatPrice(offer.offerPrice)}) to cart`
      );
    },
    [formatPrice, lang, products, showToast]
  );

  const value: StoreContextValue = {
    lang,
    setLang,
    toggleLang,
    t,
    theme,
    themeByLang,
    setTheme,
    setThemeForLang,
    toggleTheme,
    currency,
    setCurrency,
    currencies,
    currencyConfig,
    currencySymbol,
    convertPrice,
    formatPrice,
    addCurrency,
    updateCurrency,
    deleteCurrency,
    resetCurrencies,
    view,
    setView,
    profileTab,
    setProfileTab,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedProduct,
    setSelectedProduct,
    isCartOpen,
    setIsCartOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authStatus,
    currentCustomer,
    authProviders,
    continueAsGuest,
    loginWithPhone,
    logoutCustomer,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductWeight,
    updateProductWeight,
    deleteProductWeight,
    updateProductImages,
    resetProductImages,
    addProductReview,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    wishlist,
    toggleWishlist,
    promoCodes,
    createPromoCode,
    deletePromoCode,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    offers,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferActive,
    claimOffer,
    loyaltySettings,
    updateLoyaltySettings,
    updateLoyaltyTier,
    resetLoyaltySettings,
    loyaltyRewards,
    addLoyaltyReward,
    updateLoyaltyReward,
    deleteLoyaltyReward,
    resetLoyaltyRewards,
    loyaltyPoints,
    lifetimePoints,
    adjustLoyaltyPoints,
    setCustomerPointsBalances,
    loyaltyTier: tierInfo.tier,
    tierMultiplier: tierInfo.multiplier,
    nextTierThreshold: tierInfo.nextThreshold,
    loyaltyTransactions,
    redeemedVouchers,
    appliedVoucher,
    applyVoucher,
    redeemReward,
    subtotal,
    discountAmount,
    shippingScope,
    setShippingScope,
    domesticZones,
    addDomesticZone,
    updateDomesticZone,
    deleteDomesticZone,
    matchDomesticZoneByLocation,
    domesticZone,
    setDomesticZone,
    insideSanaaFee,
    outsideSanaaFee,
    internationalCountries,
    addInternationalCountry,
    updateInternationalCountry,
    deleteInternationalCountry,
    internationalCountry,
    setInternationalCountry,
    customCountryName,
    setCustomCountryName,
    shippingFee,
    total,
    estimatedPointsEarned,
    freeShippingThreshold,
    setFreeShippingThreshold,
    orders,
    placeOrder,
    advanceOrderStatus,
    setOrderStatus,
    reorderOrder,
    notifications,
    unreadNotificationCount,
    activePushPopup,
    dismissPushPopup,
    pushPreferences,
    updatePushPreferences,
    notificationPermission,
    requestPushPermission,
    markNotificationRead,
    markAllNotificationsRead,
    sendPushNotification,
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    moveHeroBanner,
    resetHeroBanners,
    homeSettings,
    updateHomeSettings,
    resetHomeSettings,
    aboutSettings,
    updateAboutSettings,
    addAboutPillar,
    updateAboutPillar,
    deleteAboutPillar,
    resetAboutSettings,
    contactMessages,
    submitContactMessage,
    markContactMessageRead,
    deleteContactMessage,
    toast,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
