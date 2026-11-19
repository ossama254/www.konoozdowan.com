import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Award,
  Bell,
  Check,
  Code2,
  Coins,
  Compass,
  Copy,
  Database,
  Edit3,
  Eye,
  EyeOff,
  Gift,
  Globe,
  Heart,
  ImagePlus,
  Layers,
  LayoutTemplate,
  Lock,
  MessageSquare,
  PackageCheck,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Trash2,
  Truck,
  Upload,
  Users,
  X,
} from 'lucide-react';
import {
  ADMIN_API_ENDPOINTS,
  FLUTTER_CORE_SNIPPETS,
  FLUTTER_PROJECT_TREE,
  REACT_NATIVE_PROJECT_TREE,
} from '../data/mobileArchitecture';
import { useStore } from '../context/StoreContext';
import {
  AboutPillar,
  AboutPillarIcon,
  AdminCustomerRecord,
  CurrencyConfig,
  DomesticShippingZone,
  HeroBanner,
  InternationalCountryOption,
  LoyaltyReward,
  LoyaltyTier,
  LoyaltyTierConfig,
  NotificationTopic,
  OrderStatus,
  Product,
  SpecialOffer,
  StoreCategory,
} from '../types/store';
import { ProductImage } from './ProductImage';

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        reject(new Error('Empty file'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxDim = 900;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const DEFAULT_FALLBACK_IMAGE = '/src/assets/images/product_sidr_jar_1794959132616.jpg';

export const AdminArchitectureView: React.FC = () => {
  const {
    lang,
    t,
    products,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductWeight,
    updateProductWeight,
    deleteProductWeight,
    updateProductImages,
    resetProductImages,
    orders,
    setOrderStatus,
    promoCodes,
    createPromoCode,
    deletePromoCode,
    offers,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferActive,
    currencies,
    addCurrency,
    updateCurrency,
    deleteCurrency,
    resetCurrencies,
    domesticZones,
    addDomesticZone,
    updateDomesticZone,
    deleteDomesticZone,
    internationalCountries,
    addInternationalCountry,
    updateInternationalCountry,
    deleteInternationalCountry,
    freeShippingThreshold,
    setFreeShippingThreshold,
    formatPrice,
    sendPushNotification,
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
    loyaltyTransactions,
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
    markContactMessageRead,
    deleteContactMessage,
  } = useStore();

  const [tab, setTab] = useState<
    | 'inventory'
    | 'coupons_push'
    | 'shipping_fx'
    | 'home_hero'
    | 'loyalty'
    | 'about_contact'
    | 'customers'
    | 'images'
    | 'blueprint'
  >('inventory');
  const [archStack, setArchStack] = useState<'flutter' | 'rn'>('flutter');
  const [snippetKey, setSnippetKey] = useState<string>('bloc');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});

  // Catalog search & confirmations
  const [catalogSearch, setCatalogSearch] = useState('');
  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState<string | null>(null);

  // Categories CRUD state
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatAr, setEditCatAr] = useState('');
  const [editCatEn, setEditCatEn] = useState('');

  // Add New Product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<string>(categories[0]?.id ?? 'honey');
  const [newProdSubAr, setNewProdSubAr] = useState('');
  const [newProdSubEn, setNewProdSubEn] = useState('');
  const [newProdOriginAr, setNewProdOriginAr] = useState('وادي دوعن، حضرموت');
  const [newProdOriginEn, setNewProdOriginEn] = useState('Wadi Doan, Hadhramaut');
  const [newProdBadgeAr, setNewProdBadgeAr] = useState('عسل طبيعي ١٠٠٪');
  const [newProdBadgeEn, setNewProdBadgeEn] = useState('100% Pure Raw');
  const [newProdSeasonAr, setNewProdSeasonAr] = useState('قطفة جديدة ٢٠٢٦');
  const [newProdSeasonEn, setNewProdSeasonEn] = useState('Fresh 2026 Harvest');
  const [newProdDescAr, setNewProdDescAr] = useState('');
  const [newProdDescEn, setNewProdDescEn] = useState('');
  const [newProdWeightAr, setNewProdWeightAr] = useState('٢٥٠ جم');
  const [newProdWeightEn, setNewProdWeightEn] = useState('250g');
  const [newProdGrams, setNewProdGrams] = useState(250);
  const [newProdPrice, setNewProdPrice] = useState(25000);
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdImage, setNewProdImage] = useState('');

  // Edit Existing Product state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProdDraft, setEditProdDraft] = useState<{
    nameAr: string;
    nameEn: string;
    sku: string;
    category: string;
    subAr: string;
    subEn: string;
    originAr: string;
    originEn: string;
    badgeAr: string;
    badgeEn: string;
    seasonAr: string;
    seasonEn: string;
    shortAr: string;
    shortEn: string;
    fullAr: string;
    fullEn: string;
  } | null>(null);

  // Add new weight option per product
  const [newWeightTargetProdId, setNewWeightTargetProdId] = useState<string | null>(null);
  const [newWeightLabelAr, setNewWeightLabelAr] = useState('١ كجم');
  const [newWeightLabelEn, setNewWeightLabelEn] = useState('1kg');
  const [newWeightGrams, setNewWeightGrams] = useState(1000);
  const [newWeightPrice, setNewWeightPrice] = useState(40000);
  const [newWeightStock, setNewWeightStock] = useState(15);

  // Coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percent' | 'fixed'>('percent');
  const [couponValue, setCouponValue] = useState(15);
  const [couponMin, setCouponMin] = useState(100);

  // Push Notification composer state
  const [pushCategory, setPushCategory] = useState<NotificationTopic>('new_honey');
  const [pushProductId, setPushProductId] = useState<string>('prod-dhabayah-solid');
  const [pushTitleAr, setPushTitleAr] = useState('وصل حديثاً: عسل الضبايه الجامد');
  const [pushBodyAr, setPushBodyAr] = useState(
    'توفّر الآن حصاد عسل الضبايه الجامد الطبيعي ١٠٠٪ — اطلبه الآن بأوزان متعددة.'
  );
  const [pushSegment, setPushSegment] = useState<'all' | 'gold_royal' | 'cart_abandoners'>('all');

  // Special Offer composer & editor state
  const [offerProductId, setOfferProductId] = useState(products[0]?.id ?? 'prod-sidr-royal');
  const [offerWeightId, setOfferWeightId] = useState(
    products[0]?.weightOptions[0]?.id ?? 'w-250'
  );
  const [offerTitleAr, setOfferTitleAr] = useState('');
  const [offerTitleEn, setOfferTitleEn] = useState('');
  const [offerPrice, setOfferPrice] = useState(18000);
  const [offerOriginalPrice, setOfferOriginalPrice] = useState(24000);
  const [offerPromoCode, setOfferPromoCode] = useState('');
  const [offerEndsAtAr, setOfferEndsAtAr] = useState('لفترة محدودة');
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [editOfferDraft, setEditOfferDraft] = useState<{
    titleAr: string;
    titleEn: string;
    productId: string;
    weightId: string;
    offerPrice: number;
    originalPrice: number;
    badgeAr: string;
    badgeEn: string;
    promoCode: string;
    endsAr: string;
    endsEn: string;
  } | null>(null);

  // Exchange Rates CRUD state
  const [currencyDrafts, setCurrencyDrafts] = useState<
    Record<
      string,
      {
        nameAr: string;
        nameEn: string;
        symbolAr: string;
        symbolEn: string;
        yerPerUnit: number;
        decimals: number;
      }
    >
  >({});
  const [newCurrCode, setNewCurrCode] = useState('');
  const [newCurrNameAr, setNewCurrNameAr] = useState('');
  const [newCurrNameEn, setNewCurrNameEn] = useState('');
  const [newCurrSymbolAr, setNewCurrSymbolAr] = useState('');
  const [newCurrSymbolEn, setNewCurrSymbolEn] = useState('');
  const [newCurrYerPerUnit, setNewCurrYerPerUnit] = useState(145);
  const [newCurrDecimals, setNewCurrDecimals] = useState(2);

  // Shipping & Zones CRUD state
  const [thresholdInput, setThresholdInput] = useState<number>(freeShippingThreshold);
  const [zoneDrafts, setZoneDrafts] = useState<
    Record<string, { nameAr: string; nameEn: string; descAr: string; descEn: string; fee: number }>
  >({});
  const [newZoneNameAr, setNewZoneNameAr] = useState('');
  const [newZoneNameEn, setNewZoneNameEn] = useState('');
  const [newZoneDescAr, setNewZoneDescAr] = useState('');
  const [newZoneDescEn, setNewZoneDescEn] = useState('');
  const [newZoneFee, setNewZoneFee] = useState(2000);

  const [countryDrafts, setCountryDrafts] = useState<
    Record<
      string,
      {
        nameAr: string;
        nameEn: string;
        shippingFee: number;
        daysAr: string;
        daysEn: string;
        carrierAr: string;
        carrierEn: string;
      }
    >
  >({});
  const [newCountryNameAr, setNewCountryNameAr] = useState('');
  const [newCountryNameEn, setNewCountryNameEn] = useState('');
  const [newCountryFee, setNewCountryFee] = useState(15000);
  const [newCountryDaysAr, setNewCountryDaysAr] = useState('٤-٦ أيام عمل');
  const [newCountryDaysEn, setNewCountryDaysEn] = useState('4-6 business days');
  const [newCountryCarrierAr, setNewCountryCarrierAr] = useState('DHL إكسبرس الجوي');
  const [newCountryCarrierEn, setNewCountryCarrierEn] = useState('DHL Air Express');

  // Loyalty Program (برنامج حصاد النقاط) full control state
  const [loyaltyTitleAr, setLoyaltyTitleAr] = useState(loyaltySettings.programTitle.ar);
  const [loyaltyTitleEn, setLoyaltyTitleEn] = useState(loyaltySettings.programTitle.en);
  const [loyaltySubtitleAr, setLoyaltySubtitleAr] = useState(loyaltySettings.programSubtitle.ar);
  const [loyaltySubtitleEn, setLoyaltySubtitleEn] = useState(loyaltySettings.programSubtitle.en);
  const [loyaltyRewardsTitleAr, setLoyaltyRewardsTitleAr] = useState(
    loyaltySettings.rewardsSectionTitle.ar
  );
  const [loyaltyRewardsTitleEn, setLoyaltyRewardsTitleEn] = useState(
    loyaltySettings.rewardsSectionTitle.en
  );
  const [loyaltyEarnHintAr, setLoyaltyEarnHintAr] = useState(loyaltySettings.earnHint.ar);
  const [loyaltyEarnHintEn, setLoyaltyEarnHintEn] = useState(loyaltySettings.earnHint.en);
  const [loyaltyPointsPerYer, setLoyaltyPointsPerYer] = useState<number>(
    loyaltySettings.pointsPerYer
  );
  const [loyaltyBannerUrl, setLoyaltyBannerUrl] = useState<string>(
    loyaltySettings.bannerImage ?? ''
  );
  const [tierDrafts, setTierDrafts] = useState<
    Partial<Record<LoyaltyTier, { labelAr: string; labelEn: string; minPoints: number; multiplier: number }>>
  >({});

  const [availPointsInput, setAvailPointsInput] = useState<number>(loyaltyPoints);
  const [lifePointsInput, setLifePointsInput] = useState<number>(lifetimePoints);
  const [bonusDelta, setBonusDelta] = useState<number>(100);
  const [bonusReasonAr, setBonusReasonAr] = useState('مكافأة إدارية لعضو برنامج حصاد النقاط');
  const [bonusReasonEn, setBonusReasonEn] = useState('Admin loyalty bonus points');
  const [bonusAffectLifetime, setBonusAffectLifetime] = useState(true);

  const [showAddReward, setShowAddReward] = useState(false);
  const [newRewardType, setNewRewardType] = useState<'discount' | 'exclusive_product'>('discount');
  const [newRewardTitleAr, setNewRewardTitleAr] = useState('');
  const [newRewardTitleEn, setNewRewardTitleEn] = useState('');
  const [newRewardDescAr, setNewRewardDescAr] = useState('');
  const [newRewardDescEn, setNewRewardDescEn] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState(250);
  const [newRewardStock, setNewRewardStock] = useState(20);
  const [newRewardDiscount, setNewRewardDiscount] = useState(5000);
  const [newRewardMinOrder, setNewRewardMinOrder] = useState(20000);
  const [newRewardWeightAr, setNewRewardWeightAr] = useState('١٠٠ جم');
  const [newRewardWeightEn, setNewRewardWeightEn] = useState('100g');
  const [newRewardImage, setNewRewardImage] = useState('');

  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [confirmDeleteRewardId, setConfirmDeleteRewardId] = useState<string | null>(null);
  const [rewardImageUrlInputs, setRewardImageUrlInputs] = useState<Record<string, string>>({});
  const [editRewardDraft, setEditRewardDraft] = useState<{
    type: 'discount' | 'exclusive_product';
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    pointsCost: number;
    stock: number;
    discountAmount: number;
    minOrderAmount: number;
    weightLabelAr: string;
    weightLabelEn: string;
    productImage: string;
  } | null>(null);

  useEffect(() => {
    setLoyaltyTitleAr(loyaltySettings.programTitle.ar);
    setLoyaltyTitleEn(loyaltySettings.programTitle.en);
    setLoyaltySubtitleAr(loyaltySettings.programSubtitle.ar);
    setLoyaltySubtitleEn(loyaltySettings.programSubtitle.en);
    setLoyaltyRewardsTitleAr(loyaltySettings.rewardsSectionTitle.ar);
    setLoyaltyRewardsTitleEn(loyaltySettings.rewardsSectionTitle.en);
    setLoyaltyEarnHintAr(loyaltySettings.earnHint.ar);
    setLoyaltyEarnHintEn(loyaltySettings.earnHint.en);
    setLoyaltyPointsPerYer(loyaltySettings.pointsPerYer);
    setLoyaltyBannerUrl(loyaltySettings.bannerImage ?? '');
    setTierDrafts({});
  }, [loyaltySettings]);

  useEffect(() => {
    setAvailPointsInput(loyaltyPoints);
    setLifePointsInput(lifetimePoints);
  }, [loyaltyPoints, lifetimePoints]);

  // Home Page & Hero Banners CRUD state
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [newBannerKickerAr, setNewBannerKickerAr] = useState('إصدار موسمي جديد');
  const [newBannerKickerEn, setNewBannerKickerEn] = useState('New Seasonal Release');
  const [newBannerTitleAr, setNewBannerTitleAr] = useState('');
  const [newBannerTitleEn, setNewBannerTitleEn] = useState('');
  const [newBannerSubAr, setNewBannerSubAr] = useState('');
  const [newBannerSubEn, setNewBannerSubEn] = useState('');
  const [newBannerCtaAr, setNewBannerCtaAr] = useState('تسوق الآن');
  const [newBannerCtaEn, setNewBannerCtaEn] = useState('Shop Now');
  const [newBannerCategory, setNewBannerCategory] = useState<string>('honey');
  const [newBannerImage, setNewBannerImage] = useState(DEFAULT_FALLBACK_IMAGE);

  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [confirmDeleteBannerId, setConfirmDeleteBannerId] = useState<string | null>(null);
  const [editBannerDraft, setEditBannerDraft] = useState<{
    kickerAr: string;
    kickerEn: string;
    titleAr: string;
    titleEn: string;
    subAr: string;
    subEn: string;
    ctaAr: string;
    ctaEn: string;
    targetCategory: string;
    image: string;
    active: boolean;
  } | null>(null);

  const [hsDraft, setHsDraft] = useState({
    showSearchBar: homeSettings.showSearchBar,
    searchPlaceholderAr: homeSettings.searchPlaceholder.ar,
    searchPlaceholderEn: homeSettings.searchPlaceholder.en,
    quickTermsAr: homeSettings.quickSearchTerms.ar.join('، '),
    quickTermsEn: homeSettings.quickSearchTerms.en.join(', '),
    showHeroSlider: homeSettings.showHeroSlider,
    tourLabelAr: homeSettings.tourButtonLabel.ar,
    tourLabelEn: homeSettings.tourButtonLabel.en,
    showValueStrip: homeSettings.showValueStrip,
    purityTitleAr: homeSettings.purityTitle.ar,
    purityTitleEn: homeSettings.purityTitle.en,
    puritySubAr: homeSettings.puritySubtitle.ar,
    puritySubEn: homeSettings.puritySubtitle.en,
    loyaltyCtaAr: homeSettings.loyaltyCtaLabel.ar,
    loyaltyCtaEn: homeSettings.loyaltyCtaLabel.en,
    shippingTitleAr: homeSettings.shippingTitle.ar,
    shippingTitleEn: homeSettings.shippingTitle.en,
    offersKickerAr: homeSettings.offersKicker.ar,
    offersKickerEn: homeSettings.offersKicker.en,
    offersHeadingAr: homeSettings.offersHeading.ar,
    offersHeadingEn: homeSettings.offersHeading.en,
    catalogTitleAr: homeSettings.catalogTitle.ar,
    catalogTitleEn: homeSettings.catalogTitle.en,
    catalogSubAr: homeSettings.catalogSubtitle.ar,
    catalogSubEn: homeSettings.catalogSubtitle.en,
  });

  useEffect(() => {
    setHsDraft({
      showSearchBar: homeSettings.showSearchBar,
      searchPlaceholderAr: homeSettings.searchPlaceholder.ar,
      searchPlaceholderEn: homeSettings.searchPlaceholder.en,
      quickTermsAr: homeSettings.quickSearchTerms.ar.join('، '),
      quickTermsEn: homeSettings.quickSearchTerms.en.join(', '),
      showHeroSlider: homeSettings.showHeroSlider,
      tourLabelAr: homeSettings.tourButtonLabel.ar,
      tourLabelEn: homeSettings.tourButtonLabel.en,
      showValueStrip: homeSettings.showValueStrip,
      purityTitleAr: homeSettings.purityTitle.ar,
      purityTitleEn: homeSettings.purityTitle.en,
      puritySubAr: homeSettings.puritySubtitle.ar,
      puritySubEn: homeSettings.puritySubtitle.en,
      loyaltyCtaAr: homeSettings.loyaltyCtaLabel.ar,
      loyaltyCtaEn: homeSettings.loyaltyCtaLabel.en,
      shippingTitleAr: homeSettings.shippingTitle.ar,
      shippingTitleEn: homeSettings.shippingTitle.en,
      offersKickerAr: homeSettings.offersKicker.ar,
      offersKickerEn: homeSettings.offersKicker.en,
      offersHeadingAr: homeSettings.offersHeading.ar,
      offersHeadingEn: homeSettings.offersHeading.en,
      catalogTitleAr: homeSettings.catalogTitle.ar,
      catalogTitleEn: homeSettings.catalogTitle.en,
      catalogSubAr: homeSettings.catalogSubtitle.ar,
      catalogSubEn: homeSettings.catalogSubtitle.en,
    });
  }, [homeSettings]);

  // About & Contact management state
  const [aboutDraft, setAboutDraft] = useState({
    heroKickerAr: aboutSettings.heroKicker.ar,
    heroKickerEn: aboutSettings.heroKicker.en,
    heroTitleAr: aboutSettings.heroTitle.ar,
    heroTitleEn: aboutSettings.heroTitle.en,
    heroDescAr: aboutSettings.heroDescription.ar,
    heroDescEn: aboutSettings.heroDescription.en,
    heroPrimaryCtaAr: aboutSettings.heroPrimaryCta.ar,
    heroPrimaryCtaEn: aboutSettings.heroPrimaryCta.en,
    heroSecondaryCtaAr: aboutSettings.heroSecondaryCta.ar,
    heroSecondaryCtaEn: aboutSettings.heroSecondaryCta.en,
    showHeroLogoBox: aboutSettings.showHeroLogoBox,
    logoImage: aboutSettings.logoImage,
    logoCaptionAr: aboutSettings.logoCaption.ar,
    logoCaptionEn: aboutSettings.logoCaption.en,
    showPillarsSection: aboutSettings.showPillarsSection,
    showContactSection: aboutSettings.showContactSection,
    showContactForm: aboutSettings.showContactForm,
    contactHeadingAr: aboutSettings.contactHeading.ar,
    contactHeadingEn: aboutSettings.contactHeading.en,
    contactSubAr: aboutSettings.contactSubtitle.ar,
    contactSubEn: aboutSettings.contactSubtitle.en,
    phoneLabelAr: aboutSettings.phoneLabel.ar,
    phoneLabelEn: aboutSettings.phoneLabel.en,
    phoneDisplay: aboutSettings.phoneDisplay,
    phoneCopyValue: aboutSettings.phoneCopyValue,
    emailLabelAr: aboutSettings.emailLabel.ar,
    emailLabelEn: aboutSettings.emailLabel.en,
    emailValue: aboutSettings.emailValue,
    locationLabelAr: aboutSettings.locationLabel.ar,
    locationLabelEn: aboutSettings.locationLabel.en,
    locationValueAr: aboutSettings.locationValue.ar,
    locationValueEn: aboutSettings.locationValue.en,
    hoursLabelAr: aboutSettings.hoursLabel.ar,
    hoursLabelEn: aboutSettings.hoursLabel.en,
    hoursValueAr: aboutSettings.hoursValue.ar,
    hoursValueEn: aboutSettings.hoursValue.en,
    formHeadingAr: aboutSettings.formHeading.ar,
    formHeadingEn: aboutSettings.formHeading.en,
    formSubAr: aboutSettings.formSubtitle.ar,
    formSubEn: aboutSettings.formSubtitle.en,
    formSubmitLabelAr: aboutSettings.formSubmitLabel.ar,
    formSubmitLabelEn: aboutSettings.formSubmitLabel.en,
  });

  useEffect(() => {
    setAboutDraft({
      heroKickerAr: aboutSettings.heroKicker.ar,
      heroKickerEn: aboutSettings.heroKicker.en,
      heroTitleAr: aboutSettings.heroTitle.ar,
      heroTitleEn: aboutSettings.heroTitle.en,
      heroDescAr: aboutSettings.heroDescription.ar,
      heroDescEn: aboutSettings.heroDescription.en,
      heroPrimaryCtaAr: aboutSettings.heroPrimaryCta.ar,
      heroPrimaryCtaEn: aboutSettings.heroPrimaryCta.en,
      heroSecondaryCtaAr: aboutSettings.heroSecondaryCta.ar,
      heroSecondaryCtaEn: aboutSettings.heroSecondaryCta.en,
      showHeroLogoBox: aboutSettings.showHeroLogoBox,
      logoImage: aboutSettings.logoImage,
      logoCaptionAr: aboutSettings.logoCaption.ar,
      logoCaptionEn: aboutSettings.logoCaption.en,
      showPillarsSection: aboutSettings.showPillarsSection,
      showContactSection: aboutSettings.showContactSection,
      showContactForm: aboutSettings.showContactForm,
      contactHeadingAr: aboutSettings.contactHeading.ar,
      contactHeadingEn: aboutSettings.contactHeading.en,
      contactSubAr: aboutSettings.contactSubtitle.ar,
      contactSubEn: aboutSettings.contactSubtitle.en,
      phoneLabelAr: aboutSettings.phoneLabel.ar,
      phoneLabelEn: aboutSettings.phoneLabel.en,
      phoneDisplay: aboutSettings.phoneDisplay,
      phoneCopyValue: aboutSettings.phoneCopyValue,
      emailLabelAr: aboutSettings.emailLabel.ar,
      emailLabelEn: aboutSettings.emailLabel.en,
      emailValue: aboutSettings.emailValue,
      locationLabelAr: aboutSettings.locationLabel.ar,
      locationLabelEn: aboutSettings.locationLabel.en,
      locationValueAr: aboutSettings.locationValue.ar,
      locationValueEn: aboutSettings.locationValue.en,
      hoursLabelAr: aboutSettings.hoursLabel.ar,
      hoursLabelEn: aboutSettings.hoursLabel.en,
      hoursValueAr: aboutSettings.hoursValue.ar,
      hoursValueEn: aboutSettings.hoursValue.en,
      formHeadingAr: aboutSettings.formHeading.ar,
      formHeadingEn: aboutSettings.formHeading.en,
      formSubAr: aboutSettings.formSubtitle.ar,
      formSubEn: aboutSettings.formSubtitle.en,
      formSubmitLabelAr: aboutSettings.formSubmitLabel.ar,
      formSubmitLabelEn: aboutSettings.formSubmitLabel.en,
    });
  }, [aboutSettings]);

  const [newPillarIcon, setNewPillarIcon] = useState<AboutPillarIcon>('shield');
  const [newPillarTitleAr, setNewPillarTitleAr] = useState('');
  const [newPillarTitleEn, setNewPillarTitleEn] = useState('');
  const [newPillarTextAr, setNewPillarTextAr] = useState('');
  const [newPillarTextEn, setNewPillarTextEn] = useState('');
  const [confirmDeletePillarId, setConfirmDeletePillarId] = useState<string | null>(null);
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState<string | null>(null);
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null);
  const [editPillarDraft, setEditPillarDraft] = useState<{
    iconKey: AboutPillarIcon;
    titleAr: string;
    titleEn: string;
    textAr: string;
    textEn: string;
    active: boolean;
  } | null>(null);

  // Admin-only Customer Accounts state
  const [adminCustomers, setAdminCustomers] = useState<AdminCustomerRecord[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [confirmDeleteCustId, setConfirmDeleteCustId] = useState<string | null>(null);

  const loadAdminCustomers = async () => {
    setCustomersLoading(true);
    try {
      await fetch('/api/admin/session', { method: 'POST', credentials: 'include' });
      const res = await fetch('/api/admin/customers', { credentials: 'include' });
      if (res.ok) {
        const data = (await res.json()) as { customers?: AdminCustomerRecord[] };
        if (Array.isArray(data.customers)) {
          setAdminCustomers(data.customers);
        }
      }
    } catch {
      // Ignore offline
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminCustomers();
  }, [tab]);

  const handleDeleteAdminCustomer = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setAdminCustomers((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // Ignore error
    }
    setConfirmDeleteCustId(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // --- Categories handlers ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatAr.trim() && !newCatEn.trim()) return;
    const ar = newCatAr.trim() || newCatEn.trim();
    const en = newCatEn.trim() || newCatAr.trim();
    const slug =
      en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || `cat_${Date.now()}`;
    const cat: StoreCategory = {
      id: categories.some((c) => c.id === slug) ? `${slug}_${Date.now()}` : slug,
      label: { ar, en },
    };
    addCategory(cat);
    setNewCatAr('');
    setNewCatEn('');
  };

  // --- Products handlers ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr.trim()) return;
    const prodId = `prod-${Date.now()}`;
    const nameAr = newProdNameAr.trim();
    const nameEn = newProdNameEn.trim() || nameAr;
    const sku = newProdSku.trim() || `KD-${Math.floor(100 + Math.random() * 900)}`;
    const weightId = `w-${newProdGrams || Date.now()}`;

    const created: Product = {
      id: prodId,
      sku,
      category: newProdCategory || categories[0]?.id || 'honey',
      subCategory: {
        ar: newProdSubAr.trim() || 'منتج طبيعي مختار',
        en: newProdSubEn.trim() || 'Curated Natural Harvest',
      },
      name: { ar: nameAr, en: nameEn },
      origin: { ar: newProdOriginAr.trim(), en: newProdOriginEn.trim() || newProdOriginAr.trim() },
      harvestSeason: {
        ar: newProdSeasonAr.trim() || 'قطفة جديدة',
        en: newProdSeasonEn.trim() || 'Fresh Harvest',
      },
      shortDescription: {
        ar: newProdDescAr.trim() || `${nameAr} طبيعي فاخر مختار بعناية من كنوز دوعن.`,
        en: newProdDescEn.trim() || `${nameEn} curated with certified purity from Kunooz Doan.`,
      },
      description: {
        ar: newProdDescAr.trim() || `${nameAr} طبيعي نقي ١٠٠٪، محفوظ ومعبأ وفق أعلى معايير الجودة.`,
        en: newProdDescEn.trim() || `100% natural ${nameEn}, carefully harvested and lab tested.`,
      },
      benefits: [
        {
          ar: 'طبيعي ١٠٠٪ ومفحوص مخبرياً وخالٍ من السكر المضاف',
          en: '100% natural, lab-verified, and free of added sugar',
        },
      ],
      labMetrics: [
        {
          label: { ar: 'النقاء الطبيعي', en: 'Natural Purity' },
          value: '100% Raw',
        },
      ],
      purityBadge: {
        ar: newProdBadgeAr.trim() || 'عسل طبيعي ١٠٠٪',
        en: newProdBadgeEn.trim() || '100% Pure Natural',
      },
      images: [newProdImage.trim() || DEFAULT_FALLBACK_IMAGE],
      weightOptions: [
        {
          id: weightId,
          label: { ar: newProdWeightAr.trim() || '٢٥٠ جم', en: newProdWeightEn.trim() || '250g' },
          grams: Math.max(10, newProdGrams),
          price: Math.max(1, newProdPrice),
          stock: Math.max(0, newProdStock),
        },
      ],
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      isFeatured: true,
      isBestSeller: false,
    };

    addProduct(created);
    setNewProdNameAr('');
    setNewProdNameEn('');
    setNewProdSku('');
    setNewProdSubAr('');
    setNewProdSubEn('');
    setNewProdDescAr('');
    setNewProdDescEn('');
    setNewProdImage('');
    setShowAddProduct(false);
  };

  const openProductEditor = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditProdDraft({
      nameAr: prod.name.ar,
      nameEn: prod.name.en,
      sku: prod.sku,
      category: prod.category,
      subAr: prod.subCategory.ar,
      subEn: prod.subCategory.en,
      originAr: prod.origin.ar,
      originEn: prod.origin.en,
      badgeAr: prod.purityBadge.ar,
      badgeEn: prod.purityBadge.en,
      seasonAr: prod.harvestSeason.ar,
      seasonEn: prod.harvestSeason.en,
      shortAr: prod.shortDescription.ar,
      shortEn: prod.shortDescription.en,
      fullAr: prod.description.ar,
      fullEn: prod.description.en,
    });
  };

  const saveProductEdit = (prodId: string) => {
    if (!editProdDraft) return;
    updateProduct(prodId, {
      name: { ar: editProdDraft.nameAr.trim(), en: editProdDraft.nameEn.trim() },
      sku: editProdDraft.sku.trim(),
      category: editProdDraft.category,
      subCategory: { ar: editProdDraft.subAr.trim(), en: editProdDraft.subEn.trim() },
      origin: { ar: editProdDraft.originAr.trim(), en: editProdDraft.originEn.trim() },
      purityBadge: { ar: editProdDraft.badgeAr.trim(), en: editProdDraft.badgeEn.trim() },
      harvestSeason: { ar: editProdDraft.seasonAr.trim(), en: editProdDraft.seasonEn.trim() },
      shortDescription: { ar: editProdDraft.shortAr.trim(), en: editProdDraft.shortEn.trim() },
      description: { ar: editProdDraft.fullAr.trim(), en: editProdDraft.fullEn.trim() },
    });
    setEditingProductId(null);
    setEditProdDraft(null);
  };

  const handleAddWeightToProduct = (e: React.FormEvent, prodId: string) => {
    e.preventDefault();
    if (!newWeightLabelAr.trim()) return;
    addProductWeight(prodId, {
      id: `w-${Date.now()}`,
      label: {
        ar: newWeightLabelAr.trim(),
        en: newWeightLabelEn.trim() || newWeightLabelAr.trim(),
      },
      grams: Math.max(10, newWeightGrams),
      price: Math.max(1, newWeightPrice),
      stock: Math.max(0, newWeightStock),
    });
    setNewWeightTargetProdId(null);
  };

  // --- Coupons & Push ---
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    createPromoCode({
      code: couponCode.trim().toUpperCase(),
      type: couponType,
      value: couponValue,
      minOrder: couponMin,
      description: {
        ar: `خصم ${couponValue}${couponType === 'percent' ? '%' : ' ر.ي'} (حد أدنى ${couponMin} ر.ي)`,
        en: `${couponValue}${couponType === 'percent' ? '%' : ' YER'} off (min ${couponMin} YER)`,
      },
      active: true,
    });
    setCouponCode('');
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitleAr.trim() || !pushBodyAr.trim()) return;
    sendPushNotification(
      { ar: pushTitleAr.trim(), en: pushTitleAr.trim() },
      { ar: pushBodyAr.trim(), en: pushBodyAr.trim() },
      pushSegment,
      {
        category: pushCategory,
        targetView:
          pushCategory === 'seasonal_discount'
            ? 'offers'
            : pushCategory === 'loyalty'
            ? 'profile'
            : 'home',
        productId: pushCategory === 'new_honey' && pushProductId ? pushProductId : undefined,
      }
    );
  };

  // --- Offers CRUD ---
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd = products.find((p) => p.id === offerProductId) ?? products[0];
    if (!targetProd || !offerTitleAr.trim()) return;
    const orig = Math.max(offerOriginalPrice, offerPrice + 1);
    const save = orig - offerPrice;
    const chosenWeight =
      targetProd.weightOptions.find((w) => w.id === offerWeightId) ?? targetProd.weightOptions[0];
    createOffer({
      id: `offer-${Date.now()}`,
      title: {
        ar: offerTitleAr.trim(),
        en: offerTitleEn.trim() || offerTitleAr.trim(),
      },
      subtitle: targetProd.shortDescription,
      badgeText: { ar: `عرض خاص · وفر ${save} ر.ي`, en: `Special Deal · Save ${save} YER` },
      productId: targetProd.id,
      weightId: chosenWeight?.id ?? 'w-250',
      offerPrice: Math.max(1, offerPrice),
      originalPrice: orig,
      promoCode: offerPromoCode.trim() ? offerPromoCode.trim().toUpperCase() : undefined,
      endsAtLabel: {
        ar: offerEndsAtAr.trim() || 'لفترة محدودة',
        en: 'Limited time offer',
      },
      active: true,
    });
    setOfferTitleAr('');
    setOfferTitleEn('');
    setOfferPromoCode('');
  };

  const startEditOffer = (o: SpecialOffer) => {
    setEditingOfferId(o.id);
    setEditOfferDraft({
      titleAr: o.title.ar,
      titleEn: o.title.en,
      productId: o.productId,
      weightId: o.weightId,
      offerPrice: o.offerPrice,
      originalPrice: o.originalPrice,
      badgeAr: o.badgeText.ar,
      badgeEn: o.badgeText.en,
      promoCode: o.promoCode ?? '',
      endsAr: o.endsAtLabel.ar,
      endsEn: o.endsAtLabel.en,
    });
  };

  const saveEditOffer = (offerId: string) => {
    if (!editOfferDraft) return;
    const orig = Math.max(editOfferDraft.originalPrice, editOfferDraft.offerPrice + 1);
    updateOffer(offerId, {
      title: {
        ar: editOfferDraft.titleAr.trim(),
        en: editOfferDraft.titleEn.trim() || editOfferDraft.titleAr.trim(),
      },
      productId: editOfferDraft.productId,
      weightId: editOfferDraft.weightId,
      offerPrice: Math.max(1, editOfferDraft.offerPrice),
      originalPrice: orig,
      badgeText: {
        ar: editOfferDraft.badgeAr.trim() || `وفر ${orig - editOfferDraft.offerPrice} ر.ي`,
        en: editOfferDraft.badgeEn.trim() || `Save ${orig - editOfferDraft.offerPrice} YER`,
      },
      promoCode: editOfferDraft.promoCode.trim()
        ? editOfferDraft.promoCode.trim().toUpperCase()
        : undefined,
      endsAtLabel: {
        ar: editOfferDraft.endsAr.trim() || 'لفترة محدودة',
        en: editOfferDraft.endsEn.trim() || 'Limited time',
      },
    });
    setEditingOfferId(null);
    setEditOfferDraft(null);
  };

  // --- Exchange Rates helpers ---
  const getCurrencyDraft = (c: CurrencyConfig) =>
    currencyDrafts[c.code] ?? {
      nameAr: c.name.ar,
      nameEn: c.name.en,
      symbolAr: c.symbol.ar,
      symbolEn: c.symbol.en,
      yerPerUnit: c.yerPerUnit,
      decimals: c.decimals,
    };

  const updateCurrencyDraftField = (
    c: CurrencyConfig,
    field: keyof ReturnType<typeof getCurrencyDraft>,
    val: string | number
  ) => {
    const curr = getCurrencyDraft(c);
    setCurrencyDrafts((prev) => ({
      ...prev,
      [c.code]: { ...curr, [field]: val },
    }));
  };

  const handleAddCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCurrCode.trim().toUpperCase();
    if (!code || !newCurrNameAr.trim()) return;
    addCurrency({
      code,
      name: { ar: newCurrNameAr.trim(), en: newCurrNameEn.trim() || code },
      symbol: {
        ar: newCurrSymbolAr.trim() || code,
        en: newCurrSymbolEn.trim() || newCurrSymbolAr.trim() || code,
      },
      yerPerUnit: Math.max(0.01, newCurrYerPerUnit),
      decimals: Math.max(0, Math.min(4, newCurrDecimals)),
      isBase: false,
    });
    setNewCurrCode('');
    setNewCurrNameAr('');
    setNewCurrNameEn('');
    setNewCurrSymbolAr('');
    setNewCurrSymbolEn('');
  };

  // --- Shipping Zones helpers ---
  const getZoneDraft = (z: DomesticShippingZone) =>
    zoneDrafts[z.id] ?? {
      nameAr: z.name.ar,
      nameEn: z.name.en,
      descAr: z.description.ar,
      descEn: z.description.en,
      fee: z.fee,
    };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneNameAr.trim()) return;
    const ar = newZoneNameAr.trim();
    const en = newZoneNameEn.trim() || ar;
    addDomesticZone({
      id: `zone_${Date.now()}`,
      name: { ar, en },
      description: {
        ar: newZoneDescAr.trim() || 'توصيل محلي سريع ومبرد',
        en: newZoneDescEn.trim() || 'Fast chilled local delivery',
      },
      fee: Math.max(0, newZoneFee),
    });
    setNewZoneNameAr('');
    setNewZoneNameEn('');
    setNewZoneDescAr('');
    setNewZoneDescEn('');
  };

  const getCountryDraft = (c: InternationalCountryOption) =>
    countryDrafts[c.id] ?? {
      nameAr: c.name.ar,
      nameEn: c.name.en,
      shippingFee: c.shippingFee,
      daysAr: c.estimatedDays.ar,
      daysEn: c.estimatedDays.en,
      carrierAr: c.carrier.ar,
      carrierEn: c.carrier.en,
    };

  const handleAddCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryNameAr.trim()) return;
    const ar = newCountryNameAr.trim();
    const en = newCountryNameEn.trim() || ar;
    addInternationalCountry({
      id: `country_${Date.now()}`,
      name: { ar, en },
      shippingFee: Math.max(0, newCountryFee),
      estimatedDays: { ar: newCountryDaysAr.trim(), en: newCountryDaysEn.trim() },
      carrier: { ar: newCountryCarrierAr.trim(), en: newCountryCarrierEn.trim() },
    });
    setNewCountryNameAr('');
    setNewCountryNameEn('');
  };

  const filteredCatalogProducts = products.filter((p) => {
    const q = catalogSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.ar.toLowerCase().includes(q) ||
      p.name.en.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  const selectedOfferProd = products.find((p) => p.id === offerProductId) ?? products[0];

  // --- Loyalty Admin helpers ---
  const getTierDraft = (tier: LoyaltyTierConfig) =>
    tierDrafts[tier.id] ?? {
      labelAr: tier.label.ar,
      labelEn: tier.label.en,
      minPoints: tier.minPoints,
      multiplier: tier.multiplier,
    };

  const handleSaveLoyaltySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoyaltySettings({
      programTitle: {
        ar: loyaltyTitleAr.trim() || 'برنامج حصاد النقاط',
        en: loyaltyTitleEn.trim() || 'Harvest Points Loyalty',
      },
      programSubtitle: {
        ar: loyaltySubtitleAr.trim(),
        en: loyaltySubtitleEn.trim(),
      },
      rewardsSectionTitle: {
        ar: loyaltyRewardsTitleAr.trim() || 'مكافآت برنامج حصاد النقاط',
        en: loyaltyRewardsTitleEn.trim() || 'Harvest Points Rewards',
      },
      earnHint: {
        ar: loyaltyEarnHintAr.trim(),
        en: loyaltyEarnHintEn.trim(),
      },
      pointsPerYer: Math.max(0.01, Number(loyaltyPointsPerYer) || 1),
      bannerImage: loyaltyBannerUrl.trim() || undefined,
    });
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitleAr.trim() && !newRewardTitleEn.trim()) return;
    const titleAr = newRewardTitleAr.trim() || newRewardTitleEn.trim();
    const titleEn = newRewardTitleEn.trim() || titleAr;
    const descAr = newRewardDescAr.trim() || titleAr;
    const descEn = newRewardDescEn.trim() || titleEn;

    const reward: LoyaltyReward = {
      id: `rew-${Date.now()}`,
      type: newRewardType,
      title: { ar: titleAr, en: titleEn },
      description: { ar: descAr, en: descEn },
      pointsCost: Math.max(1, Number(newRewardPoints) || 100),
      stock: Math.max(0, Number(newRewardStock) || 0),
      ...(newRewardType === 'discount'
        ? {
            discountAmount: Math.max(100, Number(newRewardDiscount) || 1000),
            minOrderAmount: Math.max(0, Number(newRewardMinOrder) || 0),
          }
        : {
            weightLabel: {
              ar: newRewardWeightAr.trim() || '١٠٠ جم',
              en: newRewardWeightEn.trim() || '100g',
            },
          }),
      ...(newRewardImage.trim() ? { productImage: newRewardImage.trim() } : {}),
    };

    addLoyaltyReward(reward);
    setNewRewardTitleAr('');
    setNewRewardTitleEn('');
    setNewRewardDescAr('');
    setNewRewardDescEn('');
    setNewRewardImage('');
    setShowAddReward(false);
  };

  const openRewardEditor = (rew: LoyaltyReward) => {
    setEditingRewardId(rew.id);
    setEditRewardDraft({
      type: rew.type,
      titleAr: rew.title.ar,
      titleEn: rew.title.en,
      descAr: rew.description.ar,
      descEn: rew.description.en,
      pointsCost: rew.pointsCost,
      stock: rew.stock,
      discountAmount: rew.discountAmount ?? 5000,
      minOrderAmount: rew.minOrderAmount ?? 20000,
      weightLabelAr: rew.weightLabel?.ar ?? '١٠٠ جم',
      weightLabelEn: rew.weightLabel?.en ?? '100g',
      productImage: rew.productImage ?? '',
    });
  };

  const saveRewardEdit = (rewardId: string) => {
    if (!editRewardDraft) return;
    updateLoyaltyReward(rewardId, {
      type: editRewardDraft.type,
      title: {
        ar: editRewardDraft.titleAr.trim() || editRewardDraft.titleEn.trim(),
        en: editRewardDraft.titleEn.trim() || editRewardDraft.titleAr.trim(),
      },
      description: {
        ar: editRewardDraft.descAr.trim() || editRewardDraft.descEn.trim(),
        en: editRewardDraft.descEn.trim() || editRewardDraft.descAr.trim(),
      },
      pointsCost: Math.max(1, Number(editRewardDraft.pointsCost) || 1),
      stock: Math.max(0, Number(editRewardDraft.stock) || 0),
      ...(editRewardDraft.type === 'discount'
        ? {
            discountAmount: Math.max(1, Number(editRewardDraft.discountAmount) || 1000),
            minOrderAmount: Math.max(0, Number(editRewardDraft.minOrderAmount) || 0),
            weightLabel: undefined,
          }
        : {
            weightLabel: {
              ar: editRewardDraft.weightLabelAr.trim() || '١٠٠ جم',
              en: editRewardDraft.weightLabelEn.trim() || '100g',
            },
            discountAmount: undefined,
            minOrderAmount: undefined,
          }),
      productImage: editRewardDraft.productImage.trim() || undefined,
    });
    setEditingRewardId(null);
    setEditRewardDraft(null);
  };

  // --- Home & Hero Banners handlers ---
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitleAr.trim() && !newBannerTitleEn.trim()) return;
    const titleAr = newBannerTitleAr.trim() || newBannerTitleEn.trim();
    const titleEn = newBannerTitleEn.trim() || titleAr;
    const banner: HeroBanner = {
      id: `banner-${Date.now()}`,
      kicker: {
        ar: newBannerKickerAr.trim() || 'موسم الحصاد',
        en: newBannerKickerEn.trim() || 'Seasonal Harvest',
      },
      title: { ar: titleAr, en: titleEn },
      subtitle: {
        ar: newBannerSubAr.trim() || titleAr,
        en: newBannerSubEn.trim() || titleEn,
      },
      cta: {
        ar: newBannerCtaAr.trim() || 'تسوق الآن',
        en: newBannerCtaEn.trim() || 'Shop Now',
      },
      targetCategory: newBannerCategory || 'all',
      image: newBannerImage.trim() || DEFAULT_FALLBACK_IMAGE,
      active: true,
    };
    addHeroBanner(banner);
    setNewBannerTitleAr('');
    setNewBannerTitleEn('');
    setNewBannerSubAr('');
    setNewBannerSubEn('');
    setShowAddBanner(false);
  };

  const openBannerEditor = (b: HeroBanner) => {
    setEditingBannerId(b.id);
    setEditBannerDraft({
      kickerAr: b.kicker.ar,
      kickerEn: b.kicker.en,
      titleAr: b.title.ar,
      titleEn: b.title.en,
      subAr: b.subtitle.ar,
      subEn: b.subtitle.en,
      ctaAr: b.cta.ar,
      ctaEn: b.cta.en,
      targetCategory: b.targetCategory,
      image: b.image,
      active: b.active,
    });
  };

  const saveBannerEdit = (id: string) => {
    if (!editBannerDraft) return;
    updateHeroBanner(id, {
      kicker: {
        ar: editBannerDraft.kickerAr.trim() || editBannerDraft.kickerEn.trim(),
        en: editBannerDraft.kickerEn.trim() || editBannerDraft.kickerAr.trim(),
      },
      title: {
        ar: editBannerDraft.titleAr.trim() || editBannerDraft.titleEn.trim(),
        en: editBannerDraft.titleEn.trim() || editBannerDraft.titleAr.trim(),
      },
      subtitle: {
        ar: editBannerDraft.subAr.trim() || editBannerDraft.subEn.trim(),
        en: editBannerDraft.subEn.trim() || editBannerDraft.subAr.trim(),
      },
      cta: {
        ar: editBannerDraft.ctaAr.trim() || 'تسوق الآن',
        en: editBannerDraft.ctaEn.trim() || 'Shop Now',
      },
      targetCategory: editBannerDraft.targetCategory || 'all',
      image: editBannerDraft.image.trim() || DEFAULT_FALLBACK_IMAGE,
      active: editBannerDraft.active,
    });
    setEditingBannerId(null);
    setEditBannerDraft(null);
  };

  const handleSaveHomeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const parseTerms = (raw: string) =>
      raw
        .split(/[،,]/)
        .map((s) => s.trim())
        .filter(Boolean);

    const arTerms = parseTerms(hsDraft.quickTermsAr);
    const enTerms = parseTerms(hsDraft.quickTermsEn);

    updateHomeSettings({
      showSearchBar: hsDraft.showSearchBar,
      searchPlaceholder: {
        ar: hsDraft.searchPlaceholderAr.trim(),
        en: hsDraft.searchPlaceholderEn.trim(),
      },
      quickSearchTerms: {
        ar: arTerms.length > 0 ? arTerms : ['سدر', 'دوعن', 'الضبايه'],
        en: enTerms.length > 0 ? enTerms : ['Sidr', 'Doan', 'Dhabayah'],
      },
      showHeroSlider: hsDraft.showHeroSlider,
      tourButtonLabel: {
        ar: hsDraft.tourLabelAr.trim() || 'جولة المتجر',
        en: hsDraft.tourLabelEn.trim() || 'App Tour',
      },
      showValueStrip: hsDraft.showValueStrip,
      purityTitle: {
        ar: hsDraft.purityTitleAr.trim(),
        en: hsDraft.purityTitleEn.trim(),
      },
      puritySubtitle: {
        ar: hsDraft.puritySubAr.trim(),
        en: hsDraft.puritySubEn.trim(),
      },
      loyaltyCtaLabel: {
        ar: hsDraft.loyaltyCtaAr.trim(),
        en: hsDraft.loyaltyCtaEn.trim(),
      },
      shippingTitle: {
        ar: hsDraft.shippingTitleAr.trim(),
        en: hsDraft.shippingTitleEn.trim(),
      },
      offersKicker: {
        ar: hsDraft.offersKickerAr.trim(),
        en: hsDraft.offersKickerEn.trim(),
      },
      offersHeading: {
        ar: hsDraft.offersHeadingAr.trim(),
        en: hsDraft.offersHeadingEn.trim(),
      },
      catalogTitle: {
        ar: hsDraft.catalogTitleAr.trim(),
        en: hsDraft.catalogTitleEn.trim(),
      },
      catalogSubtitle: {
        ar: hsDraft.catalogSubAr.trim(),
        en: hsDraft.catalogSubEn.trim(),
      },
    });
  };

  // --- About & Contact handlers ---
  const handleSaveAboutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutSettings({
      heroKicker: { ar: aboutDraft.heroKickerAr.trim(), en: aboutDraft.heroKickerEn.trim() },
      heroTitle: { ar: aboutDraft.heroTitleAr.trim(), en: aboutDraft.heroTitleEn.trim() },
      heroDescription: { ar: aboutDraft.heroDescAr.trim(), en: aboutDraft.heroDescEn.trim() },
      heroPrimaryCta: {
        ar: aboutDraft.heroPrimaryCtaAr.trim(),
        en: aboutDraft.heroPrimaryCtaEn.trim(),
      },
      heroSecondaryCta: {
        ar: aboutDraft.heroSecondaryCtaAr.trim(),
        en: aboutDraft.heroSecondaryCtaEn.trim(),
      },
      showHeroLogoBox: aboutDraft.showHeroLogoBox,
      logoImage:
        aboutDraft.logoImage.trim() ||
        '/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg',
      logoCaption: { ar: aboutDraft.logoCaptionAr.trim(), en: aboutDraft.logoCaptionEn.trim() },
      showPillarsSection: aboutDraft.showPillarsSection,
      showContactSection: aboutDraft.showContactSection,
      showContactForm: aboutDraft.showContactForm,
      contactHeading: {
        ar: aboutDraft.contactHeadingAr.trim(),
        en: aboutDraft.contactHeadingEn.trim(),
      },
      contactSubtitle: { ar: aboutDraft.contactSubAr.trim(), en: aboutDraft.contactSubEn.trim() },
      phoneLabel: { ar: aboutDraft.phoneLabelAr.trim(), en: aboutDraft.phoneLabelEn.trim() },
      phoneDisplay: aboutDraft.phoneDisplay.trim(),
      phoneCopyValue: aboutDraft.phoneCopyValue.trim(),
      emailLabel: { ar: aboutDraft.emailLabelAr.trim(), en: aboutDraft.emailLabelEn.trim() },
      emailValue: aboutDraft.emailValue.trim(),
      locationLabel: {
        ar: aboutDraft.locationLabelAr.trim(),
        en: aboutDraft.locationLabelEn.trim(),
      },
      locationValue: {
        ar: aboutDraft.locationValueAr.trim(),
        en: aboutDraft.locationValueEn.trim(),
      },
      hoursLabel: { ar: aboutDraft.hoursLabelAr.trim(), en: aboutDraft.hoursLabelEn.trim() },
      hoursValue: { ar: aboutDraft.hoursValueAr.trim(), en: aboutDraft.hoursValueEn.trim() },
      formHeading: { ar: aboutDraft.formHeadingAr.trim(), en: aboutDraft.formHeadingEn.trim() },
      formSubtitle: { ar: aboutDraft.formSubAr.trim(), en: aboutDraft.formSubEn.trim() },
      formSubmitLabel: {
        ar: aboutDraft.formSubmitLabelAr.trim() || 'إرسال الرسالة',
        en: aboutDraft.formSubmitLabelEn.trim() || 'Send Message',
      },
    });
  };

  const handleUploadAboutLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setAboutDraft((prev) => ({ ...prev, logoImage: dataUrl }));
      updateAboutSettings({ logoImage: dataUrl });
    } catch {
      // Ignore error
    } finally {
      e.target.value = '';
    }
  };

  const handleAddPillar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPillarTitleAr.trim() && !newPillarTitleEn.trim()) return;
    const titleAr = newPillarTitleAr.trim() || newPillarTitleEn.trim();
    const titleEn = newPillarTitleEn.trim() || newPillarTitleAr.trim();
    const textAr = newPillarTextAr.trim() || newPillarTextEn.trim();
    const textEn = newPillarTextEn.trim() || newPillarTextAr.trim();

    addAboutPillar({
      id: `pillar-${Date.now()}`,
      iconKey: newPillarIcon,
      title: { ar: titleAr, en: titleEn },
      text: { ar: textAr, en: textEn },
      active: true,
    });
    setNewPillarTitleAr('');
    setNewPillarTitleEn('');
    setNewPillarTextAr('');
    setNewPillarTextEn('');
  };

  const startEditPillar = (pillar: AboutPillar) => {
    setEditingPillarId(pillar.id);
    setEditPillarDraft({
      iconKey: pillar.iconKey,
      titleAr: pillar.title.ar,
      titleEn: pillar.title.en,
      textAr: pillar.text.ar,
      textEn: pillar.text.en,
      active: pillar.active,
    });
  };

  const savePillarEdit = (id: string) => {
    if (!editPillarDraft) return;
    updateAboutPillar(id, {
      iconKey: editPillarDraft.iconKey,
      title: {
        ar: editPillarDraft.titleAr.trim() || editPillarDraft.titleEn.trim(),
        en: editPillarDraft.titleEn.trim() || editPillarDraft.titleAr.trim(),
      },
      text: {
        ar: editPillarDraft.textAr.trim() || editPillarDraft.textEn.trim(),
        en: editPillarDraft.textEn.trim() || editPillarDraft.textAr.trim(),
      },
      active: editPillarDraft.active,
    });
    setEditingPillarId(null);
    setEditPillarDraft(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-1">
        <h1 className="text-2xl font-bold text-[#1F2937]">
          {lang === 'ar'
            ? 'لوحة التحكم الكاملة والإدارة'
            : 'Full Store Administration & Operations'}
        </h1>
        <p className="text-xs sm:text-sm text-[#1F2937]/65">
          {lang === 'ar'
            ? 'تحكم كامل بإضافة وتعديل وحذف جميع الأصناف، الأقسام، الأوزان، العروض، الكوبونات، أسعار الشحن، وأسعار الصرف للعملات.'
            : 'Full CRUD control over products, categories, weights, offers, coupons, domestic & global shipping rates, and live currency exchange rates.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setTab('inventory')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'inventory'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الأصناف والأقسام والطلبات' : 'Products, Categories & Orders'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('coupons_push')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'coupons_push'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>{lang === 'ar' ? 'العروض والكوبونات والإشعارات' : 'Offers, Coupons & Push'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('shipping_fx')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'shipping_fx'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>{lang === 'ar' ? 'أسعار الصرف والشحن' : 'Exchange Rates & Shipping'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('home_hero')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'home_hero'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الواجهة الرئيسية والسلايدر' : 'Home & Hero Banners'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('loyalty')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'loyalty'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'ar' ? 'برنامج حصاد النقاط' : 'Harvest Points Loyalty'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('about_contact')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'about_contact'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{lang === 'ar' ? 'من نحن وتواصل معنا' : 'About & Contact'}</span>
          {contactMessages.filter((m) => !m.read).length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
              {contactMessages.filter((m) => !m.read).length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab('customers')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'customers'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === 'ar' ? 'بيانات العملاء' : 'Customers (Admin)'}</span>
          {adminCustomers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#1F2937]/15 text-[11px] font-bold tabular-nums">
              {adminCustomers.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab('images')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'images'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <ImagePlus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'صور المنتجات' : 'Product Images'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('blueprint')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'blueprint'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>{lang === 'ar' ? 'هيكلة الكود والبيانات (JSON)' : 'Architecture & JSON'}</span>
        </button>
      </div>

      {/* TAB 1: CATEGORIES, PRODUCTS FULL CRUD & ORDERS */}
      {tab === 'inventory' && (
        <div className="space-y-6">
          {/* Categories Management */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D97706]" />
                <span>{lang === 'ar' ? 'إدارة أقسام وتصنيفات المتجر' : 'Store Categories CRUD'}</span>
              </h2>
              <span className="text-xs text-[#1F2937]/60 tabular-nums">
                {categories.length} {lang === 'ar' ? 'أقسام نشطة' : 'active categories'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isEditing = editingCatId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-2xl bg-[#FFFBEB]/70 border border-[#E5DEC9] space-y-2 text-xs"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editCatAr}
                          onChange={(e) => setEditCatAr(e.target.value)}
                          placeholder={lang === 'ar' ? 'الاسم بالعربي' : 'Arabic name'}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white text-xs"
                        />
                        <input
                          type="text"
                          value={editCatEn}
                          onChange={(e) => setEditCatEn(e.target.value)}
                          placeholder="English name"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white text-xs"
                        />
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (!editCatAr.trim()) return;
                              updateCategory(cat.id, {
                                ar: editCatAr.trim(),
                                en: editCatEn.trim() || editCatAr.trim(),
                              });
                              setEditingCatId(null);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-[#4D7C0F] text-white font-semibold"
                          >
                            {lang === 'ar' ? 'حفظ' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E5DEC9]"
                          >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-bold text-[#1F2937] truncate">{t(cat.label)}</div>
                          <div className="text-[11px] text-[#1F2937]/55 font-mono-code truncate">
                            {cat.id}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCatId(cat.id);
                              setEditCatAr(cat.label.ar);
                              setEditCatEn(cat.label.en);
                            }}
                            aria-label={lang === 'ar' ? 'تعديل القسم' : 'Edit category'}
                            className="p-1.5 rounded-lg bg-white border border-[#E5DEC9] hover:border-[#D97706] text-[#1F2937]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {categories.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteCategory(cat.id)}
                              aria-label={lang === 'ar' ? 'حذف القسم' : 'Delete category'}
                              className="p-1.5 rounded-lg bg-white border border-[#E5DEC9] hover:border-red-300 text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs pt-1">
              <input
                type="text"
                required
                value={newCatAr}
                onChange={(e) => setNewCatAr(e.target.value)}
                placeholder={lang === 'ar' ? 'اسم القسم الجديد (عربي) *' : 'New Category Name (AR) *'}
                className="sm:col-span-5 min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs"
              />
              <input
                type="text"
                value={newCatEn}
                onChange={(e) => setNewCatEn(e.target.value)}
                placeholder={lang === 'ar' ? 'اسم القسم (إنجليزي)' : 'Category Name (EN)'}
                className="sm:col-span-5 min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs"
              />
              <button
                type="submit"
                className="sm:col-span-2 min-h-[40px] px-4 rounded-xl bg-[#1F2937] hover:bg-black text-white font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة قسم' : 'Add Category'}</span>
              </button>
            </form>
          </div>

          {/* Products Full CRUD Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1F2937]">
                  {lang === 'ar'
                    ? 'إدارة جميع الأصناف والأوزان والأسعار'
                    : 'All Products, Weights & Inventory Control'}
                </h2>
                <p className="text-xs text-[#1F2937]/65 tabular-nums">
                  {products.length}{' '}
                  {lang === 'ar'
                    ? 'صنف متوفر — التعديلات تنعكس فوراً في المتجر والسلة'
                    : 'products active — changes sync immediately across store'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#1F2937]/45 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
                  <input
                    type="search"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'بحث بالاسم أو SKU...' : 'Filter products...'}
                    className="min-h-[40px] ps-8 pe-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs focus:outline-none focus:border-[#D97706]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProduct((v) => !v)}
                  className="min-h-[40px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  {showAddProduct ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{lang === 'ar' ? 'إضافة صنف جديد' : 'Add New Product'}</span>
                </button>
              </div>
            </div>

            {/* Add New Product Form */}
            {showAddProduct && (
              <form
                onSubmit={handleAddProduct}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFFBEB] border border-[#D97706]/40 space-y-4 text-xs"
              >
                <div className="font-bold text-sm text-[#1F2937]">
                  {lang === 'ar' ? 'بيانات الصنف الجديد' : 'New Product Details'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'اسم الصنف (عربي) *' : 'Product Name (AR) *'}</span>
                    <input
                      type="text"
                      required
                      value={newProdNameAr}
                      onChange={(e) => setNewProdNameAr(e.target.value)}
                      placeholder="مثال: عسل المراعي الدوعني"
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'اسم الصنف (إنجليزي)' : 'Product Name (EN)'}</span>
                    <input
                      type="text"
                      value={newProdNameEn}
                      onChange={(e) => setNewProdNameEn(e.target.value)}
                      placeholder="Doan Pasture Honey"
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'القسم' : 'Category'}</span>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {t(cat.label)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'التصنيف الفرعي (عربي)' : 'Subcategory (AR)'}</span>
                    <input
                      type="text"
                      value={newProdSubAr}
                      onChange={(e) => setNewProdSubAr(e.target.value)}
                      placeholder="عسل طبيعي"
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'المصدر / الموطن (عربي)' : 'Origin (AR)'}</span>
                    <input
                      type="text"
                      value={newProdOriginAr}
                      onChange={(e) => setNewProdOriginAr(e.target.value)}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'رمز الصنف (SKU)' : 'SKU'}</span>
                    <input
                      type="text"
                      dir="ltr"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value)}
                      placeholder="KD-NEW-016"
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white uppercase"
                    />
                  </label>

                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'شارة الجودة' : 'Purity Badge'}</span>
                    <input
                      type="text"
                      value={newProdBadgeAr}
                      onChange={(e) => setNewProdBadgeAr(e.target.value)}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'موسم الحصاد' : 'Harvest Season'}</span>
                    <input
                      type="text"
                      value={newProdSeasonAr}
                      onChange={(e) => setNewProdSeasonAr(e.target.value)}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'المصدر (إنجليزي)' : 'Origin (EN)'}</span>
                    <input
                      type="text"
                      value={newProdOriginEn}
                      onChange={(e) => setNewProdOriginEn(e.target.value)}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  <label className="sm:col-span-2 lg:col-span-3 space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'وصف الصنف (عربي)' : 'Description (AR)'}</span>
                    <textarea
                      rows={2}
                      value={newProdDescAr}
                      onChange={(e) => setNewProdDescAr(e.target.value)}
                      placeholder={
                        lang === 'ar'
                          ? 'وصف مختصر عن جودة الصنف ومصدره وفوائده...'
                          : 'Short product description...'
                      }
                      className="w-full p-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                </div>

                {/* First weight + image */}
                <div className="pt-2 border-t border-[#E5DEC9] grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'الوزن الأساسي (عربي)' : 'Weight Label (AR)'}</span>
                    <input
                      type="text"
                      value={newProdWeightAr}
                      onChange={(e) => setNewProdWeightAr(e.target.value)}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'الوزن بالجرام' : 'Grams'}</span>
                    <input
                      type="number"
                      min={10}
                      value={newProdGrams}
                      onChange={(e) => setNewProdGrams(Number(e.target.value))}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'السعر (ر.ي)' : 'Price (YER)'}</span>
                    <input
                      type="number"
                      min={1}
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
                    />
                  </label>
                  <label className="space-y-1 font-semibold">
                    <span>{lang === 'ar' ? 'المخزون' : 'Stock'}</span>
                    <input
                      type="number"
                      min={0}
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(Number(e.target.value))}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <label className="sm:col-span-4 min-h-[40px] px-3 rounded-xl border border-dashed border-[#D97706] bg-white flex items-center justify-center gap-2 font-semibold cursor-pointer">
                    <Upload className="w-4 h-4 text-[#D97706]" />
                    <span>{lang === 'ar' ? 'رفع صورة من الجهاز' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (!file) return;
                        const dataUrl = await compressImageFile(file);
                        setNewProdImage(dataUrl);
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder={
                      lang === 'ar' ? 'أو ضع رابط صورة اختياري...' : 'Or paste optional image URL...'
                    }
                    className="sm:col-span-5 min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-3 min-h-[40px] px-4 rounded-xl bg-[#4D7C0F] hover:bg-[#3f660c] text-white font-semibold"
                  >
                    {lang === 'ar' ? 'حفظ وإضافة الصنف' : 'Create Product'}
                  </button>
                </div>
              </form>
            )}

            {/* Existing Products List */}
            <div className="space-y-4">
              {filteredCatalogProducts.map((prod) => {
                const isEditingProd = editingProductId === prod.id && editProdDraft;
                const isAddingWeight = newWeightTargetProdId === prod.id;
                const isConfirmDelete = confirmDeleteProdId === prod.id;
                const catObj = categories.find((c) => c.id === prod.category);

                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#E5DEC9] shrink-0">
                          <ProductImage
                            src={prod.images[0] ?? DEFAULT_FALLBACK_IMAGE}
                            alt={t(prod.name)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-[#1F2937] truncate">
                            {t(prod.name)}
                          </div>
                          <div className="text-xs text-[#1F2937]/60 flex flex-wrap items-center gap-2">
                            <span className="font-mono-code">{prod.sku}</span>
                            <span>·</span>
                            <span className="text-[#4D7C0F] font-semibold">
                              {catObj ? t(catObj.label) : prod.category}
                            </span>
                            <span>·</span>
                            <span>{t(prod.origin)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            isEditingProd ? setEditingProductId(null) : openProductEditor(prod)
                          }
                          className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] font-semibold text-[#1F2937] inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>
                            {isEditingProd
                              ? lang === 'ar'
                                ? 'إغلاق التعديل'
                                : 'Close Edit'
                              : lang === 'ar'
                              ? 'تعديل الصنف'
                              : 'Edit'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setNewWeightTargetProdId(isAddingWeight ? null : prod.id)
                          }
                          className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#4D7C0F] font-semibold text-[#4D7C0F] inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'إضافة وزن' : 'Add Weight'}</span>
                        </button>

                        {isConfirmDelete ? (
                          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl">
                            <span className="text-red-700 font-semibold">
                              {lang === 'ar' ? 'تأكيد الحذف؟' : 'Confirm?'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                deleteProduct(prod.id);
                                setConfirmDeleteProdId(null);
                              }}
                              className="px-2 py-1 rounded-lg bg-red-600 text-white font-bold"
                            >
                              {lang === 'ar' ? 'نعم' : 'Yes'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteProdId(null)}
                              className="px-2 py-1 rounded-lg bg-white border border-[#E5DEC9]"
                            >
                              {lang === 'ar' ? 'لا' : 'No'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteProdId(prod.id)}
                            className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-red-300 font-semibold text-red-600 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Product Details Editor */}
                    {isEditingProd && editProdDraft && (
                      <div className="p-4 rounded-2xl bg-white border border-[#D97706]/40 space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          <label className="space-y-1 font-semibold">
                            <span>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</span>
                            <input
                              type="text"
                              value={editProdDraft.nameAr}
                              onChange={(e) =>
                                setEditProdDraft({ ...editProdDraft, nameAr: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9]"
                            />
                          </label>
                          <label className="space-y-1 font-semibold">
                            <span>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</span>
                            <input
                              type="text"
                              value={editProdDraft.nameEn}
                              onChange={(e) =>
                                setEditProdDraft({ ...editProdDraft, nameEn: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9]"
                            />
                          </label>
                          <label className="space-y-1 font-semibold">
                            <span>{lang === 'ar' ? 'القسم' : 'Category'}</span>
                            <select
                              value={editProdDraft.category}
                              onChange={(e) =>
                                setEditProdDraft({ ...editProdDraft, category: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                            >
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {t(cat.label)}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="space-y-1 font-semibold">
                            <span>{lang === 'ar' ? 'SKU' : 'SKU'}</span>
                            <input
                              type="text"
                              dir="ltr"
                              value={editProdDraft.sku}
                              onChange={(e) =>
                                setEditProdDraft({ ...editProdDraft, sku: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9]"
                            />
                          </label>
                          <label className="space-y-1 font-semibold">
                            <span>{lang === 'ar' ? 'الموطن (عربي)' : 'Origin (AR)'}</span>
                            <input
                              type="text"
                              value={editProdDraft.originAr}
                              onChange={(e) =>
                                setEditProdDraft({ ...editProdDraft, originAr: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9]"
                            />
                          </label>
                          <label className="space-y-1 font-semibold">
                            <span>{lang === 'ar' ? 'شارة الجودة (عربي)' : 'Purity Badge (AR)'}</span>
                            <input
                              type="text"
                              value={editProdDraft.badgeAr}
                              onChange={(e) =>
                                setEditProdDraft({ ...editProdDraft, badgeAr: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9]"
                            />
                          </label>
                          <label className="sm:col-span-2 lg:col-span-3 space-y-1 font-semibold">
                            <span>{lang === 'ar' ? 'الوصف المختصر (عربي)' : 'Short Description (AR)'}</span>
                            <textarea
                              rows={2}
                              value={editProdDraft.shortAr}
                              onChange={(e) =>
                                setEditProdDraft({ ...editProdDraft, shortAr: e.target.value })
                              }
                              className="w-full p-2 rounded-lg border border-[#E5DEC9]"
                            />
                          </label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProductId(null)}
                            className="px-4 py-1.5 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                          >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={() => saveProductEdit(prod.id)}
                            className="px-4 py-1.5 rounded-xl bg-[#4D7C0F] text-white font-semibold inline-flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حفظ تعديلات الصنف' : 'Save Product'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Add Weight Form */}
                    {isAddingWeight && (
                      <form
                        onSubmit={(e) => handleAddWeightToProduct(e, prod.id)}
                        className="p-3 rounded-xl bg-white border border-[#4D7C0F]/40 grid grid-cols-2 sm:grid-cols-5 gap-2 items-end text-xs"
                      >
                        <label className="space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'الوزن (عربي)' : 'Label (AR)'}</span>
                          <input
                            type="text"
                            required
                            value={newWeightLabelAr}
                            onChange={(e) => setNewWeightLabelAr(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9]"
                          />
                        </label>
                        <label className="space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'الوزن (إنجليزي)' : 'Label (EN)'}</span>
                          <input
                            type="text"
                            value={newWeightLabelEn}
                            onChange={(e) => setNewWeightLabelEn(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9]"
                          />
                        </label>
                        <label className="space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'السعر (ر.ي)' : 'Price (YER)'}</span>
                          <input
                            type="number"
                            min={1}
                            value={newWeightPrice}
                            onChange={(e) => setNewWeightPrice(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] tabular-nums"
                          />
                        </label>
                        <label className="space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'المخزون' : 'Stock'}</span>
                          <input
                            type="number"
                            min={0}
                            value={newWeightStock}
                            onChange={(e) => setNewWeightStock(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] tabular-nums"
                          />
                        </label>
                        <button
                          type="submit"
                          className="col-span-2 sm:col-span-1 min-h-[34px] px-3 rounded-lg bg-[#4D7C0F] text-white font-semibold"
                        >
                          {lang === 'ar' ? 'إضافة الوزن' : 'Add'}
                        </button>
                      </form>
                    )}

                    {/* Weights & Stock Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {prod.weightOptions.map((w) => (
                        <div
                          key={w.id}
                          className="p-3 rounded-xl bg-white border border-[#E5DEC9] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#4D7C0F]">{t(w.label)}</span>
                            {prod.weightOptions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => deleteProductWeight(prod.id, w.id)}
                                aria-label={lang === 'ar' ? 'حذف الوزن' : 'Delete weight'}
                                className="text-[#1F2937]/45 hover:text-red-600 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="space-y-1">
                              <span className="text-[#1F2937]/65 block">
                                {lang === 'ar' ? 'السعر (ر.ي)' : 'Price (YER)'}
                              </span>
                              <input
                                type="number"
                                min={1}
                                value={w.price}
                                onChange={(e) =>
                                  updateProductWeight(prod.id, w.id, Number(e.target.value), w.stock)
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-[#E5DEC9] tabular-nums font-semibold"
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-[#1F2937]/65 block">
                                {lang === 'ar' ? 'المخزون' : 'Stock'}
                              </span>
                              <input
                                type="number"
                                min={0}
                                value={w.stock}
                                onChange={(e) =>
                                  updateProductWeight(prod.id, w.id, w.price, Number(e.target.value))
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-[#E5DEC9] tabular-nums font-semibold"
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Status Controller */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar' ? 'تحديث حالات الطلبات' : 'Order Status Management'}
            </h2>
            <div className="divide-y divide-[#E5DEC9]">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <span className="font-bold text-[#1F2937] tabular-nums">{order.id}</span>
                    <span className="text-xs text-[#1F2937]/65 ms-2">
                      {order.address.fullName} ·{' '}
                      {order.address.shippingScope === 'international' && order.address.countryName
                        ? `${lang === 'ar' ? 'شحن دولي' : 'Intl'}: ${t(order.address.countryName)} (${
                            order.address.city
                          })`
                        : order.address.city}{' '}
                      · {formatPrice(order.total)}
                    </span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs font-semibold"
                  >
                    <option value="pending">{lang === 'ar' ? 'تم الطلب' : 'Ordered'}</option>
                    <option value="confirmed">{lang === 'ar' ? 'قيد التجهيز' : 'Preparing'}</option>
                    <option value="out_for_delivery">
                      {lang === 'ar' ? 'جاري التوصيل' : 'Out for Delivery'}
                    </option>
                    <option value="delivered">{lang === 'ar' ? 'تم التوصيل' : 'Delivered'}</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFERS FULL CRUD, COUPONS FULL CRUD & PUSH NOTIFICATIONS */}
      {tab === 'coupons_push' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coupons Full CRUD */}
          <form
            onSubmit={handleCreateCoupon}
            className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4"
          >
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar' ? 'إدارة كوبونات الخصم' : 'Manage Discount Coupons'}
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="col-span-2 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'رمز الكود' : 'Coupon Code'}</span>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="EID20"
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] uppercase text-sm"
                />
              </label>
              <label className="space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'النوع' : 'Type'}</span>
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value as 'percent' | 'fixed')}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm"
                >
                  <option value="percent">{lang === 'ar' ? 'نسبة مئوية %' : 'Percentage %'}</option>
                  <option value="fixed">{lang === 'ar' ? 'مبلغ ثابت (ر.ي)' : 'Fixed Amount'}</option>
                </select>
              </label>
              <label className="space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'القيمة' : 'Value'}</span>
                <input
                  type="number"
                  min={1}
                  value={couponValue}
                  onChange={(e) => setCouponValue(Number(e.target.value))}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm tabular-nums"
                />
              </label>
              <label className="col-span-2 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'الحد الأدنى للطلب (ر.ي)' : 'Min Order Spend (YER)'}</span>
                <input
                  type="number"
                  min={0}
                  value={couponMin}
                  onChange={(e) => setCouponMin(Number(e.target.value))}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm tabular-nums"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full min-h-[44px] rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors"
            >
              {lang === 'ar' ? 'تفعيل الكوبون في المتجر' : 'Publish Coupon'}
            </button>

            <div className="pt-3 border-t border-[#E5DEC9] space-y-2">
              <div className="text-xs font-semibold text-[#1F2937]/70">
                {lang === 'ar' ? 'الأكواد النشطة:' : 'Active Coupons:'}
              </div>
              {promoCodes.map((p) => (
                <div
                  key={p.code}
                  className="flex items-center justify-between gap-2 text-xs p-2.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9]"
                >
                  <div className="min-w-0">
                    <span className="font-mono-code font-bold text-[#D97706] me-2">{p.code}</span>
                    <span className="text-[#1F2937]/80">{t(p.description)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePromoCode(p.code)}
                    aria-label={lang === 'ar' ? 'حذف الكوبون' : 'Delete coupon'}
                    className="p-1.5 rounded-lg bg-white border border-[#E5DEC9] text-red-600 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </form>

          {/* Push Notifications */}
          <form
            onSubmit={handleSendPush}
            className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D97706]" />
                <span>{lang === 'ar' ? 'إرسال إشعار منبثق للعملاء' : 'Broadcast Push Notification'}</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPushCategory('new_honey');
                    setPushProductId('prod-dhabayah-solid');
                    setPushTitleAr('وصل حديثاً: عسل الضبايه الجامد');
                    setPushBodyAr('قطفة جديدة من عسل الضبايه الجامد الطبيعي متاحة الآن في المتجر.');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FFFBEB] border border-[#E5DEC9] hover:border-[#D97706] text-[11px] font-semibold text-[#92400E]"
                >
                  {lang === 'ar' ? 'قالب عسل جديد' : 'New Honey Template'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPushCategory('seasonal_discount');
                    setPushTitleAr('خصم موسمي ١٥٪ على الأعسال الملكية');
                    setPushBodyAr('استخدم كود HONEY15 في السلة أو تصفح عروض الموسم قبل نفاد الكمية.');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 hover:border-[#D97706] text-[11px] font-semibold text-[#B45309]"
                >
                  {lang === 'ar' ? 'قالب خصم موسمي' : 'Seasonal Deal Template'}
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'نوع التنبيه' : 'Alert Type'}</span>
                  <select
                    value={pushCategory}
                    onChange={(e) => setPushCategory(e.target.value as NotificationTopic)}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm"
                  >
                    <option value="new_honey">
                      {lang === 'ar' ? 'توفر عسل جديد' : 'New Honey Harvest'}
                    </option>
                    <option value="seasonal_discount">
                      {lang === 'ar' ? 'خصم أو عرض موسمي' : 'Seasonal Discount'}
                    </option>
                    <option value="loyalty">
                      {lang === 'ar' ? 'مكافآت ونقاط الولاء' : 'Loyalty Rewards'}
                    </option>
                  </select>
                </label>

                <label className="block space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'الفئة المستهدفة' : 'Target Segment'}</span>
                  <select
                    value={pushSegment}
                    onChange={(e) =>
                      setPushSegment(e.target.value as 'all' | 'gold_royal' | 'cart_abandoners')
                    }
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm"
                  >
                    <option value="all">{lang === 'ar' ? 'جميع المستخدمين' : 'All Customers'}</option>
                    <option value="gold_royal">
                      {lang === 'ar' ? 'أعضاء الولاء الذهبي والملكي' : 'Gold & Royal Loyalty Tier'}
                    </option>
                    <option value="cart_abandoners">
                      {lang === 'ar' ? 'السلات المتروكة' : 'Abandoned Carts'}
                    </option>
                  </select>
                </label>
              </div>

              {pushCategory === 'new_honey' && (
                <label className="block space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'ربط الإشعار بمنتج (عند الضغط عليه)' : 'Link Product on Tap'}</span>
                  <select
                    value={pushProductId}
                    onChange={(e) => setPushProductId(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {t(p.name)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'عنوان الإشعار' : 'Notification Title'}</span>
                <input
                  type="text"
                  value={pushTitleAr}
                  onChange={(e) => setPushTitleAr(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm"
                />
              </label>

              <label className="block space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'نص الرسالة' : 'Message Body'}</span>
                <textarea
                  rows={3}
                  value={pushBodyAr}
                  onChange={(e) => setPushBodyAr(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] rounded-xl bg-[#1F2937] hover:bg-black text-white text-sm font-semibold transition-colors"
            >
              {lang === 'ar' ? 'إرسال الإشعار المنبثق الآن' : 'Broadcast Push Notification'}
            </button>
          </form>

          {/* Manage Seasonal Special Offers Full CRUD */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar'
                ? 'إدارة العروض الخاصة (إضافة / تعديل / تفعيل / حذف)'
                : 'Manage Special Offers (Add / Edit / Toggle / Delete)'}
            </h2>

            <form
              onSubmit={handleCreateOffer}
              className="p-4 rounded-2xl bg-[#FFFBEB]/70 border border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-end"
            >
              <label className="sm:col-span-4 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'المنتج' : 'Product'}</span>
                <select
                  value={offerProductId}
                  onChange={(e) => {
                    const nextProd = products.find((p) => p.id === e.target.value);
                    setOfferProductId(e.target.value);
                    if (nextProd?.weightOptions[0]) {
                      setOfferWeightId(nextProd.weightOptions[0].id);
                    }
                  }}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.name)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-3 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'الوزن المشمول' : 'Weight Option'}</span>
                <select
                  value={offerWeightId}
                  onChange={(e) => setOfferWeightId(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs"
                >
                  {(selectedOfferProd?.weightOptions ?? []).map((w) => (
                    <option key={w.id} value={w.id}>
                      {t(w.label)} — {formatPrice(w.price)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-5 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'عنوان العرض (عربي) *' : 'Offer Title (AR) *'}</span>
                <input
                  type="text"
                  required
                  value={offerTitleAr}
                  onChange={(e) => setOfferTitleAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'عرض نهاية الأسبوع...' : 'Weekend Harvest Deal...'}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs"
                />
              </label>

              <label className="sm:col-span-3 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'عنوان العرض (إنجليزي)' : 'Offer Title (EN)'}</span>
                <input
                  type="text"
                  value={offerTitleEn}
                  onChange={(e) => setOfferTitleEn(e.target.value)}
                  placeholder="Optional English Title"
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs"
                />
              </label>

              <label className="sm:col-span-2 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'سعر العرض (ر.ي)' : 'Offer Price'}</span>
                <input
                  type="number"
                  min={1}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs tabular-nums"
                />
              </label>

              <label className="sm:col-span-2 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'السعر السابق (ر.ي)' : 'Was Price'}</span>
                <input
                  type="number"
                  min={2}
                  value={offerOriginalPrice}
                  onChange={(e) => setOfferOriginalPrice(Number(e.target.value))}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs tabular-nums"
                />
              </label>

              <label className="sm:col-span-2 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'مدة / نهاية العرض' : 'Duration'}</span>
                <input
                  type="text"
                  value={offerEndsAtAr}
                  onChange={(e) => setOfferEndsAtAr(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs"
                />
              </label>

              <label className="sm:col-span-3 space-y-1 font-semibold">
                <span>{lang === 'ar' ? 'كود مرتبط (اختياري)' : 'Promo Code (Opt)'}</span>
                <input
                  type="text"
                  value={offerPromoCode}
                  onChange={(e) => setOfferPromoCode(e.target.value)}
                  placeholder="SIDR20"
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs uppercase"
                />
              </label>

              <div className="sm:col-span-12 flex justify-end">
                <button
                  type="submit"
                  className="min-h-[42px] px-6 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  {lang === 'ar' ? 'إضافة ونشر العرض' : 'Publish Special Offer'}
                </button>
              </div>
            </form>

            <div className="divide-y divide-[#E5DEC9]">
              {offers.map((o) => {
                const isEditing = editingOfferId === o.id && editOfferDraft;
                const linkedProd = products.find((p) => p.id === (editOfferDraft?.productId ?? o.productId));
                return (
                  <div key={o.id} className="py-3.5 space-y-3 text-xs sm:text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-bold text-[#1F2937]">{t(o.title)}</div>
                        <div className="text-xs text-[#1F2937]/65 tabular-nums">
                          {formatPrice(o.offerPrice)}{' '}
                          <span className="line-through ms-1">{formatPrice(o.originalPrice)}</span> ·{' '}
                          {t(o.badgeText)} · {t(o.endsAtLabel)}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleOfferActive(o.id)}
                          className={`min-h-[36px] px-3.5 rounded-xl border text-xs font-semibold transition-colors ${
                            o.active
                              ? 'border-[#4D7C0F]/40 bg-lime-50 text-[#4D7C0F]'
                              : 'border-[#E5DEC9] bg-gray-100 text-[#1F2937]/60'
                          }`}
                        >
                          {o.active
                            ? lang === 'ar'
                              ? 'مفعّل'
                              : 'Active'
                            : lang === 'ar'
                            ? 'متوقف'
                            : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            isEditing ? setEditingOfferId(null) : startEditOffer(o)
                          }
                          className="min-h-[36px] px-3 rounded-xl border border-[#E5DEC9] bg-white hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteOffer(o.id)}
                          className="min-h-[36px] px-3 rounded-xl border border-[#E5DEC9] bg-white hover:border-red-300 text-xs font-semibold text-red-600 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>

                    {isEditing && editOfferDraft && (
                      <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#D97706]/40 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                        <label className="sm:col-span-4 space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'عنوان العرض (عربي)' : 'Title (AR)'}</span>
                          <input
                            type="text"
                            value={editOfferDraft.titleAr}
                            onChange={(e) =>
                              setEditOfferDraft({ ...editOfferDraft, titleAr: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                          />
                        </label>
                        <label className="sm:col-span-4 space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'المنتج' : 'Product'}</span>
                          <select
                            value={editOfferDraft.productId}
                            onChange={(e) => {
                              const np = products.find((p) => p.id === e.target.value);
                              setEditOfferDraft({
                                ...editOfferDraft,
                                productId: e.target.value,
                                weightId: np?.weightOptions[0]?.id ?? editOfferDraft.weightId,
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {t(p.name)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="sm:col-span-4 space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'الوزن' : 'Weight'}</span>
                          <select
                            value={editOfferDraft.weightId}
                            onChange={(e) =>
                              setEditOfferDraft({ ...editOfferDraft, weightId: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                          >
                            {(linkedProd?.weightOptions ?? []).map((w) => (
                              <option key={w.id} value={w.id}>
                                {t(w.label)}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="sm:col-span-3 space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'سعر العرض (ر.ي)' : 'Offer Price'}</span>
                          <input
                            type="number"
                            min={1}
                            value={editOfferDraft.offerPrice}
                            onChange={(e) =>
                              setEditOfferDraft({
                                ...editOfferDraft,
                                offerPrice: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                          />
                        </label>
                        <label className="sm:col-span-3 space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'السعر السابق (ر.ي)' : 'Was Price'}</span>
                          <input
                            type="number"
                            min={2}
                            value={editOfferDraft.originalPrice}
                            onChange={(e) =>
                              setEditOfferDraft({
                                ...editOfferDraft,
                                originalPrice: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                          />
                        </label>
                        <label className="sm:col-span-3 space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'شارة الخصم (عربي)' : 'Badge (AR)'}</span>
                          <input
                            type="text"
                            value={editOfferDraft.badgeAr}
                            onChange={(e) =>
                              setEditOfferDraft({ ...editOfferDraft, badgeAr: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                          />
                        </label>
                        <label className="sm:col-span-3 space-y-1 font-semibold">
                          <span>{lang === 'ar' ? 'المدة (عربي)' : 'Ends Label (AR)'}</span>
                          <input
                            type="text"
                            value={editOfferDraft.endsAr}
                            onChange={(e) =>
                              setEditOfferDraft({ ...editOfferDraft, endsAr: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                          />
                        </label>

                        <div className="sm:col-span-12 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingOfferId(null)}
                            className="px-4 py-1.5 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                          >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditOffer(o.id)}
                            className="px-4 py-1.5 rounded-xl bg-[#4D7C0F] text-white font-semibold inline-flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حفظ العرض' : 'Save Offer'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXCHANGE RATES CRUD & SHIPPING CONTROL */}
      {tab === 'shipping_fx' && (
        <div className="space-y-6">
          {/* Currency Exchange Rates CRUD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? 'إدارة العملات وأسعار الصرف مقابل الريال اليمني (ر.ي)'
                      : 'Currency & Exchange Rates vs. Yemeni Rial (YER)'}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65 mt-0.5">
                  {lang === 'ar'
                    ? 'حدد قيمة ١ وحدة من كل عملة بالريال اليمني (مثال: ١ ريال سعودي = ١٤٠ ر.ي، ١ دولار = ٥٢٥ ر.ي) ليتم التحويل الفوري في المتجر.'
                    : 'Set how many YER equal 1 unit of each currency (e.g. 1 SAR = 140 YER, 1 USD = 525 YER).'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetCurrencies();
                  setCurrencyDrafts({});
                }}
                className="min-h-[38px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] hover:bg-amber-50 text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{lang === 'ar' ? 'استعادة الأسعار الافتراضية' : 'Reset Default Rates'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {currencies.map((c) => {
                const draft = getCurrencyDraft(c);
                const sampleYer = 70000;
                const convertedSample = c.isBase
                  ? sampleYer
                  : sampleYer / Math.max(0.01, draft.yerPerUnit);

                return (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-[#D97706] text-white font-bold font-mono-code">
                          {c.code}
                        </span>
                        <span className="font-bold text-sm text-[#1F2937]">{t(c.name)}</span>
                        {c.isBase && (
                          <span className="text-[11px] font-bold text-[#4D7C0F] bg-lime-50 border border-[#4D7C0F]/30 px-2 py-0.5 rounded-lg">
                            {lang === 'ar' ? 'العملة الأساسية (١:١)' : 'Base Currency (1:1)'}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-[#1F2937]/75 tabular-nums">
                        {lang === 'ar' ? 'معاينة ٧٠,٠٠٠ ر.ي =' : '70,000 YER ='}{' '}
                        <span className="text-[#D97706] font-bold">
                          {convertedSample.toFixed(draft.decimals)} {draft.symbolAr}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 items-end">
                      <label className="space-y-1 font-semibold">
                        <span>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</span>
                        <input
                          type="text"
                          value={draft.nameAr}
                          onChange={(e) => updateCurrencyDraftField(c, 'nameAr', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                        />
                      </label>
                      <label className="space-y-1 font-semibold">
                        <span>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</span>
                        <input
                          type="text"
                          value={draft.nameEn}
                          onChange={(e) => updateCurrencyDraftField(c, 'nameEn', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                        />
                      </label>
                      <label className="space-y-1 font-semibold">
                        <span>{lang === 'ar' ? 'الرمز (عربي)' : 'Symbol (AR)'}</span>
                        <input
                          type="text"
                          value={draft.symbolAr}
                          onChange={(e) => updateCurrencyDraftField(c, 'symbolAr', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                        />
                      </label>
                      <label className="space-y-1 font-semibold">
                        <span>
                          {lang === 'ar' ? `سعر الصرف (١ ${c.code} = ؟ ر.ي)` : `1 ${c.code} in YER`}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min={0.01}
                          disabled={Boolean(c.isBase)}
                          value={draft.yerPerUnit}
                          onChange={(e) =>
                            updateCurrencyDraftField(c, 'yerPerUnit', Number(e.target.value))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white disabled:bg-gray-100 font-bold tabular-nums text-[#D97706]"
                        />
                      </label>
                      <label className="space-y-1 font-semibold">
                        <span>{lang === 'ar' ? 'الكسور العشرية' : 'Decimals'}</span>
                        <input
                          type="number"
                          min={0}
                          max={4}
                          value={draft.decimals}
                          onChange={(e) =>
                            updateCurrencyDraftField(c, 'decimals', Number(e.target.value))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                        />
                      </label>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateCurrency(c.code, {
                              name: { ar: draft.nameAr.trim(), en: draft.nameEn.trim() },
                              symbol: {
                                ar: draft.symbolAr.trim(),
                                en: draft.symbolEn.trim() || c.code,
                              },
                              yerPerUnit: draft.yerPerUnit,
                              decimals: draft.decimals,
                            })
                          }
                          className="flex-1 min-h-[34px] px-3 rounded-lg bg-[#4D7C0F] hover:bg-[#3f660c] text-white font-semibold inline-flex items-center justify-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حفظ' : 'Save'}</span>
                        </button>
                        {!c.isBase && (
                          <button
                            type="button"
                            onClick={() => deleteCurrency(c.code)}
                            aria-label={lang === 'ar' ? 'حذف العملة' : 'Delete currency'}
                            className="min-h-[34px] px-2.5 rounded-lg bg-white border border-[#E5DEC9] hover:border-red-300 text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Currency Form */}
            <form
              onSubmit={handleAddCurrency}
              className="p-4 rounded-2xl bg-amber-50/60 border border-[#E5DEC9] space-y-3 text-xs"
            >
              <div className="font-bold text-sm text-[#1F2937]">
                {lang === 'ar' ? '+ إضافة عملة وسعر صرف جديد' : '+ Add New Currency & Exchange Rate'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 items-end">
                <label className="space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'الرمز الدولي *' : 'Code (e.g. AED) *'}</span>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={newCurrCode}
                    onChange={(e) => setNewCurrCode(e.target.value)}
                    placeholder="AED"
                    className="w-full min-h-[38px] px-2.5 rounded-xl border border-[#E5DEC9] bg-white uppercase font-mono-code"
                  />
                </label>
                <label className="space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'الاسم (عربي) *' : 'Name (AR) *'}</span>
                  <input
                    type="text"
                    required
                    value={newCurrNameAr}
                    onChange={(e) => setNewCurrNameAr(e.target.value)}
                    placeholder="درهم إماراتي"
                    className="w-full min-h-[38px] px-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</span>
                  <input
                    type="text"
                    value={newCurrNameEn}
                    onChange={(e) => setNewCurrNameEn(e.target.value)}
                    placeholder="UAE Dirham"
                    className="w-full min-h-[38px] px-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'الرمز المختصر' : 'Symbol'}</span>
                  <input
                    type="text"
                    value={newCurrSymbolAr}
                    onChange={(e) => {
                      setNewCurrSymbolAr(e.target.value);
                      setNewCurrSymbolEn(e.target.value);
                    }}
                    placeholder="د.إ"
                    className="w-full min-h-[38px] px-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1 font-semibold">
                  <span>{lang === 'ar' ? 'سعر الصرف (بالر.ي) *' : 'YER per 1 Unit *'}</span>
                  <input
                    type="number"
                    step="0.01"
                    min={0.01}
                    required
                    value={newCurrYerPerUnit}
                    onChange={(e) => setNewCurrYerPerUnit(Number(e.target.value))}
                    className="w-full min-h-[38px] px-2.5 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
                  />
                </label>
                <button
                  type="submit"
                  className="min-h-[38px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold"
                >
                  {lang === 'ar' ? 'إضافة العملة' : 'Add Currency'}
                </button>
              </div>
            </form>
          </div>

          {/* Domestic Delivery Rates & Free Shipping Threshold */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#D97706]" />
                  <span>{lang === 'ar' ? 'أسعار التوصيل المحلي وحد التوصيل المجاني' : 'Domestic Delivery Zones & Free Threshold'}</span>
                </h2>
                <p className="text-xs text-[#1F2937]/65 mt-0.5">
                  {lang === 'ar'
                    ? 'عدّل رسوم التوصيل داخل وخارج صنعاء أو أضف مناطق توصيل جديدة وحدد مبلغ التوصيل المجاني.'
                    : 'Add, edit, or delete local delivery zones and set the free shipping order threshold.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#FFFBEB] border border-[#E5DEC9] p-2.5 rounded-2xl text-xs">
                <span className="font-semibold text-[#1F2937]">
                  {lang === 'ar' ? 'توصيل مجاني للطلبات فوق (ر.ي):' : 'Free Delivery Over (YER):'}
                </span>
                <input
                  type="number"
                  min={0}
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(Number(e.target.value))}
                  className="w-28 min-h-[34px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white font-bold tabular-nums text-[#4D7C0F]"
                />
                <button
                  type="button"
                  onClick={() => setFreeShippingThreshold(thresholdInput)}
                  className="min-h-[34px] px-3 rounded-lg bg-[#4D7C0F] text-white font-semibold"
                >
                  {lang === 'ar' ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {domesticZones.map((zone) => {
                const draft = getZoneDraft(zone);
                return (
                  <div
                    key={zone.id}
                    className="p-4 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end text-xs"
                  >
                    <label className="sm:col-span-3 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'اسم المنطقة (عربي)' : 'Zone Name (AR)'}</span>
                      <input
                        type="text"
                        value={draft.nameAr}
                        onChange={(e) =>
                          setZoneDrafts((prev) => ({
                            ...prev,
                            [zone.id]: { ...draft, nameAr: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                      />
                    </label>
                    <label className="sm:col-span-2 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</span>
                      <input
                        type="text"
                        value={draft.nameEn}
                        onChange={(e) =>
                          setZoneDrafts((prev) => ({
                            ...prev,
                            [zone.id]: { ...draft, nameEn: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                      />
                    </label>
                    <label className="sm:col-span-3 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'}</span>
                      <input
                        type="text"
                        value={draft.descAr}
                        onChange={(e) =>
                          setZoneDrafts((prev) => ({
                            ...prev,
                            [zone.id]: { ...draft, descAr: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                      />
                    </label>
                    <label className="sm:col-span-2 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'رسوم التوصيل (ر.ي)' : 'Fee (YER)'}</span>
                      <input
                        type="number"
                        min={0}
                        value={draft.fee}
                        onChange={(e) =>
                          setZoneDrafts((prev) => ({
                            ...prev,
                            [zone.id]: { ...draft, fee: Number(e.target.value) },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white font-bold tabular-nums text-[#D97706]"
                      />
                    </label>
                    <div className="sm:col-span-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateDomesticZone(zone.id, {
                            name: { ar: draft.nameAr.trim(), en: draft.nameEn.trim() },
                            description: { ar: draft.descAr.trim(), en: draft.descEn.trim() },
                            fee: Math.max(0, draft.fee),
                          })
                        }
                        className="flex-1 min-h-[34px] px-3 rounded-lg bg-[#4D7C0F] text-white font-semibold inline-flex items-center justify-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'حفظ' : 'Save'}</span>
                      </button>
                      {domesticZones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteDomesticZone(zone.id)}
                          aria-label={lang === 'ar' ? 'حذف المنطقة' : 'Delete zone'}
                          className="min-h-[34px] px-2.5 rounded-lg bg-white border border-[#E5DEC9] hover:border-red-300 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleAddZone}
              className="p-4 rounded-2xl bg-amber-50/60 border border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end text-xs"
            >
              <input
                type="text"
                required
                value={newZoneNameAr}
                onChange={(e) => setNewZoneNameAr(e.target.value)}
                placeholder={lang === 'ar' ? 'منطقة توصيل جديدة (عربي) *' : 'New Zone (AR) *'}
                className="sm:col-span-3 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
              />
              <input
                type="text"
                value={newZoneNameEn}
                onChange={(e) => setNewZoneNameEn(e.target.value)}
                placeholder={lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}
                className="sm:col-span-3 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
              />
              <input
                type="text"
                value={newZoneDescAr}
                onChange={(e) => setNewZoneDescAr(e.target.value)}
                placeholder={lang === 'ar' ? 'الوصف (مثال: توصيل خلال ٢٤ ساعة)' : 'Description'}
                className="sm:col-span-3 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
              />
              <input
                type="number"
                min={0}
                value={newZoneFee}
                onChange={(e) => setNewZoneFee(Number(e.target.value))}
                className="sm:col-span-1 min-h-[38px] px-2 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
              />
              <button
                type="submit"
                className="sm:col-span-2 min-h-[38px] px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold"
              >
                {lang === 'ar' ? '+ إضافة منطقة' : '+ Add Zone'}
              </button>
            </form>
          </div>

          {/* International Shipping Countries CRUD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D97706]" />
                <span>{lang === 'ar' ? 'إدارة دول وأسعار الشحن الدولي' : 'International Shipping Countries & Fees'}</span>
              </h2>
              <p className="text-xs text-[#1F2937]/65 mt-0.5">
                {lang === 'ar'
                  ? 'أضف دولاً جديدة أو عدّل رسوم الشحن الدولي ومدة الوصول وشركة الشحن بالريال اليمني.'
                  : 'Add countries or adjust shipping fees (YER), delivery duration, and carriers.'}
              </p>
            </div>

            <div className="space-y-3">
              {internationalCountries.map((country) => {
                const draft = getCountryDraft(country);
                return (
                  <div
                    key={country.id}
                    className="p-4 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end text-xs"
                  >
                    <label className="sm:col-span-3 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'الدولة (عربي)' : 'Country (AR)'}</span>
                      <input
                        type="text"
                        value={draft.nameAr}
                        onChange={(e) =>
                          setCountryDrafts((prev) => ({
                            ...prev,
                            [country.id]: { ...draft, nameAr: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                      />
                    </label>
                    <label className="sm:col-span-2 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</span>
                      <input
                        type="text"
                        value={draft.nameEn}
                        onChange={(e) =>
                          setCountryDrafts((prev) => ({
                            ...prev,
                            [country.id]: { ...draft, nameEn: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                      />
                    </label>
                    <label className="sm:col-span-2 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'السعر (ر.ي)' : 'Fee (YER)'}</span>
                      <input
                        type="number"
                        min={0}
                        value={draft.shippingFee}
                        onChange={(e) =>
                          setCountryDrafts((prev) => ({
                            ...prev,
                            [country.id]: { ...draft, shippingFee: Number(e.target.value) },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white font-bold tabular-nums text-[#D97706]"
                      />
                    </label>
                    <label className="sm:col-span-3 space-y-1 font-semibold">
                      <span>{lang === 'ar' ? 'مدة التوصيل (عربي)' : 'Est. Days (AR)'}</span>
                      <input
                        type="text"
                        value={draft.daysAr}
                        onChange={(e) =>
                          setCountryDrafts((prev) => ({
                            ...prev,
                            [country.id]: { ...draft, daysAr: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white"
                      />
                    </label>
                    <div className="sm:col-span-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateInternationalCountry(country.id, {
                            name: { ar: draft.nameAr.trim(), en: draft.nameEn.trim() },
                            shippingFee: Math.max(0, draft.shippingFee),
                            estimatedDays: { ar: draft.daysAr.trim(), en: draft.daysEn.trim() },
                            carrier: { ar: draft.carrierAr.trim(), en: draft.carrierEn.trim() },
                          })
                        }
                        className="flex-1 min-h-[34px] px-3 rounded-lg bg-[#4D7C0F] text-white font-semibold inline-flex items-center justify-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'حفظ' : 'Save'}</span>
                      </button>
                      {internationalCountries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteInternationalCountry(country.id)}
                          aria-label={lang === 'ar' ? 'حذف الدولة' : 'Delete country'}
                          className="min-h-[34px] px-2.5 rounded-lg bg-white border border-[#E5DEC9] hover:border-red-300 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleAddCountry}
              className="p-4 rounded-2xl bg-amber-50/60 border border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end text-xs"
            >
              <input
                type="text"
                required
                value={newCountryNameAr}
                onChange={(e) => setNewCountryNameAr(e.target.value)}
                placeholder={lang === 'ar' ? 'اسم الدولة (عربي) *' : 'Country Name (AR) *'}
                className="sm:col-span-3 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
              />
              <input
                type="text"
                value={newCountryNameEn}
                onChange={(e) => setNewCountryNameEn(e.target.value)}
                placeholder={lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}
                className="sm:col-span-3 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
              />
              <input
                type="number"
                min={0}
                value={newCountryFee}
                onChange={(e) => setNewCountryFee(Number(e.target.value))}
                placeholder="YER Fee"
                className="sm:col-span-2 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
              />
              <input
                type="text"
                value={newCountryDaysAr}
                onChange={(e) => setNewCountryDaysAr(e.target.value)}
                placeholder={lang === 'ar' ? 'مدة الوصول' : 'Est. Days'}
                className="sm:col-span-2 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
              />
              <button
                type="submit"
                className="sm:col-span-2 min-h-[38px] px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold"
              >
                {lang === 'ar' ? '+ إضافة دولة' : '+ Add Country'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: FULL LOYALTY PROGRAM CONTROL (برنامج حصاد النقاط) */}
      {tab === 'loyalty' && (
        <div className="space-y-6">
          {/* 1. Program Settings, Copy & Banner Image */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? 'إعدادات ونصوص وصورة غلاف برنامج حصاد النقاط'
                      : 'Harvest Points Settings, Copy & Banner Image'}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65">
                  {lang === 'ar'
                    ? 'عدّل العناوين، الوصف، معدل كسب النقاط، صورة الغلاف، وحالة تفعيل البرنامج بالكامل.'
                    : 'Customize titles, subtitles, earning rules, banner artwork, and active program status.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateLoyaltySettings({ enabled: !loyaltySettings.enabled })
                  }
                  className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold transition-colors ${
                    loyaltySettings.enabled
                      ? 'bg-[#4D7C0F] text-white'
                      : 'bg-amber-100 text-[#92400E] border border-[#D97706]/30'
                  }`}
                >
                  {loyaltySettings.enabled
                    ? lang === 'ar'
                      ? 'البرنامج مفعّل (اضغط للإيقاف المؤقت)'
                      : 'Program Active (Click to Pause)'
                    : lang === 'ar'
                    ? 'البرنامج متوقف مؤقتاً (اضغط للتفعيل)'
                    : 'Program Paused (Click to Enable)'}
                </button>
                <button
                  type="button"
                  onClick={resetLoyaltySettings}
                  className="min-h-[40px] px-3.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] text-xs font-semibold text-[#1F2937] hover:bg-amber-100 inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'استعادة الإعدادات الافتراضية' : 'Reset Defaults'}</span>
                </button>
              </div>
            </div>

            {/* Banner Preview & Image Controls */}
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1F2937]">
                  {lang === 'ar' ? 'صورة غلاف بطاقة حصاد النقاط' : 'Loyalty Card Banner Image'}
                </span>
                {loyaltyBannerUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoyaltyBannerUrl('');
                      updateLoyaltySettings({ bannerImage: undefined });
                    }}
                    className="text-xs font-semibold text-[#DC2626] hover:underline inline-flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إزالة صورة الغلاف' : 'Remove Banner'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-5 h-32 rounded-2xl overflow-hidden border border-[#E5DEC9] bg-white relative flex items-center justify-center">
                  {loyaltyBannerUrl ? (
                    <>
                      <ProductImage
                        src={loyaltyBannerUrl}
                        alt={loyaltyTitleAr}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent flex items-end p-3">
                        <span className="text-xs font-bold text-white line-clamp-1">
                          {lang === 'ar' ? loyaltyTitleAr : loyaltyTitleEn}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-[#1F2937]/45">
                      {lang === 'ar' ? 'لا توجد صورة غلاف حالياً' : 'No banner image set'}
                    </span>
                  )}
                </div>

                <div className="md:col-span-7 space-y-2.5">
                  <div className="flex flex-wrap gap-2">
                    <label className="min-h-[40px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'رفع صورة غلاف من الجهاز' : 'Upload Banner Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (!file) return;
                          const dataUrl = await compressImageFile(file);
                          setLoyaltyBannerUrl(dataUrl);
                          updateLoyaltySettings({ bannerImage: dataUrl });
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={loyaltyBannerUrl}
                      onChange={(e) => setLoyaltyBannerUrl(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="flex-1 min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateLoyaltySettings({
                          bannerImage: loyaltyBannerUrl.trim() || undefined,
                        })
                      }
                      className="min-h-[38px] px-3.5 rounded-xl bg-[#1F2937] text-white text-xs font-semibold whitespace-nowrap"
                    >
                      {lang === 'ar' ? 'تثبيت الرابط' : 'Apply URL'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bilingual Copy & Earn Rate Form */}
            <form onSubmit={handleSaveLoyaltySettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان البرنامج (عربي)' : 'Program Title (AR)'}
                  </span>
                  <input
                    type="text"
                    value={loyaltyTitleAr}
                    onChange={(e) => setLoyaltyTitleAr(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان البرنامج (إنجليزي)' : 'Program Title (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={loyaltyTitleEn}
                    onChange={(e) => setLoyaltyTitleEn(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'الوصف الفرعي للبرنامج (عربي)' : 'Program Subtitle (AR)'}
                  </span>
                  <input
                    type="text"
                    value={loyaltySubtitleAr}
                    onChange={(e) => setLoyaltySubtitleAr(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'الوصف الفرعي للبرنامج (إنجليزي)' : 'Program Subtitle (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={loyaltySubtitleEn}
                    onChange={(e) => setLoyaltySubtitleEn(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان قسم المكافآت (عربي)' : 'Rewards Section Title (AR)'}
                  </span>
                  <input
                    type="text"
                    value={loyaltyRewardsTitleAr}
                    onChange={(e) => setLoyaltyRewardsTitleAr(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان قسم المكافآت (إنجليزي)' : 'Rewards Section Title (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={loyaltyRewardsTitleEn}
                    onChange={(e) => setLoyaltyRewardsTitleEn(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'رسالة أو تلميح كسب النقاط (عربي)' : 'Earning Rule Hint (AR)'}
                  </span>
                  <input
                    type="text"
                    value={loyaltyEarnHintAr}
                    onChange={(e) => setLoyaltyEarnHintAr(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'رسالة أو تلميح كسب النقاط (إنجليزي)' : 'Earning Rule Hint (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={loyaltyEarnHintEn}
                    onChange={(e) => setLoyaltyEarnHintEn(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1 sm:col-span-2">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar'
                      ? 'معدل النقاط لكل ١٠٠٠ ريال يمني (قبل مضاعف المستوى — الافتراضي 1 = نقطة لكل ١٠ ريال)'
                      : 'Base Points Multiplier Rate (pointsPerYer — default 1 = 1 pt per 10 YER)'}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={loyaltyPointsPerYer}
                      onChange={(e) => setLoyaltyPointsPerYer(Number(e.target.value))}
                      className="w-40 min-h-[40px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums font-semibold"
                    />
                    <span className="text-[11px] text-[#1F2937]/60">
                      {lang === 'ar'
                        ? `مثال: طلب بقيمة 10,000 ر.ي يكسب حالياً ${Math.round(
                            (10000 / 10) * (Number(loyaltyPointsPerYer) || 1)
                          )} نقطة أساسية.`
                        : `Example: a 10,000 YER order earns ${Math.round(
                            (10000 / 10) * (Number(loyaltyPointsPerYer) || 1)
                          )} base points.`}
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="min-h-[44px] px-6 rounded-xl bg-[#4D7C0F] hover:bg-[#3F6212] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'حفظ نصوص وإعدادات برنامج حصاد النقاط'
                    : 'Save Program Copy & Settings'}
                </span>
              </button>
            </form>
          </div>

          {/* 2. Loyalty Tiers Configuration */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar'
                ? 'إدارة مستويات العضوية والمضاعفات'
                : 'Membership Tiers & Multipliers'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loyaltySettings.tiers.map((tier) => {
                const draft = getTierDraft(tier);
                return (
                  <div
                    key={tier.id}
                    className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1F2937]">
                        {lang === 'ar' ? tier.label.ar : tier.label.en}
                      </span>
                      <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#D97706]">
                        {tier.id}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="space-y-1">
                        <span className="text-[#1F2937]/65">
                          {lang === 'ar' ? 'اسم المستوى (عربي)' : 'Label (AR)'}
                        </span>
                        <input
                          type="text"
                          value={draft.labelAr}
                          onChange={(e) =>
                            setTierDrafts((prev) => ({
                              ...prev,
                              [tier.id]: { ...draft, labelAr: e.target.value },
                            }))
                          }
                          className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[#1F2937]/65">
                          {lang === 'ar' ? 'اسم المستوى (إنجليزي)' : 'Label (EN)'}
                        </span>
                        <input
                          type="text"
                          dir="ltr"
                          value={draft.labelEn}
                          onChange={(e) =>
                            setTierDrafts((prev) => ({
                              ...prev,
                              [tier.id]: { ...draft, labelEn: e.target.value },
                            }))
                          }
                          className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[#1F2937]/65">
                          {lang === 'ar' ? 'نقاط الترقية للمستوى' : 'Min Lifetime Points'}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={draft.minPoints}
                          onChange={(e) =>
                            setTierDrafts((prev) => ({
                              ...prev,
                              [tier.id]: { ...draft, minPoints: Number(e.target.value) },
                            }))
                          }
                          className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[#1F2937]/65">
                          {lang === 'ar' ? 'مضاعف النقاط (×)' : 'Points Multiplier (×)'}
                        </span>
                        <input
                          type="number"
                          step="0.05"
                          min="1"
                          value={draft.multiplier}
                          onChange={(e) =>
                            setTierDrafts((prev) => ({
                              ...prev,
                              [tier.id]: { ...draft, multiplier: Number(e.target.value) },
                            }))
                          }
                          className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateLoyaltyTier(tier.id, {
                          label: {
                            ar: draft.labelAr.trim() || tier.label.ar,
                            en: draft.labelEn.trim() || tier.label.en,
                          },
                          minPoints: Math.max(0, Number(draft.minPoints) || 0),
                          multiplier: Math.max(1, Number(draft.multiplier) || 1),
                        })
                      }
                      className="w-full min-h-[36px] rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold inline-flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'حفظ المستوى' : 'Save Tier'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Customer Points Balances & Manual Bonus/Deduction */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar'
                ? 'التحكم برصيد النقاط ومنح أو خصم نقاط'
                : 'Customer Points Balances & Manual Adjustments'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              {/* Direct Balance Override */}
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3">
                <div className="font-bold text-sm text-[#1F2937]">
                  {lang === 'ar'
                    ? 'ضبط رصيد النقاط مباشرة'
                    : 'Set Direct Points Balances'}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <span className="text-[#1F2937]/70">
                      {lang === 'ar' ? 'الرصيد المتاح للاستبدال' : 'Available Points'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={availPointsInput}
                      onChange={(e) => setAvailPointsInput(Number(e.target.value))}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white font-bold tabular-nums"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[#1F2937]/70">
                      {lang === 'ar' ? 'إجمالي نقاط المستوى (التراكمية)' : 'Lifetime Tier Points'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={lifePointsInput}
                      onChange={(e) => setLifePointsInput(Number(e.target.value))}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white font-bold tabular-nums"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCustomerPointsBalances(
                      Math.max(0, Number(availPointsInput) || 0),
                      Math.max(0, Number(lifePointsInput) || 0)
                    )
                  }
                  className="min-h-[38px] px-4 rounded-xl bg-[#1F2937] text-white font-semibold inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تحديث الرصيد مباشرة' : 'Update Balances'}</span>
                </button>
              </div>

              {/* Add Bonus or Deduct Points with Transaction Log */}
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3">
                <div className="font-bold text-sm text-[#1F2937]">
                  {lang === 'ar'
                    ? 'إضافة مكافأة نقاط أو خصم مع تسجيل حركة'
                    : 'Award Bonus / Deduct Points (Logged)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="space-y-1">
                    <span className="text-[#1F2937]/70">
                      {lang === 'ar' ? 'النقاط (+/-)' : 'Delta (+/-)'}
                    </span>
                    <input
                      type="number"
                      value={bonusDelta}
                      onChange={(e) => setBonusDelta(Number(e.target.value))}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white font-bold tabular-nums"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[#1F2937]/70">
                      {lang === 'ar' ? 'السبب (عربي)' : 'Reason (AR)'}
                    </span>
                    <input
                      type="text"
                      value={bonusReasonAr}
                      onChange={(e) => setBonusReasonAr(e.target.value)}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[#1F2937]/70">
                      {lang === 'ar' ? 'السبب (إنجليزي)' : 'Reason (EN)'}
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      value={bonusReasonEn}
                      onChange={(e) => setBonusReasonEn(e.target.value)}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[#1F2937]/80">
                    <input
                      type="checkbox"
                      checked={bonusAffectLifetime}
                      onChange={(e) => setBonusAffectLifetime(e.target.checked)}
                      className="accent-[#D97706] w-4 h-4"
                    />
                    <span>
                      {lang === 'ar'
                        ? 'احتسابها ضمن نقاط الترقية للمستوى'
                        : 'Also affect lifetime tier points'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!bonusDelta) return;
                      adjustLoyaltyPoints(
                        bonusDelta,
                        {
                          ar: bonusReasonAr.trim() || 'تعديل إداري للنقاط',
                          en: bonusReasonEn.trim() || 'Admin points adjustment',
                        },
                        bonusAffectLifetime
                      );
                    }}
                    className="min-h-[38px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold"
                  >
                    {lang === 'ar' ? 'تطبيق التعديل' : 'Apply Adjustment'}
                  </button>
                </div>
              </div>
            </div>

            {loyaltyTransactions.length > 0 && (
              <div className="text-xs text-[#1F2937]/65">
                {lang === 'ar'
                  ? `آخر حركة مسجلة: ${loyaltyTransactions[0].description.ar} (${
                      loyaltyTransactions[0].points > 0 ? '+' : ''
                    }${loyaltyTransactions[0].points} نقطة)`
                  : `Latest transaction: ${loyaltyTransactions[0].description.en} (${
                      loyaltyTransactions[0].points > 0 ? '+' : ''
                    }${loyaltyTransactions[0].points} pts)`}
              </div>
            )}
          </div>

          {/* 4. Loyalty Rewards Full CRUD (إضافة وتعديل وحذف المكافآت وصورها ونصوصها) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? `إدارة مكافآت وهدايا برنامج حصاد النقاط (${loyaltyRewards.length})`
                      : `Harvest Points Rewards CRUD (${loyaltyRewards.length})`}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65">
                  {lang === 'ar'
                    ? 'أضف مكافآت جديدة أو عدّل العناوين، الوصف، النقاط المطلوبة، الكمية، وصور المكافآت في أي وقت.'
                    : 'Create, edit, delete rewards, and customize bilingual text, point costs, stock, and reward photos.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReward((v) => !v)}
                  className="min-h-[42px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة مكافأة جديدة' : 'Add New Reward'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetLoyaltyRewards}
                  className="min-h-[42px] px-3.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] text-xs font-semibold text-[#1F2937] hover:bg-amber-100 inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'استعادة المكافآت الافتراضية' : 'Reset Rewards'}</span>
                </button>
              </div>
            </div>

            {/* Add New Reward Form */}
            {showAddReward && (
              <form
                onSubmit={handleAddReward}
                className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#D97706]/30 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1F2937]">
                    {lang === 'ar' ? 'إنشاء مكافأة جديدة' : 'Create New Loyalty Reward'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddReward(false)}
                    className="p-1 text-[#1F2937]/60 hover:text-[#1F2937]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'نوع المكافأة' : 'Reward Type'}
                    </span>
                    <select
                      value={newRewardType}
                      onChange={(e) =>
                        setNewRewardType(e.target.value as 'discount' | 'exclusive_product')
                      }
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                    >
                      <option value="discount">
                        {lang === 'ar' ? 'قسيمة خصم مالية' : 'Discount Voucher'}
                      </option>
                      <option value="exclusive_product">
                        {lang === 'ar' ? 'منتج / هدية مجانية حصرية' : 'Exclusive Free Product'}
                      </option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'تكلفة الاستبدال (نقاط)' : 'Points Cost'}
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={newRewardPoints}
                      onChange={(e) => setNewRewardPoints(Number(e.target.value))}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums font-bold"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'الكمية المتوفرة بالمخزون' : 'Available Stock'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={newRewardStock}
                      onChange={(e) => setNewRewardStock(Number(e.target.value))}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums font-bold"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'عنوان المكافأة (عربي)' : 'Title (AR)'}
                    </span>
                    <input
                      type="text"
                      required
                      value={newRewardTitleAr}
                      onChange={(e) => setNewRewardTitleAr(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: خصم ٥,٠٠٠ ر.ي' : 'Title in Arabic'}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'عنوان المكافأة (إنجليزي)' : 'Title (EN)'}
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      value={newRewardTitleEn}
                      onChange={(e) => setNewRewardTitleEn(e.target.value)}
                      placeholder="e.g., 5,000 YER Discount"
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  {newRewardType === 'discount' ? (
                    <>
                      <label className="space-y-1">
                        <span className="font-semibold text-[#1F2937]/75">
                          {lang === 'ar' ? 'قيمة الخصم (ر.ي)' : 'Discount Amount (YER)'}
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={newRewardDiscount}
                          onChange={(e) => setNewRewardDiscount(Number(e.target.value))}
                          className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-semibold text-[#1F2937]/75">
                          {lang === 'ar' ? 'الحد الأدنى للطلب (ر.ي)' : 'Min Order (YER)'}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={newRewardMinOrder}
                          onChange={(e) => setNewRewardMinOrder(Number(e.target.value))}
                          className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white tabular-nums"
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="space-y-1">
                        <span className="font-semibold text-[#1F2937]/75">
                          {lang === 'ar' ? 'وزن / حجم الهدية (عربي)' : 'Weight Label (AR)'}
                        </span>
                        <input
                          type="text"
                          value={newRewardWeightAr}
                          onChange={(e) => setNewRewardWeightAr(e.target.value)}
                          className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="font-semibold text-[#1F2937]/75">
                          {lang === 'ar' ? 'وزن / حجم الهدية (إنجليزي)' : 'Weight Label (EN)'}
                        </span>
                        <input
                          type="text"
                          dir="ltr"
                          value={newRewardWeightEn}
                          onChange={(e) => setNewRewardWeightEn(e.target.value)}
                          className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                        />
                      </label>
                    </>
                  )}

                  <label className="space-y-1 sm:col-span-2 lg:col-span-3">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'وصف المكافأة (عربي)' : 'Description (AR)'}
                    </span>
                    <input
                      type="text"
                      value={newRewardDescAr}
                      onChange={(e) => setNewRewardDescAr(e.target.value)}
                      placeholder={lang === 'ar' ? 'تفاصيل استخدام القسيمة أو الهدية' : 'Arabic description'}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  <label className="space-y-1 sm:col-span-2 lg:col-span-3">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'وصف المكافأة (إنجليزي)' : 'Description (EN)'}
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      value={newRewardDescEn}
                      onChange={(e) => setNewRewardDescEn(e.target.value)}
                      placeholder="English description"
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                </div>

                {/* New Reward Image Picker */}
                <div className="p-3 rounded-xl bg-white border border-[#E5DEC9] space-y-2">
                  <div className="font-semibold text-[#1F2937]">
                    {lang === 'ar' ? 'صورة المكافأة (اختياري)' : 'Reward Image (Optional)'}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {newRewardImage && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E5DEC9] shrink-0">
                        <ProductImage
                          src={newRewardImage}
                          alt={newRewardTitleAr || 'reward'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="min-h-[36px] px-3 rounded-xl bg-[#D97706] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'رفع صورة من الجهاز' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (!file) return;
                          const dataUrl = await compressImageFile(file);
                          setNewRewardImage(dataUrl);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={newRewardImage}
                      onChange={(e) => setNewRewardImage(e.target.value)}
                      placeholder="https://... or select product photo"
                      className="flex-1 min-w-[180px] min-h-[36px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) setNewRewardImage(e.target.value);
                      }}
                      className="min-h-[36px] px-2.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB]"
                    >
                      <option value="">
                        {lang === 'ar' ? 'اختر من صور المنتجات...' : 'Pick from store products...'}
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.images[0] ?? ''}>
                          {lang === 'ar' ? p.name.ar : p.name.en}
                        </option>
                      ))}
                    </select>
                    {newRewardImage && (
                      <button
                        type="button"
                        onClick={() => setNewRewardImage('')}
                        className="px-2.5 py-1.5 rounded-lg text-[#DC2626] hover:bg-red-50"
                      >
                        {lang === 'ar' ? 'إزالة' : 'Clear'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReward(false)}
                    className="min-h-[38px] px-4 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="min-h-[38px] px-5 rounded-xl bg-[#4D7C0F] hover:bg-[#3F6212] text-white font-semibold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'حفظ وإضافة المكافأة' : 'Create Reward'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Rewards List */}
            <div className="space-y-4">
              {loyaltyRewards.map((rew) => {
                const isEditing = editingRewardId === rew.id && editRewardDraft;
                const imgUrlDraft = rewardImageUrlInputs[rew.id] ?? '';
                return (
                  <div
                    key={rew.id}
                    className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#E5DEC9] bg-white shrink-0 flex items-center justify-center">
                          {rew.productImage ? (
                            <ProductImage
                              src={rew.productImage}
                              alt={lang === 'ar' ? rew.title.ar : rew.title.en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Gift className="w-6 h-6 text-[#D97706]" />
                          )}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-[#1F2937]">
                              {lang === 'ar' ? rew.title.ar : rew.title.en}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#D97706]">
                              {rew.type === 'discount'
                                ? lang === 'ar'
                                  ? 'خصم'
                                  : 'Discount'
                                : lang === 'ar'
                                ? 'هدية منتج'
                                : 'Exclusive Gift'}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#92400E] tabular-nums">
                              {rew.pointsCost} {lang === 'ar' ? 'نقطة' : 'pts'}
                            </span>
                            <span className="text-[11px] font-semibold text-[#4D7C0F] tabular-nums">
                              {lang === 'ar' ? `المخزون: ${rew.stock}` : `Stock: ${rew.stock}`}
                            </span>
                          </div>
                          <p className="text-xs text-[#1F2937]/70">
                            {lang === 'ar' ? rew.description.ar : rew.description.en}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <label className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{lang === 'ar' ? 'تغيير الصورة' : 'Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (!file) return;
                              const dataUrl = await compressImageFile(file);
                              updateLoyaltyReward(rew.id, { productImage: dataUrl });
                              if (isEditing && editRewardDraft) {
                                setEditRewardDraft({ ...editRewardDraft, productImage: dataUrl });
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            isEditing
                              ? (setEditingRewardId(null), setEditRewardDraft(null))
                              : openRewardEditor(rew)
                          }
                          className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>
                            {isEditing
                              ? lang === 'ar'
                                ? 'إغلاق التعديل'
                                : 'Close'
                              : lang === 'ar'
                              ? 'تعديل الكل'
                              : 'Edit'}
                          </span>
                        </button>

                        {confirmDeleteRewardId === rew.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                deleteLoyaltyReward(rew.id);
                                setConfirmDeleteRewardId(null);
                              }}
                              className="min-h-[36px] px-3 rounded-xl bg-[#DC2626] text-white text-xs font-semibold"
                            >
                              {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteRewardId(null)}
                              className="min-h-[36px] px-2.5 rounded-xl bg-white border border-[#E5DEC9] text-xs font-semibold"
                            >
                              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteRewardId(rew.id)}
                            className="min-h-[36px] px-3 rounded-xl bg-white border border-red-200 text-[#DC2626] hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Full Reward Editor */}
                    {isEditing && (
                      <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'نوع المكافأة' : 'Reward Type'}
                            </span>
                            <select
                              value={editRewardDraft.type}
                              onChange={(e) =>
                                setEditRewardDraft({
                                  ...editRewardDraft,
                                  type: e.target.value as 'discount' | 'exclusive_product',
                                })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            >
                              <option value="discount">
                                {lang === 'ar' ? 'قسيمة خصم' : 'Discount Voucher'}
                              </option>
                              <option value="exclusive_product">
                                {lang === 'ar' ? 'هدية منتج حصري' : 'Exclusive Product'}
                              </option>
                            </select>
                          </label>

                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'النقاط المطلوبة' : 'Points Cost'}
                            </span>
                            <input
                              type="number"
                              min="1"
                              value={editRewardDraft.pointsCost}
                              onChange={(e) =>
                                setEditRewardDraft({
                                  ...editRewardDraft,
                                  pointsCost: Number(e.target.value),
                                })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'المخزون' : 'Stock'}
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={editRewardDraft.stock}
                              onChange={(e) =>
                                setEditRewardDraft({
                                  ...editRewardDraft,
                                  stock: Number(e.target.value),
                                })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'العنوان (عربي)' : 'Title (AR)'}
                            </span>
                            <input
                              type="text"
                              value={editRewardDraft.titleAr}
                              onChange={(e) =>
                                setEditRewardDraft({ ...editRewardDraft, titleAr: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (EN)'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={editRewardDraft.titleEn}
                              onChange={(e) =>
                                setEditRewardDraft({ ...editRewardDraft, titleEn: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>

                          {editRewardDraft.type === 'discount' ? (
                            <>
                              <label className="space-y-1">
                                <span className="font-semibold text-[#1F2937]/75">
                                  {lang === 'ar' ? 'قيمة الخصم (ر.ي)' : 'Discount (YER)'}
                                </span>
                                <input
                                  type="number"
                                  min="1"
                                  value={editRewardDraft.discountAmount}
                                  onChange={(e) =>
                                    setEditRewardDraft({
                                      ...editRewardDraft,
                                      discountAmount: Number(e.target.value),
                                    })
                                  }
                                  className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                                />
                              </label>
                              <label className="space-y-1">
                                <span className="font-semibold text-[#1F2937]/75">
                                  {lang === 'ar' ? 'الحد الأدنى للطلب (ر.ي)' : 'Min Order (YER)'}
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  value={editRewardDraft.minOrderAmount}
                                  onChange={(e) =>
                                    setEditRewardDraft({
                                      ...editRewardDraft,
                                      minOrderAmount: Number(e.target.value),
                                    })
                                  }
                                  className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white tabular-nums"
                                />
                              </label>
                            </>
                          ) : (
                            <>
                              <label className="space-y-1">
                                <span className="font-semibold text-[#1F2937]/75">
                                  {lang === 'ar' ? 'الوزن (عربي)' : 'Weight (AR)'}
                                </span>
                                <input
                                  type="text"
                                  value={editRewardDraft.weightLabelAr}
                                  onChange={(e) =>
                                    setEditRewardDraft({
                                      ...editRewardDraft,
                                      weightLabelAr: e.target.value,
                                    })
                                  }
                                  className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                                />
                              </label>
                              <label className="space-y-1">
                                <span className="font-semibold text-[#1F2937]/75">
                                  {lang === 'ar' ? 'الوزن (إنجليزي)' : 'Weight (EN)'}
                                </span>
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={editRewardDraft.weightLabelEn}
                                  onChange={(e) =>
                                    setEditRewardDraft({
                                      ...editRewardDraft,
                                      weightLabelEn: e.target.value,
                                    })
                                  }
                                  className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                                />
                              </label>
                            </>
                          )}

                          <label className="space-y-1 sm:col-span-2 lg:col-span-3">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'}
                            </span>
                            <input
                              type="text"
                              value={editRewardDraft.descAr}
                              onChange={(e) =>
                                setEditRewardDraft({ ...editRewardDraft, descAr: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>

                          <label className="space-y-1 sm:col-span-2 lg:col-span-3">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (EN)'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={editRewardDraft.descEn}
                              onChange={(e) =>
                                setEditRewardDraft({ ...editRewardDraft, descEn: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>
                        </div>

                        {/* Image Controls inside Edit */}
                        <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#1F2937]">
                              {lang === 'ar' ? 'صورة المكافأة' : 'Reward Image'}
                            </span>
                            {editRewardDraft.productImage && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditRewardDraft({ ...editRewardDraft, productImage: '' })
                                }
                                className="text-[#DC2626] hover:underline font-semibold"
                              >
                                {lang === 'ar' ? 'إزالة الصورة' : 'Clear Image'}
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              dir="ltr"
                              value={editRewardDraft.productImage || imgUrlDraft}
                              onChange={(e) => {
                                setEditRewardDraft({
                                  ...editRewardDraft,
                                  productImage: e.target.value,
                                });
                                setRewardImageUrlInputs((prev) => ({
                                  ...prev,
                                  [rew.id]: e.target.value,
                                }));
                              }}
                              placeholder="https://example.com/reward.jpg"
                              className="flex-1 min-w-[180px] min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  setEditRewardDraft({
                                    ...editRewardDraft,
                                    productImage: e.target.value,
                                  });
                                }
                              }}
                              className="min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            >
                              <option value="">
                                {lang === 'ar' ? 'اختر صورة منتج...' : 'Pick product photo...'}
                              </option>
                              {products.map((p) => (
                                <option key={p.id} value={p.images[0] ?? ''}>
                                  {lang === 'ar' ? p.name.ar : p.name.en}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRewardId(null);
                              setEditRewardDraft(null);
                            }}
                            className="min-h-[36px] px-4 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                          >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={() => saveRewardEdit(rew.id)}
                            className="min-h-[36px] px-5 rounded-xl bg-[#4D7C0F] hover:bg-[#3F6212] text-white font-semibold inline-flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حفظ تعديلات المكافأة' : 'Save Reward'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4B: HOME PAGE & HERO BANNERS FULL CONTROL */}
      {tab === 'home_hero' && (
        <div className="space-y-6">
          {/* 1. Hero Banners Slider Full CRUD + Images & Copy */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? `إدارة شرائح العرض الرئيسية (السلايدر) وصورها (${heroBanners.length})`
                      : `Home Hero Slider Banners CRUD (${heroBanners.length})`}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65">
                  {lang === 'ar'
                    ? 'عدّل نصوص وصور "عسل السدر الجبلي النقي..." و"صندوق كنوز دوعن الفاخر..." أو أضف شرائح جديدة وتغيير الترتيب والقسم المستهدف.'
                    : 'Edit text, photos, CTAs, ordering, and category links for all homepage hero slides, or add new slides.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBanner((v) => !v)}
                  className="min-h-[42px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة شريحة عرض جديدة' : 'Add New Slide'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetHeroBanners}
                  className="min-h-[42px] px-3.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] text-xs font-semibold text-[#1F2937] hover:bg-amber-100 inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'استعادة الشرائح الافتراضية' : 'Reset Slides'}</span>
                </button>
              </div>
            </div>

            {/* Add New Banner Form */}
            {showAddBanner && (
              <form
                onSubmit={handleAddBanner}
                className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#D97706]/30 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1F2937]">
                    {lang === 'ar' ? 'إنشاء شريحة عرض جديدة في الواجهة الرئيسية' : 'Create New Hero Slide'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddBanner(false)}
                    className="p-1 text-[#1F2937]/60 hover:text-[#1F2937]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'العنوان العلوي الصغير (عربي)' : 'Kicker Label (AR)'}
                    </span>
                    <input
                      type="text"
                      value={newBannerKickerAr}
                      onChange={(e) => setNewBannerKickerAr(e.target.value)}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'العنوان العلوي الصغير (إنجليزي)' : 'Kicker Label (EN)'}
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      value={newBannerKickerEn}
                      onChange={(e) => setNewBannerKickerEn(e.target.value)}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'العنوان الرئيسي الكبير (عربي) *' : 'Headline (AR) *'}
                    </span>
                    <input
                      type="text"
                      required
                      value={newBannerTitleAr}
                      onChange={(e) => setNewBannerTitleAr(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: عسل الضبايه الجامد الفاخر...' : 'Headline AR'}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'العنوان الرئيسي الكبير (إنجليزي)' : 'Headline (EN)'}
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      value={newBannerTitleEn}
                      onChange={(e) => setNewBannerTitleEn(e.target.value)}
                      placeholder="Headline EN"
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'النص التوضيحي أسفل العنوان (عربي)' : 'Subtitle (AR)'}
                    </span>
                    <textarea
                      rows={2}
                      value={newBannerSubAr}
                      onChange={(e) => setNewBannerSubAr(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'النص التوضيحي أسفل العنوان (إنجليزي)' : 'Subtitle (EN)'}
                    </span>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={newBannerSubEn}
                      onChange={(e) => setNewBannerSubEn(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'نص الزر (عربي)' : 'CTA Button (AR)'}
                    </span>
                    <input
                      type="text"
                      value={newBannerCtaAr}
                      onChange={(e) => setNewBannerCtaAr(e.target.value)}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'نص الزر (إنجليزي)' : 'CTA Button (EN)'}
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      value={newBannerCtaEn}
                      onChange={(e) => setNewBannerCtaEn(e.target.value)}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                  </label>

                  <label className="space-y-1 sm:col-span-2">
                    <span className="font-semibold text-[#1F2937]/75">
                      {lang === 'ar' ? 'القسم الذي يفتح عند الضغط على الزر' : 'Target Category on Click'}
                    </span>
                    <select
                      value={newBannerCategory}
                      onChange={(e) => setNewBannerCategory(e.target.value)}
                      className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                    >
                      <option value="all">{lang === 'ar' ? 'الكل' : 'All Products'}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {lang === 'ar' ? c.label.ar : c.label.en}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* New Slide Image Uploader */}
                <div className="p-3 rounded-xl bg-white border border-[#E5DEC9] space-y-2">
                  <div className="font-semibold text-[#1F2937]">
                    {lang === 'ar' ? 'صورة الشريحة الرئيسية' : 'Slide Image'}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-16 h-12 rounded-xl overflow-hidden border border-[#E5DEC9] shrink-0">
                      <ProductImage
                        src={newBannerImage}
                        alt="New banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="min-h-[36px] px-3 rounded-xl bg-[#D97706] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'رفع صورة من الجهاز' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (!file) return;
                          const dataUrl = await compressImageFile(file);
                          setNewBannerImage(dataUrl);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={newBannerImage}
                      onChange={(e) => setNewBannerImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 min-w-[180px] min-h-[36px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                    />
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) setNewBannerImage(e.target.value);
                      }}
                      className="min-h-[36px] px-2.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB]"
                    >
                      <option value="">
                        {lang === 'ar' ? 'اختر من صور المنتجات...' : 'Pick from products...'}
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.images[0] ?? ''}>
                          {lang === 'ar' ? p.name.ar : p.name.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBanner(false)}
                    className="min-h-[38px] px-4 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="min-h-[38px] px-5 rounded-xl bg-[#4D7C0F] hover:bg-[#3F6212] text-white font-semibold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'حفظ وإضافة الشريحة' : 'Create Slide'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Hero Slides List */}
            <div className="space-y-4">
              {heroBanners.map((b, idx) => {
                const isEditing = editingBannerId === b.id && editBannerDraft;
                const targetCat = categories.find((c) => c.id === b.targetCategory);
                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-24 h-20 rounded-2xl overflow-hidden border border-[#E5DEC9] bg-white shrink-0">
                          <ProductImage
                            src={b.image}
                            alt={lang === 'ar' ? b.title.ar : b.title.en}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="font-bold px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#1F2937]">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-[#4D7C0F]">
                              {lang === 'ar' ? b.kicker.ar : b.kicker.en}
                            </span>
                            <span
                              className={`font-semibold px-2 py-0.5 rounded ${
                                b.active
                                  ? 'bg-lime-100 text-[#4D7C0F]'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {b.active
                                ? lang === 'ar'
                                  ? 'ظاهرة بالرئيسية'
                                  : 'Visible'
                                : lang === 'ar'
                                ? 'مخفية'
                                : 'Hidden'}
                            </span>
                            <span className="text-[#1F2937]/60">
                              ←{' '}
                              {targetCat
                                ? lang === 'ar'
                                  ? targetCat.label.ar
                                  : targetCat.label.en
                                : lang === 'ar'
                                ? 'الكل'
                                : 'All'}
                            </span>
                          </div>
                          <div className="font-bold text-sm sm:text-base text-[#1F2937] line-clamp-1">
                            {lang === 'ar' ? b.title.ar : b.title.en}
                          </div>
                          <p className="text-xs text-[#1F2937]/70 line-clamp-1">
                            {lang === 'ar' ? b.subtitle.ar : b.subtitle.en}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveHeroBanner(b.id, 'up')}
                          title={lang === 'ar' ? 'تحريك للأعلى' : 'Move up'}
                          className="min-h-[36px] min-w-[36px] rounded-xl bg-white border border-[#E5DEC9] disabled:opacity-35 flex items-center justify-center text-[#1F2937]"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === heroBanners.length - 1}
                          onClick={() => moveHeroBanner(b.id, 'down')}
                          title={lang === 'ar' ? 'تحريك للأسفل' : 'Move down'}
                          className="min-h-[36px] min-w-[36px] rounded-xl bg-white border border-[#E5DEC9] disabled:opacity-35 flex items-center justify-center text-[#1F2937]"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => updateHeroBanner(b.id, { active: !b.active })}
                          className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1"
                        >
                          {b.active ? (
                            <EyeOff className="w-3.5 h-3.5 text-[#1F2937]/70" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-[#4D7C0F]" />
                          )}
                          <span>{b.active ? (lang === 'ar' ? 'إخفاء' : 'Hide') : (lang === 'ar' ? 'إظهار' : 'Show')}</span>
                        </button>

                        <label className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{lang === 'ar' ? 'تغيير الصورة' : 'Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (!file) return;
                              const dataUrl = await compressImageFile(file);
                              updateHeroBanner(b.id, { image: dataUrl });
                              if (isEditing && editBannerDraft) {
                                setEditBannerDraft({ ...editBannerDraft, image: dataUrl });
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            isEditing
                              ? (setEditingBannerId(null), setEditBannerDraft(null))
                              : openBannerEditor(b)
                          }
                          className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>
                            {isEditing
                              ? lang === 'ar'
                                ? 'إغلاق'
                                : 'Close'
                              : lang === 'ar'
                              ? 'تعديل الكتابة والصورة'
                              : 'Edit'}
                          </span>
                        </button>

                        {confirmDeleteBannerId === b.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                deleteHeroBanner(b.id);
                                setConfirmDeleteBannerId(null);
                              }}
                              className="min-h-[36px] px-3 rounded-xl bg-[#DC2626] text-white text-xs font-semibold"
                            >
                              {lang === 'ar' ? 'تأكيد' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteBannerId(null)}
                              className="min-h-[36px] px-2.5 rounded-xl bg-white border border-[#E5DEC9] text-xs font-semibold"
                            >
                              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteBannerId(b.id)}
                            className="min-h-[36px] px-3 rounded-xl bg-white border border-red-200 text-[#DC2626] hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Full Slide Editor */}
                    {isEditing && (
                      <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'الشريط العلوي (عربي)' : 'Kicker (AR)'}
                            </span>
                            <input
                              type="text"
                              value={editBannerDraft.kickerAr}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, kickerAr: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'الشريط العلوي (إنجليزي)' : 'Kicker (EN)'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={editBannerDraft.kickerEn}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, kickerEn: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'العنوان الرئيسي (عربي)' : 'Main Title (AR)'}
                            </span>
                            <input
                              type="text"
                              value={editBannerDraft.titleAr}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, titleAr: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white font-semibold"
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'العنوان الرئيسي (إنجليزي)' : 'Main Title (EN)'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={editBannerDraft.titleEn}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, titleEn: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'النص التفصيلي (عربي)' : 'Subtitle (AR)'}
                            </span>
                            <textarea
                              rows={2}
                              value={editBannerDraft.subAr}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, subAr: e.target.value })
                              }
                              className="w-full p-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'النص التفصيلي (إنجليزي)' : 'Subtitle (EN)'}
                            </span>
                            <textarea
                              rows={2}
                              dir="ltr"
                              value={editBannerDraft.subEn}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, subEn: e.target.value })
                              }
                              className="w-full p-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'نص زر الإجراء (عربي)' : 'CTA Label (AR)'}
                            </span>
                            <input
                              type="text"
                              value={editBannerDraft.ctaAr}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, ctaAr: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'نص زر الإجراء (إنجليزي)' : 'CTA Label (EN)'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={editBannerDraft.ctaEn}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, ctaEn: e.target.value })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                          </label>

                          <label className="space-y-1 sm:col-span-2">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'القسم المستهدف عند النقر على الزر' : 'Target Category'}
                            </span>
                            <select
                              value={editBannerDraft.targetCategory}
                              onChange={(e) =>
                                setEditBannerDraft({
                                  ...editBannerDraft,
                                  targetCategory: e.target.value,
                                })
                              }
                              className="w-full min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            >
                              <option value="all">{lang === 'ar' ? 'الكل' : 'All Products'}</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {lang === 'ar' ? c.label.ar : c.label.en}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-2">
                          <div className="font-semibold text-[#1F2937]">
                            {lang === 'ar' ? 'تعديل رابط أو صورة الشريحة' : 'Slide Image URL or Product Pick'}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              dir="ltr"
                              value={editBannerDraft.image}
                              onChange={(e) =>
                                setEditBannerDraft({ ...editBannerDraft, image: e.target.value })
                              }
                              placeholder="https://example.com/banner.jpg"
                              className="flex-1 min-w-[180px] min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            />
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  setEditBannerDraft({
                                    ...editBannerDraft,
                                    image: e.target.value,
                                  });
                                }
                              }}
                              className="min-h-[36px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white"
                            >
                              <option value="">
                                {lang === 'ar' ? 'اختر من صور المنتجات...' : 'Pick product photo...'}
                              </option>
                              {products.map((p) => (
                                <option key={p.id} value={p.images[0] ?? ''}>
                                  {lang === 'ar' ? p.name.ar : p.name.en}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBannerId(null);
                              setEditBannerDraft(null);
                            }}
                            className="min-h-[36px] px-4 rounded-xl border border-[#E5DEC9] bg-white font-semibold"
                          >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={() => saveBannerEdit(b.id)}
                            className="min-h-[36px] px-5 rounded-xl bg-[#4D7C0F] hover:bg-[#3F6212] text-white font-semibold inline-flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حفظ تعديلات الشريحة' : 'Save Slide'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. All Home Page Copy & Sections Visibility Control */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? 'التحكم بجميع كتابات وعناصر الصفحة الرئيسية'
                      : 'Home Page Copy, Quick Search & Section Visibility'}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65">
                  {lang === 'ar'
                    ? 'عدّل نصوص البحث السريع، شريط المميزات، عناوين العروض والكتالوج، وتحكم في إظهار أو إخفاء أي قسم.'
                    : 'Customize search bar text, quick search tags, value strip cards, offers & catalog headings, and toggle section visibility.'}
                </p>
              </div>
              <button
                type="button"
                onClick={resetHomeSettings}
                className="min-h-[40px] px-3.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] text-xs font-semibold text-[#1F2937] hover:bg-amber-100 inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'استعادة النصوص الافتراضية' : 'Reset Home Copy'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveHomeSettings} className="space-y-5 text-xs">
              {/* Visibility Toggles */}
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-[#1F2937]">
                  <input
                    type="checkbox"
                    checked={hsDraft.showSearchBar}
                    onChange={(e) => setHsDraft({ ...hsDraft, showSearchBar: e.target.checked })}
                    className="accent-[#D97706] w-4 h-4"
                  />
                  <span>{lang === 'ar' ? 'إظهار شريط البحث العلوي' : 'Show Top Search Bar'}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-[#1F2937]">
                  <input
                    type="checkbox"
                    checked={hsDraft.showHeroSlider}
                    onChange={(e) => setHsDraft({ ...hsDraft, showHeroSlider: e.target.checked })}
                    className="accent-[#D97706] w-4 h-4"
                  />
                  <span>{lang === 'ar' ? 'إظهار السلايدر الرئيسي' : 'Show Hero Slider'}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-[#1F2937]">
                  <input
                    type="checkbox"
                    checked={hsDraft.showValueStrip}
                    onChange={(e) => setHsDraft({ ...hsDraft, showValueStrip: e.target.checked })}
                    className="accent-[#D97706] w-4 h-4"
                  />
                  <span>
                    {lang === 'ar' ? 'إظهار شريط المميزات (الفحص/النقاط/التوصيل)' : 'Show Value Strip'}
                  </span>
                </label>
              </div>

              {/* Copy Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص حقل البحث العلوي (عربي)' : 'Search Placeholder (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.searchPlaceholderAr}
                    onChange={(e) =>
                      setHsDraft({ ...hsDraft, searchPlaceholderAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص حقل البحث العلوي (إنجليزي)' : 'Search Placeholder (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.searchPlaceholderEn}
                    onChange={(e) =>
                      setHsDraft({ ...hsDraft, searchPlaceholderEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar'
                      ? 'وسوم البحث السريع (افصل بينها بفاصلة)'
                      : 'Quick Search Chips (AR, comma separated)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.quickTermsAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, quickTermsAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar'
                      ? 'وسوم البحث السريع إنجليزي (comma separated)'
                      : 'Quick Search Chips (EN, comma separated)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.quickTermsEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, quickTermsEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'زر جولة المتجر (عربي)' : 'App Tour Button (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.tourLabelAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, tourLabelAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'زر جولة المتجر (إنجليزي)' : 'App Tour Button (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.tourLabelEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, tourLabelEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ١: عنوان النقاء (عربي)' : 'Value 1 Title (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.purityTitleAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, purityTitleAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ١: عنوان النقاء (إنجليزي)' : 'Value 1 Title (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.purityTitleEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, purityTitleEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ١: وصف النقاء (عربي)' : 'Value 1 Subtitle (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.puritySubAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, puritySubAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ١: وصف النقاء (إنجليزي)' : 'Value 1 Subtitle (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.puritySubEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, puritySubEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ٢: رابط النقاط (عربي)' : 'Value 2 Loyalty CTA (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.loyaltyCtaAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, loyaltyCtaAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ٢: رابط النقاط (إنجليزي)' : 'Value 2 Loyalty CTA (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.loyaltyCtaEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, loyaltyCtaEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ٣: عنوان التوصيل (عربي)' : 'Value 3 Shipping Title (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.shippingTitleAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, shippingTitleAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'شريط المميزات ٣: عنوان التوصيل (إنجليزي)' : 'Value 3 Shipping Title (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.shippingTitleEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, shippingTitleEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان شريط العروض الفرعي (عربي)' : 'Offers Kicker (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.offersKickerAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, offersKickerAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان شريط العروض الفرعي (إنجليزي)' : 'Offers Kicker (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.offersKickerEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, offersKickerEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'العنوان الرئيسي لقسم العروض (عربي)' : 'Offers Heading (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.offersHeadingAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, offersHeadingAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'العنوان الرئيسي لقسم العروض (إنجليزي)' : 'Offers Heading (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.offersHeadingEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, offersHeadingEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان قسم المنتجات (عربي)' : 'Catalog Heading (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.catalogTitleAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, catalogTitleAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان قسم المنتجات (إنجليزي)' : 'Catalog Heading (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.catalogTitleEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, catalogTitleEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'وصف قسم المنتجات (عربي)' : 'Catalog Subtitle (AR)'}
                  </span>
                  <input
                    type="text"
                    value={hsDraft.catalogSubAr}
                    onChange={(e) => setHsDraft({ ...hsDraft, catalogSubAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'وصف قسم المنتجات (إنجليزي)' : 'Catalog Subtitle (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={hsDraft.catalogSubEn}
                    onChange={(e) => setHsDraft({ ...hsDraft, catalogSubEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="min-h-[44px] px-6 rounded-xl bg-[#4D7C0F] hover:bg-[#3F6212] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'حفظ جميع إعدادات الواجهة الرئيسية' : 'Save All Home Page Copy'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB: ABOUT US & CONTACT MANAGEMENT */}
      {tab === 'about_contact' && (
        <div className="space-y-6">
          {/* 1. Visibility & Hero + Logo Settings + Contact Details & Form */}
          <form
            onSubmit={handleSaveAboutSettings}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? 'التحكم الكامل بصفحة من نحن وتواصل معنا'
                      : 'Full About Us & Contact Us Page Controls'}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65 mt-0.5">
                  {lang === 'ar'
                    ? 'عدّل نصوص التعريف، صورة الشعار، بيانات التواصل، ونموذج المراسلة باللغتين وتظهر فوراً للعملاء.'
                    : 'Customize About intro, brand logo, direct contact details, and inquiry form text live.'}
                </p>
              </div>
              <button
                type="button"
                onClick={resetAboutSettings}
                className="min-h-[38px] px-3.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
              </button>
            </div>

            {/* Section Visibility Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <label className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between gap-2 cursor-pointer font-semibold">
                <span>{lang === 'ar' ? 'إظهار صندوق الشعار' : 'Show Logo Card'}</span>
                <input
                  type="checkbox"
                  checked={aboutDraft.showHeroLogoBox}
                  onChange={(e) =>
                    setAboutDraft({ ...aboutDraft, showHeroLogoBox: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#D97706]"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between gap-2 cursor-pointer font-semibold">
                <span>{lang === 'ar' ? 'إظهار الرؤية والرسالة والأهداف' : 'Show Vision & Mission'}</span>
                <input
                  type="checkbox"
                  checked={aboutDraft.showPillarsSection}
                  onChange={(e) =>
                    setAboutDraft({ ...aboutDraft, showPillarsSection: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#D97706]"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between gap-2 cursor-pointer font-semibold">
                <span>{lang === 'ar' ? 'إظهار قسم تواصل معنا' : 'Show Contact Section'}</span>
                <input
                  type="checkbox"
                  checked={aboutDraft.showContactSection}
                  onChange={(e) =>
                    setAboutDraft({ ...aboutDraft, showContactSection: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#D97706]"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between gap-2 cursor-pointer font-semibold">
                <span>{lang === 'ar' ? 'إظهار نموذج إرسال رسالة' : 'Show Contact Form'}</span>
                <input
                  type="checkbox"
                  checked={aboutDraft.showContactForm}
                  onChange={(e) =>
                    setAboutDraft({ ...aboutDraft, showContactForm: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#D97706]"
                />
              </label>
            </div>

            {/* Logo Image & Caption */}
            <div className="p-4 rounded-2xl bg-[#FFFBEB]/70 border border-[#E5DEC9] space-y-4">
              <div className="text-sm font-bold text-[#1F2937]">
                {lang === 'ar' ? 'صورة الشعار والوصف التعريفي (من نحن)' : 'Hero Logo Image & Intro Copy'}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <img
                  src={
                    aboutDraft.logoImage ||
                    '/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg'
                  }
                  alt="About Logo Preview"
                  className="w-24 h-24 rounded-2xl object-contain bg-white border border-[#E5DEC9] p-2 shrink-0"
                />
                <div className="flex-1 w-full space-y-2 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <label className="min-h-[38px] px-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'رفع صورة من الجهاز' : 'Upload Logo Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadAboutLogo}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    dir="ltr"
                    value={aboutDraft.logoImage}
                    onChange={(e) => setAboutDraft({ ...aboutDraft, logoImage: e.target.value })}
                    placeholder="https://... or /assets/..."
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'الشارة العلوية (عربي)' : 'Hero Kicker (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.heroKickerAr}
                    onChange={(e) => setAboutDraft({ ...aboutDraft, heroKickerAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'الشارة العلوية (إنجليزي)' : 'Hero Kicker (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.heroKickerEn}
                    onChange={(e) => setAboutDraft({ ...aboutDraft, heroKickerEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'العنوان الرئيسي (عربي)' : 'Hero Title (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.heroTitleAr}
                    onChange={(e) => setAboutDraft({ ...aboutDraft, heroTitleAr: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'العنوان الرئيسي (إنجليزي)' : 'Hero Title (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.heroTitleEn}
                    onChange={(e) => setAboutDraft({ ...aboutDraft, heroTitleEn: e.target.value })}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'النص التعريفي (عربي)' : 'Hero Description (AR)'}
                  </span>
                  <textarea
                    rows={3}
                    value={aboutDraft.heroDescAr}
                    onChange={(e) => setAboutDraft({ ...aboutDraft, heroDescAr: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'النص التعريفي (إنجليزي)' : 'Hero Description (EN)'}
                  </span>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={aboutDraft.heroDescEn}
                    onChange={(e) => setAboutDraft({ ...aboutDraft, heroDescEn: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص الزر الأول (عربي)' : 'Primary Button Label (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.heroPrimaryCtaAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, heroPrimaryCtaAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص الزر الأول (إنجليزي)' : 'Primary Button Label (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.heroPrimaryCtaEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, heroPrimaryCtaEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص الزر الثاني (عربي)' : 'Secondary Button Label (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.heroSecondaryCtaAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, heroSecondaryCtaAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص الزر الثاني (إنجليزي)' : 'Secondary Button Label (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.heroSecondaryCtaEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, heroSecondaryCtaEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'النص أسفل الشعار (عربي)' : 'Logo Caption (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.logoCaptionAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, logoCaptionAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'النص أسفل الشعار (إنجليزي)' : 'Logo Caption (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.logoCaptionEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, logoCaptionEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
              </div>
            </div>

            {/* Direct Contact Info & Form Copy */}
            <div className="p-4 rounded-2xl bg-[#FFFBEB]/70 border border-[#E5DEC9] space-y-4">
              <div className="text-sm font-bold text-[#1F2937]">
                {lang === 'ar'
                  ? 'بيانات التواصل المباشر وعناوين نموذج المراسلة'
                  : 'Direct Contact Channels & Form Copy'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان قسم تواصل معنا (عربي)' : 'Contact Heading (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.contactHeadingAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, contactHeadingAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان قسم تواصل معنا (إنجليزي)' : 'Contact Heading (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.contactHeadingEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, contactHeadingEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'وصف التواصل (عربي)' : 'Contact Subtitle (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.contactSubAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, contactSubAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'وصف التواصل (إنجليزي)' : 'Contact Subtitle (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.contactSubEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, contactSubEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'رقم الهاتف للعرض (مثل +967 777600045)' : 'Phone Display'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.phoneDisplay}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, phoneDisplay: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'الرقم عند النسخ' : 'Phone Copy Value'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.phoneCopyValue}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, phoneCopyValue: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان الهاتف (عربي)' : 'Phone Label (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.phoneLabelAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, phoneLabelAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان الهاتف (إنجليزي)' : 'Phone Label (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.phoneLabelEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, phoneLabelEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="md:col-span-2 space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Support Email'}
                  </span>
                  <input
                    type="email"
                    dir="ltr"
                    value={aboutDraft.emailValue}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, emailValue: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'تسمية البريد (عربي)' : 'Email Label (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.emailLabelAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, emailLabelAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'تسمية البريد (إنجليزي)' : 'Email Label (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.emailLabelEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, emailLabelEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'المقر والعنوان (عربي)' : 'Location & Origin (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.locationValueAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, locationValueAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'المقر والعنوان (إنجليزي)' : 'Location & Origin (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.locationValueEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, locationValueEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'ساعات الدوام (عربي)' : 'Working Hours (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.hoursValueAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, hoursValueAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'ساعات الدوام (إنجليزي)' : 'Working Hours (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.hoursValueEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, hoursValueEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان نموذج المراسلة (عربي)' : 'Form Heading (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.formHeadingAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, formHeadingAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'عنوان نموذج المراسلة (إنجليزي)' : 'Form Heading (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.formHeadingEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, formHeadingEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'وصف نموذج المراسلة (عربي)' : 'Form Subtitle (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.formSubAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, formSubAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'وصف نموذج المراسلة (إنجليزي)' : 'Form Subtitle (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.formSubEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, formSubEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص زر الإرسال (عربي)' : 'Submit Button (AR)'}
                  </span>
                  <input
                    type="text"
                    value={aboutDraft.formSubmitLabelAr}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, formSubmitLabelAr: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'نص زر الإرسال (إنجليزي)' : 'Submit Button (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={aboutDraft.formSubmitLabelEn}
                    onChange={(e) =>
                      setAboutDraft({ ...aboutDraft, formSubmitLabelEn: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="min-h-[44px] px-6 rounded-xl bg-[#4D7C0F] hover:bg-[#3F6212] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'حفظ جميع إعدادات من نحن وتواصل معنا'
                  : 'Save All About & Contact Settings'}
              </span>
            </button>
          </form>

          {/* 2. Vision / Mission / Goals Pillars CRUD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? 'إدارة بطاقات الرؤية والرسالة والأهداف والقيم'
                      : 'Vision, Mission, Goals & Values Cards (CRUD)'}
                  </span>
                </h3>
                <p className="text-xs text-[#1F2937]/65 mt-0.5">
                  {lang === 'ar'
                    ? 'أضف أو عدّل أو احذف أو أخفِ بطاقات الرؤية والرسالة والأهداف أو أضف بطاقات قيم جديدة.'
                    : 'Create, edit, show/hide, or delete Vision, Mission, Goals, or extra value cards.'}
                </p>
              </div>
              <span className="text-xs text-[#1F2937]/60 tabular-nums">
                {aboutSettings.pillars.length} {lang === 'ar' ? 'بطاقات' : 'cards'}
              </span>
            </div>

            <div className="space-y-3">
              {aboutSettings.pillars.map((pillar) => {
                const isEditing = editingPillarId === pillar.id && editPillarDraft;
                const IconComp =
                  pillar.iconKey === 'eye'
                    ? Eye
                    : pillar.iconKey === 'compass'
                    ? Compass
                    : pillar.iconKey === 'target'
                    ? Target
                    : pillar.iconKey === 'shield'
                    ? ShieldCheck
                    : pillar.iconKey === 'award'
                    ? Award
                    : Heart;

                return (
                  <div
                    key={pillar.id}
                    className={`p-4 rounded-2xl border space-y-3 ${
                      pillar.active
                        ? 'bg-[#FFFBEB]/60 border-[#E5DEC9]'
                        : 'bg-gray-50 border-gray-200 opacity-75'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'الأيقونة' : 'Icon'}
                            </span>
                            <select
                              value={editPillarDraft.iconKey}
                              onChange={(e) =>
                                setEditPillarDraft({
                                  ...editPillarDraft,
                                  iconKey: e.target.value as AboutPillarIcon,
                                })
                              }
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                            >
                              <option value="eye">{lang === 'ar' ? 'رؤية (عين)' : 'Eye'}</option>
                              <option value="compass">{lang === 'ar' ? 'رسالة (بوصلة)' : 'Compass'}</option>
                              <option value="target">{lang === 'ar' ? 'أهداف (هدف)' : 'Target'}</option>
                              <option value="shield">{lang === 'ar' ? 'موثوقية (درع)' : 'Shield'}</option>
                              <option value="award">{lang === 'ar' ? 'جودة (وسام)' : 'Award'}</option>
                              <option value="heart">{lang === 'ar' ? 'عناية (قلب)' : 'Heart'}</option>
                            </select>
                          </label>
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'العنوان (عربي)' : 'Title (AR)'}
                            </span>
                            <input
                              type="text"
                              value={editPillarDraft.titleAr}
                              onChange={(e) =>
                                setEditPillarDraft({ ...editPillarDraft, titleAr: e.target.value })
                              }
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (EN)'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={editPillarDraft.titleEn}
                              onChange={(e) =>
                                setEditPillarDraft({ ...editPillarDraft, titleEn: e.target.value })
                              }
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'النص (عربي)' : 'Body Text (AR)'}
                            </span>
                            <textarea
                              rows={2}
                              value={editPillarDraft.textAr}
                              onChange={(e) =>
                                setEditPillarDraft({ ...editPillarDraft, textAr: e.target.value })
                              }
                              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="font-semibold text-[#1F2937]/75">
                              {lang === 'ar' ? 'النص (إنجليزي)' : 'Body Text (EN)'}
                            </span>
                            <textarea
                              rows={2}
                              dir="ltr"
                              value={editPillarDraft.textEn}
                              onChange={(e) =>
                                setEditPillarDraft({ ...editPillarDraft, textEn: e.target.value })
                              }
                              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                            />
                          </label>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                          <button
                            type="button"
                            onClick={() => savePillarEdit(pillar.id)}
                            className="min-h-[36px] px-4 rounded-xl bg-[#4D7C0F] text-white font-semibold inline-flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حفظ' : 'Save'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPillarId(null);
                              setEditPillarDraft(null);
                            }}
                            className="min-h-[36px] px-4 rounded-xl bg-white border border-[#E5DEC9] font-semibold"
                          >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#D97706] shrink-0">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="font-bold text-sm text-[#1F2937]">
                              {pillar.title[lang]}
                              {!pillar.active && (
                                <span className="mx-2 px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 text-[10px]">
                                  {lang === 'ar' ? 'مخفية' : 'Hidden'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#1F2937]/75">{pillar.text[lang]}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
                          <button
                            type="button"
                            onClick={() => updateAboutPillar(pillar.id, { active: !pillar.active })}
                            className="min-h-[34px] px-3 rounded-xl bg-white border border-[#E5DEC9] font-semibold inline-flex items-center gap-1"
                          >
                            {pillar.active ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {pillar.active
                                ? lang === 'ar'
                                  ? 'إخفاء'
                                  : 'Hide'
                                : lang === 'ar'
                                ? 'إظهار'
                                : 'Show'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditPillar(pillar)}
                            className="min-h-[34px] px-3 rounded-xl bg-white border border-[#E5DEC9] font-semibold inline-flex items-center gap-1 text-[#D97706]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                          </button>
                          {confirmDeletePillarId === pillar.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteAboutPillar(pillar.id);
                                  setConfirmDeletePillarId(null);
                                }}
                                className="min-h-[34px] px-3 rounded-xl bg-red-600 text-white font-semibold"
                              >
                                {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeletePillarId(null)}
                                className="min-h-[34px] px-2.5 rounded-xl bg-white border border-[#E5DEC9]"
                              >
                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePillarId(pillar.id)}
                              className="min-h-[34px] px-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Pillar Form */}
            <form
              onSubmit={handleAddPillar}
              className="p-4 rounded-2xl bg-[#FFFBEB] border border-dashed border-[#D97706]/50 space-y-3 text-xs"
            >
              <div className="font-bold text-sm text-[#1F2937]">
                {lang === 'ar' ? '+ إضافة بطاقة رؤية/قيمة جديدة' : '+ Add New Pillar / Value Card'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'الأيقونة' : 'Icon'}
                  </span>
                  <select
                    value={newPillarIcon}
                    onChange={(e) => setNewPillarIcon(e.target.value as AboutPillarIcon)}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  >
                    <option value="shield">{lang === 'ar' ? 'درع الجودة' : 'Shield'}</option>
                    <option value="award">{lang === 'ar' ? 'وسام التميز' : 'Award'}</option>
                    <option value="heart">{lang === 'ar' ? 'رعاية العملاء' : 'Heart'}</option>
                    <option value="eye">{lang === 'ar' ? 'رؤية' : 'Eye'}</option>
                    <option value="compass">{lang === 'ar' ? 'رسالة' : 'Compass'}</option>
                    <option value="target">{lang === 'ar' ? 'هدف' : 'Target'}</option>
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'العنوان (عربي) *' : 'Title (AR) *'}
                  </span>
                  <input
                    type="text"
                    required
                    value={newPillarTitleAr}
                    onChange={(e) => setNewPillarTitleAr(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: ضمان الجودة المخبرية' : 'e.g. Lab Guarantee'}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (EN)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={newPillarTitleEn}
                    onChange={(e) => setNewPillarTitleEn(e.target.value)}
                    placeholder="e.g. Lab Quality Guarantee"
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'النص التوضيحي (عربي)' : 'Description (AR)'}
                  </span>
                  <textarea
                    rows={2}
                    value={newPillarTextAr}
                    onChange={(e) => setNewPillarTextAr(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب تفاصيل البطاقة هنا...' : 'Details in Arabic...'}
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#1F2937]/75">
                    {lang === 'ar' ? 'النص التوضيحي (إنجليزي)' : 'Description (EN)'}
                  </span>
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={newPillarTextEn}
                    onChange={(e) => setNewPillarTextEn(e.target.value)}
                    placeholder="Details in English..."
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="min-h-[40px] px-5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة البطاقة' : 'Add Card'}</span>
              </button>
            </form>
          </div>

          {/* 3. Customer Contact Messages Inbox */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#4D7C0F]" />
                  <span>
                    {lang === 'ar'
                      ? 'صندوق استفسارات ورسائل العملاء الواردة'
                      : 'Customer Inquiries Inbox'}
                  </span>
                </h3>
                <p className="text-xs text-[#1F2937]/65 mt-0.5">
                  {lang === 'ar'
                    ? 'الرسائل المرسلة من نموذج صفحة تواصل معنا تحفظ وتظهر هنا للإدارة فوراً.'
                    : 'Messages submitted from the Contact Us form appear here automatically.'}
                </p>
              </div>
              <span className="text-xs text-[#1F2937]/60 tabular-nums">
                {contactMessages.length} {lang === 'ar' ? 'رسائل' : 'messages'} (
                {contactMessages.filter((m) => !m.read).length}{' '}
                {lang === 'ar' ? 'غير مقروءة' : 'unread'})
              </span>
            </div>

            {contactMessages.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] text-center text-xs text-[#1F2937]/65">
                {lang === 'ar'
                  ? 'لا توجد رسائل عملاء جديدة حالياً. عند إرسال أي استفسار من صفحة تواصل معنا سيظهر هنا.'
                  : 'No customer inquiries yet. Submissions from the Contact Us form will appear here.'}
              </div>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      msg.read
                        ? 'bg-[#FFFBEB]/40 border-[#E5DEC9]'
                        : 'bg-[#FFFBEB] border-[#D97706]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#1F2937]">{msg.senderName}</span>
                        <span
                          dir="ltr"
                          className="px-2 py-0.5 rounded-lg bg-white border border-[#E5DEC9] text-xs font-semibold text-[#D97706]"
                        >
                          {msg.senderContact}
                        </span>
                        {!msg.read && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                            {lang === 'ar' ? 'جديد' : 'New'}
                          </span>
                        )}
                      </div>
                      <span dir="ltr" className="text-[11px] text-[#1F2937]/55 tabular-nums">
                        {msg.createdAt.slice(0, 16).replace('T', ' ')}
                      </span>
                    </div>

                    {msg.subject && (
                      <div className="text-xs font-semibold text-[#1F2937]">{msg.subject}</div>
                    )}
                    <p className="text-xs text-[#1F2937]/80 leading-relaxed whitespace-pre-line">
                      {msg.messageBody}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                      {!msg.read && (
                        <button
                          type="button"
                          onClick={() => markContactMessageRead(msg.id)}
                          className="min-h-[34px] px-3 rounded-xl bg-[#4D7C0F] text-white font-semibold inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'تحديد كمقروء' : 'Mark as Read'}</span>
                        </button>
                      )}
                      {confirmDeleteMsgId === msg.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              deleteContactMessage(msg.id);
                              setConfirmDeleteMsgId(null);
                            }}
                            className="min-h-[34px] px-3 rounded-xl bg-red-600 text-white font-semibold"
                          >
                            {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteMsgId(null)}
                            className="min-h-[34px] px-2.5 rounded-xl bg-white border border-[#E5DEC9]"
                          >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteMsgId(msg.id)}
                          className="min-h-[34px] px-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: ADMIN-ONLY REGISTERED CUSTOMERS DIRECTORY */}
      {tab === 'customers' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? 'سجل بيانات العملاء المسجلين (خاص بالإدارة فقط)'
                      : 'Registered Customer Accounts (Admin-Only Access)'}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65 mt-0.5">
                  {lang === 'ar'
                    ? 'الاسم ورقم الهاتف وبيانات العميل تظهر هنا للإدارة فقط ولا يطلع عليها أي عميل آخر؛ يظهر الاسم فقط في التقييمات.'
                    : 'Customer names and phone numbers are strictly visible to Admin only. Other shoppers only see names on product reviews.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadAdminCustomers()}
                className="min-h-[38px] px-3.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تحديث القائمة' : 'Refresh'}</span>
              </button>
            </div>

            {/* Privacy Shield Note */}
            <div className="p-3.5 rounded-2xl bg-lime-50/70 border border-[#4D7C0F]/30 flex items-center gap-2.5 text-xs text-[#1F2937]">
              <Lock className="w-4 h-4 text-[#4D7C0F] shrink-0" />
              <span>
                {lang === 'ar'
                  ? 'حماية الخصوصية مفعّلة: لا تُرسل أرقام هواتف العملاء أو بياناتهم إلى المتصفح العام أو التقييمات.'
                  : 'Privacy isolation active: customer phone numbers are excluded from public APIs and product reviews.'}
              </span>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9]">
                <div className="text-[#1F2937]/60">
                  {lang === 'ar' ? 'إجمالي العملاء المسجلين' : 'Total Registered Customers'}
                </div>
                <div className="text-xl font-bold text-[#1F2937] tabular-nums mt-0.5">
                  {adminCustomers.length}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9]">
                <div className="text-[#1F2937]/60">
                  {lang === 'ar' ? 'إجمالي الطلبات المسجلة' : 'Total Recorded Orders'}
                </div>
                <div className="text-xl font-bold text-[#D97706] tabular-nums mt-0.5">
                  {adminCustomers.reduce((sum, c) => sum + c.orderCount, 0)}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9]">
                <div className="text-[#1F2937]/60">
                  {lang === 'ar' ? 'إجمالي التقييمات' : 'Total Customer Reviews'}
                </div>
                <div className="text-xl font-bold text-[#4D7C0F] tabular-nums mt-0.5">
                  {adminCustomers.reduce((sum, c) => sum + c.reviewCount, 0)}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative text-xs">
              <Search className="w-4 h-4 text-[#1F2937]/45 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'ابحث بالاسم أو رقم الهاتف...'
                    : 'Search by name or phone number...'
                }
                className="w-full min-h-[40px] ps-9 pe-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] focus:outline-none focus:border-[#D97706]"
              />
            </div>

            {/* Customers List */}
            {customersLoading && adminCustomers.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] text-center text-xs text-[#1F2937]/65">
                {lang === 'ar' ? 'جاري تحميل بيانات العملاء...' : 'Loading customers...'}
              </div>
            ) : (
              (() => {
                const q = customerSearch.trim().toLowerCase();
                const filtered = adminCustomers.filter((c) => {
                  if (!q) return true;
                  return (
                    c.displayName.toLowerCase().includes(q) ||
                    c.phone.toLowerCase().includes(q)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-6 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] text-center text-xs text-[#1F2937]/65">
                      {lang === 'ar'
                        ? 'لا توجد حسابات عملاء مطابقة للبحث حالياً. أي عميل يسجل دخوله بالاسم ورقم الهاتف سيظهر هنا فوراً.'
                        : 'No matching customer records yet. Customers who sign in with Name & Phone appear here.'}
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {filtered.map((cust) => (
                      <div
                        key={cust.id}
                        className="p-4 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-[#1F2937]">
                              {cust.displayName}
                            </span>
                            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-100 text-[#D97706]">
                              {lang === 'ar' ? 'الاسم ورقم الهاتف' : 'Name & Phone'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#1F2937]/75">
                            {cust.phone && (
                              <span dir="ltr" className="inline-flex items-center gap-1 tabular-nums">
                                <Phone className="w-3.5 h-3.5 text-[#D97706]" />
                                <span>{cust.phone}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(`cphone-${cust.id}`, cust.phone)}
                                  className="text-[#D97706] hover:underline ms-1"
                                  aria-label="Copy phone"
                                >
                                  {copiedId === `cphone-${cust.id}` ? (
                                    <Check className="w-3 h-3 text-[#4D7C0F]" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#1F2937]/55 tabular-nums">
                            <span>
                              {lang === 'ar' ? 'الطلبات:' : 'Orders:'} {cust.orderCount}
                            </span>
                            <span>·</span>
                            <span>
                              {lang === 'ar' ? 'التقييمات:' : 'Reviews:'} {cust.reviewCount}
                            </span>
                            <span>·</span>
                            <span dir="ltr">
                              {lang === 'ar' ? 'آخر دخول:' : 'Last login:'}{' '}
                              {cust.lastLoginAt.slice(0, 16).replace('T', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 text-xs">
                          {confirmDeleteCustId === cust.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => void handleDeleteAdminCustomer(cust.id)}
                                className="min-h-[34px] px-3 rounded-xl bg-red-600 text-white font-semibold"
                              >
                                {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteCustId(null)}
                                className="min-h-[34px] px-2.5 rounded-xl bg-white border border-[#E5DEC9]"
                              >
                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteCustId(cust.id)}
                              className="min-h-[34px] px-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PRODUCT IMAGE MANAGER */}
      {tab === 'images' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar'
                ? 'تحديث وإدارة صور المنتجات (ينعكس فوراً في المتجر والسلة)'
                : 'Update & Manage Product Images'}
            </h2>
            <p className="text-xs text-[#1F2937]/65">
              {lang === 'ar'
                ? 'ارفع صورة من جهازك أو أضف رابط صورة جديدة، وحدد الصورة الرئيسية لكل منتج أو استعد الصور الافتراضية.'
                : 'Upload photos from your device or paste an image URL, set the primary photo, or reset to defaults.'}
            </p>
          </div>

          <div className="space-y-5">
            {products.map((prod) => {
              const urlVal = urlInputs[prod.id] ?? '';
              return (
                <div
                  key={prod.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFFBEB]/60 border border-[#E5DEC9] space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-[#1F2937]">{t(prod.name)}</span>
                      <span className="text-xs font-mono-code text-[#1F2937]/55 ms-2">
                        {prod.sku}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => resetProductImages(prod.id)}
                      className="min-h-[36px] px-3 rounded-xl border border-[#E5DEC9] bg-white hover:bg-amber-50 text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{lang === 'ar' ? 'استعادة الافتراضي' : 'Reset Default'}</span>
                    </button>
                  </div>

                  {/* Current Images Gallery Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {prod.images.map((imgSrc, idx) => (
                      <div
                        key={imgSrc + idx}
                        className={`rounded-xl bg-white border overflow-hidden flex flex-col ${
                          idx === 0 ? 'border-[#D97706]' : 'border-[#E5DEC9]'
                        }`}
                      >
                        <div className="aspect-[4/3] relative bg-amber-50/40">
                          <ProductImage
                            src={imgSrc}
                            alt={t(prod.name)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 flex items-center justify-between gap-1 text-[11px]">
                          {idx === 0 ? (
                            <span className="font-bold text-[#D97706] truncate">
                              {lang === 'ar' ? 'الصورة الرئيسية' : 'Primary'}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const reordered = [
                                  imgSrc,
                                  ...prod.images.filter((_, i) => i !== idx),
                                ];
                                updateProductImages(prod.id, reordered);
                              }}
                              className="inline-flex items-center gap-1 font-semibold text-[#4D7C0F] hover:underline truncate"
                            >
                              <ArrowUp className="w-3 h-3 shrink-0" />
                              <span>{lang === 'ar' ? 'تعيين رئيسية' : 'Make Primary'}</span>
                            </button>
                          )}

                          {prod.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                updateProductImages(
                                  prod.id,
                                  prod.images.filter((_, i) => i !== idx)
                                )
                              }
                              aria-label={lang === 'ar' ? 'حذف الصورة' : 'Remove image'}
                              className="p-1 text-[#1F2937]/45 hover:text-red-600 transition-colors shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload File + Add URL Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                    <label className="md:col-span-4 min-h-[42px] px-3.5 rounded-xl border border-dashed border-[#D97706]/60 bg-white hover:bg-amber-50/60 text-xs font-semibold text-[#1F2937] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span>
                        {lang === 'ar' ? 'رفع صورة من الجهاز (رئيسية)' : 'Upload Image File'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (!file) return;
                          const dataUrl = await compressImageFile(file);
                          updateProductImages(prod.id, [dataUrl, ...prod.images]);
                        }}
                      />
                    </label>

                    <div className="md:col-span-8 flex gap-2">
                      <input
                        type="url"
                        dir="ltr"
                        value={urlVal}
                        onChange={(e) =>
                          setUrlInputs((prev) => ({ ...prev, [prod.id]: e.target.value }))
                        }
                        placeholder="https://example.com/honey.jpg"
                        className="flex-1 min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-xs focus:outline-none focus:border-[#D97706]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = urlVal.trim();
                          if (!trimmed) return;
                          updateProductImages(prod.id, [trimmed, ...prod.images]);
                          setUrlInputs((prev) => ({ ...prev, [prod.id]: '' }));
                        }}
                        className="min-h-[42px] px-4 rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs font-semibold whitespace-nowrap transition-colors"
                      >
                        {lang === 'ar' ? 'إضافة كصورة رئيسية' : 'Set via URL'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: ARCHITECTURE, FLUTTER/RN CODE & MOCK JSON */}
      {tab === 'blueprint' && (
        <div className="space-y-6">
          {/* Folder Structures */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#1F2937]">
                {lang === 'ar'
                  ? '١. هيكلة مجلدات المشروع (Clean Architecture)'
                  : '1. Complete Project Folder Structure'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setArchStack('flutter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    archStack === 'flutter'
                      ? 'bg-[#D97706] text-white'
                      : 'bg-[#FFFBEB] text-[#1F2937]'
                  }`}
                >
                  Flutter (Dart + BLoC)
                </button>
                <button
                  type="button"
                  onClick={() => setArchStack('rn')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    archStack === 'rn'
                      ? 'bg-[#D97706] text-white'
                      : 'bg-[#FFFBEB] text-[#1F2937]'
                  }`}
                >
                  React Native (TS)
                </button>
              </div>
            </div>

            <div className="relative" dir="ltr">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    'tree',
                    archStack === 'flutter' ? FLUTTER_PROJECT_TREE : REACT_NATIVE_PROJECT_TREE
                  )
                }
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs inline-flex items-center gap-1"
              >
                {copiedId === 'tree' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === 'tree' ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="p-4 rounded-2xl bg-[#1F2937] text-amber-50 text-xs font-mono-code overflow-x-auto leading-relaxed">
                {archStack === 'flutter' ? FLUTTER_PROJECT_TREE : REACT_NATIVE_PROJECT_TREE}
              </pre>
            </div>
          </div>

          {/* Core Flutter Screen & BLoC Code */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar'
                ? '٢. الشيفرة البرمجية للشاشات الأساسية وإدارة الحالة'
                : '2. Core Screens & State Management Code'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FLUTTER_CORE_SNIPPETS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSnippetKey(key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    snippetKey === key
                      ? 'bg-[#D97706] text-white'
                      : 'bg-[#FFFBEB] border border-[#E5DEC9] text-[#1F2937]'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="space-y-2" dir="ltr">
              <div className="flex items-center justify-between text-xs text-[#1F2937]/70 font-mono-code">
                <span>{FLUTTER_CORE_SNIPPETS[snippetKey].filename}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(snippetKey, FLUTTER_CORE_SNIPPETS[snippetKey].code)}
                  className="inline-flex items-center gap-1 text-[#D97706] font-semibold"
                >
                  {copiedId === snippetKey ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === snippetKey ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#1F2937] text-amber-50 text-xs font-mono-code overflow-x-auto max-h-96 leading-relaxed">
                {FLUTTER_CORE_SNIPPETS[snippetKey].code}
              </pre>
            </div>
          </div>

          {/* Admin API & Firebase Endpoints + Live JSON Dataset */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
              <h2 className="text-base font-bold text-[#1F2937]">
                {lang === 'ar'
                  ? '٣. واجهات برمجة الإدارة والولاء (REST / Firestore)'
                  : '3. Admin & Loyalty API Endpoints'}
              </h2>
              <div className="space-y-3" dir="ltr">
                {ADMIN_API_ENDPOINTS.map((ep) => (
                  <div
                    key={ep.path}
                    className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-1.5 text-xs"
                  >
                    <div className="font-mono-code font-bold text-[#1F2937]">
                      <span className="text-[#4D7C0F] mr-2">{ep.method}</span>
                      <span>{ep.path}</span>
                    </div>
                    <p className="text-[#1F2937]/75">{ep.description}</p>
                    <pre className="p-2 rounded-lg bg-white border border-[#E5DEC9] font-mono-code text-[11px] overflow-x-auto">
                      {ep.payload}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#D97706]" />
                  <span>
                    {lang === 'ar'
                      ? '٤. بيانات المنتجات التجريبية (JSON)'
                      : '4. Authentic Arabic Mock JSON'}
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopy('json', JSON.stringify(products, null, 2))}
                  className="px-3 py-1.5 rounded-lg bg-[#FFFBEB] border border-[#E5DEC9] text-xs font-semibold text-[#D97706] inline-flex items-center gap-1"
                >
                  {copiedId === 'json' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === 'json' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre
                dir="ltr"
                className="p-4 rounded-2xl bg-[#1F2937] text-amber-50 text-xs font-mono-code overflow-auto max-h-[420px] leading-relaxed"
              >
                {JSON.stringify(products.slice(0, 3), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
