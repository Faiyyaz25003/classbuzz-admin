
"use client";
import React, { useState } from "react";
import { UserCircle, Plus, Trash2, Save, Search } from "lucide-react";

export default function Result() {
  // ✅ Class list
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

  // ✅ Sample students data per class
  const studentData = {
    "Computer Science": ["Aman", "Riya", "Karan", "Neha"],
    "Information Technology": ["Tina", "Mohit", "Arjun", "Sara"],
    "Electronics & Communication": ["Rohit", "Priya", "Deepak", "Nisha"],
    "Mechanical Engineering": ["Rahul", "Vikram", "Sameer"],
    "Civil Engineering": ["Suresh", "Amit", "Kavita"],
    "Electrical Engineering": ["Kiran", "Manoj", "Vivek"],
    "Artificial Intelligence & Data Science": ["Simran", "Ravi", "Meena"],
    Biotechnology: ["Arnav", "Nikita"],
    Physics: ["Aditya", "Sneha"],
    Chemistry: ["Rehan", "Priyanka"],
    Mathematics: ["Ishaan", "Tara"],
    Commerce: ["Yash", "Ruchi"],
    "Business Administration": ["Pooja", "Ajay"],
    Economics: ["Zoya", "Ankit"],
    English: ["Tanvi", "Kabir"],
    Psychology: ["Navya", "Arjun"],
    Sociology: ["Kriti", "Dev"],
    "Fine Arts": ["Naina", "Sahil"],
    "Mass Communication": ["Riya", "Irfan"],
    "Other (Custom)": [],
  };

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    class: "",
    semester: "",
    subjects: [{ name: "", marks: "", maxMarks: 100 }],
  });
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Handle class and student selection
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // When class changes, reset the student name field
    if (name === "class") {
      setFormData((prev) => ({
        ...prev,
        class: value,
        name: "", // reset student name
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      subjects: newSubjects,
    }));
  };

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", marks: "", maxMarks: 100 }],
    }));
  };

  const removeSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      subjects: newSubjects,
    }));
  };

  const calculatePercentage = (subjects) => {
    const totalMarks = subjects.reduce(
      (sum, sub) => sum + Number(sub.marks || 0),
      0
    );
    const totalMax = subjects.reduce(
      (sum, sub) => sum + Number(sub.maxMarks || 0),
      0
    );
    return totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(2) : 0;
  };

  const handleSubmit = () => {
    if (
      !formData.rollNo ||
      !formData.name ||
      !formData.class ||
      formData.subjects.some((s) => !s.name || !s.marks)
    ) {
      alert("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    const percentage = calculatePercentage(formData.subjects);
    const newStudent = {
      ...formData,
      percentage,
      id: Date.now(),
    };

    setStudents((prev) => [...prev, newStudent]);

    setFormData({
      rollNo: "",
      name: "",
      class: "",
      semester: "",
      subjects: [{ name: "", marks: "", maxMarks: 100 }],
    });

    alert("Marks successfully saved!");
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <UserCircle className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Student Marks Entry System
            </h1>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ✅ Class Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">-- Select Class --</option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Student Dropdown (depends on class) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!formData.class}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">
                    {formData.class
                      ? "-- Select Student --"
                      : "Select a class first"}
                  </option>
                  {formData.class &&
                    (studentData[formData.class] || []).map((student) => (
                      <option key={student} value={student}>
                        {student}
                      </option>
                    ))}
                </select>
              </div>

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
                  required
                />
              </div>

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

            {/* ✅ Subjects Section */}
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
                      required
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
                      required
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

        {/* ✅ Saved Records Table */}
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
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student.rollNo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student.class}
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
                          {student.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
