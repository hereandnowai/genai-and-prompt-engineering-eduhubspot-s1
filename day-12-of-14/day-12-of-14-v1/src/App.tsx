import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileUp,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  XCircle
} from "lucide-react";
import { extractIdentityFields } from "./lib/documentExtraction";
import { compareIdentity } from "./lib/matching";
import { fileToOcrSource, recognizeIdentityText, validateDocumentFile } from "./lib/ocr";
import type { DocumentType, FieldStatus, OcrProgress, VerificationResult } from "./lib/types";

const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: "passport", label: "Passport" },
  { value: "aadhaar", label: "Aadhaar card" }
];

export default function App() {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("passport");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canVerify = useMemo(
    () => fullName.trim().length > 1 && Boolean(dateOfBirth) && Boolean(selectedFile) && !isProcessing,
    [dateOfBirth, fullName, isProcessing, selectedFile]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!selectedFile) {
      setError("Upload a passport or Aadhaar card before running verification.");
      return;
    }

    const fileError = validateDocumentFile(selectedFile);
    if (fileError) {
      setError(fileError);
      return;
    }

    setIsProcessing(true);
    setProgress({ status: "Preparing document", progress: 0.04 });

    try {
      const source = await fileToOcrSource(selectedFile);
      setProgress({ status: "Reading document", progress: 0.12 });
      const rawText = await recognizeIdentityText(source, setProgress);

      if (rawText.replace(/\s/g, "").length < 12) {
        throw new Error("The document was unreadable. Try a sharper, better-lit scan or PDF.");
      }

      const extracted = extractIdentityFields(rawText, documentType);
      setResult(compareIdentity(fullName.trim(), dateOfBirth, extracted));
      setProgress({ status: "Verification complete", progress: 1 });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The document could not be processed. Try another JPG, PNG, or PDF."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError(null);
    setResult(null);
    setProgress(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const fileError = validateDocumentFile(file);
    if (fileError) {
      setError(fileError);
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  function clearSession() {
    setFullName("");
    setDateOfBirth("");
    setDocumentType("passport");
    setSelectedFile(null);
    setIsProcessing(false);
    setProgress(null);
    setError(null);
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Session-only verification</p>
          <h1>Identity Document Verifier</h1>
        </div>
        <div className="privacy-pill" title="No server upload or persistent browser storage is used.">
          <ShieldCheck aria-hidden="true" size={18} />
          <span>No PII stored</span>
        </div>
      </header>

      <div className="workspace-grid">
        <section className="panel input-panel" aria-labelledby="verification-form-title">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">User details</p>
              <h2 id="verification-form-title">Verify name and date of birth</h2>
            </div>
            <FileText aria-hidden="true" size={22} />
          </div>

          <form className="verification-form" onSubmit={handleSubmit}>
            <label className="field-group">
              <span>Full name</span>
              <input
                autoComplete="name"
                name="fullName"
                placeholder="Enter the full name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>

            <label className="field-group">
              <span>Date of birth</span>
              <input
                autoComplete="bday"
                name="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </label>

            <fieldset className="field-group document-type-group">
              <legend>Document type</legend>
              <div className="segmented-control">
                {DOCUMENT_TYPES.map((type) => (
                  <label key={type.value} className={documentType === type.value ? "active" : ""}>
                    <input
                      checked={documentType === type.value}
                      name="documentType"
                      type="radio"
                      value={type.value}
                      onChange={() => setDocumentType(type.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="upload-zone">
              <input
                ref={fileInputRef}
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                type="file"
                onChange={handleFileChange}
              />
              <FileUp aria-hidden="true" size={24} />
              <span className="upload-title">{selectedFile ? selectedFile.name : "Upload identity proof"}</span>
              <span className="upload-meta">JPG, PNG, or PDF up to 10 MB</span>
            </label>

            <div className="action-row">
              <button className="primary-button" disabled={!canVerify} title="Run verification" type="submit">
                <ScanSearch aria-hidden="true" size={18} />
                <span>{isProcessing ? "Verifying" : "Verify"}</span>
              </button>
              <button className="secondary-button" title="Clear session" type="button" onClick={clearSession}>
                <RotateCcw aria-hidden="true" size={18} />
                <span>Clear</span>
              </button>
            </div>
          </form>
        </section>

        <section className="panel result-panel" aria-live="polite" aria-labelledby="verification-result-title">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Verification result</p>
              <h2 id="verification-result-title">Match status</h2>
            </div>
            {result?.overallStatus === "match" ? (
              <CheckCircle2 aria-hidden="true" className="success-icon" size={24} />
            ) : result ? (
              <XCircle aria-hidden="true" className="danger-icon" size={24} />
            ) : (
              <ShieldCheck aria-hidden="true" size={24} />
            )}
          </div>

          {progress && <ProgressMeter progress={progress} />}
          {error && <ErrorNotice message={error} />}

          {!result && !error && !isProcessing && (
            <div className="empty-state">
              <ShieldCheck aria-hidden="true" size={34} />
              <p>Ready to compare the entered identity details with the uploaded document.</p>
            </div>
          )}

          {result && (
            <div className="result-stack">
              <div className={`status-banner ${result.overallStatus}`}>
                {result.overallStatus === "match" ? (
                  <CheckCircle2 aria-hidden="true" size={22} />
                ) : (
                  <XCircle aria-hidden="true" size={22} />
                )}
                <strong>{result.overallStatus === "match" ? "Match" : "Mismatch"}</strong>
              </div>

              <FieldFeedback label="Name" field={result.name} />
              <FieldFeedback label="Date of birth" field={result.dateOfBirth} />

              {result.extracted.warnings.length > 0 && (
                <div className="warning-list">
                  <AlertTriangle aria-hidden="true" size={18} />
                  <div>
                    {result.extracted.warnings.map((warning) => (
                      <p key={warning}>{warning}</p>
                    ))}
                  </div>
                </div>
              )}

              <details className="ocr-details">
                <summary>OCR text</summary>
                <pre>{result.extracted.rawText}</pre>
              </details>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ProgressMeter({ progress }: { progress: OcrProgress }) {
  const width = `${Math.max(4, Math.round(progress.progress * 100))}%`;

  return (
    <div className="progress-card">
      <div className="progress-label">
        <span>{progress.status}</span>
        <span>{Math.round(progress.progress * 100)}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width }} />
      </div>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="error-notice" role="alert">
      <AlertTriangle aria-hidden="true" size={20} />
      <span>{message}</span>
    </div>
  );
}

function FieldFeedback({
  label,
  field
}: {
  label: string;
  field: VerificationResult["name"];
}) {
  return (
    <div className={`field-feedback ${field.status}`}>
      <StatusIcon status={field.status} />
      <div>
        <div className="feedback-heading">
          <strong>{label}</strong>
          <span>{statusLabel(field.status)}</span>
        </div>
        <p>{field.message}</p>
        <dl>
          <div>
            <dt>Entered</dt>
            <dd>{field.entered || "Not provided"}</dd>
          </div>
          <div>
            <dt>Extracted</dt>
            <dd>{field.extracted || "Not found"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: FieldStatus }) {
  if (status === "match") {
    return <CheckCircle2 aria-hidden="true" className="success-icon" size={22} />;
  }

  if (status === "missing") {
    return <AlertTriangle aria-hidden="true" className="warning-icon" size={22} />;
  }

  return <XCircle aria-hidden="true" className="danger-icon" size={22} />;
}

function statusLabel(status: FieldStatus): string {
  if (status === "match") {
    return "Matched";
  }

  if (status === "missing") {
    return "Missing";
  }

  return "Mismatch";
}
