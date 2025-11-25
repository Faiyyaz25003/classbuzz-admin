"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Book,
  Pencil,
  Trash2,
  Plus,
  Minus,
  Save,
  X,
  Check,
  AlertCircle,
  Search,
} from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

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

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data);
    } catch (err) {
      console.log("Error fetching:", err);
      setCourses([]);
      showNotification("Failed to fetch courses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addSubject = async () => {
    if (!selectedCourse || !selectedSemester || !subjectName) {
      showNotification("Please fill all fields", "error");
      return;
    }

    const semesterNum = parseInt(selectedSemester.split(" ")[1]);
    setLoading(true);

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
      showNotification("Subject added successfully!", "success");
    } catch (err) {
      console.log(err);
      showNotification("Error adding subject", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (subject) => {
    setEditId(subject.id);
    setEditName(subject.name);
    setEditCredits(subject.credits);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditCredits("");
  };

  const saveEditSubject = async (courseId, semesterNum, subjectId) => {
    setLoading(true);
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
      showNotification("Subject updated successfully!", "success");
    } catch (err) {
      console.log(err);
      showNotification("Error updating subject", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId, courseName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${courseName}"? This will remove all semesters and subjects.`
      )
    ) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/course/${courseId}`);
        fetchCourses();
        showNotification("Course deleted successfully!", "success");
      } catch (err) {
        console.log(err);
        showNotification("Error deleting course", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCourse = (id) => {
    setExpandedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#1e7a8c] to-[#2596ad] p-3 rounded-xl shadow-lg">
              <Book className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1e7a8c] to-[#2596ad] bg-clip-text text-transparent">
                Course Management System
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage courses, semesters, and subjects with ease
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add subject form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Plus className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Subject
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              >
                <option value="">Choose course...</option>
                {courseOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              >
                <option value="">Choose semester...</option>
                {semesterOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder="Enter subject name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Credits
              </label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                min="1"
                max="10"
              />
            </div>
          </div>

          <button
            onClick={addSubject}
            disabled={loading}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-[#1e7a8c] to-[#2596ad] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </div>

        {/* Course list */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Book className="w-6 h-6 text-[#1e7a8c]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>

          {loading && courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No courses found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 p-5 flex justify-between items-center cursor-pointer hover:from-teal-600 hover:to-cyan-700 transition-all"
                    onClick={() => toggleCourse(course._id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedCourses[course._id] ? (
                        <Minus className="w-5 h-5 text-white" />
                      ) : (
                        <Plus className="w-5 h-5 text-white" />
                      )}
                      <span className="font-bold text-white text-lg uppercase tracking-wide">
                        {course.name}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCourse(course._id, course.name);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  {expandedCourses[course._id] && (
                    <div className="bg-gray-50">
                      {course.semesters.map((sem) => (
                        <div
                          key={sem.semester}
                          className="p-6 border-t border-gray-200"
                        >
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg mb-4 inline-block">
                            <h3 className="font-bold text-lg">
                              SEMESTER {sem.semester}
                            </h3>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                  <th className="px-6 py-4 text-left font-semibold">
                                    Sr
                                  </th>
                                  <th className="px-6 py-4 text-left font-semibold">
                                    Subject Name
                                  </th>
                                  <th className="px-6 py-4 text-center font-semibold">
                                    Credits
                                  </th>
                                  <th className="px-6 py-4 text-center font-semibold">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {sem.subjects.map((sub, index) => (
                                  <tr
                                    key={sub.id}
                                    className="border-b border-gray-200 hover:bg-indigo-50 transition-colors"
                                  >
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                      {index + 1}
                                    </td>

                                    <td className="px-6 py-4">
                                      {editId === sub.id ? (
                                        <input
                                          value={editName}
                                          onChange={(e) =>
                                            setEditName(e.target.value)
                                          }
                                          className="px-3 py-2 border-2 border-indigo-300 rounded-lg w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                      ) : (
                                        <span className="text-gray-800 font-medium">
                                          {sub.name}
                                        </span>
                                      )}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                      {editId === sub.id ? (
                                        <input
                                          value={editCredits}
                                          type="number"
                                          onChange={(e) =>
                                            setEditCredits(e.target.value)
                                          }
                                          className="px-3 py-2 w-20 border-2 border-indigo-300 rounded-lg text-center focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                          min="1"
                                          max="10"
                                        />
                                      ) : (
                                        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                                          {sub.credits}
                                        </span>
                                      )}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                      {editId === sub.id ? (
                                        <div className="flex items-center justify-center gap-2">
                                          <button
                                            onClick={() =>
                                              saveEditSubject(
                                                course._id,
                                                sem.semester,
                                                sub.id
                                              )
                                            }
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-1"
                                          >
                                            <Save className="w-4 h-4" />
                                            Save
                                          </button>
                                          <button
                                            onClick={cancelEdit}
                                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-1"
                                          >
                                            <X className="w-4 h-4" />
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => startEdit(sub)}
                                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 p-2 rounded-lg transition-colors"
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
