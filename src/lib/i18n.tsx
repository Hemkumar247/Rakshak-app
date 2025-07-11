"use client";

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

type Language = 'en' | 'hi' | 'ta';

const translations = {
  en: {
    // General
    appName: 'Rakshak',
    loading: 'Loading...',
    submit: 'Submit',
    noInfo: 'No information provided.',
    errorTitle: 'Error',
    errorDescription: 'Something went wrong. Please try again.',


    // Sidebar
    dashboard: 'Dashboard',
    cropSuggestions: 'Crop Suggestions',
    plantDiagnosis: 'Plant Diagnosis',
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
    getSuggestions: 'Get Suggestions',
    recommendations: 'Our Recommendations',
    
    // Plant Diagnosis
    plantDiagnosisTitle: 'Rakshak AI: Plant Disease Diagnosis',
    plantDiagnosisDescription: 'Upload a photo of your plant to get an AI-powered diagnosis and treatment plan.',
    newDiagnosis: 'New Diagnosis',
    plantPhoto: 'Plant Photo',
    uploadInstruction: 'Click to upload or drag and drop',
    uploadSubtext: 'PNG, JPG, or WEBP',
    optionalNotes: 'Optional Notes',
    optionalNotesPlaceholder: 'e.g., "Leaves are yellowing", "I see white spots"...',
    getDiagnosis: 'Get Diagnosis',
    diagnosisResult: 'Diagnosis Result',
    aiAnalyzing: 'Rakshak AI is analyzing...',
    notAPlantTitle: 'Not a Plant',
    notAPlantDescription: "The AI couldn't detect a plant in the image. Please try another photo.",
    healthy: 'Healthy',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment Plan',
    prevention: 'Prevention Tips',
    resultsAppearHere: 'Your diagnosis results will appear here.',
    uploadToStart: 'Upload a plant photo to get started.',

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
    noInfo: 'कोई जानकारी नहीं दी गई।',
    errorTitle: 'त्रुटि',
    errorDescription: 'कुछ गलत हो गया। कृपया पुन प्रयास करें।',
    
    // Sidebar
    dashboard: 'डैशबोर्ड',
    cropSuggestions: 'फसल सुझाव',
    plantDiagnosis: 'पौधों का निदान',
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
    getSuggestions: 'सुझाव प्राप्त करें',
    recommendations: 'हमारी सिफारिशें',

    // Plant Diagnosis
    plantDiagnosisTitle: 'रक्षक AI: पौधों के रोगों का निदान',
    plantDiagnosisDescription: 'AI-संचालित निदान और उपचार योजना प्राप्त करने के लिए अपने पौधे की एक तस्वीर अपलोड करें।',
    newDiagnosis: 'नया निदान',
    plantPhoto: 'पौधे की तस्वीर',
    uploadInstruction: 'अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें',
    uploadSubtext: 'PNG, JPG, या WEBP',
    optionalNotes: 'वैकल्पिक नोट्स',
    optionalNotesPlaceholder: 'उदा., "पत्तियां पीली हो रही हैं", "मुझे सफेद धब्बे दिखाई दे रहे हैं"...',
    getDiagnosis: 'निदान प्राप्त करें',
    diagnosisResult: 'निदान परिणाम',
    aiAnalyzing: 'रक्षक AI विश्लेषण कर रहा है...',
    notAPlantTitle: 'पौधा नहीं है',
    notAPlantDescription: 'AI तस्वीर में पौधे का पता नहीं लगा सका। कृपया दूसरी तस्वीर का प्रयास करें।',
    healthy: 'स्वस्थ',
    diagnosis: 'निदान',
    treatment: 'उपचार योजना',
    prevention: 'रोकथाम के उपाय',
    resultsAppearHere: 'आपके निदान के परिणाम यहां दिखाई देंगे।',
    uploadToStart: 'शुरू करने के लिए पौधे की तस्वीर अपलोड करें।',

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
    noInfo: 'தகவல் எதுவும் வழங்கப்படவில்லை.',
    errorTitle: 'பிழை',
    errorDescription: 'ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.',
    
    // Sidebar
    dashboard: 'டாஷ்போர்டு',
    cropSuggestions: 'பயிர் பரிந்துரைகள்',
    plantDiagnosis: 'தாவர நோய் கண்டறிதல்',
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
    getSuggestions: 'பரிந்துரைகளைப் பெறுக',
    recommendations: 'எங்கள் பரிந்துரைகள்',

    // Plant Diagnosis
    plantDiagnosisTitle: 'ரக்ஷக் AI: தாவர நோய் கண்டறிதல்',
    plantDiagnosisDescription: 'AI-இயங்கும் நோய் கண்டறிதல் மற்றும் சிகிச்சை திட்டத்தைப் பெற உங்கள் தாவரத்தின் புகைப்படத்தைப் பதிவேற்றவும்.',
    newDiagnosis: 'புதிய கண்டறிதல்',
    plantPhoto: 'தாவரத்தின் புகைப்படம்',
    uploadInstruction: 'பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்',
    uploadSubtext: 'PNG, JPG, அல்லது WEBP',
    optionalNotes: 'விருப்பக் குறிப்புகள்',
    optionalNotesPlaceholder: 'எ.கா., "இலைகள் மஞ்சள் நிறமாகின்றன", "நான் வெள்ளைப் புள்ளிகளைக் காண்கிறேன்"...',
    getDiagnosis: 'நோய் கண்டறிதல் பெறுக',
    diagnosisResult: 'நோய் கண்டறிதல் முடிவு',
    aiAnalyzing: 'ரக்ஷக் AI பகுப்பாய்வு செய்கிறது...',
    notAPlantTitle: 'தாவரம் அல்ல',
    notAPlantDescription: 'AI ஆல் படத்தில் ஒரு தாவரத்தைக் கண்டறிய முடியவில்லை. தயவுசெய்து மற்றொரு புகைப்படத்தை முயற்சிக்கவும்.',
    healthy: 'ஆரோக்கியமான',
    diagnosis: 'நோய் கண்டறிதல்',
    treatment: 'சிகிச்சை திட்டம்',
    prevention: 'தடுப்பு குறிப்புகள்',
    resultsAppearHere: 'உங்கள் நோய் கண்டறிதல் முடிவுகள் இங்கே தோன்றும்.',
    uploadToStart: 'தொடங்குவதற்கு ஒரு தாவர புகைப்படத்தை பதிவேற்றவும்.',
    
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
  isMounted: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = useMemo(() => (key: keyof typeof translations.en) => {
    if (!isMounted) return translations.en[key];
    return translations[language][key] || translations.en[key];
  }, [language, isMounted]);

  const value = { language, setLanguage, t, isMounted };

  return (
    <LanguageContext.Provider value={value}>
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
