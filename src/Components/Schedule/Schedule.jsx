
"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen, Sparkles } from "lucide-react";
import axios from "axios";

export default function Schedule() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [timetables, setTimetables] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("15:00");
  const [slotDuration, setSlotDuration] = useState("45"); // in minutes

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/course");
        setCourses(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch timetables on page load
  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/schedule");
        const formatted = {};
        res.data.forEach((t) => {
          formatted[`${t.courseId._id}_${t.semester}`] = {
            timetable: t.timetable,
            subjects: t.subjects,
          };
        });
        setTimetables(formatted);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTimetables();
  }, []);

  // Update subjects when course or semester changes
  useEffect(() => {
    if (selectedCourse && selectedSemester) {
      const course = courses.find((c) => c._id === selectedCourse);
      const sem = course?.semesters.find(
        (s) => s.semester.toString() === selectedSemester
      );
      setSubjects(sem?.subjects || []);
    }
  }, [selectedCourse, selectedSemester, courses]);

  // Generate time slots
  const generateSlots = () => {
    const slots = [];
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    let current = new Date();
    current.setHours(startH, startM, 0, 0);
    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    while (current < end) {
      const hours = current.getHours().toString().padStart(2, "0");
      const minutes = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + Number(slotDuration));
    }

    return slots;
  };

  // Generate timetable and save to backend
  const generateTimetable = async () => {
    if (subjects.length === 0) {
      alert("Please select course & semester");
      return;
    }

    setIsGenerating(true);
    setTimeout(async () => {
      const slots = generateSlots();
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

      // Save to backend
      try {
        const payload = {
          courseId: selectedCourse,
          semester: selectedSemester,
          startTime,
          endTime,
          slotDuration: Number(slotDuration),
          subjects: subjects.map((s) => ({ name: s.name })),
          timetable: newTimetable,
        };
        await axios.post("http://localhost:5000/api/schedule", payload);

        const key = `${selectedCourse}_${selectedSemester}`;
        setTimetables((prev) => ({
          ...prev,
          [key]: { timetable: newTimetable, subjects: [...subjects] },
        }));
      } catch (error) {
        console.log(error);
        alert("Failed to save timetable");
      }

      setIsGenerating(false);
    }, 800);
  };

  const getSubjectColor = (subjectName, timetableSubjects) => {
    if (subjectName === "--") return "bg-gray-100 text-gray-400";
    const index = timetableSubjects.findIndex((s) => s.name === subjectName);
    return (
      subjectColors[index % subjectColors.length] + " text-white shadow-md"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Automatic Timetable Generator
        </h1>

        {/* Controls */}
        <div className="bg-white shadow-md rounded-xl p-6 grid md:grid-cols-6 gap-4 items-end">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Choose course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 flex items-center gap-1">
              <Clock className="w-4 h-4 text-purple-600" />
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedCourse}
              className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
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

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Duration (mins)
            </label>
            <input
              type="number"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <button
            onClick={generateTimetable}
            disabled={isGenerating}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Timetable"}
          </button>
        </div>

        {/* Timetable Display */}
        {Object.keys(timetables).length > 0 ? (
          Object.keys(timetables).map((key) => {
            const [courseId, semester] = key.split("_");
            const courseName = courses.find((c) => c._id === courseId)?.name;
            const { timetable, subjects: timetableSubjects } = timetables[key];
            const slots = generateSlots();
            return (
              <div
                key={key}
                className="bg-white rounded-xl shadow-md mt-8 overflow-x-auto"
              >
                <h2 className="text-xl font-bold text-gray-800 p-4 border-b">
                  Timetable for {courseName} - Semester {semester}
                </h2>
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 font-medium">Day</th>
                      {slots.map((slot) => (
                        <th key={slot} className="px-4 py-2 font-medium">
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50">
                          {row.day}
                        </td>
                        {slots.map((slot) => (
                          <td key={slot} className="px-2 py-2">
                            <div
                              className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${getSubjectColor(
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
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No timetable generated yet.
          </div>
        )}
      </div>
    </div>
  );
}
