import { useState } from 'react';
import { Shield, Award, Terminal, Cpu, Users, ChevronDown } from 'lucide-react';
import { CourseModule } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  curriculum: CourseModule[];
  onStartLearning: () => void;
  onLoginAsAdmin: () => void;
}

export default function LandingPage({ curriculum, onStartLearning, onLoginAsAdmin }: LandingPageProps) {
  const { language, t, isRtl } = useLanguage();
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const stats = [
    { label: t('studentCount'), value: '+15,000', icon: Users },
    { label: t('interactiveLab'), value: '+120', icon: Terminal },
    { label: t('fullModule'), value: '20', icon: Shield },
    { label: t('certifiedTrust'), value: '100%', icon: Award },
  ];

  const faqs = language === 'ar' ? [
    {
      q: 'هل أحتاج إلى خلفية برمجية سابقة للبدء؟',
      a: 'لا، المنهج مصمم ليتدرج معك من الصفر تماماً (الوحدة الأولى والثانية تغطيان أساسيات لينكس والشبكات بالتفصيل) وصولاً لأكثر المستويات تقدماً.'
    },
    {
      q: 'كيف تعمل المعامل العملية في المنصة؟',
      a: 'بمجرد النقر على زر "ابدأ المعمل"، نقوم بتشغيل حاوية لينكس معزولة (Docker Sandbox) على خوادمنا وربطها بمتصفحك فوراً. يمكنك تنفيذ الأوامر الحقيقية دون إلحاق الضرر بجهازك.'
    },
    {
      q: 'ما هي شروط الحصول على الشهادة الرقمية المعتمدة؟',
      a: 'يجب عليك إتمام كافة الدروس، واجتياز اختبار كل وحدة بنسبة لا تقل عن 70%، وحل جميع المعامل العملية المدمجة بنجاح واقتناص العلم الخاص بكل معمل.'
    },
    {
      q: 'هل المحتوى يركز على الجانب الهجومي أم الدفاعي؟',
      a: 'يركز المنهج على التعلم الدفاعي وممارسة اختبار الاختراق المصرح به فقط. نتعلم كيف يفكر المخترقون لنتمكن من سد الثغرات وتأمين الأنظمة بشكل صحيح.'
    }
  ] : [
    {
      q: 'Do I need a prior programming background to start?',
      a: 'No, the curriculum is designed to guide you step-by-step from absolute zero (Modules 1 and 2 cover Linux and Networking basics in detail) up to advanced levels.'
    },
    {
      q: 'How do the hands-on sandbox labs work?',
      a: 'Once you click "Start Lab", we spin up an isolated Linux container (Docker Sandbox) on our servers and connect it to your browser instantly. You can execute real commands without harming your machine.'
    },
    {
      q: 'What are the requirements to earn the certified completion certificate?',
      a: 'You must complete all lessons, pass the quiz at the end of each module with a score of at least 70%, and successfully complete all integrated hands-on labs by capturing the correct flag.'
    },
    {
      q: 'Does the content focus on offensive or defensive security?',
      a: 'The curriculum focuses on defensive learning and authorized penetration testing only. We learn how attackers think so we can plug vulnerabilities and properly secure systems.'
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans overflow-x-hidden" id="landing-page" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 border-b border-slate-900 bg-slate-950">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className={`inline-flex items-center bg-slate-900/80 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs text-emerald-400 font-bold mb-2 ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-emerald-400 max-w-4xl mx-auto leading-tight md:leading-normal">
            {t('heroTitle')}
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm px-8 py-4 rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg glow-btn cursor-pointer"
            >
              {t('startLearningNow')}
            </button>
            <a
              href="#curriculum-section"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold px-8 py-4 rounded-lg transition-all text-center"
            >
              {t('browseUnits')}
            </a>
          </div>

          <div className="pt-4 text-slate-500 text-xs">
            {language === 'ar' ? 'أو قم بـ ' : 'Or '}
            <button onClick={onLoginAsAdmin} className="text-emerald-400 hover:underline font-mono cursor-pointer">
              {t('loginAsAdmin')}
            </button>{' '}
            {t('loginAsAdminDesc')}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur-md shadow-2xl">
          {stats.map((st, i) => (
            <div key={i} className={`text-center space-y-1 border-slate-800/80 last:border-none ${isRtl ? 'border-r last:border-r-0' : 'border-l first:border-l-0'}`}>
              <st.icon className="w-5 h-5 text-emerald-400 mx-auto opacity-70 mb-1" />
              <div className="text-2xl md:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">{st.value}</div>
              <div className="text-xs text-slate-400 font-medium">{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Features */}
      <div className="py-20 max-w-6xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-slate-100">{t('whyAcademy')}</h2>
          <p className="text-slate-400 text-sm">{t('whyAcademyDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 space-y-4 hover:border-emerald-500/10 transition-colors">
            <div className="bg-emerald-950 w-12 h-12 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <Terminal className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold">{t('feature1Title')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('feature1Desc')}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 space-y-4 hover:border-emerald-500/10 transition-colors">
            <div className="bg-emerald-950 w-12 h-12 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold">{t('feature2Title')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('feature2Desc')}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 space-y-4 hover:border-emerald-500/10 transition-colors">
            <div className="bg-emerald-950 w-12 h-12 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold">{t('feature3Title')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('feature3Desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Syllabus Section */}
      <div className="py-20 bg-slate-900/40 border-y border-slate-900" id="curriculum-section">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-slate-100">{t('curriculumSyllabusTitle')}</h2>
            <p className="text-slate-400 text-sm">{t('curriculumSyllabusDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-2">
            {curriculum.map((mod, idx) => (
              <div key={mod.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg p-5 flex flex-col justify-between space-y-4 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {t('unitWord')} {idx + 1}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      mod.difficulty === 'Beginner' ? 'bg-slate-900 text-emerald-400' :
                      mod.difficulty === 'Intermediate' ? 'bg-slate-900 text-amber-500' :
                      'bg-slate-900 text-rose-400'
                    }`}>
                      {language === 'ar' ? mod.difficultyAr : mod.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-200">
                    {language === 'ar' ? mod.title : mod.titleEn || mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {language === 'ar' ? mod.description : mod.descriptionEn || mod.description}
                  </p>
                </div>

                <div className={`flex items-center justify-between border-t border-slate-900 pt-3 text-[11px] text-slate-500`}>
                  <span>⏰ {mod.duration}</span>
                  <span>📚 {mod.lessonsCount} {language === 'ar' ? 'دروس' : 'lessons'}</span>
                  <span>🛠️ {mod.labsCount} {language === 'ar' ? 'معامل' : 'labs'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={onStartLearning}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm px-8 py-3.5 rounded-lg transition-all glow-btn cursor-pointer"
            >
              {language === 'ar' ? 'سجل الآن وابدأ بأول درس ومعمل فوراً' : 'Enroll Now & Start First Lesson Instantly'}
            </button>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-20 max-w-4xl mx-auto px-4 space-y-12">
        <h2 className="text-2xl md:text-3xl font-black text-center text-slate-100">{t('faqTitle')}</h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden transition-all">
              <button
                onClick={() => toggleFAQ(idx)}
                className={`w-full flex items-center justify-between px-6 py-4 font-bold text-sm text-slate-200 hover:bg-slate-900 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFAQ === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFAQ === idx && (
                <div className={`px-6 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-900/80 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} Cyber Academy. {language === 'ar' ? 'جميع الحقوق محفوظة لغايات التعليم الأمني والتدريب المرخص فقط.' : 'All rights reserved. Authorized security training only.'}</p>
        <p className="text-[10px] text-slate-700 mt-2">{language === 'ar' ? 'يركز المحتوى على الاستخدام الأخلاقي والدفاعي للأدوات الأمنية لمنع الأضرار السيبرانية.' : 'Content focuses on ethical use and defensive security to protect digital infrastructure.'}</p>
      </div>
    </div>
  );
}
