"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

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

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [taskAssignments, setTaskAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();

  const generateCalendarData = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDay(currentYear, currentMonth);

    const calendarData = [];
    let week = [];

    for (let i = 0; i < firstDay; i++) {
      week.push("");
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);

      if (week.length === 7) {
        calendarData.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push("");
      }
      calendarData.push(week);
    }

    return calendarData;
  };

  const fetchCalendarData = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/tasks/projects`,
        {
          withCredentials: true,
        }
      );

      setTaskAssignments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setTaskAssignments([]);
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  const getTasksForDate = (year, month, day) => {
    const targetDate = new Date(Date.UTC(year, month, day));
    const dateString = formatDate(targetDate);

    const assignTasks = taskAssignments.filter((task) => {
      if (!task.assignDate) return false;
      const taskDate = new Date(task.assignDate);
      return formatDate(taskDate) === dateString;
    });

    const deadlineTasks = taskAssignments.filter((task) => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return formatDate(taskDate) === dateString;
    });

    return { assignTasks, deadlineTasks };
  };

  const handleDateClick = (year, month, day) => {
    if (!day) return;

    const displayDate = new Date(Date.UTC(year, month, day));
    const dateString = displayDate.toLocaleDateString();

    const { assignTasks, deadlineTasks } = getTasksForDate(year, month, day);

    if (assignTasks.length > 0) {
      setSelectedDateInfo({
        date: dateString,
        assignTasks,
        deadlineTasks: [],
        type: "start",
      });
      setShowModal(true);
    } else if (deadlineTasks.length > 0) {
      setSelectedDateInfo({
        date: dateString,
        assignTasks: [],
        deadlineTasks,
        type: "deadline",
      });
      setShowModal(true);
    }
  };

  const getDateStyling = (day, weekIndex, dayIndex) => {
    if (!day) return "";

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

    let baseClasses =
      "h-16 w-16 flex items-center justify-center rounded-lg text-sm shadow-md relative transition-all cursor-pointer hover:scale-105 ";

    if (isToday) {
      return baseClasses + "bg-black text-white shadow-lg";
    }

    if (assignTasks.length > 0) {
      return baseClasses + "bg-blue-500 text-white shadow-lg";
    }

    if (deadlineTasks.length > 0) {
      return baseClasses + "bg-red-500 text-white shadow-lg";
    }

    if (isSunday) {
      return baseClasses + "bg-[#67B2CF] text-white";
    }

    return baseClasses + "bg-[#ECEEFD] text-gray-800";
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth, currentYear]);

  const calendarData = generateCalendarData();

  return (
    <div className="max-w-xl rounded-lg overflow-hidden w-full shadow-[0px_3px_4px_rgba(0,0,0,0.4)]">
      {isLoading && (
        <div className="text-center py-2 bg-white">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-white">
        <h2 className="text-lg font-bold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <hr />

      <div className="flex justify-center gap-4 py-2 text-xs bg-gray-50">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Deadline</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-black rounded"></div>
          <span>Today</span>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-semibold p-2 bg-gray-50">
        {daysOfWeek.map((day, index) => (
          <div key={`day-header-${index}`} className="text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center p-2 gap-y-2 bg-white">
        {calendarData.flat().map((date, idx) => {
          const weekIndex = Math.floor(idx / 7);
          const dayIndex = idx % 7;

          if (date === "") {
            return <div key={`empty-${idx}`}></div>;
          }

          return (
            <div
              key={`date-${currentYear}-${currentMonth}-${date}-${idx}`}
              className={getDateStyling(date, weekIndex, dayIndex)}
              onClick={() => handleDateClick(currentYear, currentMonth, date)}
            >
              {date}
            </div>
          );
        })}
      </div>

      {showModal && selectedDateInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDateInfo.type === "start"
                  ? "Projects Starting"
                  : "Projects Ending"}{" "}
                on {selectedDateInfo.date}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {selectedDateInfo.assignTasks.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-600 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  Project Start Date
                </h4>
                <div className="space-y-3">
                  {selectedDateInfo.assignTasks.map((task) => (
                    <div
                      key={`assign-${task._id}`}
                      className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="font-semibold text-blue-800 text-lg">
                        {task.bucketName || "Unnamed Project"}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {task.assignDate && (
                          <div>
                            <span className="font-medium">Started:</span>{" "}
                            {new Date(task.assignDate).toLocaleDateString()}
                          </div>
                        )}
                        {task.deadline && (
                          <div>
                            <span className="font-medium">Deadline:</span>{" "}
                            {new Date(task.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDateInfo.deadlineTasks.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  Project Deadline
                </h4>
                <div className="space-y-3">
                  {selectedDateInfo.deadlineTasks.map((task) => (
                    <div
                      key={`deadline-${task._id}`}
                      className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500"
                    >
                      <div className="font-semibold text-red-800 text-lg">
                        {task.bucketName || "Unnamed Project"}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {task.assignDate && (
                          <div>
                            <span className="font-medium">Started:</span>{" "}
                            {new Date(task.assignDate).toLocaleDateString()}
                          </div>
                        )}
                        {task.deadline && (
                          <div>
                            <span className="font-medium">Deadline:</span>{" "}
                            {new Date(task.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
