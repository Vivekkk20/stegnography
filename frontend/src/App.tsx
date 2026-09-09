import { useState } from 'react';
import { EducationalProvider } from './context/EducationalContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Dashboard } from './pages/Dashboard';
import { EncodePage } from './pages/EncodePage';
import { DecodePage } from './pages/DecodePage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [reportTargetId, setReportTargetId] = useState<string | undefined>(undefined);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const handleNavigate = (tab: string, reportId?: string) => {
    setReportTargetId(reportId);
    setCurrentTab(tab);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Command Center & Telemetry',
          subtitle: 'Real-time cybersecurity steganography & steganalysis operations',
        };
      case 'encode':
        return {
          title: 'Steganographic Encoding Lab',
          subtitle: 'Lossless RGB least-significant bit embedding with authenticated AES-256-GCM',
        };
      case 'decode':
        return {
          title: 'Steganographic Decoding Lab',
          subtitle: 'Tamper-resistant payload extraction & cryptographic decryption',
        };
      case 'analyzer':
        return {
          title: 'Forensic Steganalysis Suite',
          subtitle: 'Statistical, structural, and information-theoretic image anomaly inspection',
        };
      case 'reports':
        return {
          title: 'Forensic Dossiers & Casefiles',
          subtitle: 'Audited telemetry, historical stego findings, and exported reports',
        };
      case 'settings':
        return {
          title: 'Platform Configuration',
          subtitle: 'Cryptographic parameters, educational mode, and system parameters',
        };
      case 'about':
        return {
          title: 'Threat Model & Security Spec',
          subtitle: 'Formal defense matrix, cryptographic rationale, and mathematical foundations',
        };
      default:
        return {
          title: 'StegoVault Command Center',
          subtitle: 'Lossless Steganography & Steganalysis Platform',
        };
    }
  };

  const pageInfo = getPageTitle(currentTab);

  return (
    <EducationalProvider>
      <div className="flex min-h-screen bg-[#040806] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
        {/* Ambient atmospheric matrix glow lights */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-10 right-1/4 w-[28rem] h-[28rem] bg-teal-500/8 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed top-1/2 right-10 w-80 h-80 bg-green-500/8 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Navigation Sidebar */}

        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => handleNavigate(tab)}
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            title={pageInfo.title}
            subtitle={pageInfo.subtitle}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
            onQuickAction={handleNavigate}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
            {currentTab === 'encode' && <EncodePage />}
            {currentTab === 'decode' && <DecodePage />}
            {currentTab === 'analyzer' && <AnalyzerPage />}
            {currentTab === 'reports' && <ReportsPage initialReportId={reportTargetId} />}
            {currentTab === 'settings' && <SettingsPage />}
            {currentTab === 'about' && <AboutPage />}
          </main>
        </div>
      </div>
    </EducationalProvider>
  );
}

export default App;
