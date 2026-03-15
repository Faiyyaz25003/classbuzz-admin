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

/* ---------------- Countdown Hook ---------------- */
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

/* ================================================================
   UTILITY — Fetch students by department (courseName) + semester
   ================================================================
   User Model fields:
     departments: [String]   e.g. ["BCA", "MCA"]
     semester:    String     e.g. "3"
     positions:   [String]   e.g. ["Student", "Teacher"]

   courseId here is actually the course NAME (e.g. "BCA") because
   the Course model stores name, and students store it in departments[].
   We only show users who have "Student" in positions[].
   ================================================================ */
async function fetchFilteredStudents(courseName, semester) {
  const res = await axios.get(`${API}/users`);
  const allUsers = res.data || [];

  return allUsers.filter((user) => {
    // Must be a Student
    const isStudent = Array.isArray(user.positions)
      ? user.positions.some((p) => p.toLowerCase() === "student")
      : false;

    // Must belong to this department/course
    const inDepartment = Array.isArray(user.departments)
      ? user.departments.some(
          (d) => d.toLowerCase() === String(courseName).toLowerCase(),
        )
      : false;

    // Must be in this semester
    const inSemester = String(user.semester).trim() === String(semester).trim();

    return isStudent && inDepartment && inSemester;
  });
}

/* ================================================================
   SEMESTER ANALYTICS PAGE
   ================================================================ */
function SemesterAnalyticsPage({ courseId, courseName, semester, onBack }) {
  const [percentage, setPercentage] = useState([]);
  const [students, setStudents] = useState([]);
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
        const [percRes, filteredStudents] = await Promise.all([
          axios.get(`${API}/attendance-record/subject-percentage`, {
            params: { courseId, semester },
          }),
          // ✅ Filter by departments[] containing courseName + semester match
          fetchFilteredStudents(courseName, semester),
        ]);
        setPercentage(percRes.data || []);
        setStudents(filteredStudents);

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

  /* ---------- Derived Data ---------- */
  const studentRanking = students
    .map((stu) => {
      const records = allRecords.filter((r) => r.userId === stu._id);
      const present = records.filter((r) => r.status === "Present").length;
      const total = records.length;
      const pct = total ? Math.round((present / total) * 100) : 0;
      return { name: stu.name, present, total, pct };
    })
    .sort((a, b) => b.pct - a.pct);

  const lowAttendance = percentage.filter((s) => s.percentage < 75);

  const monthlyMap = {};
  allRecords.forEach((r) => {
    const month = (r.date || "").slice(0, 7);
    if (!month) return;
    if (!monthlyMap[month]) monthlyMap[month] = { present: 0, absent: 0 };
    if (r.status === "Present") monthlyMap[month].present++;
    else monthlyMap[month].absent++;
  });
  const monthlyData = Object.keys(monthlyMap)
    .sort()
    .map((m) => ({ month: m, ...monthlyMap[m] }));

  const calendarRecords = allRecords.filter((r) =>
    (r.date || "").startsWith(calendarMonth),
  );
  const calendarDayMap = {};
  calendarRecords.forEach((r) => {
    const day = parseInt((r.date || "").slice(8, 10));
    if (!calendarDayMap[day]) calendarDayMap[day] = { present: 0, absent: 0 };
    if (r.status === "Present") calendarDayMap[day].present++;
    else calendarDayMap[day].absent++;
  });

  const [calYear, calMonthNum] = calendarMonth.split("-").map(Number);
  const daysInMonth = new Date(calYear, calMonthNum, 0).getDate();
  const firstDay = new Date(calYear, calMonthNum - 1, 1).getDay();

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = allRecords.filter((r) => r.date === today);
  const todayPresent = todayRecords.filter(
    (r) => r.status === "Present",
  ).length;
  const overallPct = percentage.length
    ? Math.round(
        percentage.reduce((s, x) => s + x.percentage, 0) / percentage.length,
      )
    : 0;

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "monthly", label: "📅 Monthly Graph" },
    { id: "ranking", label: "🏆 Student Ranking" },
    { id: "alerts", label: "⚠️ Alerts" },
    { id: "calendar", label: "🗓 Calendar" },
    { id: "live", label: "🔴 Live" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b px-10 py-5 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 text-sm"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Semester {semester} — Analytics
          </h1>
          <p className="text-sm text-gray-400">Advanced Attendance Dashboard</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="px-10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Overall Attendance",
            value: `${overallPct}%`,
            color: overallPct >= 75 ? "text-green-600" : "text-red-500",
            bg: "bg-green-50",
          },
          {
            label: "Subjects Tracked",
            value: percentage.length,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Today Present",
            value: todayPresent,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Low Attendance",
            value: lowAttendance.length,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl p-5 border`}>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="px-10 mb-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === t.id
                  ? "bg-gray-900 text-white"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="px-10 pb-16">
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-1">
                  Subject Wise Attendance %
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  All subjects this semester
                </p>
                {percentage.length === 0 ? (
                  <p className="text-gray-400">No data yet</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={percentage}
                        margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="subject"
                          angle={-25}
                          textAnchor="end"
                          interval={0}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                          allowDecimals={false}
                        />
                        <Tooltip formatter={(v) => `${v}%`} />
                        <Bar
                          dataKey="percentage"
                          name="Attendance %"
                          radius={[4, 4, 0, 0]}
                          fill="#6366f1"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <table className="w-full mt-8">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left text-sm text-gray-600">
                            Subject
                          </th>
                          <th className="p-3 text-left text-sm text-gray-600">
                            Attendance %
                          </th>
                          <th className="p-3 text-left text-sm text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {percentage.map((sub, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-3 font-medium">{sub.subject}</td>
                            <td className="p-3 font-bold">
                              <span
                                className={
                                  sub.percentage >= 75
                                    ? "text-green-600"
                                    : "text-red-500"
                                }
                              >
                                {sub.percentage}%
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.percentage >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                              >
                                {sub.percentage >= 75 ? "✓ Good" : "⚠ Low"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}

            {/* ── MONTHLY GRAPH ── */}
            {activeTab === "monthly" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-1">
                  Monthly Attendance Graph
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Month-wise present vs absent trend
                </p>
                {monthlyData.length === 0 ? (
                  <p className="text-gray-400">No monthly data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="present"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Present"
                      />
                      <Line
                        type="monotone"
                        dataKey="absent"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Absent"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}

            {/* ── STUDENT RANKING ── */}
            {activeTab === "ranking" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-1">Student Ranking</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Ranked by overall attendance %
                </p>
                {/* ✅ Shows how many students are loaded for this course+semester */}
                <p className="text-xs text-indigo-500 mb-6 font-semibold">
                  {students.length} student(s) enrolled in Semester {semester}
                </p>
                {studentRanking.length === 0 ? (
                  <p className="text-gray-400">No student data available</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left text-sm text-gray-600">
                          Rank
                        </th>
                        <th className="p-3 text-left text-sm text-gray-600">
                          Student
                        </th>
                        <th className="p-3 text-left text-sm text-gray-600">
                          Present
                        </th>
                        <th className="p-3 text-left text-sm text-gray-600">
                          Total
                        </th>
                        <th className="p-3 text-left text-sm text-gray-600">
                          Attendance %
                        </th>
                        <th className="p-3 text-left text-sm text-gray-600">
                          Badge
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentRanking.map((stu, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-3 font-bold text-gray-500">
                            {i === 0
                              ? "🥇"
                              : i === 1
                                ? "🥈"
                                : i === 2
                                  ? "🥉"
                                  : `#${i + 1}`}
                          </td>
                          <td className="p-3 font-semibold">{stu.name}</td>
                          <td className="p-3 text-green-600 font-semibold">
                            {stu.present}
                          </td>
                          <td className="p-3 text-gray-500">{stu.total}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${stu.pct >= 75 ? "bg-green-500" : "bg-red-400"}`}
                                  style={{ width: `${stu.pct}%` }}
                                />
                              </div>
                              <span
                                className={`font-bold text-sm ${stu.pct >= 75 ? "text-green-600" : "text-red-500"}`}
                              >
                                {stu.pct}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                stu.pct >= 90
                                  ? "bg-green-100 text-green-700"
                                  : stu.pct >= 75
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-600"
                              }`}
                            >
                              {stu.pct >= 90
                                ? "⭐ Excellent"
                                : stu.pct >= 75
                                  ? "✓ Good"
                                  : "⚠ At Risk"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── LOW ATTENDANCE ALERTS ── */}
            {activeTab === "alerts" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-1">
                  Low Attendance Alerts
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Subjects with attendance below 75%
                </p>
                {lowAttendance.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🎉</p>
                    <p className="text-green-600 font-semibold text-lg">
                      All subjects above 75%!
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Great attendance this semester
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lowAttendance.map((sub, i) => (
                      <div
                        key={i}
                        className="border border-red-200 bg-red-50 rounded-xl p-5 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-gray-800">
                            {sub.subject}
                          </p>
                          <p className="text-sm text-red-500 mt-1">
                            {75 - sub.percentage}% below required attendance
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-red-500">
                            {sub.percentage}%
                          </p>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                            ⚠ Critical
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {studentRanking.filter((s) => s.pct < 75).length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-700 mb-4">
                      Students At Risk
                    </h4>
                    <div className="space-y-3">
                      {studentRanking
                        .filter((s) => s.pct < 75)
                        .map((stu, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between border border-orange-200 bg-orange-50 rounded-lg p-4"
                          >
                            <p className="font-semibold text-gray-800">
                              {stu.name}
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="w-20 bg-orange-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-orange-500"
                                  style={{ width: `${stu.pct}%` }}
                                />
                              </div>
                              <span className="font-bold text-orange-600 text-sm">
                                {stu.pct}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CALENDAR ── */}
            {activeTab === "calendar" && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Attendance Calendar
                    </h3>
                    <p className="text-sm text-gray-400">
                      Daily attendance overview
                    </p>
                  </div>
                  <input
                    type="month"
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(e.target.value)}
                    className="border rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="flex gap-4 mb-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />{" "}
                    High Attendance
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />{" "}
                    Low Attendance
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />{" "}
                    No Class
                  </span>
                </div>
                <div className="grid grid-cols-7 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-semibold text-gray-500 py-2"
                      >
                        {d}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const data = calendarDayMap[day];
                    const isToday =
                      new Date().toISOString().slice(0, 10) ===
                      `${calendarMonth}-${String(day).padStart(2, "0")}`;
                    const pct = data
                      ? Math.round(
                          (data.present / (data.present + data.absent)) * 100,
                        )
                      : null;
                    return (
                      <div
                        key={day}
                        title={
                          data
                            ? `Present: ${data.present}, Absent: ${data.absent}`
                            : "No class"
                        }
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold cursor-default transition
                          ${isToday ? "ring-2 ring-gray-900" : ""}
                          ${pct === null ? "bg-gray-50 text-gray-400" : pct >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
                        `}
                      >
                        <span className="text-sm font-bold">{day}</span>
                        {pct !== null && (
                          <span className="text-xs">{pct}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── LIVE ── */}
            {activeTab === "live" && (
              <LiveDashboard
                courseId={courseId}
                semester={semester}
                students={students}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   LIVE ATTENDANCE DASHBOARD
   ================================================================ */
function LiveDashboard({ courseId, semester, students }) {
  const [liveRecords, setLiveRecords] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  const fetchLive = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/attendance-record/teacher`, {
        params: { courseId, semester, date: today },
      });
      setLiveRecords(res.data?.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.log("Live fetch error:", err.message);
    }
  }, [courseId, semester, today]);

  useEffect(() => {
    fetchLive();
    const id = setInterval(fetchLive, 5000);
    return () => clearInterval(id);
  }, [fetchLive]);

  // ✅ students prop already filtered — no extra filter needed here
  const mergedLive = students.map((stu) => {
    const record = liveRecords.find((r) => r.userId === stu._id);
    return {
      ...stu,
      status: record ? record.status : "Absent",
      markedAt: record?.markedAt,
      subjectName: record?.subjectName,
    };
  });

  const presentCount = mergedLive.filter((r) => r.status === "Present").length;
  const absentCount = mergedLive.filter((r) => r.status === "Absent").length;
  const total = mergedLive.length;
  const livePct = total ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Present Today</p>
          <p className="text-4xl font-black text-green-600">{presentCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Absent Today</p>
          <p className="text-4xl font-black text-red-500">{absentCount}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Live %</p>
          <p
            className={`text-4xl font-black ${livePct >= 75 ? "text-indigo-600" : "text-red-500"}`}
          >
            {livePct}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Today's Attendance Progress
          </span>
          <span className="text-sm text-gray-400">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${livePct >= 75 ? "bg-green-500" : "bg-red-400"}`}
            style={{ width: `${livePct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>0%</span>
          <span className="text-orange-500 font-semibold">75% Required</span>
          <span>100%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-bold">Live Student Status</h3>
          <span className="flex items-center gap-2 text-xs text-red-500 font-semibold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            LIVE — Auto-refreshing every 5s
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-sm">#</th>
              <th className="p-3 text-left text-sm">Student</th>
              <th className="p-3 text-left text-sm">Status</th>
              <th className="p-3 text-left text-sm">Subject</th>
              <th className="p-3 text-left text-sm">Marked At</th>
            </tr>
          </thead>
          <tbody>
            {mergedLive.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No students found
                </td>
              </tr>
            ) : (
              mergedLive.map((row, i) => (
                <tr key={row._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{i + 1}</td>
                  <td className="p-3 font-semibold">{row.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {row.status === "Present" ? "✓ Present" : "✗ Absent"}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {row.subjectName || "—"}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {row.markedAt
                      ? new Date(row.markedAt).toLocaleTimeString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
      // ✅ Filter by departments[] containing courseName + semester
      const filtered = await fetchFilteredStudents(courseName, semester);
      setStudents(filtered);
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
      const [weeklyRes, percentageRes] = await Promise.all([
        axios.get(`${API}/attendance-record/weekly`, {
          params: { courseId, semester, subjectId },
        }),
        axios.get(`${API}/attendance-record/subject-percentage`, {
          params: { courseId, semester },
        }),
      ]);
      setWeekly(weeklyRes.data || {});
      setPercentage(percentageRes.data || []);
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
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval);
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
    <div className="p-10 bg-gray-50 min-h-screen">
      <button onClick={onBack} className="mb-6 text-gray-500">
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
      {/* ✅ Student count badge */}
      <p className="text-xs text-indigo-500 font-semibold mb-6">
        {students.length} student(s) enrolled in Semester {semester}
      </p>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <button
          onClick={handleGenerateCode}
          disabled={!isToday}
          className="border px-6 py-2 font-semibold rounded-lg disabled:opacity-40"
        >
          Generate Code
        </button>
      </div>

      {codeData && (
        <div className="border-4 border-black p-8 text-center mb-8 bg-white rounded-xl">
          <p className="text-xs uppercase text-gray-400">Attendance Code</p>
          <div className="text-6xl font-black tracking-[10px] font-mono">
            {codeData.code}
          </div>
          <p>Expires in {display}</p>
        </div>
      )}

      {/* STUDENT LIST */}
      <div className="bg-white border rounded-xl overflow-hidden mb-10">
        <div className="flex justify-between p-6 border-b">
          <h2 className="font-bold">
            Attendance
            <span className="ml-4 text-green-600">{presentCount} Present</span>
            <span className="ml-4 text-red-500">{absentCount} Absent</span>
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4">#</th>
              <th className="p-4">Student</th>
              <th className="p-4">Status</th>
              <th className="p-4">Code</th>
              <th className="p-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {mergedList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No students found
                </td>
              </tr>
            ) : (
              mergedList.map((row, i) => (
                <tr key={row._id} className="border-t">
                  <td className="p-4">{i + 1}</td>
                  <td className="p-4 font-semibold">{row.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded text-xs ${row.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{row.codeUsed || "—"}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {row.markedAt
                      ? new Date(row.markedAt).toLocaleTimeString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* WEEKLY GRAPH */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-bold mb-2">Weekly Attendance Graph</h2>
        <p className="text-sm text-gray-400 mb-6">Last 7 days</p>
        {graphData.length === 0 ? (
          <p className="text-gray-400">No weekly data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.fullDate || label
                }
              />
              <Bar dataKey="present" fill="#22c55e" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* WEEKLY TABLE */}
      <div className="bg-white rounded shadow p-6 mb-10">
        <h2 className="text-xl font-bold mb-2">Weekly Attendance Report</h2>
        <p className="text-sm text-gray-400 mb-6">Last 7 days</p>
        {Object.keys(weekly).length === 0 ? (
          <p className="text-gray-400">No records</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Present</th>
                <th className="p-3 text-left">Absent</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(weekly)
                .sort()
                .map((date) => (
                  <tr key={date} className="border-t">
                    <td className="p-3">{date}</td>
                    <td className="p-3 text-green-600 font-semibold">
                      {weekly[date].present}
                    </td>
                    <td className="p-3 text-red-600 font-semibold">
                      {weekly[date].absent}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SUBJECT PERCENTAGE */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-6">Subject Wise Attendance %</h2>
        {percentage.length === 0 ? (
          <p className="text-gray-400">No data</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {percentage.map((sub, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{sub.subject}</td>
                  <td className="p-3 font-bold">
                    <span
                      className={
                        sub.percentage >= 75 ? "text-green-600" : "text-red-500"
                      }
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
      <SemesterAnalyticsPage
        courseId={selectedCourse._id} // for attendance API calls
        courseName={selectedCourse.name} // for student filtering
        semester={selectedSemester.semester}
        onBack={() => setShowAnalytics(false)}
      />
    );
  }

  if (selectedSubject) {
    return (
      <TeacherSubjectPage
        subject={selectedSubject}
        courseId={selectedCourse._id} // for attendance API calls
        courseName={selectedCourse.name} // for student filtering
        semester={selectedSemester.semester}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  if (selectedSemester) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => setSelectedSemester(null)}
          className="mb-6 text-gray-500 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-6">
          Semester {selectedSemester.semester}
        </h1>
        <div
          onClick={() => setShowAnalytics(true)}
          className="p-5 border-2 border-gray-800 rounded-xl mb-6 cursor-pointer hover:bg-gray-900 hover:text-white transition bg-white group"
        >
          <span className="font-bold text-base underline group-hover:text-white">
            Semester dashboard
          </span>
        </div>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Subjects</h2>
        {selectedSemester.subjects.map((sub, i) => (
          <div
            key={i}
            onClick={() => setSelectedSubject(sub)}
            className="p-5 border rounded-xl mb-4 cursor-pointer hover:shadow transition bg-white"
          >
            <span className="font-semibold text-gray-800">{sub.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => setSelectedCourse(null)}
          className="mb-6 text-gray-500 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-6">{selectedCourse.name}</h1>
        {selectedCourse.semesters.map((sem, i) => (
          <div
            key={i}
            onClick={() => setSelectedSemester(sem)}
            className="p-5 border rounded-xl mb-4 cursor-pointer hover:shadow transition bg-white"
          >
            <span className="font-semibold text-gray-800">
              Semester {sem.semester}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-400">No courses found</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            onClick={() => setSelectedCourse(course)}
            className="p-6 border rounded-xl mb-4 cursor-pointer hover:shadow transition bg-white"
          >
            <span className="font-semibold text-gray-800">{course.name}</span>
          </div>
        ))
      )}
    </div>
  );
}
