"use client";

import { useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { useTelegram } from "@/hooks/use-telegram";

// Configure i18n
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../locales/${language}/${namespace}.json`)
    )
  )
  .init({
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

/**
 * Provider component for internationalization
 */
export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tg } = useTelegram();
  const [initialized, setInitialized] = useState(false);

  // Detect Telegram's language and set it
  useEffect(() => {
    if (tg?.initDataUnsafe?.user?.language_code) {
      i18n.changeLanguage(tg.initDataUnsafe.user.language_code);
    }
    setInitialized(true);
  }, [tg]);

  if (!initialized) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
