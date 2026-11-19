import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Eye,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AboutPillarIcon } from '../types/store';

const PILLAR_ICON_MAP: Record<AboutPillarIcon, React.FC<{ className?: string }>> = {
  eye: Eye,
  compass: Compass,
  target: Target,
  shield: ShieldCheck,
  award: Award,
  heart: Heart,
};

export const AboutContactView: React.FC = () => {
  const { lang, setView, showToast, aboutSettings, submitContactMessage } = useStore();

  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField((prev) => (prev === key ? null : prev)), 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderContact.trim() || !messageBody.trim()) {
      setFormError(
        lang === 'ar'
          ? 'يرجى إدخال الاسم ووسيلة التواصل ونص الرسالة'
          : 'Please fill in your name, contact detail, and message'
      );
      return;
    }
    setFormError(null);
    submitContactMessage({
      senderName: senderName.trim(),
      senderContact: senderContact.trim(),
      subject: subject.trim(),
      messageBody: messageBody.trim(),
    });
    setSentSuccess(true);
    showToast(
      lang === 'ar'
        ? 'تم استلام رسالتك بنجاح! سيتواصل معك فريق كنوز دوعن قريباً.'
        : 'Message received! The Kunooz Doan team will reply shortly.'
    );
    setSenderName('');
    setSenderContact('');
    setSubject('');
    setMessageBody('');
  };

  const activePillars = aboutSettings.pillars.filter((p) => p.active);

  return (
    <div className="space-y-8 pb-12">
      {/* About Us Hero */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E5DEC9] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div
          className={`${aboutSettings.showHeroLogoBox ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-3`}
        >
          <div className="text-xs font-semibold text-[#4D7C0F] inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{aboutSettings.heroKicker[lang]}</span>
          </div>
          <h1 className="font-display-serif text-2xl sm:text-3xl font-bold text-[#1F2937] leading-tight text-balance">
            {aboutSettings.heroTitle[lang]}
          </h1>
          <p className="text-sm sm:text-base text-[#1F2937]/80 leading-relaxed max-w-2xl">
            {aboutSettings.heroDescription[lang]}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setView('home')}
              className="min-h-[42px] px-5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              {aboutSettings.heroPrimaryCta[lang]}
            </button>
            <button
              type="button"
              onClick={() => setView('offers')}
              className="min-h-[42px] px-5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] hover:bg-amber-50 text-[#1F2937] text-xs sm:text-sm font-semibold transition-colors"
            >
              {aboutSettings.heroSecondaryCta[lang]}
            </button>
          </div>
        </div>

        {aboutSettings.showHeroLogoBox && (
          <div className="lg:col-span-4 flex justify-center">
            <div className="p-6 rounded-3xl bg-[#FFFBEB] border border-[#E5DEC9] flex flex-col items-center text-center gap-2 w-full max-w-xs">
              <img
                src={
                  aboutSettings.logoImage ||
                  '/assets/aistudio/_______________2027_____2__-_Copy_de345892.jpg'
                }
                alt={lang === 'ar' ? 'شعار كنوز دوعن' : 'Kunooz Doan Logo'}
                className="w-32 h-32 object-contain rounded-2xl mix-blend-multiply"
              />
              <span className="text-xs font-semibold text-[#1F2937]/70">
                {aboutSettings.logoCaption[lang]}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Vision, Mission, Goals */}
      {aboutSettings.showPillarsSection && activePillars.length > 0 && (
        <section aria-label={lang === 'ar' ? 'الرؤية والرسالة والأهداف' : 'Vision, Mission & Goals'}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activePillars.map((pillar) => {
              const Icon = PILLAR_ICON_MAP[pillar.iconKey] ?? Eye;
              return (
                <div
                  key={pillar.id}
                  className="p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-3 flex flex-col"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-center text-[#D97706]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1F2937]">{pillar.title[lang]}</h2>
                  <p className="text-sm text-[#1F2937]/75 leading-relaxed">{pillar.text[lang]}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Contact Us Section */}
      {aboutSettings.showContactSection && (
        <section
          id="contact-us"
          aria-label={aboutSettings.contactHeading[lang]}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Direct Contact Info */}
          <div
            className={`${aboutSettings.showContactForm ? 'lg:col-span-5' : 'lg:col-span-12'} p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-5`}
          >
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D97706]" />
                <span>{aboutSettings.contactHeading[lang]}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#1F2937]/65">
                {aboutSettings.contactSubtitle[lang]}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#D97706] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#1F2937]/60">
                      {aboutSettings.phoneLabel[lang]}
                    </div>
                    <div dir="ltr" className="text-sm font-bold text-[#1F2937] tabular-nums">
                      {aboutSettings.phoneDisplay}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('phone', aboutSettings.phoneCopyValue || aboutSettings.phoneDisplay)}
                  className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                >
                  {copiedField === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-[#4D7C0F]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                  )}
                  <span>
                    {copiedField === 'phone'
                      ? lang === 'ar'
                        ? 'تم النسخ'
                        : 'Copied'
                      : lang === 'ar'
                      ? 'نسخ'
                      : 'Copy'}
                  </span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#D97706] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#1F2937]/60">
                      {aboutSettings.emailLabel[lang]}
                    </div>
                    <div dir="ltr" className="text-sm font-bold text-[#1F2937] truncate">
                      {aboutSettings.emailValue}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('email', aboutSettings.emailValue)}
                  className="min-h-[36px] px-3 rounded-xl bg-white border border-[#E5DEC9] hover:border-[#D97706] text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-[#4D7C0F]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                  )}
                  <span>
                    {copiedField === 'email'
                      ? lang === 'ar'
                        ? 'تم النسخ'
                        : 'Copied'
                      : lang === 'ar'
                      ? 'نسخ'
                      : 'Copy'}
                  </span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#4D7C0F] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-[#1F2937]/60">
                    {aboutSettings.locationLabel[lang]}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                    {aboutSettings.locationValue[lang]}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E5DEC9] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#1F2937] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-[#1F2937]/60">
                    {aboutSettings.hoursLabel[lang]}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                    {aboutSettings.hoursValue[lang]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {aboutSettings.showContactForm && (
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E5DEC9] space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1F2937]">
                  {aboutSettings.formHeading[lang]}
                </h3>
                <p className="text-xs text-[#1F2937]/65">
                  {aboutSettings.formSubtitle[lang]}
                </p>
              </div>

              {sentSuccess && (
                <div className="p-4 rounded-2xl bg-lime-50 border border-[#4D7C0F]/30 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#4D7C0F]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'تم إرسال رسالتك بنجاح! سيتواصل معك فريق خدمة العملاء في أقرب وقت.'
                      : 'Your message has been sent! Our support team will contact you shortly.'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <label className="space-y-1 font-semibold text-[#1F2937]">
                  <span>{lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</span>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => {
                      setSenderName(e.target.value);
                      setSentSuccess(false);
                    }}
                    placeholder={lang === 'ar' ? 'أحمد محمد' : 'Your name'}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                  />
                </label>

                <label className="space-y-1 font-semibold text-[#1F2937]">
                  <span>{lang === 'ar' ? 'رقم الجوال أو البريد الإلكتروني *' : 'Phone or Email *'}</span>
                  <input
                    type="text"
                    required
                    value={senderContact}
                    onChange={(e) => {
                      setSenderContact(e.target.value);
                      setSentSuccess(false);
                    }}
                    placeholder={lang === 'ar' ? '77xxxxxxx أو email@example.com' : 'Phone or email'}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                  />
                </label>

                <label className="sm:col-span-2 space-y-1 font-semibold text-[#1F2937]">
                  <span>{lang === 'ar' ? 'الموضوع (اختياري)' : 'Subject (Optional)'}</span>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={
                      lang === 'ar'
                        ? 'استفسار عن عسل السدر، شحن دولي، أو طلب خاص...'
                        : 'Inquiry about Sidr honey, shipping, or wholesale...'
                    }
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                  />
                </label>

                <label className="sm:col-span-2 space-y-1 font-semibold text-[#1F2937]">
                  <span>{lang === 'ar' ? 'نص الرسالة *' : 'Message *'}</span>
                  <textarea
                    rows={4}
                    required
                    value={messageBody}
                    onChange={(e) => {
                      setMessageBody(e.target.value);
                      setSentSuccess(false);
                    }}
                    placeholder={
                      lang === 'ar'
                        ? 'اكتب تفاصيل استفسارك هنا...'
                        : 'Write your message details here...'
                    }
                    className="w-full p-3.5 rounded-xl border border-[#E5DEC9] bg-[#FFFBEB] text-sm font-normal focus:outline-none focus:border-[#D97706]"
                  />
                </label>
              </div>

              {formError && <p className="text-xs text-red-600 font-semibold">{formError}</p>}

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[46px] px-7 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{aboutSettings.formSubmitLabel[lang]}</span>
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
};
