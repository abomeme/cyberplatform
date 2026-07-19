import React, { useRef, useState, useEffect } from 'react';
import { Shield, Share2, Download, Copy, Check, Twitter, Linkedin, X, Palette, Sparkles, Award, Terminal, Flag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ShareProgressProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

type ThemeID = 'cyber' | 'corporate' | 'retro' | 'sunset';

interface CardTheme {
  id: ThemeID;
  nameAr: string;
  nameEn: string;
  bgGrad: string;
  borderClass: string;
  accentColor: string;
  textColor: string;
  accentText: string;
  glowColor: string;
  canvasColors: {
    bgStart: string;
    bgEnd: string;
    border: string;
    accent: string;
    text: string;
    subtext: string;
    glow: string;
  };
}

const THEMES: CardTheme[] = [
  {
    id: 'cyber',
    nameAr: 'النيون السيبراني',
    nameEn: 'Cyber Neon',
    bgGrad: 'from-slate-950 via-slate-900 to-emerald-950/40',
    borderClass: 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    accentColor: '#10b981',
    textColor: '#f8fafc',
    accentText: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    canvasColors: {
      bgStart: '#040814',
      bgEnd: '#061c16',
      border: '#10b981',
      accent: '#10b981',
      text: '#ffffff',
      subtext: '#94a3b8',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
  },
  {
    id: 'corporate',
    nameAr: 'الأزرق الفاخر',
    nameEn: 'Corporate Pro',
    bgGrad: 'from-slate-950 via-slate-900 to-amber-950/20',
    borderClass: 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
    accentText: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    canvasColors: {
      bgStart: '#020617',
      bgEnd: '#0f172a',
      border: '#f59e0b',
      accent: '#f59e0b',
      text: '#ffffff',
      subtext: '#94a3b8',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
  },
  {
    id: 'retro',
    nameAr: 'شاشة الرادار',
    nameEn: 'Phosphor Green',
    bgGrad: 'from-zinc-950 via-emerald-950/20 to-zinc-950',
    borderClass: 'border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
    accentColor: '#22c55e',
    textColor: '#22c55e',
    accentText: 'text-green-400 font-mono',
    glowColor: 'rgba(34, 197, 94, 0.3)',
    canvasColors: {
      bgStart: '#020a05',
      bgEnd: '#02180c',
      border: '#22c55e',
      accent: '#22c55e',
      text: '#22c55e',
      subtext: '#15803d',
      glow: 'rgba(34, 197, 94, 0.4)',
    },
  },
  {
    id: 'sunset',
    nameAr: 'الغسق الرقمي',
    nameEn: 'Digital Sunset',
    bgGrad: 'from-slate-950 via-purple-950/30 to-rose-950/40',
    borderClass: 'border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]',
    accentColor: '#ec4899',
    textColor: '#f8fafc',
    accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    canvasColors: {
      bgStart: '#0a0518',
      bgEnd: '#250819',
      border: '#ec4899',
      accent: '#f97316',
      text: '#ffffff',
      subtext: '#c084fc',
      glow: 'rgba(236, 72, 153, 0.4)',
    },
  },
];

export default function ShareProgress({ user, isOpen, onClose }: ShareProgressProps) {
  const { language, isRtl } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeID>('cyber');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Derive Rank Details
  let currentRank = language === 'ar' ? 'مخترق مبتدئ (Apprentice)' : 'Apprentice';
  let badgeCountText = language === 'ar' ? `${user.badges.length} أوسمة` : `${user.badges.length} Badges`;
  
  if (user.points > 600) {
    currentRank = language === 'ar' ? 'حارس الأمن السيبراني (Cyber Sentinel)' : 'Cyber Sentinel';
  } else if (user.points > 300) {
    currentRank = language === 'ar' ? 'مختبر اختراق نشط (Junior Pentester)' : 'Junior Pentester';
  }

  const currentTheme = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  // Auto-generate PNG on canvas when theme/user/language changes
  useEffect(() => {
    if (isOpen) {
      drawCanvas();
    }
  }, [isOpen, selectedTheme, language, user]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use High-DPI Canvas (1200 x 630 px) - Perfect aspect ratio for Social Previews
    canvas.width = 1200;
    canvas.height = 630;

    const colors = currentTheme.canvasColors;

    // 1. Draw Background Gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, colors.bgStart);
    grad.addColorStop(1, colors.bgEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Decorative Cyber Grid Lines / Accents
    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 150, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 80) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i + 50);
      ctx.stroke();
    }

    // 3. Draw Outer Border and Corner Brackets
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Draw tech corner brackets (Cyberpunk styling)
    ctx.fillStyle = colors.border;
    const bracketLen = 35;
    const bracketThick = 8;
    // Top-Left
    ctx.fillRect(20, 20, bracketLen, bracketThick);
    ctx.fillRect(20, 20, bracketThick, bracketLen);
    // Top-Right
    ctx.fillRect(canvas.width - 20 - bracketLen, 20, bracketLen, bracketThick);
    ctx.fillRect(canvas.width - 20, 20, bracketThick, bracketLen);
    // Bottom-Left
    ctx.fillRect(20, canvas.height - 20 - bracketThick, bracketLen, bracketThick);
    ctx.fillRect(20, canvas.height - 20 - bracketLen, bracketThick, bracketLen);
    // Bottom-Right
    ctx.fillRect(canvas.width - 20 - bracketLen, canvas.height - 20 - bracketThick, bracketLen, bracketThick);
    ctx.fillRect(canvas.width - 20, canvas.height - 20 - bracketLen, bracketThick, bracketLen);

    // Set Font Families
    const fontTitle = language === 'ar' ? 'bold 44px "Cairo", "Inter", sans-serif' : 'bold 44px "Inter", sans-serif';
    const fontHeader = language === 'ar' ? 'bold 32px "Cairo", "Inter", sans-serif' : 'bold 32px "Inter", sans-serif';
    const fontBody = language === 'ar' ? '500 24px "Cairo", "Inter", sans-serif' : '500 24px "Inter", sans-serif';
    const fontLabel = language === 'ar' ? 'bold 16px "Cairo", "Inter", sans-serif' : 'bold 16px "Inter", sans-serif';
    const fontMono = 'bold 24px "JetBrains Mono", monospace';
    const fontMonoBig = 'bold 55px "JetBrains Mono", monospace';

    // 4. Logo Header
    // Draw a nice tech shield icon at the top
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 70);
    ctx.lineTo(canvas.width / 2 + 24, 82);
    ctx.lineTo(canvas.width / 2 + 24, 110);
    ctx.bezierCurveTo(canvas.width / 2 + 24, 128, canvas.width / 2, 142, canvas.width / 2, 142);
    ctx.bezierCurveTo(canvas.width / 2, 142, canvas.width / 2 - 24, 128, canvas.width / 2 - 24, 110);
    ctx.lineTo(canvas.width / 2 - 24, 82);
    ctx.closePath();
    ctx.stroke();

    // Shield accent dot
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 103, 7, 0, Math.PI * 2);
    ctx.fill();

    // Academy Title
    ctx.fillStyle = colors.accent;
    ctx.font = fontLabel;
    ctx.textAlign = 'center';
    ctx.fillText(
      language === 'ar' ? 'الأكاديمية السيبرانية السعودية' : 'SAUDI CYBER ACADEMY',
      canvas.width / 2,
      175
    );

    // 5. User Name
    ctx.fillStyle = colors.text;
    ctx.font = fontTitle;
    ctx.textAlign = 'center';
    ctx.fillText(user.name, canvas.width / 2, 235);

    // 6. Rank / Privilege Level Label
    ctx.fillStyle = colors.subtext;
    ctx.font = fontBody;
    ctx.textAlign = 'center';
    ctx.fillText(
      language === 'ar' ? 'المستوى الأمني الحالي للمستخدم' : 'Current Cybersecurity Rank',
      canvas.width / 2,
      275
    );

    // Rank Badge Box
    ctx.strokeStyle = colors.border + '60';
    ctx.fillStyle = colors.bgStart;
    ctx.lineWidth = 2;
    // Draw rounded rect for current rank
    const rankWidth = ctx.measureText(currentRank).width + 60;
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - rankWidth / 2, 295, rankWidth, 48, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    ctx.font = fontHeader;
    ctx.textAlign = 'center';
    ctx.fillText(currentRank, canvas.width / 2, 330);

    // 7. Dynamic Stats Row (Cards)
    const cardY = 380;
    const cardH = 150;
    const cardW = 240;
    const gap = 40;
    const startX = canvas.width / 2 - (cardW * 2 + gap * 1.5);

    const stats = [
      {
        val: `${user.points} XP`,
        label: language === 'ar' ? 'النقاط الإجمالية' : 'Total Points',
        isMono: true,
      },
      {
        val: `${user.completedLessons.length}`,
        label: language === 'ar' ? 'الدروس المكتملة' : 'Completed Lessons',
        isMono: true,
      },
      {
        val: `${user.solvedLabs.length}`,
        label: language === 'ar' ? 'المعامل المحلولة 🚩' : 'Labs Solved 🚩',
        isMono: true,
      },
      {
        val: `${user.badges.length}`,
        label: language === 'ar' ? 'الأوسمة المكتسبة' : 'Badges Earned',
        isMono: true,
      },
    ];

    stats.forEach((st, idx) => {
      const cx = startX + idx * (cardW + gap);
      // Box
      ctx.fillStyle = colors.bgStart;
      ctx.strokeStyle = colors.border + '40';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      // Glowing corner dots for aesthetic tech look
      ctx.fillStyle = colors.accent;
      ctx.fillRect(cx + 4, cardY + 4, 4, 4);
      ctx.fillRect(cx + cardW - 8, cardY + 4, 4, 4);

      // Value
      ctx.fillStyle = colors.text;
      ctx.font = fontMonoBig;
      ctx.textAlign = 'center';
      ctx.fillText(st.val, cx + cardW / 2, cardY + 75);

      // Label
      ctx.fillStyle = colors.subtext;
      ctx.font = fontLabel;
      ctx.textAlign = 'center';
      ctx.fillText(st.label, cx + cardW / 2, cardY + 120);
    });

    // 8. Footer Meta
    ctx.fillStyle = colors.subtext + 'bb';
    ctx.font = fontLabel;
    
    // Left Align: Join Date
    ctx.textAlign = 'left';
    const joinDate = new Date(user.joinedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(
      (language === 'ar' ? 'تاريخ الانضمام: ' : 'Enrolled: ') + joinDate,
      60,
      canvas.height - 50
    );

    // Right Align: URL / Platform verification
    ctx.textAlign = 'right';
    ctx.fillText(
      'cyberacademy.sa/verify-student',
      canvas.width - 60,
      canvas.height - 50
    );
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    setTimeout(() => {
      try {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `cyber-progress-${user.name.replace(/\s+/g, '-')}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error('Failed to export canvas', e);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  const getShareText = () => {
    const totalLabs = user.solvedLabs.length;
    const totalXP = user.points;
    if (language === 'ar') {
      return `🛡️ لقد حققت رتبة "${currentRank}" على منصة الأكاديمية السيبرانية السعودية!

📊 إحصائياتي الأمنية:
🔥 النقاط: ${totalXP} XP
📚 الدروس المنجزة: ${user.completedLessons.length} دروس
🚩 المعامل المحلولة: ${totalLabs} معامل
🏅 الأوسمة المكتسبة: ${user.badges.length} أوسمة

🔗 تابع مسيرتي أو ابدأ مسيرتك الأمنية الآن:
#الأمن_السيبراني #تحدي_سايبر #CyberAcademy`;
    } else {
      return `🛡️ I just reached the rank of "${currentRank}" on the Saudi Cyber Academy!

📊 My Cybersecurity Progress:
🔥 Points: ${totalXP} XP
📚 Lessons Completed: ${user.completedLessons.length}
🚩 Labs Solved: ${totalLabs} Flag captures
🏅 Badges Earned: ${user.badges.length}

🔗 Start your security journey or track mine:
#CyberSecurity #CTF #CyberAcademy`;
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedin = () => {
    const text = encodeURIComponent(getShareText());
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=https://cyberacademy.sa&summary=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6"
            id="share-progress-modal"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className={`space-y-1.5 ${isRtl ? 'text-right' : 'text-left'} pr-8`}>
              <div className="flex items-center gap-2 text-emerald-400">
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {language === 'ar' ? 'توليد ومشاركة الإنجازات' : 'Generate & Share Achievements'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-100">
                {language === 'ar' ? 'شارك مسيرتك السيبرانية' : 'Share Your Cyber Journey'}
              </h2>
              <p className="text-slate-400 text-xs">
                {language === 'ar'
                  ? 'اختر المظهر المفضل وولد بطاقة إنجازات عالية الدقة لتوثيق ومشاركة مهاراتك السيبرانية على منصات التواصل الاجتماعي.'
                  : 'Select your preferred theme and export a high-definition card summarizing your progress to share on social networks.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Preview & Canvas Area (Left) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400">
                  {language === 'ar' ? 'معاينة بطاقة الإنجاز:' : 'Achievement Card Preview:'}
                </span>

                {/* Styled Interactive HTML Preview */}
                <div
                  className={`w-full aspect-[1.91/1] rounded-xl bg-gradient-to-br ${currentTheme.bgGrad} border ${currentTheme.borderClass} p-6 flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Grid effect background */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                  {/* Header Row */}
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                        <Shield className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                          {language === 'ar' ? 'الأكاديمية السيبرانية' : 'CYBER ACADEMY'}
                        </h4>
                        <span className="text-[9px] text-slate-500 font-mono">SAUDI ARABIA</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-800/80 bg-slate-950/20">
                      STATUS: VERIFIED
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="text-center space-y-2 my-auto relative z-10">
                    <h3 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">{user.name}</h3>
                    <div className="inline-flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                        {language === 'ar' ? 'رتبة الأمان الحالية' : 'Current Security Rank'}
                      </span>
                      <div className={`px-4 py-1 rounded-full text-xs font-bold border`} style={{ borderColor: currentTheme.accentColor + '50', backgroundColor: 'rgba(15,23,42,0.8)' }}>
                        <span className={currentTheme.accentText}>{currentRank}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Block Grid */}
                  <div className="grid grid-cols-4 gap-3 relative z-10">
                    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5 text-center">
                      <span className="text-lg md:text-xl font-black font-mono block text-slate-100">+{user.points}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{language === 'ar' ? 'نقاط (XP)' : 'Total XP'}</span>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5 text-center">
                      <span className="text-lg md:text-xl font-black font-mono block text-slate-100">{user.completedLessons.length}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{language === 'ar' ? 'دروس منجزة' : 'Lessons'}</span>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5 text-center">
                      <span className="text-lg md:text-xl font-black font-mono block text-slate-100">{user.solvedLabs.length}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{language === 'ar' ? 'معامل محلولة' : 'Labs'}</span>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5 text-center">
                      <span className="text-lg md:text-xl font-black font-mono block text-slate-100">{user.badges.length}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{language === 'ar' ? 'أوسمة' : 'Badges'}</span>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-800/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      {language === 'ar' ? 'عضو نشط منذ ٢٠٢٦' : 'Active Member since 2026'}
                    </span>
                    <span>verify.cyberacademy.sa</span>
                  </div>
                </div>

                {/* Hidden Real Canvas used for generating high-res download */}
                <div className="hidden">
                  <canvas ref={canvasRef} />
                </div>
              </div>

              {/* Control Panel / Actions Area (Right) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* 1. Theme Selection */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'مظهر بطاقة الإنجاز:' : 'Card Theme Accent:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                          selectedTheme === theme.id
                            ? 'bg-slate-800/80 border-emerald-500 text-slate-100'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 w-full">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <span className="truncate">{language === 'ar' ? theme.nameAr : theme.nameEn}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Text Box Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400">
                    {language === 'ar' ? 'الرسالة النصية المرافقة:' : 'Attached Caption Text:'}
                  </span>
                  <textarea
                    readOnly
                    value={getShareText()}
                    className="w-full h-32 bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none resize-none leading-relaxed font-sans"
                  />
                </div>

                {/* 3. Export Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black text-sm py-3 rounded-lg transition-all glow-btn cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isGenerating
                        ? language === 'ar'
                          ? 'جاري التوليد...'
                          : 'Generating...'
                        : language === 'ar'
                        ? 'تحميل بطاقة الإنجاز (PNG) 💾'
                        : 'Download PNG Card 💾'}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleCopyText}
                      className="py-2.5 rounded-lg border bg-slate-950 border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ النص' : 'Copy Text')}</span>
                    </button>

                    <button
                      onClick={handleShareTwitter}
                      className="py-2.5 rounded-lg border bg-slate-950 border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Twitter className="w-3.5 h-3.5 text-sky-400" />
                      <span>{language === 'ar' ? 'تغريد' : 'Post to X'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShareLinkedin}
                    className="w-full py-2.5 rounded-lg border bg-slate-950 border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{language === 'ar' ? 'مشاركة عبر LinkedIn' : 'Share on LinkedIn'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
