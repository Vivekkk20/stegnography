import React, { useState, useEffect } from 'react';
import {
  Lock,
  Download,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { FileUpload } from '../common/FileUpload';
import { CapacityMeter } from './CapacityMeter';
import { HashDisplay } from '../common/HashDisplay';
import { EduCard } from '../common/EduCard';
import { api } from '../../services/api';
import type { CapacityData, EncodeResponse } from '../../types';


export const EncodeForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [secretMessage, setSecretMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EncodeResponse | null>(null);

  // Re-calculate capacity whenever file changes
  useEffect(() => {
    if (!file) {
      setCapacity(null);
      setResult(null);
      return;
    }

    const fetchCapacity = async () => {
      try {
        const data = await api.checkCapacity(file, secretMessage);
        setCapacity(data);
      } catch (err: any) {
        setError(err.message || 'Failed to inspect cover image.');
      }
    };

    fetchCapacity();
  }, [file]);

  // Compute simple password strength heuristic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'Required', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, text: 'Good', color: 'bg-amber-400' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a cover image.');
      return;
    }

    if (!secretMessage.trim()) {
      setError('Please enter a secret message to hide.');
      return;
    }

    if (!password) {
      setError('Password is required for authenticated encryption.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('secret_message', secretMessage);
      formData.append('password', password);
      formData.append('confirm_password', confirmPassword);
      if (outputFilename.trim()) {
        formData.append('output_filename', outputFilename.trim());
      }

      const res = await api.encodeMessage(formData);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to encode secret message.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSecretMessage('');
    setPassword('');
    setConfirmPassword('');
    setOutputFilename('');
    setResult(null);
    setError(null);
    setCapacity(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <EduCard
        title="Why Cryptography Must Precede Steganography"
        category="Cryptographic Steganography"
        takeaway="Never store plaintext directly inside an image. Authenticated encryption transforms meaningful patterns into pseudo-random noise, maximizing resistance to statistical steganalysis."
      >
        <p>
          Embedding unencrypted ASCII text directly into image LSBs creates distinct statistical frequency biases that signature and Chi-Square detectors immediately catch. StegoVault executes <strong>AES-256-GCM</strong> authenticated encryption with <strong>PBKDF2-HMAC-SHA256</strong> key derivation, ensuring the embedded bitstream appears mathematically indistinguishable from random sensor noise.
        </p>
      </EduCard>

      {!result ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-7"
        >
          {/* Step 1: Cover Image Upload */}
          <div className="space-y-2">
            <FileUpload
              onFileSelect={setFile}
              selectedFile={file}
              label="1. Select Carrier Image (Lossless PNG or BMP)"
            />
          </div>

          {/* Live Capacity Meter */}
          {file && (
            <CapacityMeter
              capacity={capacity}
              messageLength={new TextEncoder().encode(secretMessage).length}
            />
          )}

          {/* Step 2: Secret Message Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                2. Secret Plaintext Payload
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSecretMessage(
                      'TOP SECRET: Operation Nightwatch rendezvous scheduled at coordinate 48.8584, 2.2945. Authenticated via StegoVault.'
                    )
                  }
                  className="text-[11px] text-emerald-400 hover:underline font-semibold font-mono"
                >
                  Insert Sample Payload
                </button>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {new TextEncoder().encode(secretMessage).length} bytes
                </span>
              </div>
            </div>

            <textarea
              rows={4}
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              placeholder="Enter confidential message, cryptographic keys, credentials, or sensitive dispatches..."
              className="w-full rounded-2xl border border-emerald-950/80 bg-slate-950/80 p-4 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono resize-y shadow-inner"
            />
          </div>

          {/* Step 3: Password & Confirmation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                3. Encryption Passphrase & Key Derivation
              </label>
              {password && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">Strength:</span>
                  <span className={`h-2 w-12 rounded-full ${strength.color}`} />
                  <span className="font-bold text-white text-[11px]">{strength.text}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong encryption password"
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
              </div>

              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-xl border border-emerald-950/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner font-mono"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Key derived via PBKDF2-HMAC-SHA256 with 600,000 iterations & 16-byte random salt.
            </p>
          </div>

          {/* Step 4: Output Filename */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
              4. Output Filename (Optional)
            </label>
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              placeholder="stegovault_encoded.png"
              className="w-full rounded-xl border border-emerald-950/80 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono shadow-inner"
            />
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
              disabled={loading || !file || !secretMessage.trim() || !password}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-7 py-3.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl glow-emerald"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Deriving Keys & Embedding Bits...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-slate-950" />
                  <span>Encrypt & Embed into Image LSBs</span>
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
                  Steganographic Encoding Successful
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your ciphertext was losslessly embedded into the image LSB channels with zero visual degradation.
                </p>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Encode Another File
            </button>
          </div>

          {/* Stego Image Download & Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
                  <span className="text-slate-500 text-[10px] uppercase block">Encoded Filename</span>
                  <span className="font-bold text-white truncate block mt-1">
                    {result.output_filename}
                  </span>
                </div>

                <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
                  <span className="text-slate-500 text-[10px] uppercase block">Payload Stored</span>
                  <span className="font-bold text-emerald-400 block mt-1">
                    {result.payload_bytes} bytes
                  </span>
                </div>

                <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
                  <span className="text-slate-500 text-[10px] uppercase block">Carrier Bit Usage</span>
                  <span className="font-bold text-emerald-400 block mt-1">
                    {result.capacity_utilization?.toFixed(2) || '0.00'}%
                  </span>
                </div>

                <div className="bg-[#030a05]/90 p-3 rounded-xl border border-emerald-950/40">
                  <span className="text-slate-500 text-[10px] uppercase block">Authentication</span>
                  <span className="font-bold text-emerald-400 block mt-1">
                    128-bit GCM Tag Valid
                  </span>
                </div>
              </div>

              {/* Hash Display */}
              <HashDisplay
                sha256={result.stego_sha256}
                label="Encoded Stego Image Fingerprint"
              />

            </div>

            {/* Action Card */}
            <div className="rounded-2xl border border-emerald-950/40 bg-[#030a05]/90 p-5 flex flex-col justify-between items-center text-center space-y-4 shadow-inner">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Ready for Retrieval</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download your lossless container file. Send it to the recipient securely.
                </p>
              </div>

              <a
                href={result.download_url}
                download={result.output_filename}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-xs font-bold text-slate-950 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-lg glow-emerald"
              >
                <Download className="h-4 w-4 text-slate-950" />
                <span>Download Stego Image</span>
              </a>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
