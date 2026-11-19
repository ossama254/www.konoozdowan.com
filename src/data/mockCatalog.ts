import {
  AboutContactSettings,
  CurrencyConfig,
  DomesticShippingZone,
  HeroBanner,
  HomePageSettings,
  InternationalCountryOption,
  LoyaltyProgramSettings,
  LoyaltyReward,
  LoyaltyTransaction,
  Order,
  Product,
  PromoCode,
  PushNotificationItem,
  SpecialOffer,
  StoreCategory,
} from '../types/store';

export const INITIAL_CATEGORIES: StoreCategory[] = [
  { id: 'honey', label: { ar: 'العسل الطبيعي', en: 'Raw Honey' } },
  { id: 'raisins', label: { ar: 'الزبيب الفاخر', en: 'Premium Raisins' } },
  { id: 'almonds', label: { ar: 'اللوز العضوي', en: 'Organic Almonds' } },
  { id: 'bundles', label: { ar: 'باقات الهدايا', en: 'Gift Bundles' } },
];

export const INITIAL_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'YER',
    symbol: { ar: 'ر.ي', en: 'YER' },
    name: { ar: 'الريال اليمني', en: 'Yemeni Rial' },
    yerPerUnit: 1,
    rateFromYer: 1,
    decimals: 0,
    isBase: true,
  },
  {
    code: 'SAR',
    symbol: { ar: 'ر.س', en: 'SAR' },
    name: { ar: 'الريال السعودي', en: 'Saudi Riyal' },
    yerPerUnit: 140,
    rateFromYer: 1 / 140,
    decimals: 2,
  },
  {
    code: 'USD',
    symbol: { ar: '$', en: 'USD' },
    name: { ar: 'الدولار الأمريكي', en: 'US Dollar' },
    yerPerUnit: 525,
    rateFromYer: 1 / 525,
    decimals: 2,
  },
];

export const INITIAL_DOMESTIC_ZONES: DomesticShippingZone[] = [
  {
    id: 'inside_sanaa',
    group: 'inside_sanaa',
    name: { ar: 'وسط صنعاء (التحرير والصافية)', en: "Central Sana'a (Tahrir & Safia)" },
    description: { ar: 'توصيل سريع خلال ٢-٤ ساعات', en: 'Express delivery in 2-4 hours' },
    coverageAreas: 'التحرير، الصافية، صنعاء القديمة، شارع الزبيري، هايل، شعوب',
    centerLat: 15.3547,
    centerLng: 44.2066,
    radiusKm: 5,
    fee: 1000,
    active: true,
  },
  {
    id: 'sanaa_south',
    group: 'inside_sanaa',
    name: { ar: 'جنوب صنعاء (حدة وبيت بوس)', en: "South Sana'a (Hadda & Bait Baws)" },
    description: { ar: 'توصيل في نفس اليوم للحي الجنوبي', en: 'Same-day courier for South districts' },
    coverageAreas: 'حدة، بيت بوس، الأصبحي، شارع الخمسين، الستين الجنوبي، حزيز، دار سلم',
    centerLat: 15.3025,
    centerLng: 44.1985,
    radiusKm: 7,
    fee: 1200,
    active: true,
  },
  {
    id: 'sanaa_north',
    group: 'inside_sanaa',
    name: { ar: 'شمال وغرب صنعاء (الروضة وشملان)', en: "North & West Sana'a (Rawda & Shamlan)" },
    description: { ar: 'توصيل مبرد خلال ٤-٨ ساعات', en: 'Chilled courier within 4-8 hours' },
    coverageAreas: 'الجراف، الروضة، شملان، مذبح، بني الحارث، سعوان، المطار',
    centerLat: 15.405,
    centerLng: 44.208,
    radiusKm: 10,
    fee: 1500,
    active: true,
  },
  {
    id: 'outside_sanaa_near',
    group: 'outside_sanaa',
    name: { ar: 'المحافظات القريبة (ذمار وعمران)', en: 'Nearby Governorates (Dhamar & Amran)' },
    description: { ar: 'شحن بري مبرد خلال ٢٤ ساعة', en: 'Chilled road delivery within 24h' },
    coverageAreas: 'ذمار، عمران، المحويت، ريمة، حجة، رداع',
    centerLat: 14.5426,
    centerLng: 44.4051,
    radiusKm: 105,
    fee: 2500,
    active: true,
  },
  {
    id: 'outside_sanaa',
    group: 'outside_sanaa',
    name: { ar: 'المدن الرئيسية (عدن، تعز، إب، الحديدة)', en: 'Major Cities (Aden, Taiz, Ibb, Hodeidah)' },
    description: { ar: 'شحن مبرد آمن خلال ٢٤-٤٨ ساعة', en: 'Safe chilled shipping in 24-48h' },
    coverageAreas: 'عدن، تعز، إب، الحديدة، لحج، الضالع',
    centerLat: 13.5795,
    centerLng: 44.0209,
    radiusKm: 190,
    fee: 3000,
    active: true,
  },
  {
    id: 'outside_sanaa_east',
    group: 'outside_sanaa',
    name: { ar: 'حضرموت والشرق (المكلا، دوعن، مأرب)', en: 'Hadhramaut & East (Mukalla, Doan, Marib)' },
    description: { ar: 'نقل جوي/بري مخصص خلال ٤٨-٧٢ ساعة', en: 'Express regional freight in 48-72h' },
    coverageAreas: 'حضرموت، دوعن، المكلا، سيئون، مأرب، شبوة، المهرة',
    centerLat: 15.465,
    centerLng: 48.32,
    radiusKm: 330,
    fee: 3500,
    active: true,
  },
];

export const HERO_BANNERS: HeroBanner[] = [
  {
    id: 'banner-sidr',
    kicker: {
      ar: 'موسم الحصاد الملكي ٢٠٢٦',
      en: '2026 Royal Harvest',
    },
    title: {
      ar: 'عسل السدر الجبلي النقي من مناحلنا إلى مائدتك',
      en: 'Pure Mountain Sidr Honey, Unfiltered from Hive to Table',
    },
    subtitle: {
      ar: 'مفحوص مخبرياً بنسبة نقاء ١٠٠٪ وخالٍ من أي إضافات، يُعبأ يدوياً في عبوات زجاجية فاخرة.',
      en: 'Lab-verified 100% raw purity, cold-extracted and hand-jarred in small seasonal batches.',
    },
    cta: {
      ar: 'تسوق العسل الطبيعي',
      en: 'Shop Raw Honey',
    },
    targetCategory: 'honey',
    image: '/src/assets/images/hero_sidr_honey_1794959132255.jpg',
    active: true,
  },
  {
    id: 'banner-gifts',
    kicker: {
      ar: 'باقات الضيافة والهدايا',
      en: 'Artisanal Gift Coffrets',
    },
    title: {
      ar: 'صندوق كنوز دوعن الفاخر: عسل سدر، زبيب رازقي ولوز عضوي',
      en: 'Kunooz Doan Reserve Box: Sidr Honey, Razqi Raisins & Almonds',
    },
    subtitle: {
      ar: 'تشكيلة متكاملة من خيرات الطبيعة في صندوق خشبي فاخر مع توصيل مجاني واكتساب مضاعف لنقاط الولاء.',
      en: 'A curated wooden keepsake box uniting mountain honey, sun-dried raisins, and heritage almonds.',
    },
    cta: {
      ar: 'استكشف باقات الهدايا',
      en: 'Explore Gift Bundles',
    },
    targetCategory: 'bundles',
    image: '/src/assets/images/hero_gift_bundle_1794959132103.jpg',
    active: true,
  },
];

export const INITIAL_HOME_SETTINGS: HomePageSettings = {
  showSearchBar: true,
  searchPlaceholder: {
    ar: 'ابحث عن المنتجات بالاسم أو النوع أو المنطقة (مثال: سدر، دوعن، ضبايه، زبيب)...',
    en: 'Search products by name, type, or region (e.g. Sidr, Doan, Dhabayah, raisins)...',
  },
  quickSearchTerms: {
    ar: ['سدر', 'دوعن', 'الضبايه', 'سمر', 'زبيب', 'حضرموت'],
    en: ['Sidr', 'Doan', 'Dhabayah', 'Sumra', 'Raisins', 'Hadhramaut'],
  },
  showHeroSlider: true,
  tourButtonLabel: {
    ar: 'جولة المتجر',
    en: 'App Tour',
  },
  showValueStrip: true,
  purityTitle: {
    ar: 'فحص مخبري موثق',
    en: 'Certified Lab Purity',
  },
  puritySubtitle: {
    ar: 'خلو تام من السكر المضاف والكبريت',
    en: 'Zero added sugar or sulfites',
  },
  loyaltyCtaLabel: {
    ar: 'استبدل خصومات وهدايا حصرية',
    en: 'Redeem discounts & exclusive jars',
  },
  shippingTitle: {
    ar: 'توصيل مبرد وسريع',
    en: 'Chilled Express Delivery',
  },
  offersKicker: {
    ar: 'قسم العروض والخصومات',
    en: 'Deals & Discounts',
  },
  offersHeading: {
    ar: 'أبرز العروض الحصرية لهذا الأسبوع',
    en: 'Featured Weekly Harvest Deals',
  },
  catalogTitle: {
    ar: 'منتجات الحصاد المختارة',
    en: 'Featured Harvest Collection',
  },
  catalogSubtitle: {
    ar: 'عسل سدر وسمر وزهور، زبيب رازقي وأسود، ولوز بلدي عضوي',
    en: 'Raw Sidr & Sumra honey, sun-dried raisins, and heritage almonds',
  },
};

export const INITIAL_ABOUT_SETTINGS: AboutContactSettings = {
  heroKicker: {
    ar: 'من نحن · كنوز دوعن',
    en: 'About Kunooz Doan',
  },
  heroTitle: {
    ar: 'كنوز دوعن — عسل يمني أصيل من المصدر إلى مائدتك',
    en: 'Kunooz Doan — Authentic Yemeni Honey from Source to Table',
  },
  heroDescription: {
    ar: 'متجر متخصص في العسل اليمني الطبيعي ومنتجات النحل. لتقديم عسل يمني أصلي نعرف مصدره ونحافظ على جودته، مع تجربة شراء بسيطة وواضحة.',
    en: 'A specialty store dedicated to pure Yemeni natural honey and apiary products—delivering traceable authentic harvests with preserved quality and a clear shopping experience.',
  },
  heroPrimaryCta: {
    ar: 'تصفح منتجات العسل',
    en: 'Browse Honey Collection',
  },
  heroSecondaryCta: {
    ar: 'استكشف العروض',
    en: 'Explore Offers',
  },
  showHeroLogoBox: true,
  logoImage: '/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg',
  logoCaption: {
    ar: 'لجميع أنواع العسل البلدي',
    en: 'For All Authentic Yemeni Honey',
  },
  showPillarsSection: true,
  pillars: [
    {
      id: 'vision',
      iconKey: 'eye',
      title: { ar: 'الرؤية', en: 'Our Vision' },
      text: {
        ar: 'أن نكون علامة موثوقة في تقديم العسل اليمني الطبيعي الأصيل بجودة عالية وهوية يمنية فاخرة.',
        en: 'To be a trusted benchmark for authentic Yemeni natural honey with superior quality and a refined Yemeni identity.',
      },
      active: true,
    },
    {
      id: 'mission',
      iconKey: 'compass',
      title: { ar: 'الرسالة', en: 'Our Mission' },
      text: {
        ar: 'تقديم عسل يمني أصلي نعرف مصدره ونحافظ على جودته، مع تجربة شراء بسيطة وواضحة.',
        en: 'Delivering authentic traceable Yemeni honey while preserving its natural purity through a simple, transparent shopping experience.',
      },
      active: true,
    },
    {
      id: 'goals',
      iconKey: 'target',
      title: { ar: 'الأهداف', en: 'Our Goals' },
      text: {
        ar: 'رفع ثقة المستهلك، دعم النحال اليمني، والمحافظة على جودة العسل من المصدر حتى يصل إلى العميل.',
        en: 'Building consumer trust, supporting local Yemeni beekeepers, and safeguarding honey quality from apiary to doorstep.',
      },
      active: true,
    },
  ],
  showContactSection: true,
  contactHeading: {
    ar: 'تواصل معنا',
    en: 'Contact Us',
  },
  contactSubtitle: {
    ar: 'يسعد فريق كنوز دوعن بخدمتك والإجابة عن استفساراتك حول أنواع العسل والطلبات والشحن الدولي.',
    en: 'Our team is happy to assist with honey selection, orders, and international shipping.',
  },
  phoneLabel: {
    ar: 'الهاتف والواتساب المباشر',
    en: 'Phone & WhatsApp',
  },
  phoneDisplay: '+967 777600045',
  phoneCopyValue: '777600045',
  emailLabel: {
    ar: 'البريد الإلكتروني',
    en: 'Email Support',
  },
  emailValue: 'care@kunoozdoan.com',
  locationLabel: {
    ar: 'المقر والمصدر',
    en: 'Origin & Branches',
  },
  locationValue: {
    ar: 'وادي دوعن (حضرموت) · صنعاء، الجمهورية اليمنية',
    en: 'Wadi Doan (Hadramout) · Sanaa, Yemen',
  },
  hoursLabel: {
    ar: 'ساعات خدمة العملاء',
    en: 'Customer Care Hours',
  },
  hoursValue: {
    ar: 'السبت - الخميس: ٩:٠٠ صباحاً – ١٠:٠٠ مساءً',
    en: 'Sat – Thu: 9:00 AM – 10:00 PM',
  },
  showContactForm: true,
  formHeading: {
    ar: 'أرسل لنا استفسارك أو طلبك الخاص',
    en: 'Send Us a Message',
  },
  formSubtitle: {
    ar: 'سواءً للاستفسار عن الشهادات المخبرية، طلبات الجملة، أو الشحن لدول العالم.',
    en: 'Reach out for lab reports, wholesale orders, or international shipping inquiries.',
  },
  formSubmitLabel: {
    ar: 'إرسال الرسالة',
    en: 'Send Message',
  },
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-sidr-royal',
    sku: 'HB-SDR-001',
    category: 'honey',
    subCategory: { ar: 'عسل سدر', en: 'Sidr Honey' },
    name: {
      ar: 'عسل سدر كنوز دوعن',
      en: 'Kunooz Doan Mountain Sidr Honey',
    },
    shortDescription: {
      ar: 'قطفة خريفية فاخرة بقوام كثيف ورائحة السدر الأصيلة',
      en: 'Autumn single-origin harvest with velvety amber viscosity',
    },
    description: {
      ar: 'عسل سدر طبيعي ١٠٠٪ يُجنى من أشجار السدر المعمرة في الوديان الجبلية. يتميز بلونه الكهرماني الداكن ومذاقه الغني ونسبة مضادات الأكسدة العالية، معبأ على البارد للحفاظ على جميع الإنزيمات الحيوية.',
      en: 'Harvested once a year from ancient mountain Ziziphus trees. Cold-extracted and unfiltered to preserve delicate diastase enzymes, trace minerals, and signature caramel-woody complexity.',
    },
    origin: { ar: 'وادي دوعن، حضرموت', en: 'Wadi Doan, Hadhramaut' },
    harvestSeason: { ar: 'موسم الخريف · نوفمبر ٢٠٢٦', en: 'Autumn · November 2026' },
    benefits: [
      { ar: 'يعزز المناعة الطبيعية ويمنح طاقة مستدامة', en: 'Supports natural immunity and sustained daily vitality' },
      { ar: 'مهدئ طبيعي للجهاز الهضمي والحلق', en: 'Soothing support for digestion and throat comfort' },
      { ar: 'غني بالمركبات الفينولية ومضادات الأكسدة', en: 'Rich in natural polyphenols and antioxidants' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '16.2%' },
      { label: { ar: 'مؤشر HMF', en: 'HMF Level' }, value: '6.4 mg/kg' },
      { label: { ar: 'نقاء حبوب اللقاح', en: 'Sidr Pollen' }, value: '94%' },
    ],
    images: [
      '/src/assets/images/product_sidr_jar_1794959132616.jpg',
      '/src/assets/images/hero_sidr_honey_1794959132255.jpg',
    ],
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'مفحوص مخبرياً ١٠٠٪', en: 'Lab-Tested 100% Raw' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 145, compareAtPrice: 165, stock: 38 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 270, compareAtPrice: 310, stock: 24 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 510, compareAtPrice: 580, stock: 12 },
      { id: 'w-3500', label: { ar: 'نصف جالون (٣.٥ كجم)', en: 'Half Gallon (3.5kg)' }, grams: 3500, price: 1680, compareAtPrice: 1785, stock: 8 },
      { id: 'w-7000', label: { ar: 'جالون (٧ كجم)', en: 'Gallon (7kg)' }, grams: 7000, price: 3250, compareAtPrice: 3570, stock: 5 },
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'عبدالله القحطاني',
        rating: 5,
        date: '2026-10-18',
        comment: {
          ar: 'قوام ممتاز وطعم سدر أصيل يذكّرني بعسل الديرة القديم. التغليف الزجاجي محكم جداً.',
          en: 'Authentic thick texture and unmistakable Sidr aroma. Glass packaging arrived immaculate.',
        },
        verifiedPurchase: true,
      },
      {
        id: 'rev-2',
        author: 'سارة المنصور',
        rating: 5,
        date: '2026-11-02',
        comment: {
          ar: 'أفضل عسل سدر جربته مع المكسرات والزبيب في الصباح.',
          en: 'Best Sidr honey I have paired with morning almonds and raisins.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-sumra-mountain',
    sku: 'HB-SMR-002',
    category: 'honey',
    subCategory: { ar: 'عسل سمر', en: 'Sumra Honey' },
    name: {
      ar: 'عسل السمر البري الداكن',
      en: 'Wild Sumra Mountain Honey',
    },
    shortDescription: {
      ar: 'عسل شوكي فاخر غني بالحديد والمعادن الطبيعية',
      en: 'Dark mahogany acacia-thorn nectar rich in trace minerals',
    },
    description: {
      ar: 'يُنتج من رحيق أزهار أشجار السمر الجبلية في نهاية الربيع. يشتهر بلونه الياقوتي الداكن وحلاوته المتوازنة وقيمته الغذائية العالية، خاصة لدعم الهضم والنشاط.',
      en: 'Collected from wild desert acacia blossoms in late spring. Treasured for its deep mahogany hue, low glycemic curve, and high iron content.',
    },
    origin: { ar: 'وديان عسير وشبوة', en: 'Asir & Shabwa Valleys' },
    harvestSeason: { ar: 'موسم الصيف · يوليو ٢٠٢٦', en: 'Summer · July 2026' },
    benefits: [
      { ar: 'مصدر غني بالحديد الطبيعي والمعادن النادرة', en: 'Naturally abundant in iron and trace minerals' },
      { ar: 'مناسب للمعدة والقولون بفضل خصائصه القلوية المتوازنة', en: 'Gentle on digestion with balanced natural enzymes' },
      { ar: 'حلاوة هادئة بدون لسعة سكرية حادة', en: 'Balanced sweetness with herbal, toasted-malt notes' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '15.8%' },
      { label: { ar: 'إنزيم الدياستيز', en: 'Diastase' }, value: '24.5 DN' },
      { label: { ar: 'نقاء طبيعي', en: 'Purity' }, value: '100%' },
    ],
    images: [
      '/src/assets/images/product_sumra_honey_1794959133655.jpg',
      '/src/assets/images/hero_sidr_honey_1794959132255.jpg',
    ],
    rating: 4.8,
    reviewCount: 96,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'عضوي بري غير مبستر', en: 'Wild Raw Unheated' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 115, stock: 45 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 215, compareAtPrice: 240, stock: 29 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 410, compareAtPrice: 460, stock: 14 },
      { id: 'w-3500', label: { ar: 'نصف جالون (٣.٥ كجم)', en: 'Half Gallon (3.5kg)' }, grams: 3500, price: 1350, compareAtPrice: 1435, stock: 10 },
      { id: 'w-7000', label: { ar: 'جالون (٧ كجم)', en: 'Gallon (7kg)' }, grams: 7000, price: 2600, compareAtPrice: 2870, stock: 6 },
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'فيصل الحربي',
        rating: 5,
        date: '2026-10-29',
        comment: {
          ar: 'عسل سمر ثقيل وطعمه فريد، التوصيل وصل خلال ساعتين.',
          en: 'Rich dark Sumra flavor, delivered within two hours.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-wildflower-spring',
    sku: 'HB-ZHR-003',
    category: 'honey',
    subCategory: { ar: 'عسل زهور', en: 'Wildflower Honey' },
    name: {
      ar: 'عسل زهور الربيع الجبلية',
      en: 'Highland Spring Wildflower Honey',
    },
    shortDescription: {
      ar: 'رحيق أزهار اللافندر والزعتر البري بنكهة عطرية ناعمة',
      en: 'Floral blend of wild thyme and mountain blossoms',
    },
    description: {
      ar: 'مزيج عطري طبيعي من رحيق الأزهار البرية في المرتفعات الخضراء، مثالي للتحلية اليومية والمشروبات الدافئة والإفطار العائلي.',
      en: 'Bright golden multifloral honey gathered across highland meadows of wild thyme and clover. Ideal for daily tea, warm milk, and culinary drizzling.',
    },
    origin: { ar: 'مرتفعات الطائف وأبها', en: 'Taif & Abha Highlands' },
    harvestSeason: { ar: 'موسم الربيع · أبريل ٢٠٢٦', en: 'Spring · April 2026' },
    benefits: [
      { ar: 'طعم عطري خفيف يناسب جميع أفراد العائلة', en: 'Light floral profile loved by the whole family' },
      { ar: 'بديل صحي للسكر المكرر في المخبوزات والشاي', en: 'Wholesome unrefined alternative to processed sugar' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '16.9%' },
      { label: { ar: 'خالٍ من السكروز', en: 'Added Sugar' }, value: '0%' },
      { label: { ar: 'الترشيح', en: 'Filtration' }, value: 'Cold Raw' },
    ],
    images: [
      '/src/assets/images/hero_sidr_honey_1794959132255.jpg',
      '/src/assets/images/product_sidr_jar_1794959132616.jpg',
    ],
    rating: 4.7,
    reviewCount: 74,
    isFeatured: false,
    isBestSeller: false,
    purityBadge: { ar: 'منتحل موسمي طازج', en: 'Fresh Apiary Batch' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 78, stock: 50 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 145, stock: 34 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 270, compareAtPrice: 300, stock: 18 },
      { id: 'w-3500', label: { ar: 'نصف جالون (٣.٥ كجم)', en: 'Half Gallon (3.5kg)' }, grams: 3500, price: 890, compareAtPrice: 945, stock: 12 },
      { id: 'w-7000', label: { ar: 'جالون (٧ كجم)', en: 'Gallon (7kg)' }, grams: 7000, price: 1720, compareAtPrice: 1890, stock: 7 },
    ],
    reviews: [
      {
        id: 'rev-zhr-1',
        author: 'ريم الزهراني',
        rating: 5,
        date: '2026-10-14',
        comment: {
          ar: 'رائحة الزهور البرية واضحة وطعمه لطيف جداً مع الشاي والحليب الدافئ صباحاً.',
          en: 'Delicate wildflower aroma and wonderfully smooth in morning tea and warm milk.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-shafi-honey',
    sku: 'KD-SHF-008',
    category: 'honey',
    subCategory: { ar: 'عسل شعفي', en: "Sha'fi Honey" },
    name: {
      ar: 'العسل الشعفي',
      en: "Pure Mountain Sha'fi Honey",
    },
    shortDescription: {
      ar: 'عسل جبلي بري من قمم الجبال بنكهة عشبية نادرة وقوام ذهبي كثيف',
      en: 'Rare high-altitude mountain nectar with rich herbal warmth',
    },
    description: {
      ar: 'يُجمع العسل الشعفي من الأعشاب الجبلية النادرة في المرتفعات الوعرة (الشعاف)، حيث يتغذى النحل على أزهار برية موسمية تمنحه لوناً كهرمانياً ذهبياً وطعماً دافئاً مركزاً وفوائد غذائية عالية.',
      en: 'Foraged from remote highland ridges where bees feed on wild alpine flora, yielding a luminous amber honey prized for concentrated enzymes and deep herbal notes.',
    },
    origin: { ar: 'قمم الشعاف الجبلية، اليمن', en: "Al-Sha'af Ridges, Yemen" },
    harvestSeason: { ar: 'موسم الخريف · أكتوبر ٢٠٢٦', en: 'Autumn · October 2026' },
    benefits: [
      { ar: 'يدعم صحة الجهاز التنفسي ويمنح دفئاً وحيوية للجسم', en: 'Supports respiratory wellness and natural daily vitality' },
      { ar: 'غني بمضادات الأكسدة والإنزيمات الجبلية الخام', en: 'Rich in raw mountain antioxidants and natural enzymes' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '15.9%' },
      { label: { ar: 'مؤشر HMF', en: 'HMF Level' }, value: '5.8 mg/kg' },
      { label: { ar: 'النقاء الطبيعي', en: 'Purity' }, value: '100%' },
    ],
    images: [
      '/src/assets/images/product_shafi_honey_1794960510760.jpg',
      '/src/assets/images/hero_sidr_honey_1794959132255.jpg',
    ],
    rating: 4.9,
    reviewCount: 52,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'قطفة جبلية نقية ١٠٠٪', en: '100% Wild Mountain Raw' },
    weightOptions: [
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 360, compareAtPrice: 395, stock: 22 },
      { id: 'w-2000', label: { ar: '٢ كجم', en: '2kg' }, grams: 2000, price: 690, compareAtPrice: 760, stock: 14 },
      { id: 'w-5000', label: { ar: '٥ كجم', en: '5kg' }, grams: 5000, price: 1650, compareAtPrice: 1800, stock: 7 },
    ],
    reviews: [
      {
        id: 'rev-shf-1',
        author: 'منصور الحميري',
        rating: 5,
        date: '2026-11-01',
        comment: {
          ar: 'العسل الشعفي أصلي ونادر فعلاً، قوامه كثيف ونكهته الجبلية واضحة من أول ملعقة.',
          en: "Authentic rare mountain Sha'fi honey—dense body and unmistakably wild herbal depth.",
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-sorb-solid',
    sku: 'KD-SRB-009',
    category: 'honey',
    subCategory: { ar: 'عسل الصورب', en: 'Sorb Honey' },
    name: {
      ar: 'عسل الصورب الجامد',
      en: 'Crystallized Solid Sorb Honey',
    },
    shortDescription: {
      ar: 'عسل صورب متبلور طبيعياً بقوام كريمي أبيض مائل للذهبي',
      en: 'Naturally crystallized highland Sorb honey with creamy velvet texture',
    },
    description: {
      ar: 'عسل الصورب الجامد (المجري) يتبلور طبيعياً ببطء دون أي تدخل حراري، ليكتسب قواماً كريمياً ناعماً يذوب في الفم مع نكهة زهرية عميقة وعناصر غذائية محفوظة بالكامل.',
      en: 'Unheated highland Sorb honey that sets naturally into a dense, spoonable golden-ivory cream, preserving delicate pollen, vitamins, and floral aroma.',
    },
    origin: { ar: 'المناحل الجبلية، دوعن', en: 'Mountain Apiaries, Doan' },
    harvestSeason: { ar: 'موسم الخريف · أكتوبر ٢٠٢٦', en: 'Autumn · October 2026' },
    benefits: [
      { ar: 'قوام كريمي سهل الدهن مع احتفاظ كامل بالفيتامينات والإنزيمات', en: 'Creamy raw texture with unheated enzymes intact' },
      { ar: 'مثالي على الريق وللأطفال والرياضيين كمصدر طاقة سريع', en: 'Ideal morning spoonful for sustained natural energy' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '15.1%' },
      { label: { ar: 'التبلور الطبيعي', en: 'Crystallization' }, value: '100% Raw' },
      { label: { ar: 'خالٍ من السكروز', en: 'Added Sugar' }, value: '0%' },
    ],
    images: [
      '/src/assets/images/product_sorb_solid_1794960511534.jpg',
      '/src/assets/images/product_shafi_honey_1794960510760.jpg',
    ],
    rating: 4.8,
    reviewCount: 41,
    isFeatured: true,
    isBestSeller: false,
    purityBadge: { ar: 'متبلور طبيعياً على البارد', en: 'Raw Cold-Set Creamed' },
    weightOptions: [
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 320, compareAtPrice: 350, stock: 26 },
      { id: 'w-2000', label: { ar: '٢ كجم', en: '2kg' }, grams: 2000, price: 615, compareAtPrice: 680, stock: 15 },
      { id: 'w-5000', label: { ar: '٥ كجم', en: '5kg' }, grams: 5000, price: 1475, compareAtPrice: 1620, stock: 8 },
    ],
    reviews: [
      {
        id: 'rev-srb-1',
        author: 'هدى باوزير',
        rating: 5,
        date: '2026-10-27',
        comment: {
          ar: 'عسل الصورب الجامد رائع جداً على الفطور، قوامه كريمي ناعم ويذوب بسرعة.',
          en: 'Creamy cold-set Sorb honey is delicious at breakfast and melts effortlessly.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-sorb-comb',
    sku: 'KD-SBC-010',
    category: 'honey',
    subCategory: { ar: 'عسل شمع', en: 'Raw Honeycomb' },
    name: {
      ar: 'عسل الصورب الشمع',
      en: 'Raw Sorb Honeycomb',
    },
    shortDescription: {
      ar: 'أقراص شمع طبيعية مليئة بعسل الصورب الخام كما بناها النحل',
      en: 'Pure edible beeswax comb filled with unfiltered Sorb nectar',
    },
    description: {
      ar: 'أقراص عسل الصورب بالشمع الطبيعي المقطوفة مباشرة من الخلايا دون عصر أو تصفية، تجمع بين حلاوة عسل الصورب وفوائد شمع العسل الطبيعي والعكبر.',
      en: 'Hand-cut directly from the hive frames, pairing raw Sorb nectar with tender beeswax comb and trace natural propolis.',
    },
    origin: { ar: 'هضاب ومناحل حضرموت', en: 'Hadhramaut Plateaus' },
    harvestSeason: { ar: 'موسم الخريف · نوفمبر ٢٠٢٦', en: 'Autumn · November 2026' },
    benefits: [
      { ar: 'يجمع بين فوائد العسل الخام وشمع العسل الطبيعي والعكبر', en: 'Combines raw Sorb honey with natural beeswax and propolis' },
      { ar: 'يعزز صحة اللثة والجيوب الأنفية عند المضغ', en: 'Supports oral and digestive health naturally' },
    ],
    labMetrics: [
      { label: { ar: 'شمع طبيعي', en: 'Beeswax Comb' }, value: '100% Pure' },
      { label: { ar: 'المعالجة الحرارية', en: 'Heat Treated' }, value: 'None' },
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '16.0%' },
    ],
    images: [
      '/src/assets/images/product_sidr_comb_1794960514275.jpg',
      '/src/assets/images/product_sorb_solid_1794960511534.jpg',
    ],
    rating: 4.9,
    reviewCount: 37,
    isFeatured: true,
    isBestSeller: false,
    purityBadge: { ar: 'شمع نحل طبيعي ١٠٠٪', en: '100% Unprocessed Comb' },
    weightOptions: [
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 340, compareAtPrice: 375, stock: 20 },
      { id: 'w-2000', label: { ar: '٢ كجم', en: '2kg' }, grams: 2000, price: 650, compareAtPrice: 720, stock: 11 },
      { id: 'w-5000', label: { ar: '٥ كجم', en: '5kg' }, grams: 5000, price: 1550, compareAtPrice: 1700, stock: 6 },
    ],
    reviews: [
      {
        id: 'rev-sbc-1',
        author: 'طارق بامخرمة',
        rating: 5,
        date: '2026-11-04',
        comment: {
          ar: 'أقراص الشمع طازجة ونظيفة ومليئة بعسل الصورب الطبيعي، تجربة مميزة.',
          en: 'Fresh, clean beeswax comb brimming with rich unfiltered Sorb nectar.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-sidr-usaimi-comb',
    sku: 'KD-USC-011',
    category: 'honey',
    subCategory: { ar: 'عسل سدر عصيمي', en: 'Usaimi Sidr Comb' },
    name: {
      ar: 'عسل سدر عصيمي شمع',
      en: 'Usaimi Sidr Raw Honeycomb',
    },
    shortDescription: {
      ar: 'أقراص شمع عسل السدر العصيمي الفاخر برائحة السدر النقية',
      en: 'Prized Usaimi Sidr honeycomb cut fresh from wild mountain hives',
    },
    description: {
      ar: 'من أندر وأفخر منتجات كنوز دوعن؛ أقراص شمع عسل السدر العصيمي المقطوفة يدوياً في ذروة الموسم، بنكهة سدر مركزة وقوام شمعي رقيق يذوب بسلاسة.',
      en: 'One of Kunooz Doan’s rarest seasonal selections: intact Usaimi Sidr honeycomb frames rich in royal floral aroma and delicate melt-in-mouth comb.',
    },
    origin: { ar: 'وديان العصيمات، عمران', en: 'Usaimat Valleys, Amran' },
    harvestSeason: { ar: 'موسم الخريف · نوفمبر ٢٠٢٦', en: 'Autumn · November 2026' },
    benefits: [
      { ar: 'أعلى درجات النقاء لاحتوائه على العسل وحبوب اللقاح والشمع معاً', en: 'Complete raw hive nutrition with nectar, pollen, and beeswax' },
      { ar: 'مذاق سدر عصيمي أصيل مثالي للضيافة الفاخرة والهدايا', en: 'Signature Usaimi Sidr finish prized for gifting and hospitality' },
    ],
    labMetrics: [
      { label: { ar: 'نقاء لقاح السدر', en: 'Sidr Pollen' }, value: '95%' },
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '15.7%' },
      { label: { ar: 'مؤشر HMF', en: 'HMF Level' }, value: '5.2 mg/kg' },
    ],
    images: [
      '/src/assets/images/product_sidr_comb_1794960514275.jpg',
      '/src/assets/images/product_sidr_jar_1794959132616.jpg',
    ],
    rating: 5.0,
    reviewCount: 64,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'سدر عصيمي ملكي بالشمع', en: 'Royal Usaimi Comb' },
    weightOptions: [
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 480, compareAtPrice: 525, stock: 16 },
      { id: 'w-2000', label: { ar: '٢ كجم', en: '2kg' }, grams: 2000, price: 920, compareAtPrice: 1010, stock: 9 },
      { id: 'w-5000', label: { ar: '٥ كجم', en: '5kg' }, grams: 5000, price: 2200, compareAtPrice: 2400, stock: 4 },
    ],
    reviews: [
      {
        id: 'rev-usc-1',
        author: 'أحمد العطاس',
        rating: 5,
        date: '2026-11-08',
        comment: {
          ar: 'شمع السدر العصيمي قمة في الجودة والنكهة، القرص ممتلئ والرائحة فواحة.',
          en: 'Top-tier Usaimi Sidr honeycomb—full frames with unmistakable Sidr fragrance.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-usaimi-sidr-royal',
    sku: 'KD-USR-012',
    category: 'honey',
    subCategory: { ar: 'عسل سدر عصيمي', en: 'Usaimi Sidr Honey' },
    name: {
      ar: 'عسل السدر العصيمي الملكي',
      en: 'Royal Usaimi Sidr Honey',
    },
    shortDescription: {
      ar: 'القطفة البكر الأندر من وديان العصيمات بنقاء ملكي فائق وكثافة ذهبية عالية',
      en: 'Rare first-harvest Usaimi valley Sidr honey with royal purity and velvet density',
    },
    description: {
      ar: 'يمثل عسل السدر العصيمي الملكي قمة القطفة البكر الأولى من أشجار السدر المعمرة في وديان العصيمات الجبلية. يتميز بتركيز عالٍ من حبوب لقاح السدر ومضادات الأكسدة، وقوام كهرماني متجانس بعبق سدر أصيل يدوم طويلاً.',
      en: 'Our pinnacle first-harvest Usaimi Sidr reserve gathered from ancient mountain Ziziphus groves. Rich in single-origin Sidr pollen, polyphenols, and velvety caramel-woody complexity.',
    },
    origin: { ar: 'وديان العصيمات، عمران', en: 'Usaimat Valleys, Amran' },
    harvestSeason: { ar: 'موسم الخريف · نوفمبر ٢٠٢٦', en: 'Autumn · November 2026' },
    benefits: [
      { ar: 'أعلى درجة نقاء وتركيز في حبوب لقاح السدر لدعم المناعة والنشاط', en: 'Highest Sidr pollen concentration for immunity and sustained energy' },
      { ar: 'مضاد أكسدة طبيعي قوي ومهدئ للجهاز الهضمي والحلق', en: 'Potent natural antioxidants with soothing digestive support' },
      { ar: 'معبأ على البارد دون أي تسخين أو ترشيح جائر', en: 'Cold-extracted and unfiltered to preserve raw enzymes' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '15.4%' },
      { label: { ar: 'مؤشر HMF', en: 'HMF Level' }, value: '4.6 mg/kg' },
      { label: { ar: 'نقاء لقاح السدر', en: 'Sidr Pollen' }, value: '96%' },
    ],
    images: [
      '/src/assets/images/product_usaimi_sidr_royal_1794960695871.jpg',
      '/src/assets/images/hero_sidr_honey_1794959132255.jpg',
    ],
    rating: 5.0,
    reviewCount: 89,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'قطفة ملكية بكر ١٠٠٪', en: '100% Royal First Harvest' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 165, compareAtPrice: 185, stock: 28 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 310, compareAtPrice: 345, stock: 20 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 590, compareAtPrice: 650, stock: 12 },
      { id: 'w-3500', label: { ar: 'نصف جالون (٣.٥ كجم)', en: 'Half Gallon (3.5kg)' }, grams: 3500, price: 1950, compareAtPrice: 2065, stock: 6 },
      { id: 'w-7000', label: { ar: 'جالون (٧ كجم)', en: 'Gallon (7kg)' }, grams: 7000, price: 3780, compareAtPrice: 4130, stock: 4 },
    ],
    reviews: [
      {
        id: 'rev-usr-1',
        author: 'سالم بن محفوظ',
        rating: 5,
        date: '2026-11-11',
        comment: {
          ar: 'السدر العصيمي الملكي يستحق كل ريال، نقاء واضح وطعم أصيل من القطفة الأولى.',
          en: 'Royal Usaimi Sidr is extraordinary—crystal-clear purity and deep first-harvest flavor.',
        },
        verifiedPurchase: true,
      },
      {
        id: 'rev-usr-2',
        author: 'وفاء الحداد',
        rating: 5,
        date: '2026-11-14',
        comment: {
          ar: 'طلبناه بعبوة ١ كجم للوالد، التغليف فاخر والطعم ممتاز جداً.',
          en: 'Ordered the 1kg jar as a gift for my father—impeccable packaging and flavor.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-usaimi-sidr-luxury',
    sku: 'KD-USF-013',
    category: 'honey',
    subCategory: { ar: 'عسل سدر عصيمي', en: 'Usaimi Sidr Honey' },
    name: {
      ar: 'عسل السدر العصيمي الفاخر',
      en: 'Luxury Usaimi Sidr Honey',
    },
    shortDescription: {
      ar: 'سدر عصيمي نقي مختار بعناية بطعم غني ومتوازن للاستخدام اليومي والضيافة',
      en: 'Selected mountain Usaimi Sidr honey balancing rich aroma and everyday luxury',
    },
    description: {
      ar: 'عسل السدر العصيمي الفاخر من مناحلنا في وديان العصيمات، يجمع بين أصالة طعم السدر الجبلي ولونه الذهبي الكهرماني، ومثالي للاستخدام الصحي اليومي وتقديمه في مناسبات الضيافة.',
      en: 'Curated from our Usaimi mountain apiaries, offering classic Sidr depth, smooth golden body, and verified raw purity ideal for daily wellness and hospitality.',
    },
    origin: { ar: 'وديان العصيمات، عمران', en: 'Usaimat Valleys, Amran' },
    harvestSeason: { ar: 'موسم الخريف · أكتوبر ٢٠٢٦', en: 'Autumn · October 2026' },
    benefits: [
      { ar: 'يعزز الحيوية اليومية ومناعة الجسم بصورة طبيعية', en: 'Boosts daily energy and natural immune resilience' },
      { ar: 'مذاق سدر عصيمي متوازن يرضي جميع الأذواق', en: 'Smooth signature Usaimi Sidr flavor loved by the family' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '16.0%' },
      { label: { ar: 'مؤشر HMF', en: 'HMF Level' }, value: '6.1 mg/kg' },
      { label: { ar: 'نقاء لقاح السدر', en: 'Sidr Pollen' }, value: '91%' },
    ],
    images: [
      '/src/assets/images/product_sidr_jar_1794959132616.jpg',
      '/src/assets/images/product_usaimi_sidr_royal_1794960695871.jpg',
    ],
    rating: 4.9,
    reviewCount: 73,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'عصيمي فاخر مفحوص مخبرياً', en: 'Lab-Verified Luxury Grade' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 135, compareAtPrice: 150, stock: 34 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 255, compareAtPrice: 285, stock: 24 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 485, compareAtPrice: 540, stock: 15 },
      { id: 'w-3500', label: { ar: 'نصف جالون (٣.٥ كجم)', en: 'Half Gallon (3.5kg)' }, grams: 3500, price: 1600, compareAtPrice: 1695, stock: 8 },
      { id: 'w-7000', label: { ar: 'جالون (٧ كجم)', en: 'Gallon (7kg)' }, grams: 7000, price: 3100, compareAtPrice: 3395, stock: 5 },
    ],
    reviews: [
      {
        id: 'rev-usf-1',
        author: 'ياسر المقطري',
        rating: 5,
        date: '2026-11-06',
        comment: {
          ar: 'عسل السدر العصيمي الفاخر ممتاز للاستخدام اليومي، كثافته ونكهته رائعة.',
          en: 'Luxury Usaimi Sidr has wonderful daily balance, rich viscosity, and aroma.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-sumra-grade-two',
    sku: 'KD-SM2-014',
    category: 'honey',
    subCategory: { ar: 'عسل سمر', en: 'Sumra Honey' },
    name: {
      ar: 'عسل السمر الدرجة الثانية',
      en: 'Second-Grade Wild Sumra Honey',
    },
    shortDescription: {
      ar: 'عسل سمر طبيعي من القطفة المتأخرة ممزوج برحيق الزهور البرية بسعر اقتصادي',
      en: 'Authentic late-season dark Sumra acacia blend with wildflowers at value pricing',
    },
    description: {
      ar: 'عسل السمر الدرجة الثانية هو عسل طبيعي ١٠٠٪ غير مبستر يُجنى في أواخر موسم السمر مع نسبة طبيعية من رحيق الأعشاب والزهور البرية المحيطة، مما يمنحه فوائد السمر الغنية بالحديد والمعادن بقيمة اقتصادية مناسبة للاستخدام العائلي اليومي.',
      en: '100% raw unheated late-harvest Sumra honey naturally blended by bees with surrounding desert blossoms, retaining rich mineral and iron benefits at an accessible everyday price.',
    },
    origin: { ar: 'وديان مأرب وشبوة', en: 'Marib & Shabwa Valleys' },
    harvestSeason: { ar: 'موسم الصيف · أغسطس ٢٠٢٦', en: 'Summer · August 2026' },
    benefits: [
      { ar: 'عسل سمر طبيعي غير مغشوش بسعر مناسب للاستخدام اليومي والمشروبات', en: 'Pure unrefined Sumra honey ideal for daily wellness and cooking' },
      { ar: 'غني بالمعادن والحديد ويدعم الهضم والنشاط العام', en: 'Naturally rich in iron and minerals supporting digestion' },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '16.5%' },
      { label: { ar: 'إنزيم الدياستيز', en: 'Diastase' }, value: '19.8 DN' },
      { label: { ar: 'خالٍ من السكروز', en: 'Added Sugar' }, value: '0%' },
    ],
    images: [
      '/src/assets/images/product_sumra_grade2_1794960697696.jpg',
      '/src/assets/images/product_sumra_honey_1794959133655.jpg',
    ],
    rating: 4.7,
    reviewCount: 48,
    isFeatured: false,
    isBestSeller: false,
    purityBadge: { ar: 'طبيعي ١٠٠٪ درجة ثانية', en: '100% Raw Grade II' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 85, compareAtPrice: 98, stock: 46 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 160, compareAtPrice: 185, stock: 32 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 295, compareAtPrice: 340, stock: 20 },
      { id: 'w-3500', label: { ar: 'نصف جالون (٣.٥ كجم)', en: 'Half Gallon (3.5kg)' }, grams: 3500, price: 980, compareAtPrice: 1035, stock: 12 },
      { id: 'w-7000', label: { ar: 'جالون (٧ كجم)', en: 'Gallon (7kg)' }, grams: 7000, price: 1890, compareAtPrice: 2065, stock: 8 },
    ],
    reviews: [
      {
        id: 'rev-sm2-1',
        author: 'ماجد النهدي',
        rating: 5,
        date: '2026-10-30',
        comment: {
          ar: 'عسل السمر الدرجة الثانية طبيعي وممتاز للتحلية اليومية وللعائلة بسعر اقتصادي.',
          en: 'Pure raw second-grade Sumra honey—great everyday value for the whole family.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-dhabayah-solid',
    sku: 'KD-DHB-015',
    category: 'honey',
    subCategory: { ar: 'عسل الضبايه', en: 'Dhabayah Honey' },
    name: {
      ar: 'عسل الضبايه الجامد',
      en: 'Crystallized Al-Dhabayah Honey',
    },
    shortDescription: {
      ar: 'عسل الضبايه الجبلي المتبلور طبيعياً بلونه العاجي الفاتح وقوامه الكريمي الجامد',
      en: 'Naturally crystallized ivory-cream Yemeni Al-Dhabayah honey with fine velvet texture',
    },
    description: {
      ar: 'يُعد عسل الضبايه الجامد من أرقى الأعسال اليمنية الجبلية النادرة، يُجمع من رحيق أزهار الضبايه والأعشاب المرتفعة ويتبلور طبيعياً على البارد ليأخذ لوناً عاجياً ناصعاً وقواماً جامداً ناعماً يذوب في الفم بنكهة زهرية هادئة وفوائد غذائية مركزة.',
      en: 'Prized rare Yemeni highland honey harvested from Al-Dhabayah mountain blossoms. Cold-extracted and naturally set without heating into a smooth, pale-ivory crystalline body rich in floral enzymes and pollen.',
    },
    origin: { ar: 'المرتفعات الجبلية، اليمن', en: 'Yemeni Mountain Highlands' },
    harvestSeason: { ar: 'موسم الخريف · نوفمبر ٢٠٢٦', en: 'Autumn · November 2026' },
    benefits: [
      {
        ar: 'تبلور طبيعي نقي ١٠٠٪ على البارد يحفظ الإنزيمات والفيتامينات دون تسخين',
        en: '100% raw natural crystallization preserving unheated enzymes and pollen',
      },
      {
        ar: 'يمنح طاقة فورية ويدعم المناعة وصحة المعدة بقوام لطيف سهل التناول',
        en: 'Provides clean natural energy and gentle digestive and immune support',
      },
      {
        ar: 'مثالي على الريق وفي وجبات الإفطار الفاخرة للأطفال والكبار',
        en: 'Ideal on an empty stomach or spread at breakfast for adults and children',
      },
    ],
    labMetrics: [
      { label: { ar: 'نسبة الرطوبة', en: 'Moisture' }, value: '15.2%' },
      { label: { ar: 'التبلور الطبيعي', en: 'Crystallization' }, value: '100% Raw' },
      { label: { ar: 'خالٍ من السكروز', en: 'Added Sugar' }, value: '0%' },
    ],
    images: [
      '/src/assets/images/product_dhabayah_honey_1795044327728.jpg',
      '/src/assets/images/product_sorb_solid_1794960511534.jpg',
    ],
    rating: 4.9,
    reviewCount: 44,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'ضبايه جامد طبيعي ١٠٠٪', en: '100% Raw Solid Dhabayah' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 95, compareAtPrice: 110, stock: 36 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 180, compareAtPrice: 205, stock: 26 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 340, compareAtPrice: 385, stock: 18 },
      { id: 'w-3500', label: { ar: 'نصف جالون (٣.٥ كجم)', en: 'Half Gallon (3.5kg)' }, grams: 3500, price: 1140, compareAtPrice: 1220, stock: 9 },
      { id: 'w-7000', label: { ar: 'جالون (٧ كجم)', en: 'Gallon (7kg)' }, grams: 7000, price: 2190, compareAtPrice: 2380, stock: 5 },
    ],
    reviews: [
      {
        id: 'rev-dhb-1',
        author: 'عبدالرحمن السقاف',
        rating: 5,
        date: '2026-11-15',
        comment: {
          ar: 'عسل الضبايه الجامد أصلي مية بالمية، لونه أبيض عاجي وقوامه يذوب في الفم وطعمه رائع جداً.',
          en: 'Authentic raw solid Al-Dhabayah honey—creamy ivory texture that melts effortlessly with a delicate floral taste.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-razqi-raisins',
    sku: 'HB-RSN-004',
    category: 'raisins',
    subCategory: { ar: 'زبيب رازقي', en: 'Razqi Raisins' },
    name: {
      ar: 'زبيب رازقي ذهبي فاخر',
      en: 'Golden Sun-Dried Razqi Raisins',
    },
    shortDescription: {
      ar: 'حبات طويلة مجففة بالشمس بدون كبريت أو زيوت مضافة',
      en: 'Plump golden heirloom berries dried naturally in open sun',
    },
    description: {
      ar: 'أجود أنواع الزبيب الرازقي الذهبي المستخلص من العنب الأبيض العضوي، مجفف طبيعياً تحت أشعة الشمس في الظلال الجبلية دون أي مواد حافظة أو كبريت، بقوام طري وحلاوة طبيعية صافية.',
      en: 'Heirloom white mountain grapes shade-and-sun dried without sulfur dioxide or glazing oils. Translucent amber flesh with honeyed crunch and clean finish.',
    },
    origin: { ar: 'بساتين صعدة، اليمن', en: 'Saada Vineyards, Yemen' },
    harvestSeason: { ar: 'موسم الخريف · سبتمبر ٢٠٢٦', en: 'Autumn · September 2026' },
    benefits: [
      { ar: 'خالٍ تماماً من ثاني أكسيد الكبريت والزيوت المعدنية', en: '100% sulfite-free and oil-free drying process' },
      { ar: 'غني بالألياف الطبيعية والبوتاسيوم لدعم النشاط الذهني', en: 'Rich in dietary fiber, potassium, and natural boron' },
    ],
    labMetrics: [
      { label: { ar: 'المواد الحافظة', en: 'Sulfites' }, value: '0 ppm' },
      { label: { ar: 'طريقة التجفيف', en: 'Drying' }, value: 'Sun-Cured' },
      { label: { ar: 'الفرز', en: 'Grade' }, value: 'Jumbo AAA' },
    ],
    images: [
      '/src/assets/images/product_razqi_raisins_1794959133789.jpg',
      '/src/assets/images/hero_gift_bundle_1794959132103.jpg',
    ],
    rating: 4.9,
    reviewCount: 118,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'خالٍ من الكبريت ١٠٠٪', en: 'Zero Sulfites' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 36, stock: 80 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 68, compareAtPrice: 78, stock: 62 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 125, compareAtPrice: 145, stock: 31 },
      { id: 'w-3000', label: { ar: '٣ كجم', en: '3kg' }, grams: 3000, price: 355, compareAtPrice: 375, stock: 15 },
      { id: 'w-5000', label: { ar: '٥ كجم', en: '5kg' }, grams: 5000, price: 575, compareAtPrice: 625, stock: 9 },
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'أميرة الدوسري',
        rating: 5,
        date: '2026-11-05',
        comment: {
          ar: 'حبات كبيرة ونظيفة جداً بدون أي طعم مرارة أو زيت، ممتاز للأطفال.',
          en: 'Large, super clean raisins with zero oil residue. My kids love them.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-black-raisins',
    sku: 'HB-RSN-005',
    category: 'raisins',
    subCategory: { ar: 'زبيب أسود', en: 'Black Raisins' },
    name: {
      ar: 'زبيب أسود جبلي عضوي',
      en: 'Organic Mountain Black Raisins',
    },
    shortDescription: {
      ar: 'زبيب داكن لحمي غني بالحديد والأنثوسيانين الطبيعي',
      en: 'Fleshy dark mountain raisins rich in natural iron',
    },
    description: {
      ar: 'زبيب أسود طبيعي من العنب الداكن البري، يتميز بحلاوته العميقة وقيمته الغذائية العالية لدعم مستويات الحديد وتقوية الذاكرة. مثالي للنقع الصباحي أو تناولـه مع اللوز النيئ.',
      en: 'Sun-cured dark heirloom grapes bursting with anthocyanins and iron. Traditional tonic for morning soaking or pairing with raw mountain almonds.',
    },
    origin: { ar: 'مدرجات صعدة والباحة الجبلية', en: 'Saada & Al-Baha Terraces' },
    harvestSeason: { ar: 'موسم الصيف · أغسطس ٢٠٢٦', en: 'Summer · August 2026' },
    benefits: [
      { ar: 'دعم طبيعي لفقر الدم والحديد والتركيز', en: 'Supports healthy iron levels and cognitive stamina' },
      { ar: 'خالي من البذور المزعجة ومفروز يدوياً', en: 'Hand-sorted plump berries with rich natural juice' },
    ],
    labMetrics: [
      { label: { ar: 'السكريات المضافة', en: 'Added Sugar' }, value: '0g' },
      { label: { ar: 'الحديد لكل ١٠٠ جم', en: 'Iron / 100g' }, value: '2.6 mg' },
      { label: { ar: 'الزراعة', en: 'Farming' }, value: 'Organic' },
    ],
    images: [
      '/src/assets/images/product_black_raisins_1794959133443.jpg',
      '/src/assets/images/hero_gift_bundle_1794959132103.jpg',
    ],
    rating: 4.8,
    reviewCount: 83,
    isFeatured: false,
    isBestSeller: true,
    purityBadge: { ar: 'عضوي خالٍ من الإضافات', en: 'Organic Sun-Cured' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 32, stock: 74 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 60, stock: 48 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 112, compareAtPrice: 130, stock: 25 },
      { id: 'w-3000', label: { ar: '٣ كجم', en: '3kg' }, grams: 3000, price: 318, compareAtPrice: 336, stock: 14 },
      { id: 'w-5000', label: { ar: '٥ كجم', en: '5kg' }, grams: 5000, price: 515, compareAtPrice: 560, stock: 8 },
    ],
    reviews: [
      {
        id: 'rev-blk-1',
        author: 'سلوى العمودي',
        rating: 5,
        date: '2026-10-21',
        comment: {
          ar: 'زبيب أسود طري ولذيذ جداً بدون بذور مزعجة، ممتاز مع المكسرات.',
          en: 'Plump, sweet black mountain raisins with clean taste—great paired with almonds.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-almonds-baladi',
    sku: 'HB-ALM-006',
    category: 'almonds',
    subCategory: { ar: 'لوز بلدي نيئ', en: 'Raw Heritage Almonds' },
    name: {
      ar: 'لوز بلدي عضوي نيئ ومحمص بملح البحر',
      en: 'Heritage Organic Raw & Sea-Salt Almonds',
    },
    shortDescription: {
      ar: 'حبات كاملة مقرمشة غنية بفيتامين E والدهون الصحية',
      en: 'Crisp whole heritage kernels rich in vitamin E and protein',
    },
    description: {
      ar: 'لوز بلدي فاخر مقشور حديثاً، متوفر بالتحميص البطيء الخفيف مع رشة ملح بحري طبيعي أو نيئاً كما هو من الشجرة للحفاظ على زيوته العطرية النقية وقرمشته الأصيلة.',
      en: 'Freshly shelled whole heritage almonds from mountain orchards. Slow-roasted in small batches without seed oils or preserved completely raw for maximum crunch and vitamin E.',
    },
    origin: { ar: 'بساتين خولان الجبلية، اليمن', en: 'Khawlan Orchards, Yemen' },
    harvestSeason: { ar: 'موسم الخريف · أكتوبر ٢٠٢٦', en: 'Autumn · October 2026' },
    benefits: [
      { ar: 'بدون زيوت مهدرجة — تحميص هوائي بطيء', en: 'Zero seed oils — air-roasted in small batches' },
      { ar: '٢١ جم بروتين نباتي وألياف عالية في كل ١٠٠ جم', en: '21g plant protein and heart-healthy monounsaturated fats' },
    ],
    labMetrics: [
      { label: { ar: 'الزيت المضاف', en: 'Added Oil' }, value: '0%' },
      { label: { ar: 'الرطوبة', en: 'Crispness' }, value: '3.8%' },
      { label: { ar: 'الفرز', en: 'Kernel Size' }, value: 'Supreme 20/22' },
    ],
    images: [
      '/src/assets/images/product_organic_almonds_1794959135072.jpg',
      '/src/assets/images/hero_gift_bundle_1794959132103.jpg',
    ],
    rating: 4.9,
    reviewCount: 109,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'تحميص بدون زيوت', en: 'Oil-Free Dry Roasted' },
    weightOptions: [
      { id: 'w-250', label: { ar: '٢٥٠ جم', en: '250g' }, grams: 250, price: 42, stock: 65 },
      { id: 'w-500', label: { ar: '٥٠٠ جم', en: '500g' }, grams: 500, price: 79, compareAtPrice: 89, stock: 42 },
      { id: 'w-1000', label: { ar: '١ كجم', en: '1kg' }, grams: 1000, price: 148, compareAtPrice: 170, stock: 22 },
      { id: 'w-3000', label: { ar: '٣ كجم', en: '3kg' }, grams: 3000, price: 420, compareAtPrice: 444, stock: 14 },
      { id: 'w-5000', label: { ar: '٥ كجم', en: '5kg' }, grams: 5000, price: 685, compareAtPrice: 740, stock: 8 },
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'خالد السبيعي',
        rating: 5,
        date: '2026-11-10',
        comment: {
          ar: 'القرمشة ممتازة واللوز طازج جداً، ما فيه أي حبة متكسرة.',
          en: 'Incredible crunch and fresh aroma, every kernel is whole.',
        },
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-gift-coffret',
    sku: 'HB-BND-007',
    category: 'bundles',
    subCategory: { ar: 'باقات الهدايا', en: 'Gift Bundles' },
    name: {
      ar: 'صندوق ضيافة كنوز دوعن (عسل + زبيب + لوز)',
      en: 'Kunooz Doan Harvest Gift Box',
    },
    shortDescription: {
      ar: 'صندوق خشبي فاخر يجمع السدر والزبيب الرازقي والأسود واللوز مع ملعقة خشبية',
      en: 'Handcrafted wooden gift box with Sidr honey, Razqi & black raisins, almonds & olive dipper',
    },
    description: {
      ar: 'هدية تليق بالذائقة الرفيعة للمناسبات والأعياد والزيارات. يضم عبوة عسل سدر ملكي مع ثلاثة أطباق فاخرة من الزبيب الرازقي والزبيب الأسود واللوز البلدي داخل صندوق خشبي مبطن بالكتان.',
      en: 'A signature artisanal gift presentation featuring Royal Sidr Honey paired with sun-dried Razqi raisins, black mountain raisins, and roasted heritage almonds inside a keepsake wooden chest.',
    },
    origin: { ar: 'دوعن والعصيمات وصعدة، اليمن', en: 'Doan, Usaimat & Saada, Yemen' },
    harvestSeason: { ar: 'موسم الخريف · نوفمبر ٢٠٢٦', en: 'Autumn · November 2026' },
    benefits: [
      { ar: 'تغليف هدايا خشبي فاخر مع بطاقة إهداء مجانية', en: 'Includes wooden chest packaging and personalized gift note' },
      { ar: 'توفير ١٨٪ مقارنة بشراء كل منتج منفرداً', en: 'Save 18% vs purchasing individual pantry jars' },
    ],
    labMetrics: [
      { label: { ar: 'عدد الأصناف', en: 'Items Included' }, value: '4 + Dipper' },
      { label: { ar: 'التغليف', en: 'Box' }, value: 'Solid Oak' },
      { label: { ar: 'الضمان', en: 'Purity Seal' }, value: 'Certified' },
    ],
    images: [
      '/src/assets/images/hero_gift_bundle_1794959132103.jpg',
      '/src/assets/images/product_sidr_jar_1794959132616.jpg',
    ],
    rating: 5.0,
    reviewCount: 64,
    isFeatured: true,
    isBestSeller: true,
    purityBadge: { ar: 'باقة ضيافة فاخرة', en: 'Luxury Gift Edition' },
    weightOptions: [
      { id: 'w-250', label: { ar: 'صندوق قياسي (١ كجم إجمالي)', en: 'Classic Box (1kg total)' }, grams: 1000, price: 245, compareAtPrice: 295, stock: 19 },
      { id: 'w-500', label: { ar: 'صندوق عائلي (١.٧٥ كجم إجمالي)', en: 'Grand Family Box (1.75kg)' }, grams: 1750, price: 390, compareAtPrice: 465, stock: 10 },
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'نورة العتيبي',
        rating: 5,
        date: '2026-11-12',
        comment: {
          ar: 'قدمته هدية لوالدي وكان الترتيب وجودة العسل والمكسرات فوق الوصف.',
          en: 'Gifted this to my parents—presentation and quality exceeded expectations.',
        },
        verifiedPurchase: true,
      },
    ],
  },
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    code: 'HONEY15',
    type: 'percent',
    value: 15,
    minOrder: 150,
    description: { ar: 'خصم ١٥٪ على الطلبات فوق ١٥٠ ر.ي', en: '15% off orders over 150 YER' },
    active: true,
  },
  {
    code: 'BUSTAN10',
    type: 'percent',
    value: 10,
    minOrder: 0,
    description: { ar: 'خصم ١٠٪ ترحيبي على جميع المنتجات', en: '10% welcome discount storewide' },
    active: true,
  },
  {
    code: 'WELCOME20',
    type: 'fixed',
    value: 20,
    minOrder: 100,
    description: { ar: 'خصم ٢٠ ر.ي على أول طلب فوق ١٠٠ ر.ي', en: '20 YER off orders above 100 YER' },
    active: true,
  },
];

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'rew-voucher-25',
    type: 'discount',
    title: { ar: 'قسيمة خصم ٢٥ ر.ي', en: '25 YER Discount Voucher' },
    description: {
      ar: 'تُطبق فوراً في سلة التسوق على أي طلب بقيمة ١٠٠ ر.ي فأكثر',
      en: 'Instant cart voucher valid on orders of 100 YER or more',
    },
    pointsCost: 250,
    discountAmount: 25,
    minOrderAmount: 100,
    stock: 999,
  },
  {
    id: 'rew-voucher-60',
    type: 'discount',
    title: { ar: 'قسيمة خصم ٦٠ ر.ي', en: '60 YER Reserve Voucher' },
    description: {
      ar: 'خصم حصري لأعضاء الولاء على الطلبات بقيمة ٢٠٠ ر.ي فأكثر',
      en: 'Exclusive loyalty discount on orders of 200 YER or more',
    },
    pointsCost: 500,
    discountAmount: 60,
    minOrderAmount: 200,
    stock: 999,
  },
  {
    id: 'rew-prod-mini-sidr',
    type: 'exclusive_product',
    title: { ar: 'عبوة تذوق عسل سدر ملكي (١٢٠ جم)', en: 'Exclusive Mini Royal Sidr Jar (120g)' },
    description: {
      ar: 'إصدار حصري لأعضاء برنامج الولاء غير متاح للبيع المباشر',
      en: 'Member-exclusive tasting jar not sold in the public catalog',
    },
    pointsCost: 400,
    productImage: '/src/assets/images/product_sidr_jar_1794959132616.jpg',
    weightLabel: { ar: '١٢٠ جم · هدية ولاء', en: '120g · Member Gift' },
    stock: 25,
  },
  {
    id: 'rew-prod-almonds-reserve',
    type: 'exclusive_product',
    title: { ar: 'علبة لوز بلدي محمص بالعسل (٢٠٠ جم)', en: 'Honey-Roasted Heritage Almonds (200g)' },
    description: {
      ar: 'لوز بلدي محمص على نار هادئة ومغلف برحيق السدر النقي',
      en: 'Small-batch heritage almonds glazed in pure highland blossom honey',
    },
    pointsCost: 350,
    productImage: '/src/assets/images/product_organic_almonds_1794959135072.jpg',
    weightLabel: { ar: '٢٠٠ جم · هدية ولاء', en: '200g · Member Gift' },
    stock: 30,
  },
];

export const INITIAL_LOYALTY_SETTINGS: LoyaltyProgramSettings = {
  enabled: true,
  programTitle: { ar: 'برنامج حصاد النقاط', en: 'Kunooz Doan Rewards Hub' },
  programSubtitle: {
    ar: 'اكسب ١ نقطة مقابل كل ١ ر.ي تنفقه، وزد معامل النقاط مع ترقية عضويتك واستبدلها بهدايا وخصومات حصرية.',
    en: 'Earn 1 point per 1 YER spent, boost your multiplier as your tier rises, and redeem exclusive gifts.',
  },
  rewardsSectionTitle: {
    ar: 'المكافآت والمنتجات الحصرية المتاحة للاستبدال',
    en: 'Available Rewards & Exclusive Products',
  },
  earnHint: {
    ar: 'تُضاف النقاط تلقائياً فور تأكيد أي طلب وتُضاعف حسب مستوى عضويتك',
    en: 'Points credit automatically upon order confirmation multiplied by your tier',
  },
  bannerImage: '/src/assets/images/hero_sidr_honey_1794959129456.jpg',
  pointsPerYer: 1,
  tiers: [
    {
      id: 'bronze',
      label: { ar: 'العضوية البرونزية', en: 'Bronze Member' },
      minPoints: 0,
      multiplier: 1.0,
    },
    {
      id: 'silver',
      label: { ar: 'العضوية الفضية', en: 'Silver Member' },
      minPoints: 500,
      multiplier: 1.25,
    },
    {
      id: 'gold',
      label: { ar: 'العضوية الذهبية', en: 'Gold Member' },
      minPoints: 1500,
      multiplier: 1.5,
    },
    {
      id: 'royal',
      label: { ar: 'العضوية الملكية', en: 'Royal Member' },
      minPoints: 3000,
      multiplier: 2.0,
    },
  ],
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8412',
    createdAt: '2026-11-16T14:20:00Z',
    status: 'out_for_delivery',
    items: [
      {
        cartKey: 'prod-sidr-royal_w-500',
        productId: 'prod-sidr-royal',
        weightId: 'w-500',
        name: { ar: 'عسل سدر كنوز دوعن', en: 'Kunooz Doan Mountain Sidr Honey' },
        weightLabel: { ar: '٥٠٠ جم', en: '500g' },
        image: '/src/assets/images/product_sidr_jar_1794959132616.jpg',
        unitPrice: 270,
        quantity: 1,
      },
      {
        cartKey: 'prod-razqi-raisins_w-500',
        productId: 'prod-razqi-raisins',
        weightId: 'w-500',
        name: { ar: 'زبيب رازقي ذهبي فاخر', en: 'Golden Sun-Dried Razqi Raisins' },
        weightLabel: { ar: '٥٠٠ جم', en: '500g' },
        image: '/src/assets/images/product_razqi_raisins_1794959133789.jpg',
        unitPrice: 68,
        quantity: 1,
      },
    ],
    subtotal: 338,
    discount: 0,
    shippingFee: 0,
    total: 338,
    pointsEarned: 338,
    paymentMethod: 'kuraimi',
    paymentDetails: {
      providerLabel: { ar: 'بنك الكريمي الإسلامي', en: 'Al-Kuraimi Islamic Bank' },
      referenceNumber: 'KRM-884210',
    },
    address: {
      fullName: 'أسامة العلي',
      phone: '+966 55 412 8890',
      city: 'الرياض',
      streetAddress: 'حي العليا، طريق الملك فهد، مبنى ١٤',
      buildingNotes: 'الدور الثالث، شقة ٩',
      lat: 24.7136,
      lng: 46.6753,
      shippingScope: 'international',
      countryCode: 'saudi_arabia',
      countryName: { ar: 'السعودية', en: 'Saudi Arabia' },
      postalCode: '12211',
    },
  },
  {
    id: 'ORD-2026-7905',
    createdAt: '2026-10-24T11:05:00Z',
    status: 'delivered',
    items: [
      {
        cartKey: 'prod-almonds-baladi_w-500',
        productId: 'prod-almonds-baladi',
        weightId: 'w-500',
        name: { ar: 'لوز بلدي عضوي نيئ ومحمص بملح البحر', en: 'Heritage Organic Raw & Sea-Salt Almonds' },
        weightLabel: { ar: '٥٠٠ جم', en: '500g' },
        image: '/src/assets/images/product_organic_almonds_1794959135072.jpg',
        unitPrice: 79,
        quantity: 2,
      },
    ],
    subtotal: 158,
    discount: 15.8,
    shippingFee: 25,
    total: 167.2,
    pointsEarned: 167,
    paymentMethod: 'cod',
    promoApplied: 'BUSTAN10',
    address: {
      fullName: 'أسامة العلي',
      phone: '+966 55 412 8890',
      city: 'الرياض',
      streetAddress: 'حي العليا، طريق الملك فهد، مبنى ١٤',
      buildingNotes: 'الدور الثالث، شقة ٩',
      lat: 24.7136,
      lng: 46.6753,
    },
  },
];

export const INITIAL_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: 'ltx-1',
    date: '2026-11-16',
    type: 'earn',
    points: 338,
    description: { ar: 'نقاط مكتسبة من الطلب ORD-2026-8412', en: 'Points earned from Order ORD-2026-8412' },
    orderId: 'ORD-2026-8412',
  },
  {
    id: 'ltx-2',
    date: '2026-10-24',
    type: 'earn',
    points: 167,
    description: { ar: 'نقاط مكتسبة من الطلب ORD-2026-7905', en: 'Points earned from Order ORD-2026-7905' },
    orderId: 'ORD-2026-7905',
  },
  {
    id: 'ltx-3',
    date: '2026-10-01',
    type: 'bonus',
    points: 120,
    description: { ar: 'مكافأة الترحيب بالانضمام لحصاد النقاط', en: 'Welcome bonus to Kunooz Doan Rewards' },
  },
];

export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'notif-dhabayah-new',
    title: {
      ar: 'وصل حديثاً: عسل الضبايه الجامد',
      en: 'New Arrival: Crystallized Al-Dhabayah Honey',
    },
    body: {
      ar: 'توفّر الآن حصاد عسل الضبايه الجامد الطبيعي ١٠٠٪ بكميات محدودة وأحجام متعددة.',
      en: 'Fresh harvest of 100% raw solid Al-Dhabayah mountain honey is now in stock.',
    },
    sentAt: '2026-11-18T08:30:00Z',
    targetSegment: 'all',
    category: 'new_honey',
    productId: 'prod-dhabayah-solid',
    read: false,
  },
  {
    id: 'notif-seasonal-offer',
    title: {
      ar: 'خصومات موسمية حتى ١٨٪ على عسل السدر',
      en: 'Seasonal Discounts up to 18% on Sidr Honey',
    },
    body: {
      ar: 'استفد من عروض الحصاد الموسمية أو استخدم الكود HONEY15 في صفحة العروض.',
      en: 'Explore seasonal harvest deals or apply promo HONEY15 on the Offers page.',
    },
    sentAt: '2026-11-17T14:00:00Z',
    targetSegment: 'all',
    category: 'seasonal_discount',
    targetView: 'offers',
    read: false,
  },
  {
    id: 'notif-1',
    title: { ar: 'وصل حصاد عسل السدر الجديد', en: 'New Royal Sidr Harvest Arrived' },
    body: {
      ar: 'احصل على نقاط ولاء مضاعفة على باقات الهدايا الملكية طوال هذا الأسبوع.',
      en: 'Earn 2x loyalty points on all Royal Gift Coffrets this week.',
    },
    sentAt: '2026-11-16T09:00:00Z',
    targetSegment: 'all',
    category: 'loyalty',
    targetView: 'profile',
    read: true,
  },
];

export const INTERNATIONAL_COUNTRIES: InternationalCountryOption[] = [
  {
    id: 'saudi_arabia',
    name: { ar: 'السعودية', en: 'Saudi Arabia' },
    shippingFee: 120,
    estimatedDays: { ar: '٣ - ٥ أيام عمل', en: '3–5 business days' },
    carrier: { ar: 'شحن جوي سريع (DHL / أرامكس)', en: 'Air Express (DHL / Aramex)' },
  },
  {
    id: 'oman',
    name: { ar: 'عمان', en: 'Oman' },
    shippingFee: 130,
    estimatedDays: { ar: '٣ - ٥ أيام عمل', en: '3–5 business days' },
    carrier: { ar: 'شحن جوي سريع (DHL / أرامكس)', en: 'Air Express (DHL / Aramex)' },
  },
  {
    id: 'egypt',
    name: { ar: 'مصر', en: 'Egypt' },
    shippingFee: 160,
    estimatedDays: { ar: '٥ - ٧ أيام عمل', en: '5–7 business days' },
    carrier: { ar: 'شحن جوي دولي مغلف حرارياً', en: 'Thermal-Sealed Air Freight' },
  },
  {
    id: 'usa',
    name: { ar: 'أمريكا', en: 'USA' },
    shippingFee: 240,
    estimatedDays: { ar: '٦ - ٩ أيام عمل', en: '6–9 business days' },
    carrier: { ar: 'DHL Express International', en: 'DHL Express International' },
  },
  {
    id: 'indonesia',
    name: { ar: 'إندونيسيا', en: 'Indonesia' },
    shippingFee: 190,
    estimatedDays: { ar: '٥ - ٨ أيام عمل', en: '5–8 business days' },
    carrier: { ar: 'DHL Express International', en: 'DHL Express International' },
  },
  {
    id: 'uk',
    name: { ar: 'بريطانيا', en: 'United Kingdom' },
    shippingFee: 220,
    estimatedDays: { ar: '٥ - ٨ أيام عمل', en: '5–8 business days' },
    carrier: { ar: 'DHL Express International', en: 'DHL Express International' },
  },
  {
    id: 'other',
    name: { ar: 'أخرى', en: 'Other' },
    shippingFee: 250,
    estimatedDays: { ar: '٧ - ١٢ يوم عمل', en: '7–12 business days' },
    carrier: { ar: 'شحن دولي مخصص', en: 'Custom International Courier' },
  },
];

export const INITIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'offer-sidr-1kg',
    title: {
      ar: 'عرض حصاد سدر كنوز دوعن (١ كجم)',
      en: 'Kunooz Doan Sidr Harvest Deal (1kg)',
    },
    subtitle: {
      ar: 'خصم مباشر ١٨٪ على عبوة الكيلو من عسل السدر الدوعني الفاخر المفحوص مخبرياً.',
      en: 'Direct 18% savings on the 1kg lab-certified Doan Sidr Honey jar.',
    },
    badgeText: { ar: 'عرض الأسبوع · وفر ١١٠ ر.ي', en: 'Deal of the Week · Save 110 YER' },
    productId: 'prod-sidr-royal',
    weightId: 'w-1000',
    offerPrice: 490,
    originalPrice: 600,
    promoCode: 'HONEY15',
    endsAtLabel: { ar: 'ساري حتى نهاية الشهر', en: 'Valid until month end' },
    active: true,
  },
  {
    id: 'offer-usaimi-royal',
    title: {
      ar: 'باقة السدر العصيمي الملكي (١ كجم)',
      en: 'Royal Usaimi Sidr Special (1kg)',
    },
    subtitle: {
      ar: 'قطفة الخريف الجديدة من مناحل العصيمات بسعر تفضيلي خاص لمتجر كنوز دوعن.',
      en: 'Fresh autumn harvest from Al-Usaimat apiaries at a seasonal storewide discount.',
    },
    badgeText: { ar: 'حصاد جديد · وفر ٨٥ ر.ي', en: 'New Harvest · Save 85 YER' },
    productId: 'prod-sidr-usaimi-royal',
    weightId: 'w-1000',
    offerPrice: 475,
    originalPrice: 560,
    endsAtLabel: { ar: 'كمية محدودة من القطفة الأولى', en: 'Limited first-harvest batch' },
    active: true,
  },
  {
    id: 'offer-hospitality-box',
    title: {
      ar: 'عرض صندوق الضيافة الملكي الفاخر',
      en: 'Royal Hospitality Gift Box Offer',
    },
    subtitle: {
      ar: 'صندوق خشبي متكامل يضم عسل السدر والزبيب الرازقي والأسود واللوز البلدي بخصم خاص.',
      en: 'Complete wooden keepsake chest with Sidr honey, Razqi & black raisins, and heritage almonds.',
    },
    badgeText: { ar: 'عرض الهدايا · وفر ٥٠ ر.ي', en: 'Gift Special · Save 50 YER' },
    productId: 'prod-gift-coffret',
    weightId: 'w-250',
    offerPrice: 245,
    originalPrice: 295,
    promoCode: 'BUSTAN10',
    endsAtLabel: { ar: 'شامل بطاقة إهداء وتغليف فاخر', en: 'Includes luxury gift wrapping' },
    active: true,
  },
  {
    id: 'offer-shafi-bulk',
    title: {
      ar: 'عرض التوفير للعسل الشعفي (٢ كجم)',
      en: 'Shafi Highland Honey Value Pack (2kg)',
    },
    subtitle: {
      ar: 'عبوة عائلية ٢ كجم من العسل الشعفي الجبلي الصافي بخصم توفيري كبير.',
      en: 'Family 2kg pack of pure Shafi mountain honey with bulk savings.',
    },
    badgeText: { ar: 'توفير عائلي · وفر ٤٥ ر.ي', en: 'Family Saver · Save 45 YER' },
    productId: 'prod-honey-shafi',
    weightId: 'w-2000',
    offerPrice: 345,
    originalPrice: 390,
    endsAtLabel: { ar: 'متاح للشحن المحلي والدولي', en: 'Eligible for domestic & global shipping' },
    active: true,
  },
];


