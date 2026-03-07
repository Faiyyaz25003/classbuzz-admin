"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpcomingExams() {
  const [courses, setCourses] = useState([]);
  const [allTimetables, setAllTimetables] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [timetableId, setTimetableId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchTimetables();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // FETCH COURSES
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH ALL TIMETABLES
  const fetchTimetables = async () => {
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/api/exam-timetable");

      const tables = res.data || [];

      setAllTimetables(tables);

      // DEFAULT LOAD
      if (tables.length > 0) {
        const first = tables[0];

        setSelectedCourse(first.course?._id);
        setSelectedSemester(first.semester.toString());
        setTimetable(first.timetable);
        setTimetableId(first._id);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // COURSE SELECT
  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSemester("");

    const filtered = allTimetables.find((t) => t.course?._id === courseId);

    if (filtered) {
      setTimetable(filtered.timetable);
      setTimetableId(filtered._id);
      setSelectedSemester(filtered.semester.toString());
    } else {
      setTimetable([]);
      setTimetableId(null);
    }
  };

  // SEMESTER SELECT
  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);

    const filtered = allTimetables.find(
      (t) =>
        t.course?._id === selectedCourse && t.semester.toString() === semester,
    );

    if (filtered) {
      setTimetable(filtered.timetable);
      setTimetableId(filtered._id);
      return;
    }

    // CREATE EMPTY TABLE IF NOT FOUND
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
    setTimetableId(null);
  };

  // INPUT CHANGE
  const handleChange = (index, field, value) => {
    const updated = [...timetable];
    updated[index][field] = value;
    setTimetable(updated);
  };

  // SAVE TIMETABLE
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

  // UPDATE ROW
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

  // DELETE ROW
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

  // DELETE TIMETABLE
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
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "error"
              ? "bg-red-50 border border-red-200 text-red-600"
              : "bg-emerald-50 border border-emerald-200 text-emerald-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Exam <span className="text-indigo-600">Timetable</span>
          </h1>
        </div>

        {/* SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {/* COURSE */}
          <select
            className="border rounded-xl px-4 py-3"
            value={selectedCourse}
            onChange={(e) => handleCourseSelect(e.target.value)}
          >
            <option value="">Choose Course</option>

            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>

          {/* SEMESTER */}
          <select
            className="border rounded-xl px-4 py-3"
            value={selectedSemester}
            onChange={(e) => handleSemesterSelect(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">Choose Semester</option>

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

        {/* LOADING */}
        {loading && <p>Loading timetable...</p>}

        {/* TABLE */}
        {!loading && timetable.length > 0 && (
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Time</th>
                  <th className="px-5 py-3 text-left">Room</th>
                  {timetableId && (
                    <th className="px-5 py-3 text-center">Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {timetable.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-5 py-4">{index + 1}</td>

                    <td className="px-5 py-4 font-semibold">{item.subject}</td>

                    <td className="px-5 py-4">
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) =>
                          handleChange(index, "date", e.target.value)
                        }
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="time"
                        value={item.time}
                        onChange={(e) =>
                          handleChange(index, "time", e.target.value)
                        }
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="text"
                        value={item.room}
                        onChange={(e) =>
                          handleChange(index, "room", e.target.value)
                        }
                      />
                    </td>

                    {timetableId && (
                      <td className="px-5 py-4 flex gap-2">
                        <button
                          onClick={() => updateRow(index)}
                          className="text-emerald-600"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => deleteRow(index)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {!timetableId && (
              <div className="p-5 text-right">
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
                >
                  Save Timetable
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
