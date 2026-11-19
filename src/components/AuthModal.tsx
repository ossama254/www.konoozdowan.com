import React, { useState } from 'react';
import {
  Lock,
  LogOut,
  Phone,
  ShieldCheck,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const {
    lang,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authStatus,
    currentCustomer,
    continueAsGuest,
    loginWithPhone,
    logoutCustomer,
  } = useStore();

  const [nameInput, setNameInput] = useState(currentCustomer?.displayName ?? '');
  const [phoneInput, setPhoneInput] = useState(currentCustomer?.phone ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const res = await loginWithPhone(phoneInput, nameInput);
    setSubmitting(false);
    if (!res.ok && res.message) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'تسجيل الدخول أو الدخول كزائر' : 'Sign In or Continue as Guest'}
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FFFBEB] border border-[#E5DEC9] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#E5DEC9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-center text-[#D97706]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">
                {lang === 'ar' ? 'تسجيل الدخول أو زائر' : 'Customer Sign-In or Guest'}
              </h2>
              <p className="text-[11px] text-[#1F2937]/60">
                {lang === 'ar'
                  ? 'ادخل بالاسم ورقم الهاتف أو تابع كزائر فقط'
                  : 'Sign in with Name & Phone or continue as Guest'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="min-h-[40px] min-w-[40px] rounded-xl border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Active Session Card */}
          {authStatus === 'customer' && currentCustomer && (
            <div className="p-4 rounded-2xl bg-white border-2 border-[#4D7C0F]/40 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-center text-[#D97706] font-bold shrink-0">
                    {currentCustomer.displayName.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#1F2937] truncate">
                      {currentCustomer.displayName}
                    </div>
                    <div dir="ltr" className="text-xs text-[#4D7C0F] font-semibold tabular-nums">
                      {currentCustomer.phone}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void logoutCustomer()}
                  className="min-h-[36px] px-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'خروج' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Privacy Guarantee Notice */}
          <div className="p-3.5 rounded-2xl bg-lime-50/70 border border-[#4D7C0F]/30 flex items-start gap-2.5 text-xs text-[#1F2937]">
            <Lock className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {lang === 'ar'
                ? 'رقم هاتفك محفوظ بسرية ويظهر لإدارة المتجر فقط دون بقية العملاء. اسمك فقط هو ما يظهر في تقييمات المنتجات.'
                : 'Privacy protected: your phone number is strictly visible to Store Admin only—never to other customers. Only your name appears on product reviews.'}
            </p>
          </div>

          {/* 1. Sign in with Name & Phone Number */}
          <form
            onSubmit={handlePhoneSubmit}
            className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#1F2937]">
              <Phone className="w-4 h-4 text-[#D97706]" />
              <span>
                {lang === 'ar' ? 'تسجيل الدخول بالاسم ورقم الهاتف' : 'Sign In with Name & Phone'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <span className="font-semibold text-[#1F2937]/80">
                  {lang === 'ar' ? 'الاسم الكامل * (يظهر في التقييمات)' : 'Full Name * (shown in reviews)'}
                </span>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohammed'}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </label>

              <label className="block space-y-1">
                <span className="font-semibold text-[#1F2937]/80">
                  {lang === 'ar' ? 'رقم الهاتف * (سري للإدارة فقط)' : 'Phone Number * (Admin only)'}
                </span>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+967 777xxxxxx"
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </label>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[44px] rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {submitting
                  ? lang === 'ar'
                    ? 'جاري تسجيل الدخول...'
                    : 'Signing in...'
                  : lang === 'ar'
                  ? 'تسجيل الدخول الآن'
                  : 'Sign In'}
              </span>
            </button>
          </form>

          {/* 2. Continue as Guest Only */}
          <button
            type="button"
            onClick={() => void continueAsGuest()}
            className="w-full p-4 rounded-2xl bg-white border border-[#E5DEC9] hover:border-[#D97706] flex items-center justify-between gap-3 text-start transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-center text-[#D97706] shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1F2937]">
                  {lang === 'ar' ? 'الدخول كزائر فقط' : 'Continue as Guest Only'}
                </div>
                <div className="text-xs text-[#1F2937]/65">
                  {lang === 'ar'
                    ? 'تصفح المتجر وأضف للسلة وأتمم طلبك بدون تسجيل'
                    : 'Browse, add to cart, and checkout without signing in'}
                </div>
              </div>
            </div>
            {authStatus === 'guest' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#FFFBEB] border border-[#E5DEC9] text-[11px] font-bold text-[#D97706] shrink-0">
                {lang === 'ar' ? 'الحالي' : 'Active'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
