import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Flame,
  Percent,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

export const OffersView: React.FC = () => {
  const {
    lang,
    t,
    products,
    offers,
    promoCodes,
    appliedPromo,
    applyPromoCode,
    claimOffer,
    addToCart,
    setSelectedProduct,
    setIsCartOpen,
    setView,
    formatPrice,
    showToast,
  } = useStore();

  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeOffers = useMemo(() => offers.filter((o) => o.active), [offers]);
  const activePromos = useMemo(() => promoCodes.filter((p) => p.active), [promoCodes]);

  // All products that currently have at least one weight option on discount
  const discountedProducts = useMemo(
    () =>
      products.filter((p) =>
        p.weightOptions.some((w) => w.compareAtPrice && w.compareAtPrice > w.price)
      ),
    [products]
  );

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 1800);
    const res = applyPromoCode(code);
    showToast(t(res.message));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Offers Header */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DEC9] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#D97706] inline-flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            <span>{lang === 'ar' ? 'العروض الموسمية والخصومات المباشرة' : 'Seasonal Harvest Deals'}</span>
          </div>
          <h1 className="font-display-serif text-2xl sm:text-3xl font-bold text-[#1F2937] text-balance">
            {lang === 'ar'
              ? 'عروض كنوز دوعن الحصرية لهذا الموسم'
              : 'Exclusive Kunooz Doan Seasonal Offers'}
          </h1>
          <p className="text-xs sm:text-sm text-[#1F2937]/70 leading-relaxed">
            {lang === 'ar'
              ? 'استفد من باقات التوفير المباشرة، التخفيضات على الأوزان العائلية، وأكواد الخصم النشطة على العسل البلدي والزبيب واللوز.'
              : 'Save on family-size jars, limited first-harvest offers, and instant promo codes across authentic mountain honey, raisins, and almonds.'}
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#E5DEC9]">
          <div>
            <div className="text-xs text-[#1F2937]/60">
              {lang === 'ar' ? 'عروض خاصة' : 'Special Deals'}
            </div>
            <div className="text-2xl font-bold text-[#D97706] tabular-nums">{activeOffers.length}</div>
          </div>
          <div className="h-10 w-px bg-[#E5DEC9]" />
          <div>
            <div className="text-xs text-[#1F2937]/60">
              {lang === 'ar' ? 'منتجات مخفضة' : 'On Sale'}
            </div>
            <div className="text-2xl font-bold text-[#4D7C0F] tabular-nums">
              {discountedProducts.length}
            </div>
          </div>
          <div className="h-10 w-px bg-[#E5DEC9]" />
          <div>
            <div className="text-xs text-[#1F2937]/60">
              {lang === 'ar' ? 'كوبونات فعالة' : 'Active Codes'}
            </div>
            <div className="text-2xl font-bold text-[#1F2937] tabular-nums">{activePromos.length}</div>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Seasonal Bundles & Special Offers */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937]">
              {lang === 'ar' ? 'عروض التوفير الحصرية' : 'Featured Harvest Deals'}
            </h2>
            <p className="text-xs text-[#1F2937]/65">
              {lang === 'ar'
                ? 'اطلب العرض مباشرة ليُضاف إلى سلتك بالسعر المخفض فوراً'
                : 'Add any featured offer directly to your bag at the discounted deal price'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView('home')}
            className="text-xs font-semibold text-[#D97706] hover:underline"
          >
            {lang === 'ar' ? 'تصفح كامل المتجر' : 'Browse Full Catalog'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeOffers.map((offer) => {
            const product = products.find((p) => p.id === offer.productId);
            if (!product) return null;
            const savings = Math.max(0, offer.originalPrice - offer.offerPrice);
            const pct = Math.round((savings / offer.originalPrice) * 100);

            return (
              <article
                key={offer.id}
                className="rounded-3xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all"
              >
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="sm:w-48 aspect-[4/3] sm:aspect-auto bg-amber-50/40 relative cursor-pointer shrink-0 overflow-hidden"
                >
                  <ProductImage
                    src={product.images[0]}
                    alt={t(offer.title)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-[#4D7C0F] tabular-nums">
                      {t(offer.badgeText)} · {pct}% {lang === 'ar' ? 'خصم' : 'OFF'}
                    </div>
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="text-base font-bold text-[#1F2937] cursor-pointer hover:text-[#D97706] transition-colors"
                    >
                      {t(offer.title)}
                    </h3>
                    <p className="text-xs text-[#1F2937]/70 leading-relaxed line-clamp-2">
                      {t(offer.subtitle)}
                    </p>
                    <div className="text-[11px] text-[#1F2937]/60 pt-0.5">
                      {t(product.origin)} · {t(offer.endsAtLabel)}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5DEC9]/70 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#D97706] tabular-nums">
                          {formatPrice(offer.offerPrice)}
                        </span>
                        <span className="text-xs text-[#1F2937]/45 line-through tabular-nums">
                          {formatPrice(offer.originalPrice)}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-[#4D7C0F] tabular-nums">
                        {lang === 'ar'
                          ? `توفير ${formatPrice(savings)}`
                          : `Save ${formatPrice(savings)}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => claimOffer(offer)}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'اطلب العرض الآن' : 'Claim Deal'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Section 2: Active Discount Coupons */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#D97706]" />
            <span>{lang === 'ar' ? 'كوبونات وأكواد الخصم النشطة' : 'Active Promo Codes & Coupons'}</span>
          </h2>
          <p className="text-xs text-[#1F2937]/65">
            {lang === 'ar'
              ? 'اضغط لتفعيل الكود مباشرة في سلة التسوق أو نسخه للاستخدام عند إتمام الطلب'
              : 'Tap to copy and apply any active discount code directly to your shopping bag'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePromos.map((promo) => {
            const isApplied = appliedPromo?.code === promo.code;
            const isCopied = copiedCode === promo.code;
            return (
              <div
                key={promo.code}
                className={`p-4 rounded-2xl border bg-white flex flex-col justify-between gap-3 transition-colors ${
                  isApplied ? 'border-[#4D7C0F] bg-lime-50/40' : 'border-[#E5DEC9]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-code text-base font-bold text-[#D97706] tracking-wide">
                      {promo.code}
                    </span>
                    <span className="text-xs font-bold text-[#4D7C0F] inline-flex items-center gap-1 tabular-nums">
                      <Percent className="w-3.5 h-3.5" />
                      {promo.type === 'percent' ? `${promo.value}%` : formatPrice(promo.value)}
                    </span>
                  </div>
                  <p className="text-xs text-[#1F2937]/75">{t(promo.description)}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyAndApply(promo.code)}
                    className={`flex-1 min-h-[38px] px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                      isApplied
                        ? 'bg-[#4D7C0F] text-white'
                        : 'bg-[#FFFBEB] border border-[#E5DEC9] hover:border-[#D97706] text-[#1F2937]'
                    }`}
                  >
                    {isApplied || isCopied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                    )}
                    <span>
                      {isApplied
                        ? lang === 'ar'
                          ? 'مفعّل في السلة'
                          : 'Applied to Bag'
                        : lang === 'ar'
                        ? 'نسخ وتفعيل الكود'
                        : 'Copy & Apply'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="min-h-[38px] px-3 rounded-xl border border-[#E5DEC9] bg-white hover:bg-amber-50 text-xs font-semibold text-[#1F2937]"
                  >
                    {lang === 'ar' ? 'السلة' : 'Bag'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: All Discounted Products & Family Packs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D97706]" />
              <span>
                {lang === 'ar' ? 'المنتجات والأوزان المخفضة' : 'All Discounted Products & Weights'}
              </span>
            </h2>
            <p className="text-xs text-[#1F2937]/65">
              {lang === 'ar'
                ? 'جميع العبوات التي تشمل خصماً مباشراً عن السعر الأساسي'
                : 'Products featuring direct savings compared to standard jar prices'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {discountedProducts.map((product) => {
            const discountedOpts = product.weightOptions.filter(
              (w) => w.compareAtPrice && w.compareAtPrice > w.price
            );
            const defaultOpt = discountedOpts[0] ?? product.weightOptions[0];
            const chosenId = selectedWeights[product.id] ?? defaultOpt.id;
            const activeOpt =
              product.weightOptions.find((w) => w.id === chosenId) ?? defaultOpt;
            const savings =
              activeOpt.compareAtPrice && activeOpt.compareAtPrice > activeOpt.price
                ? activeOpt.compareAtPrice - activeOpt.price
                : 0;
            const discountPct =
              savings > 0 && activeOpt.compareAtPrice
                ? Math.round((savings / activeOpt.compareAtPrice) * 100)
                : 0;
            const outOfStock = activeOpt.stock <= 0;

            return (
              <article
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-[4/3] relative bg-amber-50/40 overflow-hidden">
                  <ProductImage
                    src={product.images[0]}
                    alt={t(product.name)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#DC2626] tabular-nums">
                        {discountPct > 0
                          ? lang === 'ar'
                            ? `خصم ${discountPct}% · وفر ${formatPrice(savings)}`
                            : `${discountPct}% OFF · Save ${formatPrice(savings)}`
                          : t(product.subCategory)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#1F2937] tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1F2937] line-clamp-1">
                      {t(product.name)}
                    </h3>
                    <div className="text-[11px] text-[#1F2937]/65 truncate">
                      {t(product.origin)} · {t(product.harvestSeason)}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#E5DEC9]/70">
                    <select
                      value={activeOpt.id}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setSelectedWeights((prev) => ({
                          ...prev,
                          [product.id]: e.target.value,
                        }))
                      }
                      aria-label={lang === 'ar' ? 'اختر الوزن المخفض' : 'Select weight'}
                      className="w-full min-h-[38px] px-3 py-1 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                    >
                      {discountedOpts.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {t(opt.label)} — {formatPrice(opt.price)}{' '}
                          {opt.compareAtPrice
                            ? `(${lang === 'ar' ? 'بدلاً من' : 'was'} ${formatPrice(opt.compareAtPrice)})`
                            : ''}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#D97706] tabular-nums">
                          {formatPrice(activeOpt.price)}
                        </span>
                        {activeOpt.compareAtPrice && (
                          <span className="text-xs text-[#1F2937]/45 line-through tabular-nums">
                            {formatPrice(activeOpt.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, activeOpt.id, 1);
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
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
