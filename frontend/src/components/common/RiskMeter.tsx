import { AlertTriangle, ShieldCheck, AlertOctagon, Info } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  riskLevel: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, riskLevel }) => {
  const getRiskColor = (s: number) => {
    if (s <= 20) {
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'glow-emerald',
        badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
        verdict: 'CLEAN / NOMINAL',
        desc: 'No statistically significant bit-plane anomalies or entropy perturbations detected.',
      };
    }
    if (s <= 40) {
      return {
        bg: 'bg-teal-500',
        text: 'text-teal-400',
        border: 'border-teal-500/40',
        glow: 'glow-emerald',
        badgeBg: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
        verdict: 'LOW PROBABILITY',
        desc: 'Trace deviations observed, but consistent with routine sensor or compression noise.',
      };
    }
    if (s <= 60) {
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        glow: 'glow-amber',
        badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
        verdict: 'MODERATE / SUSPICIOUS',
        desc: 'Unusual LSB bit distributions or elevated Shannon entropy detected in one or more channels.',
      };
    }
    if (s <= 80) {
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-400',
        border: 'border-orange-500/40',
        glow: 'glow-amber',
        badgeBg: 'bg-orange-950/60 text-orange-300 border-orange-500/40',
        verdict: 'HIGH PROBABILITY',
        desc: 'Strong Chi-Square PoV equalization and high-entropy signature strongly indicate embedded data.',
      };
    }
    return {
      bg: 'bg-rose-600',
      text: 'text-rose-400',
      border: 'border-rose-500/50',
      glow: 'glow-rose',
      badgeBg: 'bg-rose-950/70 text-rose-300 border-rose-500/50',
      verdict: 'CRITICAL / DETECTED',
      desc: 'Blatant steganographic payload detected: high-entropy bit planes, Chi-Square rejection, or trailing bytes.',
    };
  };

  const getRiskIcon = (s: number) => {
    if (s <= 40) return <ShieldCheck className="h-7 w-7 text-emerald-400" />;
    if (s <= 60) return <AlertTriangle className="h-7 w-7 text-amber-400" />;
    return <AlertOctagon className="h-7 w-7 text-rose-400" />;
  };

  const riskInfo = getRiskColor(score);
  const formattedLevel = riskLevel.replace('_', ' ');

  return (
    <div
      className={`rounded-2xl border ${riskInfo.border} bg-[#07120b]/90 p-5 sm:p-6 ${riskInfo.glow} backdrop-blur-xl shadow-2xl transition-all duration-300`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 font-mono">
              Forensic Steganalysis Risk Score
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className={`text-5xl font-black tracking-tight font-mono ${riskInfo.text}`}>
              {score}
            </span>
            <span className="text-sm font-bold text-slate-500 font-mono">/ 100</span>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="flex items-center gap-2.5">
            {getRiskIcon(score)}
            <span
              className={`rounded-xl border px-3 py-1 text-xs font-extrabold uppercase tracking-wider font-mono shadow-sm ${riskInfo.badgeBg}`}
            >
              {formattedLevel} • {riskInfo.verdict}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Evaluated via Multi-Model Statistical Audit
          </span>
        </div>
      </div>

      {/* Segmented Meter Bar */}
      <div className="mt-5 space-y-2">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ease-out ${riskInfo.bg} rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
          <span className="text-emerald-500 font-bold">0 Clean</span>
          <span className="text-teal-500">25 Low</span>
          <span className="text-amber-500">50 Moderate</span>
          <span className="text-orange-500">75 High</span>
          <span className="text-rose-500 font-bold">100 Critical</span>
        </div>
      </div>

      {/* Forensic Verdict Brief */}
      <div className="mt-4 pt-3.5 border-t border-emerald-950/60 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
        <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>{riskInfo.desc}</span>
      </div>
    </div>
  );
};
