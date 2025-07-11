"use client";

import React, { createContext, useState, useContext, useMemo } from 'react';

type Language = 'en' | 'hi' | 'ta';

const translations = {
  en: {
    // General
    appName: 'Rakshak',
    loading: 'Loading...',
    submit: 'Submit',

    // Sidebar
    dashboard: 'Dashboard',
    cropSuggestions: 'Crop Suggestions',
    agronomicTips: 'Agronomic Tips',
    dataVisualization: 'Data Visualization',

    // Dashboard
    welcome: 'Welcome, Farmer!',
    dashboardDescription: 'Here is an overview of your farm\'s current status.',
    weather: 'Real-Time Weather',
    marketFactors: 'Market Factors',
    geographicalConditions: 'Geographical Conditions',
    currentTemp: 'Current: 28°C, Sunny',
    soilPh: 'Soil pH',
    elevation: 'Elevation',

    // Crop Suggestions
    cropSuggestionsTitle: 'Smart Crop Suggestions',
    cropSuggestionsDescription: 'Fill in the details below to get AI-powered crop recommendations.',
    farmLocation: 'Farm Location',
    farmLocationPlaceholder: 'e.g., Latitude, Longitude, or Address',
    weatherPatterns: 'Weather Patterns',
    weatherPatternsPlaceholder: 'Describe recent and expected weather...',
    soilData: 'Soil Data',
    soilDataPlaceholder: 'Describe soil composition and health...',
    marketTrends: 'Market Trends',
    marketTrendsPlaceholder: 'Describe current crop market trends...',
    getSuggestions: 'Get Suggestions',
    recommendations: 'Our Recommendations',
    
    // Agronomic Tips
    agronomicTipsTitle: 'AI-Driven Agronomic Tips',
    agronomicTipsDescription: 'Get AI-driven tips to improve your crop health and yield.',
    cropType: 'Crop Type',
    cropTypePlaceholder: 'e.g., Corn, Wheat, Soybeans',
    farmConditions: 'Farm Conditions',
    farmConditionsPlaceholder: 'Describe current farm conditions...',
    getTips: 'Get Tips',
    tips: 'Agronomic Tips',

    // Data Visualization
    dataVisualizationTitle: 'Historical Data Insights',
    dataVisualizationDescription: 'Track weather, soil, and market trends over time.',
    weatherHistory: 'Weather History',
    soilComposition: 'Soil Composition',
    marketTrendsChart: 'Market Trends (Price/Quintal)',

  },
  hi: {
    // General
    appName: 'रक्षक',
    loading: 'लोड हो रहा है...',
    submit: 'प्रस्तुत करें',
    
    // Sidebar
    dashboard: 'डैशबोर्ड',
    cropSuggestions: 'फसल सुझाव',
    agronomicTips: 'कृषि संबंधी सुझाव',
    dataVisualization: 'डेटा विज़ुअलाइज़ेशन',

    // Dashboard
    welcome: 'किसान, आपका स्वागत है!',
    dashboardDescription: 'यहां आपके खेत की वर्तमान स्थिति का अवलोकन है।',
    weather: 'वास्तविक समय का मौसम',
    marketFactors: 'बाजार कारक',
    geographicalConditions: 'भौगोलिक स्थितियाँ',
    currentTemp: 'वर्तमान: 28°C, धूप',
    soilPh: 'मिट्टी का पीएच',
    elevation: 'ऊंचाई',
    
    // Crop Suggestions
    cropSuggestionsTitle: 'स्मार्ट फसल सुझाव',
    cropSuggestionsDescription: 'एआई-संचालित फसल सिफारिशें प्राप्त करने के लिए नीचे दिए गए विवरण भरें।',
    farmLocation: 'खेत का स्थान',
    farmLocationPlaceholder: 'उदा., अक्षांश, देशांतर, या पता',
    weatherPatterns: 'मौसम पैटर्न',
    weatherPatternsPlaceholder: 'हाल के और अपेक्षित मौसम का वर्णन करें...',
    soilData: 'मिट्टी का डेटा',
    soilDataPlaceholder: 'मिट्टी की संरचना और स्वास्थ्य का वर्णन करें...',
    marketTrends: 'बाजार के रुझान',
    marketTrendsPlaceholder: 'वर्तमान फसल बाजार के रुझानों का वर्णन करें...',
    getSuggestions: 'सुझाव प्राप्त करें',
    recommendations: 'हमारी सिफारिशें',

    // Agronomic Tips
    agronomicTipsTitle: 'एआई-संचालित कृषि संबंधी सुझाव',
    agronomicTipsDescription: 'अपनी फसल के स्वास्थ्य और उपज में सुधार के लिए एआई-संचालित सुझाव प्राप्त करें।',
    cropType: 'फसल का प्रकार',
    cropTypePlaceholder: 'उदा., मक्का, गेहूं, सोयाबीन',
    farmConditions: 'खेत की स्थितियाँ',
    farmConditionsPlaceholder: 'वर्तमान खेत की स्थितियों का वर्णन करें...',
    getTips: 'सुझाव प्राप्त करें',
    tips: 'कृषि संबंधी सुझाव',
    
    // Data Visualization
    dataVisualizationTitle: 'ऐतिहासिक डेटा अंतर्दृष्टि',
    dataVisualizationDescription: 'समय के साथ मौसम, मिट्टी और बाजार के रुझानों को ट्रैक करें।',
    weatherHistory: 'मौसम का इतिहास',
    soilComposition: 'मिट्टी की संरचना',
    marketTrendsChart: 'बाजार के रुझान (मूल्य/क्विंटल)',
  },
  ta: {
    // General
    appName: 'ரக்ஷக்',
    loading: 'ஏற்றுகிறது...',
    submit: 'சமர்ப்பிக்கவும்',
    
    // Sidebar
    dashboard: 'டாஷ்போர்டு',
    cropSuggestions: 'பயிர் பரிந்துரைகள்',
    agronomicTips: 'வேளாண் குறிப்புகள்',
    dataVisualization: 'தரவு காட்சிப்படுத்தல்',

    // Dashboard
    welcome: 'விவசாயி, வருக!',
    dashboardDescription: 'உங்கள் பண்ணையின் தற்போதைய நிலையின் கண்ணோட்டம் இங்கே.',
    weather: 'நிகழ்நேர வானிலை',
    marketFactors: 'சந்தை காரணிகள்',
    geographicalConditions: 'புவியியல் நிலைமைகள்',
    currentTemp: 'தற்போதைய: 28°C, வெயில்',
    soilPh: 'மண் pH',
    elevation: 'உயரம்',
    
    // Crop Suggestions
    cropSuggestionsTitle: 'ஸ்மார்ட் பயிர் பரிந்துரைகள்',
    cropSuggestionsDescription: 'AI-இயங்கும் பயிர் பரிந்துரைகளைப் பெற கீழே உள்ள விவரங்களை நிரப்பவும்.',
    farmLocation: 'பண்ணை இருப்பிடம்',
    farmLocationPlaceholder: 'எ.கா., அட்சரேகை, தீர்க்கரேகை, அல்லது முகவரி',
    weatherPatterns: 'வானிலை முறைகள்',
    weatherPatternsPlaceholder: 'சமீபத்திய மற்றும் எதிர்பார்க்கப்படும் வானிலையை விவரிக்கவும்...',
    soilData: 'மண் தரவு',
    soilDataPlaceholder: 'மண் கலவை மற்றும் ஆரோக்கியத்தை விவரிக்கவும்...',
    marketTrends: 'சந்தை போக்குகள்',
    marketTrendsPlaceholder: 'தற்போதைய பயிர் சந்தை போக்குகளை விவரிக்கவும்...',
    getSuggestions: 'பரிந்துரைகளைப் பெறுக',
    recommendations: 'எங்கள் பரிந்துரைகள்',

    // Agronomic Tips
    agronomicTipsTitle: 'AI-இயங்கும் வேளாண் குறிப்புகள்',
    agronomicTipsDescription: 'உங்கள் பயிர் ஆரோக்கியம் மற்றும் மகசூலை மேம்படுத்த AI-இயங்கும் குறிப்புகளைப் பெறுங்கள்.',
    cropType: 'பயிர் வகை',
    cropTypePlaceholder: 'எ.கா., சோளம், கோதுமை, சோயாபீன்ஸ்',
    farmConditions: 'பண்ணை நிலைமைகள்',
    farmConditionsPlaceholder: 'தற்போதைய பண்ணை நிலைமைகளை விவரிக்கவும்...',
    getTips: 'குறிப்புகளைப் பெறுக',
    tips: 'வேளாண் குறிப்புகள்',
    
    // Data Visualization
    dataVisualizationTitle: 'வரலாற்று தரவு நுண்ணறிவு',
    dataVisualizationDescription: 'காலப்போக்கில் வானிலை, மண் மற்றும் சந்தை போக்குகளைக் கண்காணிக்கவும்.',
    weatherHistory: 'வானிலை வரலாறு',
    soilComposition: 'மண் கலவை',
    marketTrendsChart: 'சந்தை போக்குகள் (விலை/குவிண்டால்)',
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useMemo(() => (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  }, [language]);

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
