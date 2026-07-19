import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Navigation, Radio, Signal, Cpu, AlertTriangle, Battery, Compass, 
  Target, Sliders, Play, RotateCcw, ShieldAlert, Key, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DroneLabEmulatorProps {
  labId: string;
  points: number;
  expectedFlag: string;
  onSuccess: () => void;
  isSolved: boolean;
  objective: string;
}

export default function DroneLabEmulator({
  labId,
  points,
  expectedFlag,
  onSuccess,
  isSolved,
  objective,
}: DroneLabEmulatorProps) {
  const { language, isRtl } = useLanguage();
  
  // Drone Telemetry State
  const [altitude, setAltitude] = useState(85.4); // meters
  const [speed, setSpeed] = useState(14.2); // m/s
  const [battery, setBattery] = useState(78); // percentage
  const [gpsStrength, setGpsStrength] = useState(-65); // dBm (higher is better)
  const [latitude, setLatitude] = useState(24.8143);
  const [longitude, setLongitude] = useState(46.6125);
  const [heading, setHeading] = useState(120); // degrees
  const [statusText, setStatusText] = useState<'AUTO_MISSION' | 'JAMMED' | 'SPOOFED_NAV' | 'LANDING' | 'GROUNDED'>('AUTO_MISSION');
  
  // Cyber Warfare Tool State
  const [isJammingActive, setIsJammingActive] = useState(false);
  const [isSpoofingActive, setIsSpoofingActive] = useState(false);
  const [selectedMavCmd, setSelectedMavCmd] = useState('MAV_CMD_NAV_WAYPOINT');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  // Form submission
  const [submittedFlag, setSubmittedFlag] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedFlag, setRevealedFlag] = useState<string | null>(null);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Log helper
  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [...prev, `[${timestamp}] ${text}`]);
  };

  // Setup initial logs
  useEffect(() => {
    setTerminalLogs([]);
    addLog(language === 'ar' ? 'بدء نظام استقبال بيانات القياس عن بُعد (MavLink RX Online)...' : 'MavLink telemetry receiver online...');
    addLog(language === 'ar' ? 'رصد هدف نشط: UAV-Hexa-773 (نظام تحكم الملاحة الجوية Pixhawk)' : 'Detected target: UAV-Hexa-773 (Pixhawk Flight Controller)');
    addLog(language === 'ar' ? 'البث اللاسلكي: تردد 2.4 جيجاهرتز غير مشفر • إشارة قوية' : 'RF Broadcast: 2.4GHz unencrypted • Signal strong');
    addLog(language === 'ar' ? 'سيناريو: الدرون يتتبع مسارات طيران مبرمجة مسبقاً.' : 'Scenario: Drone tracking pre-programmed waypoint list.');
  }, [language]);

  // Telemetry fluctuation simulator
  useEffect(() => {
    if (statusText === 'GROUNDED') return;

    const timer = setInterval(() => {
      // Small fluctuations if active and not landing
      if (statusText === 'AUTO_MISSION') {
        setAltitude((prev) => Math.max(10, +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
        setSpeed((prev) => Math.max(5, +(prev + (Math.random() * 0.6 - 0.3)).toFixed(1)));
        setHeading((prev) => (prev + Math.floor(Math.random() * 3 - 1) + 360) % 360);
        setBattery((prev) => Math.max(1, prev - (Math.random() < 0.1 ? 1 : 0)));
        
        // Randomly output a telemetry raw log frame
        if (Math.random() < 0.15) {
          addLog(`MAVLINK_MSG_ID_GLOBAL_POSITION_INT: lat=${latitude.toFixed(5)} lon=${longitude.toFixed(5)} alt=${altitude}m`);
        }
      } else if (statusText === 'JAMMED') {
        setSpeed((prev) => Math.max(0, +(prev - 0.8).toFixed(1)));
        setAltitude((prev) => Math.max(30, +(prev + (Math.random() * 0.8 - 0.5)).toFixed(1))); // drift
        setHeading((prev) => (prev + 10) % 360); // spinning
        setGpsStrength(-120); // completely dead signal
      } else if (statusText === 'SPOOFED_NAV') {
        // Fast drifting coordinates towards spoofer recovery zone
        setLatitude((prev) => {
          const diff = 24.7136 - prev;
          return +(prev + diff * 0.15).toFixed(5);
        });
        setLongitude((prev) => {
          const diff = 46.6753 - prev;
          return +(prev + diff * 0.15).toFixed(5);
        });
        setSpeed((prev) => Math.max(8, +(prev - 0.2).toFixed(1)));
        setAltitude((prev) => Math.max(20, +(prev - 0.5).toFixed(1)));
        if (Math.random() < 0.2) {
          addLog(`[GPS_ALIGNED] Spoof coordinates locking: GPS Lat=${latitude} Lon=${longitude}`);
        }
      } else if (statusText === 'LANDING') {
        setSpeed((prev) => Math.max(1, +(prev - 1.5).toFixed(1)));
        setAltitude((prev) => {
          const nextVal = +(prev - 4.5).toFixed(1);
          if (nextVal <= 0.2) {
            clearInterval(timer);
            setStatusText('GROUNDED');
            addLog(language === 'ar' ? '[-] تنبيه: تم رصد ملامسة الأرض وتوقف المحركات.' : '[-] Alert: Ground contact detected. Disarming motors.');
            addLog(language === 'ar' ? '[+] تم اختراق نظام الصندوق الأسود: فك تشفير سيكتور /dev/sda1 ناجح!' : '[+] Memory dump completed: decrypting sector /dev/sda1 successful!');
            setRevealedFlag(expectedFlag);
            return 0;
          }
          return nextVal;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [statusText, latitude, longitude, altitude]);

  // Handle Jammer Toggle
  const handleJammerToggle = () => {
    if (statusText === 'GROUNDED' || statusText === 'LANDING') return;
    
    if (!isJammingActive) {
      setIsJammingActive(true);
      setIsSpoofingActive(false);
      setStatusText('JAMMED');
      addLog(language === 'ar' ? '[OFFENSIVE] تفعيل وحدة التشويش الكهرومغناطيسي على نطاق 2.4GHz.' : '[OFFENSIVE] RF Jammer active on 2.4GHz. Injecting continuous noise carrier.');
      addLog(language === 'ar' ? '[!] انقطاع التحكم اللاسلكي ومسارات نظام الملاحة GPS.' : '[!] GPS Signal drops below threshold. Drone failsafe triggered: Hovering.');
    } else {
      setIsJammingActive(false);
      setStatusText('AUTO_MISSION');
      setGpsStrength(-65);
      addLog(language === 'ar' ? '[OFFENSIVE] إيقاف التشويش. محاولة إعادة الاتصال ببيانات القياس عن بعد...' : '[OFFENSIVE] Jammer deactivated. Attempting telemetry lock...');
    }
  };

  // Handle Spoofing Toggle
  const handleSpoofingToggle = () => {
    if (statusText === 'GROUNDED' || statusText === 'LANDING') return;

    if (!isSpoofingActive) {
      setIsSpoofingActive(true);
      setIsJammingActive(false);
      setStatusText('SPOOFED_NAV');
      setGpsStrength(-40); // unnaturally strong spoofed signal
      addLog(language === 'ar' ? '[OFFENSIVE] تفعيل جهاز انتحال إحداثيات GPS (SDR Spoofing Simulator).' : '[OFFENSIVE] GPS Spoofing Active. Simulating high-power fake constellation orbit signals.');
      addLog(language === 'ar' ? '[+] السيطرة على نظام القصور الذاتي! إعادة توجيه الطائرة إلى إحداثيات منطقة الاستعادة الأمنية: 24.7136, 46.6753' : '[+] Constellation lock acquired! Forcing UAV navigation trajectory towards secure landing zone: 24.7136, 46.6753');
    } else {
      setIsSpoofingActive(false);
      setStatusText('AUTO_MISSION');
      addLog(language === 'ar' ? '[OFFENSIVE] إلغاء انتحال إشارة GPS. عودة الدرون لمسار المحطة الأرضية.' : '[OFFENSIVE] GPS Spoofing off. Drone switching to original telemetry link.');
    }
  };

  // Handle MavLink Packet Injection
  const handleInjectPacket = () => {
    if (statusText === 'GROUNDED') return;

    addLog(`[INJECT] Sending raw packet: MSG_ID_COMMAND_LONG with cmdId=${selectedMavCmd}`);
    
    if (selectedMavCmd === 'MAV_CMD_NAV_LAND') {
      setStatusText('LANDING');
      setIsJammingActive(false);
      setIsSpoofingActive(false);
      addLog(language === 'ar' ? '[+] استجابة الدرون لحزمة الهبوط المحقونة: البدء في الهبوط الاضطراري الحاد!' : '[+] Drone responded to injected MAV_CMD_NAV_LAND frame: Commencing automatic controlled descent!');
      addLog(language === 'ar' ? '[-] جاري خفض الارتفاع بمعدل ثابت...' : '[-] Decreasing altitude at constant descent rate...');
    } else if (selectedMavCmd === 'MAV_CMD_NAV_TAKEOFF') {
      addLog(language === 'ar' ? '[-] خطأ: أمر الإقلاع مرفوض. الطائرة محلقة بالفعل في الأجواء.' : '[-] Error: MAV_CMD_NAV_TAKEOFF rejected. Drone is already airborne.');
    } else {
      addLog(language === 'ar' ? '[!] تحذير: تم إرسال الأمر ولكن لم يتغير سلوك الملاحة (الحزمة تم تجاهلها).' : '[!] Warning: Frame acknowledged by autopilot but discarded (No action taken).');
    }
  };

  // Submit Flag
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
        setSuccessMsg(language === 'ar' ? 'تهانينا! لقد قمت بحل المعمل بنجاح واقتناص العلم الصحيح (+150 نقطة)' : 'Success! You solved the lab and captured the correct flag (+150 XP)');
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

  // Reset Lab Simulation
  const handleReset = () => {
    setAltitude(85.4);
    setSpeed(14.2);
    setBattery(78);
    setGpsStrength(-65);
    setLatitude(24.8143);
    setLongitude(46.6125);
    setHeading(120);
    setStatusText('AUTO_MISSION');
    setIsJammingActive(false);
    setIsSpoofingActive(false);
    setRevealedFlag(null);
    setSuccessMsg('');
    setErrorMsg('');
    setSubmittedFlag('');
    setTerminalLogs([]);
    addLog(language === 'ar' ? 'إعادة ضبط المحاكاة بالكامل...' : 'Simulated environment reset...');
  };

  // Get status color
  const getStatusColor = () => {
    switch (statusText) {
      case 'AUTO_MISSION': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20';
      case 'JAMMED': return 'text-amber-500 bg-amber-950/40 border-amber-500/20';
      case 'SPOOFED_NAV': return 'text-sky-400 bg-sky-950/40 border-sky-500/20';
      case 'LANDING': return 'text-indigo-400 bg-indigo-950/40 border-indigo-500/20 animate-pulse';
      case 'GROUNDED': return 'text-emerald-400 bg-slate-950 border-emerald-500/40';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`} id="drone-lab-wrapper">
      {/* HUD HEADER */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusText === 'JAMMED' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusText === 'JAMMED' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-xs text-slate-500 font-mono tracking-wider">SECURE LINK EMULATOR v2.4</span>
          </div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>{language === 'ar' ? 'لوحة تحكم الطائرات بدون طيار الحربية' : 'UAV Cyber Tactical Control Unit'}</span>
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إعادة ضبط المحاكاة' : 'Reset Simulator'}</span>
          </button>
        </div>
      </div>

      {/* OBJECTIVE ALERT */}
      <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 flex gap-3.5 items-start">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-400 block">{language === 'ar' ? 'المهمة المطلوبة:' : 'Tactical Directive:'}</span>
          <p className="text-xs text-slate-300">
            {language === 'ar' 
              ? 'تعتمد الطائرة على بروتوكول MavLink غير مشفر. استخدم أدوات التشويش والـ Spoofing وقم بحقن حزمة الهبوط لإنزال الطائرة قسرياً، ثم افتح الصندوق الأسود لاسترداد العلم السري وتسليمه تالياً لإنهاء التحدي!' 
              : 'The target drone transmits over unencrypted MavLink. Utilize electromagnetic interference, GPS spoofing, or inject the correct MAV_CMD_NAV_LAND frame to force ground capture, decode its storage matrix, and extract the flag!'}
          </p>
        </div>
      </div>

      {/* METRIC GAUGES GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ALTITUDE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-950 text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">{language === 'ar' ? 'الارتفاع الحركي' : 'Altitude'}</span>
            <span className="text-md font-extrabold font-mono text-emerald-300">{altitude} m</span>
          </div>
        </div>

        {/* SPEED */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-950 text-emerald-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">{language === 'ar' ? 'السرعة الجوية' : 'Airspeed'}</span>
            <span className="text-md font-extrabold font-mono text-emerald-300">{speed} m/s</span>
          </div>
        </div>

        {/* GPS SIGNAL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-950 text-emerald-400">
            <Signal className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">{language === 'ar' ? 'إشارة الـ GPS' : 'GPS Signal'}</span>
            <span className={`text-md font-extrabold font-mono ${gpsStrength < -100 ? 'text-rose-400' : 'text-emerald-300'}`}>{gpsStrength} dBm</span>
          </div>
        </div>

        {/* BATTERY */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-950 text-emerald-400">
            <Battery className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">{language === 'ar' ? 'طاقة المحرك' : 'Battery'}</span>
            <span className="text-md font-extrabold font-mono text-emerald-300">{battery}%</span>
          </div>
        </div>
      </div>

      {/* CORE CONTROL AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TELEMETRY RADAR & LOGS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'حالة التوجيه ونظام الملاحة GPS الحالي' : 'Active Navigation Vector & Flight HUD'}</span>
            </h3>

            {/* FLIGHT MAP HUD EMULATION */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between p-4 font-mono text-xs">
              {/* Radar Grid Animation */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(16,185,129,0.05)_1px,_transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              {/* Status Header Overlay */}
              <div className="z-10 flex justify-between items-center w-full">
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getStatusColor()}`}>
                  STATUS: {statusText}
                </div>
                <div className="text-[10px] text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  MAVLINK v2.0 SECURE_DISP
                </div>
              </div>

              {/* Coordinates graphic */}
              <div className="z-10 self-center flex flex-col items-center gap-2">
                <div className="relative w-28 h-28 rounded-full border border-slate-800 flex items-center justify-center animate-spin-slow">
                  <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-emerald-500/40 rounded-full animate-ping" />
                  <Compass className="w-8 h-8 text-slate-700" />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-xs font-bold text-slate-300">UAV GEODETIC LOCK</p>
                  <p className="text-[10px] text-slate-500">LAT: {latitude} • LON: {longitude}</p>
                </div>
              </div>

              {/* HUD Bottom overlays */}
              <div className="z-10 flex justify-between items-center w-full text-[10px] text-slate-500">
                <span>HDG: {heading}°</span>
                <span>WP: MAV_CMD_MISSION_RUN</span>
                <span>V_SINK: {statusText === 'LANDING' ? '-4.5m/s' : '0.0m/s'}</span>
              </div>
            </div>

            {/* LIVE CONSOLE LOGS */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'ar' ? 'سجل تواصل الطائرة (Telemetry Frame Logs):' : 'Telemetry Comm Logs:'}
              </span>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 h-40 overflow-y-auto font-mono text-[10px] text-emerald-400 space-y-1">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed hover:bg-slate-900/50 p-0.5 rounded">
                    {log}
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* WARFARE TOOLS & COMMANDS INJECTOR */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'أدوات التشويش والاختراق اللاسلكي' : 'RF & MavLink Hack Tools'}</span>
            </h3>

            {/* JAMMER UNIT */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  {language === 'ar' ? 'وحدة التشويش التكتيكي' : 'RF Jammer Device'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isJammingActive ? 'bg-rose-950 text-rose-400' : 'bg-slate-950 text-slate-500'}`}>
                  {isJammingActive ? (language === 'ar' ? 'نشط' : 'ACTIVE') : (language === 'ar' ? 'معطل' : 'STANDBY')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {language === 'ar' ? 'يقوم بالتشويش على إشارات الراديو والـ GPS مما يعطل الاتصال.' : 'Flood targeted RF channels with random noise to block normal telemetry commands.'}
              </p>
              <button
                onClick={handleJammerToggle}
                className={`w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  isJammingActive 
                    ? 'bg-rose-900/30 border-rose-500 text-rose-300 hover:bg-rose-900/40' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {isJammingActive ? (language === 'ar' ? 'تعطيل التشويش' : 'Disable Jammer') : (language === 'ar' ? 'تفعيل وحدة التشويش RF' : 'Activate RF Jammer')}
              </button>
            </div>

            <hr className="border-slate-800" />

            {/* SPOOFER UNIT */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  {language === 'ar' ? 'منتحل إشارات الـ GPS' : 'GPS Constellation Spoofer'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSpoofingActive ? 'bg-sky-950 text-sky-400' : 'bg-slate-950 text-slate-500'}`}>
                  {isSpoofingActive ? (language === 'ar' ? 'نشط' : 'ACTIVE') : (language === 'ar' ? 'معطل' : 'STANDBY')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {language === 'ar' ? 'يبث إشارات كواكب أقمار صناعية مصطنعة لتضليل أنظمة طيران الذاتي.' : 'Broadcast fake satellite coordinates to deceive inertial navigation controllers.'}
              </p>
              <button
                onClick={handleSpoofingToggle}
                className={`w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  isSpoofingActive 
                    ? 'bg-sky-900/30 border-sky-500 text-sky-300 hover:bg-sky-900/40' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {isSpoofingActive ? (language === 'ar' ? 'تعطيل الـ Spoofing' : 'Disable Spoofing') : (language === 'ar' ? 'تفعيل منتحل GPS' : 'Activate GPS Spoofer')}
              </button>
            </div>

            <hr className="border-slate-800" />

            {/* MAVLINK INJECTOR */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                {language === 'ar' ? 'حقن حزم بيانات MavLink' : 'MavLink Frame Injector'}
              </span>
              <p className="text-[10px] text-slate-400">
                {language === 'ar' ? 'استغل عدم تشفير المافلينك لحقن إطار أمر مباشر للطائرة.' : 'Craft and inject unauthorized MavLink command frames directly into the unencrypted link.'}
              </p>

              <div className="space-y-2">
                <select
                  value={selectedMavCmd}
                  onChange={(e) => setSelectedMavCmd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="MAV_CMD_NAV_WAYPOINT">CMD_ID: 16 (Waypoint Check)</option>
                  <option value="MAV_CMD_NAV_TAKEOFF">CMD_ID: 22 (Air Takeoff)</option>
                  <option value="MAV_CMD_DO_SET_SERVO">CMD_ID: 183 (Toggle Servo)</option>
                  <option value="MAV_CMD_NAV_LAND">CMD_ID: 21 (MAV_CMD_NAV_LAND)</option>
                </select>

                <button
                  onClick={handleInjectPacket}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-slate-950 fill-current" />
                  <span>{language === 'ar' ? 'حقن حزمة الأمر' : 'Inject Command Frame'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DECRYPTED BLACK BOX / REVEALED FLAG */}
      {revealedFlag && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-6 text-center space-y-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-md font-bold text-emerald-400">
              {language === 'ar' ? '[+] تم استخراج مفتاح الصندوق الأسود بنجاح!' : '[+] Flight Data Recorder Flag Recovered!'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' 
                ? 'استخدم هذا العلم لإدخاله في مستودع نقاط المنهج تالياً لإضافة الإنجاز بالكامل لملفك الشخصي:' 
                : 'Submit this flag in the form below to register your tactical achievement points:'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-slate-950 border border-emerald-500/30 rounded px-4 py-2 text-md font-mono text-emerald-300 font-extrabold select-all">
            {revealedFlag}
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
                ? 'تم فك هذا المعمل وحله بنجاح! تم الحصول على النقاط وتوثيق السيطرة على الدرون.' 
                : 'Congratulations! This drone hacking lab is already solved and certified.'}
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
