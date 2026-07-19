import React, { useState, useEffect } from 'react';
import { Shield, Award, BookOpen, Terminal, Trophy, Star, RefreshCw, CheckCircle, Target, Sparkles, HelpCircle, Loader2, Key, Lock, Check, TrendingUp, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Badge } from '../types';
import { ALL_MODULES } from '../data/curriculum';
import { useLanguage } from '../context/LanguageContext';
import GlobalRankings from './GlobalRankings';
import ShareProgress from './ShareProgress';

interface DashboardProps {
  user: User;
  onSelectLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  onChallengeSolved?: (points: number, question: string) => void;
}

export default function Dashboard({ user, onSelectLesson, onResetProgress, onChallengeSolved }: DashboardProps) {
  const { language, t, isRtl } = useLanguage();
  const [chartMetric, setChartMetric] = useState<'lessons' | 'points'>('lessons');
  // Challenge State
  const [challenge, setChallenge] = useState<{
    id: string;
    question: string;
    type: 'text' | 'choice';
    options?: string[];
    points: number;
    hint: string;
    isCompleted: boolean;
  } | null>(null);

  const [dailyAnswer, setDailyAnswer] = useState('');
  const [dailyStatus, setDailyStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);

  // Level State and tracking for Level Up animation
  const currentLevel = Math.floor(user.points / 500) + 1;
  const currentLevelXP = user.points % 500;
  const levelProgressPercentage = Math.round((currentLevelXP / 500) * 100);

  const [prevLevel, setPrevLevel] = useState<number | null>(null);
  const [showLevelUpAnim, setShowLevelUpAnim] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (prevLevel === null) {
      setPrevLevel(currentLevel);
    } else if (currentLevel > prevLevel) {
      setShowLevelUpAnim(true);
      setPrevLevel(currentLevel);
    } else if (currentLevel < prevLevel) {
      setPrevLevel(currentLevel);
    }
  }, [currentLevel, prevLevel]);

  // Helper to check if a lesson is unlocked (linear progression)
  const isLessonUnlocked = (lessonId: string): boolean => {
    const allSeqLessons = [];
    for (const m of ALL_MODULES) {
      allSeqLessons.push(...m.lessons);
    }
    const currentIdx = allSeqLessons.findIndex((l) => l.id === lessonId);
    if (currentIdx <= 0) return true; // first lesson is always unlocked
    const previousLesson = allSeqLessons[currentIdx - 1];
    return (user.completedLessons || []).includes(previousLesson.id);
  };

  // Fetch today's challenge
  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/daily-challenge');
      if (res.ok) {
        const data = await res.json();
        setChallenge(data);
      }
    } catch (err) {
      console.error('Error fetching daily challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  // Determine if today's challenge is completed
  const isChallengeCompleted = challenge
    ? (user.completedDailyChallenges?.includes(challenge.id) || challenge.isCompleted)
    : false;

  const handleDailySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || isChallengeCompleted) return;

    setDailyStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/user/daily-challenge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          answer: dailyAnswer
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDailyStatus('success');
          if (onChallengeSolved) {
            onChallengeSolved(data.pointsAwarded, challenge.question);
          }
        } else {
          setDailyStatus('error');
          setErrorMessage(data.error || 'إجابة خاطئة! حاول مجدداً.');
        }
      } else {
        const errData = await res.json();
        setDailyStatus('error');
        setErrorMessage(errData.error || 'فشل الاتصال بالخادم.');
      }
    } catch (err) {
      setDailyStatus('error');
      setErrorMessage('حدث خطأ أثناء إرسال الإجابة.');
    }
  };

  // Calculate current rank/level based on points
  let currentRank = language === 'ar' ? 'مخترق أبيض مبتدئ (Apprentice)' : 'Apprentice';
  let rankColor = 'text-slate-400 bg-slate-900 border-slate-800';
  let nextRankPoints = 300;
  let progressToNext = Math.min(100, Math.round((user.points / nextRankPoints) * 100));

  if (user.points > 600) {
    currentRank = language === 'ar' ? 'حارس الأمن السيبراني (Cyber Sentinel)' : 'Cyber Sentinel';
    rankColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    nextRankPoints = 1000;
    progressToNext = Math.min(100, Math.round((user.points / nextRankPoints) * 100));
  } else if (user.points > 300) {
    currentRank = language === 'ar' ? 'مختبر اختراق نشط (Junior Pentester)' : 'Junior Pentester';
    rankColor = 'text-amber-500 bg-amber-950/40 border-amber-500/20';
    nextRankPoints = 600;
    progressToNext = Math.min(100, Math.round((user.points / nextRankPoints) * 100));
  }

  // Leaderboard list (dynamically showing user points)
  const leaderboard = [
    { name: language === 'ar' ? 'ياسر الرويلي' : 'Yasser Al-Rowaili', points: 1450, badge: 'Cyber Sentinel', active: true },
    { name: language === 'ar' ? 'فاطمة الشمري' : 'Fatima Al-Shammari', points: 1210, badge: 'Cyber Sentinel', active: false },
    { name: language === 'ar' ? 'محمد البلوي' : 'Mohammad Al-Balawi', points: 980, badge: 'Junior Pentester', active: false },
    { name: user.name, points: user.points, badge: language === 'ar' ? currentRank.split(' ')[0] : currentRank, active: true, isMe: true },
    { name: language === 'ar' ? 'بدر العتيبي' : 'Badr Al-Otaibi', points: 420, badge: 'Junior Pentester', active: false },
    { name: language === 'ar' ? 'ليلى الحربي' : 'Layla Al-Harbi', points: 280, badge: 'Apprentice', active: false },
  ].sort((a, b) => b.points - a.points);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
      default:
        return <Shield className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans" id="student-dashboard" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Welcome Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10 text-right w-full">
            <div className="space-y-2 flex-1">
              <span className="text-xs text-emerald-400 font-bold tracking-wider">
                {language === 'ar' ? 'مرحباً بك مجدداً في ساحة التدريب' : 'Welcome back to the training ground'}
              </span>
              <h2 className="text-2xl font-extrabold">{user.name}</h2>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                {language === 'ar'
                  ? 'تتحسن مهاراتك الأمنية باستمرار. استكمل دروس الوحدة التدريبية الحالية لتفادي الثغرات ورفع أذوناتك البرمجية.'
                  : 'Your security skills are continuously improving. Complete the current training module lessons to prevent vulnerabilities and elevate your permissions.'}
              </p>
            </div>
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-4 py-2 bg-emerald-950/40 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-start shadow-[0_0_10px_rgba(16,185,129,0.05)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'مشاركة التقدم 🚀' : 'Share Progress 🚀'}</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {language === 'ar' ? 'مستوى الأذونات الحالي: ' : 'Current Privilege Level: '}{' '}
                <strong className={`px-2 py-0.5 rounded border text-[10px] ${rankColor}`}>{currentRank}</strong>
              </span>
              <span className="text-slate-500 font-mono">
                {user.points} / {nextRankPoints} {language === 'ar' ? 'نقطة' : 'XP'}
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{language === 'ar' ? `${user.points} نقطة إجمالية` : `${user.points} total points`}</span>
              <span>
                {language === 'ar' ? `المستوى التالي: ${nextRankPoints} نقطة` : `Next Rank: ${nextRankPoints} XP`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-center">
            <BookOpen className="w-5 h-5 text-emerald-400 mx-auto" />
            <div className="space-y-1 mt-2">
              <span className="text-slate-400 text-[10px] block">{language === 'ar' ? 'الدروس المكتملة' : 'Completed Lessons'}</span>
              <span className="text-2xl font-extrabold font-mono text-slate-100">{user.completedLessons.length}</span>
            </div>
            <button
              onClick={() => onSelectLesson('m2-l1')}
              className="text-[10px] text-emerald-400 hover:underline mt-2 cursor-pointer"
            >
              {language === 'ar' ? 'استكمل التعلم' : 'Resume Learning'}
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-center">
            <Terminal className="w-5 h-5 text-emerald-400 mx-auto" />
            <div className="space-y-1 mt-2">
              <span className="text-slate-400 text-[10px] block">{language === 'ar' ? 'المعامل المحلولة' : 'Solved Labs'}</span>
              <span className="text-2xl font-extrabold font-mono text-slate-100">{user.solvedLabs.length}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">
              {language === 'ar' ? 'من معامل Linux / Web' : 'of Linux / Web labs'}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-center">
            <div className="flex flex-col items-center justify-center space-y-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-[10px] block mt-1">{language === 'ar' ? 'مجموع النقاط (XP)' : 'Total Points (XP)'}</span>
              <span className="text-xl font-black font-mono text-slate-100">+{user.points} XP</span>
            </div>
            <span className="text-[9px] text-slate-500 mt-2 block leading-snug">
              {language === 'ar' ? 'نقاط تقدمك العام' : 'Your general progress points'}
            </span>
          </div>

          {/* Level Up Card with motion animation */}
          <motion.div 
            animate={showLevelUpAnim ? { 
              boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 15px rgba(16,185,129,0.5)", "0 0 0px rgba(16,185,129,0)"],
              borderColor: ["#1e293b", "#10b981", "#1e293b"]
            } : {}}
            transition={{ duration: 1.5, repeat: showLevelUpAnim ? Infinity : 0 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-center relative overflow-hidden"
          >
            <div className={`space-y-1.5 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                  <span>⭐</span> {language === 'ar' ? 'المستوى' : 'Level'}
                </span>
                <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">Lvl {currentLevel}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>{currentLevelXP} XP</span>
                  <span>{500 - currentLevelXP} {language === 'ar' ? 'XP للترقية' : 'XP to level up'}</span>
                </div>
                
                {/* Level Up Progress Bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/60">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgressPercentage}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            <span className="text-[9px] text-slate-500 mt-2 block">{language === 'ar' ? 'يزداد المستوى كل 500 XP' : 'Level increases every 500 XP'}</span>
          </motion.div>
        </div>
      </div>

      {/* Performance Chart and Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Interactive Progress Chart */}
          {(() => {
            const getPastDaysData = () => {
              const data = [];
              const totalCompleted = user.completedLessons?.length || 0;
              const totalPoints = user.points || 0;
              const startPoints = 100; // starting points
              
              const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
              const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              
              for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                
                const dayName = language === 'ar' 
                  ? arabicDays[date.getDay()] 
                  : englishDays[date.getDay()];
                  
                const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
                
                const ratio = (6 - i) / 6;
                const curveRatio = Math.pow(ratio, 1.4); 
                
                const lessonsVal = Math.round(totalCompleted * curveRatio);
                const pointsVal = startPoints + Math.round((totalPoints - startPoints) * curveRatio);
                
                data.push({
                  day: dayName,
                  date: dateStr,
                  lessons: lessonsVal,
                  points: pointsVal,
                });
              }
              return data;
            };

            const chartData = getPastDaysData();

            const CustomTooltip = ({ active, payload, label }: any) => {
              if (active && payload && payload.length) {
                const isLessons = chartMetric === 'lessons';
                return (
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-xl text-right text-xs space-y-1">
                    <p className="font-bold text-slate-300 font-mono">{label} ({payload[0].payload.date})</p>
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-slate-500">
                        {isLessons 
                          ? (language === 'ar' ? 'الدروس المكتملة:' : 'Completed Lessons:') 
                          : (language === 'ar' ? 'نقاط الخبرة XP:' : 'Experience Points XP:')}
                      </span>
                      <span className="font-black text-emerald-400 font-mono">
                        {isLessons ? `${payload[0].value} / 20` : `+${payload[0].value} XP`}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            };

            return (
              <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 h-full flex flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="space-y-1">
                      <h3 className={`text-sm font-extrabold flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                        <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <span>{language === 'ar' ? 'مخطط الأداء ومعدل التقدم المنهجي' : 'Performance Chart & Curriculum Progress'}</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {language === 'ar'
                          ? 'رسم بياني تفاعلي يوضح وتيرة تقدمك والدروس المنجزة ونقاط الخبرة عبر الوقت لتحفيزك على مواصلة التعلم والتدريب.'
                          : 'Interactive chart illustrating your completion rate, lessons mastered, and XP points over time to fuel your learning consistency.'}
                      </p>
                    </div>

                    {/* Metric toggle controls */}
                    <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0 self-start sm:self-auto">
                      <button
                        onClick={() => setChartMetric('lessons')}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                          chartMetric === 'lessons'
                            ? 'bg-emerald-600 text-slate-950 font-black'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {language === 'ar' ? 'الدروس المكتملة' : 'Completed Lessons'}
                      </button>
                      <button
                        onClick={() => setChartMetric('points')}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                          chartMetric === 'points'
                            ? 'bg-emerald-600 text-slate-950 font-black'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {language === 'ar' ? 'نقاط الخبرة XP' : 'XP Points'}
                      </button>
                    </div>
                  </div>

                  {/* Real-time Insights Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 text-center mt-4">
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] block">{language === 'ar' ? 'معدل الحماس والانتظام' : 'Streak & Consistency'}</span>
                      <span className="text-xs font-extrabold text-emerald-400">
                        {language === 'ar' ? 'نشط ومستمر 🔥' : 'Active Learner 🔥'}
                      </span>
                    </div>
                    <div className="space-y-0.5 border-t sm:border-t-0 sm:border-x border-slate-800/60 py-2 sm:py-0">
                      <span className="text-slate-500 text-[10px] block">{language === 'ar' ? 'الهدف المنجز هذا الأسبوع' : 'Target Achieved This Week'}</span>
                      <span className="text-xs font-extrabold text-slate-200 font-mono">
                        {chartMetric === 'lessons'
                          ? (language === 'ar' ? `${user.completedLessons?.length || 0} درس` : `${user.completedLessons?.length || 0} lessons`)
                          : `+${user.points - 100} XP`}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] block">{language === 'ar' ? 'التقدير التراكمي' : 'Cumulative Rating'}</span>
                      <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'متميز (A+)' : 'Excellent (A+)'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recharts Container */}
                <div className="w-full bg-slate-950/60 rounded-xl p-4 border border-slate-800/50 mt-4">
                  <div className="h-72 w-full" dir="ltr"> {/* Recharts requires ltr internally for proper positioning */}
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis 
                          dataKey="day" 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false}
                          axisLine={{ stroke: '#1e293b' }}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false}
                          axisLine={{ stroke: '#1e293b' }}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey={chartMetric} 
                          stroke="#10b981" 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill="url(#colorMetric)" 
                          activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2, fill: '#10b981' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="lg:col-span-1">
          <GlobalRankings currentUser={user} />
        </div>
      </div>

      {/* Progress Roadmap Section */}
      <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className={`text-sm font-extrabold flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <Target className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>{language === 'ar' ? 'خريطة طريق المسار التعليمي والتقدم الفني (Progress Roadmap)' : 'Learning Roadmap & Technical Progress'}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'ar'
                ? 'تابع خطوات تقدمك السيبراني واجتياز المستويات. انقر على أي درس متاح لفتحه والبدء بالتطبيق الفوري!'
                : 'Track your cybersecurity progress and complete levels. Click any available lesson to start practicing instantly!'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
              <span>{language === 'ar' ? 'مكتمل' : 'Completed'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-emerald-400 block animate-pulse"></span>
              <span>{language === 'ar' ? 'متاح حالياً' : 'Available'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 block"></span>
              <span>{language === 'ar' ? 'مغلق' : 'Locked'}</span>
            </div>
          </div>
        </div>

        {/* Overall Course Progress Bar */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <span className="text-xs font-extrabold text-slate-200 block">
                {language === 'ar' ? 'شريط تقدم المسار المنهجي العام' : 'Overall Course Progress Bar'}
              </span>
              <span className="text-[10px] text-slate-500">
                {language === 'ar'
                  ? 'مجموع الدروس المنجزة في كافة الوحدات التعليمية للأكاديمية'
                  : 'Total completed lessons across all training modules in the academy'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-xs font-mono text-emerald-400 font-extrabold bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                {language === 'ar'
                  ? `${user.completedLessons.length} / 20 درس مكتمل (${Math.round((user.completedLessons.length / 20) * 100)}%)`
                  : `${user.completedLessons.length} / 20 Lessons Completed (${Math.round((user.completedLessons.length / 20) * 100)}%)`}
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800/60 p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((user.completedLessons.length / 20) * 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {ALL_MODULES.map((module, mIdx) => {
            const completedInModule = module.lessons.filter(l => (user.completedLessons || []).includes(l.id)).length;
            const totalInModule = module.lessons.length;
            const isModuleCompleted = completedInModule === totalInModule;
            const modulePct = Math.round((completedInModule / totalInModule) * 100);
            const arabicLevels = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس'];

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: mIdx * 0.1 }}
                className={`border rounded-xl p-4 relative overflow-hidden transition-all ${
                  isModuleCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/5 shadow-md shadow-emerald-950/5'
                    : 'bg-slate-950/30 border-slate-800/80 hover:border-slate-800'
                }`}
              >
                {/* Level Title and Checkmark Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/40">
                  <div className={`flex items-center gap-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      isModuleCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-900 border border-slate-800 text-emerald-400 font-mono'
                    }`}>
                      {mIdx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {language === 'ar' ? `المستوى ${arabicLevels[mIdx] || (mIdx + 1)}` : `Module ${mIdx + 1}`}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-200">
                        {language === 'ar' ? module.title : module.titleEn || module.title}
                      </h4>
                    </div>
                  </div>

                  {/* Level Complete / Checkmark Badge */}
                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                    {isModuleCompleted ? (
                      <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        <span>{language === 'ar' ? 'مستوى مكتمل بالكامل ✓' : 'Module Fully Completed ✓'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {language === 'ar'
                          ? `التقدم: ${completedInModule} / ${totalInModule} درس (${modulePct}%)`
                          : `Progress: ${completedInModule} / ${totalInModule} Lessons (${modulePct}%)`}
                      </span>
                    )}

                    {/* Miniature Progress Bar */}
                    <div className="w-20 bg-slate-900 h-1.5 rounded-full overflow-hidden shrink-0">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isModuleCompleted ? 'bg-emerald-500' : 'bg-emerald-500/70'
                        }`}
                        style={{ width: `${modulePct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className={`text-[10px] text-slate-400 leading-relaxed mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? module.description : module.descriptionEn || module.description}
                </p>

                {/* Horizontal Lesson Steps Path */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {module.lessons.map((lesson, lIdx) => {
                    const isDone = (user.completedLessons || []).includes(lesson.id);
                    const isUnlocked = isLessonUnlocked(lesson.id);

                    return (
                      <motion.div
                        key={lesson.id}
                        onClick={() => isUnlocked && onSelectLesson(lesson.id)}
                        whileHover={isUnlocked ? { scale: 1.02, y: -2, borderColor: 'rgba(16, 185, 129, 0.4)' } : {}}
                        className={`border p-3 rounded-lg flex flex-col justify-between transition-all min-h-[100px] relative ${isRtl ? 'text-right' : 'text-left'} ${
                          isDone
                            ? 'bg-emerald-950/10 border-emerald-500/20 hover:bg-emerald-950/20 hover:border-emerald-500/40 cursor-pointer'
                            : isUnlocked
                              ? 'bg-slate-900 border-slate-700 hover:border-emerald-500/40 cursor-pointer shadow-sm shadow-emerald-500/5'
                              : 'bg-slate-950/80 border-slate-900 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-500 font-mono">
                              {language === 'ar' ? `الخطوة ${lIdx + 1}` : `Step ${lIdx + 1}`}
                            </span>
                            {isDone ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : isUnlocked ? (
                              <BookOpen className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                            ) : (
                              <Lock className="w-3 h-3 text-slate-600 shrink-0" />
                            )}
                          </div>
                          <h5 className="text-[11px] font-extrabold text-slate-200 line-clamp-2 leading-relaxed">
                            {language === 'ar' ? lesson.title : lesson.titleEn || lesson.title}
                          </h5>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/50 text-[9px] text-slate-500">
                          <span>
                            {language === 'ar' ? lesson.duration : lesson.duration.replace('دقيقة', 'mins').replace('ساعات', 'hrs').replace('ساعة', 'hr')}
                          </span>
                          <div className="flex gap-1">
                            {lesson.hasLab && (
                              <span className="bg-slate-950 border border-slate-800 text-emerald-400 px-1 rounded font-bold text-[8px]">
                                {language === 'ar' ? 'معمل 💻' : 'Lab 💻'}
                              </span>
                            )}
                            {lesson.hasQuiz && (
                              <span className="bg-slate-950 border border-slate-800 text-amber-400 px-1 rounded font-bold text-[8px]">
                                {language === 'ar' ? 'س/ج 📝' : 'Quiz 📝'}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badges & Leaders row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unlocked Badges */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className={`text-sm font-bold flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <Star className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? `الأوسمة والشارات المكتسبة (${user.badges.length})` : `Earned Badges & Achievements (${user.badges.length})`}</span>
            </h3>
            <span className="text-[10px] text-slate-500">{language === 'ar' ? 'افتح المزيد بإنهاء المعامل' : 'Unlock more by finishing labs'}</span>
          </div>

          {user.badges.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              {language === 'ar' ? 'لم تكتسب أي شارات بعد. ابدأ بأول درس أو معمل!' : 'No badges earned yet. Start with your first lesson or lab!'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.badges.map((badge) => (
                <div key={badge.id} className={`bg-slate-950/70 border border-slate-800 rounded-lg p-3 flex items-start ${isRtl ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
                  <div className="bg-emerald-950 p-2.5 rounded border border-emerald-500/20 shrink-0">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <h4 className="text-xs font-bold text-slate-200">
                      {language === 'ar' ? badge.name : badge.name === 'بداية الرحلة' ? 'Beginning of Journey' : badge.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {language === 'ar' ? badge.description : badge.description === 'سجلت بنجاح في المنصة التعليمية وأنهيت أول دروسك.' ? 'Successfully registered on the platform and completed your first lesson.' : badge.description === 'سجلت بنجاح في المنصة التعليمية وبدأت مسيرتك.' ? 'Successfully registered on the platform and started your journey.' : badge.description}
                    </p>
                    <span className="text-[9px] text-slate-600 block">
                      {language === 'ar' ? `اكتسبت في: ${new Date(badge.unlockedAt).toLocaleDateString('ar-SA')}` : `Earned on: ${new Date(badge.unlockedAt).toLocaleDateString('en-US')}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Leaderboards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className={`text-sm font-bold flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <Trophy className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>{language === 'ar' ? 'قائمة الصدارة - أفضل 5 طلاب (Leaderboard)' : 'Leaderboard - Top 5 Students'}</span>
            </h3>
            <span className="text-[9px] text-slate-500 font-mono animate-pulse">{language === 'ar' ? 'تحديث مباشر ⚡' : 'Live Update ⚡'}</span>
          </div>

          <div className="space-y-2.5 overflow-hidden">
            {leaderboard.slice(0, 5).map((ld, i) => (
              <motion.div
                key={ld.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                  ld.isMe
                    ? 'bg-emerald-950/50 border border-emerald-400/40 shadow-sm shadow-emerald-500/10'
                    : 'bg-slate-950/40 border border-slate-900 hover:border-slate-800'
                }`}
              >
                <div className={`flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    i === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950' :
                    i === 1 ? 'bg-slate-300 text-slate-950' :
                    i === 2 ? 'bg-amber-700 text-slate-950' :
                    'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold ${ld.isMe ? 'text-emerald-400 font-extrabold' : 'text-slate-200'}`}>
                      {ld.name}
                    </span>
                    {ld.isMe && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-bold px-1 py-0.2 rounded border border-emerald-500/20 animate-pulse">
                        {language === 'ar' ? 'أنت' : 'You'}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                  <span className="text-[9px] text-slate-500">
                    {language === 'ar' ? ld.badge : ld.badge === 'حارس' ? 'Cyber Sentinel' : ld.badge === 'مختبر' ? 'Junior Pentester' : ld.badge}
                  </span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/10">{ld.points} XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Challenge & Reset row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily CTF / Cyber Challenge */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className={`flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <Target className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold">
                {language === 'ar' ? 'التحدي الأمني اليومي السريع (Daily Challenge)' : 'Daily Security Challenge'}
              </h3>
            </div>
            {challenge && (
              <span className={`text-[10px] font-mono font-bold bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
                <Sparkles className="w-3 h-3 animate-bounce" />
                +{challenge.points} {language === 'ar' ? 'نقطة' : 'XP'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
              <p className="text-[11px] text-slate-400">
                {language === 'ar' ? 'جاري تحميل تحدي اليوم الأمني...' : 'Loading today\'s security challenge...'}
              </p>
            </div>
          ) : challenge ? (
            <div className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {language === 'ar'
                    ? challenge.question
                    : challenge.id === 'challenge-1'
                      ? 'What is the default port number for the secure and encrypted HTTPS web protocol?'
                      : challenge.id === 'challenge-2'
                        ? 'What is the name of the file in the Linux operating system that contains the hashed passwords of users?'
                        : challenge.id === 'challenge-3'
                          ? 'What type of attack involves an attacker injecting malicious scripts (like JavaScript) into web pages visited by other users?'
                          : challenge.question}
                </p>
              </div>

              {isChallengeCompleted ? (
                <div className="flex flex-col items-center justify-center gap-2 bg-emerald-950/40 border border-emerald-500/20 p-5 rounded-xl text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-400">
                      {language === 'ar' ? 'عمل رائع وموفق!' : 'Excellent Work!'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {language === 'ar'
                        ? 'لقد اقتنصت هذا التحدي وحصلت على النقاط بنجاح اليوم! ارجع غداً لتحدٍّ سيبراني جديد.'
                        : 'You successfully captured today\'s challenge and earned points! Return tomorrow for a new cybersecurity challenge.'}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDailySubmit} className="space-y-4">
                  {challenge.type === 'choice' && challenge.options ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {challenge.options.map((opt, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center p-3 rounded-lg border text-xs cursor-pointer transition-all ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'} ${
                            dailyAnswer === opt
                              ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="daily-choice"
                            value={opt}
                            checked={dailyAnswer === opt}
                            onChange={() => {
                              setDailyAnswer(opt);
                              setErrorMessage('');
                            }}
                            className="accent-emerald-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch gap-2">
                      <input
                        type="text"
                        value={dailyAnswer}
                        onChange={(e) => {
                          setDailyAnswer(e.target.value);
                          setErrorMessage('');
                        }}
                        placeholder={language === 'ar' ? 'أدخل إجابتك النصية هنا...' : 'Enter your text answer here...'}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono flex-1 placeholder:text-slate-600 text-center"
                        required
                        disabled={dailyStatus === 'submitting'}
                      />
                    </div>
                  )}

                  {/* Hints and Error block */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showHint ? (language === 'ar' ? 'إخفاء التلميح' : 'Hide Hint') : (language === 'ar' ? 'طلب تلميح مساعد' : 'Request Hint')}</span>
                      </button>

                      {showHint && (
                        <span className="text-[10px] text-amber-400 bg-amber-950/30 border border-amber-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                          {language === 'ar'
                            ? challenge.hint
                            : challenge.id === 'challenge-1'
                              ? 'Consists of 3 digits and starts with 4.'
                              : challenge.id === 'challenge-2'
                                ? 'It refers to shadow and is located under the etc folder.'
                                : challenge.id === 'challenge-3'
                                  ? 'XSS represents Cross-Site Scripting.'
                                  : challenge.hint}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={dailyStatus === 'submitting' || !dailyAnswer.trim()}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold px-6 py-2 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {dailyStatus === 'submitting' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</span>
                        </>
                      ) : (
                        <span>{language === 'ar' ? 'تحقق من الإجابة' : 'Check Answer'}</span>
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/20 text-rose-400 text-xs font-bold leading-normal">
                      {language === 'ar'
                        ? errorMessage
                        : errorMessage.includes('خاطئة')
                          ? 'Incorrect answer! Try again.'
                          : 'Verification failed. Please try again.'}
                    </div>
                  )}
                </form>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">
              {language === 'ar' ? 'عذراً، لم نتمكن من جلب تحدي اليوم السريع.' : 'Sorry, we couldn\'t fetch today\'s quick challenge.'}
            </p>
          )}
        </div>

        {/* Sandbox Admin Reset Card */}
        <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
          <div>
            <h3 className={`text-sm font-bold flex items-center border-b border-slate-800 pb-3 ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
              <RefreshCw className="w-4 h-4 text-rose-500" />
              <span>{language === 'ar' ? 'إعادة تهيئة الحساب (Reset Progress)' : 'Reset Progress'}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-3">
              {language === 'ar'
                ? 'هل تريد مسح ملف تقدمك الحالي وإعادة جميع النقاط والمعامل المحلولة لصفر لتجربة مسار تعليمي نظيف ومستقل؟'
                : 'Do you want to clear your current progress and reset all points and solved labs to zero for a clean start?'}
            </p>
          </div>
          <button
            onClick={() => {
              const confirmMsg = language === 'ar'
                ? 'هل أنت متأكد تماماً من رغبتك في تصفير جميع نقاطك، شاراتك، وتقدمك وإعادة ضبط التحديات؟'
                : 'Are you absolutely sure you want to reset all points, badges, and progress?';
              if (window.confirm(confirmMsg)) {
                onResetProgress();
              }
            }}
            className="w-full bg-rose-950/40 hover:bg-rose-900/30 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold py-2 rounded mt-4 transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'مسح وإعادة ضبط البيانات' : 'Wipe and Reset Data'}
          </button>
        </div>
      </div>

      {/* Level Up Celebration Modal */}
      {showLevelUpAnim && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Bursting/scaling effect */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none"
            >
              <div className="w-64 h-64 border-4 border-dashed border-emerald-400 rounded-full" />
            </motion.div>

            {/* Level Up Trophy / Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, -10, 10, 0]
              }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: 1 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6"
            >
              <Trophy className="w-10 h-10 text-slate-950" />
            </motion.div>

            {/* Main Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-pulse">
                {language === 'ar' ? 'ترقية المستوى! (Level Up)' : 'Level Up!'}
              </h3>
              <p className="text-slate-300 text-sm">
                {language === 'ar' ? 'تهانينا! لقد ارتفع مستواك الأمني في الأكاديمية' : 'Congratulations! Your academy security clearance level has increased.'}
              </p>
            </motion.div>

            {/* New Level Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.6 }}
              className={`my-6 inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-6 py-2.5 rounded-full font-black text-lg ${isRtl ? 'flex-row' : 'flex-row'}`}
            >
              <span>{language === 'ar' ? 'المستوى' : 'Level'}</span>
              <span className="font-mono text-xl text-slate-100">{currentLevel}</span>
            </motion.div>

            {/* Level stats */}
            <p className="text-slate-400 text-xs">
              {language === 'ar' ? 'استمر في التقدم لحصد المزيد من النقاط وحل المعامل المتقدمة!' : 'Keep progressing to harvest more points and tackle advanced labs!'}
            </p>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLevelUpAnim(false)}
              className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl font-extrabold text-xs transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'موافق، واصل التميز! 👍' : 'Awesome, Keep Going! 👍'}
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Share Progress Modal */}
      <ShareProgress user={user} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}
