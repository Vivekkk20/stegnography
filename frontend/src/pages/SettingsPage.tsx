import { useState, useEffect } from 'react';
import { Shield, BookOpen, Check } from 'lucide-react';
import { useEducational } from '../context/EducationalContext';
import { api } from '../services/api';


export const SettingsPage: React.FC = () => {
  const { isEduMode, toggleEduMode } = useEducational();
  const [health, setHealth] = useState<any>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => {});
  }, []);

  const handleToggle = () => {
    toggleEduMode();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Educational Mode Settings */}
      <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Educational Cyber Mode</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Renders contextual theoretical cards, cryptographic explainers, and steganalysis telemetry across all modules.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
              isEduMode ? 'bg-emerald-500 glow-emerald' : 'bg-slate-800'
            }`}
            role="switch"
            aria-checked={isEduMode}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-slate-950 transition-transform ${
                isEduMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <Check className="h-4 w-4" />
            <span>Preferences updated successfully</span>
          </div>
        )}
      </div>

      {/* Cryptographic Security Baseline */}
      <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-emerald-950/60 pb-4">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Cryptographic Engine Baseline Parameters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict parameters enforced across all steganographic containers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Encryption Standard</span>
            <p className="text-white font-bold text-sm">AES-256-GCM (Authenticated)</p>
            <p className="text-[11px] text-slate-400 font-sans">
              128-bit authentication tag with zero unauthenticated payload leakage.
            </p>
          </div>

          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Key Derivation</span>
            <p className="text-white font-bold text-sm">PBKDF2-HMAC-SHA256</p>
            <p className="text-[11px] text-slate-400 font-sans">
              {health?.security?.pbkdf2_iterations?.toLocaleString() || '600,000'} iterations with 16-byte random salt.
            </p>
          </div>

          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Integrity Verification</span>
            <p className="text-white font-bold text-sm">Header CRC32 + Payload SHA-256</p>
            <p className="text-[11px] text-slate-400 font-sans">
              Dual-layer cryptographic rejection ensures tamper detection.
            </p>
          </div>

          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">File Ingestion Boundary</span>
            <p className="text-white font-bold text-sm">20 MB Maximum Ceiling</p>
            <p className="text-[11px] text-slate-400 font-sans">
              Magic byte validation rejects polyglots & corrupted files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
