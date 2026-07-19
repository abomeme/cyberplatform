import React, { useState, useEffect } from 'react';
import { 
  Terminal, Cpu, ShieldAlert, Sparkles, Code, Play, CheckCircle2, 
  Key, AlertTriangle, RefreshCw, Send, HelpCircle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AILabEmulatorProps {
  labId: string;
  points: number;
  expectedFlag: string;
  onSuccess: () => void;
  isSolved: boolean;
  objective: string;
}

export default function AILabEmulator({
  labId,
  points,
  expectedFlag,
  onSuccess,
  isSolved,
  objective,
}: AILabEmulatorProps) {
  const { language, isRtl } = useLanguage();

  // Python Vulnerable Code
  const vulnerableCode = `import subprocess
import sys

def ping_host(ip_address):
    # WARNING: Vulnerable to OS Command Injection!
    # User input is concatenated directly inside shell execution
    command = "ping -c 1 " + ip_address
    
    try:
        print(f"[DEBUG] Running system command: {command}")
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        return stdout.decode('utf-8')
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(ping_host(sys.argv[1]))
    else:
        print("Please provide an IP address to ping.")`;

  // UI States
  const [aiAssistantLogs, setAiAssistantLogs] = useState<string[]>([]);
  const [userInputPrompt, setUserInputPrompt] = useState('');
  const [exploitInput, setExploitInput] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isRunningExploit, setIsRunningExploit] = useState(false);
  const [hasFlagRevealed, setHasFlagRevealed] = useState(false);

  // Form submission
  const [submittedFlag, setSubmittedFlag] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial setup of AI Assistant logs
  useEffect(() => {
    setAiAssistantLogs([
      language === 'ar' 
        ? '🤖 مساعد التدقيق الأمني بالذكاء الاصطناعي متصل وجاهز للعمل.'
        : '🤖 AI Security Audit Assistant online and waiting for input.',
      language === 'ar'
        ? 'اضغط على "تشغيل التدقيق التلقائي بالكود" أو اكتب استفساراً أدناه حول الثغرة.'
        : 'Click "Auto Code Audit" or write a query below to analyze the Python script.'
    ]);
    setSandboxOutput([]);
    setHasFlagRevealed(false);
  }, [language]);

  const handleAutoAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAiAssistantLogs((prev) => [
        ...prev,
        language === 'ar' ? '🔍 جاري تصفح بنية الكود البرمجي...' : '🔍 Scanning code structure...',
        language === 'ar' ? '⚠️ تنبيه أمني: تم رصد دالة subprocess.Popen مع تفعيل خيار shell=True!' : '⚠️ Critical Finding: subprocess.Popen is called with shell=True enabled!',
        language === 'ar' 
          ? '💡 التحليل: السلسلة النصية "ping -c 1 " تُدمج مباشرة بمدخلات ip_address دون تصفية. هذا يتيح للمهاجم استخدام فواصل الأوامر مثل (;) أو (&&) لتنفيذ أوامر نظام عشوائية.'
          : '💡 Vulnerability Analysis: String "ping -c 1 " is directly concatenated with user ip_address without filtering. This allows attackers to use command chain delimiters (;) or (&&) to execute arbitrary OS commands.',
        language === 'ar'
          ? '🎯 تلميحة الاستغلال: جرب كتابة أمر إضافي لقراءة ملف العلم `flag.txt` مثل: `127.0.0.1 ; cat flag.txt` أو `127.0.0.1 && cat flag.txt`'
          : '🎯 Exploitation Vector: Try appending an arbitrary system command to read flag.txt, such as: `127.0.0.1 ; cat flag.txt` or `127.0.0.1 && cat flag.txt`'
      ]);
      setIsAuditing(false);
    }, 1200);
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInputPrompt.trim()) return;

    const query = userInputPrompt.trim();
    setUserInputPrompt('');
    setAiAssistantLogs((prev) => [...prev, `[STUDENT] ${query}`]);

    setTimeout(() => {
      let aiResponse = '';
      if (query.toLowerCase().includes('exploit') || query.includes('استغلال') || query.includes('كيف')) {
        aiResponse = language === 'ar'
          ? '🤖 لاستغلال هذه الثغرة، يجب كسر سياق أمر الـ ping عن طريق إدخال حرف الفصل (;) يليه الأمر المراد تنفيذه (مثل: cat flag.txt). جرب هذا في "منصة تشغيل الاستغلال" تالياً.'
          : '🤖 To exploit this, break the ping command context by inserting a separator (like ;) followed by the payload (e.g. cat flag.txt). Put this in the sandbox runner below!';
      } else if (query.toLowerCase().includes('flag') || query.includes('علم')) {
        aiResponse = language === 'ar'
          ? '🤖 ملف العلم مخفي في نفس المجلد باسم `flag.txt`. قم بحقن أمر قراءة الملف `cat flag.txt` للحصول عليه.'
          : '🤖 The flag file is located in the current directory as `flag.txt`. Inject `cat flag.txt` using shell breakout delimiters to reveal it.';
      } else {
        aiResponse = language === 'ar'
          ? '🤖 الكود المصدري يستقبل المدخل البرمجي الأول ويمرره مباشرة إلى قشرة النظام (OS Shell). يمكن كسر هذا السياق بتمرير `8.8.8.8 ; cat flag.txt`.'
          : '🤖 The source code takes the first parameter and passes it straight to the OS Shell. Bypass this system shell by executing with `8.8.8.8 ; cat flag.txt`.';
      }
      setAiAssistantLogs((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const handleRunExploit = () => {
    if (!exploitInput.trim()) return;

    setIsRunningExploit(true);
    const payload = exploitInput.trim();
    
    setSandboxOutput([
      `$ python vulnerable_script.py "${payload}"`,
      `[DEBUG] Running system command: ping -c 1 ${payload}`
    ]);

    setTimeout(() => {
      // Check if they successfully broke out the command to read flag.txt
      const isBreakout = payload.includes(';') || payload.includes('&&') || payload.includes('|');
      const readsFlag = payload.toLowerCase().includes('cat flag.txt') || payload.toLowerCase().includes('cat') || payload.toLowerCase().includes('flag.txt');

      if (isBreakout && readsFlag) {
        setSandboxOutput((prev) => [
          ...prev,
          `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.`,
          `--- 127.0.0.1 ping statistics ---`,
          `1 packets transmitted, 1 received, 0% packet loss`,
          `[BREAKOUT SUCCESS] System spawned subprocess session successfully as root.`,
          `[READ FILE] flag.txt content:`,
          `----------------------------------------`,
          `FLAG{AI_CODE_AUDIT_SUCCESS}`,
          `----------------------------------------`,
          `[+] Success! Flag captured.`
        ]);
        setHasFlagRevealed(true);
      } else {
        setSandboxOutput((prev) => [
          ...prev,
          `ping: unknown host ${payload}`,
          `[-] Error: Command execution failed or connection timed out.`,
          language === 'ar' 
            ? '💡 تذكير: لم تنجح في استغلال كسر القشرة (Shell Breakout) لقراءة الملف. استخدم دمج الأوامر مثل ; cat flag.txt'
            : '💡 Tip: You did not trigger a breakout command to read the flag. Chain commands with delimiters like ; cat flag.txt'
        ]);
      }
      setIsRunningExploit(false);
    }, 1000);
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedFlag.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/labs/submit-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId, flag: submittedFlag.trim() }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(language === 'ar' ? 'ممتاز! لقد اجتزت معمل التدقيق الأمني بنجاح واقتنصت العلم الصحيح (+120 نقطة)' : 'Excellent! You solved the security audit lab and captured the correct flag (+120 XP)');
        onSuccess();
      } else {
        setErrorMsg(data.error || (language === 'ar' ? 'العلم غير صحيح، حاول مجدداً!' : 'Incorrect flag. Please try again!'));
      }
    } catch (err) {
      setErrorMsg(language === 'ar' ? 'فشل إرسال العلم، تأكد من الاتصال بالخادم.' : 'Failed to submit flag, check connection to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAiAssistantLogs([
      language === 'ar' 
        ? '🤖 مساعد التدقيق الأمني بالذكاء الاصطناعي متصل وجاهز للعمل.'
        : '🤖 AI Security Audit Assistant online and waiting for input.'
    ]);
    setSandboxOutput([]);
    setExploitInput('');
    setHasFlagRevealed(false);
    setSuccessMsg('');
    setErrorMsg('');
    setSubmittedFlag('');
  };

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`} id="ai-lab-wrapper">
      {/* HEADER */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500 font-mono tracking-wider">AI ETHICAL HACKING LAB v1.0</span>
          </div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>{language === 'ar' ? 'مختبر مراجعة كود الثغرات بالذكاء الاصطناعي' : 'AI-Assisted Code Auditing Lab'}</span>
          </h2>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'إعادة ضبط المختبر' : 'Reset Lab'}</span>
        </button>
      </div>

      {/* CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: VULNERABLE PYTHON SCRIPT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col h-full">
          <div className={`flex items-center justify-between border-b border-slate-800 pb-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>vulnerable_ping.py</span>
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-500/10">
              {language === 'ar' ? 'كود غير آمن' : 'Vulnerable Code'}
            </span>
          </div>
          
          <pre className="flex-1 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed max-h-96">
            {vulnerableCode}
          </pre>
        </div>

        {/* RIGHT COLUMN: AI AUDIT ASSISTANT CHAT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-full space-y-4">
          <div className={`flex items-center justify-between border-b border-slate-800 pb-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'التحقيق الذكي ومساعد المراجعة' : 'AI Security Copilot'}</span>
            </span>
            <button
              onClick={handleAutoAudit}
              disabled={isAuditing}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold px-3 py-1 rounded transition-all cursor-pointer"
            >
              {isAuditing ? (language === 'ar' ? 'جاري الفحص...' : 'Auditing...') : (language === 'ar' ? 'تشغيل فحص تلقائي' : 'Auto Code Audit')}
            </button>
          </div>

          {/* CHAT DISPLAY */}
          <div className="flex-1 bg-slate-950 p-4 rounded-lg border border-slate-800 h-56 overflow-y-auto font-sans text-xs space-y-3">
            {aiAssistantLogs.map((log, i) => {
              const isStudent = log.startsWith('[STUDENT]');
              return (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-lg max-w-[90%] leading-relaxed ${
                    isStudent 
                      ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 self-end ml-auto' 
                      : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {isStudent ? log.replace('[STUDENT]', '') : log}
                </div>
              );
            })}
          </div>

          {/* ASK AI INPUT */}
          <form onSubmit={handleAskAi} className="flex gap-2">
            <input
              type="text"
              placeholder={language === 'ar' ? 'اسأل الذكاء الاصطناعي... (مثال: كيف أستغل الثغرة؟)' : 'Ask AI Copilot... (e.g., How to exploit?)'}
              value={userInputPrompt}
              onChange={(e) => setUserInputPrompt(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* INTERACTIVE EXPLOIT SANDBOX */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ar' ? 'لوحة تجربة واختبار حمولات الاختراق (Sandbox Exploit Runner)' : 'Interactive Exploit Sandbox Runner'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'ar' ? 'المدخل (IP / Payload)' : 'Payload Input'}</span>
            <input
              type="text"
              placeholder="e.g. 127.0.0.1 ; cat flag.txt"
              value={exploitInput}
              onChange={(e) => setExploitInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded p-2 text-xs font-mono"
            />
            <button
              onClick={handleRunExploit}
              disabled={isRunningExploit || !exploitInput.trim()}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded transition-all cursor-pointer flex justify-center items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span>{language === 'ar' ? 'تشغيل الكود بالحامولة' : 'Run Exploit'}</span>
            </button>
          </div>

          <div className="md:col-span-8">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">{language === 'ar' ? 'مخرجات الطرفية' : 'Terminal Sandbox Output'}</span>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 h-28 overflow-y-auto space-y-1">
              {sandboxOutput.length === 0 ? (
                <span className="text-slate-600 italic">{language === 'ar' ? 'الطرفية في وضع الاستعداد...' : 'Console output idle. Run payload to see execution logs...'}</span>
              ) : (
                sandboxOutput.map((line, i) => <div key={i}>{line}</div>)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REVEALED FLAG */}
      {hasFlagRevealed && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-6 text-center space-y-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-md font-bold text-emerald-400">
              {language === 'ar' ? '[+] تم مراجعة الكود واستخراج العلم بنجاح!' : '[+] Secure Code Audit Flag Extracted Successfully!'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' 
                ? 'انسخ العلم المقتنص وقم بتقديمه في المربع أدناه لتسجيل التقدم:' 
                : 'Copy the captured flag and submit it below to register your module score:'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-slate-950 border border-emerald-500/30 rounded px-4 py-2 text-md font-mono text-emerald-300 font-extrabold select-all">
            {expectedFlag}
          </div>
        </div>
      )}

      {/* FLAG SUBMISSION BOARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ar' ? 'لوحة تسليم العلم وتسجيل الإنجاز' : 'Tactical Flag Submission Board'}</span>
        </h3>

        {isSolved ? (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-4 text-xs text-emerald-400 flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>
              {language === 'ar' 
                ? 'تم حل هذا المعمل بنجاح! تم حفظ النقاط وتوثيق السيطرة.' 
                : 'Congratulations! This AI-assisted hacking lab is already solved.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleFlagSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={language === 'ar' ? 'أدخل العلم المقتنص هنا (مثال: FLAG{...})' : 'Enter decrypted flag here (e.g. FLAG{...})'}
              value={submittedFlag}
              onChange={(e) => setSubmittedFlag(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded px-4 py-2 text-xs font-mono"
            />
            <button
              type="submit"
              disabled={isSubmitting || !submittedFlag.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 px-6 py-2 rounded font-extrabold text-xs transition-all cursor-pointer shadow-md shrink-0"
            >
              {isSubmitting ? (language === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (language === 'ar' ? 'تسليم العلم المقتنص' : 'Submit Captured Flag')}
            </button>
          </form>
        )}

        {successMsg && (
          <div className="text-xs text-emerald-400 font-bold bg-emerald-950/10 border border-emerald-500/20 p-2 rounded">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="text-xs text-rose-400 font-bold bg-rose-950/10 border border-rose-500/20 p-2 rounded">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
