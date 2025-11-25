
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Book, Pencil } from "lucide-react";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [credits, setCredits] = useState("2");
  const [expandedCourses, setExpandedCourses] = useState({});
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCredits, setEditCredits] = useState("");

  const courseOptions = [
    "Computer Science (B.COM)",
    "Information Technology (BSCIT)",
    "Electronics & Communication (BFM)",
    "Mechanical Engineering (BAF)",
    "Data Science (BSC. DS)",
    "Management Studies (BMS)",
    "Banking and Insurance (BBI)",
    "Multimedia and Mass Communication (BAMMC)",
  ];

  const semesterOptions = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  // Load all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data);
    } catch (err) {
      console.log("Error fetching:", err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Add subject
  const addSubject = async () => {
    if (!selectedCourse || !selectedSemester || !subjectName) {
      alert("Fill all fields");
      return;
    }

    const semesterNum = parseInt(selectedSemester.split(" ")[1]);

    try {
      await axios.post("http://localhost:5000/api/course/subject", {
        courseName: selectedCourse,
        semester: semesterNum,
        subjectName,
        credits: parseInt(credits),
      });

      fetchCourses();
      setSubjectName("");
      setCredits("2");
    } catch (err) {
      console.log(err);
      alert("Error adding subject");
    }
  };

  // Start editing subject
  const startEdit = (subject) => {
    setEditId(subject.id);
    setEditName(subject.name);
    setEditCredits(subject.credits);
  };

  // Save edited subject
  const saveEditSubject = async (courseId, semesterNum, subjectId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/course/${courseId}/semester/${semesterNum}/subject/${subjectId}`,
        {
          name: editName,
          credits: editCredits,
        }
      );

      setEditId(null);
      fetchCourses();
    } catch (err) {
      console.log(err);
      alert("Error updating subject");
    }
  };

  // Delete entire course
  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/course/${courseId}`);
      fetchCourses();
    } catch (err) {
      console.log(err);
      alert("Error deleting");
    }
  };

  const toggleCourse = (id) => {
    setExpandedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-3">
          <Book className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">Course Management System</h1>
            <p className="text-gray-600 mt-1">
              Manage courses, semesters, and subjects
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add subject form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Add New Course Data</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
              >
                <option value="">Choose course...</option>
                {courseOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">Select Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
              >
                <option value="">Choose semester...</option>
                {semesterOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">Subject Name</label>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
                placeholder="Enter subject"
              />
            </div>

            <div>
              <label className="font-medium">Credits</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={addSubject}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg"
          >
            Add Subject
          </button>
        </div>

        {/* Course list */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">All Courses</h2>

          {courses.length === 0 ? (
            <p className="text-center text-gray-500">No courses found.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="border border-gray-200 rounded-lg mb-5"
              >
                <div
                  className="bg-green-50 border-l-4 border-green-500 p-4 flex justify-between cursor-pointer"
                  onClick={() => toggleCourse(course._id)}
                >
                  <span className="font-bold uppercase">{course.name}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCourse(course._id);
                    }}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </div>

                {expandedCourses[course._id] &&
                  course.semesters.map((sem) => (
                    <div key={sem.semester} className="p-6">
                      <h3 className="font-bold mb-4">
                        SEMESTER {sem.semester}
                      </h3>

                      <table className="w-full border">
                        <thead>
                          <tr className="bg-orange-500 text-white">
                            <th className="border px-4 py-3">Sr</th>
                            <th className="border px-4 py-3">Subject</th>
                            <th className="border px-4 py-3">Credits</th>
                            <th className="border px-4 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sem.subjects.map((sub, index) => (
                            <tr key={sub.id} className="hover:bg-gray-50">
                              <td className="border px-4 py-3">{index + 1}</td>

                              <td className="border px-4 py-3">
                                {editId === sub.id ? (
                                  <input
                                    value={editName}
                                    onChange={(e) =>
                                      setEditName(e.target.value)
                                    }
                                    className="px-2 py-1 border rounded"
                                  />
                                ) : (
                                  sub.name
                                )}
                              </td>

                              <td className="border px-4 py-3 text-center">
                                {editId === sub.id ? (
                                  <input
                                    value={editCredits}
                                    type="number"
                                    onChange={(e) =>
                                      setEditCredits(e.target.value)
                                    }
                                    className="px-2 py-1 w-20 border rounded"
                                  />
                                ) : (
                                  sub.credits
                                )}
                              </td>

                              <td className="border px-4 py-3 text-center">
                                {editId === sub.id ? (
                                  <button
                                    onClick={() =>
                                      saveEditSubject(
                                        course._id,
                                        sem.semester,
                                        sub.id
                                      )
                                    }
                                    className="px-4 py-1 bg-green-600 text-white rounded"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => startEdit(sub)}
                                    className="text-blue-600"
                                  >
                                    <Pencil className="w-5 h-5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
