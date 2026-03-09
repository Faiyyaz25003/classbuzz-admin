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
    const res = await fetch(`${BASE_URL}/books/upload`, { method: "POST", body: formData });
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
    const res = await fetch(`${BASE_URL}/issued/${id}/return`, { method: "PATCH" });
    return res.json();
  },
};

/* ─── UPLOAD SECTION ───────────────────────────────────────────── */
function UploadSection({ onSuccess }) {
  const [form, setForm] = useState({ name: "", category: "", course: "", subject: "" });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") { setFile(f); setError(""); }
    else setError("Only PDF files are accepted");
  };

  const handleUpload = async () => {
    if (!form.name || !form.category || !form.course || !form.subject || !file) {
      setError("All fields and PDF are required"); return;
    }
    setError(""); setUploading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("file", file);
    const result = await api.uploadBook(fd);
    setUploading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm({ name: "", category: "", course: "", subject: "" });
        setFile(null);
        onSuccess?.();
      }, 1800);
    } else setError(result.message || "Upload failed");
  };

  const inp = {
    width: "100%", background: "#fff", border: "1.5px solid #e8eaf0",
    borderRadius: 10, padding: "11px 14px", color: "#1a1f36",
    fontSize: 13, outline: "none", boxSizing: "border-box",
    fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      background: "#fff", border: "1.5px solid #eaecf4", borderRadius: 18,
      padding: "28px 32px", marginBottom: 32,
      boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#eef2ff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>⬆️</div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#6366f1", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Upload New Resource
        </span>
      </div>

      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9,
          padding: "9px 14px", color: "#ef4444", fontSize: 13, marginBottom: 16,
        }}>{error}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 16 }}>
        {[
          { label: "COURSE", key: "course", ph: "e.g. B.Tech, MCA" },
          { label: "SUBJECT", key: "subject", ph: "e.g. Advance Java" },
          { label: "BOOK NAME", key: "name", ph: "e.g. Seth Publication" },
          { label: "CATEGORY", key: "category", ph: "e.g. Tech, Science" },
        ].map(({ label, key, ph }) => (
          <div key={key}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 6 }}>{label}</label>
            <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={inp}
              onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#e8eaf0"; e.target.style.boxShadow = "none"; }} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px" }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 7 }}>CHOOSE PDF FILE</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("pdf-upload-input").click()}
            style={{
              border: `2px dashed ${dragging ? "#6366f1" : file ? "#10b981" : "#c7d2fe"}`,
              borderRadius: 12, background: dragging ? "#eef2ff" : file ? "#f0fdf4" : "#fafbff",
              padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer", transition: "all 0.2s",
            }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: file ? "#dcfce7" : "#eef2ff",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
            }}>{file ? "✅" : "📄"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {file ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#10b981", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                  <div style={{ fontSize: 11, color: "#6ee7b7" }}>{(file.size / 1024).toFixed(1)} KB · PDF</div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#6366f1" }}>Click to choose or drag & drop</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Only PDF files accepted</div>
                </>
              )}
            </div>
            {file && (
              <button onClick={e => { e.stopPropagation(); setFile(null); }} style={{
                width: 26, height: 26, borderRadius: 6, background: "#fef2f2",
                border: "1px solid #fecaca", color: "#ef4444", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0,
              }}>✕</button>
            )}
          </div>
          <input id="pdf-upload-input" type="file" accept="application/pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>

        <button onClick={handleUpload} disabled={uploading || success} style={{
          height: 46, padding: "0 28px", borderRadius: 12, border: "none",
          cursor: uploading || success ? "default" : "pointer",
          background: success ? "linear-gradient(135deg,#10b981,#059669)"
            : uploading ? "#c7d2fe"
            : "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: uploading ? "none" : success
            ? "0 4px 14px rgba(16,185,129,0.35)"
            : "0 4px 14px rgba(99,102,241,0.3)",
          transition: "all 0.3s", fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {success ? "✅ Uploaded!" : uploading ? "⏳ Uploading..." : "⬆ Upload PDF"}
        </button>
      </div>
    </div>
  );
}

/* ─── ISSUE MODAL ──────────────────────────────────────────────── */
function IssueModal({ book, onClose, onSuccess }) {
  const [form, setForm] = useState({ studentName: "", department: "", issueDate: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const endDate = form.issueDate
    ? (() => { const d = new Date(form.issueDate); d.setDate(d.getDate() + 14); return d.toISOString().split("T")[0]; })()
    : "";

  const submit = async () => {
    if (!form.studentName || !form.department || !form.issueDate) { setError("All fields required"); return; }
    setError(""); setLoading(true);
    const r = await api.issueBook({ bookId: book._id, ...form });
    setLoading(false);
    if (r.success) { setDone(true); setTimeout(() => { onSuccess?.(); onClose(); }, 1400); }
    else setError(r.message || "Failed");
  };

  const col = book.color || "#6366f1";
  const inp = {
    width: "100%", background: "#f8fafc", border: "1.5px solid #e8eaf0",
    borderRadius: 10, padding: "11px 14px", color: "#1a1f36",
    fontSize: 13, outline: "none", boxSizing: "border-box",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 2000,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 22, width: "min(92vw,460px)",
        overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${col}, ${col}cc)`,
          padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Issue Book</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{book.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ padding: "26px", display: "flex", flexDirection: "column", gap: 14 }}>
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "9px 14px", color: "#ef4444", fontSize: 13 }}>{error}</div>}

          {[
            { label: "STUDENT NAME", key: "studentName", ph: "Enter full name" },
            { label: "DEPARTMENT", key: "department", ph: "e.g. Computer Science" },
          ].map(({ label, key, ph }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 6 }}>{label}</label>
              <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={inp}
                onFocus={e => { e.target.style.borderColor = col; e.target.style.boxShadow = `0 0 0 3px ${col}18`; }}
                onBlur={e => { e.target.style.borderColor = "#e8eaf0"; e.target.style.boxShadow = "none"; }} />
            </div>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 6 }}>ISSUE DATE</label>
              <input type="date" value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} style={inp} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 6 }}>END DATE <span style={{ color: "#10b981" }}>(Auto)</span></label>
              <input type="date" value={endDate} readOnly style={{ ...inp, background: "#f0fdf4", borderColor: "#bbf7d0", color: "#16a34a", cursor: "not-allowed" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 6 }}>BOOK</label>
            <div style={{ background: `${col}10`, border: `1.5px solid ${col}30`, borderRadius: 10, padding: "11px 14px", color: col, fontWeight: 600, fontSize: 14 }}>{book.name}</div>
          </div>

          <button onClick={submit} disabled={loading || done} style={{
            background: done ? "linear-gradient(135deg,#10b981,#059669)" : loading ? "#c7d2fe" : `linear-gradient(135deg,${col},${col}bb)`,
            border: "none", borderRadius: 11, padding: "13px", color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: loading || done ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: done ? "0 4px 14px rgba(16,185,129,0.3)" : `0 4px 14px ${col}44`,
            transition: "all 0.3s", marginTop: 4, fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {done ? "✅ Issued!" : loading ? "⏳ Issuing..." : "✅ Confirm Issue"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PDF VIEWER ───────────────────────────────────────────────── */
function PDFViewer({ book, onClose, onIssueClick }) {
  const [full, setFull] = useState(false);
  const url = book.file || (book.pdfFile ? `http://localhost:5000/uploads/${book.pdfFile}` : "");

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1500,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: full ? 0 : 18,
        width: full ? "100vw" : "min(95vw,1080px)",
        height: full ? "100vh" : "min(92vh,800px)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)", transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: "1.5px solid #f1f5f9", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: book.bg || "#eef2ff", border: `1.5px solid ${book.color || "#6366f1"}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>📚</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{book.name}</div>
              <span style={{ fontSize: 10, color: book.color || "#6366f1", background: book.bg || "#eef2ff", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{book.category}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onIssueClick(book)} style={{
              height: 34, padding: "0 14px", borderRadius: 9,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none",
              color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
              boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
            }}>📋 Issue Book</button>
            <button onClick={() => setFull(f => !f)} style={{ width: 34, height: 34, borderRadius: 9, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#64748b", cursor: "pointer" }}>{full ? "⊡" : "⛶"}</button>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 9, background: "#fef2f2", border: "1.5px solid #fecaca", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1, background: "#f8fafc" }}>
          <iframe src={url} title={book.name} style={{ width: "100%", height: "100%", border: "none" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── BOOK CARD ─────────────────────────────────────────────────── */
function BookCard({ book, onClick, onDelete }) {
  const [hov, setHov] = useState(false);
  const col = book.color || "#6366f1";
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "#fff", border: `1.5px solid ${hov ? col : "#eaecf4"}`,
      borderRadius: 14, padding: "18px", display: "flex", flexDirection: "column", gap: 10,
      cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden",
      boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.09), 0 0 0 1px ${col}22` : "0 1px 4px rgba(0,0,0,0.04)",
      transform: hov ? "translateY(-3px)" : "none",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: col, borderRadius: "14px 14px 0 0" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: book.bg || "#eef2ff", fontSize: 21, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${col}22` }}>📚</div>
        {onDelete && (
          <button onClick={e => { e.stopPropagation(); if (confirm("Delete this book?")) onDelete(book._id); }} style={{
            width: 26, height: 26, borderRadius: 7, background: "#fef2f2", border: "1px solid #fecaca",
            color: "#ef4444", cursor: "pointer", fontSize: 12, opacity: hov ? 1 : 0, transition: "opacity 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>🗑</button>
        )}
      </div>
      <div>
        <div style={{ color: "#0f172a", fontWeight: 700, fontSize: 14, lineHeight: 1.35, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{book.name}</div>
        <span style={{ marginTop: 5, fontSize: 11, color: col, background: book.bg || "#eef2ff", display: "inline-block", padding: "3px 10px", borderRadius: 20, fontWeight: 600, border: `1px solid ${col}22` }}>{book.category}</span>
      </div>
      {book.course && <div style={{ fontSize: 11, color: "#94a3b8" }}>{book.subject} · {book.course}</div>}
      <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: "auto", display: "flex", alignItems: "center", gap: 4 }}>📄 Click to open PDF</div>
    </div>
  );
}

/* ─── ISSUED TABLE ──────────────────────────────────────────────── */
function IssuedTable({ books, onReturn }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #eaecf4", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              {["#", "Book Name", "Student Name", "Department", "Issue Date", "End Date", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#fff", fontWeight: 700, fontSize: 12, letterSpacing: "0.4px", whiteSpace: "nowrap", borderRight: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((b, i) => {
              const dl = b.daysLeft;
              const exp = dl < 0;
              const crit = !exp && dl <= 3;
              const warn = !exp && !crit && dl <= 7;
              const sc = exp ? "#ef4444" : crit ? "#f97316" : warn ? "#f59e0b" : "#10b981";
              const st = exp ? "Expired" : crit ? "Critical" : warn ? "Expiring" : "Active";
              return (
                <tr key={b._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={{ padding: "13px 16px", color: "#94a3b8", fontWeight: 700, borderRight: "1px solid #f1f5f9" }}>{String(i + 1).padStart(2, "0")}</td>
                  <td style={{ padding: "13px 16px", borderRight: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: b.bg || "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, border: `1px solid ${b.color || "#6366f1"}22`, flexShrink: 0 }}>📚</div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{b.bookName}</div>
                        <span style={{ fontSize: 10, color: b.color || "#6366f1", background: b.bg || "#eef2ff", padding: "1px 7px", borderRadius: 20, fontWeight: 600 }}>{b.category}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", borderRight: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {b.studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{b.studentName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", borderRight: "1px solid #f1f5f9", color: "#64748b" }}>{b.department}</td>
                  <td style={{ padding: "13px 16px", borderRight: "1px solid #f1f5f9", color: "#64748b", whiteSpace: "nowrap" }}>
                    {new Date(b.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "13px 16px", borderRight: "1px solid #f1f5f9", color: "#64748b", whiteSpace: "nowrap" }}>
                    {new Date(b.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "13px 16px", borderRight: "1px solid #f1f5f9" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: sc, fontSize: 11, fontWeight: 700, background: `${sc}12`, padding: "4px 10px", borderRadius: 20, border: `1px solid ${sc}28`, whiteSpace: "nowrap" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc, display: "inline-block" }} />
                      {st} · {dl}d
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <button onClick={() => onReturn(b._id)} style={{
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: 8, padding: "5px 12px", color: "#16a34a",
                      fontWeight: 700, fontSize: 11, cursor: "pointer",
                    }}>↩ Return</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {books.length === 0 && (
        <div style={{ padding: "56px", textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 600 }}>No issued books found.</div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────── */
const SECTIONS = [
  { key: "all", label: "All Books", icon: "📚", color: "#6366f1", lightBg: "#eef2ff", border: "#c7d2fe", grad: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
  { key: "issued", label: "Issued Details", icon: "📋", color: "#ec4899", lightBg: "#fdf2f8", border: "#fbcfe8", grad: "linear-gradient(135deg,#ec4899,#f43f5e)" },
];

export default function AdminLibraryPage() {
  const [active, setActive] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [stats, setStats] = useState({ total: 0, expiring: 0, expired: 0, returned: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
    const [ir, sr] = await Promise.all([api.getAllIssued(search), api.getStats()]);
    if (ir.success) setIssuedBooks(ir.data);
    if (sr.success) setStats(sr.data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (active === "all") fetchBooks();
      if (active === "issued") fetchIssued();
    }, 350);
    return () => clearTimeout(t);
  }, [active, search, fetchBooks, fetchIssued]);

  const cfg = SECTIONS.find(s => s.key === active);

  return (
    <div style={{
      minHeight: "100vh", background: "#f4f6fb",
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", color: "#1a1f36",
      padding: "36px 48px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #cbd5e1; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
          }}>📖</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#0f172a", letterSpacing: "-0.4px" }}>Admin Library</h1>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 13 }}>Manage and track educational resources</p>
          </div>
        </div>
        <div style={{
          background: "#fff", border: "1.5px solid #eaecf4", borderRadius: 10,
          padding: "8px 16px", fontSize: 12, color: "#64748b", fontWeight: 500,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          📅 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Upload always on top */}
      <UploadSection onSuccess={() => { if (active === "all") fetchBooks(); }} />

      {/* Home cards */}
      {!active && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "1.5px", marginBottom: 14 }}>BROWSE COLLECTION</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {SECTIONS.map(s => (
              <div key={s.key} onClick={() => { setActive(s.key); setSearch(""); }}
                style={{
                  background: "#fff", border: `1.5px solid ${s.border}`,
                  borderRadius: 20, padding: "28px 26px", cursor: "pointer",
                  transition: "all 0.25s", position: "relative", overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.09)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: s.grad, borderRadius: "20px 20px 0 0" }} />
                <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: s.lightBg, opacity: 0.6 }} />
                <div style={{ fontSize: 42, marginBottom: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 21, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>{s.label}</div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: s.lightBg, border: `1px solid ${s.border}`,
                  borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: s.color,
                }}>Browse →</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Section view */}
      {active && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <button onClick={() => { setActive(null); setSearch(""); }} style={{
              background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 9,
              padding: "8px 16px", color: "#64748b", cursor: "pointer",
              fontSize: 13, fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>← Back</button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>{cfg?.label}</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                {active === "all" ? allBooks.length : issuedBooks.length} {active === "issued" ? "records" : "books"} found
              </div>
            </div>
          </div>

          {active === "issued" && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { label: "Total Issued", val: stats.total, col: "#6366f1", bg: "#eef2ff" },
                { label: "Expiring ≤3d", val: stats.expiring, col: "#f59e0b", bg: "#fffbeb" },
                { label: "Expired", val: stats.expired, col: "#ef4444", bg: "#fef2f2" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.col}28`, borderRadius: 12, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: s.col }}>{s.val}</span>
                  <span style={{ fontSize: 12, color: s.col, fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ position: "relative", maxWidth: 380, marginBottom: 22 }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books..."
              style={{
                width: "100%", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 11,
                padding: "11px 16px 11px 38px", color: "#1a1f36", fontSize: 13, outline: "none",
                boxSizing: "border-box", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>⏳ Loading...</div>
          ) : active === "all" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {allBooks.map(b => (
                <BookCard key={b._id} book={b} onClick={() => setOpenBook(b)}
                  onDelete={async id => { await api.deleteBook(id); fetchBooks(); }} />
              ))}
              {allBooks.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                  <div style={{ fontWeight: 600 }}>No books found. Upload some!</div>
                </div>
              )}
            </div>
          ) : (
            <IssuedTable books={issuedBooks} onReturn={async id => { await api.returnBook(id); fetchIssued(); }} />
          )}
        </div>
      )}

      {openBook && (
        <PDFViewer book={openBook} onClose={() => setOpenBook(null)}
          onIssueClick={b => { setOpenBook(null); setIssueTarget(b); }} />
      )}
      {issueTarget && (
        <IssueModal book={issueTarget} onClose={() => setIssueTarget(null)} onSuccess={fetchIssued} />
      )}
    </div>
  );
}