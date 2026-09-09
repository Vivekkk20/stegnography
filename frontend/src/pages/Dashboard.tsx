import { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  ScanEye,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { EduCard } from '../components/common/EduCard';
import { api } from '../services/api';
import type { ReportSummary } from '../types';

interface DashboardProps {
  onNavigate: (tab: string, reportId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [recentReports, setRecentReports] = useState<ReportSummary[]>([]);
  const [health, setHealth] = useState<any>(null);

  // Interactive Steganography Simulator state
  const simPixel = { r: 182, g: 74, b: 221 };
  const [simSecretBits, setSimSecretBits] = useState({ rLsb: 1, gLsb: 0, bLsb: 1 });


  useEffect(() => {
    api.listReports().then((res) => setRecentReports(res.slice(0, 5))).catch(() => {});
    api.getHealth().then(setHealth).catch(() => {});
  }, []);

  const getRiskBadge = (score: number, level: string) => {
    let color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score > 60) color = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    else if (score > 40) color = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    else if (score > 20) color = 'bg-teal-500/10 text-teal-400 border-teal-500/30';

    return (
      <span
        className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono ${color}`}
      >
        {score} / 100 • {level.replace('_', ' ')}
      </span>
    );
  };

  // Convert number to 8-bit binary string
  const toBinary = (n: number) => n.toString(2).padStart(8, '0');

  // Calculate modified pixel color based on toggled LSB
  const modifiedPixel = {
    r: (simPixel.r & ~1) | simSecretBits.rLsb,
    g: (simPixel.g & ~1) | simSecretBits.gLsb,
    b: (simPixel.b & ~1) | simSecretBits.bLsb,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Matrix Command Center Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-[#06140c] via-[#040a06] to-[#020503] p-6 sm:p-10 shadow-2xl">
        {/* Background decorative grid & glow */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold text-emerald-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cryptographic Data Hiding & Forensic Steganalysis Platform</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Steganography <span className="text-gradient-emerald">Command Center</span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-slate-300">
            StegoVault executes authenticated, losslessly embedded steganography paired with multi-layer forensic detection: Shannon entropy, Chi-Square Pair-of-Values attacks, LSB plane distributions, trailing payload audits, and risk scoring.
          </p>

          {/* Quick Stats telemetry row */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="rounded-xl border border-emerald-900/40 bg-slate-950/80 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Cipher Standard</span>
              <span className="font-bold text-white mt-1 block">AES-256-GCM</span>
              <span className="text-[10px] text-emerald-400">128-bit Auth Tag</span>
            </div>

            <div className="rounded-xl border border-emerald-900/40 bg-slate-950/80 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Key Derivation</span>
              <span className="font-bold text-white mt-1 block">PBKDF2-HMAC</span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {health?.security?.pbkdf2_iterations?.toLocaleString() || '600,000'} Iterations
              </span>
            </div>

            <div className="rounded-xl border border-emerald-900/40 bg-slate-950/80 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Carrier Formats</span>
              <span className="font-bold text-white mt-1 block">PNG & BMP</span>
              <span className="text-[10px] text-slate-400">Lossless 24-bit RGB</span>
            </div>

            <div className="rounded-xl border border-emerald-900/40 bg-slate-950/80 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Steganalysis</span>
              <span className="font-bold text-white mt-1 block">Multi-Layer χ²</span>
              <span className="text-[10px] text-emerald-400">Entropy + PoV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive LSB Steganography Simulator Widget */}
      <div className="rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-[#06140c]/90 via-[#040d08]/80 to-[#020603]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Interactive Steganography Simulator</span>
                <span className="text-[10px] uppercase font-bold font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Visual Lab
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any Least Significant Bit (LSB) below to see how hidden data alters binary bits while remaining imperceptible to the human eye.
              </p>
            </div>
          </div>
        </div>


        {/* Interactive Bit-Flipping Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Channel Bits Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            {/* Red Channel */}
            <div className="p-3.5 rounded-2xl border border-rose-500/20 bg-rose-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-16 font-mono text-xs font-bold text-rose-400">RED (R)</span>
                <span className="font-mono text-xs text-slate-300 tracking-widest bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  {toBinary(simPixel.r).slice(0, 7)}
                  <button
                    onClick={() =>
                      setSimSecretBits((prev) => ({ ...prev, rLsb: prev.rLsb === 1 ? 0 : 1 }))
                    }
                    className={`ml-0.5 px-1.5 py-0.5 rounded font-black text-xs transition-all ${
                      simSecretBits.rLsb === 1
                        ? 'bg-rose-500 text-slate-950 glow-rose scale-110'
                        : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                    }`}
                    title="Click to flip Red LSB"
                  >
                    [{simSecretBits.rLsb}]
                  </button>
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Original: <strong className="text-white">{simPixel.r}</strong> → Embedded:{' '}
                <strong className="text-rose-400">{modifiedPixel.r}</strong>
              </span>
            </div>

            {/* Green Channel */}
            <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-16 font-mono text-xs font-bold text-emerald-400">GREEN (G)</span>
                <span className="font-mono text-xs text-slate-300 tracking-widest bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  {toBinary(simPixel.g).slice(0, 7)}
                  <button
                    onClick={() =>
                      setSimSecretBits((prev) => ({ ...prev, gLsb: prev.gLsb === 1 ? 0 : 1 }))
                    }
                    className={`ml-0.5 px-1.5 py-0.5 rounded font-black text-xs transition-all ${
                      simSecretBits.gLsb === 1
                        ? 'bg-emerald-500 text-slate-950 glow-emerald scale-110'
                        : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                    }`}
                    title="Click to flip Green LSB"
                  >
                    [{simSecretBits.gLsb}]
                  </button>
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Original: <strong className="text-white">{simPixel.g}</strong> → Embedded:{' '}
                <strong className="text-emerald-400">{modifiedPixel.g}</strong>
              </span>
            </div>

            {/* Blue Channel */}
            <div className="p-3.5 rounded-2xl border border-teal-500/20 bg-teal-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-16 font-mono text-xs font-bold text-teal-400">BLUE (B)</span>
                <span className="font-mono text-xs text-slate-300 tracking-widest bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  {toBinary(simPixel.b).slice(0, 7)}
                  <button
                    onClick={() =>
                      setSimSecretBits((prev) => ({ ...prev, bLsb: prev.bLsb === 1 ? 0 : 1 }))
                    }
                    className={`ml-0.5 px-1.5 py-0.5 rounded font-black text-xs transition-all ${
                      simSecretBits.bLsb === 1
                        ? 'bg-emerald-500 text-slate-950 glow-emerald scale-110'
                        : 'bg-slate-800 text-teal-300 hover:bg-slate-700'
                    }`}
                    title="Click to flip Blue LSB"
                  >
                    [{simSecretBits.bLsb}]
                  </button>
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Original: <strong className="text-white">{simPixel.b}</strong> → Embedded:{' '}
                <strong className="text-teal-400">{modifiedPixel.b}</strong>
              </span>
            </div>
          </div>

          {/* Visual Swatch Comparison */}
          <div className="rounded-2xl border border-emerald-900/30 bg-slate-950/80 p-5 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
            <div className="flex items-center gap-4">
              {/* Original Swatch */}
              <div className="text-center">
                <div
                  className="h-16 w-16 rounded-2xl shadow-lg border border-slate-700"
                  style={{ backgroundColor: `rgb(${simPixel.r}, ${simPixel.g}, ${simPixel.b})` }}
                />
                <span className="text-[10px] font-mono text-slate-400 mt-1.5 block">Original</span>
              </div>

              <span className="text-slate-500 font-bold text-xs">VS</span>

              {/* Stego Modified Swatch */}
              <div className="text-center">
                <div
                  className="h-16 w-16 rounded-2xl shadow-lg border border-emerald-500/50"
                  style={{
                    backgroundColor: `rgb(${modifiedPixel.r}, ${modifiedPixel.g}, ${modifiedPixel.b})`,
                  }}
                />
                <span className="text-[10px] font-mono text-emerald-400 mt-1.5 block font-bold">
                  With Stego LSB
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <span className="font-bold text-emerald-400 block font-mono text-[11px]">
                ΔE ≈ 0.2 (Imperceptible)
              </span>
              <p className="text-[11px] leading-tight text-slate-500">
                Human retinas cannot detect a 1-bit difference, but statistical Chi-Square & entropy tests mathematically expose it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Banner */}
      <EduCard
        title="What is Steganography vs. Cryptography?"
        category="Foundational Concepts"
        takeaway="Cryptography conceals the meaning of a secret message; steganography conceals the very existence of the communication. Combining both yields true plausible deniability."
      >
        <p>
          While an encrypted file flags suspicion to network defenders, embedding the ciphertext into the least-significant bits of a routine PNG or BMP image hides both the message contents and the transmission event. StegoVault couples AES-256-GCM with statistical steganalysis engines to rigorously test both data hiding and forensic detection.
        </p>
      </EduCard>

      {/* Core Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Encode */}
        <div
          onClick={() => onNavigate('encode')}
          className="group cursor-pointer rounded-2xl border border-emerald-950/80 bg-[#07120b]/80 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#0c1e13] hover:shadow-2xl hover:glow-emerald hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-base font-bold text-white flex items-center justify-between">
            <span>Encode & Hide</span>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Encrypt plaintext messages with authenticated AES-256-GCM and embed into image LSB bit planes with zero visual distortion.
          </p>
          <div className="mt-4 pt-3 border-t border-emerald-950/80 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <span>Launch Wizard →</span>
          </div>
        </div>

        {/* Decode */}
        <div
          onClick={() => onNavigate('decode')}
          className="group cursor-pointer rounded-2xl border border-emerald-950/80 bg-[#07120b]/80 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#0c1e13] hover:shadow-2xl hover:glow-emerald hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
            <Unlock className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-base font-bold text-white flex items-center justify-between">
            <span>Decode & Decrypt</span>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Extract StegoVault containers from lossless files, verify cryptographic checksums, and decrypt authenticated plaintext.
          </p>
          <div className="mt-4 pt-3 border-t border-emerald-950/80 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <span>Extract Payload →</span>
          </div>
        </div>

        {/* Analyzer */}
        <div
          onClick={() => onNavigate('analyzer')}
          className="group cursor-pointer rounded-2xl border border-emerald-950/80 bg-[#07120b]/80 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#0c1e13] hover:shadow-2xl hover:glow-emerald hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
            <ScanEye className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-base font-bold text-white flex items-center justify-between">
            <span>Forensic Steganalysis</span>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Audit suspicious images using Shannon entropy, Chi-Square PoV tests, trailing byte detection, and risk scoring.
          </p>
          <div className="mt-4 pt-3 border-t border-emerald-950/80 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <span>Enter Forensic Lab →</span>
          </div>
        </div>
      </div>


      {/* Security Architecture Specs */}
      <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Security Architecture & Cryptographic Parameters</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-[#030a05]/90 p-3.5 rounded-2xl border border-emerald-950/40">
            <span className="text-slate-500 text-[10px] uppercase">Cipher Primitive</span>
            <p className="font-bold text-white mt-1">AES-256-GCM</p>
            <span className="text-[10px] text-emerald-400 font-sans">128-bit Auth Tag</span>
          </div>
          <div className="bg-[#030a05]/90 p-3.5 rounded-2xl border border-emerald-950/40">
            <span className="text-slate-500 text-[10px] uppercase">Key Derivation</span>
            <p className="font-bold text-white mt-1">PBKDF2-HMAC-SHA256</p>
            <span className="text-[10px] text-emerald-400 font-sans">
              {health?.security?.pbkdf2_iterations?.toLocaleString() || '600,000'} Iterations
            </span>
          </div>
          <div className="bg-[#030a05]/90 p-3.5 rounded-2xl border border-emerald-950/40">
            <span className="text-slate-500 text-[10px] uppercase">Integrity Hashes</span>
            <p className="font-bold text-white mt-1">SHA-256 & SHA-512</p>
            <span className="text-[10px] text-slate-400 font-sans">Header CRC32 Check</span>
          </div>
          <div className="bg-[#030a05]/90 p-3.5 rounded-2xl border border-emerald-950/40">
            <span className="text-slate-500 text-[10px] uppercase">Steganography Spec</span>
            <p className="font-bold text-white mt-1">Lossless RGB LSB</p>
            <span className="text-[10px] text-slate-400 font-sans">PNG & BMP formats</span>
          </div>
        </div>
      </div>

      {/* Recent Analysis Reports */}
      {recentReports.length > 0 && (
        <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Recent Forensic Casefiles</span>
            </h3>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors font-mono"
            >
              <span>View All Casefiles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>


          <div className="divide-y divide-slate-800/60">
            {recentReports.map((rep: ReportSummary) => (
              <div
                key={rep.analysis_id}
                onClick={() => onNavigate('reports', rep.analysis_id)}
                className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-emerald-950/30 px-3 rounded-xl transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                    {rep.filename}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {new Date(rep.timestamp).toLocaleString()} • {rep.file_size_kb} KB ({rep.format})
                  </p>
                </div>
                <div>{getRiskBadge(rep.risk_score, rep.risk_level)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
