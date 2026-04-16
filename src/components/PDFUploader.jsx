/**
 * components/PDFUploader.jsx
 * --------------------------
 * Staff-only PDF upload component.
 *
 * Features:
 * - Drag-and-drop or click-to-browse file selection
 * - Client-side validation (PDF only, max 10 MB)
 * - Simulates upload with a progress bar + delay
 * - Maintains an in-memory list of uploaded documents
 * - Allows deletion of uploaded documents
 *
 * In production, the upload would:
 * 1. POST /api/staff/documents with FormData (using Multer middleware on Express)
 * 2. Server saves the file to disk or AWS S3
 * 3. Server stores metadata in PostgreSQL: (id, filename, uploader_id, size, url, created_at)
 * 4. Server returns the saved document record as JSON
 *
 * Multer example (server/middleware/upload.js):
 *   const multer = require('multer');
 *   const upload = multer({ dest: 'uploads/', limits: { fileSize: 10_000_000 } });
 *   router.post('/documents', upload.single('pdf'), documentController.create);
 */

import React, { useState, useRef, useCallback } from "react";
import "../styles/staff.css";

// Max allowed file size: 10 MB (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Formats a byte count into a human-readable string.
 * e.g. 1_048_576 → "1.0 MB"
 */
function formatFileSize(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1_048_576)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

export default function PDFUploader() {
  // List of successfully uploaded document objects
  const [documents, setDocuments] = useState([
    // Seed with a couple of example documents so the list isn't empty on first load
    {
      id: "doc-seed-1",
      name: "2024_Academic_Calendar.pdf",
      size: 245_120,
      uploadedAt: new Date("2024-03-01T09:00:00"),
      category: "Admin",
    },
    {
      id: "doc-seed-2",
      name: "IT_NQF4_Curriculum_Guide.pdf",
      size: 1_245_000,
      uploadedAt: new Date("2024-03-10T14:30:00"),
      category: "Curriculum",
    },
  ]);

  // Upload status: null | 'uploading' | 'success' | 'error'
  const [uploadStatus, setUploadStatus] = useState(null);

  // Upload progress percentage (0-100)
  const [progress, setProgress] = useState(0);

  // Error message shown when validation fails
  const [uploadError, setUploadError] = useState("");

  // Category tag selected by the user before uploading
  const [category, setCategory] = useState("Admin");

  // Whether the drag-over drop zone is active
  const [isDragOver, setIsDragOver] = useState(false);

  // Hidden <input type="file"> — triggered programmatically on button click
  const fileInputRef = useRef(null);

  /**
   * validateAndUpload()
   * Validates the selected File object, then simulates an HTTP upload.
   *
   * @param {File} file — the File object from the input or drop event
   */
  const validateAndUpload = useCallback(async (file) => {
    // Reset state
    setUploadError("");
    setUploadStatus(null);
    setProgress(0);

    // ── Validation ────────────────────────────────────────────────────
    if (!file) return;

    // Only PDF files allowed
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are accepted. Please select a .pdf file.");
      return;
    }

    // File size limit
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File is too large (${formatFileSize(file.size)}). Maximum size is 10 MB.`);
      return;
    }

    // ── Simulated Upload ──────────────────────────────────────────────
    setUploadStatus("uploading");

    // Simulate chunked upload progress (in production: XHR with onprogress event)
    for (let pct = 0; pct <= 100; pct += 20) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setProgress(pct);
    }

    // Simulate server responding with the saved document record
    const newDocument = {
      id: `doc-${Date.now()}`,   // In production: UUID from PostgreSQL
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      category,
    };

    // Add to local list (in production: refetch from API or append server response)
    setDocuments((prev) => [newDocument, ...prev]);
    setUploadStatus("success");

    // Auto-clear success message after 3 seconds
    setTimeout(() => setUploadStatus(null), 3000);
  }, [category]);

  /**
   * handleFileInput — fires when user selects a file via the file browser dialog
   */
  function handleFileInput(e) {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
    // Reset the input so the same file can be re-selected after deletion
    e.target.value = "";
  }

  /**
   * handleDrop — fires when user drops a file onto the drop zone
   */
  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  }

  /**
   * deleteDocument — removes a document from the local list.
   * In production: DELETE /api/staff/documents/:id
   */
  function deleteDocument(id) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  return (
    <div className="pdf-uploader">

      {/* ── Category Selector ── */}
      <div className="uploader-meta">
        <label className="uploader-label" htmlFor="category">Document Category</label>
        <select
          id="category"
          className="uploader-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Admin</option>
          <option>Curriculum</option>
          <option>Student Support</option>
          <option>Finance</option>
          <option>Policy</option>
        </select>
      </div>

      {/* ── Drop Zone ── */}
      <div
        className={`drop-zone ${isDragOver ? "drop-zone-active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Click or drag a PDF file to upload"
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      >
        {/* Hidden file input — only PDFs allowed */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />

        <div className="drop-zone-icon">📄</div>
        <p className="drop-zone-text">
          <strong>Click to browse</strong> or drag & drop a PDF here
        </p>
        <p className="drop-zone-hint">PDF only · Max 10 MB</p>
      </div>

      {/* ── Validation Error ── */}
      {uploadError && (
        <div className="upload-error" role="alert">
          ⚠ {uploadError}
        </div>
      )}

      {/* ── Progress Bar ── */}
      {uploadStatus === "uploading" && (
        <div className="upload-progress-wrap">
          <div className="upload-progress-label">
            Uploading... {progress}%
          </div>
          <div className="upload-progress-bar">
            <div
              className="upload-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Success Message ── */}
      {uploadStatus === "success" && (
        <div className="upload-success" role="status">
          ✓ Document uploaded successfully
        </div>
      )}

      {/* ── Document List ── */}
      <div className="document-list">
        <h3 className="document-list-title">
          Uploaded Documents ({documents.length})
        </h3>

        {documents.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            No documents uploaded yet.
          </p>
        ) : (
          <ul className="document-items">
            {documents.map((doc) => (
              <li key={doc.id} className="document-item">

                {/* File icon + name + size */}
                <div className="document-info">
                  <span className="document-icon">📋</span>
                  <div>
                    <div className="document-name">{doc.name}</div>
                    <div className="document-meta">
                      {formatFileSize(doc.size)} ·{" "}
                      {doc.uploadedAt.toLocaleDateString("en-ZA", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Category badge + delete button */}
                <div className="document-actions">
                  <span className="badge badge-info">{doc.category}</span>
                  <button
                    className="btn-danger"
                    onClick={() => deleteDocument(doc.id)}
                    aria-label={`Delete ${doc.name}`}
                    style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                  >
                    Delete
                  </button>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

