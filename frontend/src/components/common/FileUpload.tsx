import { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle, ShieldCheck } from 'lucide-react';


interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  label?: string;
  acceptFormats?: string;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  label = 'Select Cover Image',
  acceptFormats = '.png,.bmp',
  helperText = 'Lossless PNG or BMP files only (Max 20MB)',
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    setError(null);
    if (!file) {
      setPreviewUrl(null);
      onFileSelect(null);
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith('.png') && !name.endsWith('.bmp')) {
      setError('Invalid format: Only lossless PNG and BMP images are supported.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File is too large: Maximum upload size is 20MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    handleFile(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
          {label}
        </label>
        <span className="text-[11px] text-slate-500 font-mono">PNG / BMP</span>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-300 ${
          dragOver
            ? 'border-emerald-400 bg-emerald-950/40 shadow-xl glow-emerald scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/40 bg-[#07120b]/90 shadow-lg'
            : 'border-emerald-950/80 bg-[#050b07]/70 hover:border-emerald-800/60 hover:bg-[#07140c]/50 hover:shadow-md'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptFormats}
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        {selectedFile && previewUrl ? (
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-hidden min-w-0">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-950 shadow-md">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
              </div>

              <div className="text-left overflow-hidden min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-white">
                    {selectedFile.name}
                  </p>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'image/png'}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="h-3 w-3" /> Lossless Carrier Verified
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={clearFile}
              className="shrink-0 rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-400 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/30 transition-all shadow-sm"
              title="Remove selected image"
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-950 to-slate-900 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300 shadow-md">
              <UploadCloud className="h-7 w-7" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag & drop cover image here, or{' '}
                <span className="text-emerald-400 underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-400">
                  browse files
                </span>
              </p>
              <p className="mt-1.5 text-xs text-slate-500 font-mono">{helperText}</p>
            </div>
          </div>
        )}
      </div>


      {error && (
        <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
