import React from 'react';
import { ShieldAlert, AlertTriangle, Info, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { TechnicalFinding } from '../../types';

interface FindingsListProps {
  findings: TechnicalFinding[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 glow-rose',
          icon: <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />,
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/15 text-orange-400 border-orange-500/40 glow-amber',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
        };
      case 'LOW':
        return {
          bg: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
          icon: <Info className="h-3.5 w-3.5 text-teal-400" />,
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <Info className="h-3.5 w-3.5 text-slate-400" />,
        };
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-950/60 bg-[#07120b]/85 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Forensic Technical Findings ({findings.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Heuristic anomaly detection across Shannon entropy, PoV, and container checks
            </p>
          </div>
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-950/80 p-5 border border-slate-800 text-xs text-slate-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>
            No anomalous statistical patterns or trailing structures detected. The image exhibits natural sensor noise characteristics.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {findings.map((finding, idx) => {
            const badge = getSeverityBadge(finding.severity);
            return (
              <div
                key={idx}
                className="rounded-2xl border border-emerald-950/40 bg-[#030a05]/90 p-4 sm:p-5 transition-all hover:border-emerald-500/30 shadow-sm space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase font-mono tracking-wider ${badge.bg}`}
                    >
                      {badge.icon}
                      {finding.severity}
                    </span>
                    <h4 className="text-sm font-bold text-white">{finding.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {finding.category}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-300">
                  {finding.description}
                </p>

                {finding.evidence && (
                  <div className="rounded-xl bg-[#020503] px-3.5 py-2.5 border border-emerald-950/50 font-mono text-xs text-emerald-300 break-all shadow-inner">
                    <span className="text-slate-500 font-sans font-semibold text-[10px] uppercase block mb-1">
                      Technical Evidence:
                    </span>
                    {finding.evidence}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
