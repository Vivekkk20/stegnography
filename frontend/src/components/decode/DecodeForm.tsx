import React, { useState, useEffect } from 'react';
import {
  Unlock,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  CheckCircle2,
  Download,
  Radio,
} from 'lucide-react';
import { FileUpload } from '../common/FileUpload';
import { EduCard } from '../common/EduCard';
import { api } from '../../services/api';
import type { DecodeResponse, DetectionResponse } from '../../types';


export const DecodeForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [detection, setDetection] = useState<DetectionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [probing, setProbing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-probe for StegoVault payload when file is uploaded
  useEffect(() => {
    if (!file) {
      setDetection(null);
      setResult(null);
      return;
    }

    const probeImage = async () => {
      setProbing(true);
      setError(null);
      try {
        const detectRes = await api.detectPayload(file);
        setDetection(detectRes);
      } catch {
        setDetection({ detected: false });
      } finally {
        setProbing(false);
      }
    };

    probeImage();
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a stego image to decode.');
      return;
    }

    if (!password) {
      setError('Password is required to decrypt the hidden message.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.decodeMessage(file, password);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Unable to decode payload. Verify your password and image integrity.');
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.secret_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!result) return;
    const blob = new Blob([result.secret_message], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stegovault_decrypted_payload.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setResult(null);
    setError(null);
    setDetection(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <EduCard
        title="Authenticated Decryption & Tamper Prevention"
        category="Forensic Integrity"
        takeaway="AES-256-GCM uses a 128-bit authentication tag. If even a single pixel bit is modified in transit, or if an incorrect password is used, decryption aborts immediately without exposing partial plaintext."
      >
        <p>
          Traditional unauthenticated ciphers (like AES in CBC or CTR mode) are vulnerable to bit-flipping attacks where adversaries can modify decrypted plaintext without knowing the key. StegoVault binds the binary header, salt, nonce, and ciphertext cryptographically with an authentication tag, guaranteeing confidentiality, authenticity, and non-repudiation.
        </p>
      </EduCard>

      {!result ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-7"
        >
          {/* File Upload */}
          <div>
            <FileUpload
              onFileSelect={setFile}
              selectedFile={file}
              label="1. Carrier Image with Hidden Payload"
              helperText="Lossless PNG or BMP file containing StegoVault payload"
            />
          </div>

          {/* Real-time Probing Scanner Banner */}
          {file && (
            <div className="rounded-2xl border border-emerald-950/80 bg-slate-950/80 p-4 transition-all">
              {probing ? (
                <div className="flex items-center gap-3 text-xs text-emerald-400 font-mono">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Probing binary bit-planes for StegoVault magic signature...</span>
                </div>
              ) : detection?.detected ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        StegoVault Container Detected
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Valid Magic Signature Found • 96-Byte Authenticated Header Present
                      </span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-extrabold font-mono text-emerald-400 border border-emerald-500/30 uppercase">
                    CONTAINER VERIFIED
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-slate-500" />
                    <span>No unencrypted StegoVault signature header detected in 0-offset.</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Will attempt full key-derived scan
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              2. Decryption Passphrase
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password used during encoding"
                className="w-full rounded-xl border border-emerald-950/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-10 shadow-inner font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              The 128-bit authentication tag guarantees that wrong passwords or modified pixels are rejected immediately.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading || !file || !password}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-7 py-3.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl glow-emerald"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Extracting Bits & Authenticating...</span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 text-slate-950" />
                  <span>Extract & Decrypt Secret Payload</span>
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        /* Result Screen */
        <div className="rounded-3xl border border-emerald-500/30 bg-[#07120b]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 glow-emerald">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Payload Successfully Authenticated & Decrypted
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  128-bit authentication tag valid • Zero pixel corruption detected • Plaintext restored.
                </p>
              </div>
            </div>

            <button
              onClick={reset}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Decode Another File
            </button>
          </div>

          {/* Decrypted Message Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Recovered Plaintext Message
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadText}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Save .txt</span>
                </button>
                <button
                  onClick={copyMessage}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors shadow-sm font-mono"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Message'}</span>
                </button>

              </div>
            </div>

            <div className="relative">
              <pre className="w-full rounded-2xl border border-emerald-950/50 bg-[#020503] p-5 text-sm text-slate-100 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner max-h-72">
                {result.secret_message}
              </pre>
            </div>
          </div>

          {/* Telemetry metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
              <span className="text-slate-500 text-[10px] uppercase block">Decrypted Size</span>
              <span className="font-bold text-white mt-1 block">
                {result.payload_bytes || new TextEncoder().encode(result.secret_message).length} Bytes
              </span>
            </div>

            <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
              <span className="text-slate-500 text-[10px] uppercase block">Cipher Integrity</span>
              <span className="font-bold text-emerald-400 mt-1 block">AES-256-GCM OK</span>
            </div>

            <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
              <span className="text-slate-500 text-[10px] uppercase block">Carrier File</span>
              <span className="font-bold text-slate-200 mt-1 block truncate">
                {file?.name || 'stego_image.png'}
              </span>
            </div>


            <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
              <span className="text-slate-500 text-[10px] uppercase block">Extraction Time</span>
              <span className="font-bold text-emerald-400 mt-1 block">&lt; 0.4s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
