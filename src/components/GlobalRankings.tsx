import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Search, Flame, Target, User, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';
import { User as UserType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GlobalRankingsProps {
  currentUser: UserType;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  isCurrentUser?: boolean;
  role?: string;
  avatarSeed?: string;
  badgeCount?: number;
}

export default function GlobalRankings({ currentUser }: GlobalRankingsProps) {
  const { language, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Static list of top cybersecurity students (realistic simulated profiles)
  const simulatedStudents = useMemo<LeaderboardEntry[]>(() => [
    { id: 'sim-1', name: 'أحمد الحربي', points: 1450, role: 'Student', badgeCount: 8 },
    { id: 'sim-2', name: 'سارة الشمري', points: 1280, role: 'Student', badgeCount: 6 },
    { id: 'sim-3', name: 'عبدالعزيز المقبل', points: 940, role: 'Student', badgeCount: 5 },
    { id: 'sim-4', name: 'أريج المطيري', points: 820, role: 'Student', badgeCount: 4 },
    { id: 'sim-5', name: 'خالد الدوسري', points: 680, role: 'Student', badgeCount: 3 },
    { id: 'sim-6', name: 'نورة السديري', points: 510, role: 'Student', badgeCount: 3 },
    { id: 'sim-7', name: 'ريما الغامدي', points: 380, role: 'Student', badgeCount: 2 },
    { id: 'sim-8', name: 'عبدالله القحطاني', points: 260, role: 'Student', badgeCount: 1 },
    { id: 'sim-9', name: 'فيصل بن خالد', points: 180, role: 'Student', badgeCount: 1 },
  ], []);

  // Merge current user dynamically and sort
  const leaderboardData = useMemo(() => {
    // Check if current user is already in simulated list (avoid duplicate)
    const filteredSimulated = simulatedStudents.filter(
      (s) => s.name.trim() !== currentUser.name.trim() && s.id !== currentUser.id
    );

    const mergedList: LeaderboardEntry[] = [
      ...filteredSimulated,
      {
        id: currentUser.id,
        name: currentUser.name,
        points: currentUser.points,
        isCurrentUser: true,
        role: currentUser.role,
        badgeCount: currentUser.badges?.length || 1,
      },
    ];

    // Sort descending by points
    return mergedList.sort((a, b) => b.points - a.points);
  }, [currentUser, simulatedStudents]);

  // Find current user's rank and index
  const { userRank, nextCompetitor } = useMemo(() => {
    const index = leaderboardData.findIndex((s) => s.isCurrentUser);
    const rank = index !== -1 ? index + 1 : 0;
    const nextComp = index > 0 ? leaderboardData[index - 1] : null;
    return { userRank: rank, nextCompetitor: nextComp };
  }, [leaderboardData]);

  // Filter list by search query
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return leaderboardData;
    const cleanQuery = searchQuery.toLowerCase().trim();
    return leaderboardData.filter((s) => s.name.toLowerCase().includes(cleanQuery));
  }, [leaderboardData, searchQuery]);

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <h3 className={`text-sm font-extrabold flex items-center ${isRtl ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>{language === 'ar' ? 'لوحة الشرف الصدارة والترتيب العام' : 'Global Leaderboard & Honor Roll'}</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            {language === 'ar'
              ? 'تحدّ زملائك واجمع نقاط الخبرة XP من خلال إنهاء الدروس والتحقق من معامل البث المباشر لتتصدر الترتيب العام.'
              : 'Compete with peers and earn XP points by completing lessons and verifying live docker labs to dominate the board.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 right-3 flex items-center pl-2 pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن طالب...' : 'Search student...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pr-9 pl-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Competitive Motivation Card */}
      {nextCompetitor && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right"
        >
          <div className="flex items-center gap-3 flex-col sm:flex-row">
            <div className="bg-emerald-500/10 p-2.5 rounded-full border border-emerald-500/20">
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {language === 'ar' 
                  ? `باقي لك فقط ${nextCompetitor.points - currentUser.points} نقطة لتتجاوز المنافس ${nextCompetitor.name}!`
                  : `Just ${nextCompetitor.points - currentUser.points} XP left to overtake ${nextCompetitor.name}!`}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'قم بحل المعامل الإضافية أو اجتياز الاختبارات القصيرة للحصول على نقاط سريعة.'
                  : 'Solve additional labs or pass quick quizzes to secure instant XP.'}
              </p>
            </div>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-center shrink-0">
            <span className="text-[9px] text-slate-500 block">{language === 'ar' ? 'ترتيبك الحالي' : 'Your Current Rank'}</span>
            <span className="text-sm font-black text-amber-400 font-mono">#{userRank}</span>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Table List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {filteredLeaderboard.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {language === 'ar' ? 'لم يتم العثور على نتائج تطابق البحث.' : 'No matching students found.'}
          </div>
        ) : (
          filteredLeaderboard.map((student, idx) => {
            const actualRank = leaderboardData.findIndex(s => s.id === student.id) + 1;
            const isTop3 = actualRank <= 3;
            const isMe = student.isCurrentUser;

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isMe
                    ? 'bg-gradient-to-l from-emerald-950/50 via-emerald-950/20 to-slate-950 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.06)]'
                    : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Number / Medal */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {actualRank === 1 ? (
                      <Trophy className="w-5 h-5 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
                    ) : actualRank === 2 ? (
                      <Medal className="w-5 h-5 text-slate-300 drop-shadow-[0_0_4px_rgba(203,213,225,0.5)]" />
                    ) : actualRank === 3 ? (
                      <Medal className="w-5 h-5 text-amber-700 drop-shadow-[0_0_4px_rgba(180,83,9,0.5)]" />
                    ) : (
                      <span className="text-xs font-bold text-slate-500 font-mono">#{actualRank}</span>
                    )}
                  </div>

                  {/* Student Avatar Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                    isMe 
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                      : isTop3 
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-slate-950 border-slate-900 text-slate-500'
                  }`}>
                    {isMe ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Name and Badges count */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-bold ${isMe ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {student.name}
                      </span>
                      {isMe && (
                        <span className="text-[9px] bg-emerald-600 text-slate-950 px-1.5 py-0.2 rounded font-black">
                          {language === 'ar' ? 'أنت' : 'You'}
                        </span>
                      )}
                      {actualRank === 1 && (
                        <span className="text-[9px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-1 rounded font-bold flex items-center gap-0.5">
                          <Award className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'الأول' : 'Leader'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium">
                      {language === 'ar' 
                        ? `طالب • ${student.badgeCount || 1} أوسمة مسجلة` 
                        : `Student • ${student.badgeCount || 1} earned badges`}
                    </p>
                  </div>
                </div>

                {/* Points XP display */}
                <div className="text-left font-mono">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-black ${isMe ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {student.points}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">XP</span>
                  </div>
                  <span className="text-[8px] text-slate-600 block text-left">
                    {language === 'ar' ? 'نقاط التقييم' : 'Eval Points'}
                  </span>
                </div>

              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
