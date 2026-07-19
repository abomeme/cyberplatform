import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

export const translations = {
  ar: {
    academyName: "أكاديمية سايبر",
    cyberAcademy: "CYBER ACADEMY",
    home: "الرئيسية",
    dashboard: "لوحة التحكم",
    curriculum: "المنهج والدروس",
    forum: "المنتدى",
    admin: "الإدارة والتدقيق",
    role: "الرتبة",
    certificate: "عرض شهادة الإتمام",
    logout: "تسجيل الخروج",
    signupTitle: "إنشاء ملف طالب سيبراني جديد",
    signupDesc: "أنشئ حسابك فوراً على نظام إدارة التعليم (LMS) للبدء في حل معامل Docker واحتساب نقاط التقييم.",
    signupPlaceholder: "أدخل اسمك الكامل...",
    signupSubmit: "تأكيد وحفظ الملف",
    signupLoading: "جاري تهيئة الحساب السحابي...",
    browsePlatform: "تصفح المنصة",
    langButton: "English 🌐",
    backToLanding: "الرجوع للرئيسية",
    points: "نقطة",
    lessons: "دروس",
    labs: "معامل",
    quizzes: "اختبارات",
    level: "المستوى",
    toNextLevel: "للترقية",
    resetProgress: "إعادة تهيئة الحساب (Reset Progress)",
    resetProgressDesc: "هل تريد مسح ملف تقدمك الحالي وإعادة جميع النقاط والمعامل المحلولة لصفر لتجربة مسار تعليمي نظيف ومستقل؟",
    resetProgressBtn: "مسح وإعادة ضبط البيانات",
    leaderboardTitle: "قائمة الصدارة - أفضل 5 طلاب (Leaderboard)",
    liveUpdate: "تحديث مباشر ⚡",
    you: "أنت",
    overallProgress: "تقدمك الكلي في الدورة",
    completedCount: "أكملت {completed} من أصل {total} درساً بالكامل",
    completedLessons: "الدروس المكتملة",
    solvedLabs: "المعامل المحلولة",
    answeredQuizzes: "الاختبارات المجتازة",
    startLearningNow: "ابدأ مسيرتك التعليمية الآن (مجاناً)",
    browseUnits: "تصفح الوحدات العشرين كاملة",
    loginAsAdmin: "تسجيل الدخول كمسؤول النظام",
    loginAsAdminDesc: "لاستعراض سجلات المراجعة الأمنية ولوحة الإدارة",
    whyAcademy: "لماذا منصة Cyber Academy؟",
    whyAcademyDesc: "صممنا بيئة غامرة ومحفزة تتخطى حاجز التعليم النظري الممل وتضعك في قلب الميدان العملي.",
    feature1Title: "معامل سحابية بضغطة زر",
    feature1Desc: "لا داعي لتثبيت أنظمة وهمية ثقيلة تستهلك موارد جهازك. نوفر لك طرفيات تفاعلية مدمجة بالكامل تعمل على خوادمنا الآمنة.",
    feature2Title: "نظام محفز للألعاب (Gamification)",
    feature2Desc: "تعلم كأنك تلعب! احصل على نقاط عند إتمام الدروس، واقنص شارات وأوسمة فريدة، ونافس زملائك على لوحة الصدارة.",
    feature3Title: "شهادة إتمام معتمدة موثقة",
    feature3Desc: "عند إتمامك للـ 20 وحدة واجتياز المعامل والاختبارات، تصدر لك المنصة فوراً شهادة رسمية تحتوي على رمز استجابة سريع.",
    curriculumSyllabusTitle: "هيكل المنهج التعليمي الاحترافي",
    curriculumSyllabusDesc: "تصفح الـ 20 وحدة التدريبية المرتبة علمياً لتضمن الانتقال السلس والممنهج من الأساسيات وحتى احتراف اختبار الاختراق.",
    heroTitle: "احترف الأمن السيبراني بالتطبيق العملي في معامل حقيقية معزولة",
    heroBadge: "المنصة العربية الأولى المتكاملة لتعليم الهكر الأخلاقي عملياً",
    heroDesc: "تعلم باحترافية من خلال 20 وحدة برمجية رصينة، من الصفر للتمكن الفعلي. طبق دروسك مباشرة في طرفيات لينكس سحابية معزولة واقنص الأعلام لتثبت جدارتك.",
    studentCount: "طالب عربي نشط",
    interactiveLab: "معمل تفاعلي معزول",
    fullModule: "وحدة تعليمية كاملة",
    certifiedTrust: "شهادة معتمدة موثقة",
    faqTitle: "الأسئلة الشائعة حول الأكاديمية",
    difficultyBeginner: "مبتدئ",
    difficultyIntermediate: "متوسط",
    difficultyAdvanced: "متقدم",
    startLessonBtn: "ابدأ دراسة الوحدة العملية 🚀",
    unitWord: "الوحدة",
    lessonWord: "درس",
    skillsWord: "المهارات المكتسبة",
    labDetailsWord: "تفاصيل المعمل العملي",
    quizWord: "التقييم والاختبار",
    timeLimitWord: "الوقت المتاح للاختبار",
    minutesWord: "دقائق",
    secondsWord: "ثواني",
    currentScoreWord: "الرصيد الحالي",
    requiredPointsWord: "النقاط المطلوبة",
    solvedLabsTitle: "المعامل المحلولة",
    badgesEarnedWord: "شارات التقدير والأوسمة",
    badgesEarnedDesc: "الأوسمة الرقمية التي نجحت في اقتناصها بعد قنص الأعلام وإجتياز التحديات المتقدمة",
    adminSettingsWord: "إعدادات متقدمة للمطورين",
    adminSettingsDesc: "أدوات تصفير الحساب والتقدم لتجربة مسارات مخصصة ونظيفة",
  },
  en: {
    academyName: "Cyber Academy",
    cyberAcademy: "CYBER ACADEMY",
    home: "Home",
    dashboard: "Dashboard",
    curriculum: "Curriculum & Lessons",
    forum: "Forum",
    admin: "Admin & Audit",
    role: "Role",
    certificate: "View Certificate",
    logout: "Logout",
    signupTitle: "Create New Cyber Student Profile",
    signupDesc: "Create your profile instantly on the Learning Management System (LMS) to begin solving Docker labs and earning points.",
    signupPlaceholder: "Enter your full name...",
    signupSubmit: "Confirm & Save Profile",
    signupLoading: "Initializing cloud account...",
    browsePlatform: "Browse Platform",
    langButton: "العربية 🌐",
    backToLanding: "Back to Home",
    points: "Points",
    lessons: "Lessons",
    labs: "Labs",
    quizzes: "Quizzes",
    level: "Level",
    toNextLevel: "to level up",
    resetProgress: "Reset Progress",
    resetProgressDesc: "Do you want to clear your current progress and reset all points and solved labs to zero for a clean learning path?",
    resetProgressBtn: "Clear & Reset Data",
    leaderboardTitle: "Leaderboard - Top 5 Students",
    liveUpdate: "Live Update ⚡",
    you: "You",
    overallProgress: "Your Overall Course Progress",
    completedCount: "Completed {completed} out of {total} lessons fully",
    completedLessons: "Completed Lessons",
    solvedLabs: "Solved Labs",
    answeredQuizzes: "Completed Quizzes",
    startLearningNow: "Start Learning Now (Free)",
    browseUnits: "Browse All 20 Modules",
    loginAsAdmin: "Login as Administrator",
    loginAsAdminDesc: "To inspect security audit logs and administrative panel",
    whyAcademy: "Why Cyber Academy?",
    whyAcademyDesc: "We designed an immersive and stimulating environment that goes beyond boring theoretical learning and puts you in the action.",
    feature1Title: "Cloud Labs at One Click",
    feature1Desc: "No need to install heavy virtual machines that consume your computer's resources. We provide integrated interactive terminal simulations running on our secure servers.",
    feature2Title: "Gamified Learning System",
    feature2Desc: "Learn like you play! Earn points as you complete lessons, unlock unique badges and medals, and compete with peers on the leaderboard.",
    feature3Title: "Verified Certificate of Completion",
    feature3Desc: "Upon completing all 20 modules, labs and quizzes, the platform instantly issues an official certificate with a unique QR Code.",
    curriculumSyllabusTitle: "Professional Curriculum Structure",
    curriculumSyllabusDesc: "Browse the 20 scientifically structured training modules to ensure smooth transition from basics to penetration testing mastery.",
    heroTitle: "Master Cyber Security with Hands-on Practice in Real Sandbox Labs",
    heroBadge: "The First Integrated Platform for Practical Ethical Hacking",
    heroDesc: "Learn professionally with 20 robust curriculum modules from zero to mastery. Apply lessons directly in isolated cloud Linux terminals and capture flags.",
    studentCount: "Active Students",
    interactiveLab: "Isolated Sandbox Labs",
    fullModule: "Complete Modules",
    certifiedTrust: "Certified & Trusted",
    faqTitle: "Frequently Asked Questions",
    difficultyBeginner: "Beginner",
    difficultyIntermediate: "Intermediate",
    difficultyAdvanced: "Advanced",
    startLessonBtn: "Start Practical Module 🚀",
    unitWord: "Module",
    lessonWord: "Lesson",
    skillsWord: "Skills Acquired",
    labDetailsWord: "Lab Details",
    quizWord: "Quiz Assessment",
    timeLimitWord: "Quiz Time Limit",
    minutesWord: "minutes",
    secondsWord: "seconds",
    currentScoreWord: "Current Points",
    requiredPointsWord: "Required Points",
    solvedLabsTitle: "Solved Labs",
    badgesEarnedWord: "Badges & Achievements",
    badgesEarnedDesc: "Digital badges earned after capturing flags and successfully passing advanced cyber challenges",
    adminSettingsWord: "Advanced Developer Settings",
    adminSettingsDesc: "Reset progress and points to experience a completely clean curriculum path",
  }
};

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['ar']) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    // Update body class or attributes for styling direction if needed
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: keyof typeof translations['ar']): string => {
    return translations[language][key] || translations['ar'][key] || String(key);
  };

  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
