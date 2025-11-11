
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle, Plus, Trash2, Save, Search, Eye } from "lucide-react";
import ResultView from "./ResultView";
import ResultPDF from "./ResultPDF";

export default function Result() {
  // ✅ Static class list
  const classList = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Artificial Intelligence & Data Science",
    "Biotechnology",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Commerce",
    "Business Administration",
    "Economics",
    "English",
    "Psychology",
    "Sociology",
    "Fine Arts",
    "Mass Communication",
    "Other (Custom)",
  ];

  // ✅ States
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    class: "",
    semester: "",
    subjects: [{ name: "", marks: "", maxMarks: 100 }],
  });

  // ✅ Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load user list!");
      }
    };
    fetchAllUsers();
  }, []);

  // ✅ Fetch all student results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/results");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
        alert("Failed to load student records!");
      }
    };
    fetchResults();
  }, []);

  // ✅ Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Subject handling
  const handleSubjectChange = (index, field, value) => {
    const updated = [...formData.subjects];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };

  const addSubject = () =>
    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", marks: "", maxMarks: 100 }],
    }));

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  // ✅ Save data
  const handleSubmit = async () => {
    if (
      !formData.rollNo ||
      !formData.name ||
      !formData.class ||
      formData.subjects.some((s) => !s.name || !s.marks)
    ) {
      alert("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/results", {
        rollNo: formData.rollNo,
        name: formData.name,
        className: formData.class,
        semester: formData.semester,
        subjects: formData.subjects,
      });

      setStudents((prev) => [...prev, response.data]);
      alert("Marks successfully saved!");
    } catch (error) {
      console.error(error);
      alert("Error saving data!");
    }
  };

  // ✅ Delete record
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/results/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      alert("Record deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete record!");
    }
  };

  // ✅ View result modal
  const viewResult = (student) => setSelectedStudent(student);
  const closeResultView = () => setSelectedStudent(null);

  // ✅ Search filter
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <UserCircle className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Student Marks Entry System
            </h1>
          </div>

          {/* ✅ Entry Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Class Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select Class --</option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Student Name Dropdown (ALL USERS) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select Student --</option>
                  {users.map((user) => (
                    <option key={user._id} value={user.name}>
                      {user.name} ({user.className})
                    </option>
                  ))}
                </select>
              </div>

              {/* Roll No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number *
                </label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter roll number"
                />
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Semester 1"
                />
              </div>
            </div>

            {/* Subjects Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Subject Marks
                </h3>
                <button
                  type="button"
                  onClick={addSubject}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>

              {formData.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) =>
                        handleSubjectChange(index, "name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Mathematics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marks Obtained *
                    </label>
                    <input
                      type="number"
                      value={subject.marks}
                      onChange={(e) =>
                        handleSubjectChange(index, "marks", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                      max={subject.maxMarks}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Marks
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={subject.maxMarks}
                        onChange={(e) =>
                          handleSubjectChange(index, "maxMarks", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="100"
                        min="1"
                      />
                      {formData.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              <Save className="w-5 h-5" />
              Save Marks
            </button>
          </div>
        </div>

        {/* ✅ Saved Records */}
        {students.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Saved Records
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or roll no..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Roll No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Percentage
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student.rollNo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student.className}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.percentage >= 75
                              ? "bg-green-100 text-green-800"
                              : student.percentage >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.percentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewResult(student)}
                            className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50"
                            title="View Result"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <ResultPDF student={student} />
                          <button
                            onClick={() => deleteStudent(student._id)}
                            className="text-red-600 hover:text-red-800 transition px-2 py-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Result View Modal */}
      {selectedStudent && (
        <ResultView student={selectedStudent} onClose={closeResultView} />
      )}
    </div>
  );
}
