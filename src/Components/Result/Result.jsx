
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Result() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});

  const [searchRoll, setSearchRoll] = useState("");
  const [searchedResult, setSearchedResult] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ================= PERCENTAGE ================= */
  const calculatePercentage = (marksArray) => {
    if (!marksArray || marksArray.length === 0) return 0;

    const totalObtained = marksArray.reduce(
      (acc, m) => acc + (m?.obtained || 0),
      0,
    );

    const totalMax = marksArray.reduce((acc, m) => acc + (m?.maxMarks || 0), 0);

    if (totalMax === 0) return 0;

    return ((totalObtained / totalMax) * 100).toFixed(2);
  };

  /* ================= FETCH COURSES ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/course");
        setCourses(res.data || []);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchCourses();
  }, []);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  /* ================= FETCH RESULTS ================= */
  const fetchAllResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/result");
      setResults(res.data || []);
    } catch (err) {
      console.error("Error fetching results", err);
    }
  };

  useEffect(() => {
    fetchAllResults();
  }, []);

  /* ================= HANDLE COURSE ================= */
  const handleCourseSelect = (id) => {
    setSelectedCourse(id);
    setSelectedSemester("");
    setSubjects([]);
    setMarks({});
  };

  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem);
    const course = courses.find((c) => c._id === selectedCourse);
    const selectedSem = course?.semesters?.find(
      (s) => s.semester.toString() === sem,
    );
    setSubjects(selectedSem?.subjects || []);
  };

  const handleMarksChange = (sub, value) => {
    setMarks({ ...marks, [sub]: value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!selectedCourse || !selectedSemester || !selectedUser || !rollNumber) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);

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
      const res = await axios.post("http://localhost:5000/api/result", payload);

      if (res.status === 200 || res.status === 201) {
        alert("Marks Submitted Successfully!");
        fetchAllResults();

        setSelectedCourse("");
        setSelectedSemester("");
        setSelectedUser("");
        setRollNumber("");
        setSubjects([]);
        setMarks({});
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit marks");
    }

    setLoading(false);
  };

  /* ================= SEARCH RESULT ================= */
  const handleSearchResult = async () => {
    if (!searchRoll) {
      alert("Enter Roll Number");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/result/${searchRoll}`,
      );
      setSearchedResult(res.data);
    } catch {
      alert("Result not found!");
      setSearchedResult(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
        Student Marks Entry & Results
      </h1>

      {/* SEARCH */}
      <div className="flex gap-4 mb-8">
        <input
          className="p-3 border rounded-lg w-1/3"
          placeholder="Search by Roll Number"
          value={searchRoll}
          onChange={(e) => setSearchRoll(e.target.value)}
        />
        <button
          className="bg-indigo-600 text-white px-6 rounded-lg"
          onClick={handleSearchResult}
        >
          Search Result
        </button>
      </div>

      {/* SEARCH RESULT DISPLAY */}
      {searchedResult && (
        <div className="bg-green-50 p-4 border rounded-xl mb-8">
          <h2 className="text-xl font-bold">Result Found</h2>
          <p>
            <strong>Student:</strong> {searchedResult.userId?.name}
          </p>
          <p>
            <strong>Course:</strong> {searchedResult.courseId?.name}
          </p>
          <p>
            <strong>Roll:</strong> {searchedResult.rollNumber}
          </p>
          <p>
            <strong>Semester:</strong> {searchedResult.semester}
          </p>

          {searchedResult.marks?.map((m, i) => (
            <p key={i}>
              {m.subject}: {m.obtained} / {m.maxMarks}
            </p>
          ))}

          <p className="mt-2 font-bold text-indigo-700">
            Percentage: {calculatePercentage(searchedResult.marks)}%
          </p>
        </div>
      )}

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow-xl rounded-2xl">
        <div>
          <label className="font-semibold">Select Course *</label>
          <select
            className="w-full p-3 border rounded-lg mt-1"
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

        <div>
          <label className="font-semibold">Select Semester *</label>
          <select
            className="w-full p-3 border rounded-lg mt-1"
            value={selectedSemester}
            onChange={(e) => handleSemesterSelect(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">Select Semester</option>
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

        <div>
          <label className="font-semibold">Student *</label>
          <select
            className="w-full p-3 border rounded-lg mt-1"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select Student</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Roll Number *</label>
          <input
            className="w-full p-3 border rounded-lg mt-1"
            placeholder="Enter Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />
        </div>
      </div>

      {/* MARKS */}
      {subjects.length > 0 && (
        <div className="bg-white p-6 shadow-xl rounded-2xl mt-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">
            Enter Marks
          </h2>

          {subjects.map((sub) => (
            <div key={sub.name} className="flex items-center gap-4 mb-4">
              <p className="w-1/2 font-semibold">{sub.name}</p>
              <input
                type="number"
                className="w-1/4 p-2 border rounded-lg"
                onChange={(e) => handleMarksChange(sub.name, e.target.value)}
              />
              <p>/ 100</p>
            </div>
          ))}

          <button
            className="bg-indigo-600 text-white px-10 py-2 rounded-full font-bold mt-6"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Marks"}
          </button>
        </div>
      )}

      {/* RESULTS TABLE */}
      <h2 className="text-3xl font-bold mt-12 mb-4">All Students Results</h2>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Student</th>
            <th className="p-2">Roll</th>
            <th className="p-2">Course</th>
            <th className="p-2">Semester</th>
            <th className="p-2">Percentage</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-2">{r.userId?.name}</td>
              <td className="p-2">{r.rollNumber}</td>
              <td className="p-2">{r.courseId?.name}</td>
              <td className="p-2">{r.semester}</td>
              <td className="p-2">{calculatePercentage(r.marks)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}