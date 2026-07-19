import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Award, LogOut, Terminal, Users, BookOpen, Shield, MessageSquare, ChevronDown, UserCheck, Play, X, Sparkles, Globe, Mail, Smartphone, CheckCircle, Fingerprint, Lock, RefreshCw, Chrome, Eye } from 'lucide-react';
import { User, CourseModule, Toast } from './types';
import { ALL_MODULES } from './data/curriculum';
import { useLanguage } from './context/LanguageContext';
import { PermissionsProvider } from './context/PermissionsContext';

// Subcomponents
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LessonViewer from './components/LessonViewer';
import ForumSection from './components/ForumSection';
import AdminPanel from './components/AdminPanel';
import CertificateGenerator from './components/CertificateGenerator';

export default function App() {
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'lessons' | 'forum' | 'admin'>('landing');
  const [signupName, setSignupName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // New registration states for email/Google signup and phone verification
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [password, setPassword] = useState('');
  const [signupStep, setSignupStep] = useState<'info' | 'verify' | 'success'>('info');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMethod, setSignupMethod] = useState<'email' | 'google'>('email');
  const [phoneCode, setPhoneCode] = useState('3934');
  const [userCodeInput, setUserCodeInput] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Toast state and manager
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message: string, points?: number, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, title, message, points, duration };
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper functions to find lesson / lab info for dynamic descriptions
  const findLessonAndModule = (lessonId: string) => {
    for (const m of ALL_MODULES) {
      const lesson = m.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        return { lesson, module: m };
      }
    }
    return null;
  };

  const findLabAndLesson = (labId: string) => {
    for (const m of ALL_MODULES) {
      for (const l of m.lessons) {
        if (l.lab && l.lab.id === labId) {
          return { lab: l.lab, lesson: l };
        }
      }
    }
    return null;
  };

  // Fetch student profile on load
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data: User = await response.json();
        
        // If user is already loaded, check for new badge unlocks
        if (user) {
          const oldBadgeIds = new Set(user.badges.map((b) => b.id));
          const newBadges = data.badges.filter((b) => !oldBadgeIds.has(b.id));
          newBadges.forEach((badge) => {
            addToast(
              'info',
              '🏆 وسام سيبراني جديد!',
              `لقد حصلت على وسام [${badge.name}]: ${badge.description}`,
              50
            );
          });
        }
        
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail.trim() || !password.trim()) {
      setSignupError(language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }
    
    setIsSigningUp(true);
    setSignupError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: signupEmail.trim(), 
          password: password.trim() 
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setPassword('');
        setSignupEmail('');
        setSignupError('');
        
        setActiveTab('dashboard');
        addToast(
          'success',
          language === 'ar' ? 'تم تسجيل الدخول بنجاح! 🎉' : 'Logged in Successfully! 🎉',
          language === 'ar' ? `مرحباً بعودتك يا ${data.name}.` : `Welcome back, ${data.name}.`,
          50
        );
      } else {
        setSignupError(data.error || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setSignupError(language === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم' : 'Error connecting to server');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSigningUp(true);
    setSignupError('');
    try {
      // Connect directly using the sandbox user email for personalized realistic feel
      const realUserEmail = "mf39343934@gmail.com";
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: realUserEmail, 
          isGoogle: true 
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setSignupEmail('');
        setPassword('');
        setSignupError('');
        setActiveTab('dashboard');
        addToast(
          'success',
          language === 'ar' ? 'تم الدخول بحساب Google! 🌐' : 'Logged in with Google! 🌐',
          language === 'ar' ? `مرحباً ${data.name}، تم الدخول بنجاح عبر حساب Google.` : `Hello ${data.name}, successfully logged in via Google account.`
        );
      } else {
        setSignupError(data.error || 'Google auth failed');
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setSignupError('Google Sign-In failed');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleContinueToVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      setSignupError(language === 'ar' ? 'الرجاء إدخال اسمك أولاً' : 'Please enter your name first');
      return;
    }
    if (signupMethod === 'email' && !signupEmail.trim()) {
      setSignupError(language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }
    if (signupMethod === 'email' && !/\S+@\S+\.\S+/.test(signupEmail)) {
      setSignupError(language === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address');
      return;
    }
    if (signupMethod === 'email' && !password.trim()) {
      setSignupError(language === 'ar' ? 'الرجاء إنشاء كلمة مرور' : 'Please create a password');
      return;
    }
    if (signupMethod === 'email' && password.trim().length < 6) {
      setSignupError(language === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }
    
    setSignupError('');
    setSignupStep('verify');
  };

  const handleGoogleSignupSimulate = () => {
    const chosenName = signupName.trim() || 'طالب سيبراني';
    setSignupName(chosenName);
    
    // Connect directly using the sandbox user email
    const googleEmail = 'mf39343934@gmail.com';
    setSignupEmail(googleEmail);
    setSignupMethod('google');
    setPassword('google-auth-simulated');
    
    addToast(
      'info',
      language === 'ar' ? 'تم الاتصال بحساب Google! 🌐' : 'Connected to Google Account! 🌐',
      language === 'ar' ? `مرحباً ${chosenName}، تم جلب بيانات بريدك الإلكتروني [mf39343934@gmail.com] بنجاح.` : `Hello ${chosenName}, your Gmail [mf39343934@gmail.com] details were fetched successfully.`
    );
    
    setSignupError('');
    setSignupStep('verify');
  };

  const handleFinalSignupSubmit = async () => {
    if (!signupName.trim()) return;

    setIsSigningUp(true);
    try {
      const finalEmail = signupEmail.trim() || 'mf39343934@gmail.com';
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: signupName,
          email: finalEmail,
          password: password || 'google-auth-simulated'
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        
        setSignupStep('info');
        setSignupEmail('');
        setPassword('');
        setUserCodeInput('');
        setIsCodeSent(false);
        setPhoneConfirmed(false);
        setSignupError('');
        
        setSelectedLessonId(null);
        setActiveTab('lessons');
        
        addToast(
          'success',
          language === 'ar' ? 'تم التسجيل بنجاح! 🎉' : 'Registered Successfully! 🎉',
          language === 'ar' ? 'أهلاً بك في أكاديمية سايبر. تم التحقق من هويتك بنجاح عبر الهاتف.' : 'Welcome to Cyber Academy. Your identity has been verified via phone.',
          100
        );
      } else {
        setSignupError(data.error || (language === 'ar' ? 'فشل إنشاء الحساب' : 'Signup failed'));
      }
    } catch (err) {
      console.error('Error in student signup:', err);
      setSignupError(language === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم' : 'Error connecting to server');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      const response = await fetch('/api/user/change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        await fetchUserProfile();
      }
    } catch (err) {
      console.error('Error changing student role:', err);
    }
  };

  const handleResetProgress = async () => {
    try {
      const response = await fetch('/api/user/reset', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setActiveTab('dashboard');
        alert('تمت إعادة ضبط تقدمك وصفرت جميع الأعلام والنقاط بنجاح! 🔄');
      }
    } catch (err) {
      console.error('Error resetting user progress:', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('landing');
  };

  // Helper: check if student completed the required lessons (e.g., at least 3 completed lessons) for certificate view
  const canEarnCertificate = user ? user.completedLessons.length >= 3 : false;

  return (
    <PermissionsProvider user={user}>
      <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-emerald-800/30 selection:text-emerald-300" id="main-applet" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Navigation */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Brand */}
          <div className={`flex items-center cursor-pointer ${isRtl ? 'space-x-3 space-x-reverse' : 'space-x-3'}`} onClick={() => setActiveTab('landing')}>
            <div className="bg-emerald-950 border border-emerald-500/30 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h1 className="text-md font-black tracking-wide text-slate-100">{t('academyName')}</h1>
              <p className="text-[9px] text-emerald-400 font-mono tracking-widest font-semibold uppercase">{t('cyberAcademy')}</p>
            </div>
          </div>

          {/* Navigation Links */}
          {user && (
            <nav className={`hidden md:flex items-center text-xs font-bold text-slate-400 ${isRtl ? 'space-x-1 space-x-reverse' : 'space-x-1'}`}>
              <button
                onClick={() => setActiveTab('landing')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'landing' ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                {t('home')}
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'dashboard' ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                {t('dashboard')}
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'lessons' ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                {t('curriculum')}
              </button>
              <button
                onClick={() => setActiveTab('forum')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'forum' ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                {t('forum')}
              </button>

              {/* Show Admin option if administrator/instructor/TA */}
              {['Administrator', 'Instructor', 'Teaching Assistant'].includes(user.role) && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 py-2 rounded-md border border-dashed transition-colors ${
                    activeTab === 'admin'
                      ? 'border-emerald-500/40 bg-slate-900 text-emerald-400'
                      : 'border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {t('admin')}
                </button>
              )}
            </nav>
          )}

          {/* User Section & Profile Panel */}
          <div className={`flex items-center ${isRtl ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-extrabold transition-colors cursor-pointer ${isRtl ? 'space-x-1.5 space-x-reverse' : 'space-x-1.5'}`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 transition-colors ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium hidden sm:inline">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isProfileDropdownOpen && (
                  <div className={`absolute ${isRtl ? 'left-0 text-right' : 'right-0 text-left'} mt-2 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-2 z-50`}>
                    <div className="px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                      <span>{t('role')}: </span>
                      <strong className="text-emerald-400">{user.role}</strong>
                      <div className="font-mono mt-0.5">{user.points} XP</div>
                    </div>

                    <button
                      onClick={() => {
                        setShowCertificateModal(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-4 py-2 text-xs hover:bg-slate-950 text-slate-300 flex items-center justify-between`}
                    >
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t('certificate')}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-4 py-2 text-xs hover:bg-slate-950 text-rose-400 flex items-center justify-between`}
                    >
                      <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('landing')}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all glow-btn"
              >
                {t('browsePlatform')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Onboarding / Profile setup is shown if user is null and not browsing landing page */}
        {!user && activeTab !== 'landing' ? (
          <div className="max-w-xl mx-auto py-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '15px' }} />
              
              {/* Selector Tabs for Sign In / Sign Up */}
              <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setSignupError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-emerald-600 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? 'تسجيل الدخول (Sign In)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSignupStep('info');
                    setSignupError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-emerald-600 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? 'إنشاء حساب (Sign Up)' : 'Sign Up'}
                </button>
              </div>

              {authMode === 'signin' && (
                <div className="space-y-6">
                  <div className="bg-emerald-950 p-4 rounded-full border border-emerald-500/20 inline-block">
                    <UserCheck className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{language === 'ar' ? 'أهلاً بك في الأكاديمية' : 'Welcome to the Academy'}</h2>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                      {language === 'ar' 
                        ? 'أدخل بريدك الإلكتروني وكلمة المرور لمتابعة تدريبك السيبراني واقتناص الأعلام.'
                        : 'Enter your email and password to resume your cybersecurity training and capture flags.'
                      }
                    </p>
                  </div>

                  {signupError && (
                    <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs py-2.5 px-4 rounded-lg">
                      ⚠️ {signupError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block text-right">
                        {language === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}
                      </label>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="student@cyberacademy.sa"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-center text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block text-right">
                        {language === 'ar' ? 'كلمة المرور:' : 'Password:'}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-center text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSigningUp}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black text-sm py-3.5 rounded-lg transition-all glow-btn cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{isSigningUp ? (language === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (language === 'ar' ? 'دخول آمن للمنصة 🔐' : 'Secure Sign In 🔐')}</span>
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-800"></div>
                      <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold">{language === 'ar' ? 'أو' : 'OR'}</span>
                      <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full p-3.5 rounded-lg border bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-xs font-black flex items-center justify-center gap-2 text-slate-300 transition-all cursor-pointer"
                    >
                      <Chrome className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-black">{language === 'ar' ? 'الدخول عبر حساب Google المرتبط بالهاتف 🌐' : 'Sign In with Gmail Linked to Phone 🌐'}</span>
                    </button>
                  </form>
                </div>
              )}

              {authMode === 'signup' && (
                <>
                  {/* Step indicator */}
                  <div className="flex items-center justify-center space-x-3 space-x-reverse mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                      signupStep === 'info' ? 'bg-emerald-600 border-emerald-500 text-slate-950 font-black' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>1</div>
                    <div className="w-8 h-px bg-slate-800" />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                      signupStep === 'verify' ? 'bg-emerald-600 border-emerald-500 text-slate-950 font-black' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>2</div>
                    <div className="w-8 h-px bg-slate-800" />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                      signupStep === 'success' ? 'bg-emerald-600 border-emerald-500 text-slate-950 font-black' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>3</div>
                  </div>

                  {signupStep === 'info' && (
                    <div className="space-y-6">
                      <div className="bg-emerald-950 p-4 rounded-full border border-emerald-500/20 inline-block">
                        <UserCheck className="w-8 h-8 text-emerald-400" />
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xl font-bold">{language === 'ar' ? 'التسجيل في الأكاديمية السيبرانية' : 'Register in Cyber Academy'}</h2>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                          {language === 'ar' 
                            ? 'أنشئ حسابك فوراً على منصة التدريب للبدء في حل معامل Docker واحتساب نقاط التقييم. يرجى إدخال اسمك الحقيقي لتثبيته بالشهادة المعتمدة.'
                            : 'Create your profile on the training platform to solve Docker labs and earn points. Please enter your real name for your certificate.'
                          }
                        </p>
                      </div>

                      {signupError && (
                        <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs py-2.5 px-4 rounded-lg">
                          ⚠️ {signupError}
                        </div>
                      )}

                      <form onSubmit={handleContinueToVerify} className="space-y-4 text-right">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 block text-right">
                            {language === 'ar' ? 'الاسم الكامل للطالب (سيظهر على الشهادة):' : 'Student Full Name (for Certificate):'}
                          </label>
                          <input
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: محمد أحمد العتيبي' : 'e.g., John Doe'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-center text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                            required
                            autoFocus
                          />
                        </div>

                        <div className="space-y-3 pt-2">
                          <label className="text-xs font-bold text-slate-400 block text-right">
                            {language === 'ar' ? 'طريقة التحقق من الحساب (لضمان المالك الحقيقي):' : 'Account Verification Method (Verify Owner):'}
                          </label>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setSignupMethod('email')}
                              className={`p-3 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                signupMethod === 'email'
                                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <Mail className="w-4 h-4" />
                              <span>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleGoogleSignupSimulate}
                              className="p-3 rounded-lg border bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-xs font-bold flex flex-col items-center justify-center gap-1.5 text-slate-300 transition-all cursor-pointer"
                            >
                              <Chrome className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 font-black">{language === 'ar' ? 'التسجيل عبر Google' : 'Register with Google'}</span>
                            </button>
                          </div>
                        </div>

                        {signupMethod === 'email' && (
                          <>
                            <div className="space-y-1.5 pt-1">
                              <label className="text-xs font-bold text-slate-400 block text-right">
                                {language === 'ar' ? 'البريد الإلكتروني (Gmail أو بريد شخصي):' : 'Email Address (Gmail or personal email):'}
                              </label>
                              <input
                                type="email"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                placeholder="student@gmail.com"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-center text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                required={signupMethod === 'email'}
                              />
                            </div>

                            <div className="space-y-1.5 pt-1">
                              <label className="text-xs font-bold text-slate-400 block text-right">
                                {language === 'ar' ? 'إنشاء كلمة المرور (6 خانات على الأقل):' : 'Create Password (at least 6 characters):'}
                              </label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-center text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                required={signupMethod === 'email'}
                              />
                            </div>
                          </>
                        )}

                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm py-3.5 rounded-lg transition-all glow-btn cursor-pointer flex items-center justify-center gap-2 mt-4"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>{language === 'ar' ? 'متابعة للتحقق من الهاتف 📲' : 'Continue to Phone Verification 📲'}</span>
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}

              {signupStep === 'verify' && (
                <div className="space-y-6">
                  <div className="bg-emerald-950 p-4 rounded-full border border-emerald-500/20 inline-block animate-pulse">
                    <Fingerprint className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{language === 'ar' ? 'تأكيد التسجيل من الهاتف المحمول' : 'Confirm Signup on Mobile Phone'}</h2>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                      {language === 'ar' 
                        ? `لنضمن أنك المالك الحقيقي لحساب الجيميل [${signupEmail || 'Google Account'}]، يرجى تأكيد ملكيتك عبر هاتف الذكي المحاكي بالأسفل.`
                        : `To verify you are the real owner of Gmail [${signupEmail || 'Google Account'}], please confirm ownership on the simulated smartphone below.`
                      }
                    </p>
                  </div>

                  {signupError && (
                    <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs py-2 px-4 rounded-lg">
                      ⚠️ {signupError}
                    </div>
                  )}

                  {/* Simulator container - Grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950/50 p-4 border border-slate-800 rounded-xl text-right">
                    {/* Simulated Phone Device */}
                    <div className="bg-slate-950 border-4 border-slate-800 rounded-2xl p-4 text-center space-y-4 max-w-[240px] mx-auto shadow-inner relative">
                      <div className="w-16 h-3.5 bg-slate-800 rounded-full mx-auto -mt-2 mb-1" />
                      
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-center gap-1.5 text-[9px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/10 px-2 py-0.5 rounded-full inline-block font-bold mx-auto">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Google Authenticator</span>
                        </div>
                        
                        <p className="text-[10px] text-slate-300 font-bold leading-tight">
                          {language === 'ar' ? 'تأكيد تسجيل طالب جديد في أكاديمية سايبر؟' : 'Verify new student signup at Cyber Academy?'}
                        </p>

                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPhoneConfirmed(true);
                              addToast(
                                'success',
                                language === 'ar' ? 'تم تأكيد الملكية من الهاتف! 📱' : 'Ownership confirmed on phone! 📱',
                                language === 'ar' ? 'تم التحقق من مالك البريد بنجاح.' : 'Email owner verified successfully.'
                              );
                              setSignupStep('success');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black py-1.5 rounded transition-all cursor-pointer shadow"
                          >
                            {language === 'ar' ? 'نعم، هذا أنا (تأكيد)' : 'Yes, it is me (Confirm)'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignupError(language === 'ar' ? 'تم رفض الطلب من الهاتف.' : 'Request rejected on device.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold py-1 rounded transition-all cursor-pointer"
                          >
                            {language === 'ar' ? 'لا، لست أنا' : 'No, not me'}
                          </button>
                        </div>
                      </div>

                      {isCodeSent ? (
                        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 text-center">
                          <p className="text-[9px] text-slate-400">{language === 'ar' ? 'رمز SMS المستلم على الهاتف:' : 'SMS code received on phone:'}</p>
                          <p className="text-base font-black text-emerald-400 font-mono tracking-widest animate-pulse mt-1">{phoneCode}</p>
                        </div>
                      ) : (
                        <p className="text-[9px] text-slate-500 leading-tight">
                          {language === 'ar' ? 'بانتظار نقرة الهاتف أو طلب رمز SMS...' : 'Waiting for phone tap or SMS code request...'}
                        </p>
                      )}
                    </div>

                    {/* Action controls */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-300">{language === 'ar' ? 'الخيار الأول: نقرة تأكيد الهاتف' : 'Option 1: Phone Tap Confirmation'}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {language === 'ar' 
                            ? 'انقر على الزر الأخضر "نعم، هذا أنا" في محاكي الهاتف الذكي على اليسار للتأكيد الفوري والمباشر لملكيتك.'
                            : 'Click the green "Yes, it is me" button on the simulated smartphone on the left to verify your ownership.'
                          }
                        </p>
                      </div>

                      <div className="border-t border-slate-800/60 my-2" />

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-300">{language === 'ar' ? 'الخيار الثاني: رمز التحقق SMS' : 'Option 2: SMS Verification Code'}</h4>
                        
                        {!isCodeSent ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsCodeSent(true);
                              addToast('info', language === 'ar' ? 'تم إرسال رمز التحقق! 📨' : 'Verification code sent! 📨', language === 'ar' ? `رمز التحقق الخاص بك هو: ${phoneCode}` : `Your code is: ${phoneCode}`);
                            }}
                            className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                            <span>{language === 'ar' ? 'أرسل الرمز للهاتف المحاكي' : 'Send SMS Code to Simulated Phone'}</span>
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={userCodeInput}
                              onChange={(e) => {
                                setUserCodeInput(e.target.value);
                                if (e.target.value.trim() === phoneCode) {
                                  setPhoneConfirmed(true);
                                  addToast(
                                    'success',
                                    language === 'ar' ? 'تم التحقق من الرمز بنجاح! ✅' : 'Code verified successfully! ✅',
                                    language === 'ar' ? 'تم تأكيد مالك حساب الجيميل.' : 'Gmail owner confirmed.'
                                  );
                                  setSignupStep('success');
                                }
                              }}
                              placeholder={language === 'ar' ? 'أدخل الرمز المكون من 4 أرقام...' : 'Enter 4-digit code...'}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-center text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono tracking-widest"
                              maxLength={4}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (userCodeInput.trim() === phoneCode) {
                                  setPhoneConfirmed(true);
                                  setSignupStep('success');
                                } else {
                                  setSignupError(language === 'ar' ? 'رمز التحقق غير صحيح، راجع الرمز المعروض على شاشة الهاتف المحاكي.' : 'Invalid code, please check the code shown on the simulated phone.');
                                }
                              }}
                              className="w-full bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer"
                            >
                              {language === 'ar' ? 'تأكيد رمز SMS' : 'Verify SMS Code'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep('info');
                      setSignupError('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-400 underline block mx-auto cursor-pointer"
                  >
                    {language === 'ar' ? 'العودة لتعديل البيانات' : 'Back to Edit Information'}
                  </button>
                </div>
              )}

              {signupStep === 'success' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-emerald-950/80 p-4 rounded-full border-2 border-emerald-500 inline-block text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-emerald-400">{language === 'ar' ? 'تم التسجيل بنجاح! 🎉' : 'Registration Successful! 🎉'}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                      {language === 'ar' 
                        ? 'تهانينا! لقد تم التحقق من مالك حساب الجيميل الحقيقي وتفعيل حسابك تلقائياً على المنصة بنجاح. يمكنك الآن بدء المذاكرة من بداية المنهج.'
                        : 'Congratulations! We verified the true Gmail owner and activated your account. You can now start studying the curriculum.'
                      }
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl text-right text-xs space-y-2.5 max-w-md mx-auto">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">{language === 'ar' ? 'الاسم المسجل:' : 'Registered Name:'}</span>
                      <strong className="text-slate-200">{signupName}</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                      <strong className="text-slate-200 font-mono text-[11px]">{signupEmail || 'Google Verified'}</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">{language === 'ar' ? 'طريقة التحقق:' : 'Verification Method:'}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        <span>{language === 'ar' ? 'تأكيد الهاتف الذكي' : 'Smartphone Confirmation'}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{language === 'ar' ? 'حالة الحساب:' : 'Account Status:'}</span>
                      <span className="text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        {language === 'ar' ? 'نشط ومؤكد 🟢' : 'Active & Verified 🟢'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalSignupSubmit}
                    disabled={isSigningUp}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm py-4 rounded-lg transition-all glow-btn cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>{language === 'ar' ? 'ابدأ دراسة الوحدات من البداية 🚀' : 'Start Studying Modules from Beginning 🚀'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Render Tabs with subtle animations */
          <AnimatePresence mode="wait">
            {activeTab === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <LandingPage
                  curriculum={ALL_MODULES}
                  onStartLearning={() => {
                    if (user) {
                      setActiveTab('lessons');
                    } else {
                      // Trigger profile creation
                      setActiveTab('dashboard');
                    }
                  }}
                  onLoginAsAdmin={async () => {
                    // Fast login as Administrator for demo audits
                    const res = await fetch('/api/user/signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: 'م. فهد العتيبي' }),
                    });
                    const adminUser = await res.json();
                    await fetch('/api/user/change-role', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ role: 'Administrator' }),
                    });
                    setUser({ ...adminUser, role: 'Administrator' });
                    setActiveTab('admin');
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'dashboard' && user && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard
                  user={user}
                  onSelectLesson={(lessonId) => {
                    setSelectedLessonId(lessonId);
                    setActiveTab('lessons');
                  }}
                  onResetProgress={handleResetProgress}
                  onChallengeSolved={async (points, question) => {
                    await fetchUserProfile();
                    addToast(
                      'success',
                      'تم حل التحدي اليومي بنجاح! 🏆',
                      `تهانينا! لقد تجاوزت تحدي اليوم بنجاح واكتسبت نقاط تقدير إضافية!`,
                      points
                    );
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'lessons' && user && (
              <motion.div
                key="lessons"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <LessonViewer
                  curriculum={ALL_MODULES}
                  user={user}
                  selectedLessonId={selectedLessonId}
                  onClearSelectedLesson={() => setSelectedLessonId(null)}
                  onLessonCompleted={async (lessonId) => {
                    const alreadyCompleted = user.completedLessons.includes(lessonId);
                    await fetchUserProfile();
                    if (!alreadyCompleted) {
                      const found = findLessonAndModule(lessonId);
                      if (found) {
                        addToast(
                          'success',
                          'تم إكمال الدرس بنجاح! 📖',
                          `لقد أنهيت مذاكرة درس "${found.lesson.title}" وحصلت على نقاط التقييم.`,
                          20
                        );
                      }
                    }
                  }}
                  onLabSolved={async (labId) => {
                    const alreadySolved = user.solvedLabs.includes(labId);
                    await fetchUserProfile();
                    if (!alreadySolved) {
                      const found = findLabAndLesson(labId);
                      if (found) {
                        addToast(
                          'success',
                          'تم حل المعمل بنجاح! 💻',
                          `تهانينا! لقد اقتنصت العلم الصحيح للمعمل "${found.lab.title}" وتجاوزت التحدي العملي!`,
                          found.lab.points
                        );
                      }
                    }
                  }}
                  onRefreshUser={fetchUserProfile}
                />
              </motion.div>
            )}

            {activeTab === 'forum' && user && (
              <motion.div
                key="forum"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <ForumSection user={{ name: user.name, role: user.role, points: user.points }} />
              </motion.div>
            )}

            {activeTab === 'admin' && user && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <AdminPanel
                  currentRole={user.role}
                  onChangeRole={handleRoleChange}
                  userPoints={user.points}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Certificate Modal */}
      {showCertificateModal && user && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 space-x-reverse">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>شهادة الاجتياز والاعتماد الرقمية</span>
              </h3>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-bold"
              >
                إغلاق (Close)
              </button>
            </div>

            {/* If completed less than 3 lessons, offer a bypass review button so the client can explore it */}
            {!canEarnCertificate && (
              <div className="p-4 bg-amber-950/30 border border-amber-500/20 rounded-lg text-amber-500 text-xs text-center">
                تنبيه: لقد أنهيت ({user.completedLessons.length} دروس من أصل الحد الأدنى 3). من باب التيسير والتجربة التقنية للنموذج، يمكنك استعراض وتحميل شهادتك بالكامل أدناه كمسودة معتمدة!
              </div>
            )}

            <CertificateGenerator
              user={user}
              onClose={() => setShowCertificateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Toasts Notification Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none" style={{ direction: 'rtl' }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9, x: -30 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -50, transition: { duration: 0.2 } }}
              layout
              className="pointer-events-auto bg-slate-900/95 border border-slate-800/80 rounded-xl shadow-2xl p-4 flex gap-3.5 relative overflow-hidden backdrop-blur-md"
            >
              {/* Border glow decoration */}
              <div className={`absolute top-0 bottom-0 right-0 w-1 ${
                toast.type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              
              {/* Toast Icon */}
              <div className={`p-2 rounded-lg shrink-0 border ${
                toast.type === 'success' 
                  ? 'bg-emerald-950/60 border-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-950/60 border-amber-500/20 text-amber-400'
              }`}>
                {toast.type === 'success' ? (
                  toast.points && toast.points >= 50 ? (
                    <Terminal className="w-5 h-5" />
                  ) : (
                    <BookOpen className="w-5 h-5" />
                  )
                ) : (
                  <Award className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pr-1.5 pl-6 text-right">
                <h4 className="text-xs font-bold text-slate-200">{toast.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{toast.message}</p>
                
                {toast.points && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400">+{toast.points} XP</span>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 left-3 text-slate-500 hover:text-slate-300 p-0.5 rounded hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
    </PermissionsProvider>
  );
}
