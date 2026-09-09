# StegoVault Frontend — Cyber Forensics Command Center

A high-performance Single Page Application (SPA) providing a visual, interactive interface for steganographic encoding, authenticated decryption, and multi-layered statistical steganalysis.

Built with **React 19**, **TypeScript 5.7+**, **Vite**, and **Tailwind CSS v4**, featuring the **Matrix Emerald & Terminal Green** design system.

---

## 🖥️ User Interface Overview

StegoVault Frontend delivers an intuitive yet mathematically rigorous digital forensics workbench:

1. **Operations Dashboard (`/`)**:
   - Real-time cryptographic telemetry HUD (AES-256-GCM, 600,000 PBKDF2 iterations, lossless 24-bit bit planes).
   - **Interactive LSB Bit-Plane Simulator**: Hands-on pixel sandbox demonstrating how flipping least significant bits changes binary data while producing sub-perceptual color differences ($\Delta E \approx 0.2$).
   - Quick-access action tiles and recent forensic casefile feed.

2. **Steganographic Encoding Wizard (`/encode`)**:
   - Drag-and-drop cover image dropzone with instant lossless validation (PNG/BMP).
   - Real-time carrier capacity meter displaying usable headroom, required payload size, and 96-byte container overhead.
   - Secret payload input with character/byte calculation and quick-fill samples.
   - Passphrase input with live strength meter (Weak / Good / Strong).
   - Result screen featuring one-click download of the lossless stego image and SHA-256 cryptographic fingerprints.

3. **Steganographic Decoding & Authenticated Decryption (`/decode`)**:
   - Real-time probing scanner that inspects uploaded carriers for `STGV` magic signatures before submission.
   - Passphrase authentication and decryption terminal.
   - High-contrast terminal plaintext viewer with one-click clipboard copy and `.txt` file export.
   - Cryptographic checklist confirming 128-bit GCM authentication tag and header CRC32 match.

4. **Forensic Steganalysis Lab (`/analyzer`)**:
   - Tabbed forensic workbench:
     - **Overview & Risk**: Calibrated 0–100 risk meter, technical findings breakdown, file metadata, and cryptographic hashes.
     - **LSB Bit-Planes & Chi-Square (χ²)**: High-resolution bit-plane microscope with zoom modal, pixel-inversion filter, and contrast controls, alongside the Westfeld-Pfitzmann Chi-Square PoV statistics table.
     - **Entropy & Spectral Histograms**: Channel-by-channel Shannon entropy bars and interactive 4-channel Chart.js frequency curves.
     - **Structural & Trailing Data**: Appended payload detection past legal image EOF (`IEND` chunk / `bfSize`) and Pearson inter-channel correlation matrix.
   - Export options: One-click JSON export and formatted printable forensic dossiers.

5. **Casefiles & Reports Archive (`/reports`)**:
   - Searchable, filterable repository of forensic analysis reports.
   - Filter by severity (All, Critical Risk >60, Moderate Risk 20–60, Clean <20).
   - Full dossier inspection with printable layout.

6. **Threat Model & Security Baseline (`/about`)**:
   - Educational theory explainer detailing Shannon entropy, Chi-Square PoV attacks, authenticated crypto precedence, and structural audits.
   - Interactive Application Threat Model & Defense Matrix detailing mitigations against common attack vectors.

7. **System Preferences & Cryptographic Parameters (`/settings`)**:
   - Global toggle for **Educational Cyber Mode**.
   - Cryptographic baseline parameters and ingestion boundaries.

---

## 🎨 Design System: Matrix Emerald & Terminal Green

The UI uses a custom **Matrix Emerald & Terminal Green** cyber-forensics theme:

- **Backgrounds**: Deep carbon black (`#040806`, `#020503`), high-contrast carbon cards (`#07120b/85`) with `backdrop-blur-xl`, and terminal wells (`#030a05/90`, `#020503`).
- **Phosphor Emerald Accents**: Primary glowing accents (`text-emerald-400`, `bg-emerald-500`, `border-emerald-500/40`, `.glow-emerald`, `.glow-matrix`).
- **Multi-Level Alert Palette**:
  - `emerald-400` / `emerald-500`: Clean, Nominal, Verified.
  - `teal-400` / `teal-500`: Low risk / informational.
  - `amber-400` / `amber-500`: Moderate risk / statistical perturbation.
  - `rose-400` / `rose-500`: Critical risk / payload detected / cryptographic tamper.
- **Typography**:
  - Headings & Interface: **Plus Jakarta Sans**
  - Cryptographic Hashes, Hex Dumps, Bitstreams: **JetBrains Mono**
- **Atmospheric Effects**: Phosphor terminal grid overlay (`.matrix-grid`), ambient glow orbs, and custom emerald scrollbars.

---

## 💡 Global Educational Mode

StegoVault includes a toggleable **Educational Cyber Mode** managed via `EducationalContext`:
- Accessible from the header switch or Settings page.
- When enabled, contextual **`EduCard`** components appear across all workflows.
- Explains the mathematical theory behind LSB modulation, PBKDF2 iteration hardening, Shannon entropy limits, Chi-Square statistical equalization, and structural EOF injection.
- State is persisted locally in `localStorage` under `stegovault_edu_mode`.

---

## 📁 Component Hierarchy

```
frontend/src/
|-- components/
|   |-- common/
|   |   |-- Sidebar.tsx            # Navigation sidebar with brand logo & live telemetry
|   |   |-- Header.tsx             # Top bar with quick actions & Educational Mode toggle
|   |   |-- EduCard.tsx            # Contextual educational explainer container
|   |   |-- FileUpload.tsx         # Drag-and-drop dropzone with lossless badge & file validation
|   |   |-- HashDisplay.tsx        # Cryptographic fingerprint card with one-click copy
|   |   `-- RiskMeter.tsx          # Calibrated 0-100 forensic risk gauge
|   |-- encode/
|   |   |-- EncodeForm.tsx         # Multi-step encoding wizard & result screen
|   |   `-- CapacityMeter.tsx      # Real-time carrier capacity & utilization meter
|   |-- decode/
|   |   `-- DecodeForm.tsx         # Container probing radar, password input & plaintext terminal
|   `-- analyzer/
|       |-- LsbVisualizer.tsx      # Bit-plane microscope with zoom modal & pixel filters
|       |-- LsbAnalysisCard.tsx    # LSB 0/1 ratio & Chi-Square PoV statistics table
|       |-- HistogramChart.tsx     # 256-bin RGB frequency curves with channel filtering
|       |-- EntropyCard.tsx        # Channel & bit-plane Shannon entropy comparison bars
|       |-- CorrelationMatrix.tsx  # Inter-channel & LSB Pearson correlation matrix
|       |-- MetadataTable.tsx      # PNG text chunks & EXIF attribute inspector
|       |-- TrailingDataCard.tsx   # Structural EOF boundary audit & appended payload detector
|       `-- FindingsList.tsx       # Itemized forensic technical findings list
|-- context/
|   `-- EducationalContext.tsx     # React Context for global educational mode toggle
|-- pages/
|   |-- Dashboard.tsx              # Operations dashboard & interactive LSB simulator
|   |-- AnalyzerPage.tsx           # Multi-tab forensic steganalysis workbench
|   |-- ReportsPage.tsx            # Forensic casefile archive & printable dossier viewer
|   |-- AboutPage.tsx              # Threat model matrix & digital forensics theory
|   `-- SettingsPage.tsx           # Preferences & cryptographic security baseline
|-- services/
|   `-- api.ts                     # Axios client mapping all FastAPI REST endpoints
|-- types/
|   `-- index.ts                   # Strict TypeScript interfaces matching backend schemas
|-- App.tsx                        # Main application layout, atmospheric glow orbs & routing
|-- main.tsx                       # React application entry point
`-- index.css                      # Tailwind CSS v4, custom utility classes & Matrix theme
```

---

## 🛠️ Development & Build

### Prerequisites
- **Node.js 18+** (tested on Node v22 & v24)
- **npm**

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Starts the Vite dev server at `http://localhost:5173/` with Hot Module Replacement (HMR).

### Production Build
```bash
npm run build
```
Executes TypeScript compilation (`tsc -b`) and bundles optimized production assets to `dist/`.

### Linting
```bash
npm run lint
```
Runs Oxlint across all TypeScript and TSX files.

---

## 🔗 Backend API Integration

The frontend connects to the FastAPI backend running at `http://127.0.0.1:8000`. Key integrated endpoints:

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/v1/health` | `GET` | Health check & security parameter telemetry |
| `/api/v1/steganography/capacity` | `POST` | Live carrier capacity calculation |
| `/api/v1/steganography/encode` | `POST` | AES-GCM encryption & LSB embedding |
| `/api/v1/steganography/decode` | `POST` | Authenticated decryption & plaintext recovery |
| `/api/v1/steganalysis/analyze` | `POST` | Multi-model statistical steganalysis |
| `/api/v1/steganalysis/reports` | `GET` | Forensic reports archive list |
| `/api/v1/steganalysis/reports/{id}` | `GET` | Full 13-section report retrieval |
