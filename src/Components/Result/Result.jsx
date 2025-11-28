
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MarksEntry() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleCourseSelect = (id) => {
    setSelectedCourse(id);
    setSelectedSemester("");
    setSubjects([]);
    setMarks({});
  };

  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem);
    const course = courses.find((c) => c._id === selectedCourse);
    const selectedSem = course?.semesters.find(
      (s) => s.semester.toString() === sem
    );
    setSubjects(selectedSem?.subjects || []);
  };

  const handleMarksChange = (sub, value) => {
    setMarks({ ...marks, [sub]: value });
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !selectedSemester || !selectedUser || !rollNumber) {
      alert("Please fill all required fields!");
      return;
    }

    const payload = {
      courseId: selectedCourse,
      semester: selectedSemester,
      userId: selectedUser,
      rollNumber,
      marks: subjects.map((s) => ({
        subject: s.name,
        obtained: Number(marks[s.name] || 0),
        maxMarks: 100,
      })),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/marks", payload);
      if (res.status === 201 || res.status === 200) {
        alert("Marks Submitted Successfully!");
        // Reset form
        setSelectedCourse("");
        setSelectedSemester("");
        setSelectedUser("");
        setRollNumber("");
        setSubjects([]);
        setMarks({});
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit marks. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
        Student Marks Entry
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-2xl rounded-2xl transition-all hover:shadow-3xl">
        {/* Course */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">
            Select Course *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1 transition"
            value={selectedCourse}
            onChange={(e) => handleCourseSelect(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">
            Select Semester *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1 transition"
            value={selectedSemester}
            onChange={(e) => handleSemesterSelect(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">Select Semester</option>
            {selectedCourse &&
              courses
                .find((c) => c._id === selectedCourse)
                ?.semesters.map((s) => (
                  <option key={s.semester} value={s.semester}>
                    Semester {s.semester}
                  </option>
                ))}
          </select>
        </div>

        {/* Student */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">
            Student Name *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1 transition"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Roll Number */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">
            Roll Number *
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1 transition"
            placeholder="Enter Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />
        </div>
      </div>

      {/* Subjects */}
      {subjects.length > 0 && (
        <div className="bg-white p-6 shadow-2xl rounded-2xl mt-8 transition-all hover:shadow-3xl">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">
            Enter Marks
          </h2>
          {subjects.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 transition hover:bg-gray-100"
            >
              <p className="w-1/2 font-semibold text-gray-700">{sub.name}</p>
              <input
                type="number"
                className="w-1/4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Marks"
                defaultValue={0}
                onChange={(e) => handleMarksChange(sub.name, e.target.value)}
              />
              <p className="w-1/4 text-gray-500">/ 100</p>
            </div>
          ))}
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold mt-6 hover:scale-105 transition transform shadow-lg"
            onClick={handleSubmit}
          >
            Submit Marks
          </button>
        </div>
      )}
    </div>
  );
}
