import React from 'react';
import { BookOpen, Sparkles, Lightbulb } from 'lucide-react';
import { useEducational } from '../../context/EducationalContext';

interface EduCardProps {
  title: string;
  category?: string;
  children: React.ReactNode;
  takeaway?: string;
}

export const EduCard: React.FC<EduCardProps> = ({
  title,
  category = 'Forensic Theory',
  children,
  takeaway,
}) => {
  const { isEduMode } = useEducational();

  if (!isEduMode) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#07120b]/90 to-[#040806] p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50">
      {/* Subtle decorative glow corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3.5 sm:gap-4">
        <div className="shrink-0 mt-0.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-2.5 text-emerald-400 border border-emerald-500/30 shadow-inner">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {category}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
              <Sparkles className="h-3 w-3" /> Edu Explainer
            </span>
          </div>

          <h4 className="mt-2 text-sm sm:text-base font-bold text-white tracking-wide">
            {title}
          </h4>

          <div className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 space-y-2">
            {children}
          </div>

          {takeaway && (
            <div className="mt-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-200 flex items-start gap-2.5 shadow-sm">
              <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300 uppercase tracking-wide text-[11px] block mb-0.5 font-mono">
                  Key Takeaway
                </span>
                <span className="text-emerald-100/90 leading-relaxed">{takeaway}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};
