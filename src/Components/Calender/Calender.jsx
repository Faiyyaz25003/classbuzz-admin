

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Plus, RotateCcw, X } from "lucide-react";
import TaskForm from "./TaskForm";
import EventForm from "./EventForm";
import MeetingForm from "./MeetingForm";

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

const formatDate = (date) => date.toISOString().split("T")[0];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Task");
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  // Dynamic Data States
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();

  // Fetch all data from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [taskRes, eventRes, meetingRes] = await Promise.all([
          axios.get("http://localhost:5000/api/tasks"),
          axios.get("http://localhost:5000/api/events"),
          axios.get("http://localhost:5000/api/meetings"),
        ]);
        setTasks(taskRes.data);
        setEvents(eventRes.data);
        setMeetings(meetingRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [taskRes, eventRes, meetingRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks"),
        axios.get("http://localhost:5000/api/events"),
        axios.get("http://localhost:5000/api/meetings"),
      ]);
      setTasks(taskRes.data);
      setEvents(eventRes.data);
      setMeetings(meetingRes.data);
    } catch (err) {
      console.error("Error refreshing:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate calendar days
  const generateCalendarData = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDay(currentYear, currentMonth);
    const data = [];
    let week = [];
    for (let i = 0; i < firstDay; i++) week.push("");
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        data.push(week);
        week = [];
      }
    }
    if (week.length) {
      while (week.length < 7) week.push("");
      data.push(week);
    }
    return data;
  };

  // Filter items by date
  const getItemsForDate = (year, month, day) => {
    const dateString = formatDate(new Date(Date.UTC(year, month, day)));
    const taskItems = tasks.filter(
      (t) => formatDate(new Date(t.date)) === dateString
    );
    const eventItems = events.filter(
      (e) => formatDate(new Date(e.date)) === dateString
    );
    const meetingItems = meetings.filter(
      (m) => formatDate(new Date(m.date)) === dateString
    );
    return { taskItems, eventItems, meetingItems };
  };

  // On date click
  const handleDateClick = (year, month, day) => {
    if (!day) return;
    const dateLabel = new Date(year, month, day).toDateString();
    const { taskItems, eventItems, meetingItems } = getItemsForDate(
      year,
      month,
      day
    );
    if (taskItems.length || eventItems.length || meetingItems.length) {
      setSelectedDateInfo({
        date: dateLabel,
        taskItems,
        eventItems,
        meetingItems,
      });
      setShowDetailModal(true);
    }
  };

  // Dynamic day styling
  const getDateStyling = (day) => {
    if (!day) return "border border-gray-100 h-20 bg-gray-50";
    const { taskItems, eventItems, meetingItems } = getItemsForDate(
      currentYear,
      currentMonth,
      day
    );
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    let base =
      "relative border border-gray-200 rounded-lg p-2 text-sm cursor-pointer transition-all hover:shadow-lg hover:scale-105 h-20 flex items-start justify-start";

    if (isToday)
      return (
        base + " bg-blue-100 border-blue-400 ring-2 ring-blue-400 font-semibold"
      );
    if (taskItems.length && eventItems.length && meetingItems.length)
      return base + " bg-purple-500 text-white font-medium";
    if (taskItems.length) return base + " bg-blue-500 text-white font-medium";
    if (eventItems.length) return base + " bg-green-500 text-white font-medium";
    if (meetingItems.length)
      return base + " bg-yellow-500 text-white font-medium";
    return base + " bg-white hover:bg-gray-50";
  };

  const calendarData = generateCalendarData();

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Company <span className="text-blue-600">Calendar</span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefresh}
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

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() =>
                setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-gray-600 font-semibold border-b pb-3 mb-3">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {calendarData.flat().map((date, idx) => (
              <div
                key={idx}
                onClick={() => handleDateClick(currentYear, currentMonth, date)}
                className={getDateStyling(date)}
              >
                {date}
              </div>
            ))}
          </div>
        )}
      </div>

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

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {activeTab === "Task" && (
                <TaskForm onClose={() => setShowCreateModal(false)} />
              )}
              {activeTab === "Event" && (
                <EventForm onClose={() => setShowCreateModal(false)} />
              )}
              {activeTab === "Meeting" && (
                <MeetingForm onClose={() => setShowCreateModal(false)} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedDateInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedDateInfo.date}</h2>
                <p className="text-blue-100 text-sm">
                  {selectedDateInfo.taskItems.length +
                    selectedDateInfo.eventItems.length +
                    selectedDateInfo.meetingItems.length}{" "}
                  item(s) scheduled
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              {/* Tasks */}
              {selectedDateInfo.taskItems.map((t) => (
                <div
                  key={t._id}
                  className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded space-y-1"
                >
                  <h4 className="font-semibold">{t.title}</h4>
                  <p>
                    <strong>Date:</strong> {t.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {t.time}
                  </p>
                  <p>
                    <strong>Category:</strong> {t.category}
                  </p>
                  <p>
                    <strong>Participants:</strong> {t.participants}
                  </p>
                  <p>
                    <strong>Description:</strong> {t.description}
                  </p>
                </div>
              ))}

              {/* Events */}
              {selectedDateInfo.eventItems.map((e) => (
                <div
                  key={e._id}
                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded space-y-1"
                >
                  <h4 className="font-semibold">{e.title}</h4>
                  <p>
                    <strong>Date:</strong> {e.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {e.time}
                  </p>
                  <p>
                    <strong>Category:</strong> {e.category}
                  </p>
                  <p>
                    <strong>Participants:</strong> {e.participants}
                  </p>
                  <p>
                    <strong>Description:</strong> {e.description}
                  </p>
                </div>
              ))}

              {/* Meetings */}
              {selectedDateInfo.meetingItems.map((m) => (
                <div
                  key={m._id}
                  className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded space-y-1"
                >
                  <h4 className="font-semibold">{m.title}</h4>
                  <p>
                    <strong>Date:</strong> {m.date}
                  </p>
                  <p>
                    <strong>Participants:</strong> {m.participants}
                  </p>
                  <p>
                    <strong>Description:</strong> {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
