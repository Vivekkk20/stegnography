# StegoVault Developer & Operations Guide

This guide covers local environment setup, testing procedures, automation scripts, code quality standards, and production deployment patterns for the StegoVault platform.

---

## 1. Prerequisites & System Requirements

### Recommended System Specifications
- **Operating System:** Windows 10/11, macOS 12+, or Ubuntu 22.04+ LTS.
- **Python:** Python 3.10 to 3.14 (tested and verified on Python 3.14).
- **Node.js:** Node.js 18.x or higher (tested on Node v22 and v24) with npm.
- **RAM:** 4 GB minimum (8 GB recommended for 20MB raw image processing).
- **Disk:** ~500 MB for environments, dependencies, and test datasets.

---

## 2. Quick-Start Scripts

StegoVault provides automated scripts for zero-friction local development:

### 2.1. Windows Automated Launcher (`start.bat` / `start.ps1`)
Double-click `start.bat` in the project root, or execute via terminal:
```cmd
start.bat
```
Or via PowerShell:
```powershell
.\start.ps1
```

**What this script does:**
1. Verifies Python and Node.js installations.
2. Checks for or initializes the backend virtual environment (`backend/.venv`).
3. Installs backend dependencies (`backend/requirements.txt`).
4. Generates the synthetic test dataset (`scripts/generate_test_data.py`) if not present.
5. Installs frontend dependencies (`npm install` in `frontend/`).
6. Concurrently launches the FastAPI backend on `http://127.0.0.1:8000` and the Vite dev server on `http://127.0.0.1:5173`.
7. Automatically launches your default browser to `http://localhost:5173`.

### 2.2. Automated Test & Build Suite (`scripts\run_tests.bat`)
Runs the full verification pipeline:
```cmd
scripts\run_tests.bat
```
**Steps executed:**
1. Runs all 43 backend Pytest test cases.
2. Validates the synthetic test dataset.
3. Compiles the frontend TypeScript codebase (`tsc -b`).
4. Builds the production frontend bundle (`vite build`).

---

## 3. Manual Step-by-Step Setup

If you prefer manual control over backend and frontend services:

### 3.1. Backend Service Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv .venv

# 3. Activate virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Windows (CMD):
.venv\Scripts\activate.bat
# On Linux / macOS:
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Generate synthetic test images (from repository root)
python ../scripts/generate_test_data.py

# 6. Start FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- Backend API: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

### 3.2. Frontend Service Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite dev server
npm run dev
```

- Frontend SPA: `http://127.0.0.1:5173`

---

## 4. Testing & Quality Assurance

StegoVault mandates high test coverage across cryptographic, steganographic, and security boundaries.

### 4.1. Running Backend Tests (Pytest)

```bash
cd backend
.venv\Scripts\pytest -v
```

To run with coverage reporting:
```bash
pytest --cov=app --cov-report=term-missing tests/
```

### Test File Directory & Responsibilities

| Test Module | Coverage & Test Scenarios |
| :--- | :--- |
| `tests/test_crypto.py` | AES-256-GCM encryption/decryption roundtrips; wrong passphrase rejection; flipped ciphertext bit rejection; corrupted 128-bit authentication tag rejection; PBKDF2 iteration verification. |
| `tests/test_payload.py` | 64-byte container pack/unpack; Big-Endian byte parsing; CRC32 header calculation; corrupted header detection; SHA-256 payload trailer validation. |
| `tests/test_steganography.py` | Usable capacity estimation; RGB & RGBA spatial LSB embedding/extraction; boundary truncation prevention; payload overflow error handling. |
| `tests/test_steganalysis.py` | Multi-layer Shannon byte ($0–8$) and bit-plane ($0–1$) entropy; Westfeld-Pfitzmann Chi-Square ($\chi^2$) PoV equalization; 256-bin RGB histograms; Pearson correlation ($r$); Trailing data past legal EOF (`IEND` / `bfSize`). |
| `tests/test_security.py` | Magic byte validation (`\x89PNG`, `BM`) against extension spoofing; lossy format rejection (JPEG); 20MB file size boundary; decompression bomb mitigation; path traversal prevention. |
| `tests/test_dataset.py` | Automated integrity and risk scoring verification of all 7 synthetic dataset images in `test_data/`. |
| `tests/test_api.py` | End-to-end HTTP integration tests across `/health`, `/capacity`, `/encode`, `/decode`, `/analyze`, and `/reports`. |

### 4.2. Frontend Code Quality & Verification

```bash
cd frontend

# Type-checking & production bundling
npm run build

# Fast Rust-based linting
npm run lint
```

---

## 5. Synthetic Dataset Generation (`scripts/generate_test_data.py`)

To ensure consistent testing across machines without relying on copyright-protected or unverified images, StegoVault includes a deterministic synthetic image generator.

Run:
```bash
python scripts/generate_test_data.py
```

Generated artifacts in `test_data/`:
1. `normal.png` (512×512 RGB): Continuous color gradients simulating camera sensor baseline. **Clean**, Risk $\le 20$.
2. `stego_low.png`: Embedded StegoVault payload occupying $< 1\%$ capacity. Tests low-rate stealth embedding.
3. `stego_medium.png`: Moderate density payload ($\approx 10\%$ capacity).
4. `stego_high.png`: Dense payload ($> 50\%$ capacity). Triggers Chi-Square PoV and bit-plane entropy anomalies.
5. `corrupted.png`: Carrier with flipped LSB bits in the container header to verify CRC32 and GCM tag rejection.
6. `metadata_test.png`: PNG image injected with custom `tEXt` and `tIME` chunks for metadata testing.
7. `trailing_data_test.png`: PNG image with 191 bytes appended past the legal `IEND` chunk. Tests EOF detection.

---

## 6. Production Deployment Patterns

StegoVault can be deployed in production environments as a self-hosted forensic utility or internal laboratory service.

### 6.1. Production Architecture Overview

```
                      +-----------------------------+
                      | Nginx / Cloudflare (HTTPS)  |
                      | Port 443 (TLS Termination)  |
                      +-----------------------------+
                                     |
                    +----------------+----------------+
                    |                                 |
           /api/v1 requests                  Static Assets (SPA)
                    v                                 v
      +---------------------------+     +---------------------------+
      |      Uvicorn Workers      |     |    Nginx Static Root      |
      |   127.0.0.1:8000 (ASGI)   |     |   /frontend/dist/ (HTML)  |
      +---------------------------+     +---------------------------+
```

### 6.2. Backend Production Deployment (Gunicorn + Uvicorn)

```bash
pip install gunicorn uvicorn

# Launch with 4 worker processes
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 127.0.0.1:8000 \
  --access-logfile - \
  --error-logfile -
```

### 6.3. Frontend Production Build

```bash
cd frontend
npm run build
```
Copy contents of `frontend/dist/` to your web server root (e.g. `/var/www/stegovault/html`).

### 6.4. Sample Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name stegovault.internal;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name stegovault.internal;

    ssl_certificate     /etc/ssl/certs/stegovault.crt;
    ssl_certificate_key /etc/ssl/private/stegovault.key;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 20MB Maximum File Ingestion Boundary
    client_max_body_size 20M;

    # Static Frontend SPA
    location / {
        root /var/www/stegovault/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 7. Security Invariants for Developers

When extending or maintaining StegoVault, preserve these non-negotiable security invariants:

1. **Zero Unauthenticated Plaintext**: Never implement an encoding mode that skips authenticated encryption (AES-256-GCM). Unauthenticated payloads expose users to statistical signature detection and unverified integrity risks.
2. **Magic Byte Validation Precedence**: Always validate file magic numbers (`\x89PNG\r\n\x1a\n` or `BM`) before handing buffers to Pillow or image decoders. Do not rely on MIME types or filename extensions.
3. **Strict Size Ceilings**: Enforce the 20MB ingestion limit before reading entire bodies into memory to prevent memory exhaustion / DoS attacks.
4. **Log Sanitization**: Never log passphrases, derived keys, nonces, raw payload text, or sensitive user data in stdout, stderr, or report files.
5. **Constant-Time Verification**: Always use `hmac.compare_digest` when verifying authentication tags, hashes, or checksums.
