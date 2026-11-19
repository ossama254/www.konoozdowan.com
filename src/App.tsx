import React, { useEffect, useState } from 'react';
import { Award, Coins, Globe, Heart, Home, Info, Moon, Settings2, ShoppingBag, Sun, Tag, User } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { HomeView } from './components/HomeView';
import { OffersView } from './components/OffersView';
import { AboutContactView } from './components/AboutContactView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { ProfileLoyaltyView } from './components/ProfileLoyaltyView';
import { AdminArchitectureView } from './components/AdminArchitectureView';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  PushNotificationBell,
  PushNotificationPopup,
} from './components/PushNotificationCenter';

const AppShell: React.FC = () => {
  const {
    lang,
    toggleLang,
    theme,
    toggleTheme,
    view,
    setView,
    profileTab,
    setProfileTab,
    wishlist,
    offers,
    cart,
    setIsCartOpen,
    setIsSettingsOpen,
    currencySymbol,
    loyaltyPoints,
    authStatus,
    currentCustomer,
    setIsAuthModalOpen,
    toast,
  } = useStore();

  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handler = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBEB] text-[#1F2937] pb-20 md:pb-0">
      {/* Google Maps Demo Key Quota Exceeded Banner */}
      {mapsQuotaExceeded && (
        <div
          dir="ltr"
          className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm"
        >
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#FFFBEB]/95 backdrop-blur-md border-b border-[#E5DEC9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark & Logo */}
          <button
            type="button"
            onClick={() => setView('home')}
            className="inline-flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight text-[#1F2937] hover:text-[#D97706] transition-colors whitespace-nowrap shrink-0"
          >
            <img
              src="/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg"
              alt={lang === 'ar' ? 'شعار كنوز دوعن' : 'Kunooz Doan Logo'}
              className="w-10 h-10 object-contain mix-blend-multiply shrink-0"
            />
            <span>{lang === 'ar' ? 'كنوز دوعن' : 'Kunooz Doan'}</span>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary Navigation'}
            className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-medium text-[#1F2937]/75"
          >
            <button
              type="button"
              onClick={() => setView('home')}
              className={`hover:text-[#1F2937] transition-colors whitespace-nowrap shrink-0 ${
                view === 'home' ? 'text-[#D97706] font-semibold underline underline-offset-8' : ''
              }`}
            >
              {lang === 'ar' ? 'المتجر' : 'Store'}
            </button>
            <button
              type="button"
              onClick={() => setView('offers')}
              className={`inline-flex items-center gap-1 hover:text-[#1F2937] transition-colors whitespace-nowrap shrink-0 ${
                view === 'offers' ? 'text-[#D97706] font-semibold underline underline-offset-8' : ''
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{lang === 'ar' ? 'العروض' : 'Offers'}</span>
              <span className="tabular-nums">({offers.filter((o) => o.active).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setView('about')}
              className={`hover:text-[#1F2937] transition-colors whitespace-nowrap shrink-0 ${
                view === 'about' ? 'text-[#D97706] font-semibold underline underline-offset-8' : ''
              }`}
            >
              {lang === 'ar' ? 'من نحن' : 'About & Contact'}
            </button>
            <button
              type="button"
              onClick={() => {
                setView('profile');
                setProfileTab('loyalty');
              }}
              className={`hover:text-[#1F2937] transition-colors whitespace-nowrap shrink-0 ${
                view === 'profile' && profileTab !== 'wishlist'
                  ? 'text-[#D97706] font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              {lang === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </button>
            <button
              type="button"
              onClick={() => {
                setView('profile');
                setProfileTab('wishlist');
              }}
              className={`inline-flex items-center gap-1 hover:text-[#1F2937] transition-colors whitespace-nowrap shrink-0 ${
                view === 'profile' && profileTab === 'wishlist'
                  ? 'text-[#D97706] font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>{lang === 'ar' ? 'المفضلة' : 'Favorites'}</span>
              <span className="tabular-nums">({wishlist.length})</span>
            </button>
          </nav>

          {/* Zone 3: Quick Theme, Currency/Settings, Notifications, Android Install & Cart CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <PushNotificationBell />
            <PWAInstallButton variant="compact" />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark'
                  ? lang === 'ar'
                    ? 'التبديل للوضع الفاتح'
                    : 'Switch to Light Mode'
                  : lang === 'ar'
                  ? 'التبديل للوضع الداكن'
                  : 'Switch to Dark Mode'
              }
              title={
                theme === 'dark'
                  ? lang === 'ar'
                    ? 'الوضع الفاتح (حسب اللغة)'
                    : 'Light Mode'
                  : lang === 'ar'
                  ? 'الوضع الداكن (حسب اللغة)'
                  : 'Dark Mode'
              }
              className="min-h-[40px] min-w-[40px] md:min-h-[42px] md:min-w-[42px] rounded-xl border border-[#E5DEC9] bg-white hover:border-[#D97706] inline-flex items-center justify-center transition-colors shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#D97706]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setView('about')}
              aria-label={lang === 'ar' ? 'من نحن وتواصل معنا' : 'About & Contact'}
              className={`md:hidden min-h-[40px] px-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${
                view === 'about'
                  ? 'border-[#D97706] bg-amber-50 text-[#D97706]'
                  : 'border-[#E5DEC9] bg-white text-[#1F2937]'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'من نحن' : 'About'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              aria-label={
                authStatus === 'customer' && currentCustomer
                  ? currentCustomer.displayName
                  : lang === 'ar'
                  ? 'تسجيل الدخول أو زائر'
                  : 'Sign In / Guest'
              }
              title={
                authStatus === 'customer' && currentCustomer
                  ? currentCustomer.displayName
                  : lang === 'ar'
                  ? 'تسجيل الدخول أو الدخول كزائر'
                  : 'Sign In or Continue as Guest'
              }
              className="min-h-[40px] md:min-h-[42px] px-2.5 sm:px-3 rounded-xl border border-[#E5DEC9] bg-white hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <User
                className={`w-4 h-4 ${
                  authStatus === 'customer' ? 'text-[#4D7C0F]' : 'text-[#D97706]'
                }`}
              />
              <span className="hidden sm:inline max-w-[90px] truncate">
                {authStatus === 'customer' && currentCustomer
                  ? currentCustomer.displayName.split(' ')[0]
                  : lang === 'ar'
                  ? 'زائر / دخول'
                  : 'Sign In'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={lang === 'ar' ? 'إعدادات العملة' : 'Currency Settings'}
              title={lang === 'ar' ? 'تغيير العملة والإعدادات' : 'Change Currency & Settings'}
              className="min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white hover:border-[#D97706] text-xs font-bold text-[#1F2937] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Coins className="w-4 h-4 text-[#D97706]" />
              <span>{currencySymbol}</span>
            </button>
            <button
              type="button"
              onClick={toggleLang}
              aria-label={
                lang === 'ar' ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic'
              }
              title={lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}
              className="min-h-[40px] min-w-[40px] md:min-h-[42px] md:min-w-[42px] px-1.5 rounded-xl border border-[#E5DEC9] bg-white hover:border-[#D97706] inline-flex flex-col items-center justify-center gap-0.5 transition-colors shrink-0"
            >
              <Globe className="w-4 h-4 text-[#D97706]" />
              <span className="text-[9px] font-bold leading-none tracking-wider text-[#1F2937]">
                {lang === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{lang === 'ar' ? 'السلة' : 'Bag'}</span>
              <span className="tabular-nums font-bold">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {view === 'home' && <HomeView />}
        {view === 'offers' && <OffersView />}
        {view === 'about' && <AboutContactView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'profile' && <ProfileLoyaltyView />}
        {view === 'admin' && <AdminArchitectureView />}
      </main>

      {/* Quiet Footer */}
      <footer className="hidden md:block border-t border-[#E5DEC9] bg-white/60 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#1F2937]/65">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg"
              alt={lang === 'ar' ? 'شعار كنوز دوعن' : 'Kunooz Doan Logo'}
              className="w-9 h-9 object-contain mix-blend-multiply shrink-0"
            />
            <span>
              {lang === 'ar'
                ? '© ٢٠٢٦ كنوز دوعن — عسل طبيعي، زبيب فاخر ولوز عضوي'
                : '© 2026 Kunooz Doan — Natural Honey, Raisins & Organic Almonds'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setView('about')}
              className="hover:text-[#D97706]"
            >
              {lang === 'ar' ? 'من نحن وتواصل معنا' : 'About & Contact Us'}
            </button>
            <button
              type="button"
              onClick={() => setView('offers')}
              className="hover:text-[#D97706]"
            >
              {lang === 'ar'
                ? `العروض (${offers.filter((o) => o.active).length})`
                : `Offers (${offers.filter((o) => o.active).length})`}
            </button>
            <button
              type="button"
              onClick={() => {
                setView('profile');
                setProfileTab('wishlist');
              }}
              className="hover:text-[#D97706]"
            >
              {lang === 'ar' ? `المفضلة (${wishlist.length})` : `Favorites (${wishlist.length})`}
            </button>
            <button
              type="button"
              onClick={() => {
                setView('profile');
                setProfileTab('loyalty');
              }}
              className="hover:text-[#D97706]"
            >
              {lang === 'ar' ? `حصاد النقاط (${loyaltyPoints})` : `Rewards (${loyaltyPoints} pts)`}
            </button>
            <button
              type="button"
              onClick={() => setView('admin')}
              className={`inline-flex items-center gap-1.5 hover:text-[#D97706] transition-colors ${
                view === 'admin' ? 'text-[#D97706] font-bold' : 'font-semibold text-[#1F2937]'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Thumb Navigation (<10% viewport height) */}
      <nav
        aria-label={lang === 'ar' ? 'شريط التنقل السفلي' : 'Mobile Bottom Navigation'}
        className="md:hidden fixed bottom-0 start-0 end-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5DEC9] grid grid-cols-5 h-16"
      >
        <button
          type="button"
          onClick={() => setView('home')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            view === 'home' ? 'text-[#D97706] font-bold' : 'text-[#1F2937]/70'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{lang === 'ar' ? 'المتجر' : 'Store'}</span>
        </button>

        <button
          type="button"
          onClick={() => setView('offers')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            view === 'offers' ? 'text-[#D97706] font-bold' : 'text-[#1F2937]/70'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span>{lang === 'ar' ? 'العروض' : 'Offers'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#1F2937]/70 relative"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="tabular-nums">
            {lang === 'ar' ? `السلة (${cartCount})` : `Bag (${cartCount})`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setView('profile')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            view === 'profile' ? 'text-[#D97706] font-bold' : 'text-[#1F2937]/70'
          }`}
        >
          <Award className="w-5 h-5" />
          <span>{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
        </button>

        <button
          type="button"
          onClick={() => setView('admin')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            view === 'admin' ? 'text-[#D97706] font-bold' : 'text-[#1F2937]/70'
          }`}
        >
          <Settings2 className="w-5 h-5" />
          <span>{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
        </button>
      </nav>

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <OnboardingModal />
      <SettingsModal />
      <AuthModal />
      <OfflineIndicator />
      <PushNotificationPopup />

      {/* Action Toast Feedback */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-20 md:bottom-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#1F2937] text-white text-xs sm:text-sm font-medium shadow-xl max-w-[90vw] text-center"
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
