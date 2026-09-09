# StegoVault Technical Documentation Hub

Welcome to the **StegoVault** technical documentation repository. This directory contains detailed manuals, specifications, mathematical foundations, and developer guides for the StegoVault steganography and digital forensics platform.

---

## 📚 Documentation Index

| Manual | Focus & Core Topics | Target Audience |
| :--- | :--- | :--- |
| **[Academic Project Report](../PROJECT_REPORT.md)** | Formal academic thesis/project report formatted according to university examination guidelines. | Students, Examiners, Academic Guides |
| **[Master Technical Reference](../DOCUMENTATION.md)** | Complete end-to-end reference manual covering every module, formula, and specification. | All Technical Audiences |
| **[System Architecture](architecture.md)** | Multi-tier architecture, system diagrams, directory layouts, and inter-service data flows. | Architects, Lead Engineers |
| **[Spatial LSB Steganography](steganography.md)** | LSB modulation mathematics, RGB/RGBA channel isolation, 64-byte container format, and capacity limits. | Cryptographers, Forensics Researchers |
| **[Cryptographic Subsystem](encryption.md)** | AES-256-GCM authenticated encryption, PBKDF2-HMAC-SHA256 (600,000 rounds), CSPRNG salts, and tamper detection. | Security Engineers, Cryptographers |
| **[Steganalysis & Risk Engine](analyzer.md)** | Multi-layer Shannon entropy, Westfeld-Pfitzmann Chi-Square ($\chi^2$) test, RGB histograms, Pearson correlation, and 0–100 scoring. | Forensic Analysts, Incident Responders |
| **[Frontend Architecture](frontend.md)** | React 19 SPA, Matrix Emerald design system, interactive LSB simulator, Chart.js spectra, and Educational Mode. | Frontend Developers, UI/UX Engineers |
| **[REST API Specification](api.md)** | Complete HTTP endpoint schemas, request/response JSON payloads, status codes, and `curl` examples. | API Integrators, Full-Stack Developers |
| **[Developer & Operations Guide](developer-guide.md)** | Local environment setup, one-click launcher scripts (`start.bat`/`start.ps1`), test automation, and production deployment. | Software Engineers, DevOps/SREs |
| **[Testing & QA Strategy](testing.md)** | 43 automated Pytest test cases, synthetic test dataset descriptions, and coverage matrices. | QA Engineers, Test Automators |
| **[Threat Model & Security](threat-model.md)** | STRIDE matrix, adversary models (Eve, Mallory, Trent), cryptographic guarantees, and residual risk. | Security Auditors, Threat Modelers |
| **[Known Limitations](limitations.md)** | Inherent boundaries of spatial LSB steganography, lossy compression limits, and future research vectors. | Researchers, Forensic Investigators |

---

## 🧭 Recommended Reading Paths

### 1. For Digital Forensics Analysts & Researchers
1. Start with **[Steganalysis & Risk Engine](analyzer.md)** to understand how StegoVault detects subtle statistical anomalies.
2. Read **[Spatial LSB Steganography](steganography.md)** for the exact binary structure of the 64-byte container.
3. Review **[Known Limitations](limitations.md)** to understand detection boundaries and low-capacity embedding evasion.

### 2. For Software Engineers & Contributors
1. Read **[System Architecture](architecture.md)** for a high-level view of backend and frontend boundaries.
2. Follow **[Developer & Operations Guide](developer-guide.md)** to set up your environment with `start.bat` or manual commands.
3. Consult **[Testing & QA Strategy](testing.md)** and ensure all 43 tests pass before submitting code.

### 3. For Security Auditors & Penetration Testers
1. Inspect **[Threat Model & Security](threat-model.md)** for the formal STRIDE analysis and residual risks.
2. Review **[Cryptographic Subsystem](encryption.md)** for nonce hygiene, key derivation parameters, and constant-time verification.
3. Examine **[REST API Specification](api.md)** for input sanitization and boundary enforcement.

### 4. For Frontend & UI Engineers
1. Read **[Frontend Architecture](frontend.md)** for the React 19 component tree, styling tokens, and canvas microscopes.
2. Check the [Frontend README](../frontend/README.md) for local Vite workflow details.
