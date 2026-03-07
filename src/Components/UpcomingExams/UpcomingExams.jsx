"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpcomingExams() {
  const [courses, setCourses] = useState([]);
  const [allTimetables, setAllTimetables] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([
    { subject: "", date: "", time: "", room: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchTimetables();
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

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/exam-timetable");
      setAllTimetables(res.data || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const addRow = () =>
    setSubjects([...subjects, { subject: "", date: "", time: "", room: "" }]);
  const removeRow = (index) => {
    if (subjects.length === 1) return;
    setSubjects(subjects.filter((_, i) => i !== index));
  };
  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const createTimetable = async () => {
    if (!courseId || !semester) {
      showToast("Select course and semester", "error");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/exam-timetable", {
        course: courseId,
        semester,
        timetable: subjects,
      });
      showToast("Timetable created successfully!");
      setSubjects([{ subject: "", date: "", time: "", room: "" }]);
      setCourseId("");
      setSemester("");
      fetchTimetables();
    } catch (error) {
      showToast("Error creating timetable", "error");
    }
  };

  const updateRow = async (tableId, index, row) => {
    try {
      await axios.put(
        `http://localhost:5000/api/exam-timetable/${tableId}/row/${index}`,
        row,
      );
      showToast("Row updated!");
    } catch (error) {
      showToast("Error updating row", "error");
    }
  };

  const deleteRow = async (tableId, index) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/exam-timetable/${tableId}/row/${index}`,
      );
      fetchTimetables();
      showToast("Row deleted");
    } catch (error) {
      showToast("Error deleting row", "error");
    }
  };

  const deleteTimetable = async (tableId) => {
    if (!confirm("Delete this timetable?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/exam-timetable/${tableId}`);
      fetchTimetables();
      showToast("Timetable deleted");
    } catch (error) {
      showToast("Error deleting timetable", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10 text-slate-800">
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
          />
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Exam <span className="text-indigo-600">Timetable</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage and schedule upcoming examinations
            </p>
          </div>
        </div>

        {/* CREATE CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Create New Timetable</h2>
          </div>

          {/* COURSE & SEMESTER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Semester
              </label>
              <input
                type="number"
                placeholder="e.g. 4"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          {/* COLUMN LABELS */}
          <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 mb-2 px-1">
            {["Subject", "Date", "Time", "Room", ""].map((label, i) => (
              <p
                key={i}
                className="text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                {label}
              </p>
            ))}
          </div>

          {/* SUBJECT ROWS */}
          <div className="flex flex-col gap-3 mb-5">
            {subjects.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
              >
                <input
                  placeholder="Subject name"
                  value={row.subject}
                  onChange={(e) =>
                    handleChange(index, "subject", e.target.value)
                  }
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                />
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                />
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => handleChange(index, "time", e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                />
                <input
                  placeholder="Room no."
                  value={row.room}
                  onChange={(e) => handleChange(index, "room", e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                />
                <button
                  onClick={() => removeRow(index)}
                  disabled={subjects.length === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={addRow}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-xl transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Subject
            </button>
            <button
              onClick={createTimetable}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm shadow-indigo-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Create Timetable
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            All Timetables
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading timetables...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && allTimetables.length === 0 && (
          <div className="text-center py-20">
            <svg
              className="w-14 h-14 mx-auto mb-4 text-slate-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="font-medium text-slate-500">No timetables yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Create your first exam timetable above
            </p>
          </div>
        )}

        {/* TIMETABLE LIST */}
        {!loading &&
          allTimetables.map((table) => (
            <div
              key={table._id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-8"
            >
              {/* CARD HEADER */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-indigo-700">
                      {table.course?.name}
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                      Semester {table.semester}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTimetable(table._id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 px-4 py-2 rounded-xl transition"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Timetable
                </button>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["#", "Subject", "Date", "Time", "Room", "Action"].map(
                        (h, i) => (
                          <th
                            key={i}
                            className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {table.timetable.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-slate-100 hover:bg-slate-50/60 transition"
                      >
                        <td className="px-5 py-3.5">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {row.subject}
                        </td>
                        <td className="px-5 py-3.5">
                          <input
                            type="date"
                            defaultValue={row.date}
                            onBlur={(e) => {
                              row.date = e.target.value;
                              updateRow(table._id, index, row);
                            }}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <input
                            type="time"
                            defaultValue={row.time}
                            onBlur={(e) => {
                              row.time = e.target.value;
                              updateRow(table._id, index, row);
                            }}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <input
                            defaultValue={row.room}
                            onBlur={(e) => {
                              row.room = e.target.value;
                              updateRow(table._id, index, row);
                            }}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition w-24"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => deleteRow(table._id, index)}
                            className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CARD FOOTER */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                <p className="text-xs text-slate-400">
                  {table.timetable.length} exam
                  {table.timetable.length !== 1 ? "s" : ""} scheduled
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
