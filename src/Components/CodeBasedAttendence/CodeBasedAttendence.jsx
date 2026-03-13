"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const CODE_VALIDITY_SECONDS = 5 * 60;

// ─────────────────────────────────────────────────────────────────────────────
// Countdown Timer Hook
// ─────────────────────────────────────────────────────────────────────────────
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
  return { secondsLeft, display: `${minutes}:${seconds}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// TeacherSubjectPage — Code generate + today's attendance sheet
// ─────────────────────────────────────────────────────────────────────────────
function TeacherSubjectPage({ subject, courseId, semester, onBack }) {
  const [codeData, setCodeData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const { secondsLeft, display: timerDisplay } = useCountdown(
    codeData?.expiresAt,
  );
  const isExpired = codeData && secondsLeft === 0;

  // ✅ FIX: subjectId = subject.name (consistent with how records are stored)
  const subjectId = subject.name;

  // ── Today's attendance sheet ─────────────────────────────────────────────────
  const fetchAttendance = useCallback(async () => {
    setLoadingAtt(true);
    setFetchError(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await axios.get(`${API}/attendance-record/teacher`, {
        params: { subjectId, date: today },
      });
      setAttendance(res.data?.data || []);
    } catch (err) {
      // ✅ FIX: 404 = koi record nahi, error nahi
      if (err.response?.status === 404) {
        setAttendance([]);
      } else {
        console.error("Teacher fetchAttendance:", err.message);
        setFetchError("Attendance records load nahi ho sake.");
      }
    } finally {
      setLoadingAtt(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ── Auto refresh when code is active ────────────────────────────────────────
  // ✅ FIX: Jab code active ho toh har 15 seconds mein attendance refresh karo
  useEffect(() => {
    if (!codeData || isExpired) return;
    const id = setInterval(fetchAttendance, 15000);
    return () => clearInterval(id);
  }, [codeData, isExpired, fetchAttendance]);

  // ── Generate code ────────────────────────────────────────────────────────────
  const handleGenerateCode = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await axios.post(`${API}/attendance-code/generate`, {
        subjectId,
        subjectName: subject.name,
        courseId,
        semester,
      });
      setCodeData(res.data.data);
      fetchAttendance(); // Fresh sheet dikhao
    } catch (err) {
      setError(
        err.response?.data?.message || "Code generate karne mein error aaya.",
      );
    } finally {
      setGenerating(false);
    }
  };

  // ── Deactivate code ──────────────────────────────────────────────────────────
  const handleDeactivate = async () => {
    if (!codeData?._id) return;
    try {
      await axios.patch(`${API}/attendance-code/deactivate/${codeData._id}`);
      setCodeData(null);
      fetchAttendance();
    } catch (err) {
      console.error("Deactivate error:", err.message);
    }
  };

  const progressPct = codeData
    ? Math.round((secondsLeft / CODE_VALIDITY_SECONDS) * 100)
    : 0;
  const progressColor =
    progressPct > 50 ? "#2ecc71" : progressPct > 20 ? "#f39c12" : "#e74c3c";

  const presentCount = attendance.filter((r) => r.status === "Present").length;
  const absentCount = attendance.filter((r) => r.status === "Absent").length;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Teacher Attendance Panel</p>
        </div>
        <button
          onClick={handleGenerateCode}
          disabled={generating}
          className="border-2 border-black px-6 py-2 font-semibold hover:bg-black hover:text-white transition disabled:opacity-50"
        >
          {generating
            ? "Generating…"
            : codeData && !isExpired
              ? "🔄 Regenerate Code"
              : "🔑 Generate Code"}
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Code Card */}
      {codeData && (
        <div
          className={`border-4 rounded-2xl p-8 mb-8 transition-all ${
            isExpired ? "border-red-400 bg-red-50" : "border-black bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Code display */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
                {subject.name} — Attendance Code
              </p>
              <div
                className={`text-6xl font-black tracking-[12px] font-mono ${
                  isExpired ? "text-red-400 line-through" : "text-black"
                }`}
              >
                {codeData.code}
              </div>
              {isExpired && (
                <p className="text-red-500 text-sm font-semibold mt-2">
                  ⚠️ Code expired! Naya code generate karein.
                </p>
              )}
            </div>

            {/* Countdown timer */}
            {!isExpired && (
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold font-mono text-gray-800">
                  {timerDisplay}
                </div>
                <p className="text-xs text-gray-500 mt-1">Time remaining</p>
                <div className="w-40 h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progressPct}%`,
                      background: progressColor,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {!isExpired && (
            <div className="mt-4 flex items-center gap-6">
              <button
                onClick={handleDeactivate}
                className="text-sm text-gray-500 hover:text-red-600 underline transition"
              >
                End Attendance Early
              </button>
              <p className="text-xs text-gray-400">
                Valid till:{" "}
                {new Date(codeData.expiresAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Today's Attendance Sheet */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Today's Attendance —{" "}
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </h2>
            {/* ✅ NEW: Live count dikhao */}
            {attendance.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-green-600 font-semibold">
                  {presentCount} Present
                </span>
                {" · "}
                <span className="text-red-500 font-semibold">
                  {absentCount} Absent
                </span>
                {" · "}
                <span className="font-semibold">{attendance.length} Total</span>
              </p>
            )}
          </div>
          <button
            onClick={fetchAttendance}
            className="text-sm text-blue-500 hover:underline"
          >
            🔃 Refresh
          </button>
        </div>

        {loadingAtt ? (
          <p className="px-8 py-6 text-gray-400 animate-pulse">Loading…</p>
        ) : fetchError ? (
          <p className="px-8 py-6 text-red-500 text-sm">{fetchError}</p>
        ) : attendance.length === 0 ? (
          <p className="px-8 py-6 text-gray-400 text-sm">
            Abhi tak koi student ne attendance nahi lagayi.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["#", "Student Name", "Status", "Code Used", "Time"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {attendance.map((row, i) => (
                <tr
                  key={row._id || i}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {row.userName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        row.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {row.codeUsed || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {row.markedAt
                      ? new Date(row.markedAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-8 text-gray-500 hover:text-gray-800 transition"
      >
        ← Back
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — CodeBasedAttendence (Teacher view)
// ─────────────────────────────────────────────────────────────────────────────
export default function CodeBasedAttendence() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/course`);
        setCourses(res.data || []);
      } catch (err) {
        console.error("fetchCourses:", err.message);
        setError("Courses load nahi ho sake. Backend check karo.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse text-xl text-gray-600">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-500 font-semibold text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (selectedSubject) {
    return (
      <TeacherSubjectPage
        subject={selectedSubject}
        courseId={selectedCourse._id || selectedCourse.name}
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
          className="text-gray-500 mb-6 hover:text-gray-800 transition"
        >
          ← Back to Semesters
        </button>
        <h1 className="text-4xl font-bold mb-10">Subjects</h1>
        <div className="flex flex-col gap-6">
          {selectedSemester.subjects.map((sub, i) => (
            <div
              key={sub._id || i}
              onClick={() => setSelectedSubject(sub)}
              className="flex justify-between items-center p-6 bg-white border rounded-xl shadow hover:scale-105 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold">{sub.name}</h2>
              <span className="text-xl">➜</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => setSelectedCourse(null)}
          className="text-gray-500 mb-6 hover:text-gray-800 transition"
        >
          ← Back to Courses
        </button>
        <h1 className="text-4xl font-bold mb-10">Semesters</h1>
        <div className="flex flex-col gap-6">
          {selectedCourse.semesters.map((sem, i) => (
            <div
              key={i}
              onClick={() => setSelectedSemester(sem)}
              className="flex justify-between items-center p-6 bg-white border rounded-xl shadow hover:scale-105 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold">
                Semester {sem.semester}
              </h2>
              <span className="text-xl">➜</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-gray-800">Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-400">Koi course nahi mila.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {courses.map((course, i) => (
            <div
              key={course._id || i}
              onClick={() => setSelectedCourse(course)}
              className="flex justify-between items-center p-6 bg-white border rounded-xl shadow hover:scale-105 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold">{course.name}</h2>
              <span className="text-xl">➜</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
