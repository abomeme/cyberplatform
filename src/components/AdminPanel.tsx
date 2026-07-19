import { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldAlert,
  Cpu,
  Database,
  Activity,
  RefreshCw,
  Layers,
  CheckCircle2,
  Check,
  X,
  UserCheck,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  FileCheck,
  Eye,
  DatabaseZap,
  Key,
  ShieldCheck,
  Lock,
  ArrowRightLeft,
  Settings,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Trash2
} from 'lucide-react';
import { AuditLog } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SYSTEM_PERMISSIONS, usePermissions, UserRole } from '../context/PermissionsContext';

interface AdminPanelProps {
  currentRole: string;
  onChangeRole: (newRole: any) => void;
  userPoints: number;
}

interface SimulatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Suspended';
}

interface DraftModule {
  id: string;
  titleAr: string;
  titleEn: string;
  author: string;
  status: 'Pending Review' | 'Approved' | 'Changes Requested' | 'Rejected';
  notes?: string;
}

interface StudentSubmission {
  id: string;
  studentName: string;
  lessonTitle: string;
  submittedAt: string;
  reportContent: string;
  grade?: number;
  feedback?: string;
  status: 'Pending' | 'Graded';
}

export default function AdminPanel({ currentRole, onChangeRole, userPoints }: AdminPanelProps) {
  const { language, isRtl } = useLanguage();
  const { getRoleDetails, hasPermission } = usePermissions();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  // Simulated State for RBAC Interactive Views
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<UserRole>((currentRole || 'Student') as UserRole);

  // Super Admin: Database logs & simulated state
  const [dbMigrating, setDbMigrating] = useState(false);
  const [dbLogs, setDbLogs] = useState<string[]>([]);
  const [encryptionKey, setEncryptionKey] = useState('AES256-KDF:e5762d98dcf6d649d01248067b5b74c8');
  
  // Administrator: User accounts manager simulated state
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>([
    { id: 'usr-s1', name: 'سارة العتيبي', email: 'sara@cyberacademy.sa', role: 'Student', status: 'Active' },
    { id: 'usr-ta1', name: 'يزيد الشمري', email: 'yazeed@cyberacademy.sa', role: 'Teaching Assistant', status: 'Active' },
    { id: 'usr-inst1', name: 'م. خالد الدوسري', email: 'khaled@cyberacademy.sa', role: 'Instructor', status: 'Active' },
    { id: 'usr-rev1', name: 'د. منيرة الحجيلان', email: 'munira@cyberacademy.sa', role: 'Content Reviewer', status: 'Active' },
  ]);

  // Instructor: Curriculum Editor simulator state
  const [selectedLessonForEdit, setSelectedLessonForEdit] = useState('m2-l1');
  const [editTitleAr, setEditTitleAr] = useState('الاستطلاع السلبي واستخدام Google Dorking');
  const [editSummaryAr, setEditSummaryAr] = useState('فهم آليات جمع المعلومات السلبية واستغلال محركات البحث الشهيرة للحصول على ملفات حساسة أو لوحات تحكم مكشوفة.');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Content Reviewer: QA queue drafts
  const [draftModules, setDraftModules] = useState<DraftModule[]>([
    { id: 'm11', titleAr: 'الوحدة 11: رفع الصلاحيات في لينكس (Privilege Escalation)', titleEn: 'Linux Privilege Escalation', author: 'م. خالد الدوسري', status: 'Pending Review' },
    { id: 'm15', titleAr: 'الوحدة 15: اختراق الأدلة النشطة (Active Directory)', titleEn: 'Active Directory Attacks', author: 'م. فهد العتيبي', status: 'Pending Review' },
  ]);
  const [reviewNotes, setReviewNotes] = useState('');

  // Teaching Assistant: Homework submissions grading queue
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: 'sub-1',
      studentName: 'أحمد الحربي',
      lessonTitle: 'معمل رفع الصلاحيات عبر SUID',
      submittedAt: new Date(Date.now() - 3600000 * 2).toLocaleDateString('ar-SA'),
      reportContent: 'تم العثور على أداة suid-helper المفعل عليها flag الـ SUID للمستخدم root. قمت بتمرير أمر القراءة لقراءة ملف العلم المخزن في مسار الجذر وحصلت على العلم بنجاح.',
      status: 'Pending'
    },
    {
      id: 'sub-2',
      studentName: 'سارة العتيبي',
      lessonTitle: 'معمل استقصاء المعلومات بـ Google Dorks',
      submittedAt: new Date(Date.now() - 3600000 * 5).toLocaleDateString('ar-SA'),
      reportContent: 'قمت بصياغة الاستعلام التالي site:academy.local filetype:txt للبحث عن الملفات النصية المرفوعة بالخطأ ووجدت ملف النسخ الاحتياطي السري backup_log.txt.',
      status: 'Pending'
    }
  ]);
  const [gradingScore, setGradingScore] = useState<number>(95);
  const [gradingFeedback, setGradingFeedback] = useState('عمل ممتاز، تقرير فني شامل ومرتب يوضح تسلسل الهجوم بدقة.');

  // Containers List (System Resource Monitor)
  const [activeContainers, setActiveContainers] = useState([
    { containerId: 'dck-home-student-1', port: 2212, cpu: '1.2%', ram: '18MB', status: 'Running', labId: 'lab-m2-l1' },
    { containerId: 'dck-suid-reader-2', port: 4409, cpu: '0.4%', ram: '24MB', status: 'Running', labId: 'lab-m2-l2' },
    { containerId: 'dck-nmap-ftp-3', port: 8021, cpu: '4.8%', ram: '42MB', status: 'Running', labId: 'lab-m5-l1' },
  ]);

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const response = await fetch('/api/admin/audit-logs');
      const data = await response.json();
      setAuditLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [currentRole, userPoints]);

  const rolesList: { value: UserRole; label: string; labelEn: string }[] = [
    { value: 'Guest', label: 'زائر (Guest)', labelEn: 'Guest' },
    { value: 'Student', label: 'طالب (Student)', labelEn: 'Student' },
    { value: 'Teaching Assistant', label: 'معيد (Teaching Assistant)', labelEn: 'Teaching Assistant' },
    { value: 'Instructor', label: 'مدرب (Instructor)', labelEn: 'Instructor' },
    { value: 'Content Reviewer', label: 'مراجع (Content Reviewer)', labelEn: 'Content Reviewer' },
    { value: 'Administrator', label: 'مدير النظام (Administrator)', labelEn: 'Administrator' },
    { value: 'Super Administrator', label: 'المدير العام (Super Admin)', labelEn: 'Super Administrator' },
  ];

  const handleSimulateRoleChange = (role: UserRole) => {
    onChangeRole(role);
    setSelectedRoleForMatrix(role);
  };

  // SUPER ADMIN ACTIONS
  const runDatabaseMigration = () => {
    setDbMigrating(true);
    setDbLogs([]);
    const logs = [
      '>> Initializing database schema upgrade sequence...',
      '>> Parsing active entity relational schemas...',
      '>> Found 16 active entities in schema lookup path.',
      '>> ALTER TABLE users ADD COLUMN rbac_last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW();',
      '>> CREATE INDEX idx_users_role_status ON users(role, status);',
      '>> ALTER TABLE audit_logs ADD COLUMN checksum TEXT;',
      '>> Validating relational foreign key integrity constraints...',
      '>> All checks passed! Database successfully migrated to version v2.4.0. 🚀'
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setDbLogs((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setDbMigrating(false);
        }
      }, (index + 1) * 400);
    });
  };

  const regenerateEncryptionKeys = () => {
    const hex = 'AES256-KDF:' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setEncryptionKey(hex);
    alert(language === 'ar' ? 'تمت إعادة توليد وتشفير المفاتيح الأساسية للاتصالات السحابية بنجاح!' : 'Master communication encryption keys regenerated successfully!');
  };

  // ADMINISTRATOR ACTIONS
  const toggleUserStatus = (userId: string) => {
    setSimulatedUsers((prev) =>
      prev.map((usr) =>
        usr.id === userId
          ? { ...usr, status: usr.status === 'Active' ? 'Suspended' : 'Active' }
          : usr
      )
    );
  };

  const changeUserRoleSimulated = (userId: string, newRole: UserRole) => {
    setSimulatedUsers((prev) =>
      prev.map((usr) => (usr.id === userId ? { ...usr, role: newRole } : usr))
    );
  };

  // INSTRUCTOR ACTIONS
  const saveLessonEdits = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 4000);
  };

  // CONTENT REVIEWER ACTIONS
  const handleReviewAction = (moduleId: string, action: 'Approved' | 'Changes Requested' | 'Rejected') => {
    setDraftModules((prev) =>
      prev.map((draft) =>
        draft.id === moduleId
          ? { ...draft, status: action, notes: reviewNotes || undefined }
          : draft
      )
    );
    setReviewNotes('');
    alert(
      language === 'ar'
        ? `تم تحديث حالة المراجعة للوحدة بنجاح إلى: ${action === 'Approved' ? 'مقبول ومنشور' : action === 'Changes Requested' ? 'ملاحظات مطلوبة' : 'مرفوض'}`
        : `Draft status updated to: ${action}`
    );
  };

  // TEACHING ASSISTANT ACTIONS
  const handleGradeSubmission = (subId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? { ...sub, status: 'Graded', grade: gradingScore, feedback: gradingFeedback }
          : sub
      )
    );
    alert(
      language === 'ar'
        ? `تم رصد الدرجة (${gradingScore}/100) وتوجيه التغذية الراجعة للطالب بنجاح!`
        : `Grade (${gradingScore}/100) submitted successfully!`
    );
  };

  const selectedRoleDetails = getRoleDetails(selectedRoleForMatrix);

  return (
    <div className="space-y-8" id="rbac-system-panel">
      {/* Simulation Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/20 rounded-xl p-5 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 space-x-reverse text-right">
          <div className="bg-emerald-950 p-3 rounded-full border border-emerald-500/30 shrink-0">
            <Sliders className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-md font-black flex items-center gap-2">
              <span>محاكي نظام الصلاحيات المتقدم (RBAC Simulator)</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                Active: {currentRole}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              تطبيقاً لمرحلة التحليل الفني، يمكنك تبديل دورك الحالي لـ 7 صلاحيات مختلفة وتجربة الواجهة والقدرات البرمجية لكل مستوى وظيفي مع المراقبة الفورية.
            </p>
          </div>
        </div>

        {/* Dynamic Badge Display */}
        <div className="flex items-center gap-3">
          <div className={`border rounded-lg px-4 py-2 text-center text-xs font-bold ${getRoleDetails(currentRole).color}`}>
            <span className="block text-[9px] uppercase text-slate-500 font-mono">الدور الحالي</span>
            <span className="text-sm font-black">{getRoleDetails(currentRole).nameAr}</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Sandbox Grid */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
          <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
          <span>اختر دوراً سحابياً لتجربة صلاحياته فورياً:</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {rolesList.map((role) => {
            const isSelected = currentRole === role.value;
            const details = getRoleDetails(role.value);
            return (
              <button
                key={role.value}
                onClick={() => handleSimulateRoleChange(role.value)}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 h-24 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-102'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {role.value === 'Guest' && <Eye className="w-4 h-4" />}
                  {role.value === 'Student' && <BookOpen className="w-4 h-4" />}
                  {role.value === 'Teaching Assistant' && <FileCheck className="w-4 h-4" />}
                  {role.value === 'Instructor' && <UserCheck className="w-4 h-4" />}
                  {role.value === 'Content Reviewer' && <ShieldCheck className="w-4 h-4" />}
                  {role.value === 'Administrator' && <ShieldAlert className="w-4 h-4" />}
                  {role.value === 'Super Administrator' && <DatabaseZap className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />}
                </div>
                <div className="text-[11px] font-black leading-tight text-center">
                  <span>{isRtl ? details.nameAr : details.nameEn}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Matrix & Live Simulation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Lg: 7) - Dynamic Simulation Admin Action Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SUPER ADMINISTRATOR PANEL */}
          {currentRole === 'Super Administrator' && (
            <div className="bg-slate-900 border border-rose-500/20 rounded-xl p-5 space-y-6 relative overflow-hidden" id="super-admin-panel">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-rose-400 flex items-center gap-2">
                    <DatabaseZap className="w-5 h-5 text-rose-400" />
                    <span>لوحة المالك التقني الأعلى (Super Admin Core Console)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">كامل الصلاحيات المطلقة، التحديث الهيكلي للنظام، ومفاتيح التشفير الأساسية.</p>
                </div>
                <span className="text-[10px] text-rose-500 font-mono font-bold bg-rose-950/50 border border-rose-500/20 px-2 py-0.5 rounded-full">Root Privilege</span>
              </div>

              {/* Database Schema Migration Tool */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-rose-400" />
                  <span>أداة تحديث هيكلية قاعدة البيانات (Schema Migrator)</span>
                </h5>
                <p className="text-[11px] text-slate-400 leading-normal">
                  بإمكانك المزامنة البرمجية لتحديث الجداول وإضافة فهارس الاستعلامات وحفظ التغييرات في ملفات البيانات مباشرة.
                </p>
                
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1.5 min-h-[140px] max-h-[180px] overflow-y-auto">
                  {dbLogs.length === 0 ? (
                    <span className="text-slate-600 block italic">بانتظار تلقي أمر الترقية الهيكلية...</span>
                  ) : (
                    dbLogs.map((log, i) => (
                      <div key={i} className={log.startsWith('>> All') ? 'text-emerald-400 font-bold' : log.startsWith('>> ALTER') ? 'text-amber-400' : 'text-slate-400'}>
                        {log}
                      </div>
                    ))
                  )}
                  {dbMigrating && (
                    <div className="text-rose-400 animate-pulse font-bold">جاري المزامنة وتحميل المكونات... ⏳</div>
                  )}
                </div>

                <button
                  onClick={runDatabaseMigration}
                  disabled={dbMigrating}
                  className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-950 font-black text-xs px-4 py-2 rounded-md transition-all cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>تطبيق الترقية والـ DB Migrations 🚀</span>
                </button>
              </div>

              {/* Encryption Keys Vault */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-rose-400" />
                  <span>خزنة تشفير البيانات والاتصالات السحابية</span>
                </h5>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-rose-400/80 select-all overflow-x-auto">
                    {encryptionKey}
                  </div>
                  <button
                    onClick={regenerateEncryptionKeys}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs px-4 py-3 rounded transition-all cursor-pointer shrink-0"
                  >
                    إعادة تشفير المفاتيح 🔐
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal italic">
                  تحذير: إعادة توليد المفتاح الأساسي يتطلب إعادة تشفير كلمات مرور المستخدمين المخزنة بقاعدة البيانات لتفادي فقدان القدرة على تسجيل الدخول.
                </p>
              </div>
            </div>
          )}

          {/* ADMINISTRATOR PANEL */}
          {currentRole === 'Administrator' && (
            <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-5 space-y-6" id="admin-member-panel">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5 text-right">
                  <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <span>لوحة التشغيل اليومي وإدارة الأعضاء (Administrator Hub)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">إدارة حسابات المستخدمين، مراجعة سجلات التدقيق الأمني، وتوزيع الرتب والمستويات.</p>
                </div>
                <span className="text-[10px] text-emerald-500 font-mono font-bold bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded-full">Admin Level</span>
              </div>

              {/* Members Manager Sim */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-200">إدارة حسابات الموظفين والطلاب بالمنصة:</h5>
                <div className="space-y-2.5">
                  {simulatedUsers.map((usr) => {
                    const rDetails = getRoleDetails(usr.role);
                    return (
                      <div key={usr.id} className="bg-slate-950 p-3.5 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                        <div className="space-y-1 w-full sm:w-auto">
                          <div className="flex items-center gap-2 justify-start">
                            <span className="font-bold text-xs text-slate-200">{usr.name}</span>
                            <span className={`text-[9px] px-2 py-0.5 border rounded font-semibold ${rDetails.color}`}>
                              {rDetails.nameAr}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block">{usr.email}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                          {/* Role Switcher Select */}
                          <select
                            value={usr.role}
                            onChange={(e) => changeUserRoleSimulated(usr.id, e.target.value as UserRole)}
                            className="bg-slate-900 border border-slate-800 text-[10px] rounded p-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Student">طالب (Student)</option>
                            <option value="Teaching Assistant">معيد (TA)</option>
                            <option value="Instructor">مدرب (Instructor)</option>
                            <option value="Content Reviewer">مراجع (Reviewer)</option>
                          </select>

                          {/* Toggle Status Button */}
                          <button
                            onClick={() => toggleUserStatus(usr.id)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all cursor-pointer border ${
                              usr.status === 'Active'
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50'
                                : 'bg-rose-950/30 border-rose-500/30 text-rose-400 hover:bg-rose-950/50'
                            }`}
                          >
                            {usr.status === 'Active' ? 'نشط (🟢)' : 'معطل (🔴)'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Containers List */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>مراقب الخوادم المعزولة لبيئات المعامل (Container Auditor)</span>
                </h5>
                <div className="space-y-2">
                  {activeContainers.map((cont, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold text-slate-300">{cont.containerId}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-400">
                        <span>CPU: {cont.cpu}</span>
                        <span>RAM: {cont.ram}</span>
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Active</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INSTRUCTOR PANEL */}
          {currentRole === 'Instructor' && (
            <div className="bg-slate-900 border border-indigo-500/20 rounded-xl p-5 space-y-6" id="instructor-panel">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-indigo-400 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>منصة المدرب لإعداد المناهج (Curriculum Studio)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">بناء الوحدات، إضافة وتعديل الأسئلة النظرية، مراجعة وتعديل سيناريوهات المعامل.</p>
                </div>
                <span className="text-[10px] text-indigo-500 font-mono font-bold bg-indigo-950/50 border border-indigo-500/20 px-2 py-0.5 rounded-full">Content Creator</span>
              </div>

              {/* Lesson Metadata Editor */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-200">محرر تفاصيل الدروس وحلول المعامل:</h5>
                
                <div className="space-y-3.5 text-right">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold block">الدرس المستهدف بالتعديل:</label>
                    <select
                      value={selectedLessonForEdit}
                      onChange={(e) => setSelectedLessonForEdit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="m2-l1">الوحدة 2 - درس 1: الاستطلاع السلبي واستخدام Google Dorking</option>
                      <option value="m5-l1">الوحدة 5 - درس 1: فحص المنافذ واستخدام Nmap</option>
                      <option value="m11-l1">الوحدة 11 - درس 1: ملفات SUID لرفع الصلاحيات</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold block">العنوان الفرعي باللغة العربية:</label>
                    <input
                      type="text"
                      value={editTitleAr}
                      onChange={(e) => setEditTitleAr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold block">الملخص العلمي والشرح المبسط:</label>
                    <textarea
                      rows={3}
                      value={editSummaryAr}
                      onChange={(e) => setEditSummaryAr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>
                </div>

                {showSaveSuccess && (
                  <div className="bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-md">
                    🎉 تم تحديث ومزامنة محتوى الدرس في الخطة الدراسية للمنصة وإرسال إشعار للمراجعين!
                  </div>
                )}

                <button
                  onClick={saveLessonEdits}
                  className="bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded transition-all cursor-pointer flex items-center gap-1"
                >
                  حفظ وتحديث المحتوى 💾
                </button>
              </div>

              {/* Instructor Stats Dashboard */}
              <div className="border-t border-slate-800 pt-4 grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">الطلاب الفعالين</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">1,240</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">متوسط التقدم</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">78%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">الشهادات الصادرة</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">89 شهادة</span>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT REVIEWER PANEL */}
          {currentRole === 'Content Reviewer' && (
            <div className="bg-slate-900 border border-teal-500/20 rounded-xl p-5 space-y-6" id="reviewer-panel">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-teal-400 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-400" />
                    <span>مراجعة وضمان جودة المناهج (Content QA Review)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">مراجعة مسودات الوحدات والدروس والمعامل، تقديم الملاحظات الفنية للمدربين، والتصديق عليها.</p>
                </div>
                <span className="text-[10px] text-teal-500 font-mono font-bold bg-teal-950/50 border border-teal-500/20 px-2 py-0.5 rounded-full">Quality Assurance</span>
              </div>

              {/* Draft Modules Queue */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-200">مسودات ومناهج بانتظار الفحص والتدقيق:</h5>
                
                <div className="space-y-3">
                  {draftModules.map((draft) => (
                    <div key={draft.id} className="bg-slate-950 p-4 border border-slate-800 rounded-lg space-y-3 text-right">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <div className="space-y-0.5">
                          <strong className="text-xs text-slate-200">{draft.titleAr}</strong>
                          <span className="text-[10px] text-slate-500 block">من إعداد: {draft.author}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          draft.status === 'Pending Review' ? 'text-amber-400 border-amber-500/20 bg-amber-950/20' :
                          draft.status === 'Approved' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20' :
                          'text-rose-400 border-rose-500/20 bg-rose-950/20'
                        }`}>
                          {draft.status === 'Pending Review' ? 'قيد المراجعة' :
                           draft.status === 'Approved' ? 'تم النشر والقبول' :
                           draft.status === 'Changes Requested' ? 'ملاحظات مطلوبة' : 'مرفوضة'}
                        </span>
                      </div>

                      {draft.notes && (
                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-teal-400/90 leading-relaxed">
                          📌 <strong>ملاحظتك السابقة:</strong> {draft.notes}
                        </div>
                      )}

                      {draft.status === 'Pending Review' && (
                        <div className="space-y-3 pt-1">
                          <input
                            type="text"
                            placeholder="اكتب ملاحظاتك الفنية للمدرب هنا (اختياري)..."
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-slate-200 focus:outline-none focus:border-teal-500"
                          />
                          <div className="flex flex-wrap gap-2 justify-end">
                            <button
                              onClick={() => handleReviewAction(draft.id, 'Changes Requested')}
                              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 font-bold text-[10px] px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1"
                            >
                              <ThumbsDown className="w-3 h-3 text-rose-400" />
                              <span>طلب تعديلات</span>
                            </button>
                            <button
                              onClick={() => handleReviewAction(draft.id, 'Approved')}
                              className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-[10px] px-3.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1"
                            >
                              <ThumbsUp className="w-3 h-3 text-slate-950" />
                              <span>قبول ونشر المنهج 🎉</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEACHING ASSISTANT PANEL */}
          {currentRole === 'Teaching Assistant' && (
            <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-5 space-y-6" id="ta-panel">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-400" />
                    <span>لوحة مساعد التدريس (Teaching Assistant Panel)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">مراجعة الواجبات، تقييم التقارير الأمنية لغرفة العمليات، ومساعدة الطلاب في منتدى الحوار.</p>
                </div>
                <span className="text-[10px] text-amber-500 font-mono font-bold bg-amber-950/50 border border-amber-500/20 px-2 py-0.5 rounded-full">Assistant Level</span>
              </div>

              {/* Homework Grading Queue */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-200">التقارير الأمنية المرفوعة من الطلاب بانتظار التصحيح:</h5>
                
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="bg-slate-950 p-4 border border-slate-800 rounded-lg space-y-3 text-right">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <div className="space-y-0.5">
                          <strong className="text-xs text-slate-200">{sub.studentName}</strong>
                          <span className="text-[10px] text-slate-500 block">الدرس: {sub.lessonTitle} | {sub.submittedAt}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          sub.status === 'Graded' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20' : 'text-amber-400 border-amber-500/20 bg-amber-950/20'
                        }`}>
                          {sub.status === 'Graded' ? `تم التقييم (${sub.grade}/100)` : 'بانتظار الرصد'}
                        </span>
                      </div>

                      <div className="bg-slate-900 p-3 rounded border border-slate-850 font-sans text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {sub.reportContent}
                      </div>

                      {sub.status === 'Graded' && sub.feedback && (
                        <div className="p-2.5 bg-slate-950 border border-slate-900 rounded text-[10px] text-emerald-400 leading-relaxed">
                          📝 <strong>تغذيتك الراجعة:</strong> {sub.feedback}
                        </div>
                      )}

                      {sub.status === 'Pending' && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-3 gap-3 items-center">
                            <div className="col-span-1 space-y-1">
                              <label className="text-[10px] text-slate-400 block font-bold">الدرجة المستحقة (من 100):</label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={gradingScore}
                                onChange={(e) => setGradingScore(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-center font-mono font-bold text-slate-200"
                              />
                            </div>
                            <div className="col-span-2 space-y-1">
                              <label className="text-[10px] text-slate-400 block font-bold">التغذية الراجعة والتعليمات:</label>
                              <input
                                type="text"
                                value={gradingFeedback}
                                onChange={(e) => setGradingFeedback(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleGradeSubmission(sub.id)}
                              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-[10px] px-4 py-2 rounded transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5 text-slate-950" />
                              <span>اعتماد ورصد الدرجة للتقرير</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GUEST & STUDENT COMPANION WARNING */}
          {['Guest', 'Student'].includes(currentRole) && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center space-y-4" id="restricted-notice">
              <div className="bg-slate-950 p-4 rounded-full border border-slate-800 inline-block">
                <Lock className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-md font-black text-slate-200">
                  {currentRole === 'Guest' ? 'حساب الزوار غير الموثق (Guest Mode)' : 'حساب الطالب الأساسي (Student Mode)'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  أنت تتصفح حالياً بصفتك <strong>{currentRole === 'Guest' ? 'زائراً للمنصة' : 'طالباً دارساً'}</strong>. لا تمتلك صلاحيات إدارية أو إشرافية لحماية خوادم Docker أو تعديل المناهج والتعليمات.
                </p>
              </div>
              <div className="p-3 bg-amber-950/20 border border-amber-500/10 rounded-lg max-w-md mx-auto">
                <p className="text-[10px] text-amber-400 leading-normal">
                  💡 <strong>ملاحظة تقنية:</strong> استخدم "محاكي تغيير الصلاحيات" في الجزء العلوي من الصفحة لتجربة أدوار المعيد أو المدرب أو مراجع المحتوى واستكشاف خفايا وميزات المنصة الإدارية.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Lg: 5) - Interactive Permissions Matrix table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            
            <div className="space-y-1 text-right">
              <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>مصفوفة الصلاحيات المطبقة (RBAC System Matrix)</span>
              </h4>
              <p className="text-[10px] text-slate-400">
                مصفوفة الصلاحيات الموزعة على الأدوار السبعة وفقاً لما تم تعريفه وتصميمه في مرحلة التحليل التقني.
              </p>
            </div>

            {/* Selected Role Meta card from matrix switcher */}
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg space-y-2 text-right">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${selectedRoleDetails.color}`}>
                  {selectedRoleDetails.nameAr}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Role Details Lookup</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedRoleDetails.descAr}</p>
            </div>

            {/* Permissions Matrix Interactive Table */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {SYSTEM_PERMISSIONS.map((perm) => {
                const isAllowedForActiveRole = perm.roles.includes(currentRole as UserRole);
                const isAllowedForSelectedRole = perm.roles.includes(selectedRoleForMatrix);
                
                return (
                  <div
                    key={perm.id}
                    className={`p-3 rounded border text-right transition-all flex items-center justify-between gap-3 ${
                      isAllowedForSelectedRole
                        ? 'bg-emerald-950/10 border-emerald-500/10'
                        : 'bg-slate-950/40 border-slate-900'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <strong className="text-[11px] text-slate-200 block leading-tight">{perm.nameAr}</strong>
                      <span className="text-[9px] text-slate-500 block leading-tight font-mono">{perm.id}</span>
                    </div>

                    {/* Permission Status Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Active simulation role status badge */}
                      <div className={`p-1.5 rounded flex items-center justify-center border ${
                        isAllowedForSelectedRole
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`} title={`حالة الإذن لـ ${getRoleDetails(selectedRoleForMatrix).nameAr}`}>
                        {isAllowedForSelectedRole ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[9px] text-slate-500 text-center italic">
              يتم تطبيق هذا الفحص تلقائياً في واجهة الـ Router والـ API لحماية مسارات النظام من هجمات IDOR وتخطي الصلاحيات.
            </div>
          </div>

          {/* Audit Trail Trail Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-black text-slate-200">سجل الأحداث والتدقيق (Security Audit Logs)</h4>
              <button
                onClick={fetchAuditLogs}
                disabled={isLoadingLogs}
                className="text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                <span>تحديث</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {isLoadingLogs ? (
                <p className="text-xs text-slate-500 text-center py-4 animate-pulse">جاري جلب السجلات الأمنية من الخادم...</p>
              ) : auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">لا توجد سجلات.</p>
              ) : (
                auditLogs.map((log) => {
                  const details = getRoleDetails(log.userRole);
                  return (
                    <div key={log.id} className="text-[10px] border-b border-slate-850 pb-2 last:border-b-0 space-y-1 text-right">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-300">{log.userName}</span>
                          <span className={`text-[8px] px-1 py-0.2 border rounded-sm font-semibold ${details.color}`}>
                            {details.nameAr}
                          </span>
                        </div>
                        <span className="text-slate-500 font-mono text-[9px]">{new Date(log.timestamp).toLocaleTimeString('ar-SA')}</span>
                      </div>
                      <p className="text-slate-400 leading-normal">الأجراء: <strong className="text-slate-300">{log.action}</strong> - {log.details}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
