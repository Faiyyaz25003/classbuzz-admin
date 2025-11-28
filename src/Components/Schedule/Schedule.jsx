"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen, Sparkles, Zap } from "lucide-react";

export default function Schedule() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [timetables, setTimetables] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("15:00");
  const [slotDuration, setSlotDuration] = useState("45");

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

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/schedule");
        const data = await res.json();
        const formatted = {};
        data.forEach((t) => {
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

  useEffect(() => {
    if (selectedCourse && selectedSemester) {
      const course = courses.find((c) => c._id === selectedCourse);
      const sem = course?.semesters.find(
        (s) => s.semester.toString() === selectedSemester
      );
      setSubjects(sem?.subjects || []);
    }
  }, [selectedCourse, selectedSemester, courses]);

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
        await fetch("http://localhost:5000/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
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
    if (subjectName === "--") return "bg-gray-50 text-gray-400 border-gray-200";
    const index = timetableSubjects.findIndex((s) => s.name === subjectName);
    return (
      subjectColors[index % subjectColors.length] + " text-white shadow-sm"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" text-left mb-8">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Schedule
            </h1>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              >
                <option value="">Choose course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedCourse}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (min)
              </label>
              <input
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateTimetable}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        {/* Timetables Display */}
        {Object.keys(timetables).length > 0 ? (
          <div className="space-y-8">
            {Object.keys(timetables).map((key) => {
              const [courseId, semester] = key.split("_");
              const courseName = courses.find((c) => c._id === courseId)?.name;
              const { timetable, subjects: timetableSubjects } =
                timetables[key];
              const slots = generateSlots();

              return (
                <div
                  key={key}
                  className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                >
                  {/* Timetable Header */}
                  <div className="mb-6 pb-4 border-b-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      {courseName} - Semester {semester}
                    </h2>
                  </div>

                  {/* Timetable Grid */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="bg-gradient-to-br from-gray-700 to-gray-800 text-white px-4 py-4 text-left font-bold rounded-tl-xl border-r-2 border-gray-600">
                            Day
                          </th>
                          {slots.map((slot, idx) => (
                            <th
                              key={slot}
                              className={`bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4 py-4 text-center font-semibold border-r-2 border-indigo-500 ${
                                idx === slots.length - 1 ? "rounded-tr-xl" : ""
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4" />
                                {slot}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.map((row, rowIdx) => (
                          <tr
                            key={rowIdx}
                            className="border-t-2 border-gray-200"
                          >
                            <td className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-4 font-bold text-gray-800 border-r-2 border-gray-300">
                              {row.day}
                            </td>
                            {slots.map((slot, colIdx) => (
                              <td
                                key={slot}
                                className="border-r-2 border-gray-200 p-2"
                              >
                                <div
                                  className={`${getSubjectColor(
                                    row[slot],
                                    timetableSubjects
                                  )} px-4 py-3 rounded-lg text-center font-medium text-sm transition-all hover:scale-105 border-2 ${
                                    row[slot] === "--"
                                      ? "border-gray-200"
                                      : "border-white border-opacity-30"
                                  }`}
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
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-indigo-600" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No timetable generated yet. Configure your schedule and click
              Generate!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
