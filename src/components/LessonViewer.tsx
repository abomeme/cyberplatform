import { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Download, ChevronRight, FileText, HelpCircle, Terminal, Eye, ShieldCheck, ListCollapse, Sparkles, Code, Cpu, Check, X, Globe, Key, Radio, Bug, Cloud, GitBranch, Zap, Flame, Users, Smartphone, Search, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { CourseModule, Lesson, User } from '../types';
import TerminalSimulator from './TerminalSimulator';
import QuizViewer from './QuizViewer';
import DroneLabEmulator from './DroneLabEmulator';
import AILabEmulator from './AILabEmulator';
import CyberSecurityWiki from './CyberSecurityWiki';
import { generateGuideHtml } from '../utils/guideGenerator';
import { useLanguage } from '../context/LanguageContext';

const getToolExplanation = (tool: string, language: string): string => {
  const dict: { [key: string]: { ar: string; en: string } } = {
    'ls': { ar: 'عرض الملفات والمجلدات في المسار الحالي.', en: 'List files and directories in the current path.' },
    'cd': { ar: 'تغيير المجلد والانتقال داخل شجرة الملفات.', en: 'Change directory and navigate inside the folder tree.' },
    'cat': { ar: 'قراءة محتوى الملفات وطباعتها على الشاشة.', en: 'Read file contents and print them to the screen.' },
    'find': { ar: 'البحث المتقدم عن ملفات النظام والصلاحيات.', en: 'Advanced search for system files and permissions.' },
    'suid-helper': { ar: 'أداة مساعدة لمحاكاة ملفات SUID وصلاحيات الجذر.', en: 'Helper tool simulating SUID files and root permissions.' },
    'nmap': { ar: 'فحص الشبكة واكتشاف المنافذ والخدمات المفتوحة.', en: 'Scan the network and discover open ports and services.' },
    'curl': { ar: 'إرسال واستقبال الطلبات من وإلى خوادم الويب.', en: 'Send and receive HTTP requests to and from web servers.' },
    'grep': { ar: 'تصفية النصوص والبحث عن كلمات محددة بالملفات.', en: 'Filter texts and search for specific patterns in files.' },
    'chmod': { ar: 'تعديل أذونات وصلاحيات الملفات والمجلدات.', en: 'Modify file and folder permissions/ownership.' },
    'ping': { ar: 'اختبار جودة وسرعة الاتصال بالخوادم.', en: 'Test connection latency and packets reachability.' },
    'wireshark': { ar: 'التقاط وفحص حزم بيانات الشبكة النشطة.', en: 'Capture and inspect active network packets.' },
    'hydra': { ar: 'تخمين كلمة المرور وهجوم القوة الغاشمة.', en: 'Brute-force/dictionary attack login pages or SSH.' },
    'sqlmap': { ar: 'فحص واستغلال ثغرات حقن SQL تلقائياً.', en: 'Detect and exploit SQL injection vulnerabilities automatically.' }
  };
  const entry = dict[tool.toLowerCase()];
  if (!entry) return language === 'ar' ? 'أداة برمجية مخصصة لتنفيذ مهام الاختبار والتحقق الفني.' : 'A custom software tool for technical verification and testing.';
  return language === 'ar' ? entry.ar : entry.en;
};

interface LessonViewerProps {
  curriculum: CourseModule[];
  user: User;
  onLessonCompleted: (lessonId: string) => void;
  onLabSolved: (labId: string) => void;
  onRefreshUser: () => void;
  selectedLessonId?: string | null;
  onClearSelectedLesson?: () => void;
}

export default function LessonViewer({
  curriculum,
  user,
  onLessonCompleted,
  onLabSolved,
  onRefreshUser,
  selectedLessonId,
  onClearSelectedLesson,
}: LessonViewerProps) {
  const { language, isRtl } = useLanguage();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'topics' | 'read' | 'video' | 'lab' | 'quiz'>('topics');
  const [showCompletedNotice, setShowCompletedNotice] = useState(false);
  const [prevModuleIndex, setPrevModuleIndex] = useState(0);

  const currentModule = curriculum[activeModuleIndex];
  const currentLesson = currentModule.lessons[activeLessonIndex];

  // Helper to map index to custom cyber skill tree icons
  const getModuleIcon = (idx: number) => {
    const icons = [
      BookOpen,     // 1: Fundamentals
      Terminal,     // 2: Linux CLI
      Cpu,          // 3: Computer Architecture
      Globe,        // 4: Web Application Hacking
      Lock,         // 5: Cryptography
      ShieldCheck,  // 6: Privilege Escalation
      Radio,        // 7: Wireless Security
      Bug,          // 8: Malware Analysis
      Code,         // 9: Reverse Engineering
      Play,         // 10: Drone Hacking
      Cloud,        // 11: Cloud Security
      GitBranch,    // 12: DevSecOps
      Zap,          // 13: Buffer Overflow
      Flame,        // 14: Incident Response
      Eye,          // 15: Threat Hunting
      Users,        // 16: Active Directory
      Smartphone,   // 17: IoT & Mobile Security
      Search,       // 18: Digital Forensics
      Sparkles,     // 19: AI Security
      Trophy        // 20: Capstone
    ];
    return icons[idx % icons.length] || Terminal;
  };

  // Helper to generate a winding/S-curve horizontal alignment for the Skill Tree
  const getAlignmentClass = (idx: number) => {
    const step = idx % 8;
    if (isRtl) {
      switch (step) {
        case 0: return 'justify-center';
        case 1: return 'justify-end pr-4 md:pr-8 lg:pr-4';
        case 2: return 'justify-end pr-10 md:pr-16 lg:pr-10';
        case 3: return 'justify-end pr-4 md:pr-8 lg:pr-4';
        case 4: return 'justify-center';
        case 5: return 'justify-start pl-4 md:pl-8 lg:pl-4';
        case 6: return 'justify-start pl-10 md:pl-16 lg:pl-10';
        case 7: return 'justify-start pl-4 md:pl-8 lg:pl-4';
        default: return 'justify-center';
      }
    } else {
      switch (step) {
        case 0: return 'justify-center';
        case 1: return 'justify-start pl-4 md:pl-8 lg:pl-4';
        case 2: return 'justify-start pl-10 md:pl-16 lg:pl-10';
        case 3: return 'justify-start pl-4 md:pl-8 lg:pl-4';
        case 4: return 'justify-center';
        case 5: return 'justify-end pr-4 md:pr-8 lg:pr-4';
        case 6: return 'justify-end pr-10 md:pr-16 lg:pr-10';
        case 7: return 'justify-end pr-4 md:pr-8 lg:pr-4';
        default: return 'justify-center';
      }
    }
  };

  // Find the first module index that has incomplete lessons
  const currentTargetModIdx = curriculum.findIndex((mod) => {
    const completedInMod = mod.lessons.filter((l) => user.completedLessons.includes(l.id)).length;
    return completedInMod < mod.lessonsCount;
  });
  const targetModIdx = currentTargetModIdx === -1 ? curriculum.length - 1 : currentTargetModIdx;

  // Scroll to the content panel smoothly whenever a module or lesson changes
  useEffect(() => {
    const viewerElement = document.getElementById('lesson-content-area');
    if (viewerElement) {
      const yOffset = -90; // offset for sticky header
      const y = viewerElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeModuleIndex, activeLessonIndex]);

  // Handle lesson selection from other parts of the app (like Dashboard Progress Roadmap)
  useEffect(() => {
    if (selectedLessonId) {
      for (let mIdx = 0; mIdx < curriculum.length; mIdx++) {
        const lesIdx = curriculum[mIdx].lessons.findIndex((l) => l.id === selectedLessonId);
        if (lesIdx !== -1) {
          // Align prevModuleIndex to prevent default tab override
          setPrevModuleIndex(mIdx);
          setActiveModuleIndex(mIdx);
          setActiveLessonIndex(lesIdx);
          
          const lesson = curriculum[mIdx].lessons[lesIdx];
          if (lesson.hasLab) {
            setActiveTab('lab');
          } else if (lesson.hasQuiz) {
            setActiveTab('quiz');
          } else if (lesson.hasVideo) {
            setActiveTab('video');
          } else {
            setActiveTab('read');
          }
          break;
        }
      }
      if (onClearSelectedLesson) {
        onClearSelectedLesson();
      }
    }
  }, [selectedLessonId, curriculum, onClearSelectedLesson]);

  // Helper to check if a lesson is unlocked (linear progression)
  const isLessonUnlocked = (moduleId: string, lessonId: string): boolean => {
    // For seamless testing and immediate accessibility to any lab, all lessons are unlocked!
    return true;
  };

  const activeLessonUnlocked = isLessonUnlocked(currentModule.id, currentLesson.id);

  // Set default tab based on lesson features or module changes
  useEffect(() => {
    if (activeModuleIndex !== prevModuleIndex) {
      setActiveTab('topics');
      setPrevModuleIndex(activeModuleIndex);
    } else {
      if (currentLesson.hasLab) {
        setActiveTab('lab');
      } else if (currentLesson.hasQuiz) {
        setActiveTab('quiz');
      } else if (currentLesson.hasVideo) {
        setActiveTab('video');
      } else {
        setActiveTab('read');
      }
    }
    setIsVideoPlaying(false);
    setShowCompletedNotice(false);
  }, [activeModuleIndex, activeLessonIndex]);

  const handleMarkAsCompleted = async () => {
    try {
      const response = await fetch(`/api/lessons/${currentLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        onLessonCompleted(currentLesson.id);
        setShowCompletedNotice(true);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  };

  const handleLabSuccess = () => {
    onLabSolved(currentLesson.lab!.id);
  };

  const handleQuizSuccess = () => {
    onLessonCompleted(currentLesson.id);
  };

  const handleGoToNext = () => {
    if (activeLessonIndex < currentModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else if (activeModuleIndex < curriculum.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
    }
  };

  const isLessonSolved = user.completedLessons.includes(currentLesson.id);
  const isLabSolved = currentLesson.lab ? user.solvedLabs.includes(currentLesson.lab.id) : false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-slate-100" id="lesson-viewer-panel">
      {/* Interactive Learning Path Map (Skill Tree) */}
      <div className="col-span-1 lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between max-h-[850px] relative overflow-hidden" id="learning-path-map-container">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

        {/* Header containing metadata and progress stats */}
        <div className="border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400 shrink-0" />
              <span>{language === 'ar' ? 'خريطة مسار التعلّم التفاعلية' : 'Learning Path Map'}</span>
            </h3>
            <span className="bg-slate-950 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/20">
              {language === 'ar' ? `${user.completedLessons.length} / 20 مكتمل` : `${user.completedLessons.length} / 20 Solved`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 leading-relaxed block">
            {language === 'ar'
              ? 'شجرة مهارات الأمن السيبراني. اضغط على العقد المضيئة لاستكشاف الدروس والمعامل التفاعلية.'
              : 'Cybersecurity Skill Tree. Click on glowing nodes to discover lessons and interactive labs.'}
          </span>
        </div>

        {/* Scrollable winding path / tree */}
        <div className="flex-1 overflow-y-auto my-3 py-4 pr-1 pl-1 relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent max-h-[620px]" id="skill-tree-path">
          {/* Glowing central vertical connection "trunk" line */}
          <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500/40 to-slate-800/10 pointer-events-none z-0 opacity-40" />

          <div className="space-y-6 relative z-10">
            {curriculum.map((mod, modIdx) => {
              const isActiveModule = activeModuleIndex === modIdx;
              const completedLessonsInMod = mod.lessons.filter((l) => user.completedLessons.includes(l.id)).length;
              const isModuleCompleted = completedLessonsInMod === mod.lessonsCount;
              const alignmentClass = getAlignmentClass(modIdx);
              const ModIcon = getModuleIcon(modIdx);

              // Determine visual state of node
              const isCompleted = isModuleCompleted;
              const isActive = isActiveModule || modIdx === targetModIdx;
              const isUpcoming = modIdx > targetModIdx && !isCompleted;

              return (
                <div key={mod.id} className="flex flex-col items-center">
                  {/* Alternating winding row */}
                  <div className={`w-full flex ${alignmentClass} items-center gap-3 relative px-1.5`}>
                    
                    {/* Tooltip Card for desktop/tablets (hidden on mobile) */}
                    <div className={`hidden sm:flex flex-col w-[160px] bg-slate-950/90 backdrop-blur-sm border border-slate-800/80 p-2.5 rounded-lg text-[10px] space-y-1 shadow-lg transition-all hover:border-slate-700/80 ${
                      isActive ? 'border-amber-500/30 ring-1 ring-amber-500/15' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-500 text-[8px] tracking-wider">
                          {language === 'ar' ? `وحدة ${modIdx + 1}` : `UNIT ${modIdx + 1}`}
                        </span>
                        <span className={`px-1 py-0.5 rounded-[3px] text-[7px] font-bold ${
                          mod.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                          mod.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-400'
                        }`}>
                          {language === 'ar' ? mod.difficultyAr : mod.difficulty}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-200 line-clamp-1 leading-normal">
                        {language === 'ar' ? mod.title : mod.titleEn || mod.title}
                      </h4>
                      <div className="flex justify-between items-center text-[8px] text-slate-400 pt-1 border-t border-slate-900">
                        <span>{language === 'ar' ? 'الإنجاز:' : 'Solved:'}</span>
                        <span className="font-mono font-bold text-slate-300">{completedLessonsInMod}/{mod.lessonsCount}</span>
                      </div>
                    </div>

                    {/* Highly stylized glowing node button */}
                    <div className="relative group shrink-0">
                      {/* Interactive glowing ring backdrops */}
                      {isActive && (
                        <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-sm animate-pulse pointer-events-none" />
                      )}
                      {isCompleted && (
                        <div className="absolute -inset-1.5 bg-emerald-500/10 rounded-full blur-xs pointer-events-none" />
                      )}

                      <button
                        onClick={() => {
                          setActiveModuleIndex(modIdx);
                          setActiveLessonIndex(0);
                        }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                            : isActive
                              ? 'bg-amber-950/40 border-amber-500 text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.4)] scale-105 ring-2 ring-amber-500/20 hover:scale-110'
                              : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:scale-105'
                        } ${isUpcoming ? 'opacity-60' : ''}`}
                        title={language === 'ar' ? mod.title : mod.titleEn || mod.title}
                      >
                        <ModIcon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />

                        {/* Top-left small index label badge */}
                        <div className="absolute -top-1 -left-1 bg-slate-950 border border-slate-800 text-[8px] font-mono text-slate-400 px-1.5 py-0.5 rounded-full scale-90">
                          {modIdx + 1}
                        </div>

                        {/* Complete mini checkmark corner badge */}
                        {isCompleted && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 border border-slate-900 shadow-md">
                            <Check className="w-2.5 h-2.5 stroke-[4]" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Mobile title view (visible when tooltip is hidden on narrow screens) */}
                    <div className="flex sm:hidden flex-col flex-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850/60 text-left">
                      <span className="text-[8px] text-slate-500 block font-mono">UNIT {modIdx + 1}</span>
                      <h4 className="text-[10px] font-extrabold text-slate-200 line-clamp-1">
                        {language === 'ar' ? mod.title : mod.titleEn || mod.title}
                      </h4>
                      <span className="text-[8px] text-slate-400 mt-0.5">
                        {completedLessonsInMod}/{mod.lessonsCount} {language === 'ar' ? 'درس مكتمل' : 'topics completed'}
                      </span>
                    </div>

                  </div>

                  {/* Indented branching subtree for active unit lessons */}
                  {isActiveModule && (
                    <div className="w-full max-w-[280px] mt-3.5 mb-1 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-1.5 z-10 animate-fadeIn" id={`skill-tree-branch-${modIdx}`}>
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-1.5 px-0.5">
                        <span className="text-[9px] font-extrabold text-amber-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-emerald-400" />
                          <span>{language === 'ar' ? 'دروس ومهارات الوحدة:' : 'Skills & Topics in Unit:'}</span>
                        </span>
                        <span className="text-[8px] font-mono text-slate-500">
                          {completedLessonsInMod}/{mod.lessonsCount}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {mod.lessons.map((les, lesIdx) => {
                          const isActiveLesson = activeLessonIndex === lesIdx;
                          const isDone = user.completedLessons.includes(les.id);
                          return (
                            <button
                              key={les.id}
                              onClick={() => {
                                setActiveLessonIndex(lesIdx);
                              }}
                              className={`w-full py-2 px-2.5 rounded-lg flex items-center justify-between text-xs transition-all border cursor-pointer ${
                                isActiveLesson
                                  ? 'bg-emerald-600 border-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/15'
                                  : 'bg-slate-950/95 border-slate-900/80 text-slate-300 hover:bg-slate-900/60 hover:text-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-mono text-[9px] opacity-70">{lesIdx + 1}.</span>
                                <span className="truncate text-[10px]">
                                  {language === 'ar' ? les.title : les.titleEn || les.title}
                                </span>
                              </div>
                              {isDone ? (
                                <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isActiveLesson ? 'text-slate-950' : 'text-emerald-400'}`} />
                              ) : (
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActiveLesson ? 'bg-slate-950' : 'bg-slate-700'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Unified overall course metrics / indicator */}
        <div className={`pt-3 border-t border-slate-800 space-y-2 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{language === 'ar' ? 'التقدم الإجمالي بالمنهج' : 'Overall Course Progress'}</span>
            <span className="font-mono text-emerald-400 font-bold">{Math.min(100, Math.round((user.completedLessons.length / 20) * 100))}%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((user.completedLessons.length / 20) * 100))}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-500 text-center leading-normal">
            {language === 'ar'
              ? `أكملت ${user.completedLessons.length} من أصل 20 درساً بالكامل`
              : `Completed ${user.completedLessons.length} out of 20 lessons entirely`}
          </p>
        </div>
      </div>

      {/* Main Content Area (Central Column) */}
      <div className="lg:col-span-3 space-y-6" id="lesson-content-area">
        {/* Lesson Overview Banner */}
        <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className={`flex items-center gap-2 text-xs text-emerald-400 font-bold ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <span>{language === 'ar' ? `الوحدة ${activeModuleIndex + 1}` : `Module ${activeModuleIndex + 1}`}</span>
              <span>•</span>
              <span>
                {language === 'ar' 
                  ? `درجة الصعوبة: ${currentModule.difficultyAr}` 
                  : `Difficulty: ${currentModule.difficulty || currentModule.difficultyAr}`}
              </span>
            </div>
            <h2 className="text-xl font-extrabold">
              {language === 'ar' ? currentLesson.title : currentLesson.titleEn || currentLesson.title}
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              {language === 'ar' ? currentLesson.summary : currentLesson.summaryEn || currentLesson.summary}
            </p>
          </div>
        </div>

        {/* Lesson Tabs */}
        {!activeLessonUnlocked ? (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-10 text-center space-y-4">
            <Lock className="w-12 h-12 text-slate-700 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-300">
                {language === 'ar' ? 'هذا الدرس مغلق حالياً' : 'This lesson is currently locked'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
                {language === 'ar'
                  ? 'وفقاً لقواعد التدرج المنهجي الصارم للأكاديمية، لا يمكن تخطي أي درس. يرجى إتمام الدرس السابق لتفعيل محتوى هذا الدرس تلقائياً.'
                  : 'According to our curriculum progression rules, lessons must be completed sequentially. Please complete the previous lesson to automatically unlock this content.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Nav Tabs list */}
            <div className={`flex border-b border-slate-800 gap-1 overflow-x-auto ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <button
                onClick={() => setActiveTab('topics')}
                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'} ${
                  activeTab === 'topics'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListCollapse className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'موضوعات الوحدة والأوامر' : 'Topics & Commands'}</span>
              </button>

              <button
                onClick={() => setActiveTab('read')}
                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'} ${
                  activeTab === 'read'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الشرح والمفاهيم' : 'Concepts & Lecture'}</span>
              </button>

              {currentLesson.hasVideo && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'} ${
                    activeTab === 'video'
                      ? 'border-emerald-500 text-emerald-400 bg-slate-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'فيديو الشرح' : 'Lecture Video'}</span>
                </button>
              )}

              {currentLesson.hasLab && (
                <button
                  onClick={() => setActiveTab('lab')}
                  className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'} ${
                    activeTab === 'lab'
                      ? 'border-emerald-500 text-emerald-400 bg-slate-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'المعطيات والمعمل العملي' : 'Specs & Lab'}</span>
                </button>
              )}

              {currentLesson.hasQuiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'} ${
                    activeTab === 'quiz'
                      ? 'border-emerald-500 text-emerald-400 bg-slate-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'التقييم والاختبار' : 'Evaluation & Quiz'}</span>
                </button>
              )}
            </div>

            {/* Tab Panels */}
            <div className="space-y-6">
              {/* TOPICS TAB */}
              {activeTab === 'topics' && (
                <div className="space-y-6">
                  {/* Module Welcome Header */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className="space-y-1">
                        <div className={`flex items-center gap-2 text-emerald-400 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Cpu className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold">
                            {language === 'ar' ? 'مخطط التدريب الفني والعملي للوحدة' : 'Technical & Practical Module Blueprint'}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-100">
                          {language === 'ar' ? currentModule.title : currentModule.titleEn || currentModule.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                          {language === 'ar' ? currentModule.description : currentModule.descriptionEn || currentModule.description}
                        </p>
                      </div>
                      <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 text-center shrink-0">
                        <span className="text-[10px] text-slate-500 block font-bold">
                          {language === 'ar' ? 'مدة الوحدة التقديرية' : 'Est. Module Duration'}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-400 font-mono">
                          {language === 'ar'
                            ? currentModule.duration
                            : currentModule.duration.replace('ساعات', 'hrs').replace('ساعة', 'hr').replace('دقائق', 'mins').replace('دقيقة', 'mins')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Staggered Cards for Each Topic/Lesson in this Module */}
                  <div className="grid grid-cols-1 gap-4">
                    {currentModule.lessons.map((les, lesIdx) => {
                      const isUnlocked = isLessonUnlocked(currentModule.id, les.id);
                      const isDone = user.completedLessons.includes(les.id);
                      const isSelected = activeLessonIndex === lesIdx;

                      // Extract tools for explanation
                      const toolsList = les.hasLab && les.lab ? les.lab.tools : [];

                      return (
                        <motion.div
                          key={les.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: lesIdx * 0.05 }}
                          className={`border rounded-xl p-5 transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                            isSelected
                              ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/10'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          } ${!isUnlocked ? 'opacity-60' : ''}`}
                        >
                          <div className={`flex flex-col md:flex-row md:items-start justify-between gap-4 ${isRtl ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            {/* Lesson Info Column */}
                            <div className="space-y-3 flex-1">
                              <div className={`flex items-center gap-2 flex-wrap ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span className="bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                                  {language === 'ar' ? `الموضوع ${lesIdx + 1}` : `Topic ${lesIdx + 1}`}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  • {language === 'ar' ? les.duration : les.duration.replace('دقيقة', 'mins')}
                                </span>
                                {isDone && (
                                  <span className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    {language === 'ar' ? 'مكتمل' : 'Completed'}
                                  </span>
                                )}
                                {!isUnlocked && (
                                  <span className="bg-slate-950 border border-slate-800 text-slate-500 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-slate-500" />
                                    {language === 'ar' ? 'مغلق' : 'Locked'}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-extrabold text-slate-200">
                                {language === 'ar' ? les.title : les.titleEn || les.title}
                              </h4>
                              
                              {/* Simplified Explanation Box */}
                              <div className="bg-slate-950/40 border border-slate-800/40 p-3 rounded-lg">
                                <span className="text-[10px] font-bold text-slate-500 block mb-1">
                                  {language === 'ar' ? 'الشرح والمفهوم المبسط:' : 'Simplified Topic Concept:'}
                                </span>
                                <p className="text-xs text-slate-400 leading-relaxed leading-6">
                                  {language === 'ar' ? les.summary : les.summaryEn || les.summary}
                                </p>
                              </div>

                              {/* Lab Commands Focus Box */}
                              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg space-y-2">
                                <div className={`flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{language === 'ar' ? 'التركيز على الأوامر والتطبيق المعملي:' : 'Commands & Hands-on Focus:'}</span>
                                </div>
                                {les.hasLab && les.lab ? (
                                  <div className="space-y-2">
                                    <p className="text-[10px] text-slate-400">
                                      {language === 'ar' 
                                        ? 'سوف تقوم بتطبيق وتنفيذ الأوامر التقنية التالية داخل محاكي المعمل لحل التحدي واقتناص العلم:' 
                                        : 'You will run the following commands inside the simulator lab to crack the task and secure the flag:'}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {toolsList.map((tool) => (
                                        <div key={tool} className={`bg-slate-900 border border-slate-800/60 p-2 rounded flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                                          <span className="font-mono text-[10px] bg-slate-950 text-emerald-400 border border-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                                            $ {tool}
                                          </span>
                                          <span className="text-[10px] text-slate-400 line-clamp-1">
                                            {getToolExplanation(tool, language)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-slate-500 leading-relaxed">
                                    {language === 'ar'
                                      ? 'هذا الدرس يغطي المفاهيم النظرية والتأسيسية للتحدي. ننصح بتطبيق الأوامر الاستكشافية العامة مثل whoami أو الانتقال مباشرة لمعمل الوحدة العملي المعتمد.'
                                      : 'This lesson covers core conceptual and background mechanics. We recommend trying quick system discovery commands like whoami or moving straight to the practical sandbox.'}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Practical Application Action Column */}
                            <div className={`shrink-0 flex md:flex-col items-stretch justify-center gap-2 self-stretch min-w-[140px] ${
                              isRtl 
                                ? 'md:border-l md:border-slate-800/80 md:pl-4 md:ml-1' 
                                : 'md:border-r md:border-slate-800/80 md:pr-4 md:mr-1'
                            }`}>
                              {isUnlocked ? (
                                <button
                                  onClick={async () => {
                                    // Automatic on-the-fly role upgrade from Guest to Student for seamless immediate lab access
                                    if (user.role === 'Guest') {
                                      try {
                                        const res = await fetch('/api/user/role', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ role: 'Student' }),
                                        });
                                        if (res.ok && onRefreshUser) {
                                          await onRefreshUser();
                                        }
                                      } catch (err) {
                                        console.error('Error auto-upgrading guest user to student:', err);
                                      }
                                    }

                                    setActiveLessonIndex(lesIdx);
                                    if (les.hasLab) {
                                      setActiveTab('lab');
                                    } else {
                                      // If this lesson doesn't have lab, find the first lesson in this module that has one
                                      const labLessonIdx = currentModule.lessons.findIndex((l) => l.hasLab);
                                      if (labLessonIdx !== -1) {
                                        setActiveLessonIndex(labLessonIdx);
                                        setActiveTab('lab');
                                      } else {
                                        // If whole module has no lab (e.g. module 1), guide to Module 2's first lab
                                        setActiveModuleIndex(1); // switch to Module 2
                                        setActiveLessonIndex(0);
                                        setActiveTab('lab');
                                      }
                                    }
                                  }}
                                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/25"
                                >
                                  <Terminal className="w-3.5 h-3.5 text-slate-950" />
                                  <span>{language === 'ar' ? 'التطبيق العملي' : 'Practical Lab'}</span>
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="w-full bg-slate-800 text-slate-500 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-900"
                                >
                                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{language === 'ar' ? 'التطبيق مغلق' : 'Lab Locked'}</span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setActiveLessonIndex(lesIdx);
                                  setActiveTab('read');
                                }}
                                className="w-full bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-slate-200 border border-slate-800 text-xs font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                {language === 'ar' ? 'عرض الشرح الكامل' : 'Read Full Lecture'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GUEST ACCESS LOCK FOR LESSONS, VIDEOS, LABS, AND QUIZZES */}
              {user.role === 'Guest' && activeTab !== 'topics' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6 relative overflow-hidden" id="guest-access-lock">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
                  <div className="bg-slate-950 p-4 rounded-full border border-slate-850 inline-block">
                    <Lock className="w-8 h-8 text-amber-500 animate-pulse" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-md font-black text-slate-200">
                      {language === 'ar' ? 'المحتوى مقيد في وضع الزائر (Guest Mode)' : 'Restricted Content in Guest Mode'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {language === 'ar'
                        ? 'وفقاً لمصفوفة الصلاحيات (RBAC) المحددة في النظام، يُسمح للزوار باستكشاف المناهج والخطة الدراسية فقط. يتطلب تشغيل المعامل التفاعلية، حل الاختبارات، قراءة الدروس، أو المشاركة بالمنتدى حساباً كاملاً.'
                        : 'According to our RBAC permissions matrix, guests are permitted to explore course outlines only. Running interactive labs, taking quizzes, reading lessons, or posting in the forum requires a registered student account.'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg max-w-sm mx-auto text-right space-y-2">
                    <h4 className="text-[11px] font-black text-amber-400">🛡️ الصلاحيات المتوفرة لدور زائر:</h4>
                    <ul className="text-[10px] text-slate-400 space-y-1 font-sans">
                      <li className="flex items-center gap-1.5 justify-start">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تصفح صفحة الهبوط والأسعار</span>
                      </li>
                      <li className="flex items-center gap-1.5 justify-start">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تصفح المخطط العام للوحدات والدروس</span>
                      </li>
                      <li className="flex items-center gap-1.5 justify-start">
                        <X className="w-3.5 h-3.5 text-rose-500" />
                        <span>قراءة الدروس أو مشاهدة مقاطع الفيديو (مغلق 🔒)</span>
                      </li>
                      <li className="flex items-center gap-1.5 justify-start">
                        <X className="w-3.5 h-3.5 text-rose-500" />
                        <span>بدء المعامل التطبيقية وحل التحديات (مغلق 🔒)</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-[10px] text-slate-500 italic max-w-md mx-auto">
                    💡 يمكنك رفع صلاحياتك فوراً واختبار ميزات الطالب أو المعيد أو المدرب عبر النقر على "محاكي الصلاحيات والتحكم" في الشريط العلوي!
                  </p>
                </div>
              )}

              {/* READING TAB */}
              {activeTab === 'read' && user.role !== 'Guest' && (
                <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="space-y-4">
                    <h3 className={`text-md font-bold text-slate-200 flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                      <FileText className="w-4.5 h-4.5 text-emerald-400" />
                      <span>{language === 'ar' ? 'المادة العلمية المكتوبة' : 'Written Lecture Material'}</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed leading-7 whitespace-pre-line">
                      {language === 'ar' ? currentLesson.summary : currentLesson.summaryEn || currentLesson.summary}
                      {`\n\n${
                        language === 'ar'
                          ? `يحتوي هذا الدرس على مجموعة من المفاهيم المعيارية التي تتيح لك تطبيق مهاراتك بشكل احترافي. تم تجميع هذه المعلومات بالاعتماد على مراجع وكتب مخصصة للأمن السيبراني، ونوصي بشدة بالاستكشاف العميق ومذاكرة الموارد قبل البدء في تفعيل الطرفية أو حل الاختبار.\n\nتذكر دائماً أن المعامل والأدوات تم تصميمها لتكون حصرية للتعلم الدفاعي والامتحانات التعليمية فقط ولا يجوز مطلقاً استخدامها في فحص أي شبكة خارجية دون موافقة خطية صريحة.`
                          : `This lesson covers standardized concepts enabling you to apply your skills professionally. This content is compiled from verified cybersecurity reference works and publications. We strongly recommend in-depth study of the reference resources before launching the sandbox terminal or taking the evaluation quiz.\n\nAlways remember that all labs and tools are strictly designated for defensive learning and academic examinations. Under no circumstances may they be used on external systems without express prior written consent.`
                      }`}
                    </p>
                  </div>

                  {currentLesson.hasPdf && (
                    <div className={`p-4 bg-slate-950 rounded-lg border border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-200">
                            {language === 'ar' ? 'الدليل التدريجي والمستند السريع للدرس' : 'Step-by-Step Guide & Reference Sheet'}
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {language === 'ar'
                              ? 'التنسيق: دليل تفاعلي • جاهز للطباعة والحفظ كـ PDF'
                              : 'Format: Interactive Blueprint • Print & PDF Ready'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const htmlContent = generateGuideHtml(currentModule, currentLesson);
                          const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `CEH_Guide_${currentLesson.id}.html`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        }}
                        className={`flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-400 px-3 py-1.5 rounded transition-all text-slate-300 cursor-pointer justify-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تحميل الدليل' : 'Download Guide'}</span>
                      </button>
                    </div>
                  )}

                  {/* Mark as completed footer */}
                  <div className={`border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <p className="text-[10px] text-slate-500">
                      {language === 'ar'
                        ? 'ضع علامة "مكتمل" لتسجيل تقدمك في النظام وحفظ النقاط.'
                        : 'Mark complete to register progress and save earned XP.'}
                    </p>

                    {isLessonSolved ? (
                      <div className={`flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded text-xs font-bold ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>
                          {language === 'ar' ? 'لقد أنهيت مذاكرة هذا الدرس! (+20 نقطة)' : 'You finished studying this topic! (+20 XP)'}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleMarkAsCompleted}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-5 py-2 rounded text-xs font-extrabold transition-all cursor-pointer shadow-md"
                      >
                        {language === 'ar' ? 'ضع علامة مكتمل للدرس' : 'Mark Lesson Completed'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* VIDEO TAB */}
              {activeTab === 'video' && currentLesson.hasVideo && user.role !== 'Guest' && (
                <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-xs font-bold text-slate-400">
                    {language === 'ar' ? 'فيديو الشرح المنهجي والمحاكاة المرئية' : 'Curriculum Lecture Video & Demo'}
                  </h3>

                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 group">
                    {isVideoPlaying ? (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src={currentLesson.videoUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"}
                          alt="Video thumbnail"
                          className="absolute inset-0 w-full h-full object-cover opacity-10 filter blur-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-center space-y-3 z-10 p-6">
                          <div className="inline-block p-3 rounded-full bg-slate-900 border border-emerald-500 animate-pulse">
                            <Play className="w-6 h-6 text-emerald-400" />
                          </div>
                          <p className="text-xs font-bold text-emerald-400">
                            {language === 'ar' ? 'جاري تشغيل فيديو المحاكاة والتدريب المنهجي...' : 'Buffering training demo & lecture simulation...'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {language === 'ar'
                              ? 'يرجى قضاء 80% من الوقت لمشاهدة المادة العملية بالكامل وفق القواعد.'
                              : 'Please allocate 80% of run time to fully digest the material.'}
                          </p>
                          <button
                            onClick={() => setIsVideoPlaying(false)}
                            className="text-xs text-slate-400 hover:underline block mx-auto cursor-pointer"
                          >
                            {language === 'ar' ? 'إيقاف مؤقت' : 'Pause Video'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src={currentLesson.videoUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"}
                          alt="Video thumbnail"
                          className="absolute inset-0 w-full h-full object-cover opacity-20 filter brightness-50"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => setIsVideoPlaying(true)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-4 rounded-full transition-transform transform group-hover:scale-110 z-10 cursor-pointer shadow-xl animate-bounce"
                        >
                          <Play className="w-6 h-6 text-slate-950 shrink-0" />
                        </button>
                        <span className={`absolute bottom-4 bg-slate-950/80 px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 ${isRtl ? 'right-4' : 'left-4'}`}>
                          {language === 'ar'
                            ? `مدة الفيديو: ${currentLesson.duration}`
                            : `Duration: ${currentLesson.duration.replace('دقيقة', 'mins')}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">
                    {language === 'ar'
                      ? 'يرجى مشاهدة الشرح لفهم خطوات تطبيق المعمل العملي المدمج تالياً.'
                      : 'Please watch the walkthrough to easily solve the practical hands-on sandbox below.'}
                  </p>
                </div>
              )}

              {/* LAB TAB */}
              {activeTab === 'lab' && currentLesson.hasLab && user.role !== 'Guest' && (
                <div className="space-y-6">
                  {/* Lab Scenario description card */}
                  <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center justify-between border-b border-slate-800 pb-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Terminal className="w-5 h-5 text-emerald-400 shrink-0" />
                        <h3 className="text-sm font-bold text-slate-200">
                          {language === 'ar' ? currentLesson.lab.title : currentLesson.lab.titleEn || currentLesson.lab.title}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/10">
                        {currentLesson.lab.points} XP
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {language === 'ar' ? 'سيناريو المعمل:' : 'Lab Scenario:'}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed leading-6 whitespace-pre-line">
                        {language === 'ar' ? currentLesson.lab.scenario : currentLesson.lab.scenarioEn || currentLesson.lab.scenario}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {language === 'ar' ? 'الأهداف التقنية المطلوبة:' : 'Technical Objectives Required:'}
                      </span>
                      <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                        {language === 'ar' ? currentLesson.lab.objective : currentLesson.lab.objectiveEn || currentLesson.lab.objective}
                      </p>
                    </div>

                    {/* Hints block */}
                    <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2">
                      <span className={`text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'ar' ? 'تلميحات وإرشادات ذكية (Lab Hints)' : 'Smart Lab Hints'}</span>
                      </span>
                      <ul className={`list-disc text-[10px] text-slate-400 space-y-1 leading-relaxed ${isRtl ? 'pr-5' : 'pl-5'}`}>
                        {(language === 'ar' ? currentLesson.lab.hintsAr : (currentLesson.lab.hints || currentLesson.lab.hintsAr)).map((hint: string, i: number) => (
                          <li key={i}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* High Fidelity terminal simulator integration */}
                  {currentLesson.lab.id === 'lab-m22-l1' ? (
                    <DroneLabEmulator
                      labId={currentLesson.lab.id}
                      points={currentLesson.lab.points}
                      expectedFlag={currentLesson.lab.expectedFlag}
                      onSuccess={handleLabSuccess}
                      isSolved={isLabSolved}
                      objective={currentLesson.lab.objective}
                    />
                  ) : currentLesson.lab.id === 'lab-m21-l1' ? (
                    <AILabEmulator
                      labId={currentLesson.lab.id}
                      points={currentLesson.lab.points}
                      expectedFlag={currentLesson.lab.expectedFlag}
                      onSuccess={handleLabSuccess}
                      isSolved={isLabSolved}
                      objective={currentLesson.lab.objective}
                    />
                  ) : (
                    <TerminalSimulator
                      labId={currentLesson.lab.id}
                      points={currentLesson.lab.points}
                      expectedFlag={currentLesson.lab.expectedFlag}
                      onSuccess={handleLabSuccess}
                      isSolved={isLabSolved}
                      objective={currentLesson.lab.objective}
                    />
                  )}
                </div>
              )}

              {/* QUIZ TAB */}
              {activeTab === 'quiz' && currentLesson.hasQuiz && user.role !== 'Guest' && (
                <QuizViewer
                  quiz={currentLesson.quiz}
                  onSuccess={handleQuizSuccess}
                  isSolved={isLessonSolved}
                  onNext={handleGoToNext}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Cyber Security Reference Wiki Companion */}
      <CyberSecurityWiki />
    </div>
  );
}
