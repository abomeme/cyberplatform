import React, { useState, useEffect } from 'react';
import { Shield, Search, Terminal, AlertTriangle, Cpu, Globe, ArrowRight, ExternalLink, RefreshCw, X, FileText, CheckCircle2, AlertOctagon, HelpCircle, Code, Server, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface WikiTerm {
  id: string;
  termEn: string;
  termAr: string;
  categoryEn: string;
  categoryAr: string;
  definitionEn: string;
  definitionAr: string;
  impactEn: string;
  impactAr: string;
  mitigationEn: string;
  mitigationAr: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface CVEItem {
  id: string;
  summary: string;
  cvss: number | null;
  Published: string;
  Modified?: string;
  references?: string[];
}

// Local high-profile historical/recent CVE fallbacks for reliability and offline use
const FALLBACK_CVES: CVEItem[] = [
  {
    id: 'CVE-2021-44228',
    summary: 'Apache Log4j2 JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints. An attacker who can control log messages or log message parameters can execute arbitrary code loaded from LDAP servers.',
    cvss: 10.0,
    Published: '2021-12-10T00:00:00',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-44228']
  },
  {
    id: 'CVE-2017-0144',
    summary: 'The SMBv1 server in Microsoft Windows Vista SP2; Windows 7 SP1; Windows 8.1; Windows RT 8.1; Windows 10 Gold, 1511, and 1607; Windows Server 2008 SP2 and R2 SP1; Windows Server 2012 and R2; and Windows Server 2016 allows remote attackers to execute arbitrary code via crafted packets, aka "Windows SMB Remote Code Execution Vulnerability" (EternalBlue).',
    cvss: 9.3,
    Published: '2017-03-16T00:00:00',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2017-0144']
  },
  {
    id: 'CVE-2014-0160',
    summary: 'The (1) TLS and (2) DTLS implementations in OpenSSL 1.0.1 before 1.0.1g do not properly handle Heartbeat Extension packets, which allows remote attackers to obtain sensitive information from process memory via crafted packets (Heartbleed).',
    cvss: 5.0,
    Published: '2014-04-07T00:00:00',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2014-0160']
  },
  {
    id: 'CVE-2016-5195',
    summary: 'The dirty cow vulnerability in the Linux kernel before 4.8.3 allows local users to gain privileges by exploiting a race condition to write to a copy-on-write private mmap mapping.',
    cvss: 7.2,
    Published: '2016-10-19T00:00:00',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2016-5195']
  },
  {
    id: 'CVE-2024-3094',
    summary: 'Malicious code was discovered in the upstream tarballs of xz, starting with version 5.6.0. Through a series of complex obfuscations, the liblzma build process extracts a prebuilt object file from a disguised test file, which is then used to modify functions in the OpenSSH server process.',
    cvss: 10.0,
    Published: '2024-03-29T00:00:00',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-3094']
  }
];

const WIKI_GLOSSARY: WikiTerm[] = [
  {
    id: 'suid',
    termEn: 'SUID Executables (Set Owner User ID)',
    termAr: 'ملفات الصلاحيات الخاصة SUID',
    categoryEn: 'Privilege Escalation',
    categoryAr: 'تصعيد الصلاحيات',
    definitionEn: 'A special type of file permission in Linux that allows users to execute a binary with the permissions of the file owner (usually root) instead of the current user.',
    definitionAr: 'نوع خاص من أذونات الملفات في نظام Linux يتيح للمستخدم تشغيل البرنامج بصلاحيات مالك الملف الأصلي (غالباً ما يكون الجذر root) بدلاً من صلاحيات المستخدم الحالي الذي قام بالتشغيل.',
    impactEn: 'If an administrator misconfigures SUID on system tools (like find, cat, or nano), an attacker can abuse these tools to read private files or spawn a shell with root level privileges.',
    impactAr: 'إذا أخطأ مسؤول النظام في إسناد صلاحية SUID لأدوات قياسية (مثل find أو cat أو nano)، يمكن للمخترق استغلال وظائف الأداة لقراءة ملفات سرية كالملفات الحساسة أو تشغيل واجهة أوامر (shell) بصلاحيات الجذر.',
    mitigationEn: 'Periodically scan for unauthorized SUID files using `find / -perm -4000 2>/dev/null`, and ensure the "nosuid" mount option is used on user writable partitions.',
    mitigationAr: 'قم بإجراء فحص دوري للملفات التي تحمل علم SUID غير المصرح بها عبر الأمر `find / -perm -4000 2>/dev/null`، وتأكد من تطبيق خيار nosuid على أقسام الأقراص القابلة للكتابة.',
    riskLevel: 'Critical'
  },
  {
    id: 'sqli',
    termEn: 'SQL Injection (SQLi)',
    termAr: 'حقن لغة الاستعلامات البنائية SQLi',
    categoryEn: 'Web Security',
    categoryAr: 'أمن الويب',
    definitionEn: 'A web security vulnerability that allows an attacker to interfere with the queries an application makes to its database. Attackers can bypass authentication, view sensitive data, or even write database records.',
    definitionAr: 'ثغرة أمنية في تطبيقات الويب تسمح للمهاجم بالتدخل والتلاعب في استعلامات قواعد البيانات التي ينفذها التطبيق. يمكن للمهاجمين تجاوز المصادقة، أو جلب بيانات حساسة، أو حتى تعديل وحذف السجلات.',
    impactEn: 'Can lead to complete database compromise, unauthorized data disclosure, identity theft, and occasionally remote code execution on the database server.',
    impactAr: 'قد تؤدي إلى اختراق كامل لقاعدة البيانات وتسريب السجلات الحساسة وسرقة الهويات، وفي بعض الحالات، تنفيذ أوامر برمجية عن بُعد على خادم قواعد البيانات.',
    mitigationEn: 'Use parameterized queries (prepared statements), employ ORMs, and perform strict input validation and sanitization.',
    mitigationAr: 'استخدم الاستعلامات المجهزة والمعلمة (Prepared Statements)، والاعتماد على الأطر البرمجية الحديثة (ORMs)، والتحقق الصارم من المدخلات وتصفيتها.',
    riskLevel: 'High'
  },
  {
    id: 'xss',
    termEn: 'Cross-Site Scripting (XSS)',
    termAr: 'حقن النصوص البرمجية العابرة للمواقع XSS',
    categoryEn: 'Web Security',
    categoryAr: 'أمن الويب',
    definitionEn: 'A vulnerability where an attacker injects malicious client-side scripts into web pages viewed by other users. The browser executes the script in the context of the victim\'s session.',
    definitionAr: 'ثغرة تحدث عندما يتمكن المهاجم من حقن نصوص برمجية خبيثة (عادة JavaScript) داخل صفحات الويب التي يعرضها المستخدمون الآخرون. ينفذ متصفح الضحية هذه النصوص فور تحميل الصفحة.',
    impactEn: 'Session hijacking via cookie theft, defacement of websites, redirecting users to malicious phishing pages, and executing unauthorized actions.',
    impactAr: 'سرقة كعكات الجلسات (Session Cookies) واختطاف الجلسة، تشويه صفحات الموقع، إعادة توجيه الضحايا لصفحات تصيد، والقيام بعمليات غير مصرح بها نيابة عن المستخدم.',
    mitigationEn: 'Apply context-aware output encoding, utilize Content Security Policy (CSP) headers, and use secure modern frameworks (React/Angular) that escape variables by default.',
    mitigationAr: 'ترميز المخرجات بحسب السياق (Output Encoding)، تفعيل سياسة أمن المحتوى (CSP)، واستخدام أطر عمل حديثة آمنة تقوم بتعقيم المتغيرات افتراضياً كإطار عمل React.',
    riskLevel: 'High'
  },
  {
    id: 'docker-escape',
    termEn: 'Docker Container Escape',
    termAr: 'الهروب من الحاويات Docker Escape',
    categoryEn: 'Cloud & Virtualization',
    categoryAr: 'السحابة والافتراضية',
    definitionEn: 'A process where an attacker breaks out of a container\'s isolated environment and gains direct access to the underlying host system resources.',
    definitionAr: 'عملية يقوم فيها المهاجم بكسر القيود والبيئة المعزولة للحاوية (Container) والوصول المباشر إلى موارد نظام التشغيل المضيف الرئيسي (Host OS).',
    impactEn: 'Complete compromise of the host server and all other containers running on it, bypassing virtualization boundaries.',
    impactAr: 'تؤدي إلى السيطرة الكاملة على الخادم الرئيسي المضيف وكافة الحاويات الأخرى التي تعمل عليه، متجاوزة كافة حدود بيئات العمل المعزولة.',
    mitigationEn: 'Never run containers as root inside, avoid using the --privileged flag, drop unnecessary capabilities, and keep the Docker daemon updated.',
    mitigationAr: 'تجنب تشغيل الحاويات بصلاحيات الجذر (root) بداخلها، لا تستخدم الوسيط --privileged إلا للضرورة المطلقة، وتخلص من الصلاحيات الإضافية غير الضرورية وحدث مشغل Docker بانتظام.',
    riskLevel: 'Critical'
  },
  {
    id: 'nmap',
    termEn: 'Network Port Scanning (Nmap)',
    termAr: 'فحص منافذ الشبكة والخدمات',
    categoryEn: 'Reconnaissance',
    categoryAr: 'الاستطلاع والاستكشاف',
    definitionEn: 'The process of sending requests to network ports on a host to identify open doors, active services, and operating system versions.',
    definitionAr: 'عملية إرسال طلبات فحص متتالية إلى منافذ الشبكة الخاصة بالهدف لتحديد الأبواب المفتوحة، الخدمات الفعالة، والأنظمة المشغلة لها.',
    impactEn: 'Helps attackers discover vulnerable entry points, running software versions, and overall network architecture layout.',
    impactAr: 'تساعد المهاجمين في كشف الثغرات ونقاط الضعف بالخدمات الفعالة، والتعرف على إصدارات البرامج وتصميم هيكلية الشبكة تمهيداً للاختراق.',
    mitigationEn: 'Deploy robust stateful firewalls, configure Intrusion Detection/Prevention Systems (IDS/IPS), and disable unused services.',
    mitigationAr: 'قم بتركيب جدران حماية متطورة ومهيأة، تفعيل أنظمة كشف ومنع التسلل (IDS/IPS)، وإغلاق كافة الخدمات والمنافذ غير الضرورية.',
    riskLevel: 'Medium'
  },
  {
    id: 'brute-force',
    termEn: 'Brute Force & Dictionary Attack',
    termAr: 'هجمات القوة الغاشمة وتخمين القواميس',
    categoryEn: 'Authentication',
    categoryAr: 'المصادقة والتحقق',
    definitionEn: 'A trial-and-error method used by applications or scripts to decode login credentials, API keys, or hidden paths by checking all possible combinations.',
    definitionAr: 'أسلوب يعتمد على التخمين والتجربة والخطأ عبر برامج نصية لفك وتخمين كلمات المرور أو مفاتيح التشفير أو المسارات المخفية بتجربة آلاف الاحتمالات المتتالية.',
    impactEn: 'Unauthorized account takeovers, service disruption, leak of sensitive user dashboards, or access to administrative panels.',
    impactAr: 'الاستيلاء على الحسابات دون تصريح، تعطيل الخدمات، تسريب لوحات التحكم الحساسة، أو الوصول غير المصرح به للوحات الإدارة والتنفيذ.',
    mitigationEn: 'Enforce strong password policies, implement rate limiting, use Multi-Factor Authentication (MFA), and deploy account lockout thresholds.',
    mitigationAr: 'فرض سياسات كلمات مرور معقدة، تطبيق تحديد معدل الطلبات (Rate Limiting)، تفعيل المصادقة متعددة العوامل (MFA)، ووضع حد أقصى للمحاولات الفاشلة.',
    riskLevel: 'High'
  },
  {
    id: 'csrf',
    termEn: 'Cross-Site Request Forgery (CSRF)',
    termAr: 'تزوير الطلبات عبر المواقع CSRF',
    categoryEn: 'Web Security',
    categoryAr: 'أمن الويب',
    definitionEn: 'An attack that forces an end user to execute unwanted actions on a web application in which they\'re currently authenticated.',
    definitionAr: 'هجوم يجبر الضحية (المستخدم المصرح له) على تنفيذ إجراءات وتعديلات غير مرغوبة دون علمه على تطبيق ويب يكون مسجلاً للدخول فيه حالياً.',
    impactEn: 'An attacker can change user emails, passwords, transfer funds, or perform other critical state-changing functions.',
    impactAr: 'يستطيع المهاجم تغيير البريد الإلكتروني للضحية، تعديل كلمة المرور، تحويل الأموال، أو القيام بأي إجراءات تؤثر على حالة الحساب.',
    mitigationEn: 'Use anti-CSRF tokens in forms, set cookies with the "SameSite=Strict" or "Lax" attribute, and require re-authentication for sensitive actions.',
    mitigationAr: 'استخدام رموز مكافحة التزوير (Anti-CSRF Tokens) في النماذج، تفعيل خاصية SameSite=Strict على ملفات تعريف الارتباط، والمطالبة بإعادة المصادقة للعمليات الحساسة.',
    riskLevel: 'Medium'
  }
];

export default function CyberSecurityWiki() {
  const { language, isRtl } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'glossary' | 'cves'>('glossary');
  const [selectedTerm, setSelectedTerm] = useState<WikiTerm | null>(null);
  const [cves, setCves] = useState<CVEItem[]>([]);
  const [cveSearch, setCveSearch] = useState('');
  const [isLoadingCves, setIsLoadingCves] = useState(false);
  const [cveError, setCveError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Fetch real-time CVEs on tab switch or manual refresh
  const fetchLatestCves = async () => {
    setIsLoadingCves(true);
    setCveError('');
    try {
      // Use a highly reliable, public CORS-enabled CVE endpoint. 
      // CIRCL is a known public provider. In case of downtime, we fallback elegantly.
      const response = await fetch('https://cve.circl.lu/api/last/10');
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Map fields to guarantee uniform schema
        const mapped: CVEItem[] = data.map((item: any) => ({
          id: item.id || 'CVE-Unknown',
          summary: item.summary || 'No description available.',
          cvss: item.cvss ? parseFloat(item.cvss) : null,
          Published: item.Published || new Date().toISOString(),
          references: item.references || []
        }));
        setCves(mapped);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (err) {
      console.warn('Real-time CVE API failed or blocked by CORS. Using offline fallback dataset...', err);
      // Fallback to high-profile simulated database
      setCves(FALLBACK_CVES);
      setCveError(language === 'ar' ? 'عرض البيانات الاحتياطية المحدثة لتعذر الوصول للشبكة العالمية.' : 'Using updated offline CVE records (network/CORS limit).');
    } finally {
      setIsLoadingCves(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'cves' && cves.length === 0) {
      fetchLatestCves();
    }
  }, [isOpen, activeTab]);

  const filteredGlossary = WIKI_GLOSSARY.filter(t => {
    const term = language === 'ar' ? t.termAr : t.termEn;
    const desc = language === 'ar' ? t.definitionAr : t.definitionEn;
    const cat = language === 'ar' ? t.categoryAr : t.categoryEn;
    const query = searchTerm.toLowerCase();
    return (
      term.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query) ||
      cat.toLowerCase().includes(query) ||
      t.riskLevel.toLowerCase().includes(query)
    );
  });

  const filteredCves = cves.filter(c => {
    const query = cveSearch.toLowerCase();
    return c.id.toLowerCase().includes(query) || c.summary.toLowerCase().includes(query);
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-rose-950/40 text-rose-400 border-rose-500/30';
      case 'High': return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
      case 'Medium': return 'bg-yellow-950/40 text-yellow-400 border-yellow-500/30';
      default: return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <>
      {/* 1. Sticky Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-45 bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 px-4 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 cursor-pointer font-black text-xs`}
        id="wiki-floating-button"
      >
        <Shield className="w-4 h-4 animate-pulse text-emerald-400" />
        <span>{language === 'ar' ? 'المساعد والموسوعة الأمنية 🛡️' : 'Cyber Wiki Companion 🛡️'}</span>
      </button>

      {/* 2. Slide-out Drawer Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl relative z-10"
              dir={isRtl ? 'rtl' : 'ltr'}
              id="wiki-drawer-panel"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/20 text-emerald-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100">
                      {language === 'ar' ? 'الموسوعة الأمنية المرافقة' : 'Cyber Security Wiki'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {language === 'ar' ? 'رفيقك الفني للبحث وفهم ثغرات المعامل' : 'Your research companion during labs & lessons'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-800/80 bg-slate-950/20 p-1">
                <button
                  onClick={() => {
                    setActiveTab('glossary');
                    setSelectedTerm(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'glossary'
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'قاموس المفاهيم' : 'Security Glossary'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('cves')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'cves'
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'ثغرات CVE المباشرة' : 'Live CVE Stream'}</span>
                </button>
              </div>

              {/* Main Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* GLOSSARY TAB */}
                {activeTab === 'glossary' && (
                  <div className="space-y-4">
                    {/* Selected Term Details View */}
                    {selectedTerm ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Back Button */}
                        <button
                          onClick={() => setSelectedTerm(null)}
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:underline cursor-pointer mb-2"
                        >
                          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
                          <span>{language === 'ar' ? 'العودة للقائمة' : 'Back to List'}</span>
                        </button>

                        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                                {language === 'ar' ? selectedTerm.categoryAr : selectedTerm.categoryEn}
                              </span>
                              <h4 className="text-base font-extrabold text-slate-100">
                                {language === 'ar' ? selectedTerm.termAr : selectedTerm.termEn}
                              </h4>
                            </div>
                            <span className={`px-2.5 py-1 rounded text-[10px] font-black border uppercase tracking-wider ${getRiskColor(selectedTerm.riskLevel)}`}>
                              {selectedTerm.riskLevel}
                            </span>
                          </div>

                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                              {language === 'ar' ? 'ما هي هذه الثغرة؟' : 'What is this vulnerability?'}
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900">
                              {language === 'ar' ? selectedTerm.definitionAr : selectedTerm.definitionEn}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              {language === 'ar' ? 'الأثر الأمني والخطر:' : 'Impact & Exposure:'}
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {language === 'ar' ? selectedTerm.impactAr : selectedTerm.impactEn}
                            </p>
                          </div>

                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              {language === 'ar' ? 'آليات الحماية والوقاية:' : 'Mitigation & Defense:'}
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/10 p-3 rounded-lg border border-emerald-500/10 text-slate-200">
                              {language === 'ar' ? selectedTerm.mitigationAr : selectedTerm.mitigationEn}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // Search & Term List
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={language === 'ar' ? 'ابحث عن مفهوم، أداة أو ثغرة...' : 'Search concepts, tags or risk levels...'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        </div>

                        {/* Quick tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {WIKI_GLOSSARY.slice(0, 5).map(t => (
                            <button
                              key={t.id}
                              onClick={() => setSelectedTerm(t)}
                              className="text-[10px] font-bold bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              {language === 'ar' ? t.termAr.split(' ')[0] : t.termEn.split(' ')[0]}
                            </button>
                          ))}
                        </div>

                        {/* List rendering */}
                        <div className="space-y-2 pt-2">
                          {filteredGlossary.length > 0 ? (
                            filteredGlossary.map(item => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedTerm(item)}
                                className="bg-slate-950/30 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl transition-all cursor-pointer group flex justify-between items-center"
                              >
                                <div className="space-y-1 pr-4">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-extrabold text-slate-200 group-hover:text-emerald-400 transition-colors">
                                      {language === 'ar' ? item.termAr : item.termEn}
                                    </h5>
                                    <span className="text-[9px] text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-800/80">
                                      {language === 'ar' ? item.categoryAr : item.categoryEn}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 line-clamp-1">
                                    {language === 'ar' ? item.definitionAr : item.definitionEn}
                                  </p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase shrink-0 ${getRiskColor(item.riskLevel)}`}>
                                  {item.riskLevel}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-slate-500 text-xs">
                              {language === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching cybersecurity terms found.'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CVE LIVE TAB */}
                {activeTab === 'cves' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={cveSearch}
                          onChange={(e) => setCveSearch(e.target.value)}
                          placeholder={language === 'ar' ? 'البحث في قائمة الثغرات CVE...' : 'Filter CVE list by tech or keyword...'}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      </div>
                      <button
                        onClick={fetchLatestCves}
                        disabled={isLoadingCves}
                        className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
                        title={language === 'ar' ? 'تحديث البيانات' : 'Refresh data'}
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingCves ? 'animate-spin text-emerald-400' : ''}`} />
                      </button>
                    </div>

                    {cveError && (
                      <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] py-2 px-3 rounded-lg font-mono">
                        💡 {cveError}
                      </div>
                    )}

                    {/* CVE Live List rendering */}
                    <div className="space-y-3 pt-1">
                      {isLoadingCves ? (
                        <div className="space-y-3 py-10 text-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                          <p className="text-xs text-slate-500 font-mono">
                            {language === 'ar' ? 'جاري الاتصال بقاعدة البيانات العالمية...' : 'Fetching latest CVE records from CIRCL database...'}
                          </p>
                        </div>
                      ) : filteredCves.length > 0 ? (
                        filteredCves.map(cve => (
                          <div
                            key={cve.id}
                            className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-2 relative overflow-hidden"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-black font-mono text-emerald-400 tracking-wider">
                                {cve.id}
                              </span>
                              {cve.cvss && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black border font-mono ${
                                  cve.cvss >= 9.0 ? 'bg-rose-950/40 text-rose-400 border-rose-500/30' :
                                  cve.cvss >= 7.0 ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' :
                                  'bg-yellow-950/40 text-yellow-400 border-yellow-500/30'
                                }`}>
                                  CVSS {cve.cvss.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans font-normal">
                              {cve.summary}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900/50 pt-2 font-mono">
                              <span>
                                {language === 'ar' ? 'تاريخ النشر: ' : 'Published: '}
                                {new Date(cve.Published).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                              </span>
                              {cve.references && cve.references.length > 0 && (
                                <a
                                  href={cve.references[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-500 hover:underline flex items-center gap-1 font-sans font-bold"
                                >
                                  <span>{language === 'ar' ? 'المصدر' : 'Detail'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500 text-xs">
                          {language === 'ar' ? 'تعذر تحميل أو تصفية الثغرات الحالية.' : 'No CVE entries match your search.'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono">
                {language === 'ar' ? 'قاعدة بيانات الأكاديمية متصلة بـ NVD و CIRCL' : 'SAUDI CYBER ACADEMY • CONNECTED TO NVD & CIRCL'}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
