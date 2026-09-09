# StegoVault: Complete Technical Reference & Project Documentation

<div align="center">

```
  ____  _                      __     __            _ _   
 / ___|| |_ ___  __ _  ___    \ \   / /_ _ _   _| | |_ 
 \___ \| __/ _ \/ _` |/ _ \____\ \ / / _` | | | | | __|
  ___) | ||  __/ (_| | (_) |____\ V / (_| | |_| | | |_ 
 |____/ \__\___|\__, |\___/      \_/ \__,_|\__,_|_|\__|
                |___/                                   
```

**An Educational Cybersecurity and Digital Forensics Steganography & Steganalysis Suite**  
*Lossless Spatial LSB Embedding • Authenticated AES-256-GCM Cryptography • Deep Statistical Steganalysis • Forensic Risk Engine*

</div>

---

## Table of Contents
1. [Executive Overview & Mission](#1-executive-overview--mission)
2. [End-to-End System Architecture](#2-end-to-end-system-architecture)
3. [The StegoVault Binary Container Specification](#3-the-stegovault-binary-container-specification)
4. [Cryptographic Security Subsystem](#4-cryptographic-security-subsystem)
5. [Spatial LSB Steganography Engine](#5-spatial-lsb-steganography-engine)
6. [Digital Forensics & Statistical Steganalysis Suite](#6-digital-forensics--statistical-steganalysis-suite)
7. [Calibrated Forensic Risk Engine & 13-Section Reports](#7-calibrated-forensic-risk-engine--13-section-reports)
8. [Frontend Architecture & Matrix Emerald UI System](#8-frontend-architecture--matrix-emerald-ui-system)
9. [Complete REST API Reference](#9-complete-rest-api-reference)
10. [Testing Strategy & Synthetic Test Dataset](#10-testing-strategy--synthetic-test-dataset)
11. [Developer & Operations Guide](#11-developer--operations-guide)
12. [Threat Model & Security Posture](#12-threat-model--security-posture)
13. [Inherent Limitations & Research Frontiers](#13-inherent-limitations--research-frontiers)

---

## 1. Executive Overview & Mission

StegoVault is an enterprise-grade steganography and digital forensics analysis platform designed for security researchers, incident responders, digital forensics investigators, and cybersecurity students.

Steganography—the practice of concealing secret messages within innocent carrier media—has historically suffered from a dangerous architectural divide:
- **Naive Tools:** Embed unauthenticated plaintext directly into pixel bits. These payloads are easily flagged by simple statistical tests and cannot detect corrupt transmissions.
- **Academic Papers:** Provide isolated mathematical models without usable implementations, visual tools, or security validation.

StegoVault bridges this divide by delivering a complete, production-grade system combining:
1. **Zero-Trust Authenticated Encryption:** AES-256-GCM authenticated encryption paired with PBKDF2-HMAC-SHA256 (600,000 rounds) key derivation.
2. **Tamper-Evident Binary Packaging:** A 64-byte structured container with magic bytes, versioning, CSPRNG salts/nonces, CRC32 header verification, and a 32-byte SHA-256 payload trailer.
3. **Multi-Model Statistical Steganalysis:** Simultaneous evaluation of Shannon entropy, Westfeld-Pfitzmann Chi-Square ($\chi^2$) Pair-of-Values (PoV) tests, 256-bin RGB histograms, Pearson channel correlation, and structural EOF file boundaries.
4. **Calibrated Forensic Risk Engine:** Synthesizes multi-dimensional heuristic indicators into a transparent 0–100 risk score and compiles comprehensive 13-section digital forensics reports.
5. **Interactive Operations Center:** A responsive SPA featuring an interactive LSB simulator, bit-plane visual microscope, spectral frequency curves, and a global toggleable **Educational Mode**.

---

## 2. End-to-End System Architecture

StegoVault is built as a decoupled, multi-tier micro-monolith consisting of a reactive frontend and a stateless asynchronous backend.

```
+-------------------------------------------------------------------------+
|                        Frontend SPA (React 19)                          |
|  - Matrix Emerald & Terminal Green Cyber Aesthetic                      |
|  - Chart.js 256-Bin RGB Histograms + HTML5 Canvas LSB Bit Visualizer   |
|  - Interactive Pixel Sandbox & Global Pedagogical Educational Mode      |
+-------------------------------------------------------------------------+
                                    |
                            HTTP/REST (JSON / Multipart)
                                    v
+-------------------------------------------------------------------------+
|                          FastAPI Backend Core                           |
|  - Magic Byte Validation (\x89PNG, BM) & 20MB Security Size Ceiling    |
|  - Sanitized Logging (Zero Leakage of Keys, Nonces, or Passwords)       |
+-------------------------------------------------------------------------+
       |                           |                          |
       v                           v                          v
+------------------+     +--------------------+     +---------------------+
| Steganography    |     | Cryptography       |     | Forensics & Analysis|
| - Spatial LSB    |     | - AES-256-GCM      |     | - Shannon Entropy   |
| - Capacity Meter |     | - PBKDF2 (600k)    |     | - Chi-Square PoV    |
| - 64-byte Header |     | - CSPRNG Nonce/Salt|     | - Pearson Corr.     |
| - CRC32 & SHA-256|     | - Constant-time Cmp|     | - Trailing Data EOF |
+------------------+     +--------------------+     +---------------------+
                                                              |
                                                              v
                                                    +---------------------+
                                                    | Risk Engine         |
                                                    | - Calibrated 0-100  |
                                                    | - 13-Section Report |
                                                    | - HTML / JSON Export|
                                                    +---------------------+
```

### High-Level Component Decomposition
- **Presentation Layer (`frontend/`):** React 19, TypeScript 5.7+, Vite, Tailwind CSS v4, Lucide icons, Chart.js.
- **API Routing Layer (`backend/app/api/v1/`):** FastAPI asynchronous endpoints handling validation, error mapping, and streaming file transfers.
- **Security & Cryptography Core (`backend/app/security/`):** Cryptographic primitives, key derivation, streaming hashing, and file integrity validation.
- **Steganography Subsystem (`backend/app/steganography/`):** Pixel-plane modulation, capacity calculation, and binary container serialization.
- **Steganalysis Subsystem (`backend/app/steganalysis/`):** Statistical analysis engines, spectral histogram builders, and anomaly detectors.
- **Forensic Reporting Engine (`backend/app/core/`):** Report compilation, risk score calculation, and JSON/HTML persistence.

---

## 3. The StegoVault Binary Container Specification

StegoVault wraps every embedded payload in a tamper-evident, endian-safe binary container.

### 3.1. Container Layout Diagram

```
+-------------------------------------------------------------------------------+
|                      StegoVault Binary Container Header                       |
|                                  (64 Bytes)                                   |
+-----------------------+---------------------+-------------------+-------------+
| Field Name            | Data Type           | Field Size        | Byte Offset |
+-----------------------+---------------------+-------------------+-------------+
| Magic Bytes           | ASCII 'STGV'        | 4 Bytes           | 0x00 - 0x03 |
| Format Version        | uint16 (Big-Endian) | 2 Bytes (0x0001)  | 0x04 - 0x05 |
| Feature Flags         | uint16 (Big-Endian) | 2 Bytes (0x0000)  | 0x06 - 0x07 |
| PBKDF2 Iterations     | uint32 (Big-Endian) | 4 Bytes (600,000) | 0x08 - 0x0B |
| Key Derivation Salt   | CSPRNG Bytes        | 16 Bytes          | 0x0C - 0x1B |
| AES-GCM Nonce/IV      | CSPRNG Bytes        | 12 Bytes          | 0x1C - 0x27 |
| Ciphertext Length (N) | uint32 (Big-Endian) | 4 Bytes           | 0x28 - 0x2B |
| AES-GCM Auth Tag      | Cryptographic Tag   | 16 Bytes          | 0x2C - 0x3B |
| Header CRC32 Checksum | uint32 (Big-Endian) | 4 Bytes           | 0x3C - 0x3F |
+-----------------------+---------------------+-------------------+-------------+
|                                PAYLOAD BODY                                   |
|                                 (N Bytes)                                     |
+-------------------------------------------------------------------------------+
|                      AES-256-GCM Encrypted Ciphertext                         |
+-------------------------------------------------------------------------------+
|                              INTEGRITY TRAILER                                |
|                                 (32 Bytes)                                    |
+-------------------------------------------------------------------------------+
|                     SHA-256 Hash of Plaintext Payload                         |
+-------------------------------------------------------------------------------+
```

### 3.2. Total Embedding Overhead
$$\text{Total Overhead} = \text{Header (64 bytes)} + \text{Integrity Trailer (32 bytes)} = 96 \text{ bytes (768 bits)}$$
For a standard 512×512 RGB carrier image (providing 786,432 bits of LSB capacity), container overhead consumes less than **0.098%** of the available bandwidth.

### 3.3. Header Fields Description
- **Magic Bytes (`STGV`, `0x53544756`):** Identifies StegoVault containers immediately.
- **Format Version (`0x0001`):** Guarantees forward compatibility for future algorithmic updates.
- **Feature Flags:** 16-bit bitmask reserved for compression or multi-channel routing.
- **PBKDF2 Iteration Count:** Explicitly embedded in each container so receivers can derive keys without out-of-band parameter coordination.
- **Salt (16 bytes):** Fresh `os.urandom(16)` per container prevents precomputation (rainbow table) attacks.
- **Nonce (12 bytes):** Standard 96-bit CSPRNG initialization vector for GCM mode.
- **Ciphertext Length ($N$):** Number of encrypted bytes in the payload body.
- **Authentication Tag (16 bytes):** 128-bit Galois Message Authentication Code tag.
- **Header CRC32:** Standard IEEE 802.3 CRC32 checksum computed across bytes 0 to 59. Enables immediate rejection of corrupted containers before attempting expensive PBKDF2 calculations.

---

## 4. Cryptographic Security Subsystem

StegoVault adopts a strict **Zero-Trust Cryptographic Architecture**: no unauthenticated or unencrypted data is ever written to carrier pixels.

### 4.1. Key Derivation (PBKDF2-HMAC-SHA256)
- Passphrases are converted into 256-bit symmetric keys using PBKDF2 with SHA-256.
- **Work Factor:** Default iteration count is **600,000**, aligning with OWASP recommendations to defeat GPU/ASIC brute-force dictionary attacks.
- **Salt Generation:** 16-byte cryptographically secure pseudorandom number generator (`os.urandom(16)`).

### 4.2. Authenticated Symmetric Cipher (AES-256-GCM)
- **Confidentiality:** 256-bit AES in Galois/Counter Mode (GCM).
- **Integrity & Authenticity:** 128-bit authentication tag computed over the ciphertext and associated data.
- **Nonce Security:** Fresh 12-byte CSPRNG nonce per encryption prevents nonce-reuse catastrophe in GCM mode.

### 4.3. Dual-Layer Tamper Resistance
1. **Layer 1 (Pre-Decryption CRC32):** CRC32 over the header detects random bitflips or truncated files in $\approx 10\,\mu\text{s}$, preventing DoS via repeated PBKDF2 derivations.
2. **Layer 2 (Post-Decryption SHA-256):** Plaintext hash verification ensures the decrypted output exactly matches the sender's original message.
3. **Timing Resistance:** All tag and hash comparisons utilize `hmac.compare_digest` to prevent side-channel timing analysis.

---

## 5. Spatial LSB Steganography Engine

### 5.1. Mathematical Modulation Formulation
An 8-bit color channel intensity $P \in [0, 255]$ is composed of 8 binary bits:
$$P = \sum_{i=0}^7 b_i \cdot 2^i$$

Given a secret container bit $s \in \{0, 1\}$:
$$P' = (P \ \& \ \text{0xFE}) \ | \ s$$
Extraction is performed via identity masking:
$$s = P' \ \& \ \text{0x01}$$

### 5.2. Sequential Channel Interleaving
Bits are written sequentially across the Red, Green, and Blue channels in raster-scan order (top-to-bottom, left-to-right):
$$\text{Bit } 0 \to R_{(0,0)}, \quad \text{Bit } 1 \to G_{(0,0)}, \quad \text{Bit } 2 \to B_{(0,0)}, \quad \text{Bit } 3 \to R_{(0,1)}, \dots$$

### 5.3. Channel Isolation & Alpha Transparency Preservation
In 32-bit RGBA images, modifying the Alpha channel ($A$) causes dramatic visual artifacts in transparent or semi-transparent regions. StegoVault strictly bypasses the Alpha channel:
$$\text{Pixel}' = [R', G', B', A_{\text{original}}]$$

### 5.4. Usable Capacity Formula
$$\text{Capacity}_{\text{usable}} = \left\lfloor \frac{\text{Width} \times \text{Height} \times 3}{8} \right\rfloor - 96 \text{ bytes}$$

---

## 6. Digital Forensics & Statistical Steganalysis Suite

StegoVault executes a multi-dimensional steganalysis pipeline capable of identifying hidden payloads without possessing the decryption key.

### 6.1. Multi-Layer Shannon Entropy Analysis
Shannon entropy measures the average information content or unpredictability:
$$H(X) = -\sum_{i=1}^n P(x_i) \log_2 P(x_i)$$

StegoVault evaluates entropy at two distinct structural layers:
1. **Whole-File Byte Entropy ($H \in [0, 8]$):** Natural photographic images typically exhibit $H \in [6.8, 7.6]$. Values approaching $8.0$ indicate encryption or compression.
2. **LSB Bit-Plane Entropy ($H_{\text{bit}} \in [0, 1]$):** Natural image LSBs contain residual sensor noise and gentle image contours ($H_{\text{bit}} \in [0.85, 0.98]$). Overwriting LSBs with AES-256 ciphertext drives bit entropy to $H_{\text{bit}} > 0.999$, triggering an anomaly flag.

### 6.2. Westfeld-Pfitzmann Chi-Square ($\chi^2$) Pair-of-Values Attack
In natural images, adjacent pixel intensities ($2k$ and $2k+1$) have distinct frequencies. LSB substitution replaces the least significant bit with equal probability $p=0.5$, mathematically equalizing the pair:
$$E(2k) = E(2k+1) = \frac{h(2k) + h(2k+1)}{2}$$
$$\chi^2 = \sum_{k=0}^{127} \frac{\left(h(2k) - E(2k)\right)^2}{E(2k)}$$

The degrees of freedom is $df = 127$. Using the upper tail of the $\chi^2$ distribution:
$$p = 1 - F(\chi^2, 127)$$
- **Natural Image:** $p \approx 1.0$ (observed frequencies maintain natural disparity).
- **Stego Image:** $p \to 0.0$ (PoVs are statistically flattened; strongly indicates artificial embedding).

### 6.3. 256-Bin RGB Spectral Histograms & PoV Pairing Deltas
Computes discrete frequency histograms $h(i)$ for $i \in [0, 255]$ across $R$, $G$, $B$, and Luminance:
$$\Delta_{\text{PoV}} = \frac{1}{128} \sum_{k=0}^{127} |h(2k) - h(2k+1)|$$
A sudden suppression of $\Delta_{\text{PoV}}$ relative to surrounding image regions flags steganographic embedding.

### 6.4. Pearson Inter-Channel Correlation
Natural images exhibit high inter-channel correlation ($r > 0.85$) due to shared scene illumination:
$$r_{XY} = \frac{\sum (X_i - \bar{X})(Y_i - \bar{Y})}{\sqrt{\sum (X_i - \bar{X})^2 \sum (Y_i - \bar{Y})^2}}$$
StegoVault computes correlation across full channels ($r_{RG}, r_{RB}, r_{GB}$) and isolated LSB bit planes. A sudden decorrelation between color channels signals foreign bit injection.

### 6.5. Binary EOF Boundary & Trailing Data Detection
Naive steganography frequently appends covert files to the end of image containers. StegoVault audits structural file markers:
- **PNG:** Locates the `IEND` chunk (`\x00\x00\x00\x00IEND\xaeB`$`\x82`) and verifies that file size equals the `IEND` offset + 12 bytes.
- **BMP:** Reads the `bfSize` DWORD at offset `0x02` and compares it to actual byte length.
- Any bytes located past the legal EOF trigger an immediate **Critical Structural Anomaly** alert with SHA-256 fingerprinting and hex dump previews.

---

## 7. Calibrated Forensic Risk Engine & 13-Section Reports

### 7.1. Scoring Model (0–100)
StegoVault normalizes all heuristic indicators into an objective 0–100 risk score:
$$\text{Risk Score} = \min\left(100, \sum_{i} W_i \cdot I_i\right)$$

| Forensic Indicator | Weight ($W_i$) | Trigger Condition | Severity Level |
| :--- | :--- | :--- | :--- |
| **Trailing Data Past Legal EOF** | 45 points | Raw bytes found appended past `IEND` or `bfSize` | Critical |
| **Chi-Square PoV Equalization** | 35 points | $p < 0.01$ and sample size $> 10,000$ pixels | High |
| **LSB Bit-Plane High Entropy** | 25 points | $H_{\text{bit}} > 0.998$ in any active color channel | Moderate |
| **Suspicious Metadata Tags** | 20 points | Custom, unusually long, or suspicious text chunks | Moderate |
| **Channel Correlation Collapse** | 15 points | Cross-channel Pearson $r < 0.60$ | Low |
| **Macro Byte Entropy Elevation** | 10 points | Full file Shannon entropy $H > 7.92$ | Informational |

### 7.2. Qualitative Threat Classification
- **$0–20$ (Clean / Nominal):** Natural sensor distributions, no structural anomalies.
- **$21–40$ (Low Probability):** Trace statistical deviations consistent with sensor compression noise.
- **$41–60$ (Moderate / Suspicious):** Unnatural LSB distributions or elevated entropy in one or more channels.
- **$61–80$ (High Probability):** Chi-Square PoV equalization and high-entropy signatures detected.
- **$81–100$ (Critical / Detected):** Blatant steganographic payload: trailing bytes, corrupt containers, or multi-indicator concurrence.

### 7.3. 13-Section Forensic Report Structure
Every analysis produces an immutable 13-section report:
1. `section_1_file_information`: Filename, format, byte size, resolution, dimensions.
2. `section_2_cryptographic_hashes`: MD5, SHA-1, SHA-256, and SHA-512 hashes.
3. `section_3_metadata_analysis`: PNG text chunks, EXIF fields, suspicious tags.
4. `section_4_entropy_analysis`: File entropy, channel entropy, LSB bit-plane entropy.
5. `section_5_lsb_analysis`: 0/1 bit ratios, Chi-Square statistics, p-values.
6. `section_6_histogram_analysis`: 256-bin RGB distributions, PoV pairing deltas.
7. `section_7_channel_correlation`: Inter-channel and LSB plane Pearson correlation coefficients.
8. `section_8_structural_analysis`: Legal EOF offsets, trailing data flags, hex dump previews.
9. `section_9_detected_indicators`: Itemized anomaly flags and statistical deviations.
10. `section_10_risk_score`: Calibrated 0–100 score and categorical risk level.
11. `section_11_technical_findings`: Structured findings with severity, impact, and evidence.
12. `section_12_final_assessment`: Plain-language verdict and forensic summary.
13. `section_13_limitations`: Scientific disclaimers and scope boundaries.

---

## 8. Frontend Architecture & Matrix Emerald UI System

### 8.1. Tech Stack & Performance
- **React 19 & TypeScript 5.7+:** Strict domain type safety matching backend Pydantic schemas.
- **Vite 8.2+:** Hot Module Replacement (HMR) and optimized Rollup production bundling.
- **Tailwind CSS v4:** Modern CSS variables and custom utility tokens.
- **Chart.js & react-chartjs-2:** High-performance canvas rendering for 256-bin RGB spectra.

### 8.2. Matrix Emerald & Terminal Green Theme System
Designed to emulate an advanced cyber operations room:
- **Carbon Voids:** `#040806` canvas, `#07120b/85` glassmorphic cards, `#030a05/90` code wells, `#020503` terminal backgrounds.
- **Phosphor Emerald Glows:** `.glow-emerald` (`rgba(16, 185, 129, 0.45)`), `.glow-matrix` (`rgba(0, 255, 136, 0.40)`).
- **Subtle Phosphor Grid:** `.matrix-grid` overlay on body background.
- **Custom Emerald Scrollbars:** Styled scrollbars with emerald thumb highlights.

### 8.3. Key Interactive Components
- **Interactive LSB Simulator (`Dashboard.tsx`):** Lets users toggle least significant bits of an RGB pixel in real-time, displaying side-by-side color swatches and $\Delta E$ values.
- **Bit-Plane Forensic Microscope (`LsbVisualizer.tsx`):** Isolated 1-bit base64 visualizer with nearest-neighbor rendering (`.pixelated`), invert filter, high-contrast mode, and zoom modal.
- **Live Carrier Capacity Meter (`CapacityMeter.tsx`):** Dynamic bit budget meter with color transitions (Green $\to$ Teal $\to$ Amber $\to$ Red).
- **Educational Mode Switch (`Header.tsx` / `SettingsPage.tsx`):** Global state toggle persisted in `localStorage` that activates contextual pedagogical cards (`EduCard.tsx`).

---

## 9. Complete REST API Reference

All backend endpoints are prefixed with `/api/v1`.

### 9.1. Health & Telemetry
```http
GET /api/v1/health
```
**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "security": {
    "pbkdf2_iterations": 600000,
    "cipher": "AES-256-GCM",
    "kdf": "PBKDF2-HMAC-SHA256",
    "max_upload_mb": 20
  }
}
```

### 9.2. Capacity Estimation
```http
POST /api/v1/steganography/capacity
Content-Type: multipart/form-data

file: <cover_image.png>
```
**Response (200 OK):**
```json
{
  "filename": "cover_image.png",
  "format": "PNG",
  "dimensions": {"width": 512, "height": 512},
  "total_pixels": 262144,
  "color_channels": 3,
  "max_payload_bytes": 98208,
  "header_overhead_bytes": 96
}
```

### 9.3. Steganographic Encoding
```http
POST /api/v1/steganography/encode
Content-Type: multipart/form-data

file: <carrier.png>
secret_message: "Classified telemetry payload"
passphrase: "CorrectHorseBatteryStaple2026!"
```
**Response (200 OK):**
```json
{
  "status": "success",
  "output_filename": "stego_cover_image.png",
  "download_url": "/api/v1/steganography/download/stego_cover_image.png",
  "payload_bytes": 28,
  "capacity_utilization": 0.126,
  "cover_sha256": "3a7b...c901",
  "stego_sha256": "8f2e...4d12"
}
```

### 9.4. Steganographic Decoding & Authentication
```http
POST /api/v1/steganography/decode
Content-Type: multipart/form-data

file: <stego_cover_image.png>
passphrase: "CorrectHorseBatteryStaple2026!"
```
**Response (200 OK):**
```json
{
  "status": "success",
  "secret_message": "Classified telemetry payload",
  "payload_bytes": 28,
  "integrity_verified": true,
  "header_crc_valid": true,
  "sha256_valid": true,
  "security_parameters": {
    "cipher": "AES-256-GCM",
    "kdf": "PBKDF2-HMAC-SHA256",
    "iterations": 600000
  }
}
```

### 9.5. Forensic Steganalysis
```http
POST /api/v1/steganalysis/analyze
Content-Type: multipart/form-data

file: <suspicious_image.png>
```
**Response (200 OK):** Returns full 13-section `ForensicReport` JSON.

### 9.6. Casefile Reports Retrieval
```http
GET /api/v1/steganalysis/reports
GET /api/v1/steganalysis/reports/{analysis_id}
```

---

## 10. Testing Strategy & Synthetic Test Dataset

### 10.1. Pytest Test Suite Overview (43 Tests)
StegoVault includes a test suite covering all security, cryptographic, steganographic, and API layers:
- `test_crypto.py` (7 tests): AES-256-GCM roundtrips, invalid password rejection, ciphertext tampering, tag tampering, PBKDF2 iterations.
- `test_payload.py` (5 tests): 64-byte container pack/unpack, CRC32 header verification, corrupted CRC rejection, SHA-256 trailer check.
- `test_steganography.py` (6 tests): Capacity limits, RGB/RGBA encoding/decoding, channel preservation, overflow prevention.
- `test_steganalysis.py` (8 tests): Entropy bounds, Chi-Square PoV detection, 256-bin histograms, Pearson correlation, EOF trailing data.
- `test_security.py` (7 tests): Magic byte validation (`\x89PNG`, `BM`), lossy format rejection (JPEG), 20MB ceiling, decompression bombs, path traversal.
- `test_dataset.py` (7 tests): Automated verification of all 7 synthetic dataset images.
- `test_api.py` (3 tests): HTTP integration tests across `/health`, `/capacity`, and `/encode`.

Run tests:
```bash
cd backend
.venv\Scripts\pytest -v
```

### 10.2. Synthetic Test Dataset (`test_data/`)
Generated deterministically via `python scripts/generate_test_data.py`:
1. `normal.png`: Clean natural gradient baseline. Risk $\le 20$.
2. `stego_low.png`: Embedded payload occupying $< 1\%$ capacity. Low-rate stealth test.
3. `stego_medium.png`: Moderate density payload ($\approx 10\%$ capacity).
4. `stego_high.png`: Dense payload ($> 50\%$ capacity). Triggers Chi-Square & Bit Entropy anomalies.
5. `corrupted.png`: Valid container with flipped LSB bits. Tests CRC32 and GCM rejection.
6. `metadata_test.png`: PNG with custom `tEXt` and `tIME` chunks for metadata testing.
7. `trailing_data_test.png`: PNG with 191 bytes appended past legal `IEND` chunk. Tests EOF detection.

---

## 11. Developer & Operations Guide

### 11.1. Prerequisites
- **Python 3.10+** (verified on Python 3.14).
- **Node.js 18+** & **npm** (verified on Node v22/v24).
- Windows, macOS, or Linux.

### 11.2. One-Click Windows Launchers
Double-click `start.bat` or run in PowerShell:
```powershell
.\start.ps1
```
Automatically verifies environments, starts backend on port 8000, starts frontend on port 5173, and opens your browser.

To run the full automated verification test suite:
```cmd
scripts\run_tests.bat
```

### 11.3. Manual Multi-Platform Execution
```bash
# Terminal 1: Backend
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate | On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## 12. Threat Model & Security Posture

### 12.1. STRIDE Analysis Summary

| Threat Category | Primary Attack Vector | StegoVault Defense & Mitigation | Residual Risk |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Fake container injection or spoofed headers | Header CRC32 check + AES-GCM tag authentication | Negligible |
| **Tampering** | Modifying ciphertext bits in transit | 128-bit GCM authentication tag guarantees tamper detection | Zero unauthenticated leakage |
| **Repudiation** | Denying payload integrity | Dual SHA-256 payload trailer stored inside encrypted envelope | Negligible |
| **Information Leakage** | Key recovery from error messages or logs | Sanitized exception handlers; zero key/nonce/password logging | Negligible |
| **Denial of Service** | Decompression bombs or multi-gigabyte uploads | Magic byte checking + strict 20MB payload ceiling | Negligible |
| **Elevation of Privilege** | File path traversal in download endpoints | Sanitized filenames, strict storage directory jail | Negligible |

---

## 13. Inherent Limitations & Research Frontiers

1. **Lossy Compression Fragility:** Spatial domain LSB steganography cannot survive JPEG DCT quantization, resampling, or aggressive social media recompression. StegoVault explicitly rejects lossy formats.
2. **Low-Rate Embedding Evasion:** Modulating $< 0.5\%$ of carrier bits can blend into natural sensor noise without exceeding Chi-Square thresholds.
3. **Palette & Grayscale Boundaries:** Current implementation targets 24-bit RGB and 32-bit RGBA containers. Paletted PNGs (Color Type 3) are rejected to prevent index palette artifacts.
4. **Future Research Frontiers:** Transform-domain steganography (DCT / DWT), adaptive syndrome-trellis coding (STCs), and machine-learning steganalysis (XuNet, SRNet).

---

## License

StegoVault is released under the **MIT License**. See [LICENSE](LICENSE) for details.
