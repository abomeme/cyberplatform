import { useState, useEffect } from 'react';
import { Award, Clock, AlertTriangle, CheckCircle2, XCircle, ArrowRight, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QuizViewerProps {
  quiz: Quiz;
  onSuccess: () => void;
  isSolved: boolean;
  onNext?: () => void;
}

export default function QuizViewer({ quiz, onSuccess, isSolved, onNext }: QuizViewerProps) {
  const { language, isRtl } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<{
    scorePercentage: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    results: any[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Reset state when quiz changes
  useEffect(() => {
    setAnswers({});
    setTimeLeft(quiz.timeLimitSeconds);
    setIsSubmitted(false);
    setResults(null);
    setCurrentQuestionIndex(0);
    setErrorMsg(null);
    setIsRetrying(false);
    setShowConfirmSubmit(false);
  }, [quiz.lessonId, quiz.timeLimitSeconds]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || (isSolved && !isRetrying) || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit on timeout
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, isSolved, isRetrying]);

  const question: QuizQuestion = quiz.questions[currentQuestionIndex];
  
  // Retrieve mapped student answer or current selected
  const studentAnsForCurrent = answers[question.id] || '';
  let displaySelectedOption = studentAnsForCurrent;
  
  // If in English and mapped to Arabic, show English value in UI
  if (language === 'en' && question.options && question.optionsEn) {
    const arabicIdx = question.options.indexOf(studentAnsForCurrent);
    if (arabicIdx !== -1 && question.optionsEn[arabicIdx]) {
      displaySelectedOption = question.optionsEn[arabicIdx];
    }
  }

  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    
    // Map English option back to Arabic option if active language is English
    let mappedAnswer = answer;
    if (language === 'en' && question.options && question.optionsEn) {
      const idx = question.optionsEn.indexOf(answer);
      if (idx !== -1 && question.options[idx]) {
        mappedAnswer = question.options[idx];
      }
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: mappedAnswer,
    }));
  };

  const handleAutoSubmit = () => {
    if (isSubmitted) return;
    executeSubmit();
  };

  const handleSubmitAttempt = () => {
    const totalQuestions = quiz.questions.length;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions && timeLeft > 0) {
      setShowConfirmSubmit(true);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    setIsSubmitted(true);
    setErrorMsg(null);
    setShowConfirmSubmit(false);

    try {
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: quiz.lessonId, answers }),
      });
      const data = await response.json();

      if (response.ok) {
        setResults(data);
        if (data.passed) {
          onSuccess();
        }
      } else {
        setErrorMsg(data.error || (language === 'ar' ? 'فشل تسليم الاختبار' : 'Submission failed'));
        setIsSubmitted(false);
      }
    } catch (err) {
      setErrorMsg(language === 'ar' ? 'حدث خطأ أثناء إرسال إجابات الاختبار.' : 'An error occurred while submitting your answers.');
      setIsSubmitted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const retryQuiz = () => {
    setAnswers({});
    setTimeLeft(quiz.timeLimitSeconds);
    setIsSubmitted(false);
    setResults(null);
    setCurrentQuestionIndex(0);
    setErrorMsg(null);
    setIsRetrying(true);
    setShowConfirmSubmit(false);
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg p-6 text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`} id="quiz-container">
      {/* Quiz solved or results view */}
      {results ? (
        <div className="space-y-6 text-center py-6">
          <div className="inline-flex p-4 rounded-full bg-slate-950 border border-emerald-500/30">
            <Award className={`w-16 h-16 ${results.passed ? 'text-emerald-400' : 'text-amber-500'}`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              {results.passed 
                ? (language === 'ar' ? 'تهانينا! لقد اجتزت الاختبار بنجاح 🎉' : 'Congratulations! You passed the quiz! 🎉')
                : (language === 'ar' ? 'للأسف، لم تجتز درجة القبول' : 'Unfortunately, you did not pass the quiz')}
            </h3>
            <p className="text-slate-400 text-sm">
              {language === 'ar'
                ? `لقد أحرزت ${results.scorePercentage}% (أجبت على ${results.correctCount} من أصل ${results.totalQuestions} أسئلة بشكل صحيح).`
                : `You scored ${results.scorePercentage}% (correctly answered ${results.correctCount} out of ${results.totalQuestions} questions).`}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'معدل القبول المطلوب هو 70% أو أعلى.' : 'Required passing rate is 70% or higher.'}
            </p>
          </div>

          {/* Detailed answers display */}
          <div className="max-h-64 overflow-y-auto space-y-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              {language === 'ar' ? 'تفاصيل الإجابات والحلول المقترحة:' : 'Answers Details & Explanations:'}
            </h4>
            {results.results.map((res: any, idx: number) => {
              const originalQ = quiz.questions.find(q => q.id === res.questionId);
              
              // Map student answer back to English if active language is English
              let displayStudentAns = res.studentAnswer || (language === 'ar' ? '(لم تتم الإجابة)' : '(No answer)');
              let displayCorrectAns = res.correctAnswer;

              if (language === 'en' && originalQ?.options && originalQ?.optionsEn) {
                const sIdx = originalQ.options.indexOf(res.studentAnswer);
                if (sIdx !== -1 && originalQ.optionsEn[sIdx]) {
                  displayStudentAns = originalQ.optionsEn[sIdx];
                }
                const cIdx = originalQ.options.indexOf(res.correctAnswer);
                if (cIdx !== -1 && originalQ.optionsEn[cIdx]) {
                  displayCorrectAns = originalQ.optionsEn[cIdx];
                }
              }

              return (
                <div key={res.questionId} className="text-xs border-b border-slate-900 pb-3 last:border-b-0 space-y-2">
                  <div className={`flex items-start gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-slate-500 shrink-0 font-bold">{idx + 1}.</span>
                    <p className="font-semibold text-slate-200">
                      {language === 'ar' ? originalQ?.question : originalQ?.questionEn || originalQ?.question}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 pr-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    {res.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className={res.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {language === 'ar' ? 'إجابتك:' : 'Your Answer:'} {displayStudentAns}
                    </span>
                  </div>
                  {!res.isCorrect && (
                    <p className="text-slate-400 pr-10">
                      {language === 'ar' ? 'الإجابة الصحيحة:' : 'Correct Answer:'} <span className="text-slate-300 font-bold">{displayCorrectAns}</span>
                    </p>
                  )}
                  <p className="text-slate-500 text-[11px] pr-10 italic">
                    {language === 'ar' ? 'تفسير:' : 'Explanation:'} {language === 'ar' ? originalQ?.explanation : originalQ?.explanationEn || originalQ?.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            {results.passed ? (
              <>
                <div className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 px-6 py-2.5 rounded font-bold text-sm">
                  {language === 'ar' ? 'تم استيفاء شرط اجتياز اختبار هذا الدرس! (+50 نقطة)' : 'Condition met to pass this lesson! (+50 XP)'}
                </div>
                {onNext && (
                  <button
                    onClick={onNext}
                    className={`flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-6 py-2.5 rounded-lg font-extrabold text-sm transition-all cursor-pointer shadow-md active:scale-95 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <span>{language === 'ar' ? 'المواصلة للدرس أو الوحدة التالية' : 'Continue to next lesson or module'}</span>
                    <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={retryQuiz}
                className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-6 py-2.5 rounded font-bold text-sm transition-all cursor-pointer ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'ar' ? 'إعادة محاولة الاختبار' : 'Retry Quiz Evaluation'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (isSolved && !isRetrying) ? (
        <div className="space-y-6 text-center py-10">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              {language === 'ar' ? 'لقد اجتزت اختبار هذا الدرس بنجاح من قبل!' : 'You have already passed this lesson quiz!'}
            </h3>
            <p className="text-sm text-slate-400">
              {language === 'ar' ? 'لقد تمت إضافة نقاط التقييم لرصيدك بالفعل.' : 'Evaluation points have already been added to your balance.'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
            {onNext && (
              <button
                onClick={onNext}
                className={`w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-5 py-2.5 rounded-lg font-extrabold text-xs transition-all cursor-pointer shadow-md active:scale-95 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <span>{language === 'ar' ? 'المواصلة للدرس أو الوحدة التالية' : 'Continue to next lesson or module'}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            )}
            <button
              onClick={retryQuiz}
              className={`text-xs text-emerald-400 hover:underline flex items-center justify-center gap-1 cursor-pointer ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'ar' ? 'عرض الأسئلة أو إعادة الاختبار مجدداً' : 'View questions or retake the quiz'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className={`flex items-center justify-between border-b border-slate-800 pb-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400">
                {language === 'ar' ? 'تقييم الفهم والاستيعاب' : 'Comprehension & Understanding Assessment'}
              </span>
              <h3 className="text-lg font-bold">
                {language === 'ar' 
                  ? `السؤال ${currentQuestionIndex + 1} من ${quiz.questions.length}` 
                  : `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`}
              </h3>
            </div>
            <div className={`flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-full border border-slate-800 text-amber-500 font-mono text-sm ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{language === 'ar' ? 'المتبقي:' : 'Left:'} {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="space-y-4">
            <p className="text-md font-medium text-slate-100">
              {language === 'ar' ? question.question : question.questionEn || question.question}
            </p>

            {/* Display Choice options */}
            {(question.type === 'MCQ' || question.type === 'TrueFalse') && (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {((language === 'en' && question.optionsEn) ? question.optionsEn : question.options || []).map((opt) => {
                  const isSelected = displaySelectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectAnswer(question.id, opt)}
                      className={`p-4 rounded-lg border text-sm font-medium transition-all cursor-pointer ${isRtl ? 'text-right' : 'text-left'} ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Display Ordering options */}
            {question.type === 'Ordering' && (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-400 italic">
                  {language === 'ar'
                    ? 'ملاحظة: هذا اختبار مبسط لمطابقة المصافحة الثلاثية، يتم ترتيب الخطوات تلقائياً في هذا الإصدار عند اختيار الإجابة المناسبة.'
                    : 'Note: This is a simplified 3-way handshake ordering question. Steps are automatically sequenced when selecting an appropriate order.'}
                </p>
                <div className="flex flex-col gap-2 p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                  {((language === 'en' && question.optionsEn) ? question.optionsEn : question.options || []).map((opt, idx) => (
                    <div key={idx} className={`flex items-center gap-3 bg-slate-900 p-2.5 rounded border border-slate-800 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded text-xs font-mono">{idx + 1}</span>
                      <span className="text-xs">{opt}</span>
                    </div>
                  ))}
                  <div className={`flex gap-2 mt-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    <button
                      onClick={() => handleSelectAnswer(question.id, '0,1,2')}
                      className={`text-xs px-4 py-2 rounded border font-bold cursor-pointer ${
                        studentAnsForCurrent === '0,1,2' ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      {language === 'ar' ? 'الترتيب صحيح كما هو معروض' : 'Order is correct as displayed'}
                    </button>
                    <button
                      onClick={() => handleSelectAnswer(question.id, '1,0,2')}
                      className={`text-xs px-4 py-2 rounded border font-bold cursor-pointer ${
                        studentAnsForCurrent === '1,0,2' ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      {language === 'ar' ? 'عكس الخطوتين الأولى والثانية' : 'Reverse the first and second steps'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Unanswered questions submit warning modal */}
          {showConfirmSubmit && (
            <div className="p-4 bg-amber-950/40 border border-amber-500/30 text-amber-400 rounded-lg space-y-3">
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-bold">
                  {language === 'ar' ? 'تنبيه: أسئلة غير مكتملة' : 'Warning: Unanswered Questions'}
                </span>
              </div>
              <p className="text-xs">
                {language === 'ar'
                  ? `لم تقم بالإجابة على جميع الأسئلة بعد (${Object.keys(answers).length} من أصل ${quiz.questions.length} مجاب). هل أنت متأكد من تسليم الاختبار الآن؟`
                  : `You have not answered all questions yet (${Object.keys(answers).length} of ${quiz.questions.length} answered). Are you sure you want to submit now?`}
              </p>
              <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <button
                  onClick={executeSubmit}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-1.5 rounded transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'نعم، قم بالتسليم' : 'Yes, Submit anyway'}
                </button>
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold px-4 py-1.5 rounded transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'تراجع والعودة للحل' : 'Cancel and keep answering'}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className={`flex items-center gap-2 p-3 rounded bg-rose-950/50 border border-rose-500/30 text-rose-400 text-xs ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className={`flex items-center justify-between border-t border-slate-800 pt-4 mt-6 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400 cursor-pointer ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
            </button>

            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentQuestionIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1));
                  setShowConfirmSubmit(false);
                }}
                className={`flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleSubmitAttempt}
                disabled={isSubmitted}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 px-5 py-2 rounded-lg text-xs font-extrabold transition-all active:scale-95 glow-btn cursor-pointer"
              >
                {language === 'ar' ? 'تسليم الإجابات وإنهاء الاختبار' : 'Submit Answers & Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
