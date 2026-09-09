import { useState, useEffect } from 'react';
import {
  FileText,
  Trash2,
  Search,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { api } from '../services/api';
import type { ReportSummary, ForensicReport } from '../types';
import { RiskMeter } from '../components/common/RiskMeter';
import { HashDisplay } from '../components/common/HashDisplay';
import { EntropyCard } from '../components/analyzer/EntropyCard';
import { HistogramChart } from '../components/analyzer/HistogramChart';
import { LsbVisualizer } from '../components/analyzer/LsbVisualizer';
import { FindingsList } from '../components/analyzer/FindingsList';

interface ReportsPageProps {
  initialReportId?: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialReportId }) => {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'moderate' | 'clean'>('all');
  const [selectedReport, setSelectedReport] = useState<ForensicReport | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.listReports();
      setReports(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (initialReportId) {
      loadReport(initialReportId);
    }
  }, [initialReportId]);

  const loadReport = async (id: string) => {
    try {
      const rep = await api.getReport(id);
      setSelectedReport(rep);
    } catch (err: any) {
      alert(err.message || 'Failed to load report.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this forensic dossier?')) return;
    try {
      await api.deleteReport(id);
      if (selectedReport?.analysis_id === id) {
        setSelectedReport(null);
      }
      fetchReports();
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  const filteredReports = reports.filter((r: ReportSummary) => {
    const matchesSearch =
      r.filename.toLowerCase().includes(search.toLowerCase()) ||
      r.risk_level.toLowerCase().includes(search.toLowerCase()) ||
      r.analysis_id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (riskFilter === 'critical') return r.risk_score > 60;
    if (riskFilter === 'moderate') return r.risk_score > 20 && r.risk_score <= 60;
    if (riskFilter === 'clean') return r.risk_score <= 20;
    return true;
  });

  const getRiskBadge = (score: number, level: string) => {
    let color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score > 60) color = 'bg-rose-500/10 text-rose-400 border-rose-500/30 glow-rose';
    else if (score > 40) color = 'bg-amber-500/10 text-amber-400 border-amber-500/30 glow-amber';
    else if (score > 20) color = 'bg-teal-500/10 text-teal-400 border-teal-500/30';

    return (
      <span
        className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-extrabold uppercase font-mono tracking-wider ${color}`}
      >
        {score} / 100 • {level.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* If a report is selected, show detail view */}
      {selectedReport ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-950/60 bg-[#07120b]/85 p-5 backdrop-blur-xl">
            <button
              onClick={() => setSelectedReport(null)}
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dossiers</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="text-xs text-slate-300 hover:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-950/60 bg-slate-900 transition-colors"
              >
                Print Dossier
              </button>
            </div>
          </div>

          <RiskMeter
            score={selectedReport.section_10_risk_score.score}
            riskLevel={selectedReport.section_10_risk_score.risk_level}
          />

          <FindingsList findings={selectedReport.section_11_technical_findings || []} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HashDisplay
              sha256={selectedReport.section_2_cryptographic_hashes.sha256}
              sha512={selectedReport.section_2_cryptographic_hashes.sha512}
              label="Audited Image Fingerprint"
            />
            <div className="rounded-2xl border border-emerald-950/80 bg-[#07120b]/80 p-5 backdrop-blur-xl font-mono text-xs space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-2">
                Dossier Metadata
              </span>
              <div className="flex justify-between py-1 border-b border-emerald-950/60">
                <span className="text-slate-500">Case ID:</span>
                <span className="text-emerald-400">{selectedReport.analysis_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-950/60">
                <span className="text-slate-500">Carrier File:</span>
                <span className="text-white">{selectedReport.section_1_file_information?.filename}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-950/60">
                <span className="text-slate-500">Dimensions:</span>
                <span className="text-slate-300">
                  {selectedReport.section_1_file_information?.dimensions?.width} × {selectedReport.section_1_file_information?.dimensions?.height}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-300">{new Date(selectedReport.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>


          {selectedReport.section_5_lsb_analysis && (
            <LsbVisualizer
              visualLsbPlane={selectedReport.section_5_lsb_analysis.visual_lsb_plane}
            />
          )}

          {selectedReport.section_4_entropy_analysis && (
            <EntropyCard entropy={selectedReport.section_4_entropy_analysis} />
          )}

          {selectedReport.section_6_histogram_analysis && (
            <HistogramChart histogram={selectedReport.section_6_histogram_analysis} />
          )}
        </div>
      ) : (
        /* Reports Repository List View */
        <div className="space-y-6">
          {/* Filter Bar & Search */}
          <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search casefiles by filename, risk level, or ID..."
                  className="w-full rounded-xl border border-emerald-950/80 bg-slate-950/80 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchReports}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-900/40 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors shadow-sm font-mono"
                  title="Refresh casefile list"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Risk filter tabs */}
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  riskFilter === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setRiskFilter('critical')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  riskFilter === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 glow-rose'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-300'
                }`}
              >
                Critical Risk &gt;60
              </button>
              <button
                onClick={() => setRiskFilter('moderate')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  riskFilter === 'moderate'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-300'
                }`}
              >
                Moderate 20-60
              </button>
              <button
                onClick={() => setRiskFilter('clean')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  riskFilter === 'clean'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-emerald-300'
                }`}
              >
                Clean &lt;20
              </button>
            </div>
          </div>

          {/* Dossiers List */}
          <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 backdrop-blur-xl shadow-2xl overflow-hidden">
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                <FileText className="h-8 w-8 mx-auto text-slate-600" />
                <p>No forensic dossiers match your search or filter criteria.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/70">
                {filteredReports.map((rep: ReportSummary) => (
                  <div
                    key={rep.analysis_id}
                    onClick={() => loadReport(rep.analysis_id)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-[#07140c] cursor-pointer transition-all gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="mt-0.5 rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {rep.filename}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                          <span>{new Date(rep.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>{rep.file_size_kb} KB</span>
                          <span>•</span>
                          <span className="uppercase">{rep.format}</span>
                        </div>
                      </div>
                    </div>


                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {getRiskBadge(rep.risk_score, rep.risk_level)}

                      <button
                        onClick={(e) => handleDelete(e, rep.analysis_id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Delete dossier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
