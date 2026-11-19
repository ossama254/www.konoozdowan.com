import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Award, Droplets, Leaf, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

const SLIDES = [
  {
    id: 'slide-honey',
    icon: Droplets,
    image: '/src/assets/images/hero_sidr_honey_1794959132255.jpg',
    kicker: { ar: 'عسل طبيعي ١٠٠٪', en: '100% Raw & Unfiltered' },
    title: {
      ar: 'نقاء العسل الجبلي من مناحلنا المختارة',
      en: 'Pure Mountain Honey from Heritage Apiaries',
    },
    description: {
      ar: 'عسل سدر، سمر، وزهور برية يُستخلص على البارد ويُفحص مخبرياً لضمان خلوّه من أي إضافات.',
      en: 'Single-origin Sidr, Sumra, and Highland Wildflower honeys—cold-extracted and lab-verified for full enzymatic potency.',
    },
  },
  {
    id: 'slide-raisins',
    icon: Leaf,
    image: '/src/assets/images/product_razqi_raisins_1794959133789.jpg',
    kicker: { ar: 'زبيب مجفف بالشمس', en: 'Sun-Cured Without Sulfites' },
    title: {
      ar: 'زبيب رازقي وأسود خالٍ من الكبريت والزيوت',
      en: 'Sun-Dried Razqi & Black Mountain Raisins',
    },
    description: {
      ar: 'حبات عنب عضوية مجففة ببطء تحت أشعة الشمس الجبلية للحفاظ على حلاوتها الطبيعية وقيمتها الغذائية.',
      en: 'Plump organic berries slowly cured under mountain sun with zero preservatives or mineral glazing oils.',
    },
  },
  {
    id: 'slide-almonds',
    icon: Award,
    image: '/src/assets/images/product_organic_almonds_1794959135072.jpg',
    kicker: { ar: 'لوز عضوي وحصاد نقاط', en: 'Heritage Almonds & Rewards' },
    title: {
      ar: 'لوز بلدي مقرمش ومكافآت ولاء مع كل طلب',
      en: 'Crisp Heritage Almonds & Loyalty Rewards',
    },
    description: {
      ar: 'لوز نيئ أو محمص بالهواء بدون زيوت مهدرجة، مع برنامج حصاد النقاط لاستبدال خصومات وهدايا حصرية.',
      en: 'Air-roasted or freshly shelled raw almonds paired with Kunooz Doan Rewards—earn points on every purchase.',
    },
  },
];

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, lang, t } = useStore();
  const [step, setStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const slide = SLIDES[step];
  const Icon = slide.icon;
  const isLast = step === SLIDES.length - 1;

  const handleClose = () => {
    setIsOnboardingOpen(false);
    setStep(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'جولة الترحيب' : 'App Onboarding'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg bg-[#FFFBEB] border border-[#E5DEC9] rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="relative h-64 sm:h-72 bg-amber-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0.3, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full"
            >
              <ProductImage
                src={slide.image}
                alt={t(slide.title)}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="absolute top-4 start-4 w-14 h-14 rounded-2xl bg-white/95 p-1 shadow-md border border-[#E5DEC9] flex items-center justify-center">
            <img
              src="/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg"
              alt={lang === 'ar' ? 'شعار كنوز دوعن' : 'Kunooz Doan Logo'}
              className="w-full h-full object-contain"
            />
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 end-4 min-h-[44px] min-w-[44px] rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 start-5 end-5 flex items-center gap-2 text-amber-200 text-xs font-medium">
            <Icon className="w-4 h-4" />
            <span>{t(slide.kicker)}</span>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1F2937] leading-snug">
              {t(slide.title)}
            </h2>
            <p className="text-sm sm:text-base text-[#1F2937]/75 leading-relaxed">
              {t(slide.description)}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2" role="tablist">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === step ? 'w-7 bg-[#D97706]' : 'w-2 bg-[#D97706]/25 hover:bg-[#D97706]/50'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] px-4 text-sm font-medium text-[#1F2937]/70 hover:text-[#1F2937] transition-colors whitespace-nowrap"
              >
                {lang === 'ar' ? 'تخطي' : 'Skip'}
              </button>

              <button
                type="button"
                onClick={() => (isLast ? handleClose() : setStep((s) => s + 1))}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>
                  {isLast
                    ? lang === 'ar'
                      ? 'ابدأ التسوق'
                      : 'Start Shopping'
                    : lang === 'ar'
                    ? 'التالي'
                    : 'Next'}
                </span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
