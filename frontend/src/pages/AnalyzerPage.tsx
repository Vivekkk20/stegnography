import { useState } from 'react';
import {
  ScanEye,
  RefreshCw,
  AlertCircle,
  FileDown,
  Printer,
  Shield,
  Activity,
  Binary,
  Database,
  ArrowLeft,
} from 'lucide-react';
import { FileUpload } from '../components/common/FileUpload';
import { RiskMeter } from '../components/common/RiskMeter';
import { HashDisplay } from '../components/common/HashDisplay';
import { EduCard } from '../components/common/EduCard';
import { EntropyCard } from '../components/analyzer/EntropyCard';
import { HistogramChart } from '../components/analyzer/HistogramChart';
import { LsbAnalysisCard } from '../components/analyzer/LsbAnalysisCard';
import { LsbVisualizer } from '../components/analyzer/LsbVisualizer';
import { CorrelationMatrix } from '../components/analyzer/CorrelationMatrix';
import { MetadataTable } from '../components/analyzer/MetadataTable';
import { TrailingDataCard } from '../components/analyzer/TrailingDataCard';
import { FindingsList } from '../components/analyzer/FindingsList';
import { api } from '../services/api';
import type { ForensicReport } from '../types';

export const AnalyzerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bitplanes' | 'entropy' | 'structural'
  >('overview');

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select an image file to analyze.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await api.analyzeImage(file);
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Forensic analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setReport(null);
    setError(null);
    setActiveTab('overview');
  };

  const exportReportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forensic_report_${report.analysis_id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Educational Banner */}
      <EduCard
        title="Forensic Steganalysis & Statistical Detection"
        category="Steganalysis Theory"
        takeaway="Steganalysis seeks statistical or structural anomalies created by bit modification. Absence of detected indicators does not prove an image is clean: low-rate steganography can blend into sensor noise."
      >
        <p>
          Lossless LSB steganography leaves statistical fingerprints: it equalizes adjacent pixel intensities (measured via <strong>Chi-Square PoV attacks</strong>), raises LSB bit-plane entropy towards 1.0 bit/symbol, balances 0/1 bit distribution tightly around 50.00%, and can disrupt inter-channel correlation. StegoVault audits all these dimensions simultaneously to compute a calibrated forensic risk score.
        </p>
      </EduCard>

      {!report ? (
        /* Upload & Inspect Panel */
        <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 border-b border-emerald-950/60 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ScanEye className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Upload Suspicious Image for Multi-Layer Inspection
              </h3>
              <p className="text-xs text-slate-400">
                Audits PNG/BMP files for embedded payloads without requiring secret keys.
              </p>
            </div>
          </div>

          <FileUpload
            onFileSelect={setFile}
            selectedFile={file}
            label="Carrier Image for Forensic Audit"
            helperText="Lossless PNG or BMP files (Max 20MB)"
          />

          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-7 py-3.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl glow-emerald font-mono"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Executing Multi-Layer Steganalysis...</span>
                </>
              ) : (
                <>
                  <ScanEye className="h-4 w-4 text-slate-950" />
                  <span>Execute Forensic Steganalysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Report Results Workbench */
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-950/80 bg-[#07120b]/80 p-4 sm:p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={resetAnalysis}
                className="p-2 rounded-xl border border-emerald-900/40 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Back to file upload"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                  <span>Dossier:</span>
                  <span className="text-emerald-400 font-mono">
                    {report.section_1_file_information.filename}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  ID: {report.analysis_id} • {report.section_1_file_information.format} ({report.section_1_file_information.dimensions.width}×{report.section_1_file_information.dimensions.height})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={exportReportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-900/40 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors shadow-sm font-mono"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-900/40 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors shadow-sm font-mono"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Workbench Tabs Navigation */}
          <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl border border-emerald-950/80 bg-slate-950/80 backdrop-blur-xl scrollbar-none font-mono text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>1. Overview & Risk</span>
            </button>

            <button
              onClick={() => setActiveTab('bitplanes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === 'bitplanes'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Binary className="h-3.5 w-3.5" />
              <span>2. LSB Planes & Chi-Square</span>
            </button>

            <button
              onClick={() => setActiveTab('entropy')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === 'entropy'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>3. Entropy & Histograms</span>
            </button>

            <button
              onClick={() => setActiveTab('structural')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === 'structural'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>4. Structural & Trailing Bytes</span>
            </button>
          </div>


          {/* Tab 1: Overview & Risk */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <RiskMeter
                score={report.section_10_risk_score.score}
                riskLevel={report.section_10_risk_score.risk_level}
              />

              <FindingsList findings={report.section_11_technical_findings} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetadataTable metadata={report.section_3_metadata_analysis} />
                <HashDisplay
                  sha256={report.section_2_cryptographic_hashes.sha256}
                  sha512={report.section_2_cryptographic_hashes.sha512}
                  label="Verified Image Cryptographic Hash"
                />
              </div>

              {/* Final Assessment Notice */}
              <div className="rounded-2xl border border-emerald-950/80 bg-slate-950/80 p-6 space-y-3">
                <h4 className="text-sm font-bold uppercase text-white font-mono flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span>Executive Assessment</span>
                </h4>

                <p className="text-xs leading-relaxed text-slate-300">
                  {report.section_12_final_assessment}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  Limitation Notice: {report.section_13_limitations}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: LSB Bit-Planes & Chi-Square */}
          {activeTab === 'bitplanes' && (
            <div className="space-y-6 animate-fadeIn">
              <LsbVisualizer
                visualLsbPlane={report.section_5_lsb_analysis.visual_lsb_plane}
              />
              <LsbAnalysisCard lsb={report.section_5_lsb_analysis} />
            </div>
          )}

          {/* Tab 3: Entropy & Histograms */}
          {activeTab === 'entropy' && (
            <div className="space-y-6 animate-fadeIn">
              <EntropyCard entropy={report.section_4_entropy_analysis} />
              <HistogramChart histogram={report.section_6_histogram_analysis} />
            </div>
          )}

          {/* Tab 4: Structural & Trailing Data */}
          {activeTab === 'structural' && (
            <div className="space-y-6 animate-fadeIn">
              <TrailingDataCard
                trailing={report.section_8_structural_analysis.trailing_data}
              />
              <CorrelationMatrix
                correlation={report.section_7_channel_correlation}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
