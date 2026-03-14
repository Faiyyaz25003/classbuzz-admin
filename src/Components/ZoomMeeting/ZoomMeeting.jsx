import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ISOLATION WRAPPER
// Ye wrapper ClassBuzz ke sidebar/navbar ko protect karta hai.
// .cb-mentor-root ke andar hi sari CSS apply hogi — bahar kuch nahi jayega.
// ─────────────────────────────────────────────────────────────────────────────
const Isolated = ({ children }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
      .cb-mentor-root { all: initial; display: block; font-family: 'DM Sans', sans-serif; }
      .cb-mentor-root *, .cb-mentor-root *::before, .cb-mentor-root *::after { box-sizing: border-box; }
      .cb-mentor-root button,
      .cb-mentor-root input,
      .cb-mentor-root select { font-family: 'DM Sans', sans-serif; }
      .cb-mentor-root ::-webkit-scrollbar { width: 4px; }
      .cb-mentor-root ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      @keyframes cb-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    `}</style>
    <div className="cb-mentor-root">{children}</div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
];
const AVATAR_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];
const avatarColor = (n) =>
  AVATAR_COLORS[
    (n.charCodeAt(0) + (n.charCodeAt(1) || 0)) % AVATAR_COLORS.length
  ];
const initials = (n) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const genCode = (subject) => {
  const prefix = subject.slice(0, 4).toUpperCase();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `${prefix}-${rand}`;
};

// Reusable inline style objects — koi global class nahi
const S = {
  page: {
    minHeight: "100vh",
    background: "#f0f0ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1.5px solid #e5e7eb",
    padding: 14,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    color: "#1e1b4b",
    display: "block",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    display: "block",
    marginBottom: 5,
  },
  btn: (bg, color, border = "none") => ({
    padding: "11px",
    borderRadius: 10,
    background: bg,
    color,
    fontWeight: 700,
    fontSize: 13,
    border,
    cursor: "pointer",
    flex: 1,
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 28 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: avatarColor(name),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: size * 0.36,
      flexShrink: 0,
    }}
  >
    {initials(name)}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      width: 38,
      height: 22,
      borderRadius: 11,
      background: value ? "#6366f1" : "#d1d5db",
      position: "relative",
      cursor: "pointer",
      transition: "background 0.2s",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 3,
        left: value ? 18 : 3,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
      }}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: 1, name: "Riya Sharma", muted: false },
  { id: 2, name: "Aman Mehta", muted: true },
  { id: 3, name: "Priya Kaur", muted: false },
  { id: 4, name: "Rohan Das", muted: true },
  { id: 5, name: "Sneha Patel", muted: false },
];
const MOCK_DOUBTS = [
  { id: 1, name: "Riya Sharma", text: "Step 3 nahi samjha" },
  { id: 2, name: "Aman Mehta", text: "Formula ka sign galat?" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — CREATE ROOM
// ─────────────────────────────────────────────────────────────────────────────
function CreateRoom({ onCreated }) {
  const [mentorName, setMentorName] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("60");
  const [maxStudents, setMaxStudents] = useState("30");
  const [allowChat, setAllowChat] = useState(true);
  const [allowWb, setAllowWb] = useState(true);
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!mentorName.trim()) {
      setError("Apna naam zaroori hai");
      return;
    }
    if (!topic.trim()) {
      setError("Topic likhna zaroori hai");
      return;
    }
    onCreated({
      code: genCode(subject),
      mentorName: mentorName.trim(),
      subject,
      topic,
      duration,
      maxStudents,
      allowChat,
      allowWb,
    });
  };

  return (
    <div style={S.page}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e5e7eb",
          padding: "36px 32px",
          width: "100%",
          maxWidth: 500,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#1e1b4b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            🏫
          </div>
          <div>
            <p
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1e1b4b",
                margin: 0,
              }}
            >
              Naya Room Banao
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
              Mentor / Admin Panel
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 12,
              color: "#dc2626",
              marginBottom: 16,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            <label style={S.label}>👤 Aapka Naam *</label>
            <input
              value={mentorName}
              onChange={(e) => {
                setMentorName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Arjun Kumar"
              style={S.input}
            />
          </div>
          {/* Subject */}
          <div>
            <label style={S.label}>📚 Subject *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={S.input}
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {/* Topic */}
          <div>
            <label style={S.label}>📖 Topic / Chapter *</label>
            <input
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setError("");
              }}
              placeholder="e.g. Quadratic Equations"
              style={S.input}
            />
          </div>
          {/* Duration + Max */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>⏱ Duration (min)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={S.input}
              >
                {["30", "45", "60", "90", "120"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>👥 Max Students</label>
              <select
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                style={S.input}
              >
                {["10", "20", "30", "50", "100"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Toggles */}
          <div
            style={{
              background: "#f9fafb",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                margin: 0,
              }}
            >
              ⚙️ Room Settings
            </p>
            {[
              {
                label: "Students ko chat allow karein",
                val: allowChat,
                set: setAllowChat,
              },
              {
                label: "Students ko whiteboard allow karein",
                val: allowWb,
                set: setAllowWb,
              },
            ].map(({ label, val, set }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
                <Toggle value={val} onChange={set} />
              </div>
            ))}
          </div>
          {/* Submit */}
          <button
            onClick={handleCreate}
            style={{
              ...S.btn("#1e1b4b", "#fff"),
              width: "100%",
              padding: "13px",
              fontSize: 14,
            }}
          >
            🚀 Room Create Karein
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — ROOM CREATED
// ─────────────────────────────────────────────────────────────────────────────
function RoomCreated({ room, onEnterRoom }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard?.writeText(room.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <div style={S.page}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e5e7eb",
          padding: "36px 32px",
          width: "100%",
          maxWidth: 440,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#dcfce7",
            border: "2px solid #86efac",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            margin: "0 auto 18px",
          }}
        >
          ✅
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1e1b4b",
            marginBottom: 6,
          }}
        >
          Room Ready Hai!
        </p>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 28 }}>
          Ye code students ko share karein
        </p>

        {/* Code box */}
        <div
          style={{
            background: "#f5f3ff",
            border: "2px dashed #a5b4fc",
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            ROOM CODE
          </p>
          <p
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#4338ca",
              letterSpacing: 5,
              fontFamily: "monospace",
              margin: 0,
            }}
          >
            {room.code}
          </p>
        </div>

        {/* Summary */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 22,
            textAlign: "left",
          }}
        >
          {[
            ["👤 Mentor", room.mentorName],
            ["📚 Subject", room.subject],
            ["📖 Topic", room.topic],
            ["⏱ Duration", `${room.duration} min`],
            ["👥 Max", room.maxStudents],
            ["💬 Chat", room.allowChat ? "Allowed" : "Off"],
            ["🖊 Whiteboard", room.allowWb ? "Allowed" : "Off"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px 0",
                fontSize: 13,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <span style={{ color: "#9ca3af" }}>{k}</span>
              <span style={{ color: "#374151", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={copyCode}
            style={{
              ...S.btn(
                copied ? "#dcfce7" : "#f9fafb",
                copied ? "#15803d" : "#374151",
                "1.5px solid #e5e7eb",
              ),
            }}
          >
            {copied ? "✅ Copied!" : "📋 Code Copy Karein"}
          </button>
          <button onClick={onEnterRoom} style={S.btn("#1e1b4b", "#fff")}>
            Room Mein Jaao →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — MENTOR ROOM
// ─────────────────────────────────────────────────────────────────────────────
function MentorRoom({ room, onEndRoom }) {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [doubts, setDoubts] = useState(MOCK_DOUBTS);
  const [locked, setLocked] = useState(false);
  const [broadcast, setBroadcast] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [pollQ, setPollQ] = useState("");
  const [launched, setLaunched] = useState(false);
  const [dots, setDots] = useState([]);

  const muteAll = () =>
    setStudents((s) => s.map((st) => ({ ...st, muted: true })));
  const toggleMute = (id) =>
    setStudents((s) =>
      s.map((st) => (st.id === id ? { ...st, muted: !st.muted } : st)),
    );
  const kickStudent = (id) =>
    setStudents((s) => s.filter((st) => st.id !== id));
  const dismissDoubt = (id) => setDoubts((d) => d.filter((dt) => dt.id !== id));
  const wbClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setDots((d) => [...d, { x: e.clientX - r.left, y: e.clientY - r.top }]);
  };

  return (
    <div style={{ background: "#f0f0ff", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <div
        style={{
          background: "#1e1b4b",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Avatar name={room.mentorName} size={34} />
        <div>
          <p
            style={{ fontWeight: 700, fontSize: 15, color: "#fff", margin: 0 }}
          >
            {room.mentorName} — Mentor
          </p>
          <p style={{ fontSize: 11, color: "#a78bfa", margin: 0 }}>
            {room.subject} · {room.topic} · {students.length} students
          </p>
        </div>
        {/* Room code pill */}
        <div
          style={{
            background: "#312e81",
            border: "1px solid #4c1d95",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 14,
            fontWeight: 800,
            color: "#c4b5fd",
            fontFamily: "monospace",
            letterSpacing: 3,
          }}
        >
          {room.code}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => setMicOn((m) => !m)}
            style={{
              padding: "6px 13px",
              borderRadius: 8,
              border: "1.5px solid #4c1d95",
              background: micOn ? "#312e81" : "#7f1d1d",
              color: micOn ? "#c4b5fd" : "#fca5a5",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {micOn ? "🎙 Mute" : "🔇 Muted"}
          </button>
          <button
            onClick={() => setCamOn((c) => !c)}
            style={{
              padding: "6px 13px",
              borderRadius: 8,
              border: "1.5px solid #4c1d95",
              background: camOn ? "#312e81" : "#7f1d1d",
              color: camOn ? "#c4b5fd" : "#fca5a5",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {camOn ? "📷 On" : "📷 Off"}
          </button>
          <button
            style={{
              padding: "6px 13px",
              borderRadius: 8,
              border: "1.5px solid #4c1d95",
              background: "#312e81",
              color: "#c4b5fd",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            🖥 Share Screen
          </button>
          <button
            onClick={onEndRoom}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              background: "#ef4444",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              border: "none",
              cursor: "pointer",
            }}
          >
            End Room
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: "flex", gap: 14, padding: "14px 18px" }}>
        {/* MAIN */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          {/* Stats */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Students Online", value: students.length },
              { label: "Doubts Raised", value: doubts.length },
              { label: "Duration", value: `${room.duration}m` },
              { label: "Muted", value: students.filter((s) => s.muted).length },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: "1.5px solid #e5e7eb",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#1e1b4b",
                    fontFamily: "monospace",
                    margin: 0,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    marginTop: 2,
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Whiteboard */}
          <div
            style={{
              ...S.card,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1e1b4b" }}>
                Whiteboard — {room.topic}
              </span>
              <span
                style={{
                  background: "#ede9fe",
                  color: "#7c3aed",
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 5,
                  padding: "2px 7px",
                }}
              >
                Presenting
              </span>
              <button
                onClick={() => setLocked((l) => !l)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 7,
                  border: "1.5px solid #e5e7eb",
                  background: locked ? "#fef3c7" : "#f9fafb",
                  fontSize: 11,
                  color: locked ? "#d97706" : "#374151",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {locked ? "🔒 Locked" : "🔓 Lock"}
              </button>
              <button
                style={{
                  padding: "3px 10px",
                  borderRadius: 7,
                  border: "1.5px solid #e5e7eb",
                  background: "#f9fafb",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                💾 Save
              </button>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: broadcast ? "#22c55e" : "#9ca3af",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: broadcast ? "#15803d" : "#9ca3af",
                  }}
                >
                  Broadcast: {broadcast ? "ON" : "OFF"}
                </span>
                <button
                  onClick={() => setBroadcast((b) => !b)}
                  style={{
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 5,
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    background: "#f9fafb",
                  }}
                >
                  Toggle
                </button>
              </div>
            </div>
            {/* Canvas */}
            <div
              onClick={wbClick}
              style={{
                background: "#fafafa",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                flex: 1,
                minHeight: 200,
                position: "relative",
                cursor: "crosshair",
                overflow: "hidden",
              }}
            >
              <svg
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.05,
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <pattern
                    id="cbdg"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="#6366f1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cbdg)" />
              </svg>
              <div style={{ padding: "16px 20px", position: "relative" }}>
                <p
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    fontFamily: "monospace",
                    marginBottom: 8,
                  }}
                >
                  {room.subject} · {room.topic}
                </p>
                <div
                  style={{
                    background: "#fef3c7",
                    border: "2px solid #f59e0b",
                    borderRadius: 8,
                    display: "inline-block",
                    padding: "5px 14px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 14,
                      color: "#1e1b4b",
                      fontWeight: 700,
                    }}
                  >
                    x = (−b ± √(b²−4ac)) / 2a
                  </span>
                </div>
              </div>
              {dots.map((d, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: d.x - 3,
                    top: d.y - 3,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#6366f1",
                    pointerEvents: "none",
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: 20,
                  padding: "3px 9px",
                  fontSize: 10,
                  color: "#15803d",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    animation: "cb-pulse 1.5s infinite",
                  }}
                />
                Live sync
              </div>
              {locked && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 10,
                    fontSize: 10,
                    color: "#9ca3af",
                  }}
                >
                  🔒 Locked
                </div>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Doubt Queue + Controls */}
            <div
              style={{
                ...S.card,
                flex: 1.3,
                maxHeight: 360,
                overflowY: "auto",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#1e1b4b",
                  marginBottom: 10,
                }}
              >
                🙋 Doubt Queue
              </p>
              {doubts.length === 0 ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    textAlign: "center",
                    padding: "8px 0",
                  }}
                >
                  No pending doubts
                </p>
              ) : (
                doubts.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      background: "#fafafa",
                      borderRadius: 10,
                      padding: "9px 11px",
                      marginBottom: 7,
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <Avatar name={d.name} size={20} />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 12,
                          color: "#1e1b4b",
                        }}
                      >
                        {d.name}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                        marginBottom: 6,
                      }}
                    >
                      {d.text}
                    </p>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        style={{
                          flex: 1,
                          padding: "4px",
                          borderRadius: 6,
                          background: "#dcfce7",
                          border: "1px solid #86efac",
                          color: "#15803d",
                          fontWeight: 600,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        Allow Mic
                      </button>
                      <button
                        onClick={() => dismissDoubt(d.id)}
                        style={{
                          flex: 1,
                          padding: "4px",
                          borderRadius: 6,
                          background: "#fee2e2",
                          border: "1px solid #fca5a5",
                          color: "#ef4444",
                          fontWeight: 600,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#1e1b4b",
                  marginTop: 12,
                  marginBottom: 8,
                }}
              >
                Student Controls
              </p>
              {students.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 7,
                  }}
                >
                  <Avatar name={s.name} size={24} />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.name}
                  </span>
                  <button
                    onClick={() => toggleMute(s.id)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: "1px solid #e5e7eb",
                      background: s.muted ? "#fee2e2" : "#f9fafb",
                      color: s.muted ? "#ef4444" : "#374151",
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {s.muted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    onClick={() => kickStudent(s.id)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: "1px solid #fca5a5",
                      background: "#fff0f0",
                      color: "#ef4444",
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Kick
                  </button>
                </div>
              ))}
              <button
                onClick={muteAll}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "8px",
                  borderRadius: 8,
                  background: "#1e1b4b",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🔇 Mute All
              </button>
            </div>

            {/* Upload + Poll */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={S.card}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1e1b4b",
                    marginBottom: 10,
                  }}
                >
                  📤 Upload Resources
                </p>
                <div
                  style={{
                    border: "2px dashed #c7d2fe",
                    borderRadius: 10,
                    padding: 16,
                    textAlign: "center",
                    background: "#f5f3ff",
                  }}
                >
                  <p
                    style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}
                  >
                    PDF / Image drag karo
                  </p>
                  <button
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "1.5px solid #6366f1",
                      background: "#fff",
                      color: "#6366f1",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Browse Files
                  </button>
                </div>
              </div>
              <div style={S.card}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1e1b4b",
                    marginBottom: 10,
                  }}
                >
                  📊 Quick Poll
                </p>
                <input
                  value={pollQ}
                  onChange={(e) => setPollQ(e.target.value)}
                  placeholder="Poll question likhein..."
                  style={{ ...S.input, marginBottom: 8 }}
                />
                <div style={{ display: "flex", gap: 7 }}>
                  <button
                    onClick={() => setLaunched(true)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 8,
                      background: "#6366f1",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {launched ? "✅ Launched" : "Launch Poll"}
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 8,
                      border: "1.5px solid #e5e7eb",
                      background: "#f9fafb",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div
          style={{
            width: 210,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: "#1e1b4b",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 110,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar name={room.mentorName} size={52} />
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.4)",
                padding: "7px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>
                {room.mentorName}
              </span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
            </div>
            <p
              style={{
                fontSize: 11,
                textAlign: "center",
                color: "#a78bfa",
                padding: "4px 0 8px",
                margin: 0,
              }}
            >
              Mentor (You)
            </p>
          </div>
          <div style={{ ...S.card, flex: 1 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1e1b4b",
                marginBottom: 10,
              }}
            >
              Participants
            </p>
            {students.slice(0, 5).map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Avatar name={s.name} size={26} />
                <span
                  style={{
                    fontSize: 12,
                    color: "#374151",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.name}
                </span>
                <span style={{ fontSize: 10 }}>{s.muted ? "🔇" : "🎙"}</span>
              </div>
            ))}
            {students.length > 5 && (
              <p style={{ fontSize: 11, color: "#9ca3af" }}>
                +{students.length - 5} more
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — MentorApp
// Pura app Isolated wrapper ke andar hai — ClassBuzz sidebar safe rahega
// ─────────────────────────────────────────────────────────────────────────────
export default function MentorApp() {
  const [screen, setScreen] = useState("create");
  const [room, setRoom] = useState(null);

  return (
    <Isolated>
      {screen === "create" && (
        <CreateRoom
          onCreated={(rd) => {
            setRoom(rd);
            setScreen("created");
          }}
        />
      )}
      {screen === "created" && (
        <RoomCreated room={room} onEnterRoom={() => setScreen("room")} />
      )}
      {screen === "room" && (
        <MentorRoom
          room={room}
          onEndRoom={() => {
            setRoom(null);
            setScreen("create");
          }}
        />
      )}
    </Isolated>
  );
}
