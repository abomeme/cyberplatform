import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { ALL_MODULES } from './src/data/curriculum';
import { User, TerminalLog, ForumPost, AuditLog } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// File-backed Persistence for Users, Forum, and Logs
const USER_DB_PATH = path.join(process.cwd(), 'user-data.json');
const FORUM_DB_PATH = path.join(process.cwd(), 'forum-data.json');
const AUDIT_DB_PATH = path.join(process.cwd(), 'audit-logs.json');
const ACCOUNTS_DB_PATH = path.join(process.cwd(), 'users-accounts.json');

// Initialize database with default data if not existing
const initialUser: User = {
  id: 'usr-1',
  name: 'أحمد الحربي',
  email: 'student@cyberacademy.sa',
  role: 'Student',
  points: 150,
  completedLessons: ['m1-l1'],
  solvedLabs: [],
  badges: [
    {
      id: 'badge-welcome',
      name: 'بداية الرحلة',
      description: 'سجلت بنجاح في المنصة التعليمية وأنهيت أول دروسك.',
      icon: 'Shield',
      unlockedAt: new Date().toISOString(),
    },
  ],
  joinedAt: new Date().toISOString(),
  completedDailyChallenges: [],
};

const defaultAccounts: Record<string, User & { password?: string }> = {
  'student@cyberacademy.sa': {
    ...initialUser,
    password: 'password123'
  },
  'admin@cyberacademy.sa': {
    id: 'usr-admin',
    name: 'م. فهد العتيبي',
    email: 'admin@cyberacademy.sa',
    password: 'admin123',
    role: 'Administrator',
    points: 5000,
    completedLessons: ALL_MODULES.flatMap(m => m.lessons.map(l => l.id)),
    solvedLabs: ['lab-m2-l1', 'lab-m2-l2', 'lab-m4-l1', 'lab-m5-l1', 'lab-m8-l1'],
    badges: [
      {
        id: 'badge-super-admin',
        name: 'الدرع الأعظم',
        description: 'صلاحيات إدارة كامل المنصة وتدقيق العمليات.',
        icon: 'ShieldAlert',
        unlockedAt: new Date().toISOString(),
      }
    ],
    joinedAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    completedDailyChallenges: []
  }
};

const initialForum: ForumPost[] = [
  {
    id: 'post-1',
    title: 'نصيحة للمبتدئين في فحص المنافذ بـ Nmap',
    content: 'السلام عليكم، أنصح بشدة بمشاهدة درس المصافحة الثلاثية لـ TCP قبل البدء بالعمل على أداة Nmap لأن فهم آلية SYN و ACK هو سر احتراف الفحص وتجنب أنظمة كشف التسلل (IDS). بالتوفيق للجميع!',
    author: {
      name: 'م. خالد الدوسري',
      role: 'Instructor',
      points: 2500
    },
    category: 'نصائح عامة',
    upvotes: 18,
    repliesCount: 2,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    replies: [
      {
        id: 'rep-1',
        content: 'نصيحة ذهبية يا مهندس، بالفعل كنت أواجه صعوبة في فهم الأعلام (Flags) والآن اتضحت الصورة.',
        author: {
          name: 'سارة العتيبي',
          role: 'Student',
          points: 320
        },
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'rep-2',
        content: 'أتفق تماماً، الفحص الصامت (-sS) يعتمد كلياً على عدم إتمام المصافحة لتفادي رصد الجدران النارية.',
        author: {
          name: 'يزيد الشمري',
          role: 'Teaching Assistant',
          points: 1250
        },
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'post-2',
    title: 'مساعدة في معمل رفع الصلاحيات SUID',
    content: 'مرحباً شباب، هل يمكن لأحد مساعدتي في تلميح بسيط حول كيفية العثور على أداة suid-helper في المعمل الثاني؟ قمت بتجربة أمر find ولكن تظهر لي الكثير من النتائج غير المفهومة.',
    author: {
      name: 'عمر القحطاني',
      role: 'Student',
      points: 80
    },
    category: 'حلول المعامل',
    upvotes: 4,
    repliesCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    replies: [
      {
        id: 'rep-3',
        content: 'أهلاً عمر! تأكد من استخدام فلتر الأخطاء `2>/dev/null` في نهاية الأمر لإخفاء مجلدات الأذونات المرفوضة، وقم بالبحث في المجلدات التنفيذية القياسية.',
        author: {
          name: 'يزيد الشمري',
          role: 'Teaching Assistant',
          points: 1250
        },
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
      }
    ]
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-1',
    userName: 'أحمد الحربي',
    userRole: 'Student',
    action: 'تأكيد الحساب',
    details: 'أكمل المستخدم التسجيل الأولي بنجاح.',
    ipAddress: '192.168.1.100',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'log-2',
    userId: 'usr-1',
    userName: 'أحمد الحربي',
    userRole: 'Student',
    action: 'اجتياز اختبار',
    details: 'اجتاز اختبار مقدمة الأمن الأخلاقي بنتيجة 100%.',
    ipAddress: '192.168.1.100',
    timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
  }
];

// Helper functions for database IO
function getDB<T>(filePath: string, defaultData: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
  } catch (err) {
    console.error(`Error loading database file at ${filePath}:`, err);
    return defaultData;
  }
}

function saveDB<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving database file at ${filePath}:`, err);
  }
}

// Database Getters & Setters
let userObj = getDB<User>(USER_DB_PATH, initialUser);
let forumPosts = getDB<ForumPost[]>(FORUM_DB_PATH, initialForum);
let auditLogs = getDB<AuditLog[]>(AUDIT_DB_PATH, initialAuditLogs);

function saveCurrentUser(user: User) {
  userObj = user;
  saveDB(USER_DB_PATH, userObj);
  
  try {
    const accounts = getDB<Record<string, User & { password?: string }>>(ACCOUNTS_DB_PATH, defaultAccounts);
    if (user.email) {
      const emailKey = user.email.toLowerCase().trim();
      const existingPassword = accounts[emailKey]?.password || 'password123';
      accounts[emailKey] = {
        ...user,
        password: existingPassword
      };
      saveDB(ACCOUNTS_DB_PATH, accounts);
    }
  } catch (err) {
    console.error('Error saving to accounts db:', err);
  }
}

function logAction(userId: string, userName: string, role: string, action: string, details: string) {
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    userId,
    userName,
    userRole: role,
    action,
    details,
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString(),
  };
  auditLogs.unshift(newLog);
  saveDB(AUDIT_DB_PATH, auditLogs);
}

// API: Get Current User
app.get('/api/user', (req, res) => {
  res.json(userObj);
});

// API: Get Current User Profile (matched with client fetch)
app.get('/api/user/profile', (req, res) => {
  res.json(userObj);
});

// API: Register User / Signup (matched with client fetch)
app.post('/api/user/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'الاسم مطلوب' });
  }
  
  const cleanEmail = (email || `${Date.now()}@cyberacademy.sa`).toLowerCase().trim();
  
  try {
    const accounts = getDB<Record<string, User & { password?: string }>>(ACCOUNTS_DB_PATH, defaultAccounts);
    if (accounts[cleanEmail]) {
      return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.' });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      role: 'Student',
      points: 100,
      completedLessons: [],
      solvedLabs: [],
      badges: [
        {
          id: 'badge-welcome',
          name: 'بداية الرحلة',
          description: 'سجلت بنجاح في المنصة التعليمية وبدأت مسيرتك.',
          icon: 'Shield',
          unlockedAt: new Date().toISOString(),
        },
      ],
      joinedAt: new Date().toISOString(),
      completedDailyChallenges: [],
    };

    accounts[cleanEmail] = {
      ...newUser,
      password: password || 'password123'
    };

    saveDB(ACCOUNTS_DB_PATH, accounts);
    saveCurrentUser(newUser);

    logAction(newUser.id, newUser.name, newUser.role, 'إنشاء حساب', `تسجيل حساب طالب جديد بالمنصة باسم: ${name} وبريد إلكتروني: ${newUser.email}`);
    res.json(newUser);
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'حدث خطأ غير متوقع أثناء التسجيل' });
  }
});

// API: Register User (simulation)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'الاسم والبريد الإلكتروني مطلوبان' });
  }
  
  const cleanEmail = email.toLowerCase().trim();
  try {
    const accounts = getDB<Record<string, User & { password?: string }>>(ACCOUNTS_DB_PATH, defaultAccounts);
    if (accounts[cleanEmail]) {
      return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل.' });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      role: 'Student',
      points: 100,
      completedLessons: [],
      solvedLabs: [],
      badges: [
        {
          id: 'badge-welcome',
          name: 'بداية الرحلة',
          description: 'سجلت بنجاح في المنصة التعليمية وبدأت مسيرتك.',
          icon: 'Shield',
          unlockedAt: new Date().toISOString(),
        },
      ],
      joinedAt: new Date().toISOString(),
      completedDailyChallenges: [],
    };

    accounts[cleanEmail] = {
      ...newUser,
      password: password || 'password123'
    };

    saveDB(ACCOUNTS_DB_PATH, accounts);
    saveCurrentUser(newUser);

    logAction(newUser.id, newUser.name, newUser.role, 'إنشاء حساب', `تسجيل حساب جديد بالمنصة باسم: ${name}`);
    res.json(newUser);
  } catch (err) {
    console.error('Error in auth register:', err);
    res.status(500).json({ error: 'خطأ في التسجيل' });
  }
});

// API: Login User
app.post('/api/auth/login', (req, res) => {
  const { email, password, isGoogle } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
  }

  const cleanEmail = email.toLowerCase().trim();
  
  try {
    const accounts = getDB<Record<string, User & { password?: string }>>(ACCOUNTS_DB_PATH, defaultAccounts);

    if (isGoogle) {
      let existingUser = accounts[cleanEmail];
      if (!existingUser) {
        // Auto-register Gmail user
        const prefix = cleanEmail.split('@')[0];
        const parts = prefix.split('.');
        const simulatedName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'طالب جديد';
        
        existingUser = {
          id: `usr-${Date.now()}`,
          name: simulatedName,
          email: cleanEmail,
          role: 'Student',
          points: 100,
          completedLessons: [],
          solvedLabs: [],
          badges: [
            {
              id: 'badge-welcome',
              name: 'بداية الرحلة',
              description: 'سجلت بنجاح في المنصة التعليمية وبدأت مسيرتك عبر حساب Google.',
              icon: 'Shield',
              unlockedAt: new Date().toISOString(),
            },
          ],
          joinedAt: new Date().toISOString(),
          completedDailyChallenges: [],
        };

        accounts[cleanEmail] = {
          ...existingUser,
          password: 'google-auth-simulated'
        };
        saveDB(ACCOUNTS_DB_PATH, accounts);
        logAction(existingUser.id, existingUser.name, existingUser.role, 'حساب Google جديد', `إنشاء حساب تلقائي عبر Google: ${cleanEmail}`);
      }

      saveCurrentUser(existingUser);
      logAction(userObj.id, userObj.name, userObj.role, 'تسجيل دخول Google', 'تسجيل دخول ناجح عبر Google.');
      return res.json(userObj);
    }

    const userRecord = accounts[cleanEmail];
    if (!userRecord) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير مسجل بالمنصة' });
    }

    if (password && userRecord.password !== password) {
      return res.status(400).json({ error: 'كلمة المرور غير صحيحة' });
    }

    saveCurrentUser(userRecord);
    logAction(userObj.id, userObj.name, userObj.role, 'تسجيل دخول', `تسجيل دخول ناجح للمستخدم: ${userObj.name}`);
    res.json(userObj);
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول' });
  }
});

// API: Update profile or role (for simulating instructor / admin shifts)
app.post('/api/user/role', (req, res) => {
  const { role } = req.body;
  if (role) {
    userObj.role = role;
    saveCurrentUser(userObj);
    logAction(userObj.id, userObj.name, userObj.role, 'تغيير الدور', `تم تبديل دور المستخدم إلى ${role}`);
  }
  res.json(userObj);
});

// API: Change Role (matched with client fetch)
app.post('/api/user/change-role', (req, res) => {
  const { role } = req.body;
  if (role) {
    userObj.role = role;
    saveCurrentUser(userObj);
    logAction(userObj.id, userObj.name, userObj.role, 'تغيير الدور', `تم تبديل دور المستخدم إلى ${role}`);
  }
  res.json(userObj);
});

// API: Reset Progress (clean start)
app.post('/api/user/reset', (req, res) => {
  userObj = {
    ...initialUser,
    id: `usr-${Date.now()}`,
    joinedAt: new Date().toISOString(),
  };
  saveCurrentUser(userObj);
  logAction(userObj.id, userObj.name, userObj.role, 'إعادة تعيين التقدم', 'مسح جميع الدروس المحلولة والمعامل وإعادة ضبط النقاط.');
  res.json(userObj);
});

// Daily Challenges Pool & Endpoints
interface DailyChallenge {
  id: string;
  question: string;
  type: 'text' | 'choice';
  options?: string[];
  answer: string;
  points: number;
  hint: string;
}

const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'challenge-1',
    question: 'ما هو رقم المنفذ (Port Number) المخصص لبروتوكول تصفح الويب المشفر والآمن HTTPS بشكل افتراضي؟',
    type: 'text',
    answer: '443',
    points: 30,
    hint: 'يتكون من 3 أرقام ويبدأ بالرقم 4.'
  },
  {
    id: 'challenge-2',
    question: 'ما هو اسم الملف في نظام التشغيل Linux الذي يحتوي على كلمات المرور المشفرة (hashed passwords) للمستخدمين؟',
    type: 'choice',
    options: ['/etc/passwd', '/etc/shadow', '/etc/hosts', '/etc/group'],
    answer: '/etc/shadow',
    points: 40,
    hint: 'يشير إلى الظل (Shadow) ويقع تحت مجلد etc.'
  },
  {
    id: 'challenge-3',
    question: 'ما هو نوع الهجوم الذي يقوم فيه المهاجم بإدراج شفرات خبيثة (مثل JavaScript) داخل صفحات ويب يزورها مستخدمون آخرون؟',
    type: 'choice',
    options: ['SQL Injection (SQLi)', 'Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'Distributed Denial of Service (DDoS)'],
    answer: 'Cross-Site Scripting (XSS)',
    points: 35,
    hint: 'يُعرف اختصاراً بـ XSS.'
  },
  {
    id: 'challenge-4',
    question: 'ما هو أمر Linux المستخدم لعرض المسار الحالي الكامل للمجلد الذي تعمل فيه حالياً؟',
    type: 'text',
    answer: 'pwd',
    points: 30,
    hint: 'اختصار لـ Print Working Directory.'
  },
  {
    id: 'challenge-5',
    question: 'ما هي الأداة الشهيرة مفتوحة المصدر المستخدمة لالتقاط وتحليل حزم بيانات الشبكة (Packet Sniffing)؟',
    type: 'choice',
    options: ['Wireshark', 'Nmap', 'Metasploit', 'John the Ripper'],
    answer: 'Wireshark',
    points: 40,
    hint: 'شعارها زعنفة قرش زرقاء.'
  },
  {
    id: 'challenge-6',
    question: 'ما هي الثغرة الأمنية التي تحدث عندما يثق البرنامج بمدخلات المستخدم ويقوم بتركيب استعلام لقاعدة البيانات مباشرة دون تعقيم؟',
    type: 'choice',
    options: ['Buffer Overflow', 'SQL Injection', 'Path Traversal', 'Command Injection'],
    answer: 'SQL Injection',
    points: 30,
    hint: 'تتعلق بحقن لغة الاستعلامات البنيوية (SQL).'
  }
];

// GET active daily challenge
app.get('/api/user/daily-challenge', (req, res) => {
  if (!userObj.completedDailyChallenges) {
    userObj.completedDailyChallenges = [];
  }
  const dayIndex = new Date().getDate() % DAILY_CHALLENGES.length;
  const challenge = DAILY_CHALLENGES[dayIndex];
  
  res.json({
    id: challenge.id,
    question: challenge.question,
    type: challenge.type,
    options: challenge.options,
    points: challenge.points,
    hint: challenge.hint,
    isCompleted: userObj.completedDailyChallenges.includes(challenge.id)
  });
});

// POST submit answer for daily challenge
app.post('/api/user/daily-challenge/submit', (req, res) => {
  const { challengeId, answer } = req.body;
  if (!challengeId || answer === undefined) {
    return res.status(400).json({ error: 'مطلوب معرّف التحدي والإجابة' });
  }

  const challenge = DAILY_CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) {
    return res.status(404).json({ error: 'التحدي غير موجود' });
  }

  if (!userObj.completedDailyChallenges) {
    userObj.completedDailyChallenges = [];
  }

  if (userObj.completedDailyChallenges.includes(challengeId)) {
    return res.status(400).json({ error: 'لقد قمت بحل هذا التحدي بالفعل اليوم!' });
  }

  // Normalize answers
  const normalizedUserAns = answer.toString().trim().toLowerCase();
  const normalizedExpectedAns = challenge.answer.trim().toLowerCase();

  if (normalizedUserAns === normalizedExpectedAns) {
    userObj.completedDailyChallenges.push(challengeId);
    userObj.points += challenge.points;
    saveCurrentUser(userObj);
    logAction(userObj.id, userObj.name, userObj.role, 'حل التحدي اليومي', `حل بنجاح التحدي اليومي السريع [${challenge.id}] واكتسب +${challenge.points} XP`);
    return res.json({ success: true, pointsAwarded: challenge.points, user: userObj });
  } else {
    return res.json({ success: false, error: 'إجابة خاطئة! حاول مجدداً مستعيناً بالتلميح.' });
  }
});

// API: Lesson Complete
app.post('/api/lessons/:id/complete', (req, res) => {
  const { id } = req.params;
  if (!userObj.completedLessons.includes(id)) {
    userObj.completedLessons.push(id);
    userObj.points += 20; // 20 points for reading lessons
    
    // Check if badges need to be unlocked
    if (userObj.completedLessons.length >= 5 && !userObj.badges.some(b => b.id === 'badge-reader')) {
      userObj.badges.push({
        id: 'badge-reader',
        name: 'القارئ النهم',
        description: 'أنهيت قراءة ومذاكرة 5 دروس سيبرانية بالكامل.',
        icon: 'BookOpen',
        unlockedAt: new Date().toISOString(),
      });
    }

    saveCurrentUser(userObj);
    logAction(userObj.id, userObj.name, userObj.role, 'إنهاء درس', `أنهى بنجاح مذاكرة الدرس ${id}`);
  }
  res.json(userObj);
});

// API: Submit Lab Flag
app.post('/api/labs/submit-flag', (req, res) => {
  const { labId, flag } = req.body;
  if (!labId || !flag) {
    return res.status(400).json({ error: 'معرّف المعمل والعلم مطلوبان' });
  }

  // Find lab in curriculum
  let expectedFlag = '';
  let pointsToAward = 100;
  let labTitle = '';

  for (const m of ALL_MODULES) {
    for (const l of m.lessons) {
      if (l.lab && l.lab.id === labId) {
        expectedFlag = l.lab.expectedFlag;
        pointsToAward = l.lab.points;
        labTitle = l.lab.title;
        break;
      }
    }
  }

  // Clean strings
  const cleanSubmitted = flag.trim();
  const cleanExpected = expectedFlag.trim();

  if (cleanSubmitted === cleanExpected) {
    if (!userObj.solvedLabs.includes(labId)) {
      userObj.solvedLabs.push(labId);
      userObj.points += pointsToAward;

      // Unlock badges based on labs
      if (userObj.solvedLabs.length === 1 && !userObj.badges.some(b => b.id === 'badge-first-hack')) {
        userObj.badges.push({
          id: 'badge-first-hack',
          name: 'الاختراق الأول',
          description: 'نجحت في حل أول معمل سيبراني عملي واقتناص العلم.',
          icon: 'Terminal',
          unlockedAt: new Date().toISOString(),
        });
      }
      if (userObj.solvedLabs.length >= 3 && !userObj.badges.some(b => b.id === 'badge-ethical-hacker')) {
        userObj.badges.push({
          id: 'badge-ethical-hacker',
          name: 'هاكر أخلاقي معتمد',
          description: 'تمكنت من فك وحل 3 معامل هجومية ودفاعية متقدمة.',
          icon: 'Award',
          unlockedAt: new Date().toISOString(),
        });
      }

      saveCurrentUser(userObj);
      logAction(userObj.id, userObj.name, userObj.role, 'حل معمل بنجاح', `اقتنص العلم الصحيح للمعمل: "${labTitle}" وحصل على ${pointsToAward} نقطة.`);
    }
    return res.json({ success: true, pointsAwarded: pointsToAward, user: userObj });
  } else {
    logAction(userObj.id, userObj.name, userObj.role, 'محاولة حل معمل فاشلة', `أرسل علماً خاطئاً للمعمل ${labId}`);
    return res.json({ success: false, error: 'العلم غير صحيح، راجع الخطوات والتلميحات وحاول مجدداً!' });
  }
});

// API: Terminal simulation engine
app.post('/api/labs/:labId/terminal', (req, res) => {
  const { labId } = req.params;
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'الأمر مطلوب' });
  }

  const parts = command.trim().split(/\s+/);
  const baseCmd = parts[0].toLowerCase();

  let output = '';
  let status: 'output' | 'error' | 'success' = 'output';

  // Basic universal commands
  if (baseCmd === 'help') {
    output = `الأوامر المتاحة في هذه الشبكة التدريبية الآمنة:
  help                    - عرض هذه المساعدة الدعم البرمجي.
  clear                   - مسح الشاشة بالكامل.
  whoami                  - طباعة اسم مستخدم الجلسة النشط.
  id                      - طباعة معلومات الهوية والمجموعات الحالية.
  ls [path]               - عرض قائمة الملفات والمجلدات.
  cd [dir]                - تغيير المجلد النشط حالياً.
  pwd                     - طباعة مسار المجلد الحالي.
  cat [file]              - طباعة محتويات ملف نصي.
  nmap [options] [target] - فحص الشبكة واستكشاف المنافذ (مثال: nmap -sV 192.168.1.50)
  find [path] [filters]  - البحث عن ملفات في النظام (مثال: find / -perm -4000)
  suid-reader [file]      - أداة خاصة مدمجة لرفع الصلاحيات تتيح قراءة الملفات كمستخدم جذر (root)
`;
  } else if (baseCmd === 'whoami') {
    if (labId === 'lab-m2-l2' && command.includes('root-active')) {
      output = 'root';
    } else {
      output = 'student';
    }
  } else if (baseCmd === 'id') {
    output = 'uid=1001(student) gid=1001(student) groups=1001(student)';
  } else if (baseCmd === 'pwd') {
    output = labId === 'lab-m2-l1' ? '/home/student' : '/home/student';
  } else if (baseCmd === 'clear') {
    output = 'CLEAR_SCREEN';
  }

  // LAB 1: File Navigation (lab-m2-l1)
  else if (labId === 'lab-m2-l1') {
    if (baseCmd === 'ls') {
      if (parts[1] === 'challenges' || parts[1] === './challenges') {
        output = 'flag.txt\treadme.md';
      } else if (!parts[1]) {
        output = 'challenges/\tDocuments/\tDownloads/';
      } else {
        output = `ls: cannot access '${parts[1]}': No such file or directory`;
        status = 'error';
      }
    } else if (baseCmd === 'cd') {
      const targetDir = parts[1];
      if (!targetDir || targetDir === '~') {
        output = 'Changed directory to /home/student';
      } else if (targetDir === 'challenges') {
        output = 'Changed directory to /home/student/challenges';
      } else if (targetDir === '..' || targetDir === '/') {
        output = 'Changed directory to parent';
      } else {
        output = `bash: cd: ${targetDir}: No such file or directory`;
        status = 'error';
      }
    } else if (baseCmd === 'cat') {
      const targetFile = parts[1];
      if (!targetFile) {
        output = 'cat: missing file operand';
        status = 'error';
      } else if (targetFile === 'challenges/flag.txt' || targetFile === 'flag.txt' || targetFile === './challenges/flag.txt') {
        output = 'FLAG{LINUX_NAVIGATOR_MASTER}';
        status = 'success';
      } else if (targetFile === 'challenges/readme.md' || targetFile === 'readme.md') {
        output = 'مرحباً بك! هذا الملف يعلمك كيفية العمل. ملف العلم هو flag.txt في نفس المجلد.';
      } else {
        output = `cat: ${targetFile}: No such file or directory`;
        status = 'error';
      }
    } else {
      output = `bash: ${baseCmd}: command not found (أو غير مدعوم في هذا المعمل المبسط. اكتب help لمعرفة الأوامر).`;
      status = 'error';
    }
  }

  // LAB 2: SUID Privilege Escalation (lab-m2-l2)
  else if (labId === 'lab-m2-l2') {
    if (baseCmd === 'find') {
      if (command.includes('-perm -4000') || command.includes('4000')) {
        output = `/usr/bin/chsh
/usr/bin/passwd
/usr/bin/sudo
/usr/local/bin/suid-reader  <-- [تنبيه أمني: بت SUID نشط لمالك الملف root]
/bin/mount
`;
      } else {
        output = 'usage: find [path] -perm [permissions] [options]';
        status = 'error';
      }
    } else if (baseCmd === 'ls') {
      output = 'challenges/\tpublic_html/';
    } else if (baseCmd === 'cat') {
      const file = parts[1];
      if (file === '/root/flag.txt' || file === 'root/flag.txt') {
        output = 'cat: /root/flag.txt: Permission denied (خطأ: أذونات غير كافية لقرائته، تحتاج صلاحية root)';
        status = 'error';
      } else {
        output = `cat: ${file || ''}: No such file or directory or Permission Denied`;
        status = 'error';
      }
    } else if (baseCmd === 'suid-reader' || command.includes('suid-reader')) {
      // SUID binary usage
      const targetFile = parts[1] || parts[2] || '';
      if (!targetFile) {
        output = `suid-reader v1.0.2 - أداة قراءة الملفات الإدارية السريعة
الاستخدام: suid-reader [مسار الملف الحساس]`;
      } else if (targetFile.includes('/root/flag.txt') || targetFile.includes('flag.txt')) {
        output = `[+] تشغيل الأداة بصلاحيات مالك الملف الأصل (root)... نجح!
[+] قراءة محتوى الملف /root/flag.txt:

FLAG{SUID_EXPLOIT_ROOT_SUCCESS}

تهانينا! لقد استغليت SUID بنجاح لقراءة ملفات الجذر الحساسة!`;
        status = 'success';
      } else {
        output = `[-] فشل قراءة الملف: '${targetFile}'. تأكد من كتابة المسار الصحيح /root/flag.txt`;
        status = 'error';
      }
    } else {
      output = `bash: ${baseCmd}: command not found. اكتب help لتفقد المساعدة وتذكر أن هناك ملف SUID غريب في النظام!`;
      status = 'error';
    }
  }

  // LAB 3: Nmap Network Discovery (lab-m5-l1)
  else if (labId === 'lab-m5-l1') {
    if (baseCmd === 'nmap') {
      const hasSv = command.includes('-sV') || command.includes('-A');
      const targetIp = command.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);

      if (!targetIp) {
        output = 'خطأ: يرجى كتابة عنوان IP المستهدف الصحيح (مثال: nmap 192.168.1.50)';
        status = 'error';
      } else if (targetIp[0] !== '192.168.1.50') {
        output = `Nmap scan report for ${targetIp[0]}\nHost is up, but all 1000 ports are filtered/closed. Try scanning 192.168.1.50 instead!`;
        status = 'error';
      } else {
        // Scanning target host 192.168.1.50
        output = `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toISOString().slice(0, 19)} UTC
Nmap scan report for 192.168.1.50
Host is up (0.0031s latency).
Not shown: 997 closed ports

PORT     STATE SERVICE`;

        if (hasSv) {
          output += ` VERSION
21/tcp   open  ftp     vsftpd 2.3.4 [علم المعمل: FLAG{NMAP_FTP_VERSION_ENUMERATION}]
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))

Service detection performed. Please submit the FTP service flag shown above.`;
          status = 'success';
        } else {
          output += `
21/tcp   open  ftp
22/tcp   open  ssh
80/tcp   open  http

نصيحة: استخدم مفتاح فحص الإصدارات (-sV) لمعرفة معلومات أدق والخدمات وإصداراتها وإيجاد علم المعمل!`;
        }
      }
    } else {
      output = `bash: ${baseCmd}: command not found. في هذا المعمل تحتاج أساساً إلى استخدام أداة nmap لفحص الشبكة واستكشاف المنافذ المتاحة.`;
      status = 'error';
    }
  }

  // Default command response fallback
  else {
    output = `bash: ${command}: command run. (لم يتم تهيئة بيئة تفاعلية معقدة لهذا الدرس الفرعي، انتقل للدروس التي تحتوي على معامل في القائمة الجانبية!)`;
  }

  res.json({ output, status });
});

// API: Submit Quiz Answers
app.post('/api/quizzes/submit', (req, res) => {
  const { lessonId, answers } = req.body; // answers is a key-value record of questionId -> studentAnswer
  if (!lessonId || !answers) {
    return res.status(400).json({ error: 'المدخلات غير كاملة' });
  }

  // Find quiz
  let targetLesson = null;
  for (const m of ALL_MODULES) {
    const found = m.lessons.find(l => l.id === lessonId);
    if (found && found.quiz) {
      targetLesson = found;
      break;
    }
  }

  if (!targetLesson || !targetLesson.quiz) {
    return res.status(404).json({ error: 'لم يتم العثور على اختبار لهذا الدرس' });
  }

  const quiz = targetLesson.quiz;
  let correctCount = 0;
  const totalQuestions = quiz.questions.length;
  const questionResults = [];

  for (const q of quiz.questions) {
    const studentAns = answers[q.id];
    let isCorrect = false;

    if (q.type === 'MCQ' || q.type === 'TrueFalse') {
      isCorrect = String(studentAns).trim() === String(q.correctAnswer).trim();
    } else if (q.type === 'Ordering') {
      isCorrect = String(studentAns).trim() === String(q.correctAnswer).trim();
    }

    if (isCorrect) {
      correctCount++;
    }

    questionResults.push({
      questionId: q.id,
      studentAnswer: studentAns,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    });
  }

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercentage >= 70;

  if (passed) {
    // Add points & mark lesson as complete
    if (!userObj.completedLessons.includes(lessonId)) {
      userObj.completedLessons.push(lessonId);
      userObj.points += 50; // Extra 50 points for passing quiz
      saveDB(USER_DB_PATH, userObj);
      logAction(userObj.id, userObj.name, userObj.role, 'اجتياز اختبار', `اجتاز بنجاح اختبار الدرس ${lessonId} بنتيجة ${scorePercentage}% وحصل على 50 نقطة.`);
    }
  } else {
    logAction(userObj.id, userObj.name, userObj.role, 'رسوب في اختبار', `رسب في اختبار الدرس ${lessonId} بنتيجة ${scorePercentage}%`);
  }

  res.json({
    scorePercentage,
    passed,
    correctCount,
    totalQuestions,
    results: questionResults,
    user: userObj
  });
});

// API: Forum endpoints
app.get('/api/forum/posts', (req, res) => {
  res.json(forumPosts);
});

app.post('/api/forum/posts', (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'العنوان والمحتوى مطلوبان' });
  }

  const newPost: ForumPost = {
    id: `post-${Date.now()}`,
    title,
    content,
    author: {
      name: userObj.name,
      role: userObj.role,
      points: userObj.points,
    },
    category: category || 'عام',
    upvotes: 0,
    repliesCount: 0,
    createdAt: new Date().toISOString(),
    replies: []
  };

  forumPosts.unshift(newPost);
  saveDB(FORUM_DB_PATH, forumPosts);
  logAction(userObj.id, userObj.name, userObj.role, 'كتابة منشور بالمنتدى', `نشر موضوعاً جديداً بعنوان: "${title}"`);
  res.json(newPost);
});

app.post('/api/forum/posts/:postId/reply', (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'المحتوى مطلوب' });
  }

  const post = forumPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'المنشور غير موجود' });
  }

  const newReply = {
    id: `rep-${Date.now()}`,
    content,
    author: {
      name: userObj.name,
      role: userObj.role,
      points: userObj.points,
    },
    createdAt: new Date().toISOString(),
  };

  post.replies.push(newReply);
  post.repliesCount = post.replies.length;
  saveDB(FORUM_DB_PATH, forumPosts);
  logAction(userObj.id, userObj.name, userObj.role, 'كتابة رد بالمنتدى', `رد على المنشور "${post.title}"`);
  res.json(post);
});

// API: Admin audit logs
app.get('/api/admin/audit-logs', (req, res) => {
  res.json(auditLogs);
});

// Vite Middleware & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
