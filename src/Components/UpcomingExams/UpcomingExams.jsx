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

  // FETCH COURSES
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH TIMETABLES
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

  // ADD SUBJECT ROW
  const addRow = () => {
    setSubjects([...subjects, { subject: "", date: "", time: "", room: "" }]);
  };

  // HANDLE CHANGE
  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  // CREATE TIMETABLE
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

      showToast("Timetable created");

      setSubjects([{ subject: "", date: "", time: "", room: "" }]);
      setCourseId("");
      setSemester("");

      fetchTimetables();
    } catch (error) {
      showToast("Error creating timetable", "error");
    }
  };

  // UPDATE ROW
  const updateRow = async (tableId, index, row) => {
    try {
      await axios.put(
        `http://localhost:5000/api/exam-timetable/${tableId}/row/${index}`,
        row,
      );

      showToast("Row updated");
    } catch (error) {
      showToast("Error updating row", "error");
    }
  };

  // DELETE ROW
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

  // DELETE TIMETABLE
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
    <div className="min-h-screen bg-white text-slate-800 px-4 py-10">
      {toast && (
        <div className="fixed top-5 right-5 bg-emerald-100 px-5 py-3 rounded-xl">
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Exam <span className="text-indigo-600">Timetable</span>
        </h1>

        {/* CREATE TIMETABLE */}

        <div className="border p-6 rounded-2xl mb-12">
          <h2 className="text-xl font-semibold mb-4">Create New Timetable</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Select Course</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border rounded p-2"
            />
          </div>

          {subjects.map((row, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 mb-3">
              <input
                placeholder="Subject"
                value={row.subject}
                onChange={(e) => handleChange(index, "subject", e.target.value)}
                className="border p-2 rounded"
              />

              <input
                type="date"
                value={row.date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
                className="border p-2 rounded"
              />

              <input
                type="time"
                value={row.time}
                onChange={(e) => handleChange(index, "time", e.target.value)}
                className="border p-2 rounded"
              />

              <input
                placeholder="Room"
                value={row.room}
                onChange={(e) => handleChange(index, "room", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button onClick={addRow} className="bg-gray-200 px-4 py-2 rounded">
              Add Subject
            </button>

            <button
              onClick={createTimetable}
              className="bg-indigo-600 text-white px-6 py-2 rounded"
            >
              Create Timetable
            </button>
          </div>
        </div>

        {/* TIMETABLE LIST */}

        {loading && <p>Loading...</p>}

        {!loading &&
          allTimetables.map((table) => (
            <div key={table._id} className="mb-12">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold text-indigo-600">
                  {table.course?.name} - Semester {table.semester}
                </h2>

                <button
                  onClick={() => deleteTimetable(table._id)}
                  className="text-red-500"
                >
                  Delete Timetable
                </button>
              </div>

              <table className="w-full border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {table.timetable.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td>{index + 1}</td>

                      <td>{row.subject}</td>

                      <td>
                        <input
                          type="date"
                          defaultValue={row.date}
                          onBlur={(e) => {
                            row.date = e.target.value;
                            updateRow(table._id, index, row);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          type="time"
                          defaultValue={row.time}
                          onBlur={(e) => {
                            row.time = e.target.value;
                            updateRow(table._id, index, row);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          defaultValue={row.room}
                          onBlur={(e) => {
                            row.room = e.target.value;
                            updateRow(table._id, index, row);
                          }}
                        />
                      </td>

                      <td>
                        <button
                          onClick={() => deleteRow(table._id, index)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
}
