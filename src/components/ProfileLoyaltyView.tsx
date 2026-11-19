import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Gift,
  Globe,
  Heart,
  Moon,
  Package,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Truck,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types/store';
import { ProductImage } from './ProductImage';
import { PushPreferencesCard } from './PushNotificationCenter';

const ORDER_STEPS: {
  id: OrderStatus;
  label: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'pending',
    label: { ar: 'تم الطلب', en: 'Ordered' },
    desc: { ar: 'تم استلام طلبك بنجاح', en: 'Order received' },
    icon: Clock,
  },
  {
    id: 'confirmed',
    label: { ar: 'قيد التجهيز', en: 'Preparing' },
    desc: { ar: 'تعبئة وتغليف المنتجات', en: 'Packing your harvest' },
    icon: Package,
  },
  {
    id: 'out_for_delivery',
    label: { ar: 'جاري التوصيل', en: 'Out for Delivery' },
    desc: { ar: 'المندوب في طريقه إليك', en: 'Courier on the way' },
    icon: Truck,
  },
  {
    id: 'delivered',
    label: { ar: 'تم التوصيل', en: 'Delivered' },
    desc: { ar: 'تم تسليم الطلب بنجاح', en: 'Delivered to doorstep' },
    icon: CheckCircle2,
  },
];

export const ProfileLoyaltyView: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    themeByLang,
    setTheme,
    setThemeForLang,
    t,
    currency,
    setCurrency,
    currencies,
    formatPrice,
    loyaltySettings,
    loyaltyRewards,
    loyaltyPoints,
    lifetimePoints,
    loyaltyTier,
    tierMultiplier,
    nextTierThreshold,
    loyaltyTransactions,
    redeemedVouchers,
    redeemReward,
    orders,
    advanceOrderStatus,
    reorderOrder,
    products,
    wishlist,
    toggleWishlist,
    setSelectedProduct,
    addToCart,
    setIsCartOpen,
    notifications,
    profileTab,
    setProfileTab,
    setView,
    authStatus,
    currentCustomer,
    setIsAuthModalOpen,
    logoutCustomer,
  } = useStore();

  const [rewardMsg, setRewardMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [wishlistWeights, setWishlistWeights] = useState<Record<string, string>>({});

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
  const activeTab = profileTab;
  const setActiveTab = setProfileTab;
  const sortedTiers = [...loyaltySettings.tiers].sort((a, b) => a.minPoints - b.minPoints);
  const activeTierCfg =
    sortedTiers.find((tr) => tr.id === loyaltyTier) ?? sortedTiers[0];
  const topTier = sortedTiers[sortedTiers.length - 1];
  const isMaxTier = activeTierCfg && topTier && activeTierCfg.id === topTier.id;
  const tierProgress = isMaxTier
    ? 100
    : nextTierThreshold <= 0
    ? 100
    : Math.min(100, Math.round((lifetimePoints / nextTierThreshold) * 100));

  const handleRedeem = (rewardId: string) => {
    const reward = loyaltyRewards.find((r) => r.id === rewardId);
    if (!reward) return;
    const res = redeemReward(reward);
    setRewardMsg({ ok: res.ok, text: t(res.message) });
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Profile Header Summary */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
          <img
            src="/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg"
            alt={lang === 'ar' ? 'شعار كنوز دوعن' : 'Kunooz Doan Logo'}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl border border-[#E5DEC9] bg-white p-1 shrink-0"
          />
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#4D7C0F]">
              {activeTierCfg ? t(activeTierCfg.label) : loyaltyTier} · ×{tierMultiplier}{' '}
              {lang === 'ar' ? 'نقاط مضاعفة' : 'Points Multiplier'}
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              {authStatus === 'customer' && currentCustomer
                ? lang === 'ar'
                  ? `أهلاً بك، ${currentCustomer.displayName}`
                  : `Welcome back, ${currentCustomer.displayName}`
                : lang === 'ar'
                ? 'أهلاً بك، زائرنا الكريم'
                : 'Welcome, Guest Shopper'}
            </h1>
            <p className="text-xs sm:text-sm text-[#1F2937]/65">
              {authStatus === 'customer' && currentCustomer
                ? lang === 'ar'
                  ? 'بياناتك محفوظة بسرية للإدارة فقط، ويظهر اسمك فقط في تقييمات المنتجات.'
                  : 'Your phone number is visible only to Store Admin; only your name shows on product reviews.'
                : lang === 'ar'
                ? 'تتصفح الآن كزائر فقط — يمكنك تسجيل الدخول بالاسم ورقم الهاتف في أي وقت.'
                : 'Browsing as Guest only — sign in with your Name & Phone anytime.'}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="min-h-[36px] px-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>
                  {authStatus === 'customer'
                    ? lang === 'ar'
                      ? 'إدارة الحساب / تبديل الدخول'
                      : 'Account / Switch Login'
                    : lang === 'ar'
                    ? 'تسجيل الدخول (الاسم ورقم الهاتف)'
                    : 'Sign In (Name & Phone)'}
                </span>
              </button>
              {authStatus === 'customer' && (
                <button
                  type="button"
                  onClick={() => void logoutCustomer()}
                  className="min-h-[36px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs font-semibold text-[#1F2937]"
                >
                  {lang === 'ar' ? 'التبديل لوضع الزائر' : 'Switch to Guest'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E5DEC9] text-center sm:text-start">
          <div>
            <div className="text-[11px] sm:text-xs text-[#1F2937]/60">
              {lang === 'ar' ? 'رصيد النقاط المتاح' : 'Available Points'}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#D97706] tabular-nums">{loyaltyPoints}</div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#E5DEC9]" />
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className="text-center sm:text-start hover:opacity-80 transition-opacity"
          >
            <div className="text-[11px] sm:text-xs text-[#1F2937]/60">
              {lang === 'ar' ? 'الطلبات' : 'Orders'}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1F2937] tabular-nums">{orders.length}</div>
          </button>
          <div className="hidden sm:block h-10 w-px bg-[#E5DEC9]" />
          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className="text-center sm:text-start hover:opacity-80 transition-opacity"
          >
            <div className="text-[11px] sm:text-xs text-[#1F2937]/60">
              {lang === 'ar' ? 'المفضلة' : 'Saved'}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#DC2626] tabular-nums">
              {wishlistedProducts.length}
            </div>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'loyalty'}
          onClick={() => setActiveTab('loyalty')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'loyalty'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'ar' ? 'برنامج الولاء والمكافآت' : 'Loyalty & Rewards'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span className="tabular-nums">
            {lang === 'ar' ? `تتبع حالة الطلب (${orders.length})` : `Order Tracking (${orders.length})`}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'wishlist'}
          onClick={() => setActiveTab('wishlist')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'wishlist'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'fill-white' : 'text-[#DC2626]'}`} />
          <span className="tabular-nums">
            {lang === 'ar'
              ? `قائمة المفضلة (${wishlistedProducts.length})`
              : `Favorites (${wishlistedProducts.length})`}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#D97706] text-white'
              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الإعدادات والعملة' : 'Settings & Currency'}</span>
        </button>
      </div>

      {/* TAB 1: LOYALTY PROGRAM */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          {/* Tier Progress Card */}
          <div className="rounded-3xl bg-white border border-[#E5DEC9] overflow-hidden">
            {loyaltySettings.bannerImage && (
              <div className="h-36 sm:h-44 w-full relative bg-amber-50">
                <ProductImage
                  src={loyaltySettings.bannerImage}
                  alt={t(loyaltySettings.programTitle)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent flex items-end p-4 sm:p-6">
                  <span className="text-xs font-semibold text-amber-100">
                    {t(loyaltySettings.earnHint)}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              {!loyaltySettings.enabled && (
                <div className="p-3 rounded-xl bg-amber-50 border border-[#D97706]/40 text-xs font-semibold text-[#92400E]">
                  {lang === 'ar'
                    ? 'استبدال النقاط متوقف مؤقتاً للصيانة من قبل الإدارة — رصيد نقاطك محفوظ.'
                    : 'Points redemption is temporarily paused by admin — your points balance is safe.'}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#D97706]" />
                    <h2 className="text-lg font-bold text-[#1F2937]">
                      {t(loyaltySettings.programTitle)}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1F2937]/70">
                    {t(loyaltySettings.programSubtitle)}
                  </p>
                </div>
                <div className="text-sm font-bold text-[#4D7C0F] tabular-nums shrink-0">
                  {isMaxTier
                    ? lang === 'ar'
                      ? `أعلى مستوى (${activeTierCfg ? t(activeTierCfg.label) : ''})`
                      : `Highest Tier (${activeTierCfg ? t(activeTierCfg.label) : ''})`
                    : lang === 'ar'
                    ? `${lifetimePoints} / ${nextTierThreshold} نقطة للمستوى التالي`
                    : `${lifetimePoints} / ${nextTierThreshold} pts to next tier`}
                </div>
              </div>

              <div className="h-2.5 rounded-full bg-[#FFFBEB] border border-[#E5DEC9] overflow-hidden">
                <div
                  className="h-full bg-[#D97706] transition-all duration-500"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                {sortedTiers.map((tierCfg) => {
                  const active = loyaltyTier === tierCfg.id;
                  return (
                    <div
                      key={tierCfg.id}
                      className={`p-3 rounded-xl border ${
                        active
                          ? 'border-[#D97706] bg-amber-50/70 font-bold'
                          : 'border-[#E5DEC9] bg-[#FFFBEB]/50 text-[#1F2937]/70'
                      }`}
                    >
                      <div>{t(tierCfg.label)}</div>
                      <div className="flex items-center justify-between gap-1 mt-1 tabular-nums">
                        <span className="text-[#4D7C0F]">×{tierCfg.multiplier}</span>
                        <span className="text-[11px] opacity-70">
                          {tierCfg.minPoints}+ {lang === 'ar' ? 'نقطة' : 'pts'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {rewardMsg && (
            <div
              className={`p-4 rounded-2xl border text-sm font-medium flex items-center justify-between gap-3 ${
                rewardMsg.ok
                  ? 'bg-lime-50 border-[#4D7C0F]/30 text-[#4D7C0F]'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <span>{rewardMsg.text}</span>
              {rewardMsg.ok && (
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="underline font-bold whitespace-nowrap"
                >
                  {lang === 'ar' ? 'فتح السلة' : 'Open Cart'}
                </button>
              )}
            </div>
          )}

          {/* Available Rewards Catalog */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1F2937]">
              {t(loyaltySettings.rewardsSectionTitle)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loyaltyRewards.map((reward) => {
                const canAfford = loyaltyPoints >= reward.pointsCost;
                const inStock = reward.stock > 0;
                const disabled = !loyaltySettings.enabled || !canAfford || !inStock;
                return (
                  <div
                    key={reward.id}
                    className="p-4 rounded-2xl bg-white border border-[#E5DEC9] flex gap-4 items-center justify-between"
                  >
                    {reward.productImage ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-50 shrink-0 border border-[#E5DEC9]">
                        <ProductImage
                          src={reward.productImage}
                          alt={t(reward.title)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-amber-50 shrink-0 border border-[#E5DEC9] flex items-center justify-center text-[#D97706]">
                        <Gift className="w-8 h-8" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-xs font-semibold text-[#4D7C0F]">
                        {reward.type === 'discount'
                          ? lang === 'ar'
                            ? 'قسيمة خصم فورية'
                            : 'Instant Discount Voucher'
                          : lang === 'ar'
                          ? 'منتج حصري للأعضاء'
                          : 'Exclusive Member Product'}
                      </div>
                      <h4 className="text-sm font-bold text-[#1F2937]">{t(reward.title)}</h4>
                      <p className="text-xs text-[#1F2937]/65 line-clamp-2">{t(reward.description)}</p>
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#D97706] tabular-nums">
                          {reward.pointsCost} {lang === 'ar' ? 'نقطة' : 'pts'}
                        </span>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleRedeem(reward.id)}
                          className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:bg-gray-200 disabled:text-gray-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                        >
                          {!inStock
                            ? lang === 'ar'
                              ? 'نفدت الكمية'
                              : 'Out of Stock'
                            : !loyaltySettings.enabled
                            ? lang === 'ar'
                              ? 'متوقف'
                              : 'Paused'
                            : canAfford
                            ? lang === 'ar'
                              ? 'استبدال الآن'
                              : 'Redeem'
                            : lang === 'ar'
                            ? 'نقاط غير كافية'
                            : 'Need More Pts'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Vouchers + Points Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-3">
              <h3 className="text-sm font-bold text-[#1F2937]">
                {lang === 'ar' ? 'سجل النقاط والحركات' : 'Points Activity History'}
              </h3>
              <div className="divide-y divide-[#E5DEC9]/70">
                {loyaltyTransactions.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="min-w-0">
                      <div className="font-medium text-[#1F2937] truncate">{t(tx.description)}</div>
                      <div className="text-xs text-[#1F2937]/50 tabular-nums">{tx.date}</div>
                    </div>
                    <span
                      className={`font-bold tabular-nums shrink-0 ${
                        tx.points >= 0 ? 'text-[#4D7C0F]' : 'text-[#D97706]'
                      }`}
                    >
                      {tx.points >= 0 ? `+${tx.points}` : tx.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-3">
              <h3 className="text-sm font-bold text-[#1F2937]">
                {lang === 'ar' ? 'قسائمي المستبدلة وإشعارات الولاء' : 'Redeemed Vouchers & Alerts'}
              </h3>
              {redeemedVouchers.length === 0 ? (
                <p className="text-xs text-[#1F2937]/60">
                  {lang === 'ar'
                    ? 'لم تستبدل أي قسائم بعد — اختر مكافأة أعلاه لتفعيلها فوراً في سلتك.'
                    : 'No vouchers redeemed yet. Redeem any voucher above to apply it in your cart.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {redeemedVouchers.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#1F2937]">{t(v.title)}</div>
                        <div className="font-mono-code text-[#D97706]">{v.code}</div>
                      </div>
                      <span className={v.used ? 'text-[#1F2937]/50' : 'text-[#4D7C0F] font-semibold'}>
                        {v.used
                          ? lang === 'ar'
                            ? 'مستخدمة'
                            : 'Used'
                          : lang === 'ar'
                          ? 'جاهزة في السلة'
                          : 'Ready in Cart'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {notifications.length > 0 && (
                <div className="pt-3 border-t border-[#E5DEC9] space-y-2">
                  <div className="text-xs font-semibold text-[#1F2937]/70">
                    {lang === 'ar' ? 'أحدث التنبيهات' : 'Latest Alerts'}
                  </div>
                  {notifications.slice(0, 2).map((n) => (
                    <div key={n.id} className="text-xs text-[#1F2937]/80 bg-amber-50/50 p-2.5 rounded-xl">
                      <span className="font-bold block">{t(n.title)}</span>
                      <span>{t(n.body)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER STATUS TRACKING SCREEN */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          {/* Tracking Screen Header */}
          <div className="p-5 rounded-3xl bg-white border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#D97706]" />
                <span>{lang === 'ar' ? 'شاشة تتبع حالة الطلب' : 'Live Order Status Tracker'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#1F2937]/65">
                {lang === 'ar'
                  ? 'تحديث مباشر لمراحل الطلب (تم الطلب · قيد التجهيز · جاري التوصيل · تم التوصيل) مرتبطة بنظام إدارة الطلبات.'
                  : 'Real-time order stages synced directly with the store Order Management System.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setView('admin')}
              className="min-h-[40px] px-4 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] hover:bg-amber-50 text-xs font-semibold text-[#1F2937] transition-colors whitespace-nowrap"
            >
              {lang === 'ar' ? 'فتح نظام إدارة الطلبات' : 'Open Order Management'}
            </button>
          </div>

          {orders.map((order) => {
            const currentStepIdx = Math.max(
              0,
              ORDER_STEPS.findIndex((s) => s.id === order.status)
            );
            const activeStage = ORDER_STEPS[currentStepIdx];
            const progressPct = Math.round((currentStepIdx / (ORDER_STEPS.length - 1)) * 100);

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-base font-bold text-[#1F2937] tabular-nums">
                        {order.id}
                      </span>
                      <span className="text-xs font-bold text-[#4D7C0F]">
                        · {t(activeStage.label)}
                      </span>
                    </div>
                    <div className="text-xs text-[#1F2937]/65 tabular-nums">
                      {order.createdAt.slice(0, 10)} ·{' '}
                      {order.address.shippingScope === 'international' && order.address.countryName
                        ? `${lang === 'ar' ? 'شحن دولي' : 'Intl'}: ${t(order.address.countryName)} (${
                            order.address.city
                          })`
                        : order.address.city}{' '}
                      — {order.address.streetAddress} ·{' '}
                      {order.paymentDetails
                        ? t(order.paymentDetails.providerLabel)
                        : order.paymentMethod === 'cod'
                        ? lang === 'ar'
                          ? 'الدفع عند الاستلام'
                          : 'Cash on Delivery'
                        : order.paymentMethod === 'kuraimi'
                        ? lang === 'ar'
                          ? 'بنك الكريمي'
                          : 'Al-Kuraimi Bank'
                        : lang === 'ar'
                        ? 'محفظة إلكترونية'
                        : 'E-Wallet'}{' '}
                      · +{order.pointsEarned} {lang === 'ar' ? 'نقطة' : 'pts'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {order.status !== 'delivered' && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.id)}
                        className="min-h-[40px] px-3.5 rounded-xl border border-[#E5DEC9] hover:bg-amber-50 text-xs font-semibold text-[#1F2937] transition-colors"
                      >
                        {lang === 'ar' ? 'تقديم المرحلة' : 'Advance Stage'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => reorderOrder(order)}
                      className="min-h-[40px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إعادة الطلب' : 'Reorder'}</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar + 4 Connected Order Stages */}
                <div className="space-y-3 pt-1">
                  <div className="h-2 rounded-full bg-[#FFFBEB] border border-[#E5DEC9] overflow-hidden">
                    <div
                      className="h-full bg-[#4D7C0F] transition-all duration-500"
                      style={{ width: `${Math.max(8, progressPct)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {ORDER_STEPS.map((step, idx) => {
                      const StepIcon = step.icon;
                      const done = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div
                          key={step.id}
                          className={`p-3.5 rounded-2xl border transition-colors flex items-start gap-3 ${
                            isCurrent
                              ? 'border-[#D97706] bg-amber-50/70 text-[#1F2937] shadow-sm'
                              : done
                              ? 'border-[#4D7C0F]/40 bg-lime-50/60 text-[#1F2937]'
                              : 'border-[#E5DEC9] bg-[#FFFBEB]/50 text-[#1F2937]/45'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? 'bg-[#D97706] text-white'
                                : done
                                ? 'bg-[#4D7C0F] text-white'
                                : 'bg-white border border-[#E5DEC9] text-[#1F2937]/35'
                            }`}
                          >
                            <StepIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold flex items-center justify-between gap-1">
                              <span>{t(step.label)}</span>
                              <span className="tabular-nums text-[11px] opacity-65">
                                {idx + 1}/4
                              </span>
                            </div>
                            <p className="text-[11px] opacity-75 mt-0.5 leading-snug">
                              {t(step.desc)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="pt-3 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item) => (
                      <span key={item.cartKey} className="text-[#1F2937]/80">
                        {t(item.name)} ({t(item.weightLabel)}) × {item.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="font-bold text-[#1F2937] tabular-nums">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: DEDICATED WISHLIST / FAVORITES SECTION */}
      {activeTab === 'wishlist' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-white border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <Heart className="w-5 h-5 fill-[#DC2626] text-[#DC2626]" />
                <span>{lang === 'ar' ? 'قائمة المفضلة الخاصة بك' : 'Your Saved Favorites'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#1F2937]/65 tabular-nums">
                {lang === 'ar'
                  ? `لديك ${wishlistedProducts.length} منتجات محفوظة لسهولة الوصول وإعادة الطلب`
                  : `${wishlistedProducts.length} saved items ready for quick ordering`}
              </p>
            </div>

            {wishlistedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  wishlistedProducts.forEach((product) => {
                    const weightId = wishlistWeights[product.id] ?? product.weightOptions[0]?.id;
                    if (weightId) addToCart(product, weightId, 1);
                  });
                  setIsCartOpen(true);
                }}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة الكل للسلة' : 'Add All to Cart'}</span>
              </button>
            )}
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-[#E5DEC9] text-center space-y-4">
              <Heart className="w-10 h-10 text-[#DC2626]/40 mx-auto" />
              <div className="space-y-1">
                <p className="text-base font-semibold text-[#1F2937]">
                  {lang === 'ar' ? 'قائمة المفضلة فارغة' : 'No saved items yet'}
                </p>
                <p className="text-xs sm:text-sm text-[#1F2937]/60 max-w-md mx-auto">
                  {lang === 'ar'
                    ? 'اضغط على أيقونة القلب في بطاقة أي منتج بالمتجر لحفظه هنا والوصول إليه بسرعة.'
                    : 'Tap the heart icon on any product card in the store to save it here.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView('home')}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors"
              >
                {lang === 'ar' ? 'تصفح المتجر' : 'Browse Store'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlistedProducts.map((product) => {
                const chosenWeightId = wishlistWeights[product.id] ?? product.weightOptions[0]?.id;
                const activeOption =
                  product.weightOptions.find((w) => w.id === chosenWeightId) ?? product.weightOptions[0];
                const outOfStock = activeOption.stock <= 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="aspect-[4/3] relative bg-amber-50/40">
                      <ProductImage
                        src={product.images[0]}
                        alt={t(product.name)}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        aria-label={lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
                        title={lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
                        className="absolute top-3 end-3 min-h-[40px] min-w-[40px] rounded-full bg-white/95 border border-[#DC2626]/30 flex items-center justify-center text-[#DC2626] hover:bg-red-50 transition-colors shadow-sm"
                      >
                        <Heart className="w-4 h-4 fill-[#DC2626] text-[#DC2626]" />
                      </button>
                    </div>
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-[#4D7C0F] font-medium truncate">
                          {t(product.subCategory)} · {t(product.origin)}
                        </div>
                        <h3 className="text-sm font-bold text-[#1F2937] mt-0.5">{t(product.name)}</h3>
                        <div className="text-[11px] text-[#1F2937]/60 mt-0.5 tabular-nums">
                          {t(product.harvestSeason)}
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-[#E5DEC9]/60">
                        <select
                          value={activeOption.id}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setWishlistWeights((prev) => ({
                              ...prev,
                              [product.id]: e.target.value,
                            }))
                          }
                          aria-label={lang === 'ar' ? 'اختر الوزن' : 'Select weight'}
                          className="w-full min-h-[36px] px-2.5 py-1 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                        >
                          {product.weightOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {t(opt.label)} — {formatPrice(opt.price)}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-[#1F2937] tabular-nums">
                            {formatPrice(activeOption.price)}
                          </span>
                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, activeOption.id, 1);
                            }}
                            className="min-h-[40px] px-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:bg-gray-300 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>
                              {outOfStock
                                ? lang === 'ar'
                                  ? 'نفد'
                                  : 'Sold Out'
                                : lang === 'ar'
                                ? 'أضف للسلة'
                                : 'Add'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS & CURRENCY CONVERSION */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#D97706]" />
                  <span>
                    {lang === 'ar' ? 'إعدادات العملة والتحويل الفوري' : 'Currency & Instant Conversion'}
                  </span>
                </h2>
                <p className="text-xs text-[#1F2937]/65 mt-0.5">
                  {lang === 'ar'
                    ? 'يتم تحويل جميع أسعار المتجر والعروض والسلة فورياً وحفظ تفضيلك في المتصفح.'
                    : 'All catalog prices, offers, and cart totals convert immediately and persist locally.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#4D7C0F]">
                {lang === 'ar' ? 'محفوظ محلياً' : 'Saved Locally'}
              </span>
            </div>

            <div className="space-y-3">
              {currencies.map((cfg) => {
                  const active = currency === cfg.code;
                  const rateLabel = cfg.isBase
                    ? lang === 'ar'
                      ? 'العملة الأساسية (١ ر.ي)'
                      : 'Base Currency (1 YER)'
                    : lang === 'ar'
                    ? `سعر الصرف: ١ ${t(cfg.name)} = ${cfg.yerPerUnit} ر.ي`
                    : `Exchange rate: 1 ${cfg.code} = ${cfg.yerPerUnit} YER`;

                  return (
                    <button
                      key={cfg.code}
                      type="button"
                      onClick={() => setCurrency(cfg.code)}
                      aria-pressed={active}
                      className={`w-full p-4 rounded-2xl border text-start flex items-center justify-between gap-3 transition-all ${
                        active
                          ? 'border-[#D97706] bg-amber-50/60 shadow-sm ring-1 ring-[#D97706]/25'
                          : 'border-[#E5DEC9] bg-[#FFFBEB]/40 hover:border-[#D97706]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                            active
                              ? 'bg-[#D97706] text-white'
                              : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
                          }`}
                        >
                          {cfg.symbol[lang]}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#1F2937]">
                            {t(cfg.name)} ({cfg.code})
                          </div>
                          <div className="text-xs text-[#1F2937]/65 tabular-nums">{rateLabel}</div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          active ? 'border-[#D97706] bg-[#D97706]' : 'border-[#E5DEC9] bg-white'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm tabular-nums">
              <span className="text-[#1F2937]/75">
                {lang === 'ar'
                  ? 'مثال فوري (عسل سدر كنوز دوعن ٥٠٠ جم — ٢٧٠ ر.ي):'
                  : 'Live Conversion Sample (500g Doan Sidr — 270 YER):'}
              </span>
              <span className="font-bold text-[#D97706]">{formatPrice(270)}</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4 h-fit">
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#D97706]" />
              <span>{lang === 'ar' ? 'إعدادات اللغة والاتجاه' : 'Language & Layout'}</span>
            </h3>
            <p className="text-xs text-[#1F2937]/65">
              {lang === 'ar'
                ? 'اختر لغة عرض المتجر والتقارير.'
                : 'Choose the display language for store copy and labels.'}
            </p>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`w-full min-h-[46px] px-4 rounded-2xl border text-sm font-semibold flex items-center justify-between transition-colors ${
                  lang === 'ar'
                    ? 'border-[#D97706] bg-[#D97706] text-white'
                    : 'border-[#E5DEC9] bg-[#FFFBEB]/50 text-[#1F2937]'
                }`}
              >
                <span>العربية (الواجهة الافتراضية RTL)</span>
                {lang === 'ar' && <Check className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`w-full min-h-[46px] px-4 rounded-2xl border text-sm font-semibold flex items-center justify-between transition-colors ${
                  lang === 'en'
                    ? 'border-[#D97706] bg-[#D97706] text-white'
                    : 'border-[#E5DEC9] bg-[#FFFBEB]/50 text-[#1F2937]'
                }`}
              >
                <span>English (International LTR)</span>
                {lang === 'en' && <Check className="w-4 h-4" />}
              </button>
            </div>

            {/* Dark / Light Mode by Language */}
            <div className="pt-3 border-t border-[#E5DEC9] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-[#D97706]" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#D97706]" />
                  )}
                  <span>
                    {lang === 'ar'
                      ? 'مظهر الواجهة حسب اللغة'
                      : 'Appearance Mode by Language'}
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`min-h-[42px] px-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    theme === 'light'
                      ? 'border-[#D97706] bg-[#D97706] text-white'
                      : 'border-[#E5DEC9] bg-[#FFFBEB]/60 text-[#1F2937]'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`min-h-[42px] px-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    theme === 'dark'
                      ? 'border-[#D97706] bg-[#D97706] text-white'
                      : 'border-[#E5DEC9] bg-[#FFFBEB]/60 text-[#1F2937]'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setThemeForLang('ar', themeByLang.ar === 'dark' ? 'light' : 'dark')
                  }
                  className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between"
                >
                  <span className="font-semibold text-[#1F2937]">
                    {lang === 'ar' ? 'العربية' : 'Arabic'}
                  </span>
                  <span className="font-bold text-[#D97706] inline-flex items-center gap-1">
                    {themeByLang.ar === 'dark' ? (
                      <>
                        <Moon className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'داكن' : 'Dark'}</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'فاتح' : 'Light'}</span>
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setThemeForLang('en', themeByLang.en === 'dark' ? 'light' : 'dark')
                  }
                  className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between"
                >
                  <span className="font-semibold text-[#1F2937]">English</span>
                  <span className="font-bold text-[#D97706] inline-flex items-center gap-1">
                    {themeByLang.en === 'dark' ? (
                      <>
                        <Moon className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'داكن' : 'Dark'}</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'فاتح' : 'Light'}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            <PushPreferencesCard />
          </div>
        </div>
      )}
    </div>
  );
};
