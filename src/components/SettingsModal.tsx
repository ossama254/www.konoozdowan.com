import React from 'react';
import { Check, Coins, Globe, Moon, Sun, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PWAInstallButton } from './PWAInstallButton';
import { PushPreferencesCard } from './PushNotificationCenter';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
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
    setView,
    setProfileTab,
  } = useStore();

  if (!isSettingsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'إعدادات المتجر والعملة' : 'Store & Currency Settings'}
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FFFBEB] border border-[#E5DEC9] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="px-5 py-4 bg-white border-b border-[#E5DEC9] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar' ? 'إعدادات العملة واللغة' : 'Currency & Language Settings'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="min-h-[40px] min-w-[40px] rounded-xl border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50 transition-colors"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4 text-[#1F2937]" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Currency Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1F2937]">
                {lang === 'ar' ? 'اختر عملة العرض والتحويل الفوري:' : 'Select Display Currency:'}
              </span>
              <span className="text-[#4D7C0F] font-semibold">
                {lang === 'ar' ? 'يحفظ تلقائياً' : 'Auto-saved'}
              </span>
            </div>

            <div className="space-y-2.5">
              {currencies.map((cfg) => {
                const active = currency === cfg.code;
                const rateNote = cfg.isBase
                  ? lang === 'ar'
                    ? 'العملة الأساسية للمتجر'
                    : 'Store Base Currency'
                  : lang === 'ar'
                  ? `١ ${cfg.symbol.ar} = ${cfg.yerPerUnit} ر.ي`
                  : `1 ${cfg.code} = ${cfg.yerPerUnit} YER`;

                return (
                  <button
                    key={cfg.code}
                    type="button"
                    onClick={() => setCurrency(cfg.code)}
                    aria-pressed={active}
                    className={`w-full p-3.5 rounded-2xl border text-start flex items-center justify-between gap-3 transition-all ${
                      active
                        ? 'border-[#D97706] bg-white shadow-sm ring-1 ring-[#D97706]/30'
                        : 'border-[#E5DEC9] bg-white/75 hover:border-[#D97706]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                          active
                            ? 'bg-[#D97706] text-white'
                            : 'bg-[#FFFBEB] border border-[#E5DEC9] text-[#1F2937]'
                        }`}
                      >
                        {cfg.symbol[lang]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#1F2937]">
                          {t(cfg.name)} ({cfg.code})
                        </div>
                        <div className="text-xs text-[#1F2937]/60 tabular-nums">{rateNote}</div>
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

            <div className="p-3 rounded-xl bg-white border border-[#E5DEC9] text-xs text-[#1F2937]/75 flex items-center justify-between tabular-nums">
              <span>{lang === 'ar' ? 'معاينة فورية (٤٩٠ ر.ي):' : 'Live Preview (490 YER):'}</span>
              <span className="font-bold text-[#D97706] text-sm">{formatPrice(490)}</span>
            </div>
          </div>

          {/* Language & Per-Language Dark/Light Theme Selector */}
          <div className="space-y-3.5 pt-3 border-t border-[#E5DEC9]">
            <div className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#D97706]" />
              <span>{lang === 'ar' ? 'لغة الواجهة والمظهر (داكن / فاتح)' : 'Language & Appearance Mode'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`min-h-[42px] rounded-xl border text-xs font-semibold transition-colors ${
                  lang === 'ar'
                    ? 'border-[#D97706] bg-[#D97706] text-white'
                    : 'border-[#E5DEC9] bg-white text-[#1F2937]'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`min-h-[42px] rounded-xl border text-xs font-semibold transition-colors ${
                  lang === 'en'
                    ? 'border-[#D97706] bg-[#D97706] text-white'
                    : 'border-[#E5DEC9] bg-white text-[#1F2937]'
                }`}
              >
                English (LTR)
              </button>
            </div>

            {/* Active Language Theme Quick Toggle */}
            <div className="p-3 rounded-2xl bg-white border border-[#E5DEC9] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F2937]">
                  {lang === 'ar'
                    ? 'مظهر اللغة المختارة حالياً (العربية):'
                    : 'Current Language Theme (English):'}
                </span>
                <span className="text-[#D97706] font-semibold">
                  {theme === 'dark'
                    ? lang === 'ar'
                      ? 'داكن'
                      : 'Dark'
                    : lang === 'ar'
                    ? 'فاتح'
                    : 'Light'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`min-h-[38px] px-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    theme === 'light'
                      ? 'border-[#D97706] bg-[#D97706] text-white'
                      : 'border-[#E5DEC9] bg-[#FFFBEB] text-[#1F2937]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`min-h-[38px] px-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    theme === 'dark'
                      ? 'border-[#D97706] bg-[#D97706] text-white'
                      : 'border-[#E5DEC9] bg-[#FFFBEB] text-[#1F2937]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode'}</span>
                </button>
              </div>

              {/* Independent Per-Language Preset */}
              <div className="pt-2 border-t border-[#E5DEC9] grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9]">
                  <span className="font-semibold text-[#1F2937]">
                    {lang === 'ar' ? 'العربية:' : 'Arabic:'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setThemeForLang('ar', themeByLang.ar === 'dark' ? 'light' : 'dark')
                    }
                    className="font-bold text-[#D97706] inline-flex items-center gap-1"
                  >
                    {themeByLang.ar === 'dark' ? (
                      <>
                        <Moon className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'داكن' : 'Dark'}</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'فاتح' : 'Light'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9]">
                  <span className="font-semibold text-[#1F2937]">
                    {lang === 'ar' ? 'English:' : 'English:'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setThemeForLang('en', themeByLang.en === 'dark' ? 'light' : 'dark')
                    }
                    className="font-bold text-[#D97706] inline-flex items-center gap-1"
                  >
                    {themeByLang.en === 'dark' ? (
                      <>
                        <Moon className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'داكن' : 'Dark'}</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'فاتح' : 'Light'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Push Notifications Preferences */}
          <div className="pt-3 border-t border-[#E5DEC9]">
            <PushPreferencesCard />
          </div>

          {/* Android App Installation */}
          <div className="pt-3 border-t border-[#E5DEC9]">
            <PWAInstallButton variant="card" />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(false);
                setProfileTab('settings');
                setView('profile');
              }}
              className="text-xs font-semibold text-[#D97706] hover:underline"
            >
              {lang === 'ar' ? 'فتح إعدادات الملف الشخصي' : 'Open Profile Settings'}
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="min-h-[42px] px-6 rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              {lang === 'ar' ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
