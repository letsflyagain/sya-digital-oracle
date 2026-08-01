"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // 로컬 스토리지 확인
    const savedLang = localStorage.getItem("sya-lang") as Language | null;
    if (savedLang) {
      setLanguageState(savedLang);
    } else {
      // 클라이언트 마운트 후 언어 감지
      const browserLang = navigator.language.split("-")[0];
      const initialLang = browserLang === "ko" ? "ko" : "en";
      setLanguageState(initialLang);
      localStorage.setItem("sya-lang", initialLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sya-lang", lang);
  };
  
  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const newLang = prev === "ko" ? "en" : "ko";
      localStorage.setItem("sya-lang", newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
