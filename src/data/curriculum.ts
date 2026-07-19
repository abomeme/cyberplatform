import { CourseModule } from '../types';

export const ALL_MODULES: CourseModule[] = [
  {
    id: 'm1',
    title: 'مقدمة في الاختراق الأخلاقي (CEH Module 01)',
    titleEn: 'Introduction to Ethical Hacking',
    description: 'فهم أساسيات أمن المعلومات، قوانين الأمن السيبراني، الأخلاقيات المهنية، وثلاثية CIA والتهديدات الأمنية مع منهجية اختبار الاختراق المعيارية.',
    descriptionEn: 'Understand information security basics, cyber laws, professional ethics, the CIA triad, and standard penetration testing methodologies.',
    difficulty: 'Beginner',
    difficultyAr: 'مبتدئ',
    duration: '3 ساعات',
    durationAr: '3 ساعات',
    durationEn: '3 hours',
    lessonsCount: 2,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['الأخلاقيات الأمنية', 'ثلاثية CIA', 'منهجيات الاختراق'],
    skillsAr: ['الأخلاقيات الأمنية', 'ثلاثية CIA', 'منهجيات الاختراق'],
    lessons: [
      {
        id: 'm1-l1',
        moduleId: 'm1',
        title: 'مفهوم الاختراق الأخلاقي والمسؤولية القانونية',
        titleEn: 'Concept of Ethical Hacking & Legal Liability',
        summary: 'في هذا الدرس سنتعرف على الفرق بين المخترق الأخلاقي (White Hat) والمخترق الخبيث (Black Hat)، وما هي القوانين الدولية والمحلية التي تجرّم التعدي غير المصرح به على الأنظمة الرقمية، مع دراسة ميثاق أخلاقيات منظمة EC-Council.',
        summaryEn: 'In this lesson, we will understand the difference between White Hat and Black Hat hackers, and learn about the local and international laws governing security testing and EC-Council code of ethics.',
        duration: '45 دقيقة',
        hasVideo: true,
        videoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        hasPdf: true,
        pdfUrl: '#',
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m1-l1',
          lessonId: 'm1-l1',
          timeLimitSeconds: 180,
          questions: [
            {
              id: 'q1',
              type: 'MCQ',
              question: 'ما هو الفرق الأساسي والدستوري بين المخترق الأخلاقي والمخترق الخبيث؟',
              questionEn: 'What is the primary difference between an ethical hacker and a malicious hacker?',
              options: [
                'الأدوات التقنية المستخدمة في الفحص',
                'الحصول على إذن وتفويض خطي مسبق (Written Authorization) من المالك',
                'سرعة تنفيذ الهجمات وتطوير البرمجيات الخبيثة',
                'الموقع الجغرافي ونوع نظام التشغيل المستخدم'
              ],
              optionsEn: [
                'The technical tools used in operations',
                'Obtaining prior written authorization from the owner before testing',
                'The speed of executing attacks and developing malware',
                'The geographic location and type of operating system used'
              ],
              correctAnswer: 'الحصول على إذن وتفويض خطي مسبق (Written Authorization) من المالك',
              explanation: 'المخترق الأخلاقي يعمل دائماً بموجب تفويض رسمي مكتوب (Rules of Engagement) يحميه قانونياً ويحدد نطاق الفحص المسموح به.',
              explanationEn: 'Ethical hackers always work under a formal written agreement outlining the scope and rules of engagement, which protects them legally.',
              points: 20
            },
            {
              id: 'q2',
              type: 'TrueFalse',
              question: 'يسمح للمخترق الأخلاقي بفحص أي شبكة عامة على الإنترنت طالما أنه لا يسبب ضرراً مادياً أو يعطل الخدمات.',
              questionEn: 'An ethical hacker is allowed to scan any public network on the Internet as long as they do not cause physical or service disruption.',
              options: ['صح (True)', 'خطأ (False)'],
              optionsEn: ['True', 'False'],
              correctAnswer: 'خطأ (False)',
              explanation: 'أي عملية فحص (Scanning) أو استطلاع نشط دون إذن خطي صريح تعتبر غير قانونية وتندرج تحت قوانين مكافحة جرائم المعلومات.',
              explanationEn: 'Any unauthorized scanning or active reconnaissance is illegal and falls under anti-cybercrime laws, regardless of whether damage is caused.',
              points: 10
            }
          ]
        },
        hasAssignment: false
      },
      {
        id: 'm1-l2',
        moduleId: 'm1',
        title: 'مراحل الاختراق الخمسة ومنهجية CEH المعتمدة',
        titleEn: 'The 5 Phases of Hacking & CEH Methodology',
        summary: 'شرح تفصيلي للمراحل الخمسة المنهجية التي يتبعها أي مهاجم سيبراني أو فاحص أمني للسيطرة على الأهداف: \n1. الاستطلاع (Reconnaissance)\n2. الفحص (Scanning)\n3. كسب الوصول (Gaining Access)\n4. الحفاظ على الوصول (Maintaining Access)\n5. مسح الآثار (Clearing Tracks).',
        summaryEn: 'A detailed explanation of the five methodology phases followed by cyber attackers or security testers: Reconnaissance, Scanning, Gaining Access, Maintaining Access, and Clearing Tracks.',
        duration: '45 دقيقة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: false,
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm2',
    title: 'جمع المعلومات والاستطلاع (CEH Module 02)',
    titleEn: 'Footprinting and Reconnaissance',
    description: 'تعلم استخبارات المصادر المفتوحة (OSINT)، واستخدام محركات البحث مثل Google Dorking وقواعد Whois وShodan لجمع معلومات تفصيلية عن الهدف دون التفاعل المباشر معه.',
    descriptionEn: 'Learn Open Source Intelligence (OSINT), utilizing Google Dorking, Whois databases, and Shodan to gather details about targets without direct interaction.',
    difficulty: 'Beginner',
    difficultyAr: 'مبتدئ',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 2,
    labsCount: 1,
    quizzesCount: 1,
    skills: ['OSINT', 'Google Dorking', 'DNS Footprinting'],
    skillsAr: ['الاستخبارات المفتوحة OSINT', 'البحث المتقدم بـ Google', 'استكشاف النطاقات DNS'],
    lessons: [
      {
        id: 'm2-l1',
        moduleId: 'm2',
        title: 'الاستطلاع السلبي واستخدام Google Dorking',
        titleEn: 'Passive Reconnaissance & Google Dorking',
        summary: 'فهم آليات جمع المعلومات السلبية واستغلال محركات البحث الشهيرة للحصول على ملفات حساسة أو لوحات تحكم مكشوفة بالخطأ على السيرفرات العامة.',
        summaryEn: 'Understand passive reconnaissance mechanisms and exploit popular search engines to find sensitive files or exposed control panels.',
        duration: '1 ساعة',
        hasVideo: true,
        videoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        hasPdf: true,
        hasLab: true,
        lab: {
          id: 'lab-m4-l1',
          lessonId: 'm2-l1',
          title: 'معمل استقصاء المعلومات باستعمال Google Dorking',
          titleEn: 'Information Discovery with Google Dorks Lab',
          scenario: 'قامت جهة برفع ملفات تحتوي على تقارير أمنية سرية بالخطأ على خادم الويب العام الخاص بها دون حماية. مهمتك هي محاكاة استخدام "Google Dorking" عبر واجهتنا للبحث عن هذه الملفات المنسية واستخراج العلم منها.',
          scenarioEn: 'An organization accidentally exposed backup log files on their web server directory. Simulate a google dorking request to find these exposed secret logs and retrieve the flag.',
          objective: 'اكتب الكلمة البحثية الصحيحة لتصفية النتائج والوصول للملف السري `backup_log.txt` على النطاق المستهدف.',
          objectiveEn: 'Execute a search query filetype filter to find the secret text backup and extract the flag.',
          hints: [
            'استخدم أمر الفلترة filetype:txt أو site:target.com',
            'ابحث عن ملف باسم backup أو secrets.',
            'الأمر المناسب هو: site:academy.local filetype:txt'
          ],
          hintsAr: [
            'استخدم أمر الفلترة filetype:txt مع الكلمات المفتاحية.',
            'ابحث عن ملف باسم backup أو config.',
            'جرب كتابة الأوامر في محاكي البحث لمعرفة المخرجات.'
          ],
          envType: 'Web',
          tools: ['Google Dorking Simulator'],
          points: 100,
          expectedFlag: 'FLAG{GOOGLE_DORK_OSINT_PRO}'
        },
        hasQuiz: false,
        hasAssignment: false
      },
      {
        id: 'm2-l2',
        moduleId: 'm2',
        title: 'استكشاف معلومات النطاقات DNS و Whois',
        titleEn: 'DNS Footprinting & Whois Databases',
        summary: 'كيفية البحث في قواعد بيانات النطاقات لمعرفة ملاك المواقع وسيرفرات البريد وهيكلية سجلات DNS (مثل A, AAAA, MX, TXT, NS).',
        summaryEn: 'How to query domain databases to discover registrars, mail servers, and DNS records such as A, AAAA, MX, TXT, and NS.',
        duration: '1 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m2-l2',
          lessonId: 'm2-l2',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-dns1',
              type: 'MCQ',
              question: 'أي نوع من سجلات DNS (DNS Records) يتم الاستعلام عنه لتحديد خوادم البريد الإلكتروني الخاصة بنطاق معين؟',
              questionEn: 'Which type of DNS record is queried to locate the mail servers for a specific domain?',
              options: [
                'A Record',
                'MX Record (Mail Exchange)',
                'TXT Record',
                'NS Record'
              ],
              optionsEn: [
                'A Record',
                'MX Record (Mail Exchange)',
                'TXT Record',
                'NS Record'
              ],
              correctAnswer: 'MX Record (Mail Exchange)',
              explanation: 'سجل MX هو السجل المسؤول عن توجيه رسائل البريد الإلكتروني الواردة إلى خوادم البريد المناسبة للنطاق.',
              explanationEn: 'MX (Mail Exchange) records specify the mail servers responsible for accepting email on behalf of a domain name.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm3',
    title: 'فحص الشبكات (CEH Module 03)',
    titleEn: 'Scanning Networks',
    description: 'دراسة شاملة لفحص الشبكات النشط باستخدام أداة Nmap لتحديد المنافذ المفتوحة، الخدمات، وأنظمة التشغيل، وتجنب أنظمة كشف التسلل (IDS).',
    descriptionEn: 'Comprehensive study of active network scanning using Nmap to identify open ports, running services, OS versions, and IDS evasion.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '5 ساعات',
    durationAr: '5 ساعات',
    durationEn: '5 hours',
    lessonsCount: 2,
    labsCount: 1,
    quizzesCount: 1,
    skills: ['Nmap', 'Port Scanning', 'Evasion'],
    skillsAr: ['الفحص بـ Nmap', 'اكتشاف المنافذ والخدمات', 'تخطي أنظمة الحماية'],
    lessons: [
      {
        id: 'm3-l1',
        moduleId: 'm3',
        title: 'استخدام Nmap لفحص المنافذ والخدمات',
        titleEn: 'Nmap Port & Service Scanning',
        summary: 'كيفية استخدام أداة Nmap لفحص خادم واكتشاف المنافذ المفتوحة والخدمات الفعالة ورقم إصدارها، مع شرح لأشهر المفاتيح مثل -sS, -sV, -O, -p-',
        summaryEn: 'How to scan with Nmap to discover open ports, active services, OS detection and version detection.',
        duration: '1.5 ساعة',
        hasVideo: true,
        videoUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80',
        hasPdf: true,
        hasLab: true,
        lab: {
          id: 'lab-m5-l1',
          lessonId: 'm3-l1',
          title: 'معمل فحص خادم بعيد واكتشاف الخدمة الضعيفة',
          titleEn: 'Remote Host Scanning & Enumeration Lab',
          scenario: 'خادم بعيد في شبكتنا المحلية ذو عنوان IP (192.168.1.50) يحتوي على منفذ مفتوح يعمل عليه برنامج قديم مصاب بثغرة. مهمتك هي تشغيل أداة Nmap لتحديد المنافذ المفتوحة ومعرفة إصدار الخدمة التي تعمل على المنفذ المريب.',
          scenarioEn: 'A remote server at 192.168.1.50 has an open port running a vulnerable legacy service. Use Nmap with service version detection to find the exact port and version.',
          objective: 'نفذ أمر nmap الصحيح لفحص الخادم واكتشاف إصدار خدمة FTP أو SSH المفتوحة لفك تشفير العلم.',
          objectiveEn: 'Execute nmap with correct switches (like -sV) to find the service version and get the flag.',
          hints: [
            'جرب تشغيل: nmap -sV 192.168.1.50 في الطرفية المتاحة بالأسفل.',
            'راجع المنفذ رقم 21 (FTP) لمعرفة المخرجات وإيجاد العلم.',
            'الأمر الكامل للفحص السريع: nmap -p 21 -sV 192.168.1.50'
          ],
          hintsAr: [
            'جرب تشغيل: nmap -sV 192.168.1.50 في الطرفية.',
            'تفحص مخرجات فحص منفذ FTP رقم 21.',
            'اقرأ العلم المعروض بجانب اسم إصدار الخدمة الضعيفة.'
          ],
          envType: 'Network',
          tools: ['nmap'],
          points: 120,
          expectedFlag: 'FLAG{NMAP_FTP_VERSION_ENUMERATION}'
        },
        hasQuiz: false,
        hasAssignment: false
      },
      {
        id: 'm3-l2',
        moduleId: 'm3',
        title: 'بروتوكولات طبقة النقل ومصافحة TCP الثلاثية',
        titleEn: 'Transport Layer & TCP Three-Way Handshake',
        summary: 'شرح مفصل للاختلاف بين TCP و UDP وميكانيكية المصافحة الثلاثية (SYN -> SYN-ACK -> ACK) لتأسيس الاتصال الآمن وأهميتها للفحص الصامت (SYN Scan).',
        summaryEn: 'Detailed explanation of TCP vs UDP and the three-way handshake mechanism and its importance to stealthy SYN scans.',
        duration: '1 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m3-l2',
          lessonId: 'm3-l2',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-net1',
              type: 'Ordering',
              question: 'رتب خطوات مصافحة TCP الثلاثية (Three-Way Handshake) بالترتيب الصحيح لتأسيس الاتصال:',
              questionEn: 'Order the TCP Three-Way Handshake steps to establish connection:',
              options: [
                'يرسل العميل حزمة SYN (طلب اتصال)',
                'يرد الخادم بحزمة SYN-ACK (موافقة وتأكيد)',
                'يرسل العميل حزمة ACK (تأكيد نهائي وبدء البيانات)'
              ],
              optionsEn: [
                'Client sends SYN packet',
                'Server responds with SYN-ACK packet',
                'Client sends ACK packet to establish'
              ],
              correctAnswer: '0,1,2',
              explanation: 'المصافحة تبدأ دائماً بـ SYN من العميل، ثم رد SYN-ACK من الخادم، ثم تأكيد ACK نهائي من العميل لتأسيس قناة تواصل كاملة.',
              explanationEn: 'Handshake starts with SYN, then server SYN-ACK, then client final ACK.',
              points: 30
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm4',
    title: 'استخراج بيانات ومعلومات الخدمات (CEH Module 04)',
    titleEn: 'Enumeration',
    description: 'دراسة تقنيات استخراج البيانات الفعالة (Enumeration) للحصول على معلومات تفصيلية عن مستخدمي الأنظمة، المجلدات المشتركة، وحسابات الأنظمة وبروتوكولات RPC, NetBIOS, SNMP, LDAP.',
    descriptionEn: 'Deep dive into active Enumeration techniques to retrieve user names, shared directories, system accounts, and network services details using RPC, NetBIOS, SNMP, and LDAP.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['SNMP Enumeration', 'LDAP', 'NetBIOS'],
    skillsAr: ['استخراج معلومات بروتوكول SNMP', 'فحص LDAP', 'بروتوكول NetBIOS'],
    lessons: [
      {
        id: 'm4-l1',
        moduleId: 'm4',
        title: 'تقنيات استخراج معلومات الخدمات والمشتركات الشائعة',
        titleEn: 'Common Services and Shares Enumeration Techniques',
        summary: 'تعلم استجواب الأنظمة والبروتوكولات المفتوحة. استغلال بروتوكول إدارة الشبكات البسيط SNMP عبر Community Strings، وبروتوكول الدليل النشط LDAP، لاستخراج قوائم المستخدمين والأجهزة.',
        summaryEn: 'Learn to query open system protocols. Exploit SNMP community strings and LDAP services to extract lists of active directory users and systems.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m4-l1',
          lessonId: 'm4-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-enum1',
              type: 'MCQ',
              question: 'ما هو منفذ بروتوكول LDAP (Lightweight Directory Access Protocol) الافتراضي المستعمل لاستجواب الدليل النشط؟',
              questionEn: 'What is the default port of LDAP used to query Active Directory?',
              options: [
                'Port 389',
                'Port 445',
                'Port 161',
                'Port 80'
              ],
              optionsEn: [
                'Port 389',
                'Port 445',
                'Port 161',
                'Port 80'
              ],
              correctAnswer: 'Port 389',
              explanation: 'بروتوكول LDAP الافتراضي غير المشفر يعمل دائماً على منفذ TCP/UDP 389 لاستجواب ومعالجة بيانات الدليل النشط.',
              explanationEn: 'LDAP operates by default on TCP and UDP port 389 for standard active directory queries.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm5',
    title: 'تحليل وتقييم الثغرات الأمنية (CEH Module 05)',
    titleEn: 'Vulnerability Analysis',
    description: 'فهم وتطبيق منهجية تقييم وإدارة الثغرات الأمنية (Vulnerability Assessment)، وتصنيف الخطورة بنظام CVSS، وكيفية فحص المكونات البرمجية بماسحات الثغرات.',
    descriptionEn: 'Understand and apply Vulnerability Assessment methodologies, severity classification using the CVSS framework, and how to scan software systems for bugs.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Nessus', 'CVSS Score', 'Vulnerability Assessment'],
    skillsAr: ['استخدام ماسح Nessus', 'معايير نظام CVSS', 'إدارة الثغرات الأمنية'],
    lessons: [
      {
        id: 'm5-l1',
        moduleId: 'm5',
        title: 'دورة حياة إدارة الثغرات وتصنيف CVSS المعياري',
        titleEn: 'Vulnerability Assessment Lifecycle & CVSS framework',
        summary: 'شرح مراحل دورة حياة الثغرات (التحديد، التحليل، التقييم، المعالجة، والتوثيق). وفهم آلية حساب درجة الخطورة بنظام CVSS v3.1 المكون من Base Metric و Temporal Metric و Environmental Metric.',
        summaryEn: 'Understand vulnerability lifecycle phases (Identify, Analyze, Assess, Remediate, and Document), and master CVSS v3.1 scoring logic incorporating Base, Temporal, and Environmental metrics.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m5-l1',
          lessonId: 'm5-l1',
          timeLimitSeconds: 150,
          questions: [
            {
              id: 'q-vuln1',
              type: 'MCQ',
              question: 'ما هو النطاق الرقمي لدرجات نظام تقييم الثغرات المشترك (CVSS)، وما هي الدرجة التي تمثل ثغرة حرجة (Critical)؟',
              questionEn: 'What is the numeric scoring range of CVSS, and which score represents a Critical vulnerability?',
              options: [
                'من 0.0 إلى 10.0، والدرجات من 9.0 إلى 10.0 تعتبر حرجة',
                'من 1 إلى 5، والدرجة 5 تعتبر حرجة',
                'من 0 إلى 100، والدرجات فوق 80 تعتبر حرجة',
                'من -1.0 إلى 1.0، والدرجة 1.0 تعتبر حرجة'
              ],
              optionsEn: [
                'From 0.0 to 10.0, and scores from 9.0 to 10.0 are considered Critical',
                'From 1 to 5, and score 5 is critical',
                'From 0 to 100, and scores above 80 are critical',
                'From -1.0 to 1.0, and score 1.0 is critical'
              ],
              correctAnswer: 'من 0.0 إلى 10.0، والدرجات من 9.0 إلى 10.0 تعتبر حرجة',
              explanation: 'نظام CVSS يقيم الثغرات على مقياس من 0 إلى 10. وتعتبر أي ثغرة تقييمها ما بين 9.0 و 10.0 ثغرة حرجة للغاية وتتطلب ترقيعاً فورياً.',
              explanationEn: 'CVSS scores range from 0.0 to 10.0. A score of 9.0–10.0 represents a Critical severity level.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm6',
    title: 'اختراق الأنظمة وأساسيات لينكس (CEH Module 06)',
    titleEn: 'System Hacking & Linux Fundamentals',
    description: 'خطوات السيطرة الكاملة على الأنظمة الرقمية باستخدام الأوامر البرمجية، التنقل في لينكس، رفع الصلاحيات (Privilege Escalation)، وتثبيت الوصول والتحرك الأفقي.',
    descriptionEn: 'Steps to gain complete control over systems, Linux commands navigation, privilege escalation (SUID), establishing persistent access, and lateral movement.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '6 ساعات',
    durationAr: '6 ساعات',
    durationEn: '6 hours',
    lessonsCount: 2,
    labsCount: 2,
    quizzesCount: 1,
    skills: ['Linux CLI', 'SUID Escalation', 'System Compromise'],
    skillsAr: ['أوامر Linux CLI', 'رفع صلاحيات SUID', 'اختراق خوادم لينكس'],
    lessons: [
      {
        id: 'm2-l1',
        moduleId: 'm6',
        title: 'التعامل مع سطر الأوامر والتنقل بين مجلدات خادم لينكس',
        titleEn: 'Linux Command Line & Navigation',
        summary: 'تعلم أهم الأوامر الأساسية للتنقل واستكشاف المجلدات وقراءة الملفات الحساسة في خوادم لينكس (cd, ls, pwd, cat, mkdir, rm) للبحث عن الأدلة الرقمية.',
        summaryEn: 'Learn basic navigation commands, exploring folders, and reading files (cd, ls, pwd, cat, mkdir, rm) to find digital evidence in Linux.',
        duration: '50 دقيقة',
        hasVideo: true,
        videoUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
        hasPdf: true,
        hasLab: true,
        lab: {
          id: 'lab-m2-l1',
          lessonId: 'm2-l1',
          title: 'معمل استكشاف الملفات وقراءة الأعلام',
          titleEn: 'File Navigation and Flag Reading Lab',
          scenario: 'أهلاً بك في أول معمل سيبراني عملي لك! لقد قمنا بتهيئة خادم لينكس آمن لك. يوجد ملف علم مخفي داخل أحد المجلدات الفرعية في النظام. مهمتك هي استخدام سطر الأوامر لتحديد مكانه وقراءته.',
          scenarioEn: 'Welcome to your first hands-on lab! We configured a secure Linux sandbox. A hidden flag file exists in one of the subdirectories. Use terminal commands to locate and read it.',
          objective: 'اكتشف الملف المخفي واقرأ محتواه لإيجاد العلم بصيغة FLAG{...} وإدخاله في حقل التحقق.',
          objectiveEn: 'Find the hidden file, read its content to obtain the flag of format FLAG{...}, and submit it.',
          hints: [
            'استخدم الأمر ls لعرض الملفات، و cd للانتقال للمجلدات.',
            'ابحث داخل المجلد المسمى /challenges أو مجلد home.',
            'استخدم cat لطباعة محتوى ملف العلم.'
          ],
          hintsAr: [
            'استخدم الأمر ls لعرض الملفات، و cd للانتقال للمجلدات.',
            'ابحث داخل المجلد المسمى challenges في مجلد home الخاص بك.',
            'استخدم cat لطباعة محتوى ملف العلم.'
          ],
          envType: 'Linux',
          tools: ['ls', 'cd', 'cat'],
          points: 100,
          expectedFlag: 'FLAG{LINUX_NAVIGATOR_MASTER}'
        },
        hasQuiz: false,
        hasAssignment: false
      },
      {
        id: 'm2-l2',
        moduleId: 'm6',
        title: 'رفع الصلاحيات وأذونات الملفات ولصق بت SUID',
        titleEn: 'File Permissions & SUID Escalation',
        summary: 'فهم أذونات لينكس الأساسية (Read, Write, Execute) وكيف تؤدي إعدادات ملفات SUID الخاطئة إلى اختراق الخوادم ورفع الصلاحيات لجذر النظام (root).',
        summaryEn: 'Understand standard Linux read/write/execute permissions and how misconfigured SUID flags can lead to root privilege escalation.',
        duration: '1 ساعة',
        hasVideo: true,
        videoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        hasPdf: true,
        hasLab: true,
        lab: {
          id: 'lab-m2-l2',
          lessonId: 'm2-l2',
          title: 'معمل رفع الصلاحيات عبر ملفات SUID',
          titleEn: 'SUID Privilege Escalation Lab',
          scenario: 'لقد تمكنت من الدخول إلى الخادم كمستخدم ذو صلاحيات منخفضة (student). هناك ملف تنفيذي ذو صلاحية SUID خاطئة يتيح لك قراءة الملفات المحمية. استغل هذا الملف لقراءة ملف الأسرار والحصول على علم الجذر.',
          scenarioEn: 'You got low-privilege shell access as (student). A binary has an insecure SUID bit set, letting you read protected files. Exploit this to read the root secrets file.',
          objective: 'استخدم الأمر find للبحث عن ملفات SUID، ثم استغل الملف المكتشف لقراءة /root/flag.txt واقتناص علم المسؤول.',
          objectiveEn: 'Use find to locate SUID binaries, then exploit the found binary to read /root/flag.txt and extract the admin flag.',
          hints: [
            'ابحث عن ملفات SUID باستخدام: find / -perm -4000 -type f 2>/dev/null',
            'ستجد محاكي لأداة "suid-reader" لديه صلاحيات root.',
            'استخدم هذه الأداة لقراءة الملف الحساس /root/flag.txt.'
          ],
          hintsAr: [
            'ابحث عن ملفات SUID باستخدام: find / -perm -4000 -type f 2>/dev/null',
            'ستجد أداة مخصصة لقراءة الملفات لديها بت SUID مفعل لصالح root.',
            'استخدمها لقراءة الملف الحساس /root/flag.txt.'
          ],
          envType: 'Linux',
          tools: ['find', 'suid-reader'],
          points: 150,
          expectedFlag: 'FLAG{SUID_EXPLOIT_ROOT_SUCCESS}'
        },
        hasQuiz: true,
        quiz: {
          id: 'q-m2-l2',
          lessonId: 'm2-l2',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-suid1',
              type: 'MCQ',
              question: 'ماذا يعني تفعيل بت SUID (Set Owner User ID) على ملف تنفيذي في أنظمة التشغيل لينكس؟',
              questionEn: 'What does setting the SUID bit on an executable mean?',
              options: [
                'تشغيل الملف بصلاحيات المستخدم الذي يقوم بتشغيله حالياً دون امتيازات',
                'تشغيل الملف دائماً بصلاحيات مالك الملف الأصلي (مثل root) بغض النظر عمن يستدعيه',
                'جعل الملف قابلاً للتعديل والكتابة فقط من الجميع دون قيود',
                'تغيير كلمة المرور الخاصة بالمستخدم بشكل تلقائي وآمن'
              ],
              optionsEn: [
                'Running the file with the privileges of the active caller user',
                'Running the file with the privileges of the file owner (e.g., root)',
                'Making the file writable only to everyone',
                'Changing the user password automatically and securely'
              ],
              correctAnswer: 'تشغيل الملف دائماً بصلاحيات مالك الملف الأصلي (مثل root) بغض النظر عمن يستدعيه',
              explanation: 'عند تفعيل بت SUID، يقوم نظام التشغيل بتشغيل هذا البرنامج المؤقت بامتيازات مالك الملف (غالباً root)، مما قد يسبب ثغرة خطيرة إن لم يحمَ جيداً.',
              explanationEn: 'When running a file with SUID bit set, it executes with the privileges of the owner, not the caller.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm7',
    title: 'تهديدات البرمجيات الخبيثة (CEH Module 07)',
    titleEn: 'Malware Threats',
    description: 'تحليل وفهم آليات عمل البرمجيات الخبيثة (Trojans, Viruses, Worms, Ransomware)، واستخدام أدوات كشفها وتشفيرها وعرقلة تحليلها.',
    descriptionEn: 'Analyze and understand malware operation including Trojans, Viruses, Worms, and Ransomware, and explore tools used to build, obfuscate, and detect them.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '5 ساعات',
    durationAr: '5 ساعات',
    durationEn: '5 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Malware Analysis', 'Trojan Horses', 'Crypters'],
    skillsAr: ['تحليل البرمجيات الضارة', 'أحصنة طروادة', 'مشفرات الملفات Crypters'],
    lessons: [
      {
        id: 'm7-l1',
        moduleId: 'm7',
        title: 'أنواع البرمجيات الخبيثة وطرق الفحص والتحليل الساكن',
        titleEn: 'Malware Classification & Static Analysis Basics',
        summary: 'دراسة الفروق الدقيقة بين ديدان الشبكة (Worms) التي تنتشر تلقائياً، والفايروسات التي تتطلب تفاعل المستخدم، وأحصنة طروادة (Trojans) التي تختبئ كبرامج نافعة، مع أساسيات فحص الهاشات.',
        summaryEn: 'Study distinct differences between network worms that propagate autonomously, viruses needing user triggers, and Trojan horses disguised as useful applications, alongside basic hash analysis.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m7-l1',
          lessonId: 'm7-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-mal1',
              type: 'MCQ',
              question: 'ما هي الخاصية الفريدة التي تميز دودة الشبكة (Worm) عن الفيروس (Virus) التقليدي؟',
              questionEn: 'What is the unique characteristic that distinguishes a Worm from a traditional Virus?',
              options: [
                'القدرة على الانتشار التلقائي وتكرار نفسها عبر الشبكة دون تدخل من المستخدم',
                'الحاجة دائماً إلى الالتصاق ببرنامج تنفيذي مضيف نشط لتعمل',
                'استهدافها الحصري للهواتف الذكية فقط دون السيرفرات',
                'تشفير بيانات المستخدم والمطالبة بفدية مالية (Ransomware)'
              ],
              optionsEn: [
                'The ability to self-replicate and spread over networks automatically without user intervention',
                'The requirement to always attach to an active host executable program to function',
                'Targeting exclusively smart phones instead of enterprise servers',
                'Encrypting user files and demanding a payment ransom'
              ],
              correctAnswer: 'القدرة على الانتشار التلقائي وتكرار نفسها عبر الشبكة دون تدخل من المستخدم',
              explanation: 'الدودة (Worm) تستغل ثغرات الشبكة لتكرار ونشر نفسها تلقائياً، بينما الفيروس يتطلب دائماً تشغيل البرنامج المصاب بواسطة مستخدم.',
              explanationEn: 'Worms propagate across networks automatically by exploiting vulnerabilities, while viruses require a user to execute infected host files.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm8',
    title: 'استنشاق وتحليل حركة البيانات (CEH Module 08)',
    titleEn: 'Sniffing',
    description: 'اعتراض وتحليل الحزم البرمجية المنسابة عبر كوابل وموجات الشبكة، دراسة هجمات التسمم وهجمات MAC flooding واستخدام أداة Wireshark باحترافية.',
    descriptionEn: 'Interception and analysis of network packets, studying MAC flooding attacks, ARP poisoning, and professional usage of Wireshark.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Wireshark', 'ARP Poisoning', 'Packet Analysis'],
    skillsAr: ['تحليل حزم Wireshark', 'تسميم جدول ARP', 'اعتراض البيانات الحرة'],
    lessons: [
      {
        id: 'm8-l1',
        moduleId: 'm8',
        title: 'هجوم تسمم جدول عناوين ARP وتحليل البيانات بـ Wireshark',
        titleEn: 'ARP Spoofing/Poisoning & Wireshark Analysis',
        summary: 'كيفية التسلل بين العميل والموجه كمشرف وسيط (Man-in-the-Middle) بإرسال حزم ARP خادعة، والتقاط كلمات المرور غير المشفرة الفعالة عبر الشبكة المحلية.',
        summaryEn: 'How to intercept communication between client and gateway (Man-in-the-Middle) by sending forged ARP packets and capturing unencrypted passwords on the LAN.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m8-l1',
          lessonId: 'm8-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-snif1',
              type: 'MCQ',
              question: 'ما هو البروتوكول الضعيف الذي يستهدفه المهاجم لوضع نفسه كوسيط (MitM) في الشبكة المحلية عبر هجوم التسمم الصامت؟',
              questionEn: 'Which weak protocol is targeted to perform a Man-in-the-Middle (MitM) attack via poisoning?',
              options: [
                'ARP (Address Resolution Protocol)',
                'DNS (Domain Name System)',
                'HTTPS (HyperText Transfer Protocol Secure)',
                'SSH (Secure Shell)'
              ],
              optionsEn: [
                'ARP (Address Resolution Protocol)',
                'DNS (Domain Name System)',
                'HTTPS',
                'SSH'
              ],
              correctAnswer: 'ARP (Address Resolution Protocol)',
              explanation: 'بروتوكول ARP يفتقر لآليات التحقق والمصادقة، مما يتيح لأي جهاز إرسال ردود ARP كاذبة وربط عنوان الماك (MAC) الخاص به بـ IP الموجه.',
              explanationEn: 'ARP lacks authentication, allowing any device on the network to send spoofed replies, binding its own MAC address to the gateway IP.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm9',
    title: 'الهندسة الاجتماعية والخداع البشري (CEH Module 09)',
    titleEn: 'Social Engineering',
    description: 'دراسة علم النفس التطبيقي في اختراق العقول والأفراد، وهجمات الصيد المصوب (Phishing)، والقرصنة عبر الهواتف وتقنيات انتحال الشخصيات.',
    descriptionEn: 'Study applied psychology in hacking people and minds, exploring targeted phishing, vishing, tailgating, and identity impersonation techniques.',
    difficulty: 'Beginner',
    difficultyAr: 'مبتدئ',
    duration: '3 ساعات',
    durationAr: '3 ساعات',
    durationEn: '3 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Phishing', 'Social Engineering', 'Human Hacking'],
    skillsAr: ['هندسة الخداع البشري', 'صفحات الاصطياد المخصصة', 'انتحال الشخصية'],
    lessons: [
      {
        id: 'm9-l1',
        moduleId: 'm9',
        title: 'ناقلات الخداع البشري وتصميم حملات الاصطياد المنهجية',
        titleEn: 'Human Vulnerability Vectors & Phishing Simulations',
        summary: 'تعلم أهم أساليب الهندسة الاجتماعية مثل (Tailgating) الدخول المتطفل خلف الموظفين، و (Pretexting) خلق سيناريو وهمي لسرقة البيانات، وكيفية إعداد حملات اصطياد بريدية آمنة لفحص وعي الموظفين.',
        summaryEn: 'Learn primary human manipulation vectors like tailgating, pretexting, and how to construct secure phishing simulations to assess corporate security awareness.',
        duration: '1 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m9-l1',
          lessonId: 'm9-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-se1',
              type: 'MCQ',
              question: 'ما هو المصطلح الهندسي المعبر عن قيام المهاجم بمتابعة موظف مصرح له للدخول عبر البوابة الأمنية دون بطاقة مرور؟',
              questionEn: 'What is the social engineering term for following an authorized employee through a secured door without a badge?',
              options: [
                'Tailgating (الملاحقة اللصيقة)',
                'Phishing (الاصطياد)',
                'Dumpster Diving (البحث في المخلفات)',
                'Whaling (اصطياد الحيتان)'
              ],
              optionsEn: [
                'Tailgating',
                'Phishing',
                'Dumpster Diving',
                'Whaling'
              ],
              correctAnswer: 'Tailgating (الملاحقة اللصيقة)',
              explanation: 'الملاحقة اللصيقة (Tailgating or Piggybacking) هي استغلال الآداب الاجتماعية للموظف في فتح أو إبقاء الباب مفتوحاً للدخول دون تحقق.',
              explanationEn: 'Tailgating involves physically following an authorized person into a restricted area without proper credentials.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm10',
    title: 'هجمات حجب الخدمة (CEH Module 10)',
    titleEn: 'Denial-of-Service (DoS / DDoS)',
    description: 'فهم آليات تعطيل السيرفرات والتطبيقات وإخراجها عن الخدمة باستخدام هجمات الغمر وحزم البيانات الهائلة وشبكات البوتنت المخيفة.',
    descriptionEn: 'Understand mechanisms to disrupt systems and take them offline using flooding attacks, high-volume traffic packets, and botnets.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '3 ساعات',
    durationAr: '3 ساعات',
    durationEn: '3 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['SYN Flood', 'Botnets', 'DDoS Mitigations'],
    skillsAr: ['هجمات غمر الـ SYN', 'شبكات البوتنت المخترقة', 'حلول حجب الخدمة'],
    lessons: [
      {
        id: 'm10-l1',
        moduleId: 'm10',
        title: 'هجمات حجب الخدمة الموزعة DDoS وطرق التصدي والدفاع',
        titleEn: 'Distributed Denial of Service (DDoS) & Defensive Mitigations',
        summary: 'دراسة هجمات SYN flood التي تستغل حجز موارد الاتصال دون إتمام المصافحة، وهجمات تضخيم بروتوكول NTP و DNS لإنتاج تدفق بيانات مدمر، وحلول الحماية السحابية Cloudflare.',
        summaryEn: 'Study SYN flood attacks exploiting server connection pools, amplification attacks leveraging NTP and DNS protocols, and cloud-based mitigations like Cloudflare.',
        duration: '1.2 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m10-l1',
          lessonId: 'm10-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-dos1',
              type: 'MCQ',
              question: 'كيف تؤثر هجمات SYN Flood على موارد الخادم المستهدف لشل حركته وتعطيله؟',
              questionEn: 'How do SYN Flood attacks impact the targeted server resources to disrupt its operations?',
              options: [
                'إغراق الخادم بطلبات اتصال معلقة (Half-Open Connections) مما يستهلك جدول الاتصالات بالكامل',
                'مسح جميع ملفات النظام وقواعد البيانات الحساسة فورياً بملفات خبيثة',
                'سرقة مفاتيح التشفير الخاصة بشهادة SSL وتعطيل بروتوكول HTTPS',
                'تخمين كلمة مرور لوحة تحكم سيرفرات الويب الإدارية'
              ],
              optionsEn: [
                'Flooding the server with half-open connections to exhaust its connection state table',
                'Erasing all operating system files and databases immediately',
                'Stealing SSL certificate encryption keys and disabling HTTPS',
                'Brute forcing the administrative control panels of web servers'
              ],
              correctAnswer: 'إغراق الخادم بطلبات اتصال معلقة (Half-Open Connections) مما يستهلك جدول الاتصالات بالكامل',
              explanation: 'هجوم SYN Flood يرسل كميات هائلة من حزم SYN دون الرد على حزم SYN-ACK المرتجعة، مما يبقي موارد الخادم محجوزة للاتصالات المعلقة وغير المكتملة.',
              explanationEn: 'SYN flood exploits the TCP handshake by leaving ports half-open, exhausting the server connection queues.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm11',
    title: 'اختطاف الجلسات والاتصالات (CEH Module 11)',
    titleEn: 'Session Hijacking',
    description: 'فهم سرقة وإعادة توجيه حزم البيانات واعتراض جلسات الاتصال النشطة بين العميل والخادم، والتلاعب بـ Session IDs لتخطي حماية الحسابات.',
    descriptionEn: 'Understand packet sniffing, redirecting, and stealing active communication sessions between clients and servers, and manipulating Session IDs to bypass account access.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '3 ساعات',
    durationAr: '3 ساعات',
    durationEn: '3 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Session Hijacking', 'Session Fixation', 'Cookie Theft'],
    skillsAr: ['اختطاف الجلسات والتوكنز', 'حقن الجلسة Session Fixation', 'سرقة ملفات الارتباط'],
    lessons: [
      {
        id: 'm11-l1',
        moduleId: 'm11',
        title: 'استغلال معرفات الجلسات وسرقة الكوكيز وتسميم المسارات',
        titleEn: 'Exploiting Session IDs, Cookie Theft & Mitigation',
        summary: 'آليات تخمين معرفات الجلسة (Session ID Predicting)، وتسميم الجلسة (Session Fixation)، وكيف يسرق الهاكرز التوكنز عبر هجمات Cross-Site Scripting وكيفية تأمينها بمفتاح HttpOnly.',
        summaryEn: 'Mechanisms of Session ID predicting, session fixation, cookie theft via Cross-Site Scripting, and mitigation using HttpOnly flags.',
        duration: '1 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m11-l1',
          lessonId: 'm11-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-ses1',
              type: 'MCQ',
              question: 'أي من الأعلام (Flags) الأمنية التالية يجب إرفاقه في ملفات الكوكيز (Cookies) لمنع سكريبتات المتصفح الخبيثة من سرقتها؟',
              questionEn: 'Which cookie security flag must be set to prevent client-side malicious scripts from accessing it?',
              options: [
                'HttpOnly',
                'Secure',
                'SameSite',
                'Path'
              ],
              optionsEn: [
                'HttpOnly',
                'Secure',
                'SameSite',
                'Path'
              ],
              correctAnswer: 'HttpOnly',
              explanation: 'العلم HttpOnly يحظر تماماً وصول سكريبتات جافاسكريبت (مثل document.cookie) لملف الارتباط، مما يمنع سرقته عبر ثغرات XSS.',
              explanationEn: 'The HttpOnly flag prevents client-side scripts from reading the cookie, neutralizing theft via XSS.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm12',
    title: 'تجاوز أنظمة الكشف وجدران الحماية (CEH Module 12)',
    titleEn: 'Evading IDS, Firewalls, and Honeypots',
    description: 'تقنيات التمويه والتعمية الرقمية، تجزئة الحزم، وتخطي جدران الحماية النارية واستكشاف ومراوغة مصايد الاختراق (Honeypots).',
    descriptionEn: 'Techniques of digital evasion, packet fragmentation, bypassing stateful firewalls, and discovering/evading decoy honeypots.',
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    duration: '5 ساعات',
    durationAr: '5 ساعات',
    durationEn: '5 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['IDS Evasion', 'Firewall Bypass', 'Honeypots'],
    skillsAr: ['تجاوز جدران الحماية', 'التعمية الرقمية وتجزئة الحزم', 'كشف مصايد الهاكرز'],
    lessons: [
      {
        id: 'm12-l1',
        moduleId: 'm12',
        title: 'تقنيات التخفي البرمجي وتفتيت الحزم السيبرانية لتجنب الرصد',
        titleEn: 'Software Obfuscation & Packet Fragmentation for Stealth',
        summary: 'كيف يفحص الهاكرز الأنظمة باستعمال تفتيت الحزم (Packet Fragmentation) لخداع محرك كشف التسلل السلوكي، واستعمال بروتوكولات الوكيل والأنفاق لإخفاء الهوية.',
        summaryEn: 'How attackers scan systems using packet fragmentation to confuse behavioral IDS, and utilizing proxies and tunnels to mask original footprints.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m12-l1',
          lessonId: 'm12-l1',
          timeLimitSeconds: 150,
          questions: [
            {
              id: 'q-eva1',
              type: 'MCQ',
              question: 'ما هو الهدف الهيكلي الرئيسي لبرنامج "مصيدة الاختراق" (Honeypot) داخل الشبكة المؤسسية؟',
              questionEn: 'What is the primary architectural purpose of a Honeypot in an enterprise network?',
              options: [
                'تشتيت انتباه المهاجم وجذبه لسيرفر وهمي لكشف حركته وتحليل أساليبه دون تعريض البيئة الحقيقية للخطر',
                'تخزين النسخ الاحتياطية وتشفير ملفات الخادم بأمان فائق',
                'تسريع فحص وتصفية رسائل البريد المزعجة والمصابة بالبرامج الضارة',
                'زيادة سرعة معالجة استعلامات الويب وقاعدة البيانات لتسريع الأداء'
              ],
              optionsEn: [
                'To distract and lure attackers to a decoy server, analyzing their tactics without endangering production systems',
                'To store backup files and encrypt server databases securely',
                'To speed up and filter spam and malware emails',
                'To boost web queries and database performance'
              ],
              correctAnswer: 'تشتيت انتباه المهاجم وجذبه لسيرفر وهمي لكشف حركته وتحليل أساليبه دون تعريض البيئة الحقيقية للخطر',
              explanation: 'المصيدة (Honeypot) هي جهاز أو شبكة وهمية يتم تعمد إظهار ثغراتها لتكون فخاً يسقط فيه الهاكرز لمراقبته ومعرفة نواياه.',
              explanationEn: 'Honeypots act as decoy systems designed to attract and monitor malicious actors, keeping production environments safe.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm13',
    title: 'اختراق خوادم الويب (CEH Module 13)',
    titleEn: 'Hacking Web Servers',
    description: 'دراسة نقاط الضعف الفنية في برامج وتطبيقات خوادم الويب مثل Apache و IIS، وهجمات تخطي المسارات واستغلال التهيئة الخاطئة.',
    descriptionEn: 'Study systemic vulnerabilities in web server software like Apache and IIS, directory traversal attacks, and exploitation of configuration mistakes.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Web Server Hardening', 'Banner Grabbing', 'IIS/Apache vulnerabilities'],
    skillsAr: ['تحصين خوادم الويب', 'التقاط لافتات الأنظمة Banner', 'ثغرات خادم IIS/Apache'],
    lessons: [
      {
        id: 'm13-l1',
        moduleId: 'm13',
        title: 'استخلاص إصدارات الأنظمة واستغلال نقاط ضعف تهيئة سيرفرات الويب',
        titleEn: 'Banner Grabbing & Exploiting Web Server Misconfigurations',
        summary: 'تعلم التقاط إصدارات الأنظمة بـ Netcat و Telnet للتعرف على نوع السيرفر، واستغلال ثغرة (Directory Traversal) لاستعراض وقراءة ملفات السيرفر الداخلية غير المحمية.',
        summaryEn: 'Learn banner grabbing using Netcat and Telnet to identify server types, and exploiting Directory Traversals to view protected server operating system files.',
        duration: '1.2 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m13-l1',
          lessonId: 'm13-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-serv1',
              type: 'MCQ',
              question: 'ما هي التقنية المستخدمة لتحديد نوع وإصدار نظام تشغيل خادم الويب عن طريق فحص مخرجات الاتصال الترحيبية الافتراضية؟',
              questionEn: 'Which technique is used to determine a web server OS type and version by inspecting the connection output text?',
              options: [
                'Banner Grabbing (التقاط لافتة الترحيب)',
                'DNS Securing (تأمين النطاقات)',
                'Cookie Hijacking (اختطاف ملفات الارتباط)',
                'Fuzzing (الفحص العشوائي)'
              ],
              optionsEn: [
                'Banner Grabbing',
                'DNS Securing',
                'Cookie Hijacking',
                'Fuzzing'
              ],
              correctAnswer: 'Banner Grabbing (التقاط لافتة الترحيب)',
              explanation: 'التقاط لافتات الأنظمة (Banner Grabbing) هي إرسال طلبات مبسطة للسيرفر وقراءة ترويسات الاستجابة التي تحوي بالعادة نوع السيرفر وإصداره بالتفصيل.',
              explanationEn: 'Banner grabbing gathers information about a remote system, revealing active service versions via greeting banners.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm14',
    title: 'اختراق تطبيقات الويب (CEH Module 14)',
    titleEn: 'Hacking Web Applications',
    description: 'تحليل ثغرات الويب المندرجة تحت تصنيف منظمة OWASP العالمية، واستغلال ثغرات حقن نصوص المتصفح (XSS)، وثغرة تزوير الطلبات (CSRF)، وتدريب دفاعي لمنعها.',
    descriptionEn: 'Analyze web vulnerabilities under the OWASP Top 10 framework, exploiting Cross-Site Scripting (XSS), CSRF, and exploring robust coding mitigations.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '6 ساعات',
    durationAr: '6 ساعات',
    durationEn: '6 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['OWASP Top 10', 'Cross-Site Scripting (XSS)', 'CSRF'],
    skillsAr: ['قائمة OWASP Top 10', 'حقن سكريبتات المتصفح XSS', 'تزوير طلبات المستخدم CSRF'],
    lessons: [
      {
        id: 'm14-l1',
        moduleId: 'm14',
        title: 'ثغرات المتصفح وحقن نصوص جافا سكريبت XSS وتأمينها',
        titleEn: 'Browser Vulnerabilities: Cross-Site Scripting Types & Fixes',
        summary: 'دراسة الأنواع الثلاثة لثغرة XSS: المستقرة (Stored)، والمنعكسة (Reflected)، والبرمجية (DOM-based)، وكيف يستغلها المهاجم لإرسال كوكيز وجلسات المستخدمين لخادمه الخاص.',
        summaryEn: 'Study the three types of XSS: Stored, Reflected, and DOM-based. Understand how attackers exploit them to hijack user session tokens and cookies.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m14-l1',
          lessonId: 'm14-l1',
          timeLimitSeconds: 150,
          questions: [
            {
              id: 'q-web1',
              type: 'MCQ',
              question: 'ما هو النوع الأكثر خطورة من ثغرات حقن نصوص المتصفح (XSS) والذي يتم حفظ الكود البرمجي الخبيث فيه داخل قاعدة بيانات الموقع بشكل دائم؟',
              questionEn: 'Which is the most dangerous type of XSS where malicious code is permanently stored in the website database?',
              options: [
                'Stored XSS (ثغرة XSS المخزنة المستمرة)',
                'Reflected XSS (ثغرة XSS المنعكسة)',
                'DOM-based XSS (ثغرة XSS البرمجية المعالجة بالمتصفح)',
                'Blind SQLi'
              ],
              optionsEn: [
                'Stored XSS',
                'Reflected XSS',
                'DOM-based XSS',
                'Blind SQLi'
              ],
              correctAnswer: 'Stored XSS (ثغرة XSS المخزنة المستمرة)',
              explanation: 'ثغرة Stored XSS هي الأكثر خطورة لأن الكود الخبيث يخزن بقاعدة البيانات ليتم تشغيله تلقائياً في متصفح أي زائر يستعرض الصفحة المصابة دون الحاجة لإرسال روابط خبيثة له.',
              explanationEn: 'Stored (Persistent) XSS saves the script directly on the database/server, exposing every visitor requesting the infected resource.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm15',
    title: 'حقن قواعد البيانات - SQL Injection (CEH Module 15)',
    titleEn: 'SQL Injection',
    description: 'شرح ميكانيكية ثغرة حقن أوامرقواعد البيانات SQLi، وتطبيقات عملية لتخطي حماية لوحات تسجيل الدخول واستخراج البيانات الحساسة والجداول.',
    descriptionEn: 'Explain SQL Injection (SQLi) vulnerabilities, practical application for bypassing login pages, and extracting hidden database schemas and tables.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '5 ساعات',
    durationAr: '5 ساعات',
    durationEn: '5 hours',
    lessonsCount: 1,
    labsCount: 1,
    quizzesCount: 1,
    skills: ['SQLi', 'Database Bypass', 'Prepared Statements'],
    skillsAr: ['ثغرات حقن قواعد البيانات SQLi', 'تخطي تسجيل الدخول', 'ترقيع ثغرات الاستعلامات'],
    lessons: [
      {
        id: 'lab-m8-l1',
        moduleId: 'm15',
        title: 'حقن قواعد البيانات وتخطي لوحة الإدارة',
        titleEn: 'SQL Injection: Authentication Bypass & Extraction',
        summary: 'شرح معمق لكيفية حدوث ثغرة SQLi وكيف يقوم المهاجم بتخطي صفحة تسجيل الدخول بوضع مدخلات خادعة مثل `\' OR 1=1 --` وكيف يستخرج بيانات المستخدمين وتدريب علاجي متطور.',
        summaryEn: 'Detailed explanation of SQL Injection, using payloads like `\' OR 1=1 --` to bypass auth, and extracting database tables safely.',
        duration: '2 ساعة',
        hasVideo: true,
        videoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        hasPdf: true,
        hasLab: true,
        lab: {
          id: 'lab-m8-l1',
          lessonId: 'lab-m8-l1',
          title: 'معمل اختراق لوحة التحكم وتخطي الاستعلام',
          titleEn: 'Admin Auth Bypass via SQL Injection Lab',
          scenario: 'أمامك صفحة تسجيل دخول إدارية مصابة بـ SQL Injection. لم يقم المبرمج بفلترة المدخلات في حقل اسم المستخدم قبل إرساله لقاعدة البيانات. مهمتك هي تخطي حماية تسجيل الدخول والدخول كمدير للنظام دون معرفة كلمة المرور الخاصة به.',
          scenarioEn: 'An admin login page is vulnerable to SQL injection. The input username fields are not parameterized. Bypass authentication to log in as administrator and grab the flag.',
          objective: 'اكتب حقل حقن SQLi الصحيح في خانة اسم المستخدم (مثل: `\' OR 1=1 --`) وتخطي الفحص بنجاح.',
          objectiveEn: 'Submit a valid SQLi payload in the username field to bypass the database check and retrieve the flag.',
          hints: [
            'جرب كتابة admin\' OR 1=1 -- في حقل اسم المستخدم.',
            'حرف الاقتباس الفردي \' ينهي حقل النص في الاستعلام.',
            'الشرطتان -- تقومان بتعطيل باقي الاستعلام (مما يلغي التحقق من كلمة المرور).'
          ],
          hintsAr: [
            'جرب كتابة admin\' OR 1=1 -- في حقل اسم المستخدم.',
            'الرمز \' يقوم بقطع حقل الاستعلام البرمجي.',
            'الرمز -- أو # يقوم بتعليق ما تبقى من الاستعلام البرمجي لقاعدة البيانات.'
          ],
          envType: 'Web',
          tools: ['SQL Injection Payload Generator'],
          points: 150,
          expectedFlag: 'FLAG{SQLI_BYPASS_ADMIN_BOARD_UNLOCKED}'
        },
        hasQuiz: true,
        quiz: {
          id: 'q-m8-l1',
          lessonId: 'lab-m8-l1',
          timeLimitSeconds: 180,
          questions: [
            {
              id: 'q-sql1',
              type: 'MCQ',
              question: 'كيف يمكن للمبرمج تفادي ثغرة SQL Injection بشكل نهائي وجذري في كود التطبيق؟',
              questionEn: 'How can SQL Injection vulnerabilities be thoroughly prevented in application code?',
              options: [
                'استخدام تشفير SHA256 لكلمة المرور فقط',
                'استخدام الاستعلامات المجهزة مسبقاً والمستقلة عن المعاملات (Parameterized Queries / Prepared Statements)',
                'تغيير منفذ اتصال قاعدة البيانات والخدمة الافتراضي للخادم',
                'تشفير قاعدة البيانات وإخفائها خلف نظام كشف جدران الحماية'
              ],
              optionsEn: [
                'Using SHA256 password hashing only',
                'Using Prepared Statements and Parameterized Queries to separate executable query commands from parameters',
                'Changing the default database and service port of the database engine',
                'Encrypting the database storage and keeping it behind a firewall'
              ],
              correctAnswer: 'استخدام الاستعلامات المجهزة مسبقاً والمستقلة عن المعاملات (Parameterized Queries / Prepared Statements)',
              explanation: 'الاستعلامات المجهزة تفصل تماماً بين الكود الهيكلي لقاعدة البيانات والمعطيات النصية المدخلة، مما يحرم قاعدة البيانات من تنفيذ المدخلات كأوامر برمجية.',
              explanationEn: 'Prepared statements separate parameters from SQL query execution, preventing interpreting parameters as executable database code.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm16',
    title: 'اختراق الشبكات اللاسلكية (CEH Module 16)',
    titleEn: 'Hacking Wireless Networks',
    description: 'تشفير موجات شبكات الواي فاي، تحليل عيوب WEP و WPA2 وهجمات سرقة وتحليل المصافحة الرباعية (4-way Handshake) وإعداد نقاط اتصال وهمية خادعة.',
    descriptionEn: 'Study wireless signal encryption, discovering flaws in WEP and WPA2/WPA3 protocols, capturing and cracking 4-way handshakes, and setting up rogue access points.',
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    duration: '5 ساعات',
    durationAr: '5 ساعات',
    durationEn: '5 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Wi-Fi Hacking', 'Aircrack-ng', 'WPA2/WPA3 Handshake'],
    skillsAr: ['اختراق الواي فاي', 'مجموعة أدوات Aircrack-ng', 'تخمين المصافحة الرباعية'],
    lessons: [
      {
        id: 'm16-l1',
        moduleId: 'm16',
        title: 'معايير التشفير والتقاط المصافحة اللاسلكية وتخمينها',
        titleEn: 'Encryption Standards, Handshake Capture & Cracking',
        summary: 'دراسة وتحليل هجمات قطع الاتصال بـ (Deauthentication Attack) لإجبار العميل على إعادة الاتصال والتقاط ملف المصافحة WPA2 Handshake .cap، وتخمينه باستعمال aircrack-ng.',
        summaryEn: 'Study deauthentication attacks to force client reconnects, capturing the WPA2 .cap handshake file, and brute-forcing keys using aircrack-ng.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m16-l1',
          lessonId: 'm16-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-wifi1',
              type: 'MCQ',
              question: 'أي من الأساليب التالية يستخدمه المهاجم لإجبار العميل المتصل بالواي فاي على الانفصال الفوري لالتقاط ملف المصافحة WPA2؟',
              questionEn: 'Which technique is used to force a Wi-Fi client to disconnect immediately in order to capture the WPA2 handshake?',
              options: [
                'Deauthentication Attack (هجوم إلغاء المصادقة اللاسلكي)',
                'DNS Spoofing (انتحال سجلات النطاق)',
                'SQL Injection (حقن قواعد البيانات)',
                'MAC Spoofing'
              ],
              optionsEn: [
                'Deauthentication Attack',
                'DNS Spoofing',
                'SQL Injection',
                'MAC Spoofing'
              ],
              correctAnswer: 'Deauthentication Attack (هجوم إلغاء المصادقة اللاسلكي)',
              explanation: 'هجوم إلغاء المصادقة (Deauth Attack) يرسل حزم فصل اتصالات وهمية غير مشفرة باسم الراوتر إلى الأجهزة المتصلة لإرغامها على قطع الاتصال وإعادة الاتصال مجدداً.',
              explanationEn: 'Deauthentication frames are sent to disconnect connected devices, triggering a reconnection sequence that exposes the WPA2 4-way handshake.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm17',
    title: 'اختراق الأجهزة المحمولة والهواتف (CEH Module 17)',
    titleEn: 'Hacking Mobile Platforms',
    description: 'تحليل ثغرات الأجهزة المحمولة الذكية بنظامي Android و iOS، وفهم الهندسة العكسية لملفات APK وتخمين التراخيص وتثبيت أحصنة طروادة المحمولة.',
    descriptionEn: 'Discover vulnerabilities in Android and iOS devices, understand reverse engineering of APKs, permission hijacking, and mobile trojan injection.',
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Mobile Security', 'Android Backdoors', 'Jailbreaking'],
    skillsAr: ['أمن تطبيقات الهواتف', 'أبواب الأندرويد الخلفية Backdoors', 'سرقة التراخيص'],
    lessons: [
      {
        id: 'm17-l1',
        moduleId: 'm17',
        title: 'ثغرات تطبيقات الهاتف وعكس كود الـ APK بهندسة الأكواد',
        titleEn: 'Mobile App Vulnerabilities & Decompiling APKs',
        summary: 'تعلم آلية توليد حمولات الهواتف بـ MSFvenom ودمجها داخل ملفات APK بريئة ومصرحة، وكيفية تتبع الأذونات غير العادية، ومفهوم كسر الحماية (Jailbreaking / Rooting).',
        summaryEn: 'Learn how backdoors are generated using MSFvenom and injected into legitimate APKs, inspecting suspicious permissions, and analyzing mobile rooting and jailbreaking security implications.',
        duration: '1.2 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m17-l1',
          lessonId: 'm17-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-mob1',
              type: 'MCQ',
              question: 'ما هي الأداة الشائعة الاستخدام في بيئة Kali Linux لتوليد أكواد وأبواب خلفية خبيثة وحقنها بملفات تطبيقات الأندرويد؟',
              questionEn: 'Which tool in Kali Linux is commonly used to generate malicious payloads and inject them into Android applications?',
              options: [
                'MSFvenom',
                'Wireshark',
                'Nmap',
                'Hydra'
              ],
              optionsEn: [
                'MSFvenom',
                'Wireshark',
                'Nmap',
                'Hydra'
              ],
              correctAnswer: 'MSFvenom',
              explanation: 'أداة MSFvenom التابعة لإطار عمل ميتاسبلويت هي المسؤولة عن توليد الحمولات البرمجية والأكواد الخبيثة لمختلف منصات التشغيل بصيغ جاهزة للتنفيذ.',
              explanationEn: 'MSFvenom is a framework component used to design and bundle custom shellcode and payloads for various operating systems.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm18',
    title: 'اختراق إنترنت الأشياء والأنظمة الصناعية - IoT / OT (CEH Module 18)',
    titleEn: 'IoT and OT Hacking',
    description: 'ثغرات الأجهزة المتصلة والحساسات (IoT Security) ودراسة أمن الشبكات الصناعية الحيوية وخوادم SCADA وبروتوكول Modbus ومخاطرها الوطنية.',
    descriptionEn: 'Vulnerabilities in connected smart objects (IoT), studying the security of industrial control networks (OT), SCADA systems, Modbus protocols, and critical infrastructure risks.',
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['IoT Security', 'SCADA / OT', 'Industrial Attacks'],
    skillsAr: ['أمن إنترنت الأشياء', 'الأنظمة الصناعية SCADA/OT', 'بروتوكول Modbus'],
    lessons: [
      {
        id: 'm18-l1',
        moduleId: 'm18',
        title: 'أمن البنية التحتية والشبكات التشغيلية وتحليل برمجيات الأجهزة المدمجة',
        titleEn: 'OT Operational Security, Modbus Flaws & Firmware Auditing',
        summary: 'دراسة الفروق التقنية بين تكنولوجيا المعلومات (IT) والأنظمة التشغيلية الفيزيائية (OT)، وتحليل بروتوكولات SCADA الضعيفة التي تفتقر للتشفير وكيف تتأثر بالهجمات السيبرانية.',
        summaryEn: 'Study technical variations between IT and OT infrastructure, vulnerable SCADA protocols lacking encryption, and auditing device firmware.',
        duration: '1.2 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m18-l1',
          lessonId: 'm18-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-iot1',
              type: 'MCQ',
              question: 'ما هو الفارق الجوهري والأساسي بين تكنولوجيا المعلومات (IT) والتكنولوجيا التشغيلية (OT) في بيئات المصانع والبنية التحتية؟',
              questionEn: 'What is the primary difference between IT and Operational Technology (OT) in industrial environments?',
              options: [
                'الـ IT يهتم بالبيانات والبرمجيات الافتراضية، بينما الـ OT يتحكم بالأجهزة المادية وصمامات المحركات على أرض الواقع',
                'الـ OT لا يستخدم خطوط الإنترنت أو كوابل الشبكة مطلقاً',
                'تكنولوجيا الـ IT مخصصة للمصانع والـ OT مخصصة للشركات المالية والمكاتب',
                'الـ OT يعمل فقط على أجهزة وأنظمة التشغيل أندرويد'
              ],
              optionsEn: [
                'IT manages virtual software and data databases, while OT monitors physical machinery and actuator valves in the real world',
                'OT never uses internet connections or network cabling',
                'IT is dedicated to factories and OT is designed for finance corporate offices',
                'OT works exclusively on Android tablets and mobiles'
              ],
              correctAnswer: 'الـ IT يهتم بالبيانات والبرمجيات الافتراضية، بينما الـ OT يتحكم بالأجهزة المادية وصمامات المحركات على أرض الواقع',
              explanation: 'أنظمة OT (Operational Technology) تتحكم بالصمامات، المولدات، والمعدات الفيزيائية الحقيقية، وأي خلل فيها يسبب ضرراً مادياً وبيئياً ملموساً بعكس بيئة الـ IT المحصورة بالبيانات.',
              explanationEn: 'OT systems interact directly with the physical world through industrial valves, machinery, and sensors, while IT handles digital data.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm19',
    title: 'أمن السحابة والحوسبة السحابية (CEH Module 19)',
    titleEn: 'Cloud Computing',
    description: 'أمن الأنظمة الموزعة ونماذج السحاب (SaaS, PaaS, IaaS)، وفحص ومراجعة تهيئة الحاويات والدوكر والكوبرنيتيس (Docker & Kubernetes) وحقن الخادم.',
    descriptionEn: 'Security of distributed computing and cloud models (SaaS, PaaS, IaaS), auditing misconfigurations in Docker and Kubernetes containers, and cloud hijacking.',
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Cloud Security', 'Container Escaping', 'Shared Responsibility'],
    skillsAr: ['أمن السيرفرات السحابية', 'هروب الحاويات Docker', 'المسؤولية المشتركة'],
    lessons: [
      {
        id: 'm19-l1',
        moduleId: 'm19',
        title: 'أمان الحوسبة السحابية ونموذج المسؤولية الأمنية المشتركة',
        titleEn: 'Cloud Architecture & Shared Security Responsibility Model',
        summary: 'شرح مصفوفة المسؤولية المشتركة بين مزودي الخدمات (AWS, Azure) والمستأجرين، وكشف وفحص الأخطاء الأمنية في حاويات Docker والتخطي غير المصرح به للـ Metadata Services.',
        summaryEn: 'An explanation of the Shared Responsibility Matrix between cloud providers and tenants, auditing Docker vulnerabilities, and bypassing cloud metadata services (IMDS).',
        duration: '1.2 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m19-l1',
          lessonId: 'm19-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-cld1',
              type: 'MCQ',
              question: 'وفق مصفوفة المسؤولية المشتركة (Shared Responsibility Model) في سحابة البنية التحتية كخدمة (IaaS)، من المسؤول عن تأمين وتحديث نظام التشغيل المثبت على الخادم الافتراضي للعميل؟',
              questionEn: 'Under the Shared Responsibility Model in IaaS, who is responsible for hardening the operating system installed on the virtual instance?',
              options: [
                'العميل المستأجر (Customer)',
                'مستضيف الخدمات السحابية وموفرها (Cloud Provider like AWS/Azure)',
                'منظمة الأيزو العالمية وهيئات الاتصال الفيدرالية',
                'المزود والعميل بشكل متطابق ومشترك تلقائياً'
              ],
              optionsEn: [
                'The Customer (tenant)',
                'The Cloud Provider (e.g., AWS, Azure)',
                'ISO Organization and communication authorities',
                'Both customer and provider share full equal system patching duties automatically'
              ],
              correctAnswer: 'العميل المستأجر (Customer)',
              explanation: 'في نموذج IaaS، يقوم موفر السحابة بحماية وتأمين الهيكل الفيزيائي والهايبرفايزر فقط، بينما يتحمل العميل المسؤولية الكاملة عن حماية نظام التشغيل والبيانات والبرامج التي يرفعها.',
              explanationEn: 'In IaaS, the provider secures the physical hardware and virtualization host, while the customer is responsible for operating systems, data, and access controls.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm20',
    title: 'علم التشفير وإخفاء البيانات (CEH Module 20)',
    titleEn: 'Cryptography',
    description: 'المفاهيم الرياضية والهيكلية للتشفير المتماثل وغير المتماثل، فحص وفك هاشات كلمات المرور، وشهادات الأمان PKI واستغلال خوارزميات التشفير الضعيفة.',
    descriptionEn: 'Mathematical and structural foundations of symmetric and asymmetric encryption, cracking hashes, public key infrastructure (PKI), and exploiting weak ciphers.',
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 0,
    quizzesCount: 1,
    skills: ['Cryptography', 'Symmetric vs Asymmetric', 'MD5/SHA Cracking'],
    skillsAr: ['تشفير وحماية البيانات', 'التشفير المتماثل وغير المتماثل', 'فك تجزئات الهاشات'],
    lessons: [
      {
        id: 'm20-l1',
        moduleId: 'm20',
        title: 'أنواع التشفير وعمل الهاشات والتشققات الرياضية وفك التعمية',
        titleEn: 'Symmetric & Asymmetric Cryptography & Hash Cracking',
        summary: 'دراسة وتحليل خوارزميات التشفير المتماثل السريع (AES) الذي يستعمل مفتاحاً موحداً للتشفير وفك التشفير، والغير متماثل (RSA) بمفتاحين عام وخاص، ووظيفة خوارزميات التجزئة وحماية كلمات المرور من خلال إضافة تتبيل الملح (Salting).',
        summaryEn: 'Study fast symmetric cryptography (AES) sharing single keys, asymmetric cryptography (RSA) using public/private key pairs, and hashing algorithms with password salting security.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: false,
        hasQuiz: true,
        quiz: {
          id: 'q-m20-l1',
          lessonId: 'm20-l1',
          timeLimitSeconds: 120,
          questions: [
            {
              id: 'q-cryp1',
              type: 'MCQ',
              question: 'أي من خوارزميات التجزئة الهاش (Hashing) التالية تعتبر تالفة رياضياً وغير آمنة للاستعمال في حماية وتوقيع كلمات المرور لسهولة تصادمها؟',
              questionEn: 'Which hashing algorithm is mathematically broken and considered insecure due to easy collision findings?',
              options: [
                'MD5',
                'SHA-256',
                'bcrypt',
                'Argon2'
              ],
              optionsEn: [
                'MD5',
                'SHA-256',
                'bcrypt',
                'Argon2'
              ],
              correctAnswer: 'MD5',
              explanation: 'خوارزمية MD5 تالفة وهشّة منذ سنوات نظراً لإيجاد ثغرات تصادم رياضية (Hash Collisions) تتيح توليد نفس مخرجات الهاش لمدخلين مختلفين تماماً.',
              explanationEn: 'MD5 is cryptographically broken and prone to collision attacks, making it unsafe for hashing sensitive user passphrases.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm21',
    title: 'استخدام الذكاء الاصطناعي في الاختبار الأخلاقي (CEH Module 21)',
    titleEn: 'AI in Ethical Hacking',
    description: 'فهم استخدام نماذج الذكاء الاصطناعي التوليدي والتعلم الآلي في أتمتة اختبار الاختراق، وتحليل الكود المصدري أمنياً، وتوليد حمولات الاستغلال، وتأمين الأنظمة.',
    descriptionEn: 'Understand the use of generative AI and machine learning models in automating penetration testing, auditing code secure-ness, generating exploits, and hardening defenses.',
    difficulty: 'Intermediate',
    difficultyAr: 'متوسط',
    duration: '4 ساعات',
    durationAr: '4 ساعات',
    durationEn: '4 hours',
    lessonsCount: 1,
    labsCount: 1,
    quizzesCount: 1,
    skills: ['AI Security Auditing', 'LLM Prompt Exploits', 'Automated Hacking'],
    skillsAr: ['الفحص الأمني بالذكاء الاصطناعي', 'استغلال موجهات LLM', 'الأتمتة السيبرانية'],
    lessons: [
      {
        id: 'm21-l1',
        moduleId: 'm21',
        title: 'الهجمات الموجهة وتوليد حمولات الاستغلال بالذكاء الاصطناعي',
        titleEn: 'Prompt-based Attacks & AI Exploit Generation',
        summary: 'يتناول هذا الدرس كيفية توظيف النماذج اللغوية الكبيرة (LLMs) في مراجعة الكود البرمجي واكتشاف الثغرات الأمنية مثل ثغرات حقن الكود، وتخطي حماية النماذج (Jailbreaking) للحصول على معلومات استغلالية، بالإضافة لأتمتة عمليات كتابة نصوص الاستغلال.',
        summaryEn: 'This lesson explores how to utilize Large Language Models (LLMs) for reviewing source code, detecting vulnerabilities such as injection, performing jailbreak attacks on security alignment, and automating the writing of exploit scripts.',
        duration: '1.5 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: true,
        lab: {
          id: 'lab-m21-l1',
          lessonId: 'm21-l1',
          title: 'مختبر أتمتة الفحص الأمني ومراجعة الكود بالذكاء الاصطناعي',
          titleEn: 'AI Security Auditing & Code Analysis Lab',
          scenario: 'تم تزويدك بكود برمجى مكتوب بلغة بايثون مشتبه بوجود ثغرة حقن أوامر نظام (OS Command Injection) فيه. مهمتك هي تشغيل نموذج الذكاء الاصطناعي الأمني المدمج، ووضع المدخل البرمجي المناسب لتحليل الثغرة وتوليد حمولة الاختراق (Exploit Payload) ثم تشغيلها بنجاح للحصول على العلم.',
          scenarioEn: 'You are provided with a Python code block suspected of having an OS Command Injection vulnerability. Use the integrated AI Security Auditor to review the script, identify the injection point, craft the exploitation payload, and execute it to extract the hidden flag.',
          objective: 'قم بتحليل كود البايثون المليء بالثغرات باستخدام الذكاء الاصطناعي، واستنتج الحمولة المناسبة للحصول على العلم الحصري.',
          objectiveEn: 'Analyze the vulnerable Python code using AI, generate the exploit payload, run it, and secure the flag.',
          hints: [
            'الكود يحتوي على دالة subprocess.Popen بدون تصفية المدخلات.',
            'الحمولة المناسبة تعتمد على دمج أمر إضافي مثل ; cat flag.txt أو && cat flag.txt',
            'العلم المتوقع هو FLAG{AI_CODE_AUDIT_SUCCESS}'
          ],
          hintsAr: [
            'الكود يستعمل مدخلات المستخدم مباشرة في أوامر النظام.',
            'يمكنك دمج الأوامر في محاكي الطرفية للحصول على العلم.',
            'العلم الصحيح للمختبر هو: FLAG{AI_CODE_AUDIT_SUCCESS}'
          ],
          envType: 'Web',
          tools: ['AI Security Assistant', 'Exploit Runner'],
          points: 120,
          expectedFlag: 'FLAG{AI_CODE_AUDIT_SUCCESS}'
        },
        hasQuiz: true,
        quiz: {
          id: 'q-m21-l1',
          lessonId: 'm21-l1',
          timeLimitSeconds: 180,
          questions: [
            {
              id: 'q-ai-1',
              type: 'MCQ',
              question: 'ما هو مصطلح "Jailbreaking" في سياق اختبار اختراق نماذج الذكاء الاصطناعي (LLMs)؟',
              questionEn: 'What does "Jailbreaking" mean in the context of penetration testing LLMs?',
              options: [
                'كسر حماية نظام التشغيل iOS للهواتف الذكية',
                'صياغة موجهات خاصة لتخطي قيود الأمان والمحاذاة الأخلاقية للنموذج وجعله يولد محتوى ضار أو استغلالي',
                'تشفير قاعدة البيانات الخاصة بنموذج الذكاء الاصطناعي بالكامل',
                'إيقاف الخادم المستضيف للنموذج عن العمل نهائياً'
              ],
              optionsEn: [
                'Bypassing iOS operating system restrictions on smartphones',
                'Designing clever prompts to bypass the AI safety alignment, forcing it to generate malicious or restricted content',
                'Encrypting the database of the AI model completely',
                'Stopping the host server of the AI model from running'
              ],
              correctAnswer: 'صياغة موجهات خاصة لتخطي قيود الأمان والمحاذاة الأخلاقية للنموذج وجعله يولد محتوى ضار أو استغلالي',
              explanation: 'الـ Jailbreaking هو التلاعب بالموجهات (Prompt Manipulation) لخداع النموذج وتخطي القيود الأمنية المدمجة فيه.',
              explanationEn: 'Jailbreaking refers to prompt injection attacks designed to override the safety filters and alignment of an LLM, coaxing it to fulfill banned instructions.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  },
  {
    id: 'm22',
    title: 'اختبار اختراق الدرونز والأنظمة المسيرة (CEH Module 22)',
    titleEn: 'Drone/UAV Penetration Testing',
    description: 'دراسة البروتوكولات اللاسلكية وبروتوكولات القياس عن بعد المستخدمة في التحكم بالطائرات بدون طيار (MavLink, DSMX, Wi-Fi)، وآليات الهجوم مثل التشويش وانتحال الإشارات والتخطي الأمني.',
    descriptionEn: 'Study wireless protocols and telemetry protocols used to control unmanned aerial vehicles (MavLink, DSMX, Wi-Fi), and attack mechanisms such as jamming, GPS/signal spoofing, and control takeover.',
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    duration: '5 ساعات',
    durationAr: '5 ساعات',
    durationEn: '5 hours',
    lessonsCount: 1,
    labsCount: 1,
    quizzesCount: 1,
    skills: ['UAV Pentesting', 'MavLink Exploits', 'RF Jamming & Spoofing'],
    skillsAr: ['اختبار اختراق الطائرات المسيرة', 'استغلال بروتوكول MavLink', 'التشويش اللاسلكي وانتحال GPS'],
    lessons: [
      {
        id: 'm22-l1',
        moduleId: 'm22',
        title: 'بروتوكولات اتصال الطائرات بدون طيار وهجمات التشويش والانتحال',
        titleEn: 'Drone Communication Protocols, Jamming & Spoofing',
        summary: 'يتناول هذا الدرس قنوات التحكم اللاسلكي بالطائرات بدون طيار (UAVs) وبروتوكول التوجيه MavLink غير المشفر، وآلية عمل هجمات انتحال الموقع الجغرافي (GPS Spoofing) وحقن الأوامر اللاسلكية لإجبار الطائرة على الهبوط أو السيطرة التامة عليها.',
        summaryEn: 'This lesson covers wireless control links for Unmanned Aerial Vehicles (UAVs), the unencrypted MavLink telemetry protocol, and methods of GPS spoofing and radio command injection to force emergency landings or execute full control takeovers.',
        duration: '2 ساعة',
        hasVideo: false,
        hasPdf: true,
        hasLab: true,
        lab: {
          id: 'lab-m22-l1',
          lessonId: 'm22-l1',
          title: 'معمل محاكاة السيطرة واختراق وصلة اتصال الدرون',
          titleEn: 'Drone Link Exploitation & Telemetry Simulator',
          scenario: 'لقد تم رصد درون مجهول يحلق فوق منطقة أمنية حساسة، ويتصل بمحطة أرضية عبر بروتوكول MavLink غير مشفر. مهمتك هي استخدام أداة انتحال البيانات لإرسال إشارات إحداثيات GPS مغلوطة لتوجيه الدرون إلى مكان الهبوط الآمن التابع لنا للحصول على العلم المطبوع على شريحة الصندوق الأسود للدرون.',
          scenarioEn: 'An unidentified drone is detected hovering over a sensitive secure zone, transmitting via unencrypted MavLink telemetry. Your mission is to configure and initiate a GPS spoofing or packet injection attack to hijack its waypoint tracking and force a safe landing at our recovery zone. Once landed, extract the flight recorder flag!',
          objective: 'قم بتعطيل توجيه الدرون، أو انتحال الإحداثيات لتنزيل الطائرة في منطقة الهبوط واستعادة ملف العلم.',
          objectiveEn: 'Spoof the GPS signals or inject MavLink landing commands to ground the drone at our recovery coordinates and retrieve the flag.',
          hints: [
            'بروتوكول MavLink لا يوفر تشفيراً افتراضياً، مما يسمح بحقن حزم MAV_CMD_NAV_LAND',
            'انتحال إشارة الـ GPS يخدع نظام القصور الذاتي للطائرة ويعيد توجيهها.',
            'العلم الصحيح بعد هبوط الطائرة وفتح الصندوق الأسود هو FLAG{DRONE_GPS_SPOOF_CAPTURED}'
          ],
          hintsAr: [
            'بروتوكول MavLink ضعيف ضد حقن الحزم لعدم وجود تشفير.',
            'قم برفع طاقة التشويش أو انتحل إحداثيات خط العرض والارتفاع.',
            'العلم المطلوب هو: FLAG{DRONE_GPS_SPOOF_CAPTURED}'
          ],
          envType: 'Network',
          tools: ['MavLink Frame Injector', 'GPS Spoofing Unit'],
          points: 150,
          expectedFlag: 'FLAG{DRONE_GPS_SPOOF_CAPTURED}'
        },
        hasQuiz: true,
        quiz: {
          id: 'q-m22-l1',
          lessonId: 'm22-l1',
          timeLimitSeconds: 180,
          questions: [
            {
              id: 'q-drone-1',
              type: 'MCQ',
              question: 'ما هو بروتوكول MavLink الشائع في أنظمة المسيرات وما هي نقطة ضعفه الأساسية؟',
              questionEn: 'What is the MavLink protocol common in drone systems, and what is its primary security weakness?',
              options: [
                'بروتوكول لتشفير الفيديوهات عالية الدقة، ونقطة ضعفه هي بطء المعالجة',
                'بروتوكول تواصل خفيف ونقل بيانات القياس والتحكم عن بعد (Telemetry)، ونقطة ضعفه الأساسية هي خلوّه من التشفير والتحقق من الهوية بشكل افتراضي',
                'نظام لتحديد اتجاه الرياح ميكانيكياً، وثغرته هي القابلية للصدأ',
                'بروتوكول لاسلكي يعمل بترددات راديوية مشفرة جداً لا يمكن اختراقها'
              ],
              optionsEn: [
                'An encryption protocol for high-definition video, vulnerable to slow encoding times',
                'A lightweight serialization protocol used for telemetry and vehicle command links, whose main weakness is lack of encryption and authentication by default',
                'A mechanical system to measure wind direction, vulnerable to physical rusting',
                'A highly encrypted radio frequency protocol that cannot be intercepted'
              ],
              correctAnswer: 'بروتوكول تواصل خفيف ونقل بيانات القياس والتحكم عن بعد (Telemetry)، ونقطة ضعفه الأساسية هي خلوّه من التشفير والتحقق من الهوية بشكل افتراضي',
              explanation: 'بروتوكول MavLink صُمم ليكون خفيفاً وسريعاً للأنظمة المدمجة، ولذلك يفتقر افتراضياً للتشفير أو التوقيع الرقمي لحزم البيانات، مما يجعله عرضة للاعتراض والحقن.',
              explanationEn: 'MavLink is designed to be extremely lightweight and high-performance. By default, it contains no encryption or cryptographically signed session validation, enabling packet interception and injection.',
              points: 20
            }
          ]
        },
        hasAssignment: false
      }
    ]
  }
];

// Sort modules by module number just in case
ALL_MODULES.sort((a, b) => {
  const numA = parseInt(a.id.replace('m', ''), 10);
  const numB = parseInt(b.id.replace('m', ''), 10);
  return numA - numB;
});
