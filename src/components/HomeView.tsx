import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryId, Product } from '../types/store';
import { ProductImage } from './ProductImage';

export const HomeView: React.FC = () => {
  const {
    lang,
    t,
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    offers,
    claimOffer,
    loyaltyPoints,
    freeShippingThreshold,
    formatPrice,
    setView,
    setIsOnboardingOpen,
    heroBanners,
    homeSettings,
  } = useStore();

  const categoryTabs: { id: CategoryId; label: { ar: string; en: string } }[] = useMemo(
    () => [{ id: 'all', label: { ar: 'الكل', en: 'All' } }, ...categories],
    [categories]
  );

  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedCardWeights, setSelectedCardWeights] = useState<Record<string, string>>({});
  const [isTopSearchFocused, setIsTopSearchFocused] = useState(false);

  const activeBanners = useMemo(
    () => heroBanners.filter((b) => b.active),
    [heroBanners]
  );
  const safeBannerIndex =
    activeBanners.length > 0 ? bannerIndex % activeBanners.length : 0;
  const activeBanner = activeBanners[safeBannerIndex];

  const categoryLabelMap = useMemo(() => {
    const map: Record<string, { ar: string; en: string }> = {};
    categories.forEach((c) => {
      map[c.id] = c.label;
    });
    return map;
  }, [categories]);

  const matchesSearchQuery = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (p: Product) => {
      if (!q) return true;
      const catLabel = categoryLabelMap[p.category];
      return (
        p.name.ar.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.subCategory.ar.toLowerCase().includes(q) ||
        p.subCategory.en.toLowerCase().includes(q) ||
        p.origin.ar.toLowerCase().includes(q) ||
        p.origin.en.toLowerCase().includes(q) ||
        p.shortDescription.ar.toLowerCase().includes(q) ||
        p.shortDescription.en.toLowerCase().includes(q) ||
        p.purityBadge.ar.toLowerCase().includes(q) ||
        p.purityBadge.en.toLowerCase().includes(q) ||
        (catLabel ? catLabel.ar.toLowerCase().includes(q) || catLabel.en.toLowerCase().includes(q) : false)
      );
    };
  }, [categoryLabelMap, searchQuery]);

  const topSearchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(matchesSearchQuery);
  }, [matchesSearchQuery, products, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catMatch = selectedCategory === 'all' || p.category === selectedCategory;
      if (!catMatch) return false;
      return matchesSearchQuery(p);
    });
  }, [products, selectedCategory, matchesSearchQuery]);

  const scrollToCatalog = () => {
    setIsTopSearchFocused(false);
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product, weightId?: string) => {
    e.stopPropagation();
    const chosen =
      product.weightOptions.find((w) => w.id === weightId && w.stock > 0) ??
      product.weightOptions.find((w) => w.stock > 0) ??
      product.weightOptions[0];
    if (chosen) {
      addToCart(product, chosen.id, 1);
    }
  };

  const quickSearchTerms =
    homeSettings.quickSearchTerms[lang]?.length > 0
      ? homeSettings.quickSearchTerms[lang]
      : lang === 'ar'
      ? ['سدر', 'دوعن', 'الضبايه', 'سمر', 'زبيب', 'حضرموت']
      : ['Sidr', 'Doan', 'Dhabayah', 'Sumra', 'Raisins', 'Hadhramaut'];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Search Bar */}
      {homeSettings.showSearchBar && (
        <section aria-label={lang === 'ar' ? 'البحث السريع في المتجر' : 'Quick Store Search'} className="relative z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                setSelectedCategory('all');
              }
              scrollToCatalog();
            }}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E5DEC9] shadow-sm space-y-2.5"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#D97706] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onFocus={() => setIsTopSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsTopSearchFocused(true);
                  }}
                  placeholder={t(homeSettings.searchPlaceholder)}
                  aria-label={
                    lang === 'ar'
                      ? 'ابحث عن المنتجات بالاسم أو النوع أو المنطقة'
                      : 'Search products by name, type, or region'
                  }
                className="w-full min-h-[46px] ps-10 pe-10 py-2 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] text-sm text-[#1F2937] placeholder:text-[#1F2937]/50 focus:outline-none focus:border-[#D97706] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                  className="absolute top-1/2 -translate-y-1/2 end-2.5 w-7 h-7 rounded-lg flex items-center justify-center text-[#1F2937]/50 hover:text-[#1F2937] hover:bg-amber-100/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="min-h-[46px] px-4 sm:px-6 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'بحث' : 'Search'}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#1F2937]/60 font-medium me-1">
                {lang === 'ar' ? 'بحث سريع:' : 'Quick search:'}
              </span>
              {quickSearchTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    setSelectedCategory('all');
                    setIsTopSearchFocused(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    searchQuery.trim().toLowerCase() === term.toLowerCase()
                      ? 'border-[#D97706] bg-amber-50 text-[#D97706]'
                      : 'border-[#E5DEC9] bg-[#FFFBEB]/60 text-[#1F2937]/75 hover:border-[#D97706]/50'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            {searchQuery.trim() && (
              <button
                type="button"
                onClick={scrollToCatalog}
                className="text-xs font-bold text-[#4D7C0F] hover:underline tabular-nums"
              >
                {lang === 'ar'
                  ? `عرض النتائج (${topSearchMatches.length}) في القائمة ↓`
                  : `View ${topSearchMatches.length} results below ↓`}
              </button>
            )}
          </div>
        </form>

        {/* Live Search Results Dropdown */}
        {isTopSearchFocused && searchQuery.trim() && (
          <div className="mt-2 rounded-2xl bg-white border border-[#E5DEC9] shadow-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[#FFFBEB] border-b border-[#E5DEC9] flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#1F2937] tabular-nums">
                {lang === 'ar'
                  ? `نتائج البحث (${topSearchMatches.length})`
                  : `Search Results (${topSearchMatches.length})`}
              </span>
              <button
                type="button"
                onClick={() => setIsTopSearchFocused(false)}
                className="text-[#1F2937]/60 hover:text-[#1F2937] font-semibold"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>

            {topSearchMatches.length === 0 ? (
              <div className="p-5 text-center space-y-2 text-xs">
                <p className="font-semibold text-[#1F2937]">
                  {lang === 'ar'
                    ? `لم نجد منتجات مطابقة لعبارة "${searchQuery}"`
                    : `No products match "${searchQuery}"`}
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#D97706] font-bold hover:underline"
                >
                  {lang === 'ar' ? 'عرض جميع المنتجات' : 'Reset search'}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#E5DEC9] max-h-80 overflow-y-auto">
                {topSearchMatches.slice(0, 6).map((prod) => {
                  const baseOption = prod.weightOptions[0];
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setIsTopSearchFocused(false);
                        setSelectedProduct(prod);
                      }}
                      className="w-full p-3 hover:bg-amber-50/60 transition-colors text-start flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 border border-[#E5DEC9] shrink-0">
                          <ProductImage
                            src={prod.images[0]}
                            alt={t(prod.name)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#1F2937] truncate">
                            {t(prod.name)}
                          </div>
                          <div className="text-xs text-[#1F2937]/65 flex flex-wrap items-center gap-1.5 truncate">
                            <span className="text-[#4D7C0F] font-semibold">
                              {t(prod.subCategory)}
                            </span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-[#D97706]" />
                              {t(prod.origin)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {baseOption && (
                        <div className="text-end shrink-0 tabular-nums">
                          <div className="text-sm font-bold text-[#D97706]">
                            {formatPrice(baseOption.price)}
                          </div>
                          <div className="text-[11px] text-[#1F2937]/55">
                            {t(baseOption.label)}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        </section>
      )}

      {/* Promotional Hero Slider */}
      {homeSettings.showHeroSlider && activeBanner && (
        <section aria-label={lang === 'ar' ? 'العروض الموسمية' : 'Seasonal Highlights'}>
          <div className="relative rounded-3xl overflow-hidden border border-[#E5DEC9] bg-white shadow-sm">
            <div className="grid lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between gap-6 bg-gradient-to-br from-[#FFFBEB] via-white to-amber-50/60">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#4D7C0F] tracking-wide">
                      {t(activeBanner.kicker)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOnboardingOpen(true)}
                      className="min-h-[36px] inline-flex items-center gap-1.5 text-xs font-medium text-[#1F2937]/75 hover:text-[#D97706] transition-colors whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{t(homeSettings.tourButtonLabel)}</span>
                    </button>
                  </div>

                  <h1 className="font-display-serif text-2xl sm:text-4xl font-bold text-[#1F2937] leading-tight text-balance">
                    {t(activeBanner.title)}
                  </h1>
                  <p className="text-sm sm:text-base text-[#1F2937]/75 leading-relaxed max-w-xl">
                    {t(activeBanner.subtitle)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(activeBanner.targetCategory)}
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    {t(activeBanner.cta)}
                  </button>

                  {activeBanners.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setBannerIndex(
                            (i) => (i - 1 + activeBanners.length) % activeBanners.length
                          )
                        }
                        className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5DEC9] bg-white hover:bg-amber-50 flex items-center justify-center text-[#1F2937] transition-colors"
                        aria-label={lang === 'ar' ? 'العرض السابق' : 'Previous banner'}
                      >
                        {lang === 'ar' ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronLeft className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-xs font-medium text-[#1F2937]/60 tabular-nums px-1">
                        {safeBannerIndex + 1} / {activeBanners.length}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setBannerIndex((i) => (i + 1) % activeBanners.length)
                        }
                        className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5DEC9] bg-white hover:bg-amber-50 flex items-center justify-center text-[#1F2937] transition-colors"
                        aria-label={lang === 'ar' ? 'العرض التالي' : 'Next banner'}
                      >
                        {lang === 'ar' ? (
                          <ChevronLeft className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[320px] lg:min-h-[380px]">
                <ProductImage
                  src={activeBanner.image}
                  alt={t(activeBanner.title)}
                  className="w-full h-full lg:absolute lg:inset-0 object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Compact Loyalty & Purity Value Strip */}
      {homeSettings.showValueStrip && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-[#E5DEC9] py-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#4D7C0F] shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-[#1F2937] block">
                {t(homeSettings.purityTitle)}
              </span>
              <span className="text-[#1F2937]/65">
                {t(homeSettings.puritySubtitle)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-[#D97706] shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-[#1F2937] block">
                {lang === 'ar'
                  ? `رصيدك الحالي: ${loyaltyPoints} نقطة`
                  : `Your Balance: ${loyaltyPoints} pts`}
              </span>
              <button
                type="button"
                onClick={() => setView('profile')}
                className="text-[#D97706] hover:underline font-medium"
              >
                {t(homeSettings.loyaltyCtaLabel)}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#1F2937] shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-[#1F2937] block">
                {t(homeSettings.shippingTitle)}
              </span>
              <span className="text-[#1F2937]/65 tabular-nums">
                {lang === 'ar'
                  ? `شحن مجاني للطلبات فوق ${formatPrice(freeShippingThreshold)}`
                  : `Free shipping on orders over ${formatPrice(freeShippingThreshold)}`}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Featured Seasonal Offers Strip */}
      {offers.some((o) => o.active) && (
        <section
          aria-label={lang === 'ar' ? 'العروض الخاصة' : 'Special Offers'}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#D97706] inline-flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{t(homeSettings.offersKicker)}</span>
              </div>
              <h2 className="text-lg font-bold text-[#1F2937]">
                {t(homeSettings.offersHeading)}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setView('offers')}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {lang === 'ar'
                ? `عرض جميع العروض (${offers.filter((o) => o.active).length})`
                : `View All Offers (${offers.filter((o) => o.active).length})`}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers
              .filter((o) => o.active)
              .slice(0, 2)
              .map((offer) => {
                const prod = products.find((p) => p.id === offer.productId);
                if (!prod) return null;
                return (
                  <div
                    key={offer.id}
                    className="p-3.5 rounded-2xl bg-[#FFFBEB]/70 border border-[#E5DEC9] flex items-center gap-3.5 justify-between"
                  >
                    <div
                      onClick={() => setSelectedProduct(prod)}
                      className="w-16 h-16 rounded-xl overflow-hidden bg-amber-50 border border-[#E5DEC9] shrink-0 cursor-pointer"
                    >
                      <ProductImage
                        src={prod.images[0]}
                        alt={t(offer.title)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="text-[11px] font-semibold text-[#4D7C0F] truncate">
                        {t(offer.badgeText)}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#1F2937] truncate">
                        {t(offer.title)}
                      </h3>
                      <div className="flex items-baseline gap-2 text-xs tabular-nums">
                        <span className="font-bold text-[#D97706]">
                          {formatPrice(offer.offerPrice)}
                        </span>
                        <span className="text-[#1F2937]/45 line-through">
                          {formatPrice(offer.originalPrice)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => claimOffer(offer)}
                      className="min-h-[38px] px-3 rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                    >
                      {lang === 'ar' ? 'اطلب العرض' : 'Claim'}
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Catalog Controls: Search + Category Tabs */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
              {t(homeSettings.catalogTitle)}
            </h2>
            <p className="text-xs sm:text-sm text-[#1F2937]/65 mt-0.5">
              {t(homeSettings.catalogSubtitle)}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#1F2937]/45 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ar' ? 'ابحث عن عسل سدر، زبيب، لوز...' : 'Search Sidr, raisins, almonds...'
              }
              className="w-full min-h-[44px] ps-10 pe-4 py-2 rounded-xl bg-white border border-[#E5DEC9] text-sm text-[#1F2937] placeholder:text-[#1F2937]/45 focus:outline-none focus:border-[#D97706] transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
          role="tablist"
          aria-label={lang === 'ar' ? 'أقسام المتجر' : 'Store categories'}
        >
          {categoryTabs.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#D97706] text-white shadow-sm'
                    : 'bg-white text-[#1F2937]/80 border border-[#E5DEC9] hover:border-[#D97706]/50 hover:text-[#1F2937]'
                }`}
              >
                {t(cat.label)}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E5DEC9] p-10 text-center space-y-3">
            <p className="text-base font-semibold text-[#1F2937]">
              {lang === 'ar' ? 'لم نجد منتجات مطابقة لبحثك' : 'No matching harvest products found'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#D97706] text-white text-sm font-medium"
            >
              {lang === 'ar' ? 'عرض جميع المنتجات' : 'Show All Products'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const selectedWeightId = selectedCardWeights[product.id] ?? product.weightOptions[0].id;
              const activeOption =
                product.weightOptions.find((w) => w.id === selectedWeightId) ??
                product.weightOptions[0];
              const isWishlisted = wishlist.includes(product.id);
              const outOfStock = activeOption.stock <= 0;

              return (
                <article
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-amber-50/50 overflow-hidden">
                    <ProductImage
                      src={product.images[0]}
                      alt={t(product.name)}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-pressed={isWishlisted}
                      title={
                        isWishlisted
                          ? lang === 'ar'
                            ? 'إزالة من المفضلة'
                            : 'Remove from favorites'
                          : lang === 'ar'
                          ? 'إضافة للمفضلة'
                          : 'Add to favorites'
                      }
                      aria-label={
                        isWishlisted
                          ? lang === 'ar'
                            ? 'إزالة من المفضلة'
                            : 'Remove from wishlist'
                          : lang === 'ar'
                          ? 'إضافة للمفضلة'
                          : 'Add to wishlist'
                      }
                      className={`absolute top-3 end-3 min-h-[44px] min-w-[44px] rounded-full bg-white/95 backdrop-blur-sm border flex items-center justify-center transition-all active:scale-95 shadow-sm ${
                        isWishlisted
                          ? 'border-[#DC2626]/40 text-[#DC2626]'
                          : 'border-[#E5DEC9] text-[#1F2937] hover:text-[#DC2626] hover:border-[#DC2626]/40'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-150 ${
                          isWishlisted ? 'fill-[#DC2626] text-[#DC2626] scale-110' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      {/* Unboxed clean metadata line */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#4D7C0F] font-medium">
                        <span className="truncate">
                          {t(product.subCategory)} · {t(product.purityBadge)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#1F2937] tabular-nums shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                          {product.rating.toFixed(1)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1F2937] leading-snug line-clamp-1">
                        {t(product.name)}
                      </h3>
                      <p className="text-xs text-[#1F2937]/70 line-clamp-2 leading-relaxed">
                        {t(product.shortDescription)}
                      </p>
                      <div className="text-[11px] font-medium text-[#1F2937]/65 truncate pt-0.5 tabular-nums">
                        {t(product.origin)} · {t(product.harvestSeason)}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-[#E5DEC9]/70">
                      <select
                        value={activeOption.id}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setSelectedCardWeights((prev) => ({
                            ...prev,
                            [product.id]: e.target.value,
                          }))
                        }
                        aria-label={lang === 'ar' ? 'اختر الوزن' : 'Select weight'}
                        className="w-full min-h-[38px] px-3 py-1.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                      >
                        {product.weightOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {t(opt.label)} — {formatPrice(opt.price)}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#1F2937] tabular-nums">
                              {formatPrice(activeOption.price)}
                            </span>
                            {activeOption.compareAtPrice && (
                              <span className="text-xs text-[#1F2937]/45 line-through tabular-nums">
                                {formatPrice(activeOption.compareAtPrice)}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#1F2937]/60 tabular-nums">
                            {t(activeOption.label)} · +{activeOption.price}{' '}
                            {lang === 'ar' ? 'نقطة' : 'pts'}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={outOfStock}
                          onClick={(e) => handleQuickAdd(e, product, activeOption.id)}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                        >
                          <ShoppingBag className="w-4 h-4" />
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
        )}
      </section>
    </div>
  );
};
