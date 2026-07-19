import { CourseModule, Lesson, QuizQuestion } from '../types';

const getToolExplanation = (tool: string): string => {
  const dict: { [key: string]: string } = {
    'ls': 'عرض الملفات والمجلدات في المسار الحالي لاستكشاف بنية النظام.',
    'cd': 'تغيير المجلد النشط والانتقال عبر مسارات الملفات المختلفة.',
    'cat': 'عرض وقراءة محتويات الملفات النصية وطباعتها على الشاشة.',
    'find': 'البحث المتقدم والمفصل عن الملفات وصلاحيات الأمان داخل النظام.',
    'suid-helper': 'أداة تعليمية لمحاكاة ملفات SUID واستغلال ثغرات الامتيازات.',
    'nmap': 'فحص المنافذ والخدمات المفتوحة واكتشاف إصداراتها على الشبكة.',
    'curl': 'تفاعل وإرسال طلبات HTTP وتنزيل الملفات البرمجية من السيرفرات.',
    'grep': 'تصفية النصوص والبحث عن كلمات ومفاهيم محددة داخل الملفات.',
    'chmod': 'تعديل أذونات القراءة والكتابة والتشغيل للمستخدمين والمجموعات.',
    'ping': 'اختبار الاتصال وسرعة استجابة الخوادم النشطة على الشبكة.',
    'wireshark': 'التقاط وتحليل حزم البيانات المنسابة عبر خطوط الاتصال.',
    'hydra': 'تخمين هجوم القوة الغاشمة على بروتوكولات تسجيل الدخول.',
    'sqlmap': 'فحص واستكشاف ثغرات حقن الاستعلامات SQL تلقائياً وبدقة.'
  };
  return dict[tool.toLowerCase()] || 'أداة برمجية متخصصة في اختبار الاختراق الأخلاقي والتقييم الأمني.';
};

export function generateGuideHtml(module: CourseModule, lesson: Lesson): string {
  const lab = lesson.lab;
  const quiz = lesson.quiz;

  // Build commands section
  let commandsHtml = '';
  if (lab && lab.tools && lab.tools.length > 0) {
    commandsHtml = `
      <div class="mt-8 bg-slate-900/60 rounded-xl border border-slate-800 p-6 print-card">
        <h3 class="text-base font-bold text-emerald-400 flex items-center gap-2 mb-4">
          <span>🛠️</span> مرجع سطر الأوامر والأدوات المستخدمة
        </h3>
        <p class="text-xs text-slate-400 mb-4">الأوامر التقنية المعتمدة في هذا الدرس العملي:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${lab.tools.map(tool => `
            <div class="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono text-xs bg-slate-900 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">$ ${tool}</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">${getToolExplanation(tool)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Build lab section
  let labHtml = '';
  if (lesson.hasLab && lab) {
    labHtml = `
      <div class="mt-8 bg-slate-900/60 rounded-xl border border-slate-800 p-6 print-card">
        <h3 class="text-base font-bold text-emerald-400 flex items-center gap-2 mb-4">
          <span>💻</span> تفاصيل المعمل والتطبيق العملي للموضوع
        </h3>
        <div class="space-y-4">
          <div class="p-4 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <span class="text-[10px] font-bold text-emerald-500 block mb-1">السيناريو الأمني (Scenario):</span>
            <p class="text-xs text-slate-300 leading-relaxed">${lab.scenario}</p>
          </div>
          <div class="p-4 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <span class="text-[10px] font-bold text-emerald-500 block mb-1">الهدف والمهمة (Objective):</span>
            <p class="text-xs text-slate-300 leading-relaxed">${lab.objective}</p>
          </div>
          <div class="p-4 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <span class="text-[10px] font-bold text-amber-500 block mb-1">تلميحات وإرشادات الحل (Hints):</span>
            <ul class="list-disc list-inside text-xs text-slate-400 space-y-1.5 pr-2">
              ${lab.hintsAr.map(hint => `<li>${hint}</li>`).join('')}
            </ul>
          </div>
          <div class="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800/60 text-xs">
            <span class="text-slate-400">صيغة العلم المستخرج:</span>
            <span class="font-mono bg-slate-900 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">FLAG{...}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Build quiz section
  let quizHtml = '';
  if (lesson.hasQuiz && quiz && quiz.questions && quiz.questions.length > 0) {
    quizHtml = `
      <div class="mt-8 bg-slate-900/60 rounded-xl border border-slate-800 p-6 print-card">
        <h3 class="text-base font-bold text-emerald-400 flex items-center gap-2 mb-4">
          <span>📝</span> اختبار التقييم الذاتي المعتمد (الأسئلة والحلول)
        </h3>
        <p class="text-xs text-slate-400 mb-5">مجموعة من الأسئلة لاختبار فهمك النظري والعملي مع شرح الإجابة التفصيلي:</p>
        <div class="space-y-6">
          ${quiz.questions.map((q, idx) => {
            const optionsList = q.options || [];
            return `
              <div class="p-4 bg-slate-950/80 rounded-lg border border-slate-800/60 space-y-3">
                <div class="flex items-start gap-2 justify-between">
                  <span class="bg-slate-900 text-slate-400 text-[10px] border border-slate-800 px-2 py-0.5 rounded shrink-0 font-bold">
                    السؤال ${idx + 1}
                  </span>
                  <span class="text-[10px] text-emerald-400 font-bold shrink-0 font-mono">+${q.points} نقطة</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200 leading-relaxed">${q.question}</h4>
                
                ${optionsList.length > 0 ? `
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                    ${optionsList.map(opt => {
                      const isCorrect = opt === q.correctAnswer;
                      return `
                        <div class="p-2.5 rounded text-xs border ${
                          isCorrect 
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 font-bold' 
                            : 'bg-slate-900/50 border-slate-800/50 text-slate-400'
                        } flex items-center justify-between">
                          <span>${opt}</span>
                          ${isCorrect ? '<span class="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-bold">الإجابة الصحيحة</span>' : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : `
                  <div class="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded text-xs text-emerald-400 font-bold">
                    الإجابة الصحيحة: ${q.correctAnswer}
                  </div>
                `}

                <div class="mt-3 p-3 bg-slate-900/40 border-r-2 border-emerald-500 rounded text-xs text-slate-400 leading-relaxed">
                  <span class="text-[10px] text-emerald-400 block font-bold mb-1">تفسير علمي وحل نموذجي:</span>
                  ${q.explanation}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lesson.title} | دليل الدراسة والتحضير</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Cairo', sans-serif;
    }
    code, pre {
      font-family: 'JetBrains Mono', monospace;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        background-color: white !important;
        color: #0f172a !important;
        padding: 0 !important;
      }
      .print-card {
        border: 1px solid #e2e8f0 !important;
        box-shadow: none !important;
        background: white !important;
        color: #0f172a !important;
      }
      .print-card p, .print-card span, .print-card li, .print-card h4 {
        color: #1e293b !important;
      }
      .print-card h3 {
        color: #10b981 !important;
      }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-slate-950">

  <!-- Header Print Navigation Action Bar -->
  <div class="no-print bg-slate-900 border-b border-slate-800 py-3 px-4 sticky top-0 z-50">
    <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="text-emerald-400 text-lg">🛡️</span>
        <span class="text-xs font-bold text-slate-300">أكاديمية الاختراق الأخلاقي (CEH Academy)</span>
      </div>
      <button 
        onclick="window.print()" 
        class="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-extrabold px-4 py-2 rounded transition-all cursor-pointer shadow-lg shadow-emerald-950/20 flex items-center gap-1.5"
      >
        <span>🖨️</span>
        <span>حفظ ومطبوعات كـ PDF</span>
      </button>
    </div>
  </div>

  <main class="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
    
    <!-- Hero / Metadata -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden print-card">
      <div class="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div class="space-y-4 relative z-10">
        <div class="flex items-center gap-2 text-xs text-emerald-400 font-bold">
          <span>الوحدة: ${module.title}</span>
          <span>•</span>
          <span>مستوى الصعوبة: ${module.difficultyAr}</span>
          <span>•</span>
          <span>المدة: ${lesson.duration}</span>
        </div>
        
        <h1 class="text-xl md:text-2xl font-extrabold text-slate-100 leading-tight">${lesson.title}</h1>
        <p class="text-slate-400 text-xs md:text-sm leading-relaxed leading-7">${lesson.summary}</p>
        
        <div class="flex flex-wrap gap-2 pt-2">
          ${module.skillsAr.map(skill => `
            <span class="bg-slate-950/80 border border-slate-800/80 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded">
              🔍 ${skill}
            </span>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Main Course Content -->
    <div class="bg-slate-900/60 rounded-xl border border-slate-800 p-6 print-card space-y-6">
      <h3 class="text-base font-bold text-emerald-400 flex items-center gap-2 pb-3 border-b border-slate-800/80">
        <span>📖</span> المادة العلمية والشرح المنهجي
      </h3>
      <div class="text-xs md:text-sm text-slate-300 leading-relaxed leading-8 whitespace-pre-line">
        ${lesson.summary}

        تحتوي مناهج الاختراق الأخلاقي على مجموعة من القواعد والضوابط الصارمة لضمان سلامة وخصوصية البيانات. ننصح بشدة بمراجعة ومذاكرة هذه المفاهيم، وحفظ الصيغ والأدوات الفنية المدرجة لتطبيقها بثقة في اختبار التقييم والبيئة المعملية التفاعلية المرفقة.
      </div>
    </div>

    <!-- Dynamic Commands Reference Section -->
    ${commandsHtml}

    <!-- Dynamic Lab Exercises Section -->
    ${labHtml}

    <!-- Dynamic Quiz Section -->
    ${quizHtml}

    <!-- Dynamic CEH Prep Tips -->
    <div class="bg-slate-900/60 rounded-xl border border-slate-800 p-6 print-card">
      <h3 class="text-base font-bold text-amber-500 flex items-center gap-2 mb-4">
        <span>🎓</span> نصائح التحضير ومذاكرة الامتحان (CEH Exam Tips)
      </h3>
      <ul class="list-disc list-inside text-xs text-slate-400 space-y-3 pr-2 leading-relaxed">
        <li><strong class="text-slate-300">الاستيعاب المفاهيمي:</strong> يركز امتحان شهادة المخترق الأخلاقي المعتمد بشكل مكثف على معرفة "أعلام ومفاتيح" الأوامر (مثل nmap switches). نوصي بحفظ مفاتيح الفحص والتمييز الدقيق بينها.</li>
        <li><strong class="text-slate-300">أمن النظام والمسؤولية:</strong> يحرص الامتحان دائماً على اختبار تفريقك للمخترق الأخلاقي عن الخبيث، وتأكيد الحصول على تصريح مكتوب قبل فحص أي نطاقات.</li>
        <li><strong class="text-slate-300">تطبيق تفاعلي:</strong> ننصح بزيارة المعمل المرفق على موقع المنصة في وقت لاحق لتجربة المهارات في واجهتنا العملية والطرفية النشطة.</li>
      </ul>
    </div>

    <!-- Footer Copyright -->
    <div class="text-center text-[10px] text-slate-500 pt-6 border-t border-slate-800/80">
      <p>أكاديمية الاختراق الأخلاقي المعتمدة • جميع الحقوق محفوظة لعام 2026 ©</p>
      <p class="mt-1">تم إعداد هذا المستند لخدمة وتسهيل استيعاب مناهج المذاكرة الذاتية للأعضاء المشتركين.</p>
    </div>

  </main>

  <script>
    // Safe auto-open print dialog if requested
    console.log("Guide Loaded Successfully.");
  </script>
</body>
</html>`;
}
