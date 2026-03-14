"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

// ─────────────────────────────────────────────────────────
// Countdown Timer
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// Teacher Subject Page
// ─────────────────────────────────────────────────────────
function TeacherSubjectPage({ subject, courseId, semester, onBack }) {
  const [codeData, setCodeData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const { display } = useCountdown(codeData?.expiresAt);

  const subjectId = subject.name;

  // ─────────────────────────────────────────
  // Fetch Students — filtered by department + semester via backend query params
  // Backend should handle: GET /api/users?courseId=xxx&semester=1
  // ─────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);
    try {
      const res = await axios.get(`${API}/users`, {
        params: {
          courseId, // filter by course/department on the backend
          semester, // filter by semester on the backend
        },
      });
      setStudents(res.data || []);
    } catch (err) {
      console.error("fetchStudents error:", err.message);
    } finally {
      setLoadingStudents(false);
    }
  }, [courseId, semester]);

  // ─────────────────────────────────────────
  // Fetch Attendance for today
  // ─────────────────────────────────────────
  const fetchAttendance = useCallback(async () => {
    setLoadingAtt(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await axios.get(`${API}/attendance-record/teacher`, {
        params: { subjectId, date: today },
      });
      setAttendance(res.data?.data || []);
    } catch (err) {
      if (err.response?.status === 404) setAttendance([]);
    } finally {
      setLoadingAtt(false);
    }
  }, [subjectId]);

  // Load once on mount
  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, [fetchStudents, fetchAttendance]);

  // Auto-refresh attendance every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval);
  }, [fetchAttendance]);

  // ─────────────────────────────────────────
  // Generate Attendance Code
  // ─────────────────────────────────────────
  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/attendance-code/generate`, {
        subjectId,
        subjectName: subject.name,
        courseId,
        semester,
      });
      setCodeData(res.data.data);
      fetchAttendance();
    } catch (err) {
      console.error("generateCode error:", err);
    } finally {
      setGenerating(false);
    }
  };

  // ─────────────────────────────────────────
  // Merge students + attendance records
  // ─────────────────────────────────────────
  const mergedList = students.map((stu) => {
    const record = attendance.find((a) => String(a.userId) === String(stu._id));
    return {
      _id: stu._id,
      userName: stu.name || stu.userName || stu.fullName || "Unknown",
      status: record ? record.status : "Absent",
      codeUsed: record?.codeUsed || "",
      markedAt: record?.markedAt || null,
    };
  });

  const presentCount = mergedList.filter((r) => r.status === "Present").length;
  const absentCount = mergedList.filter((r) => r.status === "Absent").length;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loadingStudents
              ? "Loading students..."
              : `${students.length} students enrolled`}
          </p>
        </div>
        <button
          onClick={handleGenerateCode}
          disabled={generating}
          className="border-2 border-black px-6 py-2 font-semibold hover:bg-black hover:text-white disabled:opacity-40 transition-all"
        >
          {generating ? "Generating..." : "Generate Code"}
        </button>
      </div>

      {/* Code Display */}
      {codeData && (
        <div className="border-4 border-black p-8 rounded-xl mb-10 bg-white text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            Attendance Code
          </p>
          <div className="text-6xl font-black tracking-[12px] font-mono">
            {codeData.code}
          </div>
          <div className="mt-4 text-lg font-mono text-gray-600">
            Expires in: <span className="font-bold text-black">{display}</span>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-8 py-5 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-3">
            Today's Attendance
            <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {presentCount} Present
            </span>
            <span className="text-sm font-medium bg-red-100 text-red-500 px-3 py-1 rounded-full">
              {absentCount} Absent
            </span>
          </h2>
          <button
            onClick={fetchAttendance}
            className="text-blue-500 hover:underline text-sm"
          >
            Refresh
          </button>
        </div>

        {loadingStudents ? (
          <p className="p-8 text-gray-400">Loading students...</p>
        ) : mergedList.length === 0 ? (
          <p className="p-8 text-gray-400">
            No students found for this course &amp; semester.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                {["#", "Student Name", "Status", "Code Used", "Time"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {mergedList.map((row, i) => (
                <tr
                  key={row._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-400 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 font-semibold">{row.userName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        row.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">
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
        className="mt-8 text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Page — Course → Semester → Subject drill-down
// ─────────────────────────────────────────────────────────
export default function CodeBasedAttendence() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/course`);
        setCourses(res.data || []);
      } catch (err) {
        console.error("fetchCourses:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ── Subject View ──────────────────────────────────────
  if (selectedSubject) {
    return (
      <TeacherSubjectPage
        subject={selectedSubject}
        courseId={selectedCourse._id}
        semester={selectedSemester.semester}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  // ── Subjects List ─────────────────────────────────────
  if (selectedSemester) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => setSelectedSemester(null)}
          className="text-gray-500 hover:text-gray-900 mb-6 block transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-1">Subjects</h1>
        <p className="text-gray-400 text-sm mb-8">
          {selectedCourse.name} › Semester {selectedSemester.semester}
        </p>

        {!selectedSemester.subjects?.length ? (
          <p className="text-gray-400">No subjects found.</p>
        ) : (
          selectedSemester.subjects.map((sub, i) => (
            <div
              key={i}
              onClick={() => setSelectedSubject(sub)}
              className="p-6 border rounded-xl mb-4 cursor-pointer hover:shadow-sm transition-all bg-white"
            >
              <span className="font-semibold">{sub.name}</span>
            </div>
          ))
        )}
      </div>
    );
  }

  // ── Semesters List ────────────────────────────────────
  if (selectedCourse) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => setSelectedCourse(null)}
          className="text-gray-500 hover:text-gray-900 mb-6 block transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-1">Semesters</h1>
        <p className="text-gray-400 text-sm mb-8">{selectedCourse.name}</p>

        {selectedCourse.semesters?.map((sem, i) => (
          <div
            key={i}
            onClick={() => setSelectedSemester(sem)}
            className="p-6 border rounded-xl mb-4 cursor-pointer hover:shadow-sm transition-all bg-white"
          >
            <span className="font-semibold">Semester {sem.semester}</span>
            <span className="ml-3 text-sm text-gray-400">
              {sem.subjects?.length || 0} subjects
            </span>
          </div>
        ))}
      </div>
    );
  }

  // ── Courses List ──────────────────────────────────────
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-1">Courses</h1>
      <p className="text-gray-400 text-sm mb-10">
        Select a course to manage attendance
      </p>

      {loading ? (
        <p className="text-gray-400">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-400">No courses found.</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            onClick={() => setSelectedCourse(course)}
            className="p-6 border rounded-xl mb-4 cursor-pointer hover:shadow-sm transition-all bg-white"
          >
            <span className="font-semibold">{course.name}</span>
            <span className="ml-3 text-sm text-gray-400">
              {course.semesters?.length || 0} semesters
            </span>
          </div>
        ))
      )}
    </div>
  );
}
