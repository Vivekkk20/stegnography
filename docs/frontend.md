# StegoVault Frontend Architecture & UI Manual

This document details the architectural design, component composition, state management, canvas visualization, and design system implementation of the StegoVault Single Page Application (SPA).

---

## 1. Technological Stack & Philosophy

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 19.0+ | Reactive declarative view layer, component composition |
| **TypeScript** | 5.7+ | Strict domain type safety, schema parity with backend |
| **Vite** | 8.2+ | Blazing-fast development server with HMR and Rollup bundling |
| **Tailwind CSS** | 4.0+ | Modern utility-first styling with custom CSS design tokens |
| **Lucide React** | 1.16+ | Clean, consistent cybersecurity & forensic iconography |
| **Chart.js & react-chartjs-2** | 4.5+ / 5.3+ | 256-bin RGB frequency spectral histogram curves |
| **Axios** | 1.8+ | HTTP client with multipart file upload & error transformation |

### Core Architectural Principles
1. **Zero-Degradation Responsive Layout**: Works seamlessly across desktops, high-resolution forensic displays, and mobile screens via collapsible navigation drawers.
2. **Context-Driven Pedagogical Mode**: A global toggle that enriches every workflow with cryptographic and statistical forensic explanations without obstructing operational efficiency.
3. **Hardware-Accelerated Bit-Plane Rendering**: Pixel-perfect nearest-neighbor rendering for visual LSB microscope analysis.
4. **Resilient Error Boundaries & Feedback**: Immediate client-side validation (lossless image format detection, payload capacity ceiling, passphrase strength checks).

---

## 2. Component Hierarchy & Data Flow

```
                                      +-------------------------+
                                      |         App.tsx         |
                                      | (Background Orbs & Nav) |
                                      +-------------------------+
                                                   |
                        +--------------------------+--------------------------+
                        |                                                     |
            +------------------------+                             +--------------------+
            |      Sidebar.tsx       |                             |     Header.tsx     |
            | (Brand, Links, Stats)  |                             | (Actions, EduMode) |
            +------------------------+                             +--------------------+
                        |
            +-----------+-----------------------------------------------------------+
            |                                                                       |
+-----------------------+   +-----------------------+   +-------------------------------+
|     Dashboard.tsx     |   |    AnalyzerPage.tsx   |   |        ReportsPage.tsx        |
| - Hero HUD            |   | - Multi-Tab Workbench |   | - Casefiles Search & Filter   |
| - LSB Pixel Simulator |   | - RiskMeter           |   | - 13-Section Dossier Layout   |
| - Workflow Cards      |   | - LsbVisualizer       |   | - Printable Dossier View      |
+-----------------------+   | - LsbAnalysisCard     |   +-------------------------------+
                            | - HistogramChart      |
+-----------------------+   | - EntropyCard         |   +-------------------------------+
|     EncodeForm.tsx    |   | - CorrelationMatrix   |   |   SettingsPage / AboutPage    |
| - FileUpload          |   | - TrailingDataCard    |   | - Educational Mode Settings   |
| - CapacityMeter       |   | - MetadataTable       |   | - Threat Modeling Matrix      |
| - Password Strength   |   | - FindingsList        |   | - Security Baseline Specs     |
| - Result Card         |   +-----------------------+   +-------------------------------+
+-----------------------+
```

---

## 3. The Matrix Emerald & Terminal Green Design System

StegoVault utilizes a specialized **Matrix Emerald & Terminal Green** theme designed to evoke a modern digital forensics operations room:

### Color Tokens & Semantic Usage

```css
/* Deep Carbon Background Tokens */
--bg-void:    #020503;  /* Deepest terminal space */
--bg-main:    #040806;  /* Application canvas */
--bg-card:    rgba(7, 18, 11, 0.85);  /* Glassmorphic card surface */
--bg-well:    rgba(3, 10, 5, 0.90);   /* Code & data display well */
--bg-inner:   #020503;  /* Terminal monospace payload display */

/* Phosphor Emerald Accent Tokens */
--emerald-glow:    #10b981;  /* Primary phosphor accent */
--matrix-glow:     #00ff88;  /* High-intensity terminal beacon */
--border-subtle:   rgba(6, 78, 59, 0.40);  /* emerald-950/40 */
--border-active:   rgba(16, 185, 129, 0.40); /* emerald-500/40 */
```

### Forensic Alert Classification

| State | Background / Border | Text | Semantic Meaning |
| :--- | :--- | :--- | :--- |
| **Clean / Verified** | `bg-emerald-500/10 border-emerald-500/30` | `text-emerald-400` | Risk $\le 20$. Natural sensor distribution, valid CRC32, clean EOF. |
| **Low / Informational** | `bg-teal-500/10 border-teal-500/30` | `text-teal-400` | Risk $21–40$. Trace anomalies consistent with sensor compression noise. |
| **Moderate / Suspicious** | `bg-amber-500/10 border-amber-500/30` | `text-amber-400` | Risk $41–60$. Chi-Square deviation or elevated LSB Shannon entropy. |
| **Critical / Threat** | `bg-rose-500/10 border-rose-500/30` | `text-rose-400` | Risk $> 60$. Blatant steganographic payload, corrupt CRC, trailing data. |

---

## 4. Key Interactive Modules

### 4.1. Interactive LSB Steganography Simulator (`Dashboard.tsx`)
A hands-on educational sandbox where users can interactively manipulate individual bits of a single RGB pixel:
- Displays an 8-bit binary representation of Red ($P_R$), Green ($P_G$), and Blue ($P_B$) channels:
  $$\text{Pixel} = [184, 112, 160]$$
- Users click bit 0 (the LSB) to toggle between `0` and `1`.
- Renders real-time side-by-side comparison swatches showing:
  1. Original pixel color (`#b870a0`).
  2. Modulated stego pixel color (`#b970a0`).
  3. Color difference ($\Delta E \approx 0.2$), visually invisible to human eyes, yet mathematically detectable by statistical engines.

### 4.2. Visual LSB Bit-Plane Extraction & Microscope (`LsbVisualizer.tsx`)
Isolates and amplifies the least significant bit plane across image coordinates:
- The backend renders a scaled 1-bit monochrome bitmap ($0 \to \text{black } (0), 1 \to \text{white } (255)$).
- Rendered with CSS `.pixelated` (`image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;`).
- Features:
  - **Invert Mode**: Inverts black/white pixels to highlight sparse bit modifications.
  - **High Contrast**: Boosts local edge gradients (`contrast-150`).
  - **Forensic Zoom Modal**: Fullscreen modal utilizing nearest-neighbor interpolation to inspect individual pixel clusters without anti-aliasing blur.

### 4.3. 256-Bin Spectral RGB Histogram (`HistogramChart.tsx`)
Visualizes the frequency distribution of pixel intensities ($I \in [0, 255]$):
- Powered by Chart.js with responsive canvas resizing.
- Visualizes Red, Green, Blue, and Luminance channels.
- Renders **Pair-of-Values (PoV) pairing deltas**:
  $$\Delta_{\text{PoV}} = \frac{1}{128} \sum_{k=0}^{127} |h(2k) - h(2k+1)|$$
- Detects the tell-tale "comb effect" and pair equalization characteristic of LSB substitution.

### 4.4. Live Carrier Capacity Meter (`CapacityMeter.tsx`)
Dynamic calculation of available carrier bits versus required payload size:
- Computes maximum theoretical bit limit:
  $$\text{Max Bytes} = \left\lfloor \frac{\text{Width} \times \text{Height} \times 3}{8} \right\rfloor$$
- Subtracts the 64-byte container header and 32-byte SHA-256 integrity trailer (96 bytes total overhead).
- Displays progressive capacity bar with color transitions:
  - Green ($<40\%$) $\to$ Teal ($40–75\%$) $\to$ Amber ($>75\%$) $\to$ Red (Overflow / Insufficient).

---

## 5. State Management & Context Architecture

StegoVault intentionally employs lightweight React Context rather than bulky state management libraries:

### `EducationalContext`
```typescript
interface EducationalContextType {
  isEduMode: boolean;
  toggleEduMode: () => void;
}
```
- **Persistence**: Synced with browser `localStorage.getItem('stegovault_edu_mode')`.
- **Default State**: `true` (enabling pedagogical explainers out-of-the-box for cybersecurity learners).
- **Consumption**: Consumed via the `useEducational()` hook.

### Navigation State
Handled via reactive top-level state in `App.tsx`:
- Active tab identifier: `'dashboard' | 'encode' | 'decode' | 'analyzer' | 'reports' | 'settings' | 'about'`.
- Supports parameter passing (e.g. clicking a report on Dashboard navigates directly to `reports` with `selectedReportId`).

---

## 6. Type Safety & API Contracts (`types/index.ts`)

The frontend adheres to strict TypeScript contracts matching FastAPI Pydantic schemas:
- `ForensicReport`: Contains the complete 13-section report structure (`section_1_file_information` through `section_13_limitations`).
- `EncodeResponse`: Contains `output_filename`, `download_url`, `payload_bytes`, `capacity_utilization`, `cover_sha256`, and `stego_sha256`.
- `DecodeResponse`: Contains `secret_message`, `payload_bytes`, `integrity_verified`, `header_crc_valid`, `sha256_valid`, and `security_parameters`.

---

## 7. Performance & Optimization

1. **Pixelated Rendering**: Hardware-accelerated image scaling prevents browser smoothing algorithms from destroying raw bit distributions.
2. **Chunk Splitting & Tree Shaking**: Rollup bundle minification via Vite.
3. **Debounced Calculations**: Capacity estimations and passphrase evaluations run client-side without latency-inducing network roundtrips.
4. **Memory Management**: Uploaded file objects are previewed via ephemeral `URL.createObjectURL` and revoked upon unmount.
