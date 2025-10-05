"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, RotateCcw } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [taskAssignments, setTaskAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Task");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();

  const generateCalendarData = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDay(currentYear, currentMonth);
    const calendarData = [];
    let week = [];

    for (let i = 0; i < firstDay; i++) week.push("");
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendarData.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push("");
      calendarData.push(week);
    }
    return calendarData;
  };

  const fetchCalendarData = (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    const demoData = [
      {
        _id: "1",
        bucketName: "Website Redesign",
        assignDate: new Date(2025, 9, 15).toISOString(),
        deadline: new Date(2025, 9, 25).toISOString(),
      },
      {
        _id: "2",
        bucketName: "Mobile App Development",
        assignDate: new Date(2025, 9, 8).toISOString(),
        deadline: new Date(2025, 9, 30).toISOString(),
      },
    ];
    setTaskAssignments(demoData);
    if (showLoader) setIsLoading(false);
  };

  const getTasksForDate = (year, month, day) => {
    const dateString = formatDate(new Date(Date.UTC(year, month, day)));
    const assignTasks = taskAssignments.filter((t) => {
      if (!t.assignDate) return false;
      return formatDate(new Date(t.assignDate)) === dateString;
    });
    const deadlineTasks = taskAssignments.filter((t) => {
      if (!t.deadline) return false;
      return formatDate(new Date(t.deadline)) === dateString;
    });
    return { assignTasks, deadlineTasks };
  };

  const handleDateClick = (year, month, day) => {
    if (!day) return;
    const dateString = new Date(
      Date.UTC(year, month, day)
    ).toLocaleDateString();
    const { assignTasks, deadlineTasks } = getTasksForDate(year, month, day);
    if (assignTasks.length || deadlineTasks.length) {
      setSelectedDateInfo({ date: dateString, assignTasks, deadlineTasks });
      setShowModal(true);
    }
  };

  const getDateStyling = (day, dayIndex) => {
    if (!day) return "border border-gray-100 h-20 bg-gray-50";
    const { assignTasks, deadlineTasks } = getTasksForDate(
      currentYear,
      currentMonth,
      day
    );
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
    const isSunday = dayIndex === 0;

    let base =
      "relative border border-gray-200 rounded-lg p-2 text-sm cursor-pointer transition-all hover:shadow-lg hover:scale-105 h-20 flex items-start justify-start";

    if (isToday)
      return (
        base + " bg-blue-100 border-blue-400 font-semibold ring-2 ring-blue-400"
      );
    if (assignTasks.length) return base + " bg-blue-500 text-white font-medium";
    if (deadlineTasks.length)
      return base + " bg-red-500 text-white font-medium";
    if (isSunday) return base + " text-red-500 bg-red-50";
    return base + " bg-white hover:bg-gray-50";
  };

  const goToPreviousMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const goToNextMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth, currentYear]);

  const calendarData = generateCalendarData();

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Company <span className="text-blue-600">Calendar</span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Month</option>
            <option>Week</option>
            <option>Day</option>
          </select>
          <button
            onClick={fetchCalendarData}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            title="Refresh"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 text-base">
          Categories
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Daily Task</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Reminder</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Deadline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Leaves</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Other</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition border border-gray-200"
              title="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition border border-gray-200"
              title="Next Month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-gray-600 font-semibold border-b pb-3 mb-3">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-sm">
              {day}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {calendarData.flat().map((date, idx) => {
              const dayIndex = idx % 7;
              return (
                <div
                  key={idx}
                  onClick={() =>
                    handleDateClick(currentYear, currentMonth, date)
                  }
                  className={getDateStyling(date, dayIndex)}
                >
                  {date}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Events Detail Modal */}
      {showModal && selectedDateInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Events on {selectedDateInfo.date}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition"
              >
                ×
              </button>
            </div>

            {selectedDateInfo.assignTasks.length > 0 && (
              <div className="mb-5">
                <h4 className="text-blue-600 font-semibold mb-3 text-base">
                  Starting Projects
                </h4>
                {selectedDateInfo.assignTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-3 text-left shadow-sm"
                  >
                    <p className="font-semibold text-blue-700 mb-2">
                      {task.bucketName || "Untitled Project"}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Started:</span>{" "}
                      {task.assignDate
                        ? new Date(task.assignDate).toLocaleDateString()
                        : "—"}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Deadline:</span>{" "}
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedDateInfo.deadlineTasks.length > 0 && (
              <div>
                <h4 className="text-red-600 font-semibold mb-3 text-base">
                  Project Deadlines
                </h4>
                {selectedDateInfo.deadlineTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-3 text-left shadow-sm"
                  >
                    <p className="font-semibold text-red-700 mb-2">
                      {task.bucketName || "Untitled Project"}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Started:</span>{" "}
                      {task.assignDate
                        ? new Date(task.assignDate).toLocaleDateString()
                        : "—"}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Deadline:</span>{" "}
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {["Task", "Event", "Meeting"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-center font-medium transition ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Task Form */}
              {activeTab === "Task" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Add Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <span className="text-blue-600">📅</span>
                    <input
                      type="date"
                      defaultValue="2025-10-05"
                      className="flex-1 outline-none text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants (Optional):
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                      <option>Select participants</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time:
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                      <option>Select time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description:
                    </label>
                    <textarea
                      placeholder="Add Description"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    ></textarea>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Create Task
                    </button>
                  </div>
                </div>
              )}

              {/* Event Form */}
              {activeTab === "Event" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Add Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <span className="text-blue-600">📅</span>
                    <input
                      type="date"
                      defaultValue="2025-10-05"
                      className="flex-1 outline-none text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants (Optional):
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                      <option>Select participants</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category:
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                      <option>🔵 Daily Task</option>
                      <option>🔴 Meeting</option>
                      <option>🟢 Reminder</option>
                      <option>🟣 Deadline</option>
                      <option>🟡 Leaves</option>
                      <option>🟠 Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time:
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                      <option>Select time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description:
                    </label>
                    <textarea
                      placeholder="Add Description"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remind Before:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue="15"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      />
                      <span className="text-gray-600">minutes</span>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Create Event
                    </button>
                  </div>
                </div>
              )}

              {/* Meeting Form */}
              {activeTab === "Meeting" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Add Title, e.g., Project Stand-up Meeting"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <span className="text-blue-600">📅</span>
                    <input
                      type="date"
                      defaultValue="2025-10-05"
                      className="flex-1 outline-none text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants (Required):
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                      <option>Select participants</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                        <option>Start</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                        <option>End</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description:
                    </label>
                    <textarea
                      placeholder="Meeting Description"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    ></textarea>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      Schedule Meeting
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
