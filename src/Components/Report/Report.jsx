"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const REFRESH_MS = 30000; // 30 seconds

// ── today's date string YYYY-MM-DD ─────────────────────────────────────────
function getToday() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

function fmtTime(isoStr) {
  if (!isoStr) return "";
  return new Date(isoStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtCurrency(n) {
  return "₹" + Math.round(n || 0).toLocaleString("en-IN");
}

// ── check if a record was created/updated TODAY ────────────────────────────
// looks at every possible date field your backend might use
function createdToday(item, today) {
  const fields = [
    "createdAt",
    "date",
    "feeDate",
    "fromDate",
    "startDate",
    "issueDate",
    "submittedAt",
    "uploadedAt",
    "updatedAt",
  ];
  return fields.some((f) => item[f] && String(item[f]).slice(0, 10) === today);
}

// ── safe array from any API response shape ─────────────────────────────────
function toArr(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // unwrap common wrapper keys
  const wrappers = [
    "data",
    "users",
    "fees",
    "leaves",
    "announcements",
    "lectures",
    "jobs",
    "documents",
    "meetings",
    "tasks",
    "events",
    "games",
    "results",
    "courses",
    "issued",
    "records",
    "items",
  ];
  for (const k of wrappers) {
    if (Array.isArray(data[k])) return data[k];
  }
  const found = Object.values(data).find(Array.isArray);
  return found || [];
}

// ── fetch EVERYTHING, filter to today only ─────────────────────────────────
async function fetchTodayData() {
  const today = getToday();

  const endpoints = [
    { key: "users", url: `${API}/users` },
    { key: "fees", url: `${API}/fees` },
    { key: "leaves", url: `${API}/leave` },
    { key: "announcements", url: `${API}/announcements/all` },
    { key: "lectures", url: `${API}/lectures` },
    { key: "jobs", url: `${API}/jobs/all` },
    { key: "documents", url: `${API}/documents` },
    { key: "meetings", url: `${API}/meetings` },
    { key: "tasks", url: `${API}/tasks` },
    { key: "events", url: `${API}/events` },
    { key: "games", url: `${API}/games/all` },
    { key: "results", url: `${API}/result` },
    { key: "issued", url: `${API}/issued` },
  ];

  const responses = await Promise.allSettled(
    endpoints.map((e) => axios.get(e.url)),
  );

  // build raw map
  const raw = {};
  endpoints.forEach((e, i) => {
    const r = responses[i];
    raw[e.key] = toArr(r.status === "fulfilled" ? r.value.data : []);
  });

  // filter every collection to today only
  const f = {};
  Object.keys(raw).forEach((k) => {
    f[k] = raw[k].filter((item) => createdToday(item, today));
  });

  // ── shape the data ──────────────────────────────────────────────────────
  return {
    today,

    users: f.users.map((u) => ({
      name: u.name || "—",
      email: u.email || "—",
      positions: u.positions?.join(", ") || "—",
      time: fmtTime(u.createdAt),
    })),

    fees: f.fees.map((fee) => ({
      student: fee.userId?.name || "—",
      amount: fee.amount,
      method: fee.paymentMethod || "—",
      inst: fee.installment,
      time: fmtTime(fee.feeDate || fee.createdAt),
    })),
    feesTotal: f.fees.reduce((s, fee) => s + Number(fee.amount || 0), 0),

    leaves: f.leaves.map((l) => ({
      name: l.userName || "—",
      type: l.leaveType || "—",
      status: l.status,
      from: l.fromDate?.slice(0, 10) || "—",
      to: l.toDate?.slice(0, 10) || "—",
      time: fmtTime(l.createdAt),
    })),

    announcements: f.announcements.map((a) => ({
      title: a.title || "—",
      type: a.type || "Notice",
      dept: a.department || "All",
      time: fmtTime(a.createdAt || a.startDate),
    })),

    lectures: f.lectures.map((l) => ({
      title: l.lectureTitle || l.title || "Untitled",
      subject: l.subject || "—",
      dept: l.department || "—",
      hasYt: !!l.youtubeUrl,
      hasFile: !!l.videoFile,
      time: fmtTime(l.createdAt || l.date),
    })),

    jobs: f.jobs.map((j) => ({
      title: j.title || "—",
      company: j.company || "—",
      type: j.type || "—",
      mode: j.mode || "—",
      time: fmtTime(j.createdAt),
    })),

    documents: f.documents.map((d) => ({
      name: d.name || "—",
      user: d.user?.name || "—",
      status: d.status,
      time: fmtTime(d.createdAt),
    })),

    meetings: f.meetings.map((m) => ({
      title: m.title || "—",
      time: m.time || fmtTime(m.createdAt),
      date: m.date?.slice(0, 10) || today,
    })),

    tasks: f.tasks.map((t) => ({
      title: t.title || "—",
      time: t.time || fmtTime(t.createdAt),
      date: t.date?.slice(0, 10) || today,
    })),

    events: f.events.map((e) => ({
      title: e.title || "—",
      category: e.category || "—",
      time: e.time || fmtTime(e.createdAt),
    })),

    results: f.results.map((r) => {
      const tot = r.marks?.reduce((a, m) => a + (m.maxMarks || 0), 0) || 0;
      const obt = r.marks?.reduce((a, m) => a + (m.obtained || 0), 0) || 0;
      return {
        student: r.userId?.name || "—",
        course: r.courseId?.name || "—",
        sem: r.semester,
        pct: tot > 0 ? Math.round((obt / tot) * 100) : 0,
        time: fmtTime(r.createdAt),
      };
    }),

    issued: f.issued.map((i) => ({
      book: i.bookName || i.subject || "—",
      student: i.studentName || "—",
      dept: i.department || "—",
      time: fmtTime(i.createdAt || i.issueDate),
    })),
  };
}

// ── small UI pieces ────────────────────────────────────────────────────────
function Badge({ text, color }) {
  const map = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    teal: "bg-teal-100 text-teal-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${map[color] || map.gray}`}
    >
      {text}
    </span>
  );
}

function Section({ title, count, children, emptyText }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {title}
        </p>
        <span className="text-[11px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
          {count} today
        </span>
      </div>
      {count === 0 ? (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3 border border-dashed border-gray-200">
          {emptyText || `No ${title.toLowerCase()} today`}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

function Row({ children }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 last:border-0 gap-3 text-sm">
      {children}
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────
export default function DailyReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [autoOn, setAutoOn] = useState(true);
  const [mode, setMode] = useState("today");
  const [customDate, setCustomDate] = useState(getToday());

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchTodayData();
      setData(d);
      setLastRefresh(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (e) {
      console.error(e);
      setError(
        "Backend se data nahi aaya. Check karo localhost:5000 chal raha hai.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(30);
    timerRef.current = setInterval(() => {
      load();
      setCountdown(30);
    }, REFRESH_MS);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 30 : c - 1));
    }, 1000);
  }, [load]);

  const stopAuto = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
  }, []);

  // initial load + auto-start
  useEffect(() => {
    load();
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleAuto = () => {
    if (autoOn) {
      stopAuto();
      setAutoOn(false);
    } else {
      startAuto();
      setAutoOn(true);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center gap-3 text-gray-500 text-sm">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        Aaj ka data load ho raha hai...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        {error}
      </div>
    );
  }

  const d = data;
  const totalActivity =
    d.users.length +
    d.fees.length +
    d.leaves.length +
    d.announcements.length +
    d.lectures.length +
    d.jobs.length +
    d.documents.length +
    d.meetings.length +
    d.tasks.length +
    d.events.length +
    d.results.length +
    d.issued.length;

  const statusBadge = (s) => {
    if (!s) return { text: "—", color: "gray" };
    const map = {
      Pending: { text: "Pending", color: "amber" },
      Approved: { text: "Approved", color: "green" },
      Rejected: { text: "Rejected", color: "red" },
      accepted: { text: "Accepted", color: "green" },
      pending: { text: "Pending", color: "amber" },
      rejected: { text: "Rejected", color: "red" },
    };
    return map[s] || { text: s, color: "gray" };
  };

  const announceColor = {
    Holiday: "teal",
    Exam: "red",
    Notice: "amber",
    Workshop: "blue",
    Seminar: "purple",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Daily report
            <span className="ml-2 text-sm font-normal text-gray-400">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {totalActivity === 0
              ? "Aaj abhi tak koi naya data nahi aaya."
              : `${totalActivity} total new entries aaj database mein add hue.`}
            {lastRefresh && ` · Last checked: ${lastRefresh}`}
            {loading && " · Refreshing..."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* live pulse */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className={`w-2 h-2 rounded-full bg-green-500 ${autoOn ? "animate-pulse" : "opacity-30"}`}
            />
            {autoOn ? `Live · ${countdown}s` : "Paused"}
          </div>

          {/* refresh now */}
          <button
            onClick={load}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition"
          >
            Refresh now
          </button>

          {/* pause / resume */}
          <button
            onClick={handleToggleAuto}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition"
          >
            {autoOn ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* ── NO ACTIVITY ────────────────────────────────────────────── */}
      {totalActivity === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-6 text-center text-sm text-blue-600 mb-5">
          Aaj ke liye koi naya data database mein nahi mila.
          <br />
          <span className="text-xs text-blue-400 mt-1 block">
            Jaise hi koi entry add hogi, yahan automatically dikh jaayegi.
          </span>
        </div>
      )}

      {/* ── NEW USERS ──────────────────────────────────────────────── */}
      <Section
        title="New users"
        count={d.users.length}
        emptyText="Aaj koi naya user register nahi hua"
      >
        {d.users.map((u, i) => (
          <Row key={i}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">{u.name}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge text={u.positions} color="blue" />
              <span className="text-xs text-gray-400">{u.time}</span>
            </div>
          </Row>
        ))}
      </Section>

      {/* ── FEE PAYMENTS ───────────────────────────────────────────── */}
      <Section
        title="Fee payments"
        count={d.fees.length}
        emptyText="Aaj koi fee payment nahi hua"
      >
        {d.fees.length > 0 && (
          <div className="px-4 py-2 bg-green-50 border-b border-gray-100 text-xs font-medium text-green-700">
            Total collected today: {fmtCurrency(d.feesTotal)}
          </div>
        )}
        {d.fees.map((f, i) => (
          <Row key={i}>
            <div>
              <p className="font-medium text-gray-800">{f.student}</p>
              <p className="text-xs text-gray-400">
                Inst. {f.inst} · {f.method}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-semibold text-green-700 text-sm">
                {fmtCurrency(f.amount)}
              </span>
              <span className="text-xs text-gray-400">{f.time}</span>
            </div>
          </Row>
        ))}
      </Section>

      {/* ── LEAVE APPLICATIONS ─────────────────────────────────────── */}
      <Section
        title="Leave applications"
        count={d.leaves.length}
        emptyText="Aaj koi leave application nahi aayi"
      >
        {d.leaves.map((l, i) => {
          const s = statusBadge(l.status);
          return (
            <Row key={i}>
              <div>
                <p className="font-medium text-gray-800">{l.name}</p>
                <p className="text-xs text-gray-400">
                  {l.type} · {l.from} to {l.to}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge text={s.text} color={s.color} />
                <span className="text-xs text-gray-400">{l.time}</span>
              </div>
            </Row>
          );
        })}
      </Section>

      {/* ── ANNOUNCEMENTS ──────────────────────────────────────────── */}
      <Section
        title="Announcements"
        count={d.announcements.length}
        emptyText="Aaj koi announcement post nahi hua"
      >
        {d.announcements.map((a, i) => (
          <Row key={i}>
            <div className="flex items-center gap-2 min-w-0">
              <Badge text={a.type} color={announceColor[a.type] || "gray"} />
              <p className="text-gray-800 truncate">{a.title}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-400">
              <span>{a.dept}</span>
              <span>{a.time}</span>
            </div>
          </Row>
        ))}
      </Section>

      {/* ── LECTURES ───────────────────────────────────────────────── */}
      <Section
        title="Lectures uploaded"
        count={d.lectures.length}
        emptyText="Aaj koi lecture upload nahi hua"
      >
        {d.lectures.map((l, i) => (
          <Row key={i}>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 truncate">{l.title}</p>
              <p className="text-xs text-gray-400">
                {l.subject} · {l.dept}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {l.hasYt && <Badge text="YouTube" color="red" />}
              {l.hasFile && <Badge text="Video" color="blue" />}
              <span className="text-xs text-gray-400">{l.time}</span>
            </div>
          </Row>
        ))}
      </Section>

      {/* ── JOBS ───────────────────────────────────────────────────── */}
      <Section
        title="Jobs posted"
        count={d.jobs.length}
        emptyText="Aaj koi job post nahi hua"
      >
        {d.jobs.map((j, i) => (
          <Row key={i}>
            <div>
              <p className="font-medium text-gray-800">{j.title}</p>
              <p className="text-xs text-gray-400">{j.company}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge text={j.type} color="blue" />
              <Badge text={j.mode} color="teal" />
              <span className="text-xs text-gray-400">{j.time}</span>
            </div>
          </Row>
        ))}
      </Section>

      {/* ── DOCUMENTS ──────────────────────────────────────────────── */}
      <Section
        title="Documents uploaded"
        count={d.documents.length}
        emptyText="Aaj koi document upload nahi hua"
      >
        {d.documents.map((doc, i) => {
          const s = statusBadge(doc.status);
          return (
            <Row key={i}>
              <div>
                <p className="font-medium text-gray-800">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.user}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge text={s.text} color={s.color} />
                <span className="text-xs text-gray-400">{doc.time}</span>
              </div>
            </Row>
          );
        })}
      </Section>

      {/* ── MEETINGS ───────────────────────────────────────────────── */}
      <Section
        title="Meetings scheduled"
        count={d.meetings.length}
        emptyText="Aaj koi meeting schedule nahi hua"
      >
        {d.meetings.map((m, i) => (
          <Row key={i}>
            <p className="font-medium text-gray-800">{m.title}</p>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {m.time}
            </span>
          </Row>
        ))}
      </Section>

      {/* ── TASKS ──────────────────────────────────────────────────── */}
      <Section
        title="Tasks created"
        count={d.tasks.length}
        emptyText="Aaj koi task create nahi hua"
      >
        {d.tasks.map((t, i) => (
          <Row key={i}>
            <p className="font-medium text-gray-800">{t.title}</p>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {t.time}
            </span>
          </Row>
        ))}
      </Section>

      {/* ── CALENDAR EVENTS ────────────────────────────────────────── */}
      <Section
        title="Calendar events"
        count={d.events.length}
        emptyText="Aaj koi calendar event nahi hua"
      >
        {d.events.map((e, i) => (
          <Row key={i}>
            <div>
              <p className="font-medium text-gray-800">{e.title}</p>
              <p className="text-xs text-gray-400">{e.category}</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {e.time}
            </span>
          </Row>
        ))}
      </Section>

      {/* ── EXAM RESULTS ───────────────────────────────────────────── */}
      <Section
        title="Exam results entered"
        count={d.results.length}
        emptyText="Aaj koi result enter nahi hua"
      >
        {d.results.map((r, i) => (
          <Row key={i}>
            <div>
              <p className="font-medium text-gray-800">{r.student}</p>
              <p className="text-xs text-gray-400">
                {r.course} · Sem {r.sem}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge text={`${r.pct}%`} color={r.pct >= 60 ? "green" : "red"} />
              <span className="text-xs text-gray-400">{r.time}</span>
            </div>
          </Row>
        ))}
      </Section>

      {/* ── LIBRARY ISSUES ─────────────────────────────────────────── */}
      <Section
        title="Books issued"
        count={d.issued.length}
        emptyText="Aaj koi book issue nahi hua"
      >
        {d.issued.map((b, i) => (
          <Row key={i}>
            <div>
              <p className="font-medium text-gray-800">{b.book}</p>
              <p className="text-xs text-gray-400">
                {b.student} · {b.dept}
              </p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {b.time}
            </span>
          </Row>
        ))}
      </Section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-200 mt-2">
        <span>
          Sirf aaj ka naya data · {d.today} · Auto-refreshes every 30s
        </span>
        <span>Last refresh: {lastRefresh}</span>
      </div>
    </div>
  );
}
