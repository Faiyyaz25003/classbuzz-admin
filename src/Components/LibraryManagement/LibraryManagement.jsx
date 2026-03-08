"use client";

import { useState } from "react";

const allBooks = [
  {
    id: 1,
    name: "Math Book",
    category: "Science",
    color: "#f59e0b",
    bg: "#fffbeb",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 2,
    name: "Physics Book",
    category: "Science",
    color: "#3b82f6",
    bg: "#eff6ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 3,
    name: "Chemistry Book",
    category: "Science",
    color: "#10b981",
    bg: "#ecfdf5",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 4,
    name: "Biology Book",
    category: "Science",
    color: "#ef4444",
    bg: "#fef2f2",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 5,
    name: "English Grammar",
    category: "Language",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 6,
    name: "Computer Science",
    category: "Tech",
    color: "#06b6d4",
    bg: "#ecfeff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 7,
    name: "JavaScript Guide",
    category: "Tech",
    color: "#f59e0b",
    bg: "#fffbeb",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 8,
    name: "React Handbook",
    category: "Tech",
    color: "#3b82f6",
    bg: "#eff6ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 9,
    name: "NextJS Basics",
    category: "Tech",
    color: "#6366f1",
    bg: "#eef2ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 10,
    name: "Tailwind CSS",
    category: "Tech",
    color: "#14b8a6",
    bg: "#f0fdfa",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
];

// Issued books with student details
const issuedBooks = [
  {
    id: 1,
    name: "Math Book",
    category: "Science",
    color: "#f59e0b",
    bg: "#fffbeb",
    student: "Rahul Sharma",
    department: "Computer Science",
    issueDate: "2024-03-01",
    endDate: "2024-03-15",
    days: 2,
  },
  {
    id: 2,
    name: "Physics Book",
    category: "Science",
    color: "#3b82f6",
    bg: "#eff6ff",
    student: "Priya Patel",
    department: "Electronics",
    issueDate: "2024-03-05",
    endDate: "2024-03-20",
    days: 5,
  },
  {
    id: 3,
    name: "React Handbook",
    category: "Tech",
    color: "#3b82f6",
    bg: "#eff6ff",
    student: "Amit Kumar",
    department: "IT",
    issueDate: "2024-03-03",
    endDate: "2024-03-17",
    days: 7,
  },
  {
    id: 4,
    name: "English Grammar",
    category: "Language",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    student: "Sneha Rao",
    department: "Arts",
    issueDate: "2024-02-28",
    endDate: "2024-03-14",
    days: 12,
  },
  {
    id: 5,
    name: "Biology Book",
    category: "Science",
    color: "#ef4444",
    bg: "#fef2f2",
    student: "Rohit Singh",
    department: "Medical",
    issueDate: "2024-03-06",
    endDate: "2024-03-21",
    days: 18,
  },
];

const cardConfigs = [
  {
    key: "all",
    label: "All Books",
    sublabel: `${allBooks.length} titles`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: 34, height: 34 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
    color: "#6366f1",
    lightBg: "#eef2ff",
    border: "#c7d2fe",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  {
    key: "issued",
    label: "Issued Details",
    sublabel: `${issuedBooks.length} issued`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: 34, height: 34 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    ),
    color: "#ec4899",
    lightBg: "#fdf2f8",
    border: "#fbcfe8",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
  },
];

// ─── Issue Book Modal ───────────────────────────────────────────────
function IssueBookModal({ book, onClose, onConfirm }) {
  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const getAutoEndDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  };

  const handleConfirm = () => {
    if (!studentName || !department || !issueDate) return;
    setSubmitted(true);
    setTimeout(() => {
      onConfirm({
        studentName,
        department,
        issueDate,
        endDate: getAutoEndDate(issueDate),
      });
      onClose();
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "min(92vw, 460px)",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #4f7ef7 0%, #6366f1 100%)",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              📚
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
                Issue Book
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                {book.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div
          style={{
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Student Name */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "1px",
                display: "block",
                marginBottom: 8,
              }}
            >
              STUDENT NAME
            </label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter full name"
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 14,
                color: "#1e293b",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Department */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "1px",
                display: "block",
                marginBottom: 8,
              }}
            >
              DEPARTMENT
            </label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science"
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 14,
                color: "#1e293b",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Dates */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                ISSUE DATE
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 13,
                  color: "#1e293b",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                END DATE{" "}
                <span style={{ color: "#10b981", fontSize: 10 }}>(Auto)</span>
              </label>
              <input
                type="date"
                value={getAutoEndDate(issueDate)}
                readOnly
                style={{
                  width: "100%",
                  background: "#f0fdf4",
                  border: "1.5px solid #bbf7d0",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 13,
                  color: "#16a34a",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "not-allowed",
                }}
              />
            </div>
          </div>

          {/* Book Name (readonly) */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "1px",
                display: "block",
                marginBottom: 8,
              }}
            >
              BOOK NAME
            </label>
            <div
              style={{
                background: "#eff6ff",
                border: "1.5px solid #bfdbfe",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 14,
                color: "#3b82f6",
                fontWeight: 600,
              }}
            >
              {book.name}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={submitted}
            style={{
              background: submitted
                ? "#10b981"
                : "linear-gradient(135deg, #4f7ef7, #6366f1)",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: submitted ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: submitted
                ? "0 4px 14px rgba(16,185,129,0.3)"
                : "0 4px 14px rgba(99,102,241,0.35)",
              transition: "all 0.3s",
              marginTop: 4,
            }}
          >
            {submitted ? (
              <>
                <span>✅</span> Book Issued Successfully!
              </>
            ) : (
              <>
                <span>✅</span> Confirm Issue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Viewer Modal ───────────────────────────────────────────────
function PDFViewer({ book, onClose }) {
  const [isFull, setIsFull] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: isFull ? 0 : 20,
            width: isFull ? "100vw" : "min(92vw, 1000px)",
            height: isFull ? "100vh" : "min(90vh, 780px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            animation: "slideUp 0.25s ease",
            transition:
              "width 0.3s ease, height 0.3s ease, border-radius 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1.5px solid #f1f5f9",
              background: "#fff",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: book.bg,
                  border: `1.5px solid ${book.color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                📚
              </div>
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}
                >
                  {book.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: book.color,
                    fontWeight: 600,
                    background: book.bg,
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 20,
                    border: `1px solid ${book.color}33`,
                  }}
                >
                  {book.category}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Issue Book Button */}
              <button
                onClick={() => setShowIssueModal(true)}
                style={{
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #4f7ef7, #6366f1)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  padding: "0 14px",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                  whiteSpace: "nowrap",
                }}
              >
                📋 Issue Book
              </button>
              <button
                title={isFull ? "Exit Fullscreen" : "Fullscreen"}
                onClick={() => setIsFull((f) => !f)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      isFull
                        ? "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                        : "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    }
                  />
                </svg>
              </button>
              <button
                onClick={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#fef2f2",
                  border: "1.5px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: 15, height: 15 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, background: "#f1f5f9", position: "relative" }}>
            <iframe
              src={book.pdf}
              title={book.name}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
            />
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: "#f8fafc",
              borderTop: "1.5px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              📄 PDF Viewer — Click outside or press ✕ to close
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: book.color,
                background: book.bg,
                padding: "3px 10px",
                borderRadius: 20,
                border: `1px solid ${book.color}33`,
              }}
            >
              {book.name}
            </div>
          </div>
        </div>
      </div>

      {showIssueModal && (
        <IssueBookModal
          book={book}
          onClose={() => setShowIssueModal(false)}
          onConfirm={(data) => console.log("Issued:", data)}
        />
      )}
    </>
  );
}

// ─── Book Card (All Books) ──────────────────────────────────────────
function BookCard({ book, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 36px rgba(0,0,0,0.1)`;
        e.currentTarget.style.borderColor = book.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: book.color,
          borderRadius: "16px 16px 0 0",
        }}
      />
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: book.bg,
          fontSize: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${book.color}33`,
        }}
      >
        📚
      </div>
      <div>
        <div
          style={{
            color: "#1e293b",
            fontWeight: 600,
            fontSize: 15,
            lineHeight: 1.3,
          }}
        >
          {book.name}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: book.color,
            background: book.bg,
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 600,
            border: `1px solid ${book.color}33`,
          }}
        >
          {book.category}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          color: "#94a3b8",
          marginTop: "auto",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ width: 12, height: 12 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
        Click to open PDF
      </div>
    </div>
  );
}

// ─── Issued Books Table ─────────────────────────────────────────────
function IssuedBooksTable({ books }) {
  const headers = [
    "#",
    "Book Name",
    "Student Name",
    "Department",
    "Issue Date",
    "End Date",
    "Status",
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
      >
        <thead>
          <tr
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: "14px 18px",
                  textAlign: "left",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  borderRight: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {books.map((book, idx) => {
            const isExpiring = book.days <= 7;
            const isCritical = book.days <= 3;
            const statusColor = isCritical
              ? "#ef4444"
              : isExpiring
                ? "#f59e0b"
                : "#10b981";
            const statusBg = isCritical
              ? "#fef2f2"
              : isExpiring
                ? "#fffbeb"
                : "#f0fdf4";
            const statusBorder = isCritical
              ? "#fecaca"
              : isExpiring
                ? "#fde68a"
                : "#bbf7d0";
            const statusText = isCritical
              ? "Critical"
              : isExpiring
                ? "Expiring"
                : "Active";

            return (
              <tr
                key={book.id}
                style={{
                  background: idx % 2 === 0 ? "#fff" : "#f8fafc",
                  borderTop: "1px solid #e2e8f0",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eef2ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    idx % 2 === 0 ? "#fff" : "#f8fafc";
                }}
              >
                {/* # */}
                <td
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid #e2e8f0",
                    color: "#94a3b8",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </td>

                {/* Book Name */}
                <td
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: book.bg,
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${book.color}33`,
                        flexShrink: 0,
                      }}
                    >
                      📚
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#0f172a",
                          fontSize: 14,
                        }}
                      >
                        {book.name}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: book.color,
                          background: book.bg,
                          padding: "1px 7px",
                          borderRadius: 20,
                          fontWeight: 600,
                          border: `1px solid ${book.color}33`,
                        }}
                      >
                        {book.category}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Student Name */}
                <td
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {book.student
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      {book.student}
                    </span>
                  </div>
                </td>

                {/* Department */}
                <td
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid #e2e8f0",
                    color: "#475569",
                    fontWeight: 500,
                  }}
                >
                  {book.department}
                </td>

                {/* Issue Date */}
                <td
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid #e2e8f0",
                    color: "#475569",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(book.issueDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* End Date */}
                <td
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid #e2e8f0",
                    color: "#475569",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(book.endDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Status */}
                <td style={{ padding: "14px 18px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      color: statusColor,
                      fontSize: 12,
                      fontWeight: 700,
                      background: statusBg,
                      padding: "5px 12px",
                      borderRadius: 20,
                      border: `1px solid ${statusBorder}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: statusColor,
                        display: "inline-block",
                      }}
                    />
                    {statusText} · {book.days}d left
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {books.length === 0 && (
        <div
          style={{
            padding: "48px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          No issued books found.
        </div>
      )}
    </div>
  );
}

// ─── Upload Form ────────────────────────────────────────────────────
function UploadForm() {
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [bookName, setBookName] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useState(null);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = () => {
    if (!course || !subject || !bookName || !file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCourse("");
        setSubject("");
        setBookName("");
        setFile(null);
      }, 2000);
    }, 1800);
  };

  const inputStyle = {
    width: "100%",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    padding: "11px 16px",
    color: "#1e293b",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e0e7ff",
        borderRadius: 20,
        padding: "28px 32px",
        marginBottom: 36,
        boxShadow: "0 2px 12px rgba(99,102,241,0.07)",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "#eef2ff",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            style={{ width: 16, height: 16 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 15 }}>
          Upload New Resource
        </span>
      </div>

      {/* Row 1: Course, Subject, Book Name */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "COURSE",
            value: course,
            setter: setCourse,
            placeholder: "e.g. B.Tech, BCA",
          },
          {
            label: "SUBJECT",
            value: subject,
            setter: setSubject,
            placeholder: "e.g. Mathematics",
          },
          {
            label: "BOOK NAME",
            value: bookName,
            setter: setBookName,
            placeholder: "e.g. Calculus Vol. 1",
          },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "1px",
                display: "block",
                marginBottom: 7,
              }}
            >
              {label}
            </label>
            <input
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        ))}
      </div>

      {/* Row 2: File Upload + Button */}
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {/* Choose File / Drop Zone */}
        <div style={{ flex: "1 1 280px" }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "1px",
              display: "block",
              marginBottom: 7,
            }}
          >
            CHOOSE PDF FILE
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("pdf-file-input").click()}
            style={{
              border: `2px dashed ${dragging ? "#6366f1" : file ? "#10b981" : "#c7d2fe"}`,
              borderRadius: 12,
              background: dragging ? "#eef2ff" : file ? "#f0fdf4" : "#f8faff",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: file ? "#dcfce7" : "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {file ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {file ? (
                <>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#10b981",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#6ee7b7" }}>
                    {(file.size / 1024).toFixed(1)} KB · PDF
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{ fontWeight: 600, fontSize: 13, color: "#6366f1" }}
                  >
                    Click to choose or drag & drop
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Only PDF files accepted
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
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#ef4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>
          <input
            id="pdf-file-input"
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Upload Button */}
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={handleUpload}
            disabled={uploading || success}
            style={{
              background: success
                ? "linear-gradient(135deg, #10b981, #059669)"
                : uploading
                  ? "#c7d2fe"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 12,
              padding: "13px 32px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: uploading || success ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              boxShadow: uploading
                ? "none"
                : success
                  ? "0 4px 14px rgba(16,185,129,0.35)"
                  : "0 4px 14px rgba(99,102,241,0.3)",
              transition: "all 0.3s",
              height: 46,
            }}
          >
            {success ? (
              <>
                <span>✅</span> Uploaded!
              </>
            ) : uploading ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    width: 16,
                    height: 16,
                    animation: "spin 1s linear infinite",
                  }}
                >
                  <path
                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    strokeLinecap="round"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function LibraryPage() {
  const [active, setActive] = useState(null);
  const [openBook, setOpenBook] = useState(null);
  const [search, setSearch] = useState("");

  const getFilteredBooks = () => {
    const books = active === "all" ? allBooks : issuedBooks;
    if (!search) return books;
    return books.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const activeConfig = cardConfigs.find((c) => c.key === active);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#1e293b",
        padding: "40px 48px",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 36,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: 12,
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              }}
            >
              📖
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                margin: 0,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              Admin Library
            </h1>
          </div>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
            Manage, browse and track issued educational resources
          </p>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 12,
            padding: "8px 16px",
            fontSize: 13,
            color: "#64748b",
            fontWeight: 500,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
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

      {/* Upload Section */}
      <UploadForm />

      {/* Two Category Cards */}
      {!active && (
        <>
          <div
            style={{
              marginBottom: 16,
              color: "#94a3b8",
              fontSize: 12,
              letterSpacing: "1.5px",
              fontWeight: 700,
            }}
          >
            BROWSE COLLECTION
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {cardConfigs.map((cfg) => (
              <div
                key={cfg.key}
                onClick={() => {
                  setActive(cfg.key);
                  setSearch("");
                }}
                style={{
                  background: "#fff",
                  border: `1.5px solid ${cfg.border}`,
                  borderRadius: 20,
                  padding: "28px 26px",
                  cursor: "pointer",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: cfg.gradient,
                    borderRadius: "20px 20px 0 0",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: cfg.lightBg,
                  }}
                />
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: cfg.lightBg,
                    color: cfg.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    border: `1.5px solid ${cfg.border}`,
                    position: "relative",
                  }}
                >
                  {cfg.icon}
                </div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 4,
                  }}
                >
                  {cfg.label}
                </div>
                <div
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}
                >
                  {cfg.sublabel}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: cfg.lightBg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: cfg.color,
                  }}
                >
                  Browse →
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Books / Issued List */}
      {active && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <button
              onClick={() => {
                setActive(null);
                setSearch("");
              }}
              style={{
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                padding: "8px 18px",
                color: "#64748b",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.color = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              ← Back
            </button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a" }}>
                {activeConfig?.label}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                {getFilteredBooks().length}{" "}
                {active === "issued" ? "records" : "books"} found
              </div>
            </div>
          </div>

          {/* Search */}
          <div
            style={{ position: "relative", marginBottom: 24, maxWidth: 380 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 16,
                height: 16,
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              style={{
                width: "100%",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: "11px 16px 11px 40px",
                color: "#1e293b",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = activeConfig?.color || "#6366f1";
                e.target.style.boxShadow = `0 0 0 3px ${activeConfig?.color || "#6366f1"}18`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
              }}
            />
          </div>

          {/* All Books Grid */}
          {active === "all" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {getFilteredBooks().map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => setOpenBook(book)}
                />
              ))}
            </div>
          )}

          {/* Issued Details Table */}
          {active === "issued" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Summary stats */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  {
                    label: "Total Issued",
                    value: issuedBooks.length,
                    color: "#6366f1",
                    bg: "#eef2ff",
                  },
                  {
                    label: "Expiring ≤7d",
                    value: issuedBooks.filter((b) => b.days <= 7).length,
                    color: "#f59e0b",
                    bg: "#fffbeb",
                  },
                  {
                    label: "Critical ≤3d",
                    value: issuedBooks.filter((b) => b.days <= 3).length,
                    color: "#ef4444",
                    bg: "#fef2f2",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: stat.bg,
                      border: `1px solid ${stat.color}33`,
                      borderRadius: 12,
                      padding: "10px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: stat.color,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: stat.color,
                        fontWeight: 600,
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <IssuedBooksTable books={getFilteredBooks()} />
            </div>
          )}
        </div>
      )}

      {openBook && (
        <PDFViewer book={openBook} onClose={() => setOpenBook(null)} />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        input::placeholder { color: #cbd5e1; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
