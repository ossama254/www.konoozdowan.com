export type Language = 'ar' | 'en';

export type ThemeMode = 'light' | 'dark';

export type CurrencyCode = string;

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: LocalizedText;
  name: LocalizedText;
  yerPerUnit: number;
  rateFromYer: number;
  decimals: number;
  isBase?: boolean;
}

export type CategoryId = string;

export interface StoreCategory {
  id: string;
  label: LocalizedText;
}

export type AppView = 'home' | 'offers' | 'about' | 'checkout' | 'profile' | 'admin';

export type OrderStatus = 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered';

export type PaymentMethod = 'cod' | 'kuraimi' | 'wallet';

export type LocalWalletProvider = 'jeeb' | 'jawali' | 'floosak' | 'onecash';

export interface PaymentDetails {
  providerLabel: LocalizedText;
  walletProvider?: LocalWalletProvider;
  referenceNumber?: string;
  senderPhone?: string;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'royal';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface WeightOption {
  id: string;
  label: LocalizedText;
  grams: number;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface LabMetric {
  label: LocalizedText;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: LocalizedText;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  sku: string;
  category: CategoryId;
  subCategory: LocalizedText;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  origin: LocalizedText;
  harvestSeason: LocalizedText;
  benefits: LocalizedText[];
  labMetrics: LabMetric[];
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  purityBadge: LocalizedText;
  weightOptions: WeightOption[];
  reviews: ProductReview[];
}

export interface CartItem {
  cartKey: string;
  productId: string;
  weightId: string;
  name: LocalizedText;
  weightLabel: LocalizedText;
  image: string;
  unitPrice: number;
  quantity: number;
  isRewardItem?: boolean;
  rewardId?: string;
}

export type ShippingScope = 'domestic' | 'international';

export type DomesticDeliveryZone = string;

export interface DomesticShippingZone {
  id: DomesticDeliveryZone;
  name: LocalizedText;
  description: LocalizedText;
  fee: number;
}

export type InternationalCountryId = string;

export interface InternationalCountryOption {
  id: InternationalCountryId;
  name: LocalizedText;
  shippingFee: number;
  estimatedDays: LocalizedText;
  carrier: LocalizedText;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  city: string;
  streetAddress: string;
  buildingNotes: string;
  lat: number;
  lng: number;
  placeId?: string;
  shippingScope?: ShippingScope;
  domesticZone?: DomesticDeliveryZone;
  countryCode?: InternationalCountryId;
  countryName?: LocalizedText;
  postalCode?: string;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  description: LocalizedText;
  active: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  pointsEarned: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails;
  address: DeliveryAddress;
  promoApplied?: string;
}

export interface LoyaltyReward {
  id: string;
  type: 'discount' | 'exclusive_product';
  title: LocalizedText;
  description: LocalizedText;
  pointsCost: number;
  discountAmount?: number;
  minOrderAmount?: number;
  productImage?: string;
  weightLabel?: LocalizedText;
  stock: number;
}

export interface LoyaltyTierConfig {
  id: LoyaltyTier;
  label: LocalizedText;
  minPoints: number;
  multiplier: number;
}

export interface LoyaltyProgramSettings {
  enabled: boolean;
  programTitle: LocalizedText;
  programSubtitle: LocalizedText;
  rewardsSectionTitle: LocalizedText;
  earnHint: LocalizedText;
  bannerImage?: string;
  pointsPerYer: number;
  tiers: LoyaltyTierConfig[];
}

export interface RedeemedVoucher {
  id: string;
  rewardId: string;
  code: string;
  title: LocalizedText;
  discountAmount: number;
  minOrderAmount: number;
  used: boolean;
  createdAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  date: string;
  type: 'earn' | 'redeem' | 'bonus';
  points: number;
  description: LocalizedText;
  orderId?: string;
}

export type NotificationTopic = 'new_honey' | 'seasonal_discount' | 'loyalty';

export interface PushNotificationItem {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  sentAt: string;
  targetSegment: 'all' | 'gold_royal' | 'cart_abandoners';
  category?: NotificationTopic;
  targetView?: AppView;
  productId?: string;
  read?: boolean;
}

export interface PushPreferences {
  enabled: boolean;
  newHoney: boolean;
  seasonalDiscounts: boolean;
  loyaltyAlerts: boolean;
}

export interface SpecialOffer {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  badgeText: LocalizedText;
  productId: string;
  weightId: string;
  offerPrice: number;
  originalPrice: number;
  promoCode?: string;
  endsAtLabel: LocalizedText;
  active: boolean;
}

export interface HeroBanner {
  id: string;
  kicker: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  cta: LocalizedText;
  targetCategory: CategoryId;
  image: string;
  active: boolean;
}

export interface HomePageSettings {
  showSearchBar: boolean;
  searchPlaceholder: LocalizedText;
  quickSearchTerms: { ar: string[]; en: string[] };
  showHeroSlider: boolean;
  tourButtonLabel: LocalizedText;
  showValueStrip: boolean;
  purityTitle: LocalizedText;
  puritySubtitle: LocalizedText;
  loyaltyCtaLabel: LocalizedText;
  shippingTitle: LocalizedText;
  offersKicker: LocalizedText;
  offersHeading: LocalizedText;
  catalogTitle: LocalizedText;
  catalogSubtitle: LocalizedText;
}

export type AboutPillarIcon = 'eye' | 'compass' | 'target' | 'shield' | 'award' | 'heart';

export interface AboutPillar {
  id: string;
  iconKey: AboutPillarIcon;
  title: LocalizedText;
  text: LocalizedText;
  active: boolean;
}

export interface AboutContactSettings {
  heroKicker: LocalizedText;
  heroTitle: LocalizedText;
  heroDescription: LocalizedText;
  heroPrimaryCta: LocalizedText;
  heroSecondaryCta: LocalizedText;
  showHeroLogoBox: boolean;
  logoImage: string;
  logoCaption: LocalizedText;
  showPillarsSection: boolean;
  pillars: AboutPillar[];
  showContactSection: boolean;
  contactHeading: LocalizedText;
  contactSubtitle: LocalizedText;
  phoneLabel: LocalizedText;
  phoneDisplay: string;
  phoneCopyValue: string;
  emailLabel: LocalizedText;
  emailValue: string;
  locationLabel: LocalizedText;
  locationValue: LocalizedText;
  hoursLabel: LocalizedText;
  hoursValue: LocalizedText;
  showContactForm: boolean;
  formHeading: LocalizedText;
  formSubtitle: LocalizedText;
  formSubmitLabel: LocalizedText;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderContact: string;
  subject: string;
  messageBody: string;
  createdAt: string;
  read: boolean;
}

export type AuthProvider = 'guest' | 'phone';

export type AuthStatus = 'guest' | 'customer';

export interface CustomerProfile {
  id: string;
  displayName: string;
  provider: 'phone';
  phone: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AdminCustomerRecord extends CustomerProfile {
  reviewCount: number;
  orderCount: number;
}

export interface AuthProvidersAvailability {
  guestAvailable: boolean;
  phoneAvailable: boolean;
}

