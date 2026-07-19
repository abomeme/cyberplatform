import React, { createContext, useContext } from 'react';
import { User } from '../types';

export type UserRole =
  | 'Guest'
  | 'Student'
  | 'Teaching Assistant'
  | 'Instructor'
  | 'Content Reviewer'
  | 'Administrator'
  | 'Super Administrator';

export interface PermissionDefinition {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  roles: UserRole[];
}

export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  {
    id: 'view_landing',
    nameAr: 'تصفح الصفحة التعريفية والأسعار',
    nameEn: 'Browse landing page & pricing',
    descriptionAr: 'رؤية صفحة الهبوط العامة وقائمة الأسعار والعروض التعريفية.',
    descriptionEn: 'View public landing page, pricing plans, and introductory content.',
    roles: ['Guest', 'Student', 'Teaching Assistant', 'Instructor', 'Content Reviewer', 'Administrator', 'Super Administrator'],
  },
  {
    id: 'view_lessons',
    nameAr: 'تصفح وقراءة الدروس النظرية',
    nameEn: 'View and read theoretical lessons',
    descriptionAr: 'قراءة المادة العلمية ومقاطع الفيديو التوضيحية داخل الوحدات.',
    descriptionEn: 'Read educational text and watch video tutorials within course modules.',
    roles: ['Student', 'Teaching Assistant', 'Instructor', 'Content Reviewer', 'Administrator', 'Super Administrator'],
  },
  {
    id: 'start_labs',
    nameAr: 'تشغيل المعامل العملية (Docker)',
    nameEn: 'Run practical labs (Docker)',
    descriptionAr: 'إنشاء وحذف حاويات Docker التفاعلية وحل التحديات والتقاط الأعلام.',
    descriptionEn: 'Spawn and destroy interactive Docker containers, solve challenges, and capture flags.',
    roles: ['Student', 'Teaching Assistant', 'Instructor', 'Administrator', 'Super Administrator'],
  },
  {
    id: 'participate_forum',
    nameAr: 'المشاركة والنشر في منتدى الحوار',
    nameEn: 'Post & comment in the discussion forum',
    descriptionAr: 'إنشاء موضوعات جديدة والتعليق على تساؤلات الزملاء.',
    descriptionEn: 'Create new discussion threads and comment on peers\' questions.',
    roles: ['Student', 'Teaching Assistant', 'Instructor', 'Administrator', 'Super Administrator'],
  },
  {
    id: 'moderate_forum',
    nameAr: 'إدارة وتثبيت ردود المنتدى (Moderation)',
    nameEn: 'Moderate & pin forum replies',
    descriptionAr: 'تثبيت الإجابات الصحيحة وتوجيه الطلاب والإشراف على المشاركات.',
    descriptionEn: 'Pin verified solutions, guide students, and moderate forum entries.',
    roles: ['Teaching Assistant', 'Instructor', 'Administrator', 'Super Administrator'],
  },
  {
    id: 'edit_curriculum',
    nameAr: 'تعديل وتطوير المحتوى التعليمي',
    nameEn: 'Edit & update course curriculum',
    descriptionAr: 'إضافة أو حذف الدروس والوحدات، وإعداد الاختبارات وتعديل المعامل.',
    descriptionEn: 'Create/delete lessons or modules, customize quizzes, and update labs.',
    roles: ['Instructor', 'Super Administrator'],
  },
  {
    id: 'review_content',
    nameAr: 'مراجعة وضبط جودة المحتوى',
    nameEn: 'Review curriculum quality',
    descriptionAr: 'مراجعة المناهج قبل النشر، كتابة ملاحظات المراجعين، والموافقة أو الرفض.',
    descriptionEn: 'Audit drafts before publishing, provide review guidelines, and approve/reject courses.',
    roles: ['Content Reviewer', 'Super Administrator'],
  },
  {
    id: 'view_audit_logs',
    nameAr: 'مراقبة وتدقيق سجلات الأنشطة (Audit Trail)',
    nameEn: 'View system audit trail logs',
    descriptionAr: 'الاطلاع على الحركات الأمنية وسجل الأنشطة الحساسة لتتبع التجاوزات.',
    descriptionEn: 'Audit security transactions and administrative logs to trace user operations.',
    roles: ['Administrator', 'Super Administrator'],
  },
  {
    id: 'manage_users',
    nameAr: 'إدارة المستخدمين والصلاحيات (RBAC Setup)',
    nameEn: 'Manage user roles & permissions',
    descriptionAr: 'تعديل أدوار الأعضاء، تفعيل/حظر الحسابات، وتوزيع الصلاحيات اليومية.',
    descriptionEn: 'Adjust membership levels, activate or ban accounts, and assign privileges.',
    roles: ['Administrator', 'Super Administrator'],
  },
  {
    id: 'system_core_db',
    nameAr: 'إدارة النواة البرمجية وقاعدة البيانات',
    nameEn: 'Database schema & core adjustments',
    descriptionAr: 'التحكم المطلق بملفات وقواعد بيانات النظام وترقية الهيكلية وتغيير مفاتيح التشفير.',
    descriptionEn: 'Direct modification of the source schema, migration runner, and encryption key variables.',
    roles: ['Super Administrator'],
  }
];

export interface PermissionsContextType {
  hasPermission: (permissionId: string) => boolean;
  getRoleDetails: (roleName: string) => { nameAr: string; nameEn: string; color: string; descAr: string };
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ user: User | null; children: React.ReactNode }> = ({ user, children }) => {
  const currentRole = (user?.role || 'Guest') as UserRole;

  const hasPermission = (permissionId: string): boolean => {
    const permission = SYSTEM_PERMISSIONS.find((p) => p.id === permissionId);
    if (!permission) return false;
    return permission.roles.includes(currentRole);
  };

  const getRoleDetails = (roleName: string) => {
    const rolesMap: Record<UserRole, { nameAr: string; nameEn: string; color: string; descAr: string }> = {
      'Guest': {
        nameAr: 'زائر',
        nameEn: 'Guest',
        color: 'text-slate-400 border-slate-500/20 bg-slate-950/40',
        descAr: 'متصفح غير مسجل استكشافي؛ يرى صفحة الهبوط والخطة الدراسية دون المحتوى الفعلي.'
      },
      'Student': {
        nameAr: 'طالب',
        nameEn: 'Student',
        color: 'text-sky-400 border-sky-500/20 bg-sky-950/40',
        descAr: 'المستخدم الأساسي؛ يدرس المواد العلمية ويحل المعامل والاختبارات ويكتسب النقاط.'
      },
      'Teaching Assistant': {
        nameAr: 'معيد',
        nameEn: 'Teaching Assistant',
        color: 'text-amber-400 border-amber-500/20 bg-amber-950/40',
        descAr: 'مساعد تدريس؛ يصحح تقارير الطلاب والواجبات ويشرف على المنتدى ويثبت الردود الموثوقة.'
      },
      'Instructor': {
        nameAr: 'مدرب',
        nameEn: 'Instructor',
        color: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/40',
        descAr: 'منشئ المحتوى؛ يبني الدورات والوحدات والأسئلة ويتابع إحصائيات طلابه.'
      },
      'Content Reviewer': {
        nameAr: 'مراجع محتوى',
        nameEn: 'Content Reviewer',
        color: 'text-teal-400 border-teal-500/20 bg-teal-950/40',
        descAr: 'ضابط الجودة؛ يراجع مسودات الدروس والمعامل ويعلق عليها بالقبول أو الرفض أو طلب تعديلات.'
      },
      'Administrator': {
        nameAr: 'مدير النظام',
        nameEn: 'Administrator',
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/40',
        descAr: 'مسؤول العمليات؛ يراقب الخوادم ويدقق سجلات الأنشطة (Audit) ويدير شؤون الأعضاء والترقيات.'
      },
      'Super Administrator': {
        nameAr: 'المدير العام',
        nameEn: 'Super Administrator',
        color: 'text-rose-400 border-rose-500/30 bg-rose-950/40 shadow-[0_0_15px_rgba(244,63,94,0.07)]',
        descAr: 'المالك والمشرف التقني الأعلى؛ تحكم مطلق وقدرة على تعديل قاعدة البيانات وهيكلية النظام.'
      }
    };
    return rolesMap[roleName as UserRole] || {
      nameAr: roleName,
      nameEn: roleName,
      color: 'text-slate-400 border-slate-500/20 bg-slate-950/40',
      descAr: 'دور غير معرف بالنظام.'
    };
  };

  return (
    <PermissionsContext.Provider value={{ hasPermission, getRoleDetails }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
