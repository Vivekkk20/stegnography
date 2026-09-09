import React, { useState } from 'react';
import { Eye, ZoomIn, Info } from 'lucide-react';


interface LsbVisualizerProps {
  visualLsbPlane: string;
}

export const LsbVisualizer: React.FC<LsbVisualizerProps> = ({ visualLsbPlane }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="rounded-2xl border border-emerald-950/60 bg-[#07120b]/85 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Visual LSB Bit-Plane Extraction
            </h3>
            <p className="text-[11px] text-slate-400">
              Least significant bit plane isolated and scaled (0 or 255)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Invert button */}
          <button
            onClick={() => setIsInverted(!isInverted)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-all ${
              isInverted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Invert black and white pixels"
          >
            Invert
          </button>

          {/* High Contrast */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-all ${
              highContrast
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Increase visual edge contrast"
          >
            High Contrast
          </button>

          {/* Zoom Modal Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400 transition-all shadow-sm"
          >
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Forensic Zoom</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Preview image */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="group relative h-52 w-52 mx-auto md:mx-0 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-emerald-950/80 bg-[#020503] shadow-xl"
        >
          <img
            src={visualLsbPlane}
            alt="Visual LSB Bit Plane"
            className={`h-full w-full object-contain pixelated transition-all ${
              isInverted ? 'invert' : ''
            } ${highContrast ? 'contrast-150' : ''}`}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-[#07120b]/90 px-3 py-1.5 rounded-xl border border-emerald-500/40 shadow-lg">
              <ZoomIn className="h-4 w-4" /> Expand Microscope
            </span>
          </div>
        </div>

        {/* Visual forensic explanation */}
        <div className="md:col-span-2 space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-3 bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 leading-relaxed shadow-inner">
            <Info className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
            <div className="space-y-2">
              <span className="font-bold text-white text-xs block font-mono uppercase tracking-wider">
                Microscopic Interpretation Guide
              </span>
              <p>
                • <strong className="text-emerald-400">Natural Image LSBs:</strong> Contain natural image outlines, shadows, soft contours, and lighting gradients from camera sensor capture.
              </p>
              <p>
                • <strong className="text-rose-400">Encrypted Stego LSBs:</strong> Pixels overwritten with AES-256 ciphertext appear as completely uniform, textureless TV static / white noise without natural edge correlation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal View */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] max-w-[92vw] overflow-auto rounded-3xl border border-emerald-950/80 bg-[#07120b] p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-emerald-950/60 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase text-white font-mono flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  <span>LSB Bit-Plane Forensic Microscope (Scaled 0 or 255)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Pixel-perfect nearest-neighbor rendering
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center p-2 bg-[#020503] rounded-2xl border border-emerald-950/50">
              <img
                src={visualLsbPlane}
                alt="Zoomed LSB Bit Plane"
                className={`max-h-[70vh] w-auto mx-auto rounded border border-slate-800 pixelated shadow-2xl ${
                  isInverted ? 'invert' : ''
                } ${highContrast ? 'contrast-150' : ''}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
