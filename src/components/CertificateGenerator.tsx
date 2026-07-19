import { useRef } from 'react';
import { Award, ShieldCheck, Download, Check, Share2, ExternalLink } from 'lucide-react';
import { User } from '../types';

interface CertificateGeneratorProps {
  user: User;
  onClose?: () => void;
}

export default function CertificateGenerator({ user, onClose }: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Simple MD5/SHA-like pseudo-hash for verification
  const verificationHash = `CA-${user.id.toUpperCase()}-${user.points}-99A2Z`;
  const verificationUrl = `https://cyberacademy.sa/verify/${verificationHash}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}&color=10-185-129&bgcolor=0-0-0`;

  const handlePrint = () => {
    const printContent = certificateRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const printWindow = window.open('', '', 'height=600,width=900');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Cyber Academy - الشهادة الموثقة</title>
              <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: 'Cairo', sans-serif; background-color: #020617; color: #f8fafc; }
                @media print {
                  body { background-color: #020617 !important; -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body class="flex items-center justify-center min-h-screen p-4">
              <div class="w-full max-w-4xl">${printContent}</div>
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-6" id="certificate-panel">
      {/* Download / Print controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-lg">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="bg-emerald-950 p-2 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">شهادة سيبرانية موثقة برمز استجابة سريع</h3>
            <p className="text-xs text-slate-400">هذه الشهادة رسمية ومحمية من التزوير عبر كود الـ QR والرمز الفريد.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 space-x-reverse bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-4 py-2 rounded text-xs font-bold transition-all glow-btn"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>طباعة أو حفظ PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-bold transition-all"
            >
              إغلاق النافذة
            </button>
          )}
        </div>
      </div>

      {/* Certificate Frame Container */}
      <div className="overflow-x-auto p-2">
        <div
          ref={certificateRef}
          className="w-[850px] mx-auto bg-slate-950 border-[6px] border-slate-900 rounded-xl p-8 relative overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #030712 0%, #020617 100%)' }}
        >
          {/* Cybernetic decorative elements */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-emerald-500/30 rounded-br-lg pointer-events-none" />

          {/* Background Matrix/Cyber grid placeholder overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Certificate Inner Border */}
          <div className="border border-slate-800 rounded-lg p-8 flex flex-col items-center text-center relative z-10">
            {/* Header Logos */}
            <div className="flex items-center justify-between w-full border-b border-slate-900 pb-6 mb-6">
              <div className="text-right">
                <span className="text-xs text-emerald-500 font-mono tracking-widest block">CYBER ACADEMY CERTIFICATE</span>
                <span className="text-sm font-bold text-slate-400 font-mono">ID: {user.id}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="bg-emerald-900/30 border border-emerald-500/40 p-2 rounded-lg">
                  <Award className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-black text-slate-100">أكاديمية سايبر</h2>
                  <p className="text-[10px] text-slate-400">المنصة الاحترافية لتعليم الأمن السيبراني</p>
                </div>
              </div>
            </div>

            {/* Badge Badge */}
            <div className="bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 mb-6 tracking-wide">
              شهادة إتمام وموثوقية رقمية
            </div>

            {/* Certificate Title */}
            <h1 className="text-3xl font-black text-slate-100 mb-2 font-sans tracking-wide">شهادة إنجاز واجتياز الدورة</h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed mb-6">
              تعلن أكاديمية سايبر للأمن السيبراني واختبار الاختراق الأخلاقي بأن الطالب المذكور أدناه قد أتم بنجاح كامل المتطلبات المنهجية للدورة الاحترافية المعتمدة وتجاوز جميع المعامل والتقييمات بنجاح.
            </p>

            {/* Student Name */}
            <div className="border-b border-dashed border-slate-800 pb-2 mb-2 w-full max-w-md">
              <span className="text-4xl font-extrabold text-emerald-400 font-sans terminal-glow tracking-wide block py-2">
                {user.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 mb-8">الاسم الكامل للطالب المجتاز</span>

            {/* Program Name */}
            <h3 className="text-lg font-bold text-slate-200 mb-1">منهج اختبار الاختراق الأخلاقي والأمن الدفاعي</h3>
            <span className="text-xs font-mono text-slate-500 block mb-8">Certified Ethical Hacking & Defensive Security Syllabus (20 Modules)</span>

            {/* Bottom metadata columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4 border-t border-slate-900 pt-6">
              {/* Left Column: QR Code & Verification */}
              <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-2">
                <img
                  src={qrUrl}
                  alt="كود التحقق من الشهادة"
                  className="w-20 h-20 bg-slate-950 border border-emerald-500/20 p-1 rounded"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">التحقق الرقمي الفوري</span>
                  <p className="text-[9px] text-slate-500 font-mono select-all break-all">{verificationHash}</p>
                </div>
              </div>

              {/* Middle Column: Stamp & Medallion */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center relative">
                  <div className="absolute inset-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-400/80" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 mt-2 block">ختم أكاديمية سايبر الرسمي</span>
              </div>

              {/* Right Column: Signatures */}
              <div className="flex flex-col items-center md:items-end justify-between py-2 text-center md:text-left">
                <div className="space-y-1">
                  <div className="h-8 border-b border-slate-800 w-36 relative flex items-end justify-center">
                    <span className="font-mono text-xs italic text-slate-600 tracking-wider">Fahad_Al_Otaibi</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block">م. فهد العتيبي</span>
                  <span className="text-[9px] text-slate-500 block">مدير إدارة التدريب الأمني والتعليم</span>
                </div>

                <div className="text-[10px] text-slate-500 mt-4">
                  تاريخ الإصدار: {new Date(user.joinedAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
