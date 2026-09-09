import React, { useState } from 'react';
import { Copy, Check, Fingerprint } from 'lucide-react';


interface HashDisplayProps {
  sha256: string;
  sha512?: string;
  label?: string;
}

export const HashDisplay: React.FC<HashDisplayProps> = ({
  sha256,
  sha512,
  label = 'Cryptographic Fingerprint',
}) => {
  const [copied256, setCopied256] = useState(false);
  const [copied512, setCopied512] = useState(false);

  const copyToClipboard = (text: string, is512: boolean) => {
    navigator.clipboard.writeText(text);
    if (is512) {
      setCopied512(true);
      setTimeout(() => setCopied512(false), 2000);
    } else {
      setCopied256(true);
      setTimeout(() => setCopied256(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-950/60 bg-[#07120b]/85 p-5 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Fingerprint className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
          IMMUTABLE INTEGRITY
        </span>
      </div>

      {/* SHA-256 */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SHA-256 (32 Bytes / 256 Bits)
          </span>
          <button
            onClick={() => copyToClipboard(sha256, false)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all"
          >
            {copied256 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied256 ? 'Copied to Clipboard' : 'Copy Hash'}</span>
          </button>
        </div>
        <div className="font-mono text-xs text-emerald-300 break-all bg-slate-950/80 p-3 rounded-xl border border-emerald-900/40 shadow-inner select-all">
          {sha256}
        </div>
      </div>

      {/* Optional SHA-512 */}
      {sha512 && (
        <div className="pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              SHA-512 (64 Bytes / 512 Bits)
            </span>
            <button
              onClick={() => copyToClipboard(sha512, true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all"
            >
              {copied512 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied512 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-mono text-[11px] text-slate-400 break-all bg-slate-950/80 p-3 rounded-xl border border-emerald-900/40 shadow-inner select-all max-h-20 overflow-y-auto">
            {sha512}
          </div>
        </div>
      )}

    </div>
  );
};
