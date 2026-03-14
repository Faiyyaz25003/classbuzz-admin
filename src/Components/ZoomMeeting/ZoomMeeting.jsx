"use client";

import { useState } from "react";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
];

const ALL_STUDENTS = [
  { id: 1, name: "Riya Sharma", email: "riya@school.com", batch: "Batch A" },
  { id: 2, name: "Aman Mehta", email: "aman@school.com", batch: "Batch A" },
  { id: 3, name: "Priya Kaur", email: "priya@school.com", batch: "Batch B" },
  { id: 4, name: "Rohan Das", email: "rohan@school.com", batch: "Batch B" },
  { id: 5, name: "Sneha Patel", email: "sneha@school.com", batch: "Batch A" },
  { id: 6, name: "Karan Verma", email: "karan@school.com", batch: "Batch C" },
  { id: 7, name: "Pooja Singh", email: "pooja@school.com", batch: "Batch C" },
  { id: 8, name: "Dev Sharma", email: "dev@school.com", batch: "Batch A" },
  { id: 9, name: "Ananya Gupta", email: "ananya@school.com", batch: "Batch B" },
  { id: 10, name: "Rahul Joshi", email: "rahul@school.com", batch: "Batch C" },
];

const BATCHES = ["All Batches", "Batch A", "Batch B", "Batch C"];

const MOCK_DOUBTS = [
  { id: 1, name: "Riya Sharma", text: "Step 3 nahi samjha" },
  { id: 2, name: "Aman Mehta", text: "Formula ka sign galat?" },
];

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
];

function avatarColor(n) {
  return AVATAR_COLORS[
    (n.charCodeAt(0) + (n.charCodeAt(1) || 0)) % AVATAR_COLORS.length
  ];
}

function initials(n) {
  return n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function genCode(subject) {
  const prefix = subject.slice(0, 4).toUpperCase();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `${prefix}-${rand}`;
}

// ─── Avatar ──────────────────────────────────────────────────
function Avatar({ name, size = "sm" }) {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };
  return (
    <div
      className={`${sizes[size]} ${avatarColor(name)} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
    >
      {initials(name)}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${value ? "bg-indigo-500" : "bg-gray-200"}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${value ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

// ─── Student Selector ────────────────────────────────────────
function StudentSelector({ selected, onChange }) {
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = ALL_STUDENTS.filter((s) => {
    const matchBatch = batchFilter === "All Batches" || s.batch === batchFilter;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchBatch && matchSearch;
  });

  const toggleStudent = (id) =>
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );

  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1.5">
        👥 Students Select Karein *
      </label>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-left flex justify-between items-center bg-white hover:border-indigo-300 transition-colors"
      >
        <span className={selected.length ? "text-gray-800" : "text-gray-400"}>
          {selected.length === 0
            ? "Students choose karein..."
            : selected.length === ALL_STUDENTS.length
              ? "Sab students selected"
              : `${selected.length} student${selected.length > 1 ? "s" : ""} selected`}
        </span>
        <span className="text-gray-400 text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.slice(0, 5).map((id) => {
            const s = ALL_STUDENTS.find((x) => x.id === id);
            if (!s) return null;
            return (
              <div
                key={id}
                className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5"
              >
                <Avatar name={s.name} size="sm" />
                <span className="text-xs font-semibold text-indigo-700">
                  {s.name.split(" ")[0]}
                </span>
                <button
                  type="button"
                  onClick={() => toggleStudent(id)}
                  className="text-indigo-400 hover:text-indigo-600 font-bold text-xs ml-0.5"
                >
                  ×
                </button>
              </div>
            );
          })}
          {selected.length > 5 && (
            <div className="bg-indigo-100 rounded-full px-3 py-0.5 text-xs font-semibold text-indigo-600">
              +{selected.length - 5} more
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
          <div className="p-3 border-b border-gray-100 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search naam ya email..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400"
              onClick={(e) => e.stopPropagation()}
            />
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {BATCHES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="px-3 py-2 border-b border-gray-100 flex gap-3 items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(filtered.map((s) => s.id));
              }}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-700"
            >
              ✓ Sab Select
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="text-xs font-semibold text-red-400 hover:text-red-600"
            >
              ✕ Clear All
            </button>
            <span className="ml-auto text-xs text-gray-400">
              {selected.length}/{ALL_STUDENTS.length}
            </span>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Koi student nahi mila
              </p>
            ) : (
              filtered.map((s) => {
                const isSel = selected.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStudent(s.id);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer border-b border-gray-50 transition-colors ${isSel ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${isSel ? "bg-indigo-500" : "border-2 border-gray-300"}`}
                    >
                      {isSel && (
                        <span className="text-white text-[9px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-500 font-semibold rounded px-2 py-0.5 whitespace-nowrap">
                      {s.batch}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN 0 — LANDING ──────────────────────────────────────
function Landing({ onCreateRoom, onJoinRoom }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-10 py-5 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl">
          🏫
        </div>
        <span className="text-gray-900 font-black text-2xl tracking-tight">
          ClassBuzz
        </span>
        <span className="ml-2 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full px-3 py-1 font-semibold">
          Live Room
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-500 font-medium">
            Platform Online
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold text-indigo-700">
              Interactive Live Classroom Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-5">
            Padhai ab hogi
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              live &amp; interactive
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Mentor room banao ya join karo — whiteboard, polls, aur doubts sab
            ek jagah.
          </p>
        </div>

        {/* Two big cards */}
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 mb-16">
          <button
            type="button"
            onClick={onCreateRoom}
            className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-10 text-left hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-indigo-200">
                🏫
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Room Banao
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Naya live class shuru karo. Subject, topic set karo, students
                invite karo — aur padhaana shuru karo.
              </p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <span>Create a Room</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors" />
            <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-violet-50/50" />
          </button>

          <button
            type="button"
            onClick={onJoinRoom}
            className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-10 text-left hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-emerald-200">
                🚀
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Room Join Karo
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Room code dalo aur apne mentor ki class mein instantly join
                karo. Doubts pucho, polls mein participate karo.
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span>Join a Room</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors" />
            <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-teal-50/50" />
          </button>
        </div>

        <div className="flex gap-12 text-center">
          {[
            ["10+", "Students"],
            ["7", "Subjects"],
            ["Live", "Whiteboard"],
            ["Real-time", "Doubts"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-black text-gray-900">{v}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN — JOIN ROOM ───────────────────────────────────────
function JoinRoom({ onBack }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (!name.trim()) {
      setError("Apna naam daalo");
      return;
    }
    if (code.trim().length < 6) {
      setError("Valid room code daalo (e.g. MATH-8EY4)");
      return;
    }
    setJoined(true);
  };

  if (joined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 w-full max-w-md text-center border border-gray-200 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-4xl mx-auto mb-5">
            ✅
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Room Mein Aa Gaye!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Welcome, {name}! Room{" "}
            <span className="font-black text-indigo-600 font-mono tracking-widest">
              {code.toUpperCase()}
            </span>{" "}
            mein join kar liya.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">
              Room Code
            </p>
            <p className="text-3xl font-black text-indigo-600 font-mono tracking-widest">
              {code.toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            ← Wapas Jao
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-10 w-full max-w-md border border-gray-200 shadow-xl">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-indigo-500 hover:text-indigo-700 font-semibold mb-6 flex items-center gap-1"
        >
          ← Wapas Jao
        </button>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-100">
            🚀
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Room Join Karo</h2>
            <p className="text-xs text-gray-400">
              Code daalo aur class mein join karo
            </p>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              👤 Aapka Naam *
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Riya Sharma"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              🔑 Room Code *
            </label>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="e.g. MATH-8EY4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg font-mono tracking-widest text-indigo-700 font-black focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-indigo-50 uppercase text-center"
            />
          </div>
          <button
            type="button"
            onClick={handleJoin}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-200"
          >
            🚀 Join Room Karein
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 1 — CREATE ROOM (Two-Column Layout) ──────────────
function CreateRoom({ onCreated, onBack }) {
  const [mentorName, setMentorName] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("60");
  const [maxStudents, setMaxStudents] = useState("30");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [allowAll, setAllowAll] = useState(true);
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
    if (!allowAll && selectedStudents.length === 0) {
      setError("Kam se kam ek student select karein");
      return;
    }
    const invitedStudents = allowAll
      ? ALL_STUDENTS
      : ALL_STUDENTS.filter((s) => selectedStudents.includes(s.id));
    onCreated({
      code: genCode(subject),
      mentorName: mentorName.trim(),
      subject,
      topic,
      duration,
      maxStudents,
      allowChat,
      allowWb,
      allowAll,
      invitedStudents,
    });
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white text-gray-800";
  const labelCls = "text-xs font-semibold text-gray-600 block mb-1.5";
  const sectionTitle =
    "text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        {/* ── Sticky Header ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-5 flex items-center gap-4 rounded-t-3xl">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1"
          >
            ← Wapas
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg">
            🏫
          </div>
          <div>
            <p className="text-lg font-black text-gray-900 leading-tight">
              Naya Room Banao
            </p>
            <p className="text-xs text-gray-400">
              Room ka details bharein — ek unique code milega
            </p>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* ── Two Column Body ── */}
        <div className="p-8 grid grid-cols-2 gap-8">
          {/* ════ LEFT COLUMN ════ */}
          <div className="flex flex-col gap-6">
            {/* Section: Basic Info */}
            <div>
              <p className={sectionTitle}>
                <span>👤</span> Basic Information
              </p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Aapka Naam *</label>
                  <input
                    value={mentorName}
                    onChange={(e) => {
                      setMentorName(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g. Arjun Kumar"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>📚 Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={inputCls}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>📖 Topic / Chapter *</label>
                  <input
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g. Quadratic Equations"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Section: Class Config */}
            <div>
              <p className={sectionTitle}>
                <span>⚙️</span> Class Configuration
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>⏱ Duration (min)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={inputCls}
                  >
                    {["30", "45", "60", "90", "120"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>🔢 Max Students</label>
                  <select
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                    className={inputCls}
                  >
                    {["10", "20", "30", "50", "100"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                {[
                  {
                    label: "💬 Students ko chat allow karein",
                    val: allowChat,
                    set: setAllowChat,
                  },
                  {
                    label: "🖊 Students ko whiteboard allow karein",
                    val: allowWb,
                    set: setAllowWb,
                  },
                ].map(({ label, val, set }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{label}</span>
                    <Toggle value={val} onChange={set} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="flex flex-col gap-6">
            {/* Section: Room Access */}
            <div>
              <p className={sectionTitle}>
                <span>🎯</span> Room Access
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Kaun join kar sakta hai ye room?
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  {
                    val: true,
                    icon: "🌐",
                    label: "Sabko Allow",
                    sub: "Koi bhi code se join kar sakta hai",
                  },
                  {
                    val: false,
                    icon: "🔒",
                    label: "Sirf Selected",
                    sub: "Sirf invited students join kar sakte hain",
                  },
                ].map(({ val, icon, label, sub }) => (
                  <div
                    key={String(val)}
                    onClick={() => {
                      setAllowAll(val);
                      setError("");
                    }}
                    className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${allowAll === val ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50"}`}
                  >
                    <div className={`text-2xl mb-2`}>{icon}</div>
                    <p
                      className={`text-sm font-bold mb-1 ${allowAll === val ? "text-indigo-700" : "text-gray-700"}`}
                    >
                      {label}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      {sub}
                    </p>
                    {allowAll === val && (
                      <div className="mt-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center ml-auto">
                        <span className="text-white text-[9px] font-bold">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!allowAll ? (
                <StudentSelector
                  selected={selectedStudents}
                  onChange={(ids) => {
                    setSelectedStudents(ids);
                    setError("");
                  }}
                />
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
                  <span className="text-base mt-0.5">ℹ️</span>
                  <span>
                    Room code share karo — koi bhi join kar sakta hai. Abhi{" "}
                    <strong>{ALL_STUDENTS.length}</strong> registered students
                    hain.
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Preview Card */}
            <div>
              <p className={sectionTitle}>
                <span>👁</span> Room Preview
              </p>
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-lg">
                    🏫
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {mentorName || "Mentor naam..."}
                    </p>
                    <p className="text-xs text-gray-500">{subject}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    ["📖 Topic", topic || "—"],
                    ["⏱ Duration", `${duration} min`],
                    ["👥 Max", `${maxStudents} students`],
                    [
                      "🎯 Access",
                      allowAll
                        ? "Open to all"
                        : `${selectedStudents.length} selected`,
                    ],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-gray-400">{k}</span>
                      <span className="font-semibold text-gray-700">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-indigo-100 flex gap-3 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${allowChat ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
                  >
                    {allowChat ? "✓ Chat" : "✗ Chat"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${allowWb ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
                  >
                    {allowWb ? "✓ Whiteboard" : "✗ Whiteboard"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleCreate}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              🚀 Room Create Karein →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 2 — ROOM CREATED ──────────────────────────────────
function RoomCreated({ room, onEnterRoom, onBack }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard?.writeText(room.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const summary = [
    ["👤 Mentor", room.mentorName],
    ["📚 Subject", room.subject],
    ["📖 Topic", room.topic],
    ["⏱ Duration", `${room.duration} min`],
    ["🔢 Max Students", room.maxStudents],
    [
      "🎯 Access",
      room.allowAll ? "Sab allowed" : `${room.invitedStudents.length} students`,
    ],
    ["💬 Chat", room.allowChat ? "Allowed" : "Off"],
    ["🖊 Whiteboard", room.allowWb ? "Allowed" : "Off"],
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-white" />
            <div className="absolute -bottom-8 right-1/4 w-24 h-24 rounded-full bg-white" />
          </div>
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl mx-auto mb-4">
              ✅
            </div>
            <h2 className="text-2xl font-black text-white mb-1">
              Room Ready Hai!
            </h2>
            <p className="text-indigo-200 text-sm">
              {room.allowAll
                ? "Ye code sabko share karein"
                : `${room.invitedStudents.length} selected students ko share karein`}
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-2xl p-6 text-center mb-5">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              Room Code
            </p>
            <p className="text-4xl font-black text-indigo-600 font-mono tracking-widest">
              {room.code}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-1">
            {summary.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs text-gray-400">{k}</span>
                <span className="text-xs font-bold text-gray-700">{v}</span>
              </div>
            ))}
          </div>

          {!room.allowAll && room.invitedStudents.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-emerald-700 mb-3">
                ✅ Invited Students ({room.invitedStudents.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {room.invitedStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-1.5 bg-white border border-emerald-200 rounded-full px-2.5 py-1"
                  >
                    <Avatar name={s.name} size="sm" />
                    <span className="text-xs font-semibold text-gray-700">
                      {s.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={copyCode}
              className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${copied ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"}`}
            >
              {copied ? "✅ Copied!" : "📋 Code Copy Karein"}
            </button>
            <button
              type="button"
              onClick={onEnterRoom}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-200"
            >
              Room Mein Jaao →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 3 — MENTOR ROOM ───────────────────────────────────
function MentorRoom({ room, onEndRoom }) {
  const [students, setStudents] = useState(
    room.invitedStudents
      .slice(0, 5)
      .map((s, i) => ({ ...s, muted: i % 2 === 1 })),
  );
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

  const stats = [
    {
      label: "Students Online",
      value: students.length,
      color: "text-indigo-600",
    },
    { label: "Doubts Raised", value: doubts.length, color: "text-amber-600" },
    {
      label: "Duration",
      value: `${room.duration}m`,
      color: "text-emerald-600",
    },
    {
      label: "Muted",
      value: students.filter((s) => s.muted).length,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-wrap sticky top-0 z-20 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">
          🏫
        </div>
        <span className="font-black text-gray-900 text-base">ClassBuzz</span>
        <div className="w-px h-5 bg-gray-200" />
        <Avatar name={room.mentorName} size="md" />
        <div>
          <p className="text-gray-800 font-bold text-sm">
            {room.mentorName} — Mentor
          </p>
          <p className="text-gray-400 text-xs">
            {room.subject} · {room.topic} · {students.length} students
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-sm font-black text-indigo-600 font-mono tracking-widest">
          {room.code}
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setMicOn((m) => !m)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${micOn ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-red-50 border-red-200 text-red-600"}`}
          >
            {micOn ? "🎙 Mute" : "🔇 Muted"}
          </button>
          <button
            type="button"
            onClick={() => setCamOn((c) => !c)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${camOn ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-red-50 border-red-200 text-red-600"}`}
          >
            {camOn ? "📷 On" : "📷 Off"}
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            🖥 Share Screen
          </button>
          <button
            type="button"
            onClick={onEndRoom}
            className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
          >
            End Room
          </button>
        </div>
      </nav>

      {/* BODY */}
      <div className="flex gap-4 p-4 flex-1">
        {/* MAIN */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-4 border border-gray-200 text-center shadow-sm"
              >
                <p className={`text-3xl font-black font-mono ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-semibold uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Whiteboard */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="font-bold text-sm text-gray-800">
                Whiteboard — {room.topic}
              </span>
              <span className="bg-violet-100 text-violet-700 text-[10px] font-bold rounded px-2 py-0.5">
                Presenting
              </span>
              <button
                type="button"
                onClick={() => setLocked((l) => !l)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition-colors ${locked ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {locked ? "🔒 Locked" : "🔓 Lock"}
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded-lg border border-gray-200 bg-gray-50 text-xs hover:bg-gray-100"
              >
                💾 Save
              </button>
              <div className="ml-auto flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${broadcast ? "bg-emerald-400" : "bg-gray-300"}`}
                />
                <span
                  className={`text-xs font-bold ${broadcast ? "text-emerald-600" : "text-gray-400"}`}
                >
                  Broadcast: {broadcast ? "ON" : "OFF"}
                </span>
                <button
                  type="button"
                  onClick={() => setBroadcast((b) => !b)}
                  className="text-[10px] px-2 py-1 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100"
                >
                  Toggle
                </button>
              </div>
            </div>
            <div
              onClick={wbClick}
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 relative cursor-crosshair overflow-hidden"
              style={{ minHeight: 200 }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
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
              <div className="p-5 relative">
                <p className="text-xs text-gray-400 font-mono mb-3">
                  {room.subject} · {room.topic} · Click to annotate
                </p>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg inline-block px-4 py-2">
                  <span className="font-mono text-base font-bold text-gray-800">
                    x = (−b ± √(b²−4ac)) / 2a
                  </span>
                </div>
              </div>
              {dots.map((d, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-indigo-500 pointer-events-none"
                  style={{ left: d.x - 4, top: d.y - 4 }}
                />
              ))}
              <div className="absolute top-3 right-3 bg-emerald-100 border border-emerald-300 rounded-full px-3 py-1 text-[10px] text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live sync
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm max-h-80 overflow-y-auto">
              <p className="font-bold text-sm text-gray-800 mb-3">
                🙋 Doubt Queue
              </p>
              {doubts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
                  No pending doubts ✅
                </p>
              ) : (
                doubts.map((d) => (
                  <div
                    key={d.id}
                    className="bg-gray-50 rounded-xl p-3 mb-2 border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar name={d.name} size="sm" />
                      <span className="text-sm font-bold text-gray-800">
                        {d.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{d.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
                      >
                        Allow Mic
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissDoubt(d.id)}
                        className="py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs font-bold hover:bg-red-100"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
              <p className="font-bold text-xs text-gray-600 mt-4 mb-2 uppercase tracking-wide">
                Student Controls
              </p>
              {students.map((s) => (
                <div key={s.id} className="flex items-center gap-2 mb-2">
                  <Avatar name={s.name} size="sm" />
                  <span className="text-xs text-gray-700 flex-1 truncate">
                    {s.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleMute(s.id)}
                    className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${s.muted ? "bg-red-50 border-red-200 text-red-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                  >
                    {s.muted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    type="button"
                    onClick={() => kickStudent(s.id)}
                    className="px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-red-500 text-[10px] font-bold"
                  >
                    Kick
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={muteAll}
                className="w-full mt-2 py-2 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold transition-colors"
              >
                🔇 Mute All
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <p className="font-bold text-sm text-gray-800 mb-3">
                  📤 Upload Resources
                </p>
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-5 text-center bg-indigo-50">
                  <p className="text-xs text-gray-400 mb-3">
                    PDF / Image drag karo ya browse karo
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border-2 border-indigo-400 text-indigo-600 font-bold text-xs bg-white hover:bg-indigo-50 transition-colors"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex-1">
                <p className="font-bold text-sm text-gray-800 mb-3">
                  📊 Quick Poll
                </p>
                <input
                  value={pollQ}
                  onChange={(e) => setPollQ(e.target.value)}
                  placeholder="Poll question likhein..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 mb-3"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLaunched(true)}
                    className={`py-2 rounded-xl font-bold text-xs transition-colors ${launched ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                  >
                    {launched ? "✅ Launched" : "Launch Poll"}
                  </button>
                  <button
                    type="button"
                    className="py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-bold text-xs hover:bg-gray-100"
                  >
                    Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-52 flex flex-col gap-3 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-24 flex items-center justify-center bg-gradient-to-b from-indigo-600 to-indigo-700">
              <Avatar name={room.mentorName} size="lg" />
            </div>
            <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-b border-gray-100">
              <span className="text-gray-800 text-xs font-bold">
                {room.mentorName}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] text-center text-indigo-500 py-2 font-semibold">
              Mentor (You)
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex-1">
            <p className="font-bold text-sm text-gray-800 mb-3">Participants</p>
            {students.slice(0, 6).map((s) => (
              <div key={s.id} className="flex items-center gap-2 mb-2.5">
                <Avatar name={s.name} size="sm" />
                <span className="text-xs text-gray-700 flex-1 truncate">
                  {s.name}
                </span>
                <span className="text-xs">{s.muted ? "🔇" : "🎙"}</span>
              </div>
            ))}
            {students.length > 6 && (
              <p className="text-xs text-gray-400">
                +{students.length - 6} more
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function ClassBuzzApp() {
  const [screen, setScreen] = useState("landing");
  const [room, setRoom] = useState(null);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {screen === "landing" && (
        <Landing
          onCreateRoom={() => setScreen("create")}
          onJoinRoom={() => setScreen("join")}
        />
      )}
      {screen === "join" && <JoinRoom onBack={() => setScreen("landing")} />}
      {screen === "create" && (
        <CreateRoom
          onBack={() => setScreen("landing")}
          onCreated={(rd) => {
            setRoom(rd);
            setScreen("created");
          }}
        />
      )}
      {screen === "created" && room && (
        <RoomCreated
          room={room}
          onEnterRoom={() => setScreen("room")}
          onBack={() => setScreen("landing")}
        />
      )}
      {screen === "room" && room && (
        <MentorRoom
          room={room}
          onEndRoom={() => {
            setRoom(null);
            setScreen("landing");
          }}
        />
      )}
    </div>
  );
}
