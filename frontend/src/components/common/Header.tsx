import React from 'react';
import { BookOpen, Menu, Sparkles, ScanEye, Lock } from 'lucide-react';
import { useEducational } from '../../context/EducationalContext';


interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
  onQuickAction?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobileNav,
  onQuickAction,
}) => {
  const { isEduMode, toggleEduMode } = useEducational();

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-emerald-950/80 bg-[#040806]/85 px-4 sm:px-8 backdrop-blur-xl transition-all">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl border border-emerald-900/40 bg-slate-900/90 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide truncate flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions, Health, Educational Mode Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Action Buttons */}
        {onQuickAction && (
          <div className="hidden md:flex items-center gap-2 mr-2">
            <button
              onClick={() => onQuickAction('encode')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-900/40 bg-[#07120b] text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all hover:shadow-sm"
              title="Quickly encode and hide a secret message"
            >
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Hide Payload</span>
            </button>
            <button
              onClick={() => onQuickAction('analyzer')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-900/40 bg-[#07120b] text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all hover:shadow-sm"
              title="Audit image with statistical steganalysis"
            >
              <ScanEye className="h-3.5 w-3.5 text-emerald-400" />
              <span>Inspect Image</span>
            </button>
          </div>
        )}

        {/* Live System Secure Status */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] font-bold tracking-wider">LAB SECURE</span>
        </div>

        {/* Educational Cyber Mode Switch */}
        <button
          onClick={toggleEduMode}
          className={`group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
            isEduMode
              ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/70 to-slate-900 text-emerald-300 shadow-md glow-emerald'
              : 'border-emerald-900/30 bg-[#07120b] text-slate-400 hover:text-slate-200 hover:border-emerald-700/40'
          }`}
          title="Toggle Contextual Forensic & Cryptographic Explanations"
        >
          <BookOpen className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${isEduMode ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">Edu Mode:</span>
          <span
            className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
              isEduMode
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isEduMode ? 'ACTIVE' : 'OFF'}
          </span>
          {isEduMode && <Sparkles className="h-3 w-3 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />}
        </button>
      </div>
    </header>

  );
};
