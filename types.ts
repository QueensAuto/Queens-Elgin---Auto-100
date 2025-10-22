
export type Language = 'en' | 'es';

export interface TranslationSet {
  [key: string]: string;
}

export interface Translations {
  en: TranslationSet;
  es: TranslationSet;
}

export type TFunction = (key: string) => string;

export interface Review {
  name: string;
  text: string;
}

export interface FormData {
  'first-name': string;
  'last-name': string;
  email: string;
  'mobile-number': string;
  'vehicle-year': string;
  'vehicle-make': string;
  'vehicle-model': string;
  date: string;
  time: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ga_client_id?: string;
  gclid?: string;
  fbc?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  event_id?: string;
}

export interface FormValidity {
  'first-name': boolean | null;
  'last-name': boolean | null;
  email: boolean | null;
  'mobile-number': boolean | null;
  'vehicle-make': boolean | null;
  'vehicle-model': boolean | null;
}

export interface FaqItem {
  qKey: string;
  aKey: string;
}

export interface BonusItem {
    icon: string;
    titleKey: string;
    descKey: string;
}
