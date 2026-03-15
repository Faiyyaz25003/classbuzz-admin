"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const API = "http://localhost:5000/api";

/* ── Font constants — avoids broken quotes inside JSX style props ── */
const SYSTEM_FONT =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
const MONO_FONT =
  "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace";

/* ── Global Styles Injection ── */
const STYLES = `
  :root {
    --bg: #f5f5f7;
    --surface: #ffffff;
    --surface2: #f0f0f5;
    --border: #e4e4ec;
    --border2: #d0d0df;
    --text: #111118;
    --muted: #8888a0;
    --accent: #5b4ef5;
    --accent2: #7c6af7;
    --green: #0ea87a;
    --red: #e5342e;
    --amber: #d97706;
    --blue: #2563eb;
  }

  .att-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .att-root {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    background: var(--bg); color: var(--text); min-height: 100vh;
  }

  .att-root .font-display {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: 800; letter-spacing: -0.02em;
  }
  .att-root .font-mono {
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace;
  }

  .att-root .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .att-root .card-inner { padding: 24px; }

  .att-root .btn {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid var(--border2);
    background: var(--surface2);
    color: var(--text);
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 13px;
    letter-spacing: 0.02em;
  }
  .att-root .btn:hover { background: #e8e6ff; border-color: var(--accent); color: var(--accent); }
  .att-root .btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .att-root .btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .att-root .btn-primary:hover { background: var(--accent2); border-color: var(--accent2); color: #fff; }

  .att-root .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 13px; color: var(--muted);
    background: none; border: none; cursor: pointer;
    transition: color 0.15s; padding: 0;
  }
  .att-root .back-btn:hover { color: var(--text); }

  .att-root .tab-pill {
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: 600;
    letter-spacing: 0.03em;
    cursor: pointer;
    border: 1px solid var(--border2);
    background: transparent;
    color: var(--muted);
    transition: all 0.15s;
  }
  .att-root .tab-pill:hover { color: var(--accent); background: #eeecff; border-color: var(--accent2); }
  .att-root .tab-pill.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  .att-root .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 24px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .att-root .stat-label {
    font-size: 11px;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .att-root .stat-value {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
  }

  .att-root .row-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.12s;
  }
  .att-root .row-item:last-child { border-bottom: none; }
  .att-root .row-item:hover { background: #f5f4ff; }

  .att-root .badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
    font-weight: 500;
    letter-spacing: 0.04em;
  }
  .att-root .badge-green { background: rgba(14,168,122,0.1); color: var(--green); border: 1px solid rgba(14,168,122,0.25); }
  .att-root .badge-red   { background: rgba(229,52,46,0.09);  color: var(--red);   border: 1px solid rgba(229,52,46,0.22); }
  .att-root .badge-amber { background: rgba(217,119,6,0.1);   color: var(--amber); border: 1px solid rgba(217,119,6,0.25); }
  .att-root .badge-blue  { background: rgba(37,99,235,0.09);  color: var(--blue);  border: 1px solid rgba(37,99,235,0.22); }
  .att-root .badge-accent{ background: rgba(91,78,245,0.1);   color: var(--accent);border: 1px solid rgba(91,78,245,0.25); }

  .att-root table { width: 100%; border-collapse: collapse; }
  .att-root thead tr { background: #f8f8fc; border-bottom: 1px solid var(--border); }
  .att-root thead th {
    padding: 12px 16px;
    text-align: left;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
  }
  .att-root tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .att-root tbody tr:last-child { border-bottom: none; }
  .att-root tbody tr:hover { background: #fafafe; }
  .att-root tbody td { padding: 13px 16px; font-size: 14px; color: var(--text); }

  .att-root .progress-bar  { background: #e8e8f0; border-radius: 999px; height: 6px; overflow: hidden; }
  .att-root .progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }

  .att-root .code-box {
    background: #faf9ff;
    border: 2px solid var(--accent);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 32px rgba(91,78,245,0.1);
  }
  .att-root .code-box::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg, var(--accent) 0%, transparent 60%);
    opacity: 0.04;
    pointer-events: none;
  }

  .att-root .live-dot {
    width: 8px; height: 8px;
    background: var(--red); border-radius: 50%;
    animation: pulse-dot 1.2s infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(0.75); }
  }

  .att-root .page-enter { animation: fadeUp 0.25s ease; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .att-root input[type="date"],
  .att-root input[type="month"] {
    background: var(--surface2);
    border: 1px solid var(--border2);
    color: var(--text);
    border-radius: 10px;
    padding: 8px 14px;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
  }
  .att-root input[type="date"]:focus,
  .att-root input[type="month"]:focus { border-color: var(--accent); }
  .att-root input[type="date"]::-webkit-calendar-picker-indicator,
  .att-root input[type="month"]::-webkit-calendar-picker-indicator {
    filter: opacity(0.5); cursor: pointer;
  }

  .att-root .recharts-cartesian-grid line { stroke: #e4e4ec; }
  .att-root .recharts-text { fill: var(--muted) !important; font-size: 11px; }
  .att-root .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: var(--surface) !important;
    border: 1px solid var(--border2) !important;
    border-radius: 10px !important;
  }
  .att-root .recharts-tooltip-label {
    color: var(--text) !important;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  }

  .att-root .section-title {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: 700; font-size: 18px; color: var(--text); margin-bottom: 4px;
  }
  .att-root .section-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }

  .att-root .calendar-day {
    aspect-ratio: 1;
    border-radius: 10px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-size: 12px;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
    transition: transform 0.1s; cursor: default;
  }
  .att-root .calendar-day:hover { transform: scale(1.08); }

  .att-root .alert-card {
    background: rgba(229,52,46,0.05);
    border: 1px solid rgba(229,52,46,0.18);
    border-radius: 14px;
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .att-root .empty-state {
    padding: 64px; text-align: center; color: var(--muted); font-size: 14px;
  }
`;

/* ── Style Injector ── */
function StyleInjector() {
  useEffect(() => {
    const id = "att-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ── Countdown Hook ── */
function useCountdown(expiresAt) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(0);
      return;
    }
    const tick = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt) - Date.now()) / 1000),
      );
      setSecondsLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  return { display: `${minutes}:${seconds}`, secondsLeft };
}

/* ── Fetch Filtered Students ── */
async function fetchFilteredStudents(courseName, semester) {
  const res = await axios.get(`${API}/users`);
  const allUsers = res.data || [];
  return allUsers.filter((user) => {
    const isStudent = Array.isArray(user.positions)
      ? user.positions.some((p) => p.toLowerCase() === "student")
      : false;
    const inDepartment = Array.isArray(user.departments)
      ? user.departments.some(
          (d) => d.toLowerCase() === String(courseName).toLowerCase(),
        )
      : false;
    const inSemester = String(user.semester).trim() === String(semester).trim();
    return isStudent && inDepartment && inSemester;
  });
}

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #d0d0df",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          fontFamily: MONO_FONT,
          fontSize: 11,
          color: "#8888a0",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{ fontSize: 13, color: p.color, fontFamily: MONO_FONT }}
        >
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ================================================================
   SEMESTER ANALYTICS PAGE
================================================================ */
function SemesterAnalyticsPage({ courseId, courseName, semester, onBack }) {
  const [percentage, setPercentage] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [percRes] = await Promise.all([
          axios.get(`${API}/attendance-record/subject-percentage`, {
            params: { courseId, semester },
          }),
        ]);
        setPercentage(percRes.data || []);
        const recRes = await axios.get(`${API}/attendance-record/teacher`, {
          params: { courseId, semester, allDates: true },
        });
        setAllRecords(recRes.data?.data || []);
      } catch (err) {
        console.log("Analytics fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId, semester]);

  const lowAttendance = percentage.filter((s) => s.percentage < 75);

  // Normalize date — handles "YYYY-MM-DD", ISO timestamps, createdAt fallback
  const getDateStr = (r) => (r.date || r.createdAt || "").slice(0, 10);

  const monthlyMap = {};
  allRecords.forEach((r) => {
    const month = getDateStr(r).slice(0, 7);
    if (!month) return;
    if (!monthlyMap[month]) monthlyMap[month] = { present: 0, absent: 0 };
    if (r.status === "Present") monthlyMap[month].present++;
    else monthlyMap[month].absent++;
  });
  const monthlyData = Object.keys(monthlyMap)
    .sort()
    .map((m) => ({ month: m, ...monthlyMap[m] }));

  const calendarRecords = allRecords.filter((r) =>
    getDateStr(r).startsWith(calendarMonth),
  );
  const calendarDayMap = {};
  calendarRecords.forEach((r) => {
    const day = parseInt(getDateStr(r).slice(8, 10));
    if (!day) return;
    if (!calendarDayMap[day]) calendarDayMap[day] = { present: 0, absent: 0 };
    if (r.status === "Present") calendarDayMap[day].present++;
    else calendarDayMap[day].absent++;
  });

  const [calYear, calMonthNum] = calendarMonth.split("-").map(Number);
  const daysInMonth = new Date(calYear, calMonthNum, 0).getDate();
  const firstDay = new Date(calYear, calMonthNum - 1, 1).getDay();

  const today = new Date().toISOString().slice(0, 10);
  const todayPresent = allRecords.filter(
    (r) => getDateStr(r) === today && r.status === "Present",
  ).length;
  const overallPct = percentage.length
    ? Math.round(
        percentage.reduce((s, x) => s + x.percentage, 0) / percentage.length,
      )
    : 0;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "monthly", label: "Monthly" },
    { id: "alerts", label: "Alerts" },
    { id: "calendar", label: "Calendar" },
  ];

  const stats = [
    {
      label: "Overall Attendance",
      value: `${overallPct}%`,
      color: overallPct >= 75 ? "var(--green)" : "var(--red)",
    },
    {
      label: "Subjects Tracked",
      value: percentage.length,
      color: "var(--blue)",
    },
    { label: "Today Present", value: todayPresent, color: "var(--accent2)" },
    {
      label: "Low Attendance",
      value: lowAttendance.length,
      color: "var(--amber)",
    },
  ];

  return (
    <div
      className="att-root page-enter"
      style={{ padding: "32px 40px", minHeight: "100vh" }}
    >
      <div style={{ marginBottom: 32 }}>
        <button
          className="back-btn"
          onClick={onBack}
          style={{ marginBottom: 20 }}
        >
          ← back
        </button>
        <p
          style={{
            fontFamily: MONO_FONT,
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Semester {semester} · {courseName}
        </p>
        <h1
          className="font-display"
          style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          Analytics Dashboard
        </h1>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab-pill ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="card">
          <div className="empty-state">Loading data…</div>
        </div>
      ) : (
        <>
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="card page-enter">
              <div className="card-inner">
                <p className="section-title">Subject Attendance</p>
                <p className="section-sub">
                  Breakdown by subject this semester
                </p>
                {percentage.length === 0 ? (
                  <div className="empty-state">No data yet</div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={percentage}
                        margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4ec" />
                        <XAxis
                          dataKey="subject"
                          angle={-25}
                          textAnchor="end"
                          interval={0}
                          tick={{
                            fill: "#8888a0",
                            fontSize: 11,
                            fontFamily: MONO_FONT,
                          }}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fill: "#8888a0", fontSize: 11 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="percentage"
                          name="Attendance %"
                          radius={[6, 6, 0, 0]}
                          fill="var(--accent)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <table style={{ marginTop: 32 }}>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Attendance %</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {percentage.map((sub, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 500 }}>{sub.subject}</td>
                            <td>
                              <span
                                className="font-mono"
                                style={{
                                  fontWeight: 700,
                                  color:
                                    sub.percentage >= 75
                                      ? "var(--green)"
                                      : "var(--red)",
                                }}
                              >
                                {sub.percentage}%
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${sub.percentage >= 75 ? "badge-green" : "badge-red"}`}
                              >
                                {sub.percentage >= 75 ? "Good" : "Low"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}

          {/* MONTHLY */}
          {activeTab === "monthly" && (
            <div className="card page-enter">
              <div className="card-inner">
                <p className="section-title">Monthly Trend</p>
                <p className="section-sub">Present vs absent across months</p>
                {monthlyData.length === 0 ? (
                  <div className="empty-state">No monthly data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4ec" />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fill: "#8888a0",
                          fontSize: 11,
                          fontFamily: MONO_FONT,
                        }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#8888a0", fontSize: 11 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{
                          fontFamily: MONO_FONT,
                          fontSize: 11,
                          color: "#8888a0",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="present"
                        stroke="var(--green)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "var(--green)" }}
                        name="Present"
                      />
                      <Line
                        type="monotone"
                        dataKey="absent"
                        stroke="var(--red)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "var(--red)" }}
                        name="Absent"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {/* ALERTS */}
          {activeTab === "alerts" && (
            <div className="card page-enter">
              <div className="card-inner">
                <p className="section-title">Attendance Alerts</p>
                <p className="section-sub">Subjects & students below 75%</p>
                {lowAttendance.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <p style={{ fontSize: 40, marginBottom: 12 }}>🎉</p>
                    <p
                      style={{
                        color: "var(--green)",
                        fontFamily: SYSTEM_FONT,
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      All subjects above 75%
                    </p>
                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: 13,
                        marginTop: 6,
                      }}
                    >
                      Great attendance this semester
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {lowAttendance.map((sub, i) => (
                      <div className="alert-card" key={i}>
                        <div>
                          <p style={{ fontWeight: 600, marginBottom: 4 }}>
                            {sub.subject}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--red)",
                              fontFamily: MONO_FONT,
                            }}
                          >
                            {75 - sub.percentage}% below required
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p
                            className="font-display"
                            style={{
                              fontSize: 32,
                              fontWeight: 800,
                              color: "var(--red)",
                              lineHeight: 1,
                            }}
                          >
                            {sub.percentage}%
                          </p>
                          <span
                            className="badge badge-red"
                            style={{ marginTop: 6 }}
                          >
                            Critical
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CALENDAR */}
          {activeTab === "calendar" && (
            <div className="card page-enter">
              <div className="card-inner">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <p className="section-title" style={{ marginBottom: 4 }}>
                      Attendance Calendar
                    </p>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>
                      Daily overview
                    </p>
                  </div>
                  <input
                    type="month"
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                  {[
                    ["var(--green)", "High Attendance"],
                    ["var(--red)", "Low Attendance"],
                    ["#f0f0f5", "No Class"],
                  ].map(([c, l]) => (
                    <span
                      key={l}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontFamily: MONO_FONT,
                        color: "var(--muted)",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c,
                          display: "inline-block",
                        }}
                      />
                      {l}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    marginBottom: 8,
                  }}
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        style={{
                          textAlign: "center",
                          fontFamily: MONO_FONT,
                          fontSize: 10,
                          color: "var(--muted)",
                          padding: "8px 0",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {d}
                      </div>
                    ),
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 6,
                  }}
                >
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const data = calendarDayMap[day];
                    const isToday =
                      today ===
                      `${calendarMonth}-${String(day).padStart(2, "0")}`;
                    const pct = data
                      ? Math.round(
                          (data.present / (data.present + data.absent)) * 100,
                        )
                      : null;
                    return (
                      <div
                        key={day}
                        className="calendar-day"
                        title={
                          data
                            ? `Present: ${data.present}, Absent: ${data.absent}`
                            : "No class"
                        }
                        style={{
                          background:
                            pct === null
                              ? "#f0f0f5"
                              : pct >= 75
                                ? "rgba(14,168,122,0.1)"
                                : "rgba(229,52,46,0.09)",
                          color:
                            pct === null
                              ? "var(--muted)"
                              : pct >= 75
                                ? "var(--green)"
                                : "var(--red)",
                          outline: isToday ? "2px solid var(--accent)" : "none",
                          outlineOffset: 2,
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 700 }}>
                          {day}
                        </span>
                        {pct !== null && (
                          <span style={{ fontSize: 10 }}>{pct}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ================================================================
   SUBJECT PAGE
================================================================ */
function TeacherSubjectPage({
  subject,
  courseId,
  courseName,
  semester,
  onBack,
}) {
  const subjectId = subject.name;
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [weekly, setWeekly] = useState({});
  const [percentage, setPercentage] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [codeData, setCodeData] = useState(null);
  const { display } = useCountdown(codeData?.expiresAt);
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  const fetchStudents = useCallback(async () => {
    try {
      setStudents(await fetchFilteredStudents(courseName, semester));
    } catch {
      setStudents([]);
    }
  }, [courseName, semester]);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/attendance-record/teacher`, {
        params: { subjectId, date: selectedDate },
      });
      setAttendance(res.data?.data || []);
    } catch {
      setAttendance([]);
    }
  }, [subjectId, selectedDate]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [weeklyRes, pctRes] = await Promise.all([
        axios.get(`${API}/attendance-record/weekly`, {
          params: { courseId, semester, subjectId },
        }),
        axios.get(`${API}/attendance-record/subject-percentage`, {
          params: { courseId, semester },
        }),
      ]);
      setWeekly(weeklyRes.data || {});
      setPercentage(pctRes.data || []);
    } catch (err) {
      console.log("Analytics error:", err.message);
      setWeekly({});
      setPercentage([]);
    }
  }, [courseId, semester, subjectId]);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
    fetchAnalytics();
  }, [fetchStudents, fetchAttendance, fetchAnalytics]);
  useEffect(() => {
    const id = setInterval(fetchAttendance, 5000);
    return () => clearInterval(id);
  }, [fetchAttendance]);

  const handleGenerateCode = async () => {
    try {
      const res = await axios.post(`${API}/attendance-code/generate`, {
        subjectId,
        subjectName: subject.name,
        courseId,
        semester,
      });
      setCodeData(res.data.data);
    } catch {
      console.log("Generate code API missing");
    }
  };

  const mergedList = students.map((stu) => {
    const record = attendance.find((a) => a.userId === stu._id);
    return {
      ...stu,
      status: record ? record.status : "Absent",
      codeUsed: record?.codeUsed,
      markedAt: record?.markedAt,
    };
  });

  const presentCount = mergedList.filter((r) => r.status === "Present").length;
  const absentCount = mergedList.filter((r) => r.status === "Absent").length;

  const graphData = Object.keys(weekly)
    .sort()
    .map((date) => ({
      date: date.slice(5),
      fullDate: date,
      present: weekly[date].present,
      absent: weekly[date].absent,
    }));

  return (
    <div
      className="att-root page-enter"
      style={{ padding: "32px 40px", minHeight: "100vh" }}
    >
      <button
        className="back-btn"
        onClick={onBack}
        style={{ marginBottom: 20 }}
      >
        ← back
      </button>

      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontFamily: MONO_FONT,
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Subject · {courseName} · Semester {semester}
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          {subject.name}
        </h1>
        <p
          style={{
            fontFamily: MONO_FONT,
            fontSize: 11,
            color: "var(--accent2)",
          }}
        >
          {students.length} enrolled students
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={handleGenerateCode}
          disabled={!isToday}
          style={{ padding: "9px 20px" }}
        >
          Generate Code
        </button>
      </div>

      {codeData && (
        <div className="code-box" style={{ marginBottom: 32 }}>
          <p
            style={{
              fontFamily: MONO_FONT,
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--muted)",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            Attendance Code
          </p>
          <p
            className="font-mono"
            style={{
              fontSize: 64,
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "var(--accent2)",
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            {codeData.code}
          </p>
          <p
            style={{
              fontFamily: MONO_FONT,
              fontSize: 14,
              color: "var(--muted)",
            }}
          >
            Expires in{" "}
            <span style={{ color: "var(--text)", fontWeight: 600 }}>
              {display}
            </span>
          </p>
        </div>
      )}

      {/* Attendance Table */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontFamily: SYSTEM_FONT, fontWeight: 700, fontSize: 15 }}>
            Attendance
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <span className="badge badge-green">{presentCount} Present</span>
            <span className="badge badge-red">{absentCount} Absent</span>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Status</th>
              <th>Code Used</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {mergedList.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No students found</div>
                </td>
              </tr>
            ) : (
              mergedList.map((row, i) => (
                <tr key={row._id}>
                  <td>
                    <span
                      className="font-mono"
                      style={{ color: "var(--muted)", fontSize: 12 }}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{row.name}</td>
                  <td>
                    <span
                      className={`badge ${row.status === "Present" ? "badge-green" : "badge-red"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className="font-mono"
                      style={{ color: "var(--muted)", fontSize: 12 }}
                    >
                      {row.codeUsed || "—"}
                    </span>
                  </td>
                  <td>
                    <span
                      className="font-mono"
                      style={{ color: "var(--muted)", fontSize: 12 }}
                    >
                      {row.markedAt
                        ? new Date(row.markedAt).toLocaleTimeString()
                        : "—"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Weekly Graph */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-inner">
          <p className="section-title">Weekly Attendance</p>
          <p className="section-sub">Last 7 days overview</p>
          {graphData.length === 0 ? (
            <div className="empty-state">No weekly data</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={graphData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4ec" />
                <XAxis
                  dataKey="date"
                  tick={{
                    fill: "#8888a0",
                    fontSize: 11,
                    fontFamily: MONO_FONT,
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#8888a0", fontSize: 11 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.fullDate || label
                  }
                />
                <Bar
                  dataKey="present"
                  fill="var(--green)"
                  name="Present"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  fill="var(--red)"
                  name="Absent"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Weekly Table */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-inner">
          <p className="section-title">Weekly Report</p>
          <p className="section-sub">Day-wise breakdown</p>
        </div>
        {Object.keys(weekly).length === 0 ? (
          <div className="empty-state">No records</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(weekly)
                .sort()
                .map((date) => (
                  <tr key={date}>
                    <td className="font-mono" style={{ fontSize: 13 }}>
                      {date}
                    </td>
                    <td>
                      <span
                        className="font-mono"
                        style={{ color: "var(--green)", fontWeight: 600 }}
                      >
                        {weekly[date].present}
                      </span>
                    </td>
                    <td>
                      <span
                        className="font-mono"
                        style={{ color: "var(--red)", fontWeight: 600 }}
                      >
                        {weekly[date].absent}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Subject % */}
      <div className="card">
        <div className="card-inner">
          <p className="section-title">Subject Attendance %</p>
          <p className="section-sub">All subjects this semester</p>
        </div>
        {percentage.length === 0 ? (
          <div className="empty-state">No data</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {percentage.map((sub, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{sub.subject}</td>
                  <td>
                    <span
                      className="font-mono"
                      style={{
                        fontWeight: 700,
                        color:
                          sub.percentage >= 75 ? "var(--green)" : "var(--red)",
                      }}
                    >
                      {sub.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN PAGE
================================================================ */
export default function CodeBasedAttendence() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/course`)
      .then((res) => setCourses(res.data || []))
      .catch(() => setCourses([]));
  }, []);

  if (showAnalytics && selectedSemester) {
    return (
      <>
        <StyleInjector />
        <SemesterAnalyticsPage
          courseId={selectedCourse._id}
          courseName={selectedCourse.name}
          semester={selectedSemester.semester}
          onBack={() => setShowAnalytics(false)}
        />
      </>
    );
  }

  if (selectedSubject) {
    return (
      <>
        <StyleInjector />
        <TeacherSubjectPage
          subject={selectedSubject}
          courseId={selectedCourse._id}
          courseName={selectedCourse.name}
          semester={selectedSemester.semester}
          onBack={() => setSelectedSubject(null)}
        />
      </>
    );
  }

  const ListPage = ({ title, subtitle, items, onBack, renderItem }) => (
    <>
      <StyleInjector />
      <div
        className="att-root page-enter"
        style={{ padding: "32px 40px", minHeight: "100vh" }}
      >
        {onBack && (
          <button
            className="back-btn"
            onClick={onBack}
            style={{ marginBottom: 20 }}
          >
            ← back
          </button>
        )}
        <div style={{ marginBottom: 36 }}>
          {subtitle && (
            <p
              style={{
                fontFamily: MONO_FONT,
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {subtitle}
            </p>
          )}
          <h1
            className="font-display"
            style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.025em" }}
          >
            {title}
          </h1>
        </div>
        {items.length === 0 ? (
          <p
            style={{
              color: "var(--muted)",
              fontFamily: MONO_FONT,
              fontSize: 13,
            }}
          >
            Nothing here yet
          </p>
        ) : (
          <div className="card">
            {items.map((item, i) => renderItem(item, i))}
          </div>
        )}
      </div>
    </>
  );

  if (selectedSemester) {
    return (
      <ListPage
        title={`Semester ${selectedSemester.semester}`}
        subtitle={selectedCourse.name}
        onBack={() => setSelectedSemester(null)}
        items={["dashboard", ...selectedSemester.subjects]}
        renderItem={(item, i) => {
          const isDash = item === "dashboard";
          return (
            <div
              key={i}
              className="row-item"
              onClick={() =>
                isDash ? setShowAnalytics(true) : setSelectedSubject(item)
              }
            >
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: isDash ? 2 : 0,
                  }}
                >
                  {isDash ? "Semester Dashboard" : item.name}
                </p>
                {isDash && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      fontFamily: MONO_FONT,
                    }}
                  >
                    Analytics, rankings, calendar & live view
                  </p>
                )}
              </div>
              <span style={{ color: "var(--muted)", fontSize: 18 }}>→</span>
            </div>
          );
        }}
      />
    );
  }

  if (selectedCourse) {
    return (
      <ListPage
        title={selectedCourse.name}
        subtitle="Select Semester"
        onBack={() => setSelectedCourse(null)}
        items={selectedCourse.semesters}
        renderItem={(sem, i) => (
          <div
            key={i}
            className="row-item"
            onClick={() => setSelectedSemester(sem)}
          >
            <p style={{ fontWeight: 600, fontSize: 15 }}>
              Semester {sem.semester}
            </p>
            <span style={{ color: "var(--muted)", fontSize: 18 }}>→</span>
          </div>
        )}
      />
    );
  }

  return (
    <ListPage
      title="Courses"
      items={courses}
      renderItem={(course, i) => (
        <div
          key={course._id}
          className="row-item"
          onClick={() => setSelectedCourse(course)}
        >
          <div>
            <p style={{ fontWeight: 600, fontSize: 15 }}>{course.name}</p>
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontFamily: MONO_FONT,
                marginTop: 2,
              }}
            >
              {course.semesters?.length || 0} semesters
            </p>
          </div>
          <span style={{ color: "var(--muted)", fontSize: 18 }}>→</span>
        </div>
      )}
    />
  );
}
