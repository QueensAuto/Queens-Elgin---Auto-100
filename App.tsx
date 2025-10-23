

import React, { useState, useEffect, useCallback, useRef, FC, ChangeEvent, FormEvent } from 'react';
import { translations, testimonials as allReviews, faqData, commitmentSlides, bonusStackData, serviceData, whyChooseUsData, benefitsData, serviceAreaData } from './constants';
import type { Language, TFunction, Review, FormData, Step1FormData, Step2FormData, Step3FormData } from './types';

// TypeScript declarations for global libraries
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & {
        'media-id'?: string;
        aspect?: string;
      };
    }
  }
  interface Window {
    lucide: {
      createIcons: (options?: { attrs: { [key: string]: any } }) => void;
    };
    dataLayer: any[];
  }
}

// Reusable hook for translations
const useTranslations = () => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    const userLang = (navigator.language || (navigator as any).userLanguage).split('-')[0];
    const initialLang = savedLang === 'en' || savedLang === 'es' ? savedLang : (userLang === 'es' ? 'es' : 'en');
    setLanguageState(initialLang);
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('preferredLanguage', lang);
    setLanguageState(lang);
  };

  const t: TFunction = useCallback((key: string, replacements?: { [key: string]: string }) => {
    let translation = translations[language][key] || translations.en[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{{${rKey}}}`, replacements[rKey]);
        });
    }
    return translation;
  }, [language]);

  return { language, setLanguage, t };
};

// --- Component Definitions ---

const BackgroundBlobs: FC = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" style={{ animation: 'blob-anim 15s infinite alternate' }}></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" style={{ animation: 'blob-anim 20s infinite alternate-reverse' }}></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" style={{ animation: 'blob-anim 25s infinite alternate' }}></div>
    </div>
);

const ScrollProgressBar: FC = () => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement;
            const st = h.scrollTop || document.body.scrollTop;
            const sh = h.scrollHeight - h.clientHeight;
            setWidth(sh ? (st / sh) * 100 : 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return <div id="scroll-progress" className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#0a79c8] to-purple-400 w-0 z-[60]" style={{ width: `${width}%` }} />;
};

const Header: FC<{ t: TFunction, language: Language, setLanguage: (lang: Language) => void }> = ({ t, language, setLanguage }) => {
    const headerRef = useRef<HTMLElement>(null);
    useEffect(() => {
        let lastY = window.pageYOffset;
        const handleScroll = () => {
            const y = window.pageYOffset;
            if (headerRef.current) {
                if (y > lastY && y > 80) headerRef.current.classList.add('-translate-y-full');
                else headerRef.current.classList.remove('-translate-y-full');
            }
            lastY = y;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header ref={headerRef} id="site-header" className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b bg-black/70 border-white/5 transition-transform duration-300 will-change-transform">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
                <div className="h-full flex items-center justify-between">
                    <a href="#overview" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#7ad4f6] rounded-md">
                        <img src="https://queensautoserviceselgin.com/wp-content/uploads/2024/11/Logo-White.webp" alt="Queens Auto Services Logo" className="h-10 w-auto" />
                    </a>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <button id="lang-en" onClick={() => setLanguage('en')} className={`transition-colors hover:text-[#7ad4f6] ${language === 'en' ? 'font-bold text-white' : 'text-slate-400'}`}>Eng</button>
                            <span className="text-slate-500">|</span>
                            <button id="lang-es" onClick={() => setLanguage('es')} className={`transition-colors hover:text-[#7ad4f6] ${language === 'es' ? 'font-bold text-white' : 'text-slate-400'}`}>Spa</button>
                        </div>
                        <a href="#book" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-100 text-black hover:bg-gray-200 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#7ad4f6]" dangerouslySetInnerHTML={{ __html: t('bookNowNav') }} />
                    </div>
                </div>
            </nav>
        </header>
    );
};

const App: FC = () => {
    const { language, setLanguage, t } = useTranslations();
    const [isDisclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
    const [isExitPopupOpen, setExitPopupOpen] = useState(false);
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.title = 'Queens Auto Service — Plan. Prioritize. Ship.';
        if (window.lucide) {
            window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
        }
    }, [language, isDisclaimerModalOpen, isExitPopupOpen]);

    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]');
            if (anchor && anchor.getAttribute('href') !== '#') {
                const href = anchor.getAttribute('href');
                const targetEl = href ? document.querySelector(href) : null;
                if (targetEl) {
                    e.preventDefault();
                    const headerH = document.getElementById('site-header')?.offsetHeight || 64;
                    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        };
        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !sessionStorage.getItem('exitPopupShown')) {
                setExitPopupOpen(true);
                sessionStorage.setItem('exitPopupShown', 'true');
            }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    return (
        <>
            <BackgroundBlobs />
            <div className="relative z-10">
                <ScrollProgressBar />
                <Header t={t} language={language} setLanguage={setLanguage} />
                <HeroSection t={t} onDetailsClick={() => setDisclaimerModalOpen(true)} />
                <VideoSection />
                <BonusStackSection t={t} />
                <CommitmentSection t={t} />
                <WhyChooseUsSection t={t} />
                <BookingForm t={t} />
                <TestimonialsSection t={t} />
                <AboutUsSection t={t} />
                <BenefitsSection t={t} />
                <ServicesSection t={t} />
                <TeamSection t={t} />
                <ParallaxSection t={t} />
                <ServiceAreaSection t={t} />
                <FaqSection t={t} />
                <Footer t={t} />
                <DisclaimerModal t={t} isOpen={isDisclaimerModalOpen} onClose={() => setDisclaimerModalOpen(false)} />
                <ExitIntentPopup t={t} isOpen={isExitPopupOpen} onClose={() => setExitPopupOpen(false)} />
            </div>
        </>
    );
};

// ... other components would be defined here ...
// For brevity, combining components into App.tsx as per user request.

const HeroSection: FC<{ t: TFunction, onDetailsClick: () => void }> = ({ t, onDetailsClick }) => {
    useEffect(() => {
        const textToHighlight = document.querySelector('.highlight-text');
        if (textToHighlight) {
            setTimeout(() => textToHighlight.classList.add('animate'), 500);
        }
    }, []);

    return (
        <section className="relative overflow-hidden sm:pt-28 pt-24 pb-14 z-20">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-10 lg:gap-16 text-center items-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" dangerouslySetInnerHTML={{ __html: t('heroTitle') }}></h1>
                        <p className="text-lg text-white/70 mx-auto max-w-2xl">{t('heroSubtitle')}</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-white">
                            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                                <p className="font-bold text-2xl text-[#7ad4f6]">$15 OFF</p>
                                <p className="text-sm text-slate-300">{t('offer100')}</p>
                            </div>
                            <div className="bg-black/20 backdrop-blur-sm border-2 border-[#7ad4f6] rounded-lg p-4 text-center transform sm:scale-105 shadow-2xl shadow-[#7ad4f6]/30">
                                <p className="font-bold text-2xl text-[#7ad4f6]">$45 OFF</p>
                                <p className="text-sm text-slate-300">{t('offer300')}</p>
                            </div>
                            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                                <p className="font-bold text-2xl text-[#7ad4f6]">$30 OFF</p>
                                <p className="text-sm text-slate-300">{t('offer200')}</p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col items-center">
                            <a href="#book" className="inline-flex items-center justify-center px-8 py-4 btn-gradient text-white text-lg font-bold rounded-full shadow-lg shadow-[#7ad4f6]/30 hover:shadow-[#7ad4f6]/50 transition-all duration-300">{t('heroCTA')}</a>
                            <p className="mt-2 text-sm text-slate-400">{t('couponSent')}</p>
                            <a href="#" onClick={(e) => { e.preventDefault(); onDetailsClick(); }} className="mt-1 text-xs text-blue-400 underline hover:text-blue-300 transition-colors">{t('seeDetails')}</a>
                        </div>
                        <div className="mt-8 flex items-center space-x-6 justify-center">
                            <div className="flex -space-x-2">
                                <img className="w-10 h-10 rounded-full border-2 border-slate-700" src="https://queensautoserviceselgin.com/wp-content/uploads/2025/05/Lavira-Johnson.png" alt="Happy Customer 1" />
                                <img className="w-10 h-10 rounded-full border-2 border-slate-700" src="https://queensautoserviceselgin.com/wp-content/uploads/2025/08/Chris-Muller.png" alt="Happy Customer 2" />
                                <img className="w-10 h-10 rounded-full border-2 border-slate-700" src="https://queensautoserviceselgin.com/wp-content/uploads/2025/08/Mark-Devino.png" alt="Happy Customer 3" />
                            </div>
                            <p className="text-sm text-slate-400" dangerouslySetInnerHTML={{ __html: t('trustedBy') }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const VideoSection: FC = () => {
    const [showVideo, setShowVideo] = useState(false);
    
    if (showVideo) {
        return (
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="video-facade-container">
                        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                            <iframe className="absolute top-0 left-0 w-full h-full rounded-2xl" src="https://www.youtube.com/embed/tqM-tVObtF0?autoplay=1&rel=0&modestbranding=1" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="video-facade-container" onClick={() => setShowVideo(true)}>
                    <div className="relative cursor-pointer group">
                        <img src="https://img.youtube.com/vi/tqM-tVObtF0/maxresdefault.jpg" alt="Queens Auto Service Sales Video" className="w-full rounded-2xl" />
                        <div className="play-button-overlay rounded-2xl">
                            <div className="play-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const BonusStackSection: FC<{ t: TFunction }> = ({ t }) => (
    <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative p-8 md:p-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">{t('bonusStackTitle')}</h2>
                    <ul className="space-y-4 text-left text-slate-300 max-w-xl mx-auto">
                        {bonusStackData.map(key => (
                             <li key={key} className="flex items-start gap-3 text-lg">
                                <span className="text-cyan-400 text-2xl">✅</span>
                                <span>{t(key)}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-sm text-orange-400 italic font-semibold text-center">{t('bonusStackScarcity')}</p>
                    <div className="mt-8 flex flex-col md:flex-row items-start md:items-center md:justify-center gap-4 md:gap-6 text-slate-400 text-sm max-w-xl mx-auto">
                        <div className="flex items-center"><span className="text-yellow-400 mr-1">⭐</span> 4.5★ Google Rating</div>
                        <div className="flex items-center"><span className="mr-1">🛠️</span> Family-Owned, Serving 25,000+ Customers</div>
                        <div className="flex items-center"><span className="mr-1">🛡️</span> Backed by ProVantage 2yr/24k Warranty</div>
                    </div>
                    <p className="mt-6 text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed text-center" dangerouslySetInnerHTML={{ __html: t('bonusStackDisclaimer') }} />
                </div>
            </div>
        </div>
    </section>
);

const CommitmentSection: FC<{ t: TFunction }> = ({ t }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideCount = commitmentSlides.length;

    const nextSlide = () => setCurrentSlide(s => (s + 1) % slideCount);
    const prevSlide = () => setCurrentSlide(s => (s - 1 + slideCount) % slideCount);

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden bg-gray-900/50 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                                <i data-lucide="layout-dashboard" className="w-4.5 h-4.5"></i>
                            </span>
                            <p className="text-sm">{t('commitmentTitle')}</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/20">
                            <i data-lucide="check-circle-2" className="w-3.5 h-3.5"></i>
                            <span>{t('spotsAvailable')}</span>
                        </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="border-white/10 md:border-r p-8">
                            <h3 className="text-3xl font-semibold text-white">{t('numbersSpeak')}</h3>
                            <p className="text-sm text-gray-400 mt-2">{t('numbersSubtitle')}</p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-lg"><p className="text-xl font-bold">25,000+</p><p className="text-xs text-gray-400">{t('customersServed')}</p></div>
                                <div className="bg-white/5 p-3 rounded-lg"><p className="text-xl font-bold text-[#7ad4f6]"><span className="text-yellow-400">★</span> 4.5-Star</p><p className="text-xs text-gray-400">{t('averageRating')}</p></div>
                                <div className="bg-white/5 p-3 rounded-lg col-span-2"><p className="text-xl font-bold">{t('warrantyMonth')} / 24,000-Mile Warranty</p></div>
                            </div>
                            <div className="mt-4 bg-[#7ad4f6]/10 border border-[#7ad4f6]/20 rounded-lg p-3 flex items-center gap-3">
                                <i data-lucide="shield-check" className="text-[#7ad4f6]"></i>
                                <p className="text-sm text-blue-300 font-medium">{t('nationwideWarranty')}</p>
                            </div>
                        </div>
                        <div className="relative w-full h-full min-h-[300px] md:min-h-full overflow-hidden">
                            <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                {commitmentSlides.map((src, i) => (
                                    <div key={i} className="w-full flex-shrink-0 h-full">
                                        <img src={src} alt={`Auto repair image ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 hover:bg-black/60 transition-colors"><i data-lucide="chevron-left"></i></button>
                            <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 hover:bg-black/60 transition-colors"><i data-lucide="chevron-right"></i></button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                {commitmentSlides.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2.5 h-2.5 rounded-full hover:bg-white transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}></button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const WhyChooseUsSection: FC<{ t: TFunction }> = ({ t }) => (
    <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {whyChooseUsData.map(item => (
                    <div key={item.valueKey} className="border-r border-slate-700 last:border-r-0">
                        <div className="text-3xl sm:text-4xl font-bold text-[#7ad4f6]" dangerouslySetInnerHTML={{ __html: t(item.valueKey) }}></div>
                        <p className="mt-2 text-sm text-slate-400">{t(item.labelKey)}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

{/* FIX START: Defined missing TestimonialsSection component */}
const TestimonialsSection: FC<{ t: TFunction }> = ({ t }) => {
    const [reviews, setReviews] = useState<Review[]>(allReviews.slice(0, 6));
    const [hasMore, setHasMore] = useState(allReviews.length > 6);

    const loadMore = () => {
        setReviews(allReviews);
        setHasMore(false);
    };

    return (
        <section id="reviews" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{t('testimonialsTitle')}</h2>
                    <p className="mt-4 text-lg text-slate-400">{t('testimonialsSubtitle')}</p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="border border-white/10 bg-white/5 backdrop-blur-lg p-6 rounded-2xl flex flex-col shadow-2xl shadow-black/20">
                            <div className="flex-grow text-slate-300">"{review.text}"</div>
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="font-semibold text-white">{review.name}</p>
                                <div className="text-yellow-400 flex items-center mt-1">
                                    ★★★★★
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {hasMore && (
                    <div className="mt-12 text-center">
                        <button onClick={loadMore} className="px-6 py-3 border border-slate-600 text-slate-300 rounded-full hover:bg-slate-800 hover:text-white transition-colors">
                            {t('loadMore')}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};
{/* FIX END */}

const AboutUsSection: FC<{ t: TFunction }> = ({ t }) => (
    <section className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12">
            <div className="order-2 md:order-1 bg-white/5 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl shadow-black/20">
                <p className="text-sm font-bold uppercase text-blue-400">{t('aboutUs')}</p>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mt-2">{t('aboutTitle')}</h2>
                <p className="mt-4 text-slate-300">{t('aboutBody')}</p>
                <p className="mt-8 text-xs text-slate-400 italic">{t('aboutTagline')}</p>
            </div>
            <div className="order-1 md:order-2">
                <p className="text-sm text-slate-300 mb-4 text-center md:text-left" dangerouslySetInnerHTML={{ __html: t('address') }}></p>
                <img src="https://queensautoserviceselgin.com/wp-content/uploads/2025/09/Queens-Auto-Services-Elgin-Front-View-Shop-001.webp" alt="The exterior of Queens Auto Service shop in Elgin." className="rounded-2xl shadow-2xl w-full h-full object-cover" />
            </div>
        </div>
    </section>
);

const BenefitsSection: FC<{ t: TFunction }> = ({ t }) => (
    <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{t('benefitsTitle')}</h2>
                <p className="mt-4 text-lg text-slate-400">{t('benefitsSubtitle')}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefitsData.map(item => (
                    <div key={item.titleKey} className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-black/20">
                        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-[#7ad4f6]/10 text-[#7ad4f6]">
                            <i data-lucide={item.icon} className="w-7 h-7"></i>
                        </div>
                        <h4 className="font-bold text-white mt-4">{t(item.titleKey)}</h4>
                        <p className="mt-1 text-sm text-slate-400">{t(item.bodyKey)}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ServicesSection: FC<{ t: TFunction }> = ({ t }) => (
    <section id="services-after" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <p className="text-sm uppercase tracking-wider text-blue-400">{t('servicesEyebrow')}</p>
                <h2 className="mt-2 text-3xl lg:text-4xl tracking-tight text-white font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{t('servicesTitle')}</h2>
            </div>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceData.map(item => (
                    <div key={item.titleKey} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 shadow-2xl shadow-black/20">
                        <img src={item.imgSrc} alt={t(item.titleKey)} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="text-xl tracking-tight font-semibold text-white">{t(item.titleKey)}</h3>
                            <p className="mt-3 text-sm text-gray-300">{t(item.bodyKey)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TeamSection: FC<{ t: TFunction }> = ({ t }) => (
    <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 md:p-12 shadow-2xl shadow-black/20">
                <div className="order-2 md:order-1">
                    <p className="text-sm font-bold uppercase text-blue-400">{t('teamEyebrow')}</p>
                    <h2 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight text-white">{t('teamTitle')}</h2>
                    <p className="mt-4 text-slate-300">{t('teamBody')}</p>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#7ad4f6]/10 text-[#7ad4f6]"><i data-lucide="wrench" className="w-7 h-7"></i></div>
                        <div>
                            <h4 className="font-semibold text-white">{t('teamBenefitTitle')}</h4>
                            <p className="text-sm text-slate-400">{t('teamBenefitBody')}</p>
                        </div>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <img src="https://queensautoserviceselgin.com/wp-content/uploads/2025/09/Queens-Auto-Services-Elgin-Team-001.webp" alt="The Queens Auto Service Team" className="w-full h-full object-cover rounded-xl shadow-lg" />
                </div>
            </div>
        </div>
    </section>
);

const ParallaxSection: FC<{ t: TFunction }> = ({ t }) => (
    <section className="mt-16 parallax rounded-2xl shadow-2xl py-24 px-8 max-w-7xl mx-auto" style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('https://queensautoserviceselgin.com/wp-content/uploads/2025/05/Queens-Elgin-Front-Desk-002.png')" }}>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{t('parallaxTitle')}</h2>
            <p className="mt-4 text-lg text-slate-200">{t('parallaxBody')}</p>
            <a href="#book" className="mt-8 inline-flex items-center justify-center px-8 py-4 btn-gradient text-white text-lg font-bold rounded-full shadow-lg shadow-[#7ad4f6]/30 hover:shadow-[#7ad4f6]/50 transition-all duration-300">{t('parallaxCTA')}</a>
        </div>
    </section>
);

const ServiceAreaSection: FC<{ t: TFunction }> = ({ t }) => (
    <section className="mt-16 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{t('serviceAreaTitle')}</h2>
                <div className="w-24 h-1 bg-blue-400 mt-4 mb-6"></div>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-slate-300">
                    {serviceAreaData.map(area => <li key={area} className="flex items-center"><i data-lucide="check" className="w-5 h-5 text-blue-400 mr-3"></i>{area}</li>)}
                </ul>
            </div>
            <div><img src="https://queensautoserviceselgin.com/wp-content/uploads/2025/08/Queens-Elgin-map.webp" alt="Map of Queens Auto Service service area" className="w-full rounded-2xl shadow-lg" /></div>
        </div>
    </section>
);

const FaqSection: FC<{ t: TFunction }> = ({ t }) => (
    <section id="faq" className="mt-16 p-6 md:p-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg max-w-7xl mx-auto shadow-2xl shadow-black/20">
        <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{t('faqTitle')}</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-300">{t('faqSubtitle')}</p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
                <details key={index} className="border-b border-slate-700 pb-4 group">
                    <summary className="cursor-pointer flex justify-between items-center text-left text-xl font-semibold text-white group-hover:text-[#7ad4f6] transition-colors">
                        <span>{t(faq.qKey)}</span>
                        <i data-lucide="chevron-down" className="faq-icon w-6 h-6 transform"></i>
                    </summary>
                    <div className="mt-4 text-slate-300" dangerouslySetInnerHTML={{ __html: t(faq.aKey) }} />
                </details>
            ))}
        </div>
        <div className="mt-8 text-center text-slate-300">
            <p>{t('faqStillQuestions')}</p>
            <p className="mt-2">{t('faqContactUs')}</p>
            <a href="tel:+12246353000" className="mt-4 inline-flex items-center justify-center px-8 py-4 btn-gradient text-white text-lg font-bold rounded-full shadow-lg shadow-[#7ad4f6]/30 hover:shadow-[#7ad4f6]/50 transition-all duration-300">{t('contactCTA')}</a>
        </div>
    </section>
);

const Footer: FC<{ t: TFunction }> = ({ t }) => (
    <footer className="mt-16 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Queens Auto Service. All Rights Reserved. | <a href="https://queensautoserviceselgin.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 transition-colors">{t('privacyPolicy')}</a> | <a href="https://queensautoserviceselgin.com/terms-of-use/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 transition-colors">{t('termsOfUse')}</a></p>
            <p className="mt-2">1303 Dundee Ave, Elgin, IL 60120</p>
            <p className="mt-1">{t('callUs')} <a href="tel:+12246353000" className="text-slate-300 hover:text-blue-400 transition-colors">(224) 635-3000</a></p>
        </div>
    </footer>
);

const DisclaimerModal: FC<{ t: TFunction, isOpen: boolean, onClose: () => void }> = ({ t, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="relative max-w-lg w-full bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700"><i data-lucide="x" className="w-5 h-5"></i></button>
                <h3 className="text-xl font-bold text-white mb-4">{t('modalTitle')}</h3>
                <div className="text-sm text-slate-300 space-y-3">
                    <p>{t('modalP1')}</p><p>{t('modalP2')}</p><p>{t('modalP3')}</p>
                </div>
            </div>
        </div>
    );
};

const ExitIntentPopup: FC<{ t: TFunction, isOpen: boolean, onClose: () => void }> = ({ t, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="relative max-w-md w-full bg-slate-900/60 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white" aria-label="Close"><i data-lucide="x" className="w-7 h-7"></i></button>
                <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">{t('popupTitleV2')}</h2>
                <p className="text-base sm:text-lg text-slate-300 text-center mb-6">{t('popupSubtitleV2')}</p>
                <ul className="space-y-3 mb-6 text-slate-300 text-left max-w-md mx-auto">
                    {bonusStackData.map(key => <li key={key} className="flex items-start gap-3"><span className="text-cyan-400 text-xl">✅</span><span>{t(key)}</span></li>)}
                </ul>
                <a href="#book" onClick={onClose} className="inline-flex items-center justify-center px-6 py-3 btn-gradient text-white font-bold rounded-full shadow-lg">{t('popupCTAV2')}</a>
                <p className="mt-3 text-xs text-orange-400 italic text-center font-semibold">{t('popupScarcityV2')}</p>
            </div>
        </div>
    );
};

const BookingForm: FC<{ t: TFunction }> = ({ t }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        symptom: '', 'first-name': '', 'last-name': '', email: '', 'mobile-number': '',
        'car-year': '', 'car-make': '', 'car-model': '', date: '', time: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        const getCookie = (name: string) => document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.[2] || '';
        const getGAClientId = () => {
            const ga = getCookie('_ga');
            return ga ? ga.split('.').slice(2).join('.') : '';
        };
        const params = new URLSearchParams(window.location.search);
        
        setFormData(prev => ({
            ...prev,
            utm_source: params.get('utm_source') || undefined,
            utm_medium: params.get('utm_medium') || undefined,
            utm_campaign: params.get('utm_campaign') || undefined,
            utm_term: params.get('utm_term') || undefined,
            utm_content: params.get('utm_content') || undefined,
            ga_client_id: getGAClientId() || undefined,
            gclid: getCookie('_gcl_au') || undefined,
            fbc: getCookie('_fbc') || undefined,
        }));
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const isStep1Valid = !!formData.symptom;
    const isStep2Valid = formData['first-name'] && formData['last-name'] && formData.email && formData['mobile-number'] && formData['car-year'] && formData['car-make'] && formData['car-model'];
    const isStep3Valid = !!formData.date && !!formData.time;

    const switchStep = (nextStep: number) => {
        setStep(nextStep);
        document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isStep3Valid) return;
        setIsSubmitting(true);

        const uniqueEventId = window.dataLayer?.find((item: any) => item.uniqueEventId)?.uniqueEventId || `gen_${Date.now()}`;
        const formattedPhone = `+1${(formData['mobile-number'] || '').replace(/\D/g, '')}`;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'generate_lead',
            currency: 'USD',
            value: 45,
            user_data: {
                email: formData.email,
                phone_number: formattedPhone,
                address: {
                    first_name: formData['first-name'],
                    last_name: formData['last-name'],
                },
            },
            service_details: {
                lead_type: 'auto_repair_booking',
                symptom: formData.symptom,
                vehicle: `${formData['car-year']} ${formData['car-make']} ${formData['car-model']}`,
            },
        });

        const webhookData = { ...formData, event_id: uniqueEventId, phone: formattedPhone, pageVariant: "general_repair_001", userLanguage: localStorage.getItem('preferredLanguage') || 'en' };

        try {
            const response = await fetch('https://n8n.queensautoservices.com/webhook-test/550c79ed-d8a9-4f0f-a2f7-0c82cfbb9f08', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(webhookData),
            });
            if (response.ok) {
                const data = await response.json();
                if(data.audioUrl) sessionStorage.setItem('customAudioUrl', data.audioUrl);
            }
        } catch (error) {
            console.error('Webhook failed:', error);
        } finally {
            const thankYouUrl = new URL('https://queensautoserviceselgin.com/auto-repair/thank-you.htm');
            Object.entries(webhookData).forEach(([key, value]) => {
                if(value) thankYouUrl.searchParams.append(key, value);
            });
            window.location.href = thankYouUrl.toString();
        }
    };

    const instructionKey = `formStep${step}`;
    
    return (
        <section id="book" className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 sm:p-8 md:p-12 shadow-2xl shadow-black/20">
                <div className="text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{t('formTitle')}</h2>
                    <p className="mt-2 text-lg text-slate-300">{t(instructionKey)}</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 overflow-x-hidden">
                    {/* Render steps conditionally */}
                </form>
            </div>
        </section>
    );
};


export default App;