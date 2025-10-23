
export type Language = 'en' | 'es';

export interface TranslationSet {
  [key: string]: string;
}

export interface Translations {
  en: TranslationSet;
  es: TranslationSet;
}

export type TFunction = (key: string, replacements?: { [key: string]: string }) => string;

export interface Review {
  name: string;
  text: string;
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

// Form data types for the new multi-step form
export interface Step1FormData {
    symptom: string;
}
export interface Step2FormData {
    'first-name': string;
    'last-name': string;
    email: string;
    'mobile-number': string;
    'car-year': string;
    'car-make': string;
    'car-model': string;
}
export interface Step3FormData {
    date: string;
    time: string;
}

export type FormData = Step1FormData & Step2FormData & Step3FormData & {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ga_client_id?: string;
  gclid?: string;
  fbc?: string;
  event_id?: string;
};
