"use client";

import { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:5000/api";

const api = {
  getAllBooks: async (search = "", category = "All") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);
    const res = await fetch(`${BASE_URL}/books?${params}`);
    return res.json();
  },
  uploadBook: async (formData) => {
    const res = await fetch(`${BASE_URL}/books/upload`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },
  deleteBook: async (id) => {
    const res = await fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" });
    return res.json();
  },
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/books/categories`);
    return res.json();
  },
  getAllIssued: async (search = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const res = await fetch(`${BASE_URL}/issued?${params}`);
    return res.json();
  },
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/issued/stats`);
    return res.json();
  },
  issueBook: async (payload) => {
    const res = await fetch(`${BASE_URL}/issued`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  returnBook: async (id) => {
    const res = await fetch(`${BASE_URL}/issued/${id}/return`, {
      method: "PATCH",
    });
    return res.json();
  },
};

// ─── Upload Modal ───────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    course: "",
    subject: "",
  });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
    else setError("Only PDF files are accepted");
  };

  const handleUpload = async () => {
    if (
      !form.name ||
      !form.category ||
      !form.course ||
      !form.subject ||
      !file
    ) {
      setError("All fields including PDF are required");
      return;
    }
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category", form.category);
    fd.append("course", form.course);
    fd.append("subject", form.subject);
    fd.append("file", file);
    const result = await api.uploadBook(fd);
    setUploading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } else {
      setError(result.message || "Upload failed");
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f1629",
          border: "1px solid #1e3a5f",
          borderRadius: 24,
          width: "min(95vw, 560px)",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1a3a6e 0%, #0d2348 100%)",
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #1e3a5f",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
              }}
            >
              📤
            </div>
            <div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontWeight: 800,
                  fontSize: 17,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Upload New Book
              </div>
              <div style={{ color: "#64748b", fontSize: 12 }}>
                Add to library collection
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#f87171",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {[
              {
                label: "Book Name",
                key: "name",
                placeholder: "e.g. Calculus Vol. 1",
              },
              {
                label: "Category",
                key: "category",
                placeholder: "e.g. Science, Tech",
              },
              {
                label: "Course",
                key: "course",
                placeholder: "e.g. B.Tech, BCA",
              },
              {
                label: "Subject",
                key: "subject",
                placeholder: "e.g. Mathematics",
              },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: "0.8px",
                    marginBottom: 7,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid #1e3a5f",
                    borderRadius: 10,
                    padding: "11px 14px",
                    color: "#e2e8f0",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.background = "rgba(59,130,246,0.06)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#1e3a5f";
                    e.target.style.background = "rgba(255,255,255,0.04)";
                  }}
                />
              </div>
            ))}
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => document.getElementById("admin-pdf-input").click()}
            style={{
              border: `2px dashed ${dragging ? "#3b82f6" : file ? "#10b981" : "#1e3a5f"}`,
              borderRadius: 14,
              background: dragging
                ? "rgba(59,130,246,0.06)"
                : file
                  ? "rgba(16,185,129,0.06)"
                  : "rgba(255,255,255,0.02)",
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: file
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(59,130,246,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {file ? "✅" : "📄"}
            </div>
            <div style={{ flex: 1 }}>
              {file ? (
                <>
                  <div
                    style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}
                  >
                    {file.name}
                  </div>
                  <div style={{ color: "#6ee7b7", fontSize: 12, marginTop: 2 }}>
                    {(file.size / 1024).toFixed(1)} KB · PDF Ready
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{ color: "#3b82f6", fontWeight: 600, fontSize: 14 }}
                  >
                    Click to choose or drag & drop
                  </div>
                  <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>
                    PDF files only • Max 50MB
                  </div>
                </>
              )}
            </div>
            {file && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            )}
          </div>
          <input
            id="admin-pdf-input"
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <button
            onClick={handleUpload}
            disabled={uploading || success}
            style={{
              background: success
                ? "linear-gradient(135deg, #10b981, #059669)"
                : uploading
                  ? "rgba(59,130,246,0.3)"
                  : "linear-gradient(135deg, #3b82f6, #06b6d4)",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              color: success || !uploading ? "#fff" : "#93c5fd",
              fontWeight: 700,
              fontSize: 15,
              cursor: uploading || success ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: success
                ? "0 4px 14px rgba(16,185,129,0.35)"
                : uploading
                  ? "none"
                  : "0 4px 14px rgba(59,130,246,0.35)",
              transition: "all 0.3s",
              marginTop: 4,
            }}
          >
            {success
              ? "✅ Uploaded Successfully!"
              : uploading
                ? "⏳ Uploading..."
                : "⬆ Upload Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Issue Book Modal ───────────────────────────────────────────────
function IssueBookModal({ book, onClose, onSuccess }) {
  const [form, setForm] = useState({
    studentName: "",
    department: "",
    issueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const endDate = form.issueDate
    ? (() => {
        const d = new Date(form.issueDate);
        d.setDate(d.getDate() + 14);
        return d.toISOString().split("T")[0];
      })()
    : "";

  const handleConfirm = async () => {
    if (!form.studentName || !form.department || !form.issueDate) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true);
    const result = await api.issueBook({ bookId: book._id, ...form });
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1400);
    } else setError(result.message || "Failed to issue book");
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f1629",
          border: "1px solid #1e3a5f",
          borderRadius: 24,
          width: "min(92vw, 460px)",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1a3a6e, #0d2348)",
            padding: "22px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #1e3a5f",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${book.color || "#6366f1"}, ${book.color || "#6366f1"}aa)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: `0 4px 14px ${book.color || "#6366f1"}44`,
              }}
            >
              📋
            </div>
            <div>
              <div style={{ color: "#e2e8f0", fontWeight: 800, fontSize: 16 }}>
                Issue Book
              </div>
              <div style={{ color: "#64748b", fontSize: 12 }}>{book.name}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#f87171",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {[
            {
              label: "Student Name",
              key: "studentName",
              placeholder: "Enter full name",
            },
            {
              label: "Department",
              key: "department",
              placeholder: "e.g. Computer Science",
            },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: 6,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </label>
              <input
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid #1e3a5f",
                  borderRadius: 10,
                  padding: "11px 14px",
                  color: "#e2e8f0",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = book.color || "#6366f1";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#1e3a5f";
                }}
              />
            </div>
          ))}

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: 6,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                Issue Date
              </label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, issueDate: e.target.value }))
                }
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid #1e3a5f",
                  borderRadius: 10,
                  padding: "11px 14px",
                  color: "#e2e8f0",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: 6,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                End Date <span style={{ color: "#10b981" }}>(Auto)</span>
              </label>
              <input
                type="date"
                value={endDate}
                readOnly
                style={{
                  width: "100%",
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: 10,
                  padding: "11px 14px",
                  color: "#6ee7b7",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "not-allowed",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#475569",
                marginBottom: 6,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Book
            </label>
            <div
              style={{
                background: `${book.color || "#6366f1"}15`,
                border: `1px solid ${book.color || "#6366f1"}44`,
                borderRadius: 10,
                padding: "11px 14px",
                color: book.color || "#6366f1",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {book.name}
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={loading || submitted}
            style={{
              background: submitted
                ? "linear-gradient(135deg, #10b981, #059669)"
                : loading
                  ? "rgba(99,102,241,0.3)"
                  : `linear-gradient(135deg, ${book.color || "#6366f1"}, ${book.color || "#6366f1"}cc)`,
              border: "none",
              borderRadius: 12,
              padding: "14px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading || submitted ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: submitted
                ? "0 4px 14px rgba(16,185,129,0.4)"
                : `0 4px 14px ${book.color || "#6366f1"}44`,
              transition: "all 0.3s",
              marginTop: 4,
            }}
          >
            {submitted
              ? "✅ Book Issued!"
              : loading
                ? "⏳ Issuing..."
                : "✅ Confirm Issue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Viewer ─────────────────────────────────────────────────────
function PDFViewer({ book, onClose, onIssueClick }) {
  const [isFull, setIsFull] = useState(false);
  const pdfUrl =
    book.file ||
    (book.pdfFile ? `http://localhost:5000/uploads/${book.pdfFile}` : "");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f1629",
          border: "1px solid #1e3a5f",
          borderRadius: isFull ? 0 : 20,
          width: isFull ? "100vw" : "min(95vw, 1100px)",
          height: isFull ? "100vh" : "min(92vh, 820px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #1e3a5f",
            flexShrink: 0,
            background: "#0d1526",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `${book.color || "#6366f1"}22`,
                border: `1px solid ${book.color || "#6366f1"}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              📚
            </div>
            <div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>
                {book.name}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: book.color || "#6366f1",
                  background: `${book.color || "#6366f1"}15`,
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                {book.category}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => onIssueClick(book)}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
              }}
            >
              📋 Issue Book
            </button>
            <button
              onClick={() => setIsFull((f) => !f)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #1e3a5f",
                color: "#94a3b8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isFull ? "⊡" : "⛶"}
            </button>
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div style={{ flex: 1, background: "#060d1a" }}>
          <iframe
            src={pdfUrl}
            title={book.name}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Book Card ──────────────────────────────────────────────────────
function BookCard({ book, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#111827" : "#0d1526",
        border: `1px solid ${hovered ? book.color || "#6366f1" : "#1e3a5f"}`,
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${book.color || "#6366f1"}33`
          : "none",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${book.color || "#6366f1"}, transparent)`,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `${book.color || "#6366f1"}15`,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${book.color || "#6366f1"}33`,
          }}
        >
          📚
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book._id);
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            🗑
          </button>
        )}
      </div>
      <div>
        <div
          style={{
            color: "#e2e8f0",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1.3,
          }}
        >
          {book.name}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: book.color || "#6366f1",
            background: `${book.color || "#6366f1"}15`,
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 600,
          }}
        >
          {book.category}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#334155" }}>
        {book.course} · {book.subject}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          color: "#334155",
          marginTop: "auto",
        }}
      >
        <span>📄</span> Click to open PDF
      </div>
    </div>
  );
}

// ─── Stats Bar ──────────────────────────────────────────────────────
function StatPill({ label, value, color }) {
  return (
    <div
      style={{
        background: `${color}10`,
        border: `1px solid ${color}30`,
        borderRadius: 12,
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 12, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ─── Issued Books Table ─────────────────────────────────────────────
function IssuedTable({ books, onReturn }) {
  return (
    <div
      style={{
        background: "#0d1526",
        border: "1px solid #1e3a5f",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#0a1020" }}>
              {[
                "#",
                "Book",
                "Student",
                "Department",
                "Issued",
                "Returns",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "14px 16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #1e3a5f",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((book, idx) => {
              const dl = book.daysLeft;
              const expired = dl < 0;
              const critical = !expired && dl <= 3;
              const expiring = !expired && !critical && dl <= 7;
              const sc = expired
                ? "#ef4444"
                : critical
                  ? "#f97316"
                  : expiring
                    ? "#f59e0b"
                    : "#10b981";
              const st = expired
                ? "Expired"
                : critical
                  ? "Critical"
                  : expiring
                    ? "Expiring"
                    : "Active";
              return (
                <tr
                  key={book._id}
                  style={{
                    borderBottom: "1px solid #0f1e36",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#111827")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#334155",
                      fontWeight: 700,
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: `${book.color || "#6366f1"}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          border: `1px solid ${book.color || "#6366f1"}33`,
                          flexShrink: 0,
                        }}
                      >
                        📚
                      </div>
                      <div>
                        <div style={{ color: "#e2e8f0", fontWeight: 600 }}>
                          {book.bookName}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            color: book.color || "#6366f1",
                            background: `${book.color || "#6366f1"}15`,
                            padding: "1px 7px",
                            borderRadius: 20,
                            fontWeight: 600,
                          }}
                        >
                          {book.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #3b82f6, #06b6d4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {book.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                        {book.studentName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", color: "#64748b" }}>
                    {book.department}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#64748b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(book.issueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#64748b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(book.endDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        color: sc,
                        fontSize: 11,
                        fontWeight: 700,
                        background: `${sc}15`,
                        padding: "4px 10px",
                        borderRadius: 20,
                        border: `1px solid ${sc}33`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sc,
                          display: "inline-block",
                        }}
                      />
                      {st} · {dl}d
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <button
                      onClick={() => onReturn(book._id)}
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        borderRadius: 8,
                        padding: "5px 12px",
                        color: "#34d399",
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      ↩ Return
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {books.length === 0 && (
        <div style={{ padding: "60px", textAlign: "center", color: "#334155" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>
            No issued books found
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────────────
export default function AdminLibraryPage() {
  const [tab, setTab] = useState("books"); // "books" | "issued"
  const [allBooks, setAllBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    expiring: 0,
    expired: 0,
    returned: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [openBook, setOpenBook] = useState(null);
  const [issueTarget, setIssueTarget] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const r = await api.getAllBooks(search);
    if (r.success) setAllBooks(r.data);
    setLoading(false);
  }, [search]);

  const fetchIssued = useCallback(async () => {
    setLoading(true);
    const [ir, sr] = await Promise.all([
      api.getAllIssued(search),
      api.getStats(),
    ]);
    if (ir.success) setIssuedBooks(ir.data);
    if (sr.success) setStats(sr.data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (tab === "books") fetchBooks();
      else fetchIssued();
    }, 350);
    return () => clearTimeout(t);
  }, [tab, search, fetchBooks, fetchIssued]);

  const handleReturn = async (id) => {
    await api.returnBook(id);
    fetchIssued();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    await api.deleteBook(id);
    fetchBooks();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060d1a",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #334155; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a1020; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          background: "#0a1020",
          borderRight: "1px solid #1e3a5f",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
        }}
      >
        <div style={{ padding: "28px 20px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
              }}
            >
              📖
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#e2e8f0" }}>
                LibraryOS
              </div>
              <div style={{ fontSize: 11, color: "#334155" }}>Admin Panel</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 12px", flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#334155",
              letterSpacing: "1.5px",
              padding: "0 8px",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Navigation
          </div>
          {[
            { key: "books", icon: "📚", label: "All Books" },
            { key: "issued", icon: "📋", label: "Issued Books" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setTab(item.key);
                setSearch("");
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 12px",
                borderRadius: 10,
                border: "none",
                background:
                  tab === item.key ? "rgba(59,130,246,0.12)" : "transparent",
                color: tab === item.key ? "#60a5fa" : "#475569",
                fontWeight: tab === item.key ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                marginBottom: 4,
                textAlign: "left",
                borderLeft:
                  tab === item.key
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 12px" }}>
          <button
            onClick={() => setShowUpload(true)}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              border: "none",
              borderRadius: 12,
              padding: "12px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
            }}
          >
            ⬆ Upload Book
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{ marginLeft: 240, padding: "40px 48px", minHeight: "100vh" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
              }}
            >
              {tab === "books" ? "📚 Book Collection" : "📋 Issued Books"}
            </h1>
            <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>
              {tab === "books"
                ? `${allBooks.length} books in library`
                : `${issuedBooks.length} active records`}
            </p>
          </div>
          <div
            style={{
              background: "#0a1020",
              border: "1px solid #1e3a5f",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 12,
              color: "#475569",
            }}
          >
            📅{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
        </div>

        {/* Stats (issued tab) */}
        {tab === "issued" && (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <StatPill
              label="Total Active"
              value={stats.total}
              color="#3b82f6"
            />
            <StatPill
              label="Expiring ≤3d"
              value={stats.expiring}
              color="#f59e0b"
            />
            <StatPill label="Expired" value={stats.expired} color="#ef4444" />
            <StatPill label="Returned" value={stats.returned} color="#10b981" />
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 400, marginBottom: 28 }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#334155",
              fontSize: 15,
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              tab === "books"
                ? "Search books..."
                : "Search student, book, dept..."
            }
            style={{
              width: "100%",
              background: "#0a1020",
              border: "1px solid #1e3a5f",
              borderRadius: 12,
              padding: "11px 16px 11px 42px",
              color: "#e2e8f0",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <div style={{ fontWeight: 600 }}>Loading...</div>
          </div>
        ) : tab === "books" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 16,
            }}
          >
            {allBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onClick={() => setOpenBook(book)}
                onDelete={handleDelete}
              />
            ))}
            {allBooks.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "80px 0",
                  color: "#334155",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  No books found. Upload some!
                </div>
              </div>
            )}
          </div>
        ) : (
          <IssuedTable books={issuedBooks} onReturn={handleReturn} />
        )}
      </div>

      {/* Modals */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            fetchBooks();
            setTab("books");
          }}
        />
      )}
      {openBook && (
        <PDFViewer
          book={openBook}
          onClose={() => setOpenBook(null)}
          onIssueClick={(book) => {
            setOpenBook(null);
            setIssueTarget(book);
          }}
        />
      )}
      {issueTarget && (
        <IssueBookModal
          book={issueTarget}
          onClose={() => setIssueTarget(null)}
          onSuccess={fetchIssued}
        />
      )}
    </div>
  );
}
