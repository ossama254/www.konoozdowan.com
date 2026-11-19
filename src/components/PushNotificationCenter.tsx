import React, { useState } from 'react';
import {
  Award,
  Bell,
  BellRing,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NotificationTopic, PushNotificationItem } from '../types/store';

function getCategoryMeta(category: NotificationTopic | undefined, lang: 'ar' | 'en') {
  if (category === 'seasonal_discount') {
    return {
      label: lang === 'ar' ? 'خصم موسمي' : 'Seasonal Deal',
      color: 'text-[#B45309] bg-amber-50 border-amber-200',
      Icon: Tag,
    };
  }
  if (category === 'loyalty') {
    return {
      label: lang === 'ar' ? 'مكافآت الولاء' : 'Loyalty Alert',
      color: 'text-[#4D7C0F] bg-lime-50 border-lime-200',
      Icon: Award,
    };
  }
  return {
    label: lang === 'ar' ? 'توفر عسل جديد' : 'New Honey',
    color: 'text-[#92400E] bg-[#FFFBEB] border-[#E5DEC9]',
    Icon: Sparkles,
  };
}

export const PushNotificationBell: React.FC = () => {
  const {
    lang,
    t,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    notificationPermission,
    requestPushPermission,
    products,
    setSelectedProduct,
    setView,
    setProfileTab,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenNotification = (item: PushNotificationItem) => {
    markNotificationRead(item.id);
    setIsOpen(false);
    if (item.productId) {
      const targetProd = products.find((p) => p.id === item.productId);
      if (targetProd) {
        setSelectedProduct(targetProd);
        return;
      }
    }
    if (item.targetView === 'offers') {
      setView('offers');
      return;
    }
    if (item.targetView === 'profile') {
      setView('profile');
      setProfileTab('loyalty');
      return;
    }
    setView('home');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={lang === 'ar' ? 'مركز الإشعارات' : 'Notifications Center'}
        title={lang === 'ar' ? 'الإشعارات والتنبيهات' : 'Push Notifications'}
        className="relative min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] rounded-xl border border-[#E5DEC9] bg-white hover:border-[#D97706] text-[#1F2937] inline-flex items-center justify-center transition-colors shrink-0"
      >
        <Bell className="w-4 h-4 text-[#D97706]" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'ar' ? 'إشعارات العسل والعروض' : 'Honey & Offers Alerts'}
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FFFBEB] border border-[#E5DEC9] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-white border-b border-[#E5DEC9] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <BellRing className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
                    {lang === 'ar' ? 'التنبيهات والإشعارات المنبثقة' : 'Push Alerts & Updates'}
                  </h2>
                  <p className="text-[11px] text-[#1F2937]/60 tabular-nums">
                    {unreadNotificationCount > 0
                      ? lang === 'ar'
                        ? `${unreadNotificationCount} إشعار غير مقروء`
                        : `${unreadNotificationCount} unread alerts`
                      : lang === 'ar'
                      ? 'جميع الإشعارات مقروءة'
                      : 'All caught up'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="min-h-[36px] px-2.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] hover:bg-amber-50 text-[11px] font-semibold text-[#4D7C0F] inline-flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {lang === 'ar' ? 'تحديد كمقروء' : 'Mark Read'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[38px] min-w-[38px] rounded-xl border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50"
                  aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                >
                  <X className="w-4 h-4 text-[#1F2937]" />
                </button>
              </div>
            </div>

            {/* Browser / Android Push Permission Callout */}
            {notificationPermission !== 'granted' && (
              <div className="px-5 py-3 bg-amber-50/90 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                <div className="text-xs text-[#78350F] max-w-xs">
                  {notificationPermission === 'denied'
                    ? lang === 'ar'
                      ? 'إشعارات المتصفح محظورة حالياً؛ ستظهر التنبيهات المنبثقة داخل المتجر.'
                      : 'Browser alerts blocked; in-app popups remain active.'
                    : lang === 'ar'
                    ? 'فعّل الإشعارات الفورية لتصلك تنبيهات الحصاد الجديد والخصومات حتى خارج المتجر.'
                    : 'Enable device push alerts for instant harvest and discount notices.'}
                </div>
                {notificationPermission !== 'denied' && (
                  <button
                    type="button"
                    onClick={() => void requestPushPermission()}
                    className="min-h-[36px] px-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    {lang === 'ar' ? 'تفعيل الإشعارات' : 'Enable Push'}
                  </button>
                )}
              </div>
            )}

            {/* Notification List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-[#E5DEC9] text-center text-xs text-[#1F2937]/60">
                  {lang === 'ar' ? 'لا توجد إشعارات حالياً.' : 'No notifications yet.'}
                </div>
              ) : (
                notifications.map((item) => {
                  const meta = getCategoryMeta(item.category, lang);
                  const CatIcon = meta.Icon;
                  const unread = !item.read;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleOpenNotification(item)}
                      className={`w-full text-start p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                        unread
                          ? 'bg-white border-[#D97706]/60 shadow-sm hover:border-[#D97706]'
                          : 'bg-white/75 border-[#E5DEC9] hover:border-[#D97706]/40'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.color}`}
                      >
                        <CatIcon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-[#4D7C0F]">{meta.label}</span>
                          <div className="flex items-center gap-1.5">
                            {unread && <span className="w-2 h-2 rounded-full bg-[#DC2626]" />}
                            <span className="text-[11px] text-[#1F2937]/50 tabular-nums">
                              {item.sentAt.slice(0, 10)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-[#1F2937]">{t(item.title)}</div>
                        <p className="text-xs text-[#1F2937]/70 leading-relaxed">{t(item.body)}</p>
                      </div>

                      {lang === 'ar' ? (
                        <ChevronLeft className="w-4 h-4 text-[#1F2937]/35 shrink-0 self-center" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#1F2937]/35 shrink-0 self-center" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PushNotificationPopup: React.FC = () => {
  const {
    lang,
    t,
    activePushPopup,
    dismissPushPopup,
    markNotificationRead,
    products,
    setSelectedProduct,
    setView,
    setProfileTab,
  } = useStore();

  if (!activePushPopup) return null;

  const meta = getCategoryMeta(activePushPopup.category, lang);
  const CatIcon = meta.Icon;

  const handleAction = () => {
    markNotificationRead(activePushPopup.id);
    dismissPushPopup();
    if (activePushPopup.productId) {
      const targetProd = products.find((p) => p.id === activePushPopup.productId);
      if (targetProd) {
        setSelectedProduct(targetProd);
        return;
      }
    }
    if (activePushPopup.targetView === 'offers') {
      setView('offers');
      return;
    }
    if (activePushPopup.targetView === 'profile') {
      setView('profile');
      setProfileTab('loyalty');
      return;
    }
    setView('home');
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-16 sm:top-20 end-4 z-[60] w-[calc(100vw-2rem)] max-w-sm rounded-2xl bg-[#1F2937] text-white border border-amber-400/35 shadow-2xl p-4 space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
          <CatIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-amber-300">{meta.label}</div>
          <div className="text-sm font-bold leading-snug">{t(activePushPopup.title)}</div>
          <p className="text-xs text-amber-50/80 mt-0.5 leading-relaxed line-clamp-2">
            {t(activePushPopup.body)}
          </p>
        </div>
        <button
          type="button"
          onClick={dismissPushPopup}
          aria-label={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss alert'}
          className="p-1 text-white/60 hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
        <button
          type="button"
          onClick={dismissPushPopup}
          className="min-h-[34px] px-3 rounded-xl text-xs text-white/75 hover:text-white"
        >
          {lang === 'ar' ? 'لاحقاً' : 'Dismiss'}
        </button>
        <button
          type="button"
          onClick={handleAction}
          className="min-h-[34px] px-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-colors"
        >
          {lang === 'ar' ? 'عرض الآن' : 'View Now'}
        </button>
      </div>
    </div>
  );
};

export const PushPreferencesCard: React.FC = () => {
  const {
    lang,
    pushPreferences,
    updatePushPreferences,
    notificationPermission,
    requestPushPermission,
    sendPushNotification,
  } = useStore();

  const handleTestPush = () => {
    sendPushNotification(
      {
        ar: 'تنبيه جديد: توفر عسل الضبايه الجامد + خصم ١٥٪',
        en: 'New Alert: Al-Dhabayah Solid Honey + 15% Off',
      },
      {
        ar: 'استكشف قطفة عسل الضبايه الجامد الجديدة واستخدم كود HONEY15 للخصم الموسمي.',
        en: 'Explore our fresh Al-Dhabayah harvest and apply promo code HONEY15.',
      },
      'all',
      {
        category: 'new_honey',
        productId: 'prod-dhabayah-solid',
      }
    );
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1F2937]">
              {lang === 'ar' ? 'الإشعارات المنبثقة (Push Notifications)' : 'Push Notifications'}
            </h3>
            <p className="text-xs text-[#1F2937]/65 mt-0.5 leading-relaxed">
              {lang === 'ar'
                ? 'استلم تنبيهات فورية عند توفر أعسال جديدة أو إطلاق الخصومات الموسمية.'
                : 'Receive instant alerts when new honey harvests arrive or seasonal deals drop.'}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Toggles */}
      <div className="space-y-2 text-xs">
        <label className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FFFBEB]/70 border border-[#E5DEC9] cursor-pointer">
          <span className="font-semibold text-[#1F2937]">
            {lang === 'ar' ? 'تنبيهات توفر عسل جديد' : 'New Honey Harvest Alerts'}
          </span>
          <input
            type="checkbox"
            checked={pushPreferences.newHoney}
            onChange={(e) => updatePushPreferences({ newHoney: e.target.checked })}
            className="w-4 h-4 accent-[#D97706]"
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FFFBEB]/70 border border-[#E5DEC9] cursor-pointer">
          <span className="font-semibold text-[#1F2937]">
            {lang === 'ar' ? 'تنبيهات الخصومات والعروض الموسمية' : 'Seasonal Discounts & Deals'}
          </span>
          <input
            type="checkbox"
            checked={pushPreferences.seasonalDiscounts}
            onChange={(e) => updatePushPreferences({ seasonalDiscounts: e.target.checked })}
            className="w-4 h-4 accent-[#D97706]"
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FFFBEB]/70 border border-[#E5DEC9] cursor-pointer">
          <span className="font-semibold text-[#1F2937]">
            {lang === 'ar' ? 'تنبيهات نقاط الولاء والمكافآت' : 'Loyalty & Reward Updates'}
          </span>
          <input
            type="checkbox"
            checked={pushPreferences.loyaltyAlerts}
            onChange={(e) => updatePushPreferences({ loyaltyAlerts: e.target.checked })}
            className="w-4 h-4 accent-[#D97706]"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void requestPushPermission()}
          className="flex-1 min-h-[40px] px-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>
            {notificationPermission === 'granted'
              ? lang === 'ar'
                ? 'إشعارات الجهاز مفعّلة ✓'
                : 'Device Push Enabled ✓'
              : lang === 'ar'
              ? 'تفعيل إشعارات الجهاز'
              : 'Enable Device Push'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleTestPush}
          className="min-h-[40px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] hover:bg-amber-50 text-xs font-semibold text-[#1F2937] inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{lang === 'ar' ? 'تجربة إشعار' : 'Test Alert'}</span>
        </button>
      </div>
    </div>
  );
};
