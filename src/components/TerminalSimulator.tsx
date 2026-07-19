import React, { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, HelpCircle, CheckCircle, ArrowLeft, Trophy } from 'lucide-react';
import { TerminalLog } from '../types';

interface TerminalSimulatorProps {
  labId: string;
  points: number;
  expectedFlag: string;
  onSuccess: () => void;
  isSolved: boolean;
  objective?: string;
}

export default function TerminalSimulator({
  labId,
  points,
  expectedFlag,
  onSuccess,
  isSolved,
  objective,
}: TerminalSimulatorProps) {
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toISOString(),
      command: '',
      output: 'Initializing Cyber Sandbox Terminal v3.4.1-secure...\nConnected to virtual container: vhost-192-168-1-50.\nType "help" to list available secure tools.\n---------------------------------------------------------',
      type: 'output',
    },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFlag, setSubmittedFlag] = useState('');
  const [flagMessage, setFlagMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Focus terminal input
  const focusTerminal = () => {
    terminalInputRef.current?.focus();
  };

  useEffect(() => {
    focusTerminal();
  }, [labId]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    // Add input log
    const inputLog: TerminalLog = {
      id: `in-${Date.now()}`,
      timestamp: new Date().toISOString(),
      command: cmd,
      output: '',
      type: 'input',
    };

    setLogs((prev) => [...prev, inputLog]);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/labs/${labId}/terminal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await response.json();

      if (data.output === 'CLEAR_SCREEN') {
        setLogs([]);
      } else {
        const outputLog: TerminalLog = {
          id: `out-${Date.now()}`,
          timestamp: new Date().toISOString(),
          command: '',
          output: data.output,
          type: data.status || 'output',
        };
        setLogs((prev) => [...prev, outputLog]);

        if (data.status === 'success' && data.output.includes(expectedFlag)) {
          // If the output exposes the flag, pre-fill it for the user
          setSubmittedFlag(expectedFlag);
        }
      }
    } catch (err) {
      const errorLog: TerminalLog = {
        id: `err-${Date.now()}`,
        timestamp: new Date().toISOString(),
        command: '',
        output: 'Error: Connection to container lost or command timeout.',
        type: 'error',
      };
      setLogs((prev) => [...prev, errorLog]);
    } finally {
      setIsLoading(false);
      // Keep terminal focused
      setTimeout(focusTerminal, 50);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedFlag.trim()) return;

    setFlagMessage(null);
    try {
      const response = await fetch('/api/labs/submit-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId, flag: submittedFlag }),
      });
      const data = await response.json();

      if (data.success) {
        setFlagMessage({ text: `Congratulations! The flag is correct and ${points} XP has been successfully added to your balance! 🎉`, isError: false });
        onSuccess();
      } else {
        setFlagMessage({ text: data.error, isError: true });
      }
    } catch (err) {
      setFlagMessage({ text: 'An error occurred while verifying the flag, please try again later.', isError: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  };

  const resetTerminal = () => {
    setLogs([
      {
        id: `reset-${Date.now()}`,
        timestamp: new Date().toISOString(),
        command: '',
        output: 'Resetting secure sandbox... Connected to clean virtual terminal. Write "help" for a list of tools.',
        type: 'output',
      },
    ]);
    setSubmittedFlag('');
    setFlagMessage(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden font-mono text-sm leading-relaxed text-emerald-400" id="terminal-wrapper">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-400">Secure Sandbox Terminal</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetTerminal}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Restart Container"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restart</span>
          </button>
          <span className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 text-emerald-400">
            <span>● Connected</span>
          </span>
        </div>
      </div>

      {/* Logs Window */}
      <div
        onClick={focusTerminal}
        className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px] max-h-[500px] cursor-text bg-slate-950/90 selection:bg-emerald-800/50"
      >
        {logs.map((log) => (
          <div key={log.id} className="whitespace-pre-wrap">
            {log.type === 'input' ? (
              <div className="flex items-start text-slate-300">
                <span className="text-emerald-500 font-bold mr-2">student@cyberacademy:~$</span>
                <span>{log.command}</span>
              </div>
            ) : (
              <div
                className={`pl-1 ${
                  log.type === 'error'
                    ? 'text-rose-400 font-medium'
                    : log.type === 'success'
                    ? 'text-emerald-300 font-bold terminal-glow'
                    : 'text-emerald-400'
                }`}
              >
                {log.output}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-slate-500 animate-pulse flex items-center space-x-2">
            <span>Processing command inside virtual container...</span>
          </div>
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Terminal Input Form */}
      <form onSubmit={handleCommandSubmit} className="flex items-center px-4 py-2 bg-slate-900 border-t border-slate-800">
        <span className="text-emerald-500 font-bold mr-2 shrink-0">student@cyberacademy:~$</span>
        <input
          ref={terminalInputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-slate-100 placeholder-slate-700 font-mono"
          placeholder="Type commands here... (type 'help' to start)"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>

      {/* Flag Submission Area */}
      <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-4">
        {/* Clear Question & Objective Card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3 text-left">
          <div className="flex items-center gap-2 text-emerald-400">
            <Trophy className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Capture The Flag (CTF) Challenge: Objective & Mission</span>
          </div>
          
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 block">Target Objective:</span>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              {objective || "Find the hidden flag file inside system directories and view its content."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-[11px] text-slate-400 text-left">
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-extrabold shrink-0">1. How to solve:</span>
              <span>Execute available technical commands (such as <code className="font-mono bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10">ls</code> and <code className="font-mono bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10">cat</code>) in the command line above to explore directories and read files.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-extrabold shrink-0">2. Expected Result:</span>
              <span>Find the flag string matching the format <code className="font-mono bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10">FLAG{"{"}...{"}"}</code> then enter it in the input below to verify and claim your points!</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1">
          <div className="space-y-1 text-left">
            <h5 className="text-xs font-extrabold text-slate-300">Submit Flag & Claim Points</h5>
            <p className="text-[11px] text-slate-400">
              Enter your captured flag below to confirm mission success and add <strong className="text-emerald-400 font-mono text-xs">{points} XP</strong> to your profile.
            </p>
          </div>

          {isSolved ? (
            <div className="flex items-center space-x-2 bg-emerald-950/50 border border-emerald-500/30 px-4 py-2.5 rounded-lg text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-950/10">
              <CheckCircle className="w-5 h-5 text-emerald-400 stroke-[3]" />
              <span>Lab completed and flag captured successfully! 🏆 (+{points} XP)</span>
            </div>
          ) : (
            <form onSubmit={handleFlagSubmit} className="flex items-stretch gap-2 shrink-0">
              <input
                type="text"
                value={submittedFlag}
                onChange={(e) => setSubmittedFlag(e.target.value)}
                placeholder="FLAG{...}"
                className="bg-slate-950 border border-slate-700 hover:border-slate-500 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono w-52 text-center placeholder-slate-800 transition-colors"
                autoComplete="off"
                required
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-extrabold px-4 py-1.5 rounded transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Verify Flag
              </button>
            </form>
          )}
        </div>

        {flagMessage && (
          <div
            className={`mt-2 text-xs p-2.5 rounded-lg text-center font-bold transition-all ${
              flagMessage.isError
                ? 'bg-rose-950/50 border border-rose-500/30 text-rose-400 animate-pulse'
                : 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {flagMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
