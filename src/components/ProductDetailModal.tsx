import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    lang,
    t,
    addToCart,
    wishlist,
    toggleWishlist,
    tierMultiplier,
    addProductReview,
    formatPrice,
    authStatus,
    currentCustomer,
    setIsAuthModalOpen,
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedWeightId, setSelectedWeightId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setIsZoomed(false);
      setSelectedWeightId(selectedProduct.weightOptions[0]?.id ?? '');
      setQuantity(1);
      setReviewRating(5);
      setHoverRating(null);
      setReviewError(null);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const activeWeight =
    selectedProduct.weightOptions.find((w) => w.id === selectedWeightId) ??
    selectedProduct.weightOptions[0];
  const isWishlisted = wishlist.includes(selectedProduct.id);
  const pointsPreview = Math.round(activeWeight.price * quantity * tierMultiplier);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError(
        lang === 'ar'
          ? 'يرجى كتابة تعليقك قبل إرسال التقييم'
          : 'Please write your review comment before submitting'
      );
      return;
    }
    setReviewError(null);
    addProductReview(selectedProduct.id, reviewAuthor, reviewRating, reviewComment.trim());
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    setHoverRating(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={t(selectedProduct.name)}
      onClick={() => setSelectedProduct(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#FFFBEB] border border-[#E5DEC9] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col"
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#E5DEC9] bg-white shrink-0">
          <div className="text-xs font-medium text-[#4D7C0F] truncate tabular-nums">
            {t(selectedProduct.subCategory)} · {t(selectedProduct.origin)} · {t(selectedProduct.harvestSeason)} · {selectedProduct.sku}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] rounded-xl border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50 transition-colors"
              aria-label={lang === 'ar' ? 'المفضلة' : 'Wishlist'}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#1F2937]'}`}
              />
            </button>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] rounded-xl border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50 transition-colors"
              aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5 text-[#1F2937]" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-7 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Gallery with Interactive Zoom */}
            <div className="lg:col-span-6 space-y-3">
              <div
                onClick={() => setIsZoomed((z) => !z)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#E5DEC9] cursor-zoom-in"
              >
                <ProductImage
                  src={selectedProduct.images[activeImageIdx] ?? selectedProduct.images[0]}
                  alt={t(selectedProduct.name)}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed((z) => !z);
                  }}
                  className="absolute bottom-3 end-3 min-h-[40px] px-3 rounded-xl bg-black/60 text-white text-xs font-medium inline-flex items-center gap-1.5 backdrop-blur-sm"
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                  <span>
                    {isZoomed
                      ? lang === 'ar'
                        ? 'تصغير'
                        : 'Reset Zoom'
                      : lang === 'ar'
                      ? 'تكبير الصورة'
                      : 'Zoom'}
                  </span>
                </button>
              </div>

              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setIsZoomed(false);
                      }}
                      className={`w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-colors ${
                        activeImageIdx === idx ? 'border-[#D97706]' : 'border-[#E5DEC9] opacity-70'
                      }`}
                    >
                      <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contiguous Purchase Module */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#4D7C0F] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t(selectedProduct.purityBadge)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#1F2937] tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                    {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount})
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#1F2937] leading-snug">
                  {t(selectedProduct.name)}
                </h2>
                <p className="text-sm text-[#1F2937]/75 leading-relaxed">
                  {t(selectedProduct.description)}
                </p>
              </div>

              {/* Dynamic Weight Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1F2937]">
                  <span>{lang === 'ar' ? 'اختر الوزن / الحجم:' : 'Select Weight / Size:'}</span>
                  <span className="text-[#4D7C0F] tabular-nums">
                    {activeWeight.stock > 0
                      ? lang === 'ar'
                        ? `متوفر (${activeWeight.stock} عبوة)`
                        : `In Stock (${activeWeight.stock})`
                      : lang === 'ar'
                      ? 'نفد المخزون'
                      : 'Out of stock'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedProduct.weightOptions.map((opt) => {
                    const selected = opt.id === activeWeight.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedWeightId(opt.id)}
                        className={`min-h-[54px] p-2.5 rounded-xl border text-center transition-all ${
                          selected
                            ? 'border-[#D97706] bg-amber-50 text-[#1F2937] shadow-sm'
                            : 'border-[#E5DEC9] bg-white text-[#1F2937]/80 hover:border-[#D97706]/50'
                        }`}
                      >
                        <div className="text-xs font-bold">{t(opt.label)}</div>
                        <div className="text-xs text-[#D97706] font-semibold tabular-nums mt-0.5">
                          {formatPrice(opt.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price + Quantity + Loyalty Preview */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#1F2937] tabular-nums">
                        {formatPrice(activeWeight.price * quantity)}
                      </span>
                      {activeWeight.compareAtPrice && (
                        <span className="text-sm text-[#1F2937]/45 line-through tabular-nums">
                          {formatPrice(activeWeight.compareAtPrice * quantity)}
                        </span>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-[#4D7C0F] mt-0.5 tabular-nums">
                      <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>
                        {lang === 'ar'
                          ? `ستكسب +${pointsPreview} نقطة ولاء مع هذا الطلب`
                          : `Earn +${pointsPreview} Kunooz Doan Rewards points`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center border border-[#E5DEC9] rounded-xl bg-[#FFFBEB]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#1F2937]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-sm font-bold tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(activeWeight.stock || 1, q + 1))}
                      className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#1F2937]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={activeWeight.stock <= 0}
                  onClick={() => {
                    addToCart(selectedProduct, activeWeight.id, quantity);
                    setSelectedProduct(null);
                  }}
                  className="w-full min-h-[48px] rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:bg-gray-300 text-white font-semibold text-sm transition-colors"
                >
                  {activeWeight.stock <= 0
                    ? lang === 'ar'
                      ? 'غير متوفر حالياً'
                      : 'Currently Out of Stock'
                    : lang === 'ar'
                    ? `أضف إلى السلة · ${formatPrice(activeWeight.price * quantity)}`
                    : `Add to Cart · ${formatPrice(activeWeight.price * quantity)}`}
                </button>
              </div>
            </div>
          </div>

          {/* Origin, Harvest & Lab Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5DEC9]">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1F2937]">
                {lang === 'ar' ? 'المصدر والفوائد الصحية' : 'Origin & Health Benefits'}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#1F2937]/75 tabular-nums">
                <span className="inline-flex items-center gap-1 font-medium text-[#1F2937]">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{lang === 'ar' ? 'المنطقة:' : 'Region:'}</span>
                  <span>{t(selectedProduct.origin)}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#1F2937]">
                  {lang === 'ar' ? 'الموسم:' : 'Harvest:'} {t(selectedProduct.harvestSeason)}
                </span>
              </div>
              <ul className="space-y-2">
                {selectedProduct.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1F2937]/80">
                    <CheckCircle2 className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" />
                    <span>{t(b)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1F2937]">
                {lang === 'ar' ? 'نتائج الفحص المخبري' : 'Laboratory Purity Metrics'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedProduct.labMetrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#E5DEC9] text-center"
                  >
                    <div className="text-base font-bold text-[#4D7C0F] tabular-nums">{m.value}</div>
                    <div className="text-xs text-[#1F2937]/70 mt-0.5">{t(m.label)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews & Interactive Rating Submission */}
          <div className="pt-4 border-t border-[#E5DEC9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#1F2937]">
                  {lang === 'ar'
                    ? `تقييمات ومراجعات العملاء (${selectedProduct.reviewCount})`
                    : `Customer Reviews & Ratings (${selectedProduct.reviewCount})`}
                </h3>
                <p className="text-xs text-[#1F2937]/65">
                  {lang === 'ar'
                    ? 'آراء حقيقية لعملاء كنوز دوعن بعد تجربة المنتج'
                    : 'Verified tasting notes from Kunooz Doan customers'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border border-[#E5DEC9]">
                <span className="text-xl font-bold text-[#1F2937] tabular-nums">
                  {selectedProduct.rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(selectedProduct.rating)
                          ? 'fill-[#D97706] text-[#D97706]'
                          : 'text-[#E5DEC9]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#1F2937]/60 tabular-nums">
                  ({selectedProduct.reviewCount})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProduct.reviews.length === 0 ? (
                <p className="text-sm text-[#1F2937]/60">
                  {lang === 'ar'
                    ? 'كن أول من يقيّم هذا المنتج الطبيعي.'
                    : 'Be the first to review this harvest batch.'}
                </p>
              ) : (
                selectedProduct.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-[#E5DEC9] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-[#1F2937] truncate">
                          {rev.author}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4D7C0F] shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'شراء موثق' : 'Verified'}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#1F2937]/50 tabular-nums shrink-0">
                        {rev.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#D97706]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? 'fill-[#D97706] text-[#D97706]'
                              : 'text-[#E5DEC9]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#1F2937]/80 leading-relaxed">
                      {t(rev.comment)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-bold text-[#1F2937]">
                  {lang === 'ar' ? 'أضف تقييمك ومراجعتك للمنتج' : 'Add Your Rating & Review'}
                </div>

                {/* Clickable Star Rating Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#1F2937]/65">
                    {lang === 'ar' ? 'تقييمك:' : 'Your rating:'}
                  </span>
                  <div
                    className="flex items-center gap-0.5"
                    role="radiogroup"
                    aria-label={lang === 'ar' ? 'اختر عدد النجوم' : 'Select star rating'}
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const activeStar = star <= (hoverRating ?? reviewRating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          aria-label={
                            lang === 'ar' ? `${star} من ٥ نجوم` : `${star} of 5 stars`
                          }
                          aria-pressed={reviewRating === star}
                          className="min-h-[38px] min-w-[34px] flex items-center justify-center rounded-lg hover:bg-amber-50 transition-transform active:scale-95"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              activeStar
                                ? 'fill-[#D97706] text-[#D97706]'
                                : 'text-[#E5DEC9]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-[#D97706] tabular-nums min-w-[36px]">
                    {hoverRating ?? reviewRating} / 5
                  </span>
                </div>
              </div>

              {authStatus === 'customer' && currentCustomer ? (
                <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#1F2937]">
                    {lang === 'ar'
                      ? `سيظهر اسمك فقط في التقييم: ${currentCustomer.displayName}`
                      : `Only your name will appear on this review: ${currentCustomer.displayName}`}
                  </span>
                  <span className="text-[11px] text-[#4D7C0F] font-medium">
                    {lang === 'ar'
                      ? 'رقم الهاتف مخفي تماماً عن العملاء'
                      : 'Phone remains private to Admin'}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#1F2937]/75">
                    {lang === 'ar'
                      ? 'تقيّم الآن كزائر (يمكنك كتابة اسمك الظاهر فقط أو تسجيل الدخول).'
                      : 'Reviewing as Guest (only the display name you enter is shown).'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="font-bold text-[#D97706] hover:underline"
                  >
                    {lang === 'ar' ? 'تسجيل الدخول (الاسم ورقم الهاتف)' : 'Sign In (Name & Phone)'}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {authStatus === 'customer' && currentCustomer ? (
                  <div className="sm:col-span-2 min-h-[42px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-semibold text-[#1F2937] flex items-center">
                    {currentCustomer.displayName}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder={
                      lang === 'ar'
                        ? 'الاسم الظاهر في التقييم (اختياري، أو زائر)'
                        : 'Public display name (optional)'
                    }
                    className="sm:col-span-2 min-h-[42px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                )}
                <button
                  type="submit"
                  className="min-h-[42px] px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors"
                >
                  {lang === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
                </button>
              </div>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => {
                  setReviewComment(e.target.value);
                  if (reviewError) setReviewError(null);
                }}
                placeholder={
                  lang === 'ar'
                    ? 'اكتب تعليقك عن الطعم، الجودة، والتغليف...'
                    : 'Write your review about flavor, purity, and packaging...'
                }
                className="w-full p-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm focus:outline-none focus:border-[#D97706]"
              />
              {reviewError && <p className="text-xs text-red-600 font-semibold">{reviewError}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
