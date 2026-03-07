

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpcomingExams() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [timetableId, setTimetableId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSemester("");
    setTimetable([]);
    setTimetableId(null);
  };

  const handleSemesterSelect = async (semester) => {
    setSelectedSemester(semester);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/exam-timetable`);
      const table = res.data.find(
        (t) =>
          t.course?._id === selectedCourse &&
          t.semester.toString() === semester,
      );
      if (table) {
        setTimetable(table.timetable);
        setTimetableId(table._id);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    const course = courses.find((c) => c._id === selectedCourse);
    const semesterData = course?.semesters?.find(
      (s) => s.semester.toString() === semester,
    );
    const subjects = semesterData?.subjects || [];
    const table = subjects.map((sub) => ({
      subject: sub.name,
      date: "",
      time: "",
      room: "",
    }));
    setTimetable(table);
    setLoading(false);
  };

  const handleChange = (index, field, value) => {
    const updated = [...timetable];
    updated[index][field] = value;
    setTimetable(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("http://localhost:5000/api/exam-timetable", {
        course: selectedCourse,
        semester: selectedSemester,
        timetable,
      });
      setTimetableId(res.data.data._id);
      showToast("Timetable saved successfully!");
    } catch (error) {
      showToast("Error saving timetable", "error");
    }
    setSaving(false);
  };

  const updateRow = async (index) => {
    try {
      await axios.put(
        `http://localhost:5000/api/exam-timetable/${timetableId}/row/${index}`,
        timetable[index],
      );
      showToast("Row updated successfully!");
    } catch (error) {
      showToast("Error updating row", "error");
    }
  };

  const deleteRow = async (index) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/exam-timetable/${timetableId}/row/${index}`,
      );
      setTimetable(timetable.filter((_, i) => i !== index));
      showToast("Row deleted");
    } catch (error) {
      showToast("Error deleting row", "error");
    }
  };

  const deleteTimetable = async () => {
    if (!confirm("Delete the full timetable?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/exam-timetable/${timetableId}`,
      );
      setTimetable([]);
      setTimetableId(null);
      showToast("Timetable deleted");
    } catch (error) {
      showToast("Error deleting timetable", "error");
    }
  };

  const selectedCourseName =
    courses.find((c) => c._id === selectedCourse)?.name || "";

  return (
    <div className="min-h-screen bg-white text-slate-800 px-4 py-10">
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === "error"
              ? "bg-red-50 border border-red-200 text-red-600"
              : "bg-emerald-50 border border-emerald-200 text-emerald-600"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              toast.type === "error" ? "bg-red-400" : "bg-emerald-400"
            }`}
          />
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-semibold tracking-widest uppercase mb-3">
            <span className="w-5 h-px bg-indigo-400 inline-block" />
            Examination Portal
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Exam{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Timetable
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Schedule and manage exam sessions by course and semester.
          </p>
        </div>

        {/* SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {/* COURSE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              📚 Select Course
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition cursor-pointer"
              value={selectedCourse}
              onChange={(e) => handleCourseSelect(e.target.value)}
            >
              <option value="">— Choose a course —</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* SEMESTER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              🗓️ Select Semester
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              value={selectedSemester}
              onChange={(e) => handleSemesterSelect(e.target.value)}
              disabled={!selectedCourse}
            >
              <option value="">— Choose a semester —</option>
              {selectedCourse &&
                courses
                  .find((c) => c._id === selectedCourse)
                  ?.semesters?.map((s) => (
                    <option key={s.semester} value={s.semester}>
                      Semester {s.semester}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* ACTIVE SELECTION PILLS */}
        {selectedCourseName && selectedSemester && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-medium px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {selectedCourseName}
            </span>
            <span className="text-slate-300 text-xs">→</span>
            <span className="flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-600 text-xs font-medium px-4 py-2 rounded-full">
              Semester {selectedSemester}
            </span>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <svg
              className="animate-spin w-5 h-5 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-sm">Loading timetable...</span>
          </div>
        )}

        {/* TIMETABLE */}
        {!loading && timetable.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* TABLE HEADER BAR */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Exam Schedule
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {timetable.length} subject{timetable.length > 1 ? "s" : ""}{" "}
                  listed
                </p>
              </div>
              {timetableId && (
                <button
                  onClick={deleteTimetable}
                  className="flex items-center gap-2 text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition"
                >
                  🗑️ Delete All
                </button>
              )}
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-5 py-3 text-left font-semibold">#</th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Subject
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Exam Date
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">Time</th>
                    <th className="px-5 py-3 text-left font-semibold">Room</th>
                    {timetableId && (
                      <th className="px-5 py-3 text-center font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timetable.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* INDEX */}
                      <td className="px-5 py-4 text-slate-300 font-mono text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* SUBJECT */}
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {item.subject}
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4">
                        <input
                          type="date"
                          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-full transition"
                          value={item.date}
                          onChange={(e) =>
                            handleChange(index, "date", e.target.value)
                          }
                        />
                      </td>

                      {/* TIME */}
                      <td className="px-5 py-4">
                        <input
                          type="time"
                          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-full transition"
                          value={item.time}
                          onChange={(e) =>
                            handleChange(index, "time", e.target.value)
                          }
                        />
                      </td>

                      {/* ROOM */}
                      <td className="px-5 py-4">
                        <input
                          type="text"
                          placeholder="e.g. A-101"
                          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-full transition placeholder:text-slate-300"
                          value={item.room}
                          onChange={(e) =>
                            handleChange(index, "room", e.target.value)
                          }
                        />
                      </td>

                      {/* ACTIONS */}
                      {timetableId && (
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateRow(index)}
                              className="text-xs font-medium text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => deleteRow(index)}
                              className="text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SAVE BUTTON */}
            {!timetableId && (
              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-md shadow-indigo-200"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>💾 Save Timetable</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && selectedSemester && timetable.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-slate-500 font-medium">No subjects found</p>
            <p className="text-slate-400 text-sm mt-1">
              This semester has no subjects assigned yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
