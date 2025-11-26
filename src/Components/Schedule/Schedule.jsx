"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, BookOpen, Sparkles } from "lucide-react";

export default function Schedule() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [timetables, setTimetables] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["10AM", "11AM", "12PM", "2PM", "3PM"];

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

  // Load LocalStorage
  useEffect(() => {
    const savedCourse = localStorage.getItem("selectedCourse");
    const savedSemester = localStorage.getItem("selectedSemester");
    const savedTimetables = localStorage.getItem("timetables");

    if (savedCourse) setSelectedCourse(savedCourse);
    if (savedSemester) setSelectedSemester(savedSemester);
    if (savedTimetables) setTimetables(JSON.parse(savedTimetables));
  }, []);

  // Save LocalStorage when state updates
  useEffect(() => {
    localStorage.setItem("selectedCourse", selectedCourse);
    localStorage.setItem("selectedSemester", selectedSemester);
    localStorage.setItem("timetables", JSON.stringify(timetables));
  }, [selectedCourse, selectedSemester, timetables]);

  // Load courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/course")
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // GET ALL timetables automatically display all
  const fetchAllTimetables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/schedule");

      const fetched = {};
      res.data.forEach((item) => {
        const key = `${item.courseId._id}_${item.semester}`;
        fetched[key] = {
          timetable: item.timetable,
          subjects: item.subjects,
        };
      });

      setTimetables(fetched);
    } catch (err) {
      console.log("No schedules found yet");
    }
  };

  useEffect(() => {
    fetchAllTimetables();
  }, []);

  // Fetch when user selects course or semester
  const fetchExistingTimetable = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/schedule/${selectedCourse}/${selectedSemester}`
      );

      const key = `${selectedCourse}_${selectedSemester}`;
      setTimetables((prev) => ({
        ...prev,
        [key]: { timetable: res.data.timetable, subjects: res.data.subjects },
      }));
    } catch (err) {
      console.log("No schedule found for selected");
    }
  };

  // Load subjects based on course + semester
  useEffect(() => {
    if (selectedCourse && selectedSemester) {
      const course = courses.find((c) => c._id === selectedCourse);
      const sem = course?.semesters.find(
        (s) => s.semester.toString() === selectedSemester
      );
      setSubjects(sem?.subjects || []);
      fetchExistingTimetable();
    }
  }, [selectedCourse, selectedSemester]);

  // GENERATE timetable
  const generateTimetable = () => {
    if (!selectedCourse || !selectedSemester) {
      alert("Select course & semester first");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const newTimetable = [];

      for (let i = 0; i < days.length; i++) {
        const row = { day: days[i] };
        for (let j = 0; j < slots.length; j++) {
          const index = Math.floor(Math.random() * subjects.length);
          row[slots[j]] = subjects[index]?.name || "--";
        }
        newTimetable.push(row);
      }

      const key = `${selectedCourse}_${selectedSemester}`;
      setTimetables((prev) => ({
        ...prev,
        [key]: { timetable: newTimetable, subjects: [...subjects] },
      }));

      saveTimetableAPI(newTimetable);
      setIsGenerating(false);
    }, 800);
  };

  const saveTimetableAPI = async (generatedTable) => {
    try {
      const res = await axios.post("http://localhost:5000/api/schedule", {
        courseId: selectedCourse,
        semester: selectedSemester,
        timetable: generatedTable,
        subjects,
      });

      alert(res.data.message);
    } catch (error) {
      alert("Error saving timetable");
      console.log(error);
    }
  };

  const getSubjectColor = (subjectName, tableSubject) => {
    if (subjectName === "--") return "bg-gray-200 text-gray-500";
    const i = tableSubject.findIndex((s) => s.name === subjectName);
    return subjectColors[i % subjectColors.length] + " text-white shadow";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Automatic Timetable Generator
          </h1>
        </div>

        {/* FILTER CONTROLS */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-semibold text-gray-700 flex items-center mb-2">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
              >
                <option value="">Choose Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-purple-600" />
                Select Semester
              </label>
              <select
                disabled={!selectedCourse}
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
              >
                <option value="">Choose Semester</option>
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

            <button
              onClick={generateTimetable}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                "Generating..."
              ) : (
                <>
                  <Sparkles /> Generate Timetable
                </>
              )}
            </button>
          </div>
        </div>

        {/* DISPLAY ALL TIMETABLES */}
        {Object.keys(timetables).map((key) => {
          const [courseId, semester] = key.split("_");
          const courseName = courses.find((c) => c._id === courseId)?.name;
          const { timetable, subjects: tsubs } = timetables[key];

          return (
            <div key={key} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Timetable for{" "}
                <span className="text-indigo-600">{courseName}</span>
              </h2>
              <p className="text-gray-600">Semester {semester}</p>

              <div className="overflow-x-auto mt-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-gray-900 text-white px-6 py-4">Day</th>
                      {slots.map((slot) => (
                        <th
                          key={slot}
                          className="bg-gray-900 text-white px-6 py-4"
                        >
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="font-bold bg-gray-100 px-6 py-4">
                          {row.day}
                        </td>
                        {slots.map((slot) => (
                          <td key={slot} className="text-center px-3 py-3">
                            <div
                              className={`px-4 py-3 rounded-lg font-semibold ${getSubjectColor(
                                row[slot],
                                tsubs
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
        })}
      </div>
    </div>
  );
}
