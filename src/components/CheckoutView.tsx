import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Globe,
  Plane,
  Smartphone,
  Sparkles,
  Truck,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LocalWalletProvider, Order, PaymentDetails, PaymentMethod } from '../types/store';
import { GoogleMapsAddressPicker } from './GoogleMapsAddressPicker';

const WALLET_PROVIDERS: {
  id: LocalWalletProvider;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  merchantCode: string;
}[] = [
  {
    id: 'jeeb',
    name: { ar: 'محفظة جيب', en: 'Jeeb Wallet' },
    tagline: { ar: 'دفع فوري برمز الشراء أو التحويل المباشر', en: 'Instant pay via merchant code or transfer' },
    merchantCode: '777600045',
  },
  {
    id: 'jawali',
    name: { ar: 'محفظة جوالي', en: 'Jawali Wallet' },
    tagline: { ar: 'سداد سريع عبر خدمة جوالي للتجار', en: 'Fast settlement via Jawali merchant pay' },
    merchantCode: '777600045',
  },
  {
    id: 'floosak',
    name: { ar: 'محفظة فلوسك', en: 'Floosak Wallet' },
    tagline: { ar: 'تحويل آمن من حساب فلوسك الإلكتروني', en: 'Secure payment from your Floosak account' },
    merchantCode: '777600045',
  },
  {
    id: 'onecash',
    name: { ar: 'ون كاش (ONE Cash)', en: 'ONE Cash Wallet' },
    tagline: { ar: 'دفع إلكتروني مباشر عبر محفظة ون كاش', en: 'Direct mobile checkout via ONE Cash' },
    merchantCode: '777600045',
  },
];

const KURAIMI_ACCOUNT_NUMBER = '3048291502';

export const CheckoutView: React.FC = () => {
  const {
    lang,
    t,
    cart,
    subtotal,
    discountAmount,
    shippingScope,
    setShippingScope,
    domesticZones,
    domesticZone,
    setDomesticZone,
    freeShippingThreshold,
    internationalCountries,
    internationalCountry,
    setInternationalCountry,
    customCountryName,
    setCustomCountryName,
    shippingFee,
    total,
    estimatedPointsEarned,
    placeOrder,
    formatPrice,
    setView,
    setProfileTab,
    authStatus,
    currentCustomer,
    setIsAuthModalOpen,
  } = useStore();

  const [fullName, setFullName] = useState(currentCustomer?.displayName ?? '');
  const [phone, setPhone] = useState(currentCustomer?.phone ?? '');
  const [city, setCity] = useState(lang === 'ar' ? 'صنعاء' : 'Sanaa');
  const [streetAddress, setStreetAddress] = useState(
    lang === 'ar' ? 'شارع حدة، جولة المصباحي، مبنى ١٤' : 'Hadda Street, Bldg 14'
  );
  const [buildingNotes, setBuildingNotes] = useState(
    lang === 'ar' ? 'الدور الثالث، شقة ٩' : '3rd Floor, Apt 9'
  );
  const [postalCode, setPostalCode] = useState('');
  const [coords, setCoords] = useState({ lat: 15.3694, lng: 44.191 });
  const [placeId, setPlaceId] = useState<string | undefined>(undefined);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [walletProvider, setWalletProvider] = useState<LocalWalletProvider>('jeeb');
  const [kuraimiRef, setKuraimiRef] = useState('');
  const [kuraimiSenderPhone, setKuraimiSenderPhone] = useState('');
  const [walletPhone, setWalletPhone] = useState('');
  const [walletRefCode, setWalletRefCode] = useState('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedCountryObj =
    internationalCountries.find((c) => c.id === internationalCountry) ?? internationalCountries[0];
  const resolvedCountryName =
    internationalCountry === 'other' && customCountryName.trim()
      ? { ar: customCountryName.trim(), en: customCountryName.trim() }
      : selectedCountryObj?.name ?? { ar: 'دولة أخرى', en: 'Other' };

  const handleCopyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount((prev) => (prev === key ? null : prev)), 1800);
  };

  const selectedWalletObj =
    WALLET_PROVIDERS.find((w) => w.id === walletProvider) ?? WALLET_PROVIDERS[0];

  const activePaymentLabel =
    paymentMethod === 'cod'
      ? { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery (COD)' }
      : paymentMethod === 'kuraimi'
      ? { ar: 'بنك الكريمي الإسلامي', en: 'Al-Kuraimi Islamic Bank' }
      : selectedWalletObj.name;

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="rounded-3xl bg-white border border-[#E5DEC9] p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <img
            src="/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg"
            alt={lang === 'ar' ? 'شعار كنوز دوعن' : 'Kunooz Doan Logo'}
            className="w-20 h-20 object-contain mx-auto"
          />
          <CheckCircle2 className="w-9 h-9 text-[#4D7C0F] mx-auto" />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#1F2937]">
              {lang === 'ar' ? 'تم تأكيد طلبك بنجاح!' : 'Order Confirmed!'}
            </h1>
            <p className="text-sm text-[#1F2937]/70 tabular-nums">
              {lang === 'ar' ? `رقم الطلب: ${confirmedOrder.id}` : `Order #${confirmedOrder.id}`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-center gap-2 text-sm font-semibold text-[#4D7C0F] tabular-nums">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span>
              {lang === 'ar'
                ? `تمت إضافة +${confirmedOrder.pointsEarned} نقطة إلى رصيد حصاد النقاط`
                : `+${confirmedOrder.pointsEarned} Kunooz Doan Rewards points added to your balance`}
            </span>
          </div>

          <div className="text-start border-t border-[#E5DEC9] pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#1F2937]/65">{lang === 'ar' ? 'العميل' : 'Recipient'}</span>
              <span className="font-semibold">{confirmedOrder.address.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1F2937]/65">{lang === 'ar' ? 'وجهة الشحن' : 'Destination'}</span>
              <span className="font-semibold text-[#1F2937]">
                {confirmedOrder.address.shippingScope === 'international'
                  ? `${lang === 'ar' ? 'شحن دولي' : 'International'} — ${
                      confirmedOrder.address.countryName
                        ? t(confirmedOrder.address.countryName)
                        : ''
                    } (${confirmedOrder.address.city})`
                  : `${lang === 'ar' ? 'توصيل محلي' : 'Domestic'} — ${confirmedOrder.address.city}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1F2937]/65">{lang === 'ar' ? 'العنوان' : 'Address'}</span>
              <span className="font-medium truncate max-w-[260px]">
                {confirmedOrder.address.streetAddress}
                {confirmedOrder.address.postalCode ? ` · ${confirmedOrder.address.postalCode}` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1F2937]/65">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</span>
              <span className="font-semibold text-[#1F2937] tabular-nums">
                {confirmedOrder.paymentDetails
                  ? t(confirmedOrder.paymentDetails.providerLabel)
                  : lang === 'ar'
                  ? 'الدفع عند الاستلام'
                  : 'Cash on Delivery'}
                {confirmedOrder.paymentDetails?.referenceNumber
                  ? ` · ${confirmedOrder.paymentDetails.referenceNumber}`
                  : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1F2937]/65">{lang === 'ar' ? 'الإجمالي المدفوع' : 'Total'}</span>
              <span className="font-bold text-[#D97706] tabular-nums">
                {formatPrice(confirmedOrder.total)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setProfileTab('orders');
                setView('profile');
              }}
              className="flex-1 min-h-[46px] rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors"
            >
              {lang === 'ar' ? 'تتبع حالة الطلب' : 'Track Live Order'}
            </button>
            <button
              type="button"
              onClick={() => setView('home')}
              className="flex-1 min-h-[46px] rounded-xl border border-[#E5DEC9] bg-white hover:bg-amber-50 text-[#1F2937] text-sm font-semibold transition-colors"
            >
              {lang === 'ar' ? 'العودة للمتجر' : 'Return to Store'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-14 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#1F2937]">
          {lang === 'ar' ? 'السلة فارغة' : 'Your bag is empty'}
        </h2>
        <button
          type="button"
          onClick={() => setView('home')}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#D97706] text-white text-sm font-semibold"
        >
          {lang === 'ar' ? 'تصفح المنتجات' : 'Shop Harvest'}
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim() || !streetAddress.trim()) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إكمال بيانات الاسم ورقم الجوال والمدينة والعنوان'
          : 'Please complete recipient name, phone, city, and address'
      );
      return;
    }

    if (
      shippingScope === 'international' &&
      internationalCountry === 'other' &&
      !customCountryName.trim()
    ) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى كتابة اسم الدولة المطلوبة للشحن الدولي'
          : 'Please specify the destination country name for international shipping'
      );
      return;
    }

    if (paymentMethod === 'kuraimi' && !kuraimiRef.trim()) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إدخال رقم الحوالة أو رقم الإشعار البنكي في بنك الكريمي'
          : 'Please enter your Al-Kuraimi Bank transfer reference number'
      );
      return;
    }

    if (paymentMethod === 'wallet' && (!walletPhone.trim() || !walletRefCode.trim())) {
      setErrorMsg(
        lang === 'ar'
          ? `يرجى إدخال رقم محفظة ${selectedWalletObj.name.ar} ورقم العملية أو كود الشراء`
          : `Please enter your ${selectedWalletObj.name.en} phone number and purchase/reference code`
      );
      return;
    }

    setErrorMsg(null);

    const details: PaymentDetails =
      paymentMethod === 'cod'
        ? { providerLabel: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery (COD)' } }
        : paymentMethod === 'kuraimi'
        ? {
            providerLabel: { ar: 'بنك الكريمي الإسلامي', en: 'Al-Kuraimi Islamic Bank' },
            referenceNumber: kuraimiRef.trim(),
            senderPhone: kuraimiSenderPhone.trim() || undefined,
          }
        : {
            providerLabel: selectedWalletObj.name,
            walletProvider,
            senderPhone: walletPhone.trim(),
            referenceNumber: walletRefCode.trim(),
          };

    const created = placeOrder(
      {
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        streetAddress: streetAddress.trim(),
        buildingNotes: buildingNotes.trim(),
        lat: coords.lat,
        lng: coords.lng,
        placeId: shippingScope === 'domestic' ? placeId : undefined,
        shippingScope,
        domesticZone: shippingScope === 'domestic' ? domesticZone : undefined,
        countryCode: shippingScope === 'international' ? internationalCountry : undefined,
        countryName:
          shippingScope === 'international'
            ? resolvedCountryName
            : { ar: 'اليمن', en: 'Yemen' },
        postalCode: shippingScope === 'international' ? postalCode.trim() || undefined : undefined,
      },
      paymentMethod,
      details
    );
    setConfirmedOrder(created);
  };

  const paymentOptions: {
    id: PaymentMethod;
    icon: React.ComponentType<{ className?: string }>;
    title: { ar: string; en: string };
    desc: { ar: string; en: string };
  }[] = [
    {
      id: 'cod',
      icon: Banknote,
      title: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery (COD)' },
      desc: {
        ar: 'ادفع نقداً للمندوب فور استلام طلبك والتأكد منه',
        en: 'Pay cash directly to our courier upon order arrival',
      },
    },
    {
      id: 'kuraimi',
      icon: Building2,
      title: { ar: 'بنك الكريمي الإسلامي (كريمي جوال / إيداع)', en: 'Al-Kuraimi Islamic Bank' },
      desc: {
        ar: 'حساب مميز وتحويل مباشر عبر تطبيق كريمي جوال أو فروع الكريمي',
        en: 'Direct deposit via Kuraimi Express or mobile app',
      },
    },
    {
      id: 'wallet',
      icon: Wallet,
      title: { ar: 'المحافظ الإلكترونية المحلية', en: 'Local Electronic Wallets' },
      desc: {
        ar: 'جيب · جوالي · فلوسك · ون كاش (ONE Cash)',
        en: 'Jeeb · Jawali · Floosak · ONE Cash',
      },
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setView('home')}
          className="min-h-[44px] min-w-[44px] rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center hover:bg-amber-50 transition-colors"
          aria-label={lang === 'ar' ? 'رجوع' : 'Back'}
        >
          {lang === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
            {lang === 'ar' ? 'إتمام الطلب والتوصيل' : 'Checkout & Delivery'}
          </h1>
          <p className="text-xs text-[#1F2937]/65">
            {lang === 'ar'
              ? 'حدد موقعك عبر خرائط Google واختر وسيلة الدفع المناسبة'
              : 'Pin your location via Google Maps and choose your payment method'}
          </p>
        </div>
      </div>

      {/* Checkout Account Mode Banner (Guest or Logged-in Customer) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs">
          <UserCheck
            className={`w-4 h-4 shrink-0 ${
              authStatus === 'customer' ? 'text-[#4D7C0F]' : 'text-[#D97706]'
            }`}
          />
          <div>
            <span className="font-bold text-[#1F2937]">
              {authStatus === 'customer' && currentCustomer
                ? lang === 'ar'
                  ? `طلب باسم الحساب: ${currentCustomer.displayName}`
                  : `Ordering as: ${currentCustomer.displayName}`
                : lang === 'ar'
                ? 'الطلب السريع كزائر فقط (لا يلزم تسجيل دخول)'
                : 'Fast Checkout as Guest (No account required)'}
            </span>
            <p className="text-[11px] text-[#1F2937]/65">
              {lang === 'ar'
                ? 'بيانات المستلم ورقم الهاتف محفوظة للإدارة فقط لتوصيل الطلب.'
                : 'Recipient details and phone remain strictly private to Store Admin for delivery.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="min-h-[36px] px-3.5 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#D97706] shrink-0"
        >
          {authStatus === 'customer'
            ? lang === 'ar'
              ? 'تبديل الحساب'
              : 'Switch Account'
            : lang === 'ar'
            ? 'تسجيل الدخول (الاسم ورقم الهاتف)'
            : 'Sign In (Name & Phone)'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left/Start: Shipping Scope, Country Selector, Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5">
            <h2 className="text-base font-bold text-[#1F2937]">
              {lang === 'ar' ? '١. نوع الشحن ووجهة التوصيل' : '1. Shipping Type & Destination'}
            </h2>

            {/* Domestic vs International Shipping Toggle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setShippingScope('domestic');
                  setErrorMsg(null);
                  if (city === '' || city === 'الرياض') {
                    setCity(lang === 'ar' ? 'صنعاء' : 'Sanaa');
                  }
                }}
                aria-pressed={shippingScope === 'domestic'}
                className={`p-4 rounded-2xl border text-start transition-all flex items-start gap-3 ${
                  shippingScope === 'domestic'
                    ? 'border-[#D97706] bg-amber-50/70 shadow-sm ring-1 ring-[#D97706]/25'
                    : 'border-[#E5DEC9] bg-[#FFFBEB]/40 hover:border-[#D97706]/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    shippingScope === 'domestic'
                      ? 'bg-[#D97706] text-white'
                      : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1F2937]">
                    {lang === 'ar' ? 'توصيل محلي (داخل اليمن)' : 'Domestic Delivery (Yemen)'}
                  </div>
                  <div className="text-xs text-[#1F2937]/65 mt-0.5 tabular-nums">
                    {domesticZones.map((z) => `${t(z.name)} ${formatPrice(z.fee)}`).join(' · ')} ·{' '}
                    {lang === 'ar'
                      ? `مجاني فوق ${formatPrice(freeShippingThreshold)}`
                      : `Free over ${formatPrice(freeShippingThreshold)}`}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShippingScope('international');
                  setErrorMsg(null);
                  if (city === 'صنعاء' || city === 'Sanaa') {
                    setCity('');
                  }
                  if (streetAddress === 'شارع حدة، جولة المصباحي، مبنى ١٤' || streetAddress === 'Hadda Street, Bldg 14') {
                    setStreetAddress('');
                  }
                }}
                aria-pressed={shippingScope === 'international'}
                className={`p-4 rounded-2xl border text-start transition-all flex items-start gap-3 ${
                  shippingScope === 'international'
                    ? 'border-[#D97706] bg-amber-50/70 shadow-sm ring-1 ring-[#D97706]/25'
                    : 'border-[#E5DEC9] bg-[#FFFBEB]/40 hover:border-[#D97706]/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    shippingScope === 'international'
                      ? 'bg-[#D97706] text-white'
                      : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1F2937]">
                    {lang === 'ar' ? 'شحن دولي جوي سريع' : 'International Air Shipping'}
                  </div>
                  <div className="text-xs text-[#1F2937]/65 mt-0.5">
                    {lang === 'ar'
                      ? 'السعودية · عمان · مصر · أمريكا · إندونيسيا · بريطانيا · أخرى'
                      : 'KSA · Oman · Egypt · USA · Indonesia · UK · Other'}
                  </div>
                </div>
              </button>
            </div>

            {/* International Country Picker */}
            {shippingScope === 'international' ? (
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1F2937] inline-flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-[#D97706]" />
                    <span>
                      {lang === 'ar'
                        ? 'اختر دولة الشحن الدولي:'
                        : 'Select International Destination Country:'}
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#4D7C0F]">
                    {selectedCountryObj
                      ? `${t(selectedCountryObj.carrier)} · ${t(selectedCountryObj.estimatedDays)}`
                      : ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {internationalCountries.map((country) => {
                    const active = internationalCountry === country.id;
                    return (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => {
                          setInternationalCountry(country.id);
                          setErrorMsg(null);
                        }}
                        aria-pressed={active}
                        className={`p-3 rounded-xl border text-start transition-all ${
                          active
                            ? 'border-[#D97706] bg-white shadow-sm ring-1 ring-[#D97706]/30'
                            : 'border-[#E5DEC9] bg-white/75 hover:border-[#D97706]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs sm:text-sm font-bold text-[#1F2937] truncate">
                            {t(country.name)}
                          </span>
                          {active && <Check className="w-3.5 h-3.5 text-[#D97706] shrink-0" />}
                        </div>
                        <div className="text-[11px] font-semibold text-[#D97706] tabular-nums mt-1">
                          {formatPrice(country.shippingFee)}
                        </div>
                        <div className="text-[10px] text-[#1F2937]/60 mt-0.5">
                          {t(country.estimatedDays)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {internationalCountry === 'other' && (
                  <label className="block space-y-1 text-xs font-semibold text-[#1F2937] pt-1">
                    <span>
                      {lang === 'ar'
                        ? 'اكتب اسم الدولة المطلوبة للشحن *'
                        : 'Specify Destination Country Name *'}
                    </span>
                    <input
                      type="text"
                      required
                      value={customCountryName}
                      onChange={(e) => setCustomCountryName(e.target.value)}
                      placeholder={
                        lang === 'ar'
                          ? 'مثال: الإمارات العربية المتحدة، قطر، ألمانيا...'
                          : 'e.g. UAE, Qatar, Germany...'
                      }
                      className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#E5DEC9] bg-white text-sm font-normal focus:outline-none focus:border-[#D97706]"
                    />
                  </label>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#1F2937]">
                      {lang === 'ar' ? 'اختر نطاق التوصيل المحلي:' : 'Select Domestic Delivery Zone:'}
                    </span>
                    <span className="font-semibold text-[#4D7C0F] tabular-nums">
                      {subtotal >= freeShippingThreshold
                        ? lang === 'ar'
                          ? 'مؤهل للتوصيل المجاني'
                          : 'Free Delivery Unlocked'
                        : lang === 'ar'
                        ? `مجاني للطلبات فوق ${formatPrice(freeShippingThreshold)}`
                        : `Free over ${formatPrice(freeShippingThreshold)}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {domesticZones.map((zone) => {
                      const active = domesticZone === zone.id;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => {
                            setDomesticZone(zone.id);
                            if (zone.id === 'inside_sanaa' && !city.trim()) {
                              setCity(lang === 'ar' ? 'صنعاء' : 'Sanaa');
                            } else if (
                              zone.id === 'outside_sanaa' &&
                              (city === 'صنعاء' || city === 'Sanaa')
                            ) {
                              setCity('');
                            }
                          }}
                          aria-pressed={active}
                          className={`p-3 rounded-xl border text-start flex items-center justify-between gap-2 transition-all ${
                            active
                              ? 'border-[#D97706] bg-white shadow-sm ring-1 ring-[#D97706]/30'
                              : 'border-[#E5DEC9] bg-white/75 hover:border-[#D97706]/50'
                          }`}
                        >
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-[#1F2937]">
                              {t(zone.name)}
                            </div>
                            <div className="text-[11px] text-[#1F2937]/60">
                              {t(zone.description)}
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#D97706] tabular-nums shrink-0">
                            {subtotal >= freeShippingThreshold
                              ? lang === 'ar'
                                ? 'مجاني'
                                : 'Free'
                              : formatPrice(zone.fee)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <GoogleMapsAddressPicker
                  lang={lang}
                  value={coords}
                  onSelect={(sel) => {
                    setCoords({ lat: sel.lat, lng: sel.lng });
                    if (sel.formattedAddress) setStreetAddress(sel.formattedAddress);
                    if (sel.placeId) setPlaceId(sel.placeId);
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                <span>{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                />
              </label>

              <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                <span>{lang === 'ar' ? 'رقم الجوال (مع رمز الدولة)' : 'Phone Number (with Country Code)'}</span>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                />
              </label>

              <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                <span>
                  {shippingScope === 'international'
                    ? lang === 'ar'
                      ? 'المدينة / الولاية *'
                      : 'City / State *'
                    : lang === 'ar'
                    ? 'المدينة / المحافظة *'
                    : 'City *'}
                </span>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={
                    shippingScope === 'international'
                      ? lang === 'ar'
                        ? 'مثال: الرياض، مسقط، القاهرة، لندن...'
                        : 'e.g. Riyadh, Muscat, Cairo, London...'
                      : undefined
                  }
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                />
              </label>

              {shippingScope === 'international' ? (
                <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                  <span>{lang === 'ar' ? 'الرمز البريدي (Postal / ZIP)' : 'Postal / ZIP Code'}</span>
                  <input
                    type="text"
                    dir="ltr"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="12211"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706] tabular-nums"
                  />
                </label>
              ) : (
                <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                  <span>{lang === 'ar' ? 'تفاصيل المبنى / الشقة' : 'Building / Apartment'}</span>
                  <input
                    type="text"
                    value={buildingNotes}
                    onChange={(e) => setBuildingNotes(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                  />
                </label>
              )}

              <label className="sm:col-span-2 block space-y-1 text-xs font-semibold text-[#1F2937]">
                <span>{lang === 'ar' ? 'العنوان التفصيلي / الشارع *' : 'Street Address *'}</span>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder={
                    shippingScope === 'international'
                      ? lang === 'ar'
                        ? 'اسم الحي، الشارع، رقم المبنى أو الشقة'
                        : 'District, street name, building or apartment number'
                      : undefined
                  }
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                />
              </label>
            </div>
          </div>

          {/* 2. Interactive Payment Method Selector */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#1F2937]">
                {lang === 'ar' ? '٢. اختيار طريقة الدفع' : '2. Select Payment Method'}
              </h2>
              <span className="text-xs font-medium text-[#4D7C0F]">
                {lang === 'ar' ? 'دفع آمن وموثق' : 'Verified Checkout'}
              </span>
            </div>

            <div className="space-y-3">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`rounded-2xl border transition-all ${
                      active
                        ? 'border-[#D97706] bg-amber-50/50'
                        : 'border-[#E5DEC9] bg-[#FFFBEB]/40 hover:border-[#D97706]/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod(opt.id);
                        setErrorMsg(null);
                      }}
                      aria-pressed={active}
                      className="w-full text-start p-4 flex items-center gap-3.5"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          active
                            ? 'bg-[#D97706] text-white'
                            : 'bg-white border border-[#E5DEC9] text-[#1F2937]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#1F2937]">{t(opt.title)}</div>
                        <div className="text-xs text-[#1F2937]/65">{t(opt.desc)}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          active ? 'border-[#D97706] bg-[#D97706]' : 'border-[#E5DEC9] bg-white'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>

                    {/* Al-Kuraimi Bank Sub-panel */}
                    {active && opt.id === 'kuraimi' && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#E5DEC9]/80 space-y-3">
                        <div className="p-3.5 rounded-xl bg-white border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-0.5 text-xs">
                            <div className="text-[#1F2937]/65">
                              {lang === 'ar'
                                ? 'اسم الحساب: كنوز دوعن للعسل الطبيعي'
                                : 'Account Name: Kunooz Doan Honey'}
                            </div>
                            <div className="font-bold text-sm text-[#1F2937] tabular-nums">
                              {lang === 'ar' ? 'رقم الحساب (المميز): ' : 'Kuraimi Account: '}
                              <span dir="ltr" className="text-[#D97706]">
                                {KURAIMI_ACCOUNT_NUMBER}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyValue('kuraimi', KURAIMI_ACCOUNT_NUMBER)}
                            className="min-h-[38px] px-3 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5 transition-colors"
                          >
                            {copiedAccount === 'kuraimi' ? (
                              <Check className="w-3.5 h-3.5 text-[#4D7C0F]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                            )}
                            <span>
                              {copiedAccount === 'kuraimi'
                                ? lang === 'ar'
                                  ? 'تم النسخ'
                                  : 'Copied'
                                : lang === 'ar'
                                ? 'نسخ الحساب'
                                : 'Copy Account'}
                            </span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                            <span>
                              {lang === 'ar'
                                ? 'رقم الإشعار / الحوالة *'
                                : 'Transfer Reference No. *'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={kuraimiRef}
                              onChange={(e) => setKuraimiRef(e.target.value)}
                              placeholder="KRM-902415"
                              className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-sm font-normal focus:outline-none focus:border-[#D97706] tabular-nums"
                            />
                          </label>
                          <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                            <span>
                              {lang === 'ar'
                                ? 'جوال المحوّل (اختياري)'
                                : 'Sender Phone (Optional)'}
                            </span>
                            <input
                              type="tel"
                              dir="ltr"
                              value={kuraimiSenderPhone}
                              onChange={(e) => setKuraimiSenderPhone(e.target.value)}
                              placeholder="77xxxxxxx"
                              className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-sm font-normal focus:outline-none focus:border-[#D97706] tabular-nums"
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Local Electronic Wallets Sub-panel (Jeeb, Jawali, Floosak, One Cash) */}
                    {active && opt.id === 'wallet' && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#E5DEC9]/80 space-y-3.5">
                        <div className="text-xs font-semibold text-[#1F2937]">
                          {lang === 'ar'
                            ? 'اختر المحفظة الإلكترونية المحلية:'
                            : 'Choose Your Local Electronic Wallet:'}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {WALLET_PROVIDERS.map((wallet) => {
                            const selected = walletProvider === wallet.id;
                            return (
                              <button
                                key={wallet.id}
                                type="button"
                                onClick={() => {
                                  setWalletProvider(wallet.id);
                                  setErrorMsg(null);
                                }}
                                aria-pressed={selected}
                                className={`min-h-[60px] p-3 rounded-xl border text-start transition-all flex items-start gap-2.5 ${
                                  selected
                                    ? 'border-[#D97706] bg-white shadow-sm ring-1 ring-[#D97706]/30'
                                    : 'border-[#E5DEC9] bg-white/80 hover:border-[#D97706]/50'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    selected
                                      ? 'bg-[#D97706] text-white'
                                      : 'bg-[#FFFBEB] text-[#D97706]'
                                  }`}
                                >
                                  <Smartphone className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs sm:text-sm font-bold text-[#1F2937] truncate">
                                    {t(wallet.name)}
                                  </div>
                                  <div className="text-[11px] text-[#1F2937]/60 line-clamp-1">
                                    {t(wallet.tagline)}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-0.5 text-xs">
                            <div className="text-[#1F2937]/65">
                              {lang === 'ar'
                                ? `رقم التاجر / التحويل في ${selectedWalletObj.name.ar}:`
                                : `${selectedWalletObj.name.en} Merchant Number:`}
                            </div>
                            <div
                              dir="ltr"
                              className="font-bold text-sm text-[#D97706] tabular-nums"
                            >
                              {selectedWalletObj.merchantCode}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyValue('wallet', selectedWalletObj.merchantCode)
                            }
                            className="min-h-[38px] px-3 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold text-[#1F2937] inline-flex items-center gap-1.5 transition-colors"
                          >
                            {copiedAccount === 'wallet' ? (
                              <Check className="w-3.5 h-3.5 text-[#4D7C0F]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                            )}
                            <span>
                              {copiedAccount === 'wallet'
                                ? lang === 'ar'
                                  ? 'تم النسخ'
                                  : 'Copied'
                                : lang === 'ar'
                                ? 'نسخ الرقم'
                                : 'Copy Number'}
                            </span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                            <span>
                              {lang === 'ar'
                                ? `رقم محفظة ${selectedWalletObj.name.ar} *`
                                : `${selectedWalletObj.name.en} Number *`}
                            </span>
                            <input
                              type="tel"
                              dir="ltr"
                              value={walletPhone}
                              onChange={(e) => setWalletPhone(e.target.value)}
                              placeholder="77xxxxxxx"
                              className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-sm font-normal focus:outline-none focus:border-[#D97706] tabular-nums"
                            />
                          </label>
                          <label className="block space-y-1 text-xs font-semibold text-[#1F2937]">
                            <span>
                              {lang === 'ar'
                                ? 'كود الشراء / رقم العملية *'
                                : 'Purchase Code / Ref *'}
                            </span>
                            <input
                              type="text"
                              dir="ltr"
                              value={walletRefCode}
                              onChange={(e) => setWalletRefCode(e.target.value)}
                              placeholder="TX-409128"
                              className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5DEC9] bg-white text-sm font-normal focus:outline-none focus:border-[#D97706] tabular-nums"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right/End: Order Summary */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-[#1F2937]">
            {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </h2>

          <div className="divide-y divide-[#E5DEC9]/70 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.cartKey} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold text-[#1F2937] truncate">{t(item.name)}</div>
                  <div className="text-xs text-[#1F2937]/60 tabular-nums">
                    {t(item.weightLabel)} × {item.quantity}
                  </div>
                </div>
                <span className="font-bold text-[#1F2937] tabular-nums shrink-0">
                  {item.isRewardItem
                    ? lang === 'ar'
                      ? 'مجاني'
                      : 'Free'
                    : formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-[#E5DEC9] text-sm">
            <div className="flex justify-between text-[#1F2937]/75">
              <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#4D7C0F] font-medium">
                <span>{lang === 'ar' ? 'الخصم والمكافآت' : 'Discounts & Vouchers'}</span>
                <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#1F2937]/75">
              <span>
                {shippingScope === 'international'
                  ? lang === 'ar'
                    ? `الشحن الدولي (${t(resolvedCountryName)})`
                    : `International (${t(resolvedCountryName)})`
                  : lang === 'ar'
                  ? `التوصيل المحلي (${domesticZone === 'inside_sanaa' ? 'داخل صنعاء' : 'خارج صنعاء'})`
                  : `Domestic (${domesticZone === 'inside_sanaa' ? "Inside Sana'a" : "Outside Sana'a"})`}
              </span>
              <span className="tabular-nums">
                {shippingFee === 0
                  ? lang === 'ar'
                    ? 'مجاني'
                    : 'Free'
                  : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-[#1F2937]/75">
              <span>{lang === 'ar' ? 'وسيلة الدفع' : 'Payment Method'}</span>
              <span className="font-semibold text-[#1F2937]">{t(activePaymentLabel)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#1F2937] pt-2 border-t border-[#E5DEC9]">
              <span>{lang === 'ar' ? 'الإجمالي المستحق' : 'Total Due'}</span>
              <span className="text-[#D97706] tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-[#E5DEC9] flex items-center gap-2 text-xs font-semibold text-[#4D7C0F] tabular-nums">
            <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>
              {lang === 'ar'
                ? `ستحصل على +${estimatedPointsEarned} نقطة في برنامج الولاء`
                : `Earn +${estimatedPointsEarned} Kunooz Doan Rewards points with this order`}
            </span>
          </div>

          {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm transition-colors"
          >
            {lang === 'ar' ? 'تأكيد وإرسال الطلب' : 'Confirm & Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};
