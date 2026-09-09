import React from 'react';
import {
  LayoutDashboard,
  Lock,
  Unlock,
  ScanEye,
  FileText,
  Settings as SettingsIcon,
  Info,
  Shield,
  Zap,
  CheckCircle2,
  X,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen = false,
  onClose,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Command Center',
      sublabel: 'Overview & telemetry',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'encode',
      label: 'Encode & Hide',
      sublabel: 'AES-GCM bit embedding',
      icon: Lock,
    },
    {
      id: 'decode',
      label: 'Decode & Decrypt',
      sublabel: 'Payload extraction',
      icon: Unlock,
    },
    {
      id: 'analyzer',
      label: 'Forensic Lab',
      sublabel: 'Entropy & Chi-Square',
      icon: ScanEye,
      highlight: true,
    },
    {
      id: 'reports',
      label: 'Forensic Dossiers',
      sublabel: 'Case files & telemetry',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Platform Config',
      sublabel: 'Crypto baseline',
      icon: SettingsIcon,
    },
    {
      id: 'about',
      label: 'Threat Model',
      sublabel: 'Security architecture',
      icon: Info,
    },
  ];

  const handleSelect = (id: string) => {
    onSelectTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 border-r border-emerald-900/30 bg-[#040806]/95 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-950/80">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 shadow-lg glow-emerald p-0.5">
                <div className="h-full w-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  Stego<span className="text-gradient-emerald">Vault</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400/80 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-900/50 font-mono">
                    Forensic Lab v1.0
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Quick Engine Status Indicator */}
          <div className="mx-4 mt-4 p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-950/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-300">Crypto Engine Ready</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">AES-256</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5 mt-2">
            <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 font-mono">
              Operations & Analysis
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`group relative flex w-full items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-950/70 to-[#07120b] text-emerald-300 border border-emerald-500/40 shadow-lg glow-emerald'
                      : 'text-slate-400 hover:bg-emerald-950/20 hover:text-emerald-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-900/80 text-slate-500 group-hover:text-emerald-400 group-hover:bg-emerald-950/30'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold tracking-wide truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-300 uppercase font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate group-hover:text-emerald-400/70">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Telemetry Widget */}
        <div className="p-4 border-t border-emerald-950/80 bg-slate-950/80 space-y-2">
          <div className="rounded-lg bg-[#07100b] p-2.5 border border-emerald-900/30 space-y-1.5 text-[10px] font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-emerald-400" />
                KDF ITERATIONS
              </span>
              <span className="text-emerald-400 font-bold">600,000</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                AUTHENTICATION
              </span>
              <span className="text-emerald-400 font-bold">GCM 128-BIT</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>TLS / LOCAL HOST</span>
            <span className="text-emerald-500/80 font-mono">MATRIX-STG</span>
          </div>
        </div>
      </aside>

    </>
  );
};
