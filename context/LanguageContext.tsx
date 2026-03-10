import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'English' | '中文' | 'Français';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  'English': {
    'Meals': 'Meals',
    'Followers': 'Followers',
    'Rating': 'Rating',
    'Following': 'Following',
    'Follow': 'Follow',
    'Chat': 'Chat',
    'My Events': 'My Events',
    'No upcoming meals yet.': 'No upcoming meals yet.',
    'My Favorite List': 'My Favorite List',
    'Location Settings': 'Location Settings',
    'On': 'On',
    'Language Settings': 'Language Settings',
    'Privacy & Security': 'Privacy & Security',
    'App Settings': 'App Settings',
    'Sign Out': 'Sign Out',
    'Spicy food lover 🌶️ • San Francisco': 'Spicy food lover 🌶️ • San Francisco'
  },
  '中文': {
    'Meals': '聚餐',
    'Followers': '粉丝',
    'Rating': '评分',
    'Following': '已关注',
    'Follow': '关注',
    'Chat': '聊天',
    'My Events': '我的活动',
    'No upcoming meals yet.': '暂无即将到来的聚餐。',
    'My Favorite List': '我的收藏',
    'Location Settings': '位置设置',
    'On': '开启',
    'Language Settings': '语言设置',
    'Privacy & Security': '隐私与安全',
    'App Settings': '应用设置',
    'Sign Out': '退出登录',
    'Spicy food lover 🌶️ • San Francisco': '辣味爱好者 🌶️ • 旧金山'
  },
  'Français': {
    'Meals': 'Repas',
    'Followers': 'Abonnés',
    'Rating': 'Note',
    'Following': 'Abonné',
    'Follow': 'Suivre',
    'Chat': 'Discuter',
    'My Events': 'Mes Événements',
    'No upcoming meals yet.': 'Aucun repas à venir.',
    'My Favorite List': 'Ma Liste de Favoris',
    'Location Settings': 'Paramètres de Localisation',
    'On': 'Activé',
    'Language Settings': 'Paramètres de Langue',
    'Privacy & Security': 'Confidentialité et Sécurité',
    'App Settings': 'Paramètres de l\'Application',
    'Sign Out': 'Déconnexion',
    'Spicy food lover 🌶️ • San Francisco': 'Amateur de plats épicés 🌶️ • San Francisco'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
