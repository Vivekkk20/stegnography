import { Shield, BookOpen } from 'lucide-react';


export const AboutPage: React.FC = () => {
  const threatModel = [
    {
      threat: 'Malicious File Uploads / Polyglots',
      impact: 'Remote code execution or parser memory exhaustion.',
      mitigation:
        'Strict magic byte validation (PNG signature / BMP BM), Pillow safe verification with image.load(), and rejection of non-image streams.',
      residual: 'Low. Zero native binary execution or system shell spawning.',
      badge: 'Protected',
    },
    {
      threat: 'Path Traversal Attacks',
      impact: 'Arbitrary filesystem read/write or overwriting system files.',
      mitigation:
        'Strict sanitization of user-provided filenames using regex [^a-zA-Z0-9_.-], stripping path separators, and writing to managed temp directories.',
      residual: 'Very Low. Paths resolved strictly inside isolated storage/temp.',
      badge: 'Sanitized',
    },
    {
      threat: 'Resource Exhaustion (DoS / Decompression Bombs)',
      impact: 'Server memory starvation or crash via oversized decompression.',
      mitigation: '20MB hard file-size ceiling enforced before parsing, PIL pixel limit checks.',
      residual: 'Low. Capped memory buffers and streaming hash calculation.',
      badge: 'Capped',
    },
    {
      threat: 'Payload Tampering & Bit Flipping',
      impact: 'Malleability of decrypted plaintext without knowing password.',
      mitigation:
        'AES-256-GCM authenticated encryption with 128-bit authentication tag and payload SHA-256 integrity checksum.',
      residual: 'Negligible. Authenticated tags are mathematically unforgeable.',
      badge: 'Cryptographic Guarantee',
    },
    {
      threat: 'Password Guessing / Brute Force',
      impact: 'Unauthorized recovery of secret embedded messages.',
      mitigation:
        'PBKDF2-HMAC-SHA256 with 600,000 iterations creates significant computational friction (~0.5s+ per attempt).',
      residual: 'Low. Dependent on user choosing sufficient entropy password.',
      badge: 'Hardened KDF',
    },
    {
      threat: 'Information & Stack Trace Leakage',
      impact: 'Exposing backend internal directory structures or libraries.',
      mitigation:
        'FastAPI custom exception handlers map domain exceptions to sanitized JSON error responses. Debug stack traces suppressed.',
      residual: 'Negligible. Logs are kept in server stdout; API returns clean errors.',
      badge: 'Suppressed',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Educational Theory Section */}
      <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center gap-3 border-b border-emerald-950/60 pb-4">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Core Digital Forensics & Steganalysis Principles
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Theoretical foundation behind StegoVault's steganographic pipeline.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-2">
            <span className="font-bold text-emerald-400 font-mono text-[11px] block uppercase">
              1. Shannon Entropy Fingerprint
            </span>
            <p>
              Natural image bit planes exhibit moderate entropy due to continuous tones and lighting gradients. Overwriting LSB planes with high-entropy AES-256 ciphertext drives bit entropy toward 1.0 bit/symbol and macro entropy toward 8.0 bits/byte, creating detectable anomalies.
            </p>
          </div>

          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-2">
            <span className="font-bold text-emerald-400 font-mono text-[11px] block uppercase">
              2. Chi-Square (χ²) Pair-of-Values Attack
            </span>
            <p>
              LSB substitution swaps adjacent pixel intensities (e.g. 2k ↔ 2k+1) with equal probability. This statistically equalizes the frequency counts of Pair of Values (PoVs), which the Chi-Square test detects via low p-values.
            </p>
          </div>

          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-2">
            <span className="font-bold text-amber-400 font-mono text-[11px] block uppercase">
              3. Authenticated Cryptography Precedence
            </span>
            <p>
              Steganography without cryptography is dangerously fragile. Plain ASCII text forms recognizable frequency spikes. StegoVault mandates AES-256-GCM so all stored bits look identical to sensor noise to unkeyed adversaries.
            </p>
          </div>

          <div className="bg-[#030a05]/90 p-4 rounded-2xl border border-emerald-950/40 space-y-2">
            <span className="font-bold text-rose-400 font-mono text-[11px] block uppercase">
              4. Structural & Trailing Byte Audits
            </span>
            <p>
              Naive steganography often appends payloads past the PNG IEND chunk or BMP EOF. StegoVault audits structural magic markers to instantly flag polyglots and trailing byte injection.
            </p>
          </div>
        </div>
      </div>

      {/* Threat Modeling Matrix */}
      <div className="rounded-3xl border border-emerald-950/60 bg-[#07120b]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center gap-3 border-b border-emerald-950/60 pb-4">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Application Threat Model & Defense Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Security mitigations against common web, file-parsing, and cryptographic vectors.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {threatModel.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-emerald-950/40 bg-[#030a05]/90 p-5 space-y-2 text-xs transition-all hover:border-emerald-500/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-white text-sm font-mono flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {item.threat}
                </span>
                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono text-emerald-400">
                  {item.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
                    Impact Vector
                  </span>
                  <p>{item.impact}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
                    Defense Mitigation
                  </span>
                  <p className="text-emerald-200/90">{item.mitigation}</p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 font-mono">
                Residual Risk: <span className="text-slate-300">{item.residual}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
