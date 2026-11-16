import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Key, FileText, Send, Database, ArrowRight } from 'lucide-react';
import { terminalSound } from '../../utils/terminalSound';

export default function ProjectSimulatorModal({ project, isOpen, onClose }) {
  // --- 1. BANKER'S ALGORITHM STATE ---
  const [bankerStep, setBankerStep] = useState(0); // 0: initial, 1: checking P1, 2: P1 done, 3: P3 done, 4: complete safe, -1: deadlock
  const [isSimulating, setIsSimulating] = useState(false);
  const [bankerLogs, setBankerLogs] = useState([]);
  const [available, setAvailable] = useState([3, 3, 2]);

  // Processes: P0, P1, P2
  const allocation = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2]
  ];
  const maxMatrix = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2]
  ];
  const needMatrix = [
    [7, 4, 3],
    [1, 2, 2],
    [6, 0, 0]
  ];

  // --- 2. SMART ASSIGNMENT JWT STATE ---
  const [jwtRole, setJwtRole] = useState('student');
  const [jwtToken, setJwtToken] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | success
  const [gradeScore, setGradeScore] = useState(94);

  // --- 3. ABHIYAN CONSULTANCY STATE ---
  const [leadStage, setLeadStage] = useState(0); // 0: Inquiry, 1: Counselor, 2: Verification, 3: Confirmed
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      terminalSound.playCommandEnter();
      // Auto-generate JWT for Smart Assignment
      if (project?.id === 1) {
        generateToken('student');
      }
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  // Banker's Algorithm Step Engine
  const runBankersSimulation = (isDeadlockScenario = false) => {
    terminalSound.init();
    setIsSimulating(true);
    setBankerLogs([]);

    if (isDeadlockScenario) {
      setAvailable([0, 0, 0]);
      setBankerStep(1);
      setBankerLogs([
        '⚡ [TEST HAZARD] Injecting zero-resource condition...',
        '▶ P0 Requested Resources: [7, 4, 3] > Available: [0, 0, 0] -> BLOCKED',
        '▶ P1 Requested Resources: [1, 2, 2] > Available: [0, 0, 0] -> BLOCKED',
        '▶ P2 Requested Resources: [6, 0, 0] > Available: [0, 0, 0] -> BLOCKED',
        '❌ DEADLOCK DETECTED! Circular resource wait state confirmed.'
      ]);
      terminalSound.playAccessDeniedBuzzer();
      setBankerStep(-1);
      setIsSimulating(false);
      return;
    }

    // Safe sequence execution: P1 -> P2 -> P0
    setAvailable([3, 3, 2]);
    setBankerStep(1);
    setBankerLogs(['▶ Initial Available Resources: [A:3, B:3, C:2]']);
    terminalSound.playBootBleep(1);

    setTimeout(() => {
      setBankerLogs(prev => [
        ...prev,
        '🔍 Checking P0: Need [7,4,3] <= Available [3,3,2] ? ❌ FALSE (P0 waits)'
      ]);
      setBankerStep(2);
      terminalSound.playKeyClick();
    }, 900);

    setTimeout(() => {
      setBankerLogs(prev => [
        ...prev,
        '🔍 Checking P1: Need [1,2,2] <= Available [3,3,2] ? ✅ TRUE (Allocate & Execute)',
        '🎉 P1 Finished! Released [2,0,0] -> New Available: [5, 3, 2]'
      ]);
      setAvailable([5, 3, 2]);
      setBankerStep(3);
      terminalSound.playBootBleep(2);
    }, 2000);

    setTimeout(() => {
      setBankerLogs(prev => [
        ...prev,
        '🔍 Checking P2: Need [6,0,0] <= Available [5,3,2] ? (Next cycle)',
        '🔍 Checking P0 with New Available [5,3,2]... Still evaluating...',
        '🎉 P2 Finished! Released [3,0,2] -> New Available: [8, 3, 4]',
        '🎉 P0 Finished! Released [0,1,0] -> New Available: [8, 4, 4]'
      ]);
      setAvailable([8, 4, 4]);
      setBankerStep(4);
      terminalSound.playSuccessChime();
      setIsSimulating(false);
    }, 3200);
  };

  // JWT Generator
  const generateToken = (role) => {
    setJwtRole(role);
    terminalSound.init();
    terminalSound.playBootBleep(2);
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      sub: role === 'student' ? 'STU-1817-HIMANSHU' : 'FAC-902-PROF_SHARMA',
      role: role,
      name: role === 'student' ? 'Himanshu Nikam' : 'Faculty Evaluator',
      dept: 'Computer Science & Engineering',
      permissions: role === 'student' 
        ? ['upload_assignment', 'view_my_submissions'] 
        : ['evaluate_submissions', 'assign_grades', 'download_all_zip'],
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    const signature = 'sIGN_' + Math.random().toString(36).substring(2, 15) + 'Qx8';
    setJwtToken(`${header}.${payload}.${signature}`);
  };

  const handleUploadSim = () => {
    terminalSound.init();
    setUploadStatus('uploading');
    terminalSound.playTransmissionBeep();

    setTimeout(() => {
      setUploadStatus('success');
      terminalSound.playSuccessChime();
    }, 1800);
  };

  const advanceFirestoreLead = () => {
    terminalSound.init();
    setIsFirestoreSyncing(true);
    terminalSound.playTransmissionBeep();

    setTimeout(() => {
      setLeadStage(prev => (prev + 1) % 4);
      setIsFirestoreSyncing(false);
      terminalSound.playBootBleep(3);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-10 bg-black/75 backdrop-blur-xl pointer-events-auto select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 25 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl max-h-[92dvh] flex flex-col module-glass !p-0 rounded-2xl border border-nano-cyan/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden bg-slate-950/95 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-nano-cyan/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-nano-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <div>
              <span className="text-[10px] font-mono tracking-widest text-nano-cyan uppercase font-bold">
                [ LIVE RUNTIME SIMULATOR ]
              </span>
              <h3 className="text-lg md:text-xl font-space font-bold text-white tracking-tight">
                {project.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors border border-white/10"
              title="Close Simulator"
              data-hoverable="true"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6">

          {/* ========================================================= */}
          {/* SIMULATOR 1: BANKER'S ALGORITHM DEADLOCK AVOIDANCE */}
          {/* ========================================================= */}
          {project.id === 2 && (
            <div className="flex flex-col gap-6">
              {/* Top Controls & Explanation */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div>
                  <h4 className="text-sm font-space font-bold text-nano-cyan uppercase tracking-wider mb-1">
                    Operating System Resource Allocation State
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    3 Processes (P0, P1, P2) · 3 Resource Types (A, B, C)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => runBankersSimulation(false)}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nano-cyan text-slate-950 font-mono text-xs font-bold hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50"
                    data-hoverable="true"
                  >
                    <Play size={14} /> Run Safe Algorithm
                  </button>
                  <button
                    onClick={() => runBankersSimulation(true)}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-xs font-semibold hover:bg-rose-500/30 transition-all disabled:opacity-50"
                    data-hoverable="true"
                  >
                    <AlertTriangle size={14} /> Test Deadlock
                  </button>
                  <button
                    onClick={() => {
                      setBankerStep(0);
                      setBankerLogs([]);
                      setAvailable([3, 3, 2]);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
                    title="Reset Simulator"
                    data-hoverable="true"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Matrix Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Allocation Matrix */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 font-mono text-xs">
                  <div className="text-nano-cyan font-bold mb-3 flex items-center justify-between">
                    <span>[ ALLOCATION MATRIX ]</span>
                    <span className="text-[10px] text-slate-500">A B C</span>
                  </div>
                  {allocation.map((row, i) => (
                    <div key={i} className={`flex justify-between py-1.5 px-2 rounded mb-1 transition-colors ${bankerStep === 3 && i === 1 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-white/[0.02]'}`}>
                      <span className="text-slate-400">P{i}</span>
                      <span className="tracking-widest font-bold">{row.join('  ')}</span>
                    </div>
                  ))}
                </div>

                {/* Max Matrix */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 font-mono text-xs">
                  <div className="text-nano-purple font-bold mb-3 flex items-center justify-between">
                    <span>[ MAX CLAIM MATRIX ]</span>
                    <span className="text-[10px] text-slate-500">A B C</span>
                  </div>
                  {maxMatrix.map((row, i) => (
                    <div key={i} className="flex justify-between py-1.5 px-2 rounded mb-1 bg-white/[0.02]">
                      <span className="text-slate-400">P{i}</span>
                      <span className="tracking-widest font-bold">{row.join('  ')}</span>
                    </div>
                  ))}
                </div>

                {/* Need Matrix */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 font-mono text-xs">
                  <div className="text-amber-400 font-bold mb-3 flex items-center justify-between">
                    <span>[ NEED (MAX - ALLOC) ]</span>
                    <span className="text-[10px] text-slate-500">A B C</span>
                  </div>
                  {needMatrix.map((row, i) => (
                    <div key={i} className={`flex justify-between py-1.5 px-2 rounded mb-1 transition-colors ${bankerStep === 2 && i === 0 ? 'bg-amber-500/20 text-amber-300' : bankerStep === 3 && i === 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.02]'}`}>
                      <span className="text-slate-400">P{i}</span>
                      <span className="tracking-widest font-bold">{row.join('  ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Available Status & Execution Terminal */}
              <div className="p-4 rounded-xl bg-black/60 border border-nano-cyan/30 flex flex-col gap-3 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">CURRENT AVAILABLE:</span>
                    <span className="px-2 py-0.5 rounded bg-nano-cyan/20 text-nano-cyan font-bold tracking-widest text-sm">
                      A: {available[0]} | B: {available[1]} | C: {available[2]}
                    </span>
                  </div>
                  {bankerStep === 4 && (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold animate-pulse">
                      <CheckCircle2 size={16} />
                      <span>SAFE SEQUENCE: &lt; P1 ➔ P2 ➔ P0 &gt;</span>
                    </div>
                  )}
                  {bankerStep === -1 && (
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold animate-pulse">
                      <AlertTriangle size={16} />
                      <span>UNSAFE STATE: DEADLOCK HAZARD</span>
                    </div>
                  )}
                </div>

                {/* Console Step Logs */}
                <div className="min-h-[110px] max-h-[140px] overflow-y-auto space-y-1 text-slate-300 custom-scrollbar pr-1">
                  {bankerLogs.length === 0 ? (
                    <span className="text-slate-500 italic">Click "Run Safe Algorithm" to observe dynamic state transitions...</span>
                  ) : (
                    bankerLogs.map((log, idx) => (
                      <div key={idx} className={`leading-relaxed ${log.includes('✅') || log.includes('SAFE') ? 'text-emerald-400 font-bold' : log.includes('❌') ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SIMULATOR 2: SMART ASSIGNMENT SYSTEM (JWT & UPLOADER) */}
          {/* ========================================================= */}
          {project.id === 1 && (
            <div className="flex flex-col gap-6">
              {/* Role Selection & Key Generation */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-space font-bold text-nano-cyan uppercase tracking-wider mb-1">
                    Role-Based Access Control & JWT Cryptography
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Simulate authenticated student submissions vs teacher grading portal
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => generateToken('student')}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${jwtRole === 'student' ? 'bg-nano-cyan text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    data-hoverable="true"
                  >
                    👤 Student Mode
                  </button>
                  <button
                    onClick={() => generateToken('faculty')}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${jwtRole === 'faculty' ? 'bg-nano-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    data-hoverable="true"
                  >
                    🎓 Faculty Evaluator Mode
                  </button>
                </div>
              </div>

              {/* JWT Token Visualizer */}
              <div className="p-4 rounded-xl bg-black/60 border border-nano-cyan/30 font-mono text-xs flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5 text-nano-cyan font-bold">
                    <Key size={14} />
                    <span>SIGNED BEARER TOKEN (HMAC-SHA256)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">VALID 3600s</span>
                </div>

                {/* Token string preview */}
                <div className="p-2.5 rounded bg-slate-950 border border-white/10 break-all text-[10px] text-slate-300 font-mono">
                  <span className="text-rose-400 font-bold">{jwtToken.split('.')[0]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-nano-purple font-bold">{jwtToken.split('.')[1]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-nano-cyan font-bold">{jwtToken.split('.')[2]}</span>
                </div>

                {/* Decoded Claims Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-[11px]">
                  <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-slate-500 block mb-1">DECODED IDENTITY:</span>
                    <p className="font-bold text-white">Himanshu Nikam ({jwtRole.toUpperCase()})</p>
                    <p className="text-[10px] text-slate-400">CMR Institute of Technology · CSE</p>
                  </div>
                  <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-slate-500 block mb-1">ACTIVE PERMISSIONS:</span>
                    <p className="text-nano-cyan font-bold">
                      {jwtRole === 'student' ? 'upload_pdf, view_my_scores' : 'grade_all, download_zip, publish_results'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Playground based on Role */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-white/10 font-mono text-xs">
                {jwtRole === 'student' ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold font-space text-white">Submit Lab Assignment: CSE-302 OS Algorithms</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">DUE: TODAY 23:59</span>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-dashed border-nano-cyan/40 bg-nano-cyan/5 flex flex-col items-center justify-center gap-2 text-center">
                      <FileText size={28} className="text-nano-cyan" />
                      <span className="font-bold text-white">Bankers_Algo_Implementation_Nikam.pdf</span>
                      <span className="text-[10px] text-slate-400">PDF Document · 2.4 MB · Verified SHA-256 Checksum</span>
                    </div>

                    <button
                      onClick={handleUploadSim}
                      disabled={uploadStatus === 'uploading'}
                      className="w-full py-2.5 rounded-lg bg-nano-cyan text-slate-950 font-bold hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      data-hoverable="true"
                    >
                      {uploadStatus === 'uploading' ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>ENCRYPTING & UPLOADING TO REST API...</span>
                        </>
                      ) : uploadStatus === 'success' ? (
                        <>
                          <CheckCircle2 size={16} className="text-emerald-900" />
                          <span>UPLOAD SUCCESSFUL [HTTP 201 CREATED]</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>TRANSMIT ASSIGNMENT PAYLOAD</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold font-space text-white">Faculty Grading Console: 42 Submissions Received</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-nano-purple/20 text-nano-purple font-bold">BATCH: CSE 2026</span>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Student: Himanshu Nikam (#1817)</p>
                        <p className="text-[10px] text-slate-400">Bankers_Algo_Implementation.pdf</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">SCORE:</span>
                        <input
                          type="number"
                          value={gradeScore}
                          onChange={(e) => setGradeScore(e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-slate-800 text-nano-cyan font-bold text-center border border-white/20 outline-none"
                        />
                        <span className="text-xs text-emerald-400 font-bold">/ 100 (A+)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        terminalSound.init();
                        terminalSound.playSuccessChime();
                        alert('Evaluation recorded into MongoDB cluster!');
                      }}
                      className="w-full py-2.5 rounded-lg bg-nano-purple text-white font-bold hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
                      data-hoverable="true"
                    >
                      <ShieldCheck size={16} />
                      <span>SIGN & PUBLISH EVALUATION RESULT</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SIMULATOR 3: ABHIYAN CONSULTANCY (FIREBASE CRM ENGINE) */}
          {/* ========================================================= */}
          {project.id === 3 && (
            <div className="flex flex-col gap-6">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-space font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Firebase Cloud Firestore Real-Time Lead Pipeline
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Live document state tracking for student consultation & admission lifecycle
                  </p>
                </div>

                <button
                  onClick={advanceFirestoreLead}
                  disabled={isFirestoreSyncing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
                  data-hoverable="true"
                >
                  <ArrowRight size={14} />
                  <span>Advance Pipeline Stage</span>
                </button>
              </div>

              {/* 4 Pipeline Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                {[
                  { step: 0, title: '1. Lead Captured', desc: 'Inquiry registered' },
                  { step: 1, title: '2. Counselor Assigned', desc: 'Expert allocated' },
                  { step: 2, title: '3. Doc Verification', desc: '10th/12th verified' },
                  { step: 3, title: '4. Seat Allocated', desc: 'Admission locked' }
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`p-3.5 rounded-xl border transition-all ${
                      leadStage === s.step 
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : leadStage > s.step 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                          : 'bg-white/[0.02] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="font-bold mb-1">{s.title}</div>
                    <div className="text-[10px] opacity-80">{s.desc}</div>
                  </div>
                ))}
              </div>

              {/* Firestore Document Live Snapshot */}
              <div className="p-4 rounded-xl bg-black/70 border border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Database size={14} />
                    <span>SNAPSHOT: /admissions_2026/lead_NX9882</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">
                    {isFirestoreSyncing ? '⚡ SYNCING FIRESTORE...' : '🟢 REALTIME LISTENER ACTIVE'}
                  </span>
                </div>

                <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`{
  "studentName": "Aarav Sharma",
  "targetCourse": "B.Tech Computer Science (AI/ML)",
  "contact": "+91 98765 43210",
  "pipelineStage": "${['LEAD_INQUIRY', 'COUNSELOR_MATCHED', 'DOCUMENT_VERIFIED', 'ADMISSION_CONFIRMED'][leadStage]}",
  "counselorAssigned": "Senior Admissions Advisor (Bengaluru)",
  "syncTimestamp": "${new Date().toISOString()}",
  "status": "${leadStage === 3 ? 'SUCCESSFULLY_ENROLLED' : 'IN_PROGRESS'}"
}`}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Web Environment</span>
          </span>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-nano-cyan hover:underline font-bold flex items-center gap-1"
          >
            Inspect GitHub Source &rarr;
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
