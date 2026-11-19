import React, { useState } from 'react';
import { CheckCircle2, Download, Share, Smartphone, Terminal, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useStore } from '../context/StoreContext';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const { lang, showToast } = useStore();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await promptInstall();
      if (accepted) {
        showToast(
          lang === 'ar'
            ? 'تم تثبيت تطبيق كنوز دوعن على جهازك بنجاح!'
            : 'Kunooz Doan app installed on your device!'
        );
      }
      return;
    }
    setShowGuideModal(true);
  };

  if (isInstalled && variant === 'compact') {
    return null;
  }

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={handleAction}
          aria-label={lang === 'ar' ? 'تثبيت تطبيق أندرويد' : 'Install Android App'}
          title={lang === 'ar' ? 'تثبيت كتطبيق أندرويد' : 'Install as Android App'}
          className="min-h-[40px] min-w-[40px] md:min-h-[42px] md:min-w-[42px] rounded-xl border border-[#D97706]/40 bg-amber-50 hover:bg-amber-100/80 inline-flex items-center justify-center transition-colors shrink-0"
        >
          <Smartphone className="w-4 h-4 text-[#D97706]" />
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1F2937]">
                  {lang === 'ar' ? 'تطبيق أندرويد (تثبيت مباشر)' : 'Android App (Direct Install)'}
                </h3>
                <p className="text-xs text-[#1F2937]/65 leading-relaxed mt-0.5">
                  {isInstalled
                    ? lang === 'ar'
                      ? 'التطبيق يعمل الآن بوضع التطبيق المستقل على جهازك.'
                      : 'Running in standalone app mode on your device.'
                    : lang === 'ar'
                    ? 'ثبّت متجر كنوز دوعن على هاتفك الأندرويد بأيقونة مستقلة ودعم التصفح دون إنترنت.'
                    : 'Install Kunooz Doan on your Android phone with a home screen icon and offline support.'}
                </p>
              </div>
            </div>
          </div>

          {isInstalled ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4D7C0F]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'مثبّت كتطبيق مستقل' : 'Installed as Standalone App'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAction}
              className="w-full min-h-[42px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>
                {isInstallable
                  ? lang === 'ar'
                    ? 'تثبيت تطبيق أندرويد الآن'
                    : 'Install Android App Now'
                  : lang === 'ar'
                  ? 'تثبيت على أندرويد / خطوات APK'
                  : 'Install on Android / APK Guide'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Install / Android APK Guide Modal */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'ar' ? 'تثبيت تطبيق أندرويد' : 'Install Android App'}
          onClick={() => setShowGuideModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FFFBEB] border border-[#E5DEC9] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="px-5 py-4 bg-white border-b border-[#E5DEC9] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src="/pwa-192x192.png"
                  alt={lang === 'ar' ? 'أيقونة كنوز دوعن' : 'Kunooz Doan Icon'}
                  className="w-9 h-9 rounded-xl border border-[#E5DEC9]"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
                    {lang === 'ar' ? 'تثبيت كنوز دوعن على أندرويد' : 'Install Kunooz Doan on Android'}
                  </h2>
                  <p className="text-[11px] text-[#1F2937]/60">
                    {lang === 'ar' ? 'تطبيق ويب متكامل (PWA) + جاهز لـ APK' : 'Installable Android PWA + APK Ready'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="min-h-[38px] min-w-[38px] rounded-xl border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50"
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4 text-[#1F2937]" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm text-[#1F2937]">
              {isIOS ? (
                <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-2.5">
                  <div className="font-bold flex items-center gap-2 text-[#D97706]">
                    <Share className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'التثبيت على iPhone / Safari' : 'Install on iPhone / Safari'}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#1F2937]/80">
                    <li>{lang === 'ar' ? 'اضغط على أيقونة المشاركة في أسفل المتصفح.' : 'Tap the Share button at the bottom of Safari.'}</li>
                    <li>{lang === 'ar' ? 'اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).' : 'Tap "Add to Home Screen".'}</li>
                    <li>{lang === 'ar' ? 'اضغط "إضافة" وسيظهر التطبيق كأيقونة مستقلة.' : 'Tap "Add" to launch in full-screen app mode.'}</li>
                  </ol>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-2.5">
                  <div className="font-bold flex items-center gap-2 text-[#D97706]">
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {lang === 'ar'
                        ? '١. التثبيت المباشر على هاتف أندرويد (Chrome)'
                        : '1. Direct Install on Android (Chrome)'}
                    </span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#1F2937]/80 leading-relaxed">
                    <li>
                      {lang === 'ar'
                        ? 'افتح رابط المتجر في متصفح Chrome على هاتفك الأندرويد.'
                        : 'Open the store link in Google Chrome on your Android phone.'}
                    </li>
                    <li>
                      {lang === 'ar'
                        ? 'اضغط على قائمة النقاط الثلاث (⋮) أعلى الشاشة واختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'
                        : 'Tap the three-dot menu (⋮) and choose "Install app" or "Add to Home screen".'}
                    </li>
                    <li>
                      {lang === 'ar'
                        ? 'سيتم تثبيت التطبيق بأيقونة كنوز دوعن وبشاشة كاملة مع حفظ البيانات للعمل عند انقطاع الإنترنت.'
                        : 'The app installs with the Kunooz Doan icon, full-screen standalone UI, and offline caching.'}
                    </li>
                  </ol>
                </div>
              )}

              {/* Developer APK packaging via Capacitor */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-2.5">
                <div className="font-bold flex items-center gap-2 text-[#4D7C0F]">
                  <Terminal className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? '٢. بناء ملف APK / AAB لمتجر Google Play (Capacitor)'
                      : '2. Build Native Android APK / AAB (Capacitor)'}
                  </span>
                </div>
                <p className="text-xs text-[#1F2937]/75 leading-relaxed">
                  {lang === 'ar'
                    ? 'تمت تهيئة ملف capacitor.config.json بمعرّف الحزمة com.kunoozdoan.store. لتصدير ملف APK عبر Android Studio نفّذ الأوامر التالية محلياً:'
                    : 'capacitor.config.json is preconfigured with appId com.kunoozdoan.store. Run these commands locally to compile an APK in Android Studio:'}
                </p>
                <pre
                  dir="ltr"
                  className="p-3 rounded-xl bg-[#1F2937] text-amber-50 text-[11px] font-mono-code overflow-x-auto leading-relaxed"
                >
{`npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
npx cap sync android
npx cap open android`}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full min-h-[44px] rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                {lang === 'ar' ? 'فهمت' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
