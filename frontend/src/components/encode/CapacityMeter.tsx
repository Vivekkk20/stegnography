import React from 'react';
import { CheckCircle2, AlertOctagon, Database } from 'lucide-react';

import type { CapacityData } from '../../types';

interface CapacityMeterProps {
  capacity: CapacityData | null;
  messageLength: number;
}

export const CapacityMeter: React.FC<CapacityMeterProps> = ({ capacity, messageLength }) => {
  if (!capacity) return null;

  const fixedOverhead = 96; // 64 bytes header + 32 bytes SHA256 trailer
  const requiredBytes = messageLength + fixedOverhead;
  const availableBytes = capacity.capacity_bytes;
  const isSufficient = availableBytes >= requiredBytes;
  const utilization = availableBytes > 0 ? (requiredBytes / availableBytes) * 100 : 0;
  const remainingBytes = Math.max(0, availableBytes - requiredBytes);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1324]/80 p-5 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-950/80 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
          <Database className="h-4 w-4 text-emerald-400" />
          <span>Carrier Capacity & Allocation</span>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase font-mono tracking-wider ${
            isSufficient
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 glow-rose'
          }`}
        >
          {isSufficient ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" /> Sufficient Headroom
            </>
          ) : (
            <>
              <AlertOctagon className="h-3.5 w-3.5" /> Insufficient Carrier Size
            </>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-950/80">
          <span className="text-slate-500 uppercase text-[10px] block">Carrier Max Capacity</span>
          <p className="text-base font-black text-white mt-1">
            {capacity.capacity_kb} KB
          </p>
          <span className="text-[10px] text-slate-400">
            {availableBytes.toLocaleString()} bytes available
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-950/80">
          <span className="text-slate-500 uppercase text-[10px] block">Required Payload Size</span>
          <p className="text-base font-black text-emerald-400 mt-1">
            {(requiredBytes / 1024).toFixed(2)} KB
          </p>
          <span className="text-[10px] text-slate-400">
            {requiredBytes.toLocaleString()} bytes (incl. 96B header)
          </span>
        </div>


        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-500 uppercase text-[10px] block">Remaining Margin</span>
          <p className="text-base font-black text-emerald-400 mt-1">
            {(remainingBytes / 1024).toFixed(2)} KB
          </p>
          <span className="text-[10px] text-slate-400">
            {remainingBytes.toLocaleString()} bytes headroom
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 text-slate-400">
          <span>Carrier Bit Utilization</span>
          <span className="font-bold text-white">{utilization.toFixed(2)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              !isSufficient
                ? 'bg-rose-500'
                : utilization > 75
                ? 'bg-amber-400'
                : utilization > 40
                ? 'bg-teal-400'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0.5, utilization))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
