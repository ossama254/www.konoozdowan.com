import React, { useState } from 'react';
import { Gift, Globe, Minus, Plus, ShoppingBag, Sparkles, Tag, Trash2, Truck, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { InternationalCountryId } from '../types/store';
import { ProductImage } from './ProductImage';

export const CartDrawer: React.FC = () => {
  const {
    lang,
    t,
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    redeemedVouchers,
    appliedVoucher,
    applyVoucher,
    subtotal,
    discountAmount,
    shippingScope,
    setShippingScope,
    domesticZones,
    domesticZone,
    setDomesticZone,
    internationalCountries,
    internationalCountry,
    setInternationalCountry,
    customCountryName,
    shippingFee,
    total,
    estimatedPointsEarned,
    freeShippingThreshold,
    formatPrice,
    setView,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress =
    freeShippingThreshold <= 0 ? 100 : Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const unusedVouchers = redeemedVouchers.filter((v) => !v.used);
  const activeDomesticZone =
    domesticZones.find((z) => z.id === domesticZone) ?? domesticZones[0];
  const activeCountry =
    internationalCountries.find((c) => c.id === internationalCountry) ?? internationalCountries[0];
  const resolvedCountryLabel =
    internationalCountry === 'other' && customCountryName.trim()
      ? customCountryName.trim()
      : activeCountry
      ? t(activeCountry.name)
      : '';

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback({ ok: res.ok, text: t(res.message) });
    if (res.ok) setPromoInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FFFBEB] h-full flex flex-col border-s border-[#E5DEC9] shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E5DEC9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar' ? 'سلة التسوق' : 'Shopping Bag'}
            </h2>
            <span className="text-xs text-[#1F2937]/60 tabular-nums">
              ({cart.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50 transition-colors"
            aria-label={lang === 'ar' ? 'إغلاق السلة' : 'Close cart'}
          >
            <X className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>

        {/* Shipping Mode & Free Shipping Bar */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-amber-50/70 border-b border-[#E5DEC9] space-y-2.5">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white border border-[#E5DEC9]">
              <button
                type="button"
                onClick={() => setShippingScope('domestic')}
                className={`min-h-[34px] px-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  shippingScope === 'domestic'
                    ? 'bg-[#D97706] text-white'
                    : 'text-[#1F2937]/75 hover:bg-amber-50'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'شحن محلي' : 'Domestic'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShippingScope('international')}
                className={`min-h-[34px] px-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  shippingScope === 'international'
                    ? 'bg-[#D97706] text-white'
                    : 'text-[#1F2937]/75 hover:bg-amber-50'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'شحن دولي' : 'International'}</span>
              </button>
            </div>

            {shippingScope === 'domestic' ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {domesticZones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setDomesticZone(zone.id)}
                      className={`min-h-[34px] px-2.5 rounded-lg border font-semibold flex items-center justify-between gap-1 transition-colors ${
                        domesticZone === zone.id
                          ? 'border-[#D97706] bg-white text-[#1F2937] shadow-sm'
                          : 'border-[#E5DEC9] bg-white/50 text-[#1F2937]/70 hover:bg-white'
                      }`}
                    >
                      <span className="truncate">{t(zone.name)}</span>
                      <span className="text-[#D97706] tabular-nums shrink-0">
                        {formatPrice(zone.fee)}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-[#1F2937]">
                    <span>
                      {remainingForFreeShipping === 0
                        ? lang === 'ar'
                          ? 'تم تفعيل التوصيل المجاني لطلبك'
                          : 'Free Express Shipping unlocked'
                        : lang === 'ar'
                        ? `أضف ${formatPrice(remainingForFreeShipping)} للتوصيل المجاني`
                        : `Add ${formatPrice(remainingForFreeShipping)} for free delivery`}
                    </span>
                    <span className="tabular-nums text-[#4D7C0F] font-semibold">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E5DEC9] overflow-hidden">
                    <div
                      className="h-full bg-[#4D7C0F] transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 text-xs">
                <label className="font-semibold text-[#1F2937] shrink-0" htmlFor="cart-intl-country">
                  {lang === 'ar' ? 'الدولة:' : 'Country:'}
                </label>
                <select
                  id="cart-intl-country"
                  value={internationalCountry}
                  onChange={(e) => setInternationalCountry(e.target.value as InternationalCountryId)}
                  className="flex-1 min-h-[34px] px-2.5 rounded-lg border border-[#E5DEC9] bg-white text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                >
                  {internationalCountries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {t(country.name)} — {formatPrice(country.shippingFee)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#D97706]/50" />
              <p className="text-base font-semibold text-[#1F2937]">
                {lang === 'ar' ? 'سلة التسوق فارغة حالياً' : 'Your shopping bag is empty'}
              </p>
              <p className="text-xs text-[#1F2937]/65 max-w-xs">
                {lang === 'ar'
                  ? 'استكشف تشكيلة العسل الجبلي والزبيب الفاخر واللوز العضوي.'
                  : 'Browse our mountain honey, sun-dried raisins, and heritage almonds.'}
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#D97706] text-white text-sm font-semibold"
              >
                {lang === 'ar' ? 'تصفح المنتجات' : 'Browse Harvest'}
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.cartKey}
                  className="p-3.5 rounded-2xl bg-white border border-[#E5DEC9] flex gap-3.5 items-center"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-50 shrink-0">
                    <ProductImage
                      src={item.image}
                      alt={t(item.name)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#1F2937] truncate">
                        {t(item.name)}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartKey)}
                        className="text-[#1F2937]/45 hover:text-red-600 p-1"
                        aria-label={lang === 'ar' ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#1F2937]/65">{t(item.weightLabel)}</p>

                    <div className="flex items-center justify-between pt-1">
                      {item.isRewardItem ? (
                        <span className="text-xs font-bold text-[#4D7C0F] inline-flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5" />
                          {lang === 'ar' ? 'مجاني (مكافأة ولاء)' : 'Free (Loyalty Reward)'}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-[#D97706] tabular-nums">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      )}

                      {!item.isRewardItem && (
                        <div className="flex items-center border border-[#E5DEC9] rounded-lg bg-[#FFFBEB]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartKey, -1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1F2937]"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartKey, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1F2937]"
                            aria-label="Increase"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Input */}
              <form
                onSubmit={handleApplyPromo}
                className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-[#1F2937]">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#D97706]" />
                    {lang === 'ar' ? 'كود الخصم' : 'Promo Code'}
                  </span>
                  <span className="text-[#1F2937]/55">HONEY15 · BUSTAN10</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={lang === 'ar' ? 'أدخل الكود...' : 'Enter code...'}
                    className="flex-1 min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm uppercase focus:outline-none focus:border-[#D97706]"
                  />
                  <button
                    type="submit"
                    className="min-h-[42px] px-4 rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    {lang === 'ar' ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-[#4D7C0F] font-medium pt-1">
                    <span>
                      {appliedPromo.code} — {t(appliedPromo.description)}
                    </span>
                    <button type="button" onClick={removePromoCode} className="underline text-red-600">
                      {lang === 'ar' ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                )}
                {promoFeedback && (
                  <p
                    className={`text-xs ${
                      promoFeedback.ok ? 'text-[#4D7C0F]' : 'text-red-600'
                    }`}
                  >
                    {promoFeedback.text}
                  </p>
                )}
              </form>

              {/* Redeemed Loyalty Vouchers */}
              {unusedVouchers.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-2">
                  <div className="text-xs font-semibold text-[#1F2937] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{lang === 'ar' ? 'قسائم الولاء المتاحة' : 'Your Loyalty Vouchers'}</span>
                  </div>
                  <div className="space-y-2">
                    {unusedVouchers.map((v) => {
                      const active = appliedVoucher?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => applyVoucher(active ? null : v)}
                          className={`w-full text-start p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                            active
                              ? 'border-[#4D7C0F] bg-lime-50/70 text-[#1F2937]'
                              : 'border-[#E5DEC9] bg-[#FFFBEB] text-[#1F2937]/80'
                          }`}
                        >
                          <span className="font-semibold">{t(v.title)}</span>
                          <span className="text-[#4D7C0F] font-bold">
                            {active
                              ? lang === 'ar'
                                ? 'مفعلة'
                                : 'Applied'
                              : lang === 'ar'
                              ? 'تفعيل'
                              : 'Use'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Totals */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E5DEC9] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#1F2937]/75">
                <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="tabular-nums font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#4D7C0F]">
                  <span>{lang === 'ar' ? 'الخصم' : 'Discount'}</span>
                  <span className="tabular-nums font-semibold">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#1F2937]/75">
                <span>
                  {shippingScope === 'international'
                    ? lang === 'ar'
                      ? `الشحن الدولي (${resolvedCountryLabel})`
                      : `International (${resolvedCountryLabel})`
                    : lang === 'ar'
                    ? `رسوم التوصيل (${activeDomesticZone ? t(activeDomesticZone.name) : 'محلي'})`
                    : `Delivery (${activeDomesticZone ? t(activeDomesticZone.name) : 'Local'})`}
                </span>
                <span className="tabular-nums font-medium">
                  {shippingFee === 0
                    ? lang === 'ar'
                      ? 'مجاني'
                      : 'Free'
                    : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1F2937] pt-2 border-t border-[#E5DEC9]">
                <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="text-xs text-[#4D7C0F] flex items-center gap-1 pt-0.5 tabular-nums">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>
                  {lang === 'ar'
                    ? `ستربح +${estimatedPointsEarned} نقطة ولاء عند إتمام الطلب`
                    : `You will earn +${estimatedPointsEarned} loyalty points`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                setView('checkout');
              }}
              className="w-full min-h-[48px] rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm transition-colors"
            >
              {lang === 'ar' ? 'متابعة لإتمام الطلب' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
