"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen, Sparkles } from "lucide-react";

export default function Schedule() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [timetables, setTimetables] = useState({}); // Store multiple timetables
  const [isGenerating, setIsGenerating] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["10AM", "11AM", "12PM", "2PM", "3PM"];

  // Color palette for subjects
  const subjectColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-violet-500 to-violet-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
    "bg-gradient-to-br from-emerald-500 to-emerald-600",
  ];

  // 🔥 FETCH COURSES FROM API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/course");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourses();
  }, []);

  // 🎯 When Course & Semester changes, pick subjects
  useEffect(() => {
    if (selectedCourse && selectedSemester) {
      const course = courses.find((c) => c._id === selectedCourse);
      const sem = course?.semesters.find(
        (s) => s.semester.toString() === selectedSemester
      );
      setSubjects(sem?.subjects || []);
    }
  }, [selectedCourse, selectedSemester, courses]);

  // 🪄 AUTO TIMETABLE GENERATOR
  const generateTimetable = () => {
    if (subjects.length === 0) {
      alert("Please select course & semester");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
      const newTimetable = [];
      let index = 0;

      for (let i = 0; i < days.length; i++) {
        const row = {};
        row.day = days[i];
        for (let j = 0; j < slots.length; j++) {
          row[slots[j]] = shuffledSubjects[index]?.name || "--";
          index = (index + 1) % shuffledSubjects.length;
        }
        newTimetable.push(row);
      }

      // Key by course + semester to store multiple timetables
      const key = `${selectedCourse}_${selectedSemester}`;
      setTimetables((prev) => ({
        ...prev,
        [key]: { timetable: newTimetable, subjects: [...subjects] },
      }));
      setIsGenerating(false);
    }, 800);
  };

  // Get color for subject
  const getSubjectColor = (subjectName, timetableSubjects) => {
    if (subjectName === "--") return "bg-gray-100 text-gray-400";
    const index = timetableSubjects.findIndex((s) => s.name === subjectName);
    return (
      subjectColors[index % subjectColors.length] + " text-white shadow-md"
    );
  };

  return (
    <div className="ml-[300px] mt-[50px] min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Automatic Timetable Generator
          </h1>
          <p className="text-gray-600">
            Create your perfect schedule in seconds
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-6">
            {/* SELECT COURSE */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                Select Course
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-gray-50 hover:bg-white"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Choose a course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECT SEMESTER */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-purple-600" />
                Select Semester
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-gray-50 hover:bg-white"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedCourse}
              >
                <option value="">Choose semester</option>
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

            {/* GENERATE BUTTON */}
            <div className="flex items-end">
              <button
                onClick={generateTimetable}
                disabled={isGenerating}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Timetable
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* DISPLAY ALL TIMETABLES */}
        {Object.keys(timetables).length > 0 ? (
          Object.keys(timetables).map((key) => {
            const [courseId, semester] = key.split("_");
            const courseName = courses.find((c) => c._id === courseId)?.name;
            const { timetable, subjects: timetableSubjects } = timetables[key];
            return (
              <div
                key={key}
                className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Timetable for{" "}
                    <span className="text-indigo-600">{courseName}</span>
                  </h2>
                  <p className="text-gray-600">Semester {semester}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-6 py-4 text-left font-semibold rounded-tl-xl">
                          Day
                        </th>
                        {slots.map((slot) => (
                          <th
                            key={slot}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-6 py-4 text-center font-semibold last:rounded-tr-xl"
                          >
                            {slot}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-gray-700 bg-gray-50">
                            {row.day}
                          </td>
                          {slots.map((slot) => (
                            <td key={slot} className="px-3 py-3 text-center">
                              <div
                                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all hover:scale-105 ${getSubjectColor(
                                  row[slot],
                                  timetableSubjects
                                )}`}
                              >
                                {row[slot]}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
              <Calendar className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Timetable Yet
            </h3>
            <p className="text-gray-600">
              Select a course and semester, then click generate to create your
              timetable
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
