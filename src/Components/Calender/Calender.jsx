

"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Tag,
  FileText,
  X,
  ChevronDown,
} from "lucide-react";

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

// Toast Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top`}
    >
      {message}
    </div>
  );
}

// ParticipantSelector Component
function ParticipantSelector({ selectedParticipants, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUser = (user) => {
    const userId = user.id || user._id;
    const isSelected = selectedParticipants.some(
      (p) => (p.id || p._id) === userId
    );
    if (isSelected) {
      onChange(selectedParticipants.filter((p) => (p.id || p._id) !== userId));
    } else {
      onChange([...selectedParticipants, user]);
    }
  };

  const removeParticipant = (user) => {
    const userId = user.id || user._id;
    onChange(selectedParticipants.filter((p) => (p.id || p._id) !== userId));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Participants:
      </label>

      {selectedParticipants.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedParticipants.map((participant, index) => {
            const participantId =
              participant.id || participant._id || `participant-${index}`;
            return (
              <div
                key={participantId}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{participant.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeParticipant(participant);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 flex items-center justify-between bg-white"
      >
        <span className="text-gray-500">
          {selectedParticipants.length === 0
            ? "Select participants..."
            : `${selectedParticipants.length} selected`}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="overflow-y-auto max-h-48">
            {isLoadingUsers ? (
              <div className="px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500 mt-2">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm text-center">
                {users.length === 0 ? "No users available" : "No users found"}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedParticipants.some(
                  (p) => p.id === user.id || p._id === user._id
                );
                const userId = user.id || user._id;
                return (
                  <div
                    key={userId}
                    onClick={() => toggleUser(user)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {user.name}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// TaskForm Component
function TaskForm({ onClose, onSuccess, editData = null, showToast }) {
  const [formData, setFormData] = useState({
    title: editData?.title || "",
    date: editData?.date || "2025-10-05",
    time: editData?.time || "",
    description: editData?.description || "",
  });
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    if (editData?.participants) {
      const participantsArray =
        typeof editData.participants === "string"
          ? editData.participants
              .split(",")
              .map((name) => ({ name: name.trim() }))
          : editData.participants;
      setSelectedParticipants(participantsArray);
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  try {
    // Convert selected participants to an array of emails
    const participantsEmails = selectedParticipants.map((p) => p.email);

    const dataToSend = { ...formData, participants: participantsEmails };

    if (editData) {
      const taskId = editData._id || editData.id;
      if (!taskId) throw new Error("Task ID is missing");

      console.log("Updating task with ID:", taskId);
      console.log("Data to send:", dataToSend);

      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, dataToSend);
      showToast("✅ Task updated successfully!", "success");
    } else {
      console.log("Creating new task:", dataToSend);
      await axios.post("http://localhost:5000/api/tasks", dataToSend);
      showToast("✅ Task created successfully!", "success");
    }

    onSuccess();
    onClose();
  } catch (error) {
    console.error("Error saving task:", error);
    console.error("Error response:", error.response?.data);
    showToast(
      `❌ Failed to ${editData ? "update" : "create"} task. ${
        error.response?.data?.message || error.message
      }`,
      "error"
    );
  }
};


  return (
    <div className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Add Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      />

      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
        <span className="text-blue-600">📅</span>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="flex-1 outline-none text-gray-700"
        />
      </div>

      <ParticipantSelector
        selectedParticipants={selectedParticipants}
        onChange={setSelectedParticipants}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time:
        </label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description:
        </label>
        <textarea
          name="description"
          placeholder="Add Description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        ></textarea>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {editData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </div>
  );
}

// EventForm Component
function EventForm({ onClose, onSuccess, editData = null, showToast }) {
  const [formData, setFormData] = useState({
    title: editData?.title || "",
    date: editData?.date || "2025-10-05",
    category: editData?.category || "",
    time: editData?.time || "",
    description: editData?.description || "",
    remindBefore: editData?.remindBefore || 15,
  });
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    if (editData?.participants) {
      const participantsArray =
        typeof editData.participants === "string"
          ? editData.participants
              .split(",")
              .map((name) => ({ name: name.trim() }))
          : editData.participants;
      setSelectedParticipants(participantsArray);
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const participantsString = selectedParticipants
        .map((p) => p.name)
        .join(", ");
      const dataToSend = { ...formData, participants: participantsString };

      if (editData) {
        const eventId = editData._id || editData.id;
        if (!eventId) {
          throw new Error("Event ID is missing");
        }
        console.log("Updating event with ID:", eventId);
        console.log("Data to send:", dataToSend);

        await axios.put(
          `http://localhost:5000/api/events/${eventId}`,
          dataToSend
        );
        showToast("✅ Event updated successfully!", "success");
      } else {
        console.log("Creating new event:", dataToSend);
        await axios.post("http://localhost:5000/api/events", dataToSend);
        showToast("✅ Event created successfully!", "success");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      console.error("Error response:", error.response?.data);
      showToast(
        `❌ Failed to ${editData ? "update" : "create"} event. ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Add Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      />

      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
        <span className="text-blue-600">📅</span>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="flex-1 outline-none text-gray-700"
        />
      </div>

      <ParticipantSelector
        selectedParticipants={selectedParticipants}
        onChange={setSelectedParticipants}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category:
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="">Select Category</option>
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
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description:
        </label>
        <textarea
          name="description"
          placeholder="Add Description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
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
            name="remindBefore"
            value={formData.remindBefore}
            onChange={handleChange}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <span className="text-gray-600">minutes</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {editData ? "Update Event" : "Create Event"}
        </button>
      </div>
    </div>
  );
}

// MeetingForm Component
function MeetingForm({ onClose, onSuccess, editData = null, showToast }) {
  const [formData, setFormData] = useState({
    title: editData?.title || "",
    date: editData?.date || "2025-10-05",
    startTime: editData?.startTime || editData?.time?.split(" - ")[0] || "",
    endTime: editData?.endTime || editData?.time?.split(" - ")[1] || "",
    description: editData?.description || "",
    category: editData?.category || "Meeting",
  });
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    if (editData?.participants) {
      const participantsArray =
        typeof editData.participants === "string"
          ? editData.participants
              .split(",")
              .map((name) => ({ name: name.trim() }))
          : editData.participants;
      setSelectedParticipants(participantsArray);
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  try {
    const timeString =
      formData.startTime && formData.endTime
        ? `${formData.startTime} - ${formData.endTime}`
        : formData.startTime || "";

    // Convert selected participants to an array of emails
    const participantsEmails = selectedParticipants.map((p) => p.email);

    const dataToSend = {
      ...formData,
      time: timeString,
      participants: participantsEmails, // send emails, not names
    };

    if (editData) {
      const meetingId = editData._id || editData.id;
      if (!meetingId) throw new Error("Meeting ID is missing");

      console.log("Updating meeting with ID:", meetingId);
      console.log("Data to send:", dataToSend);

      await axios.put(
        `http://localhost:5000/api/meetings/${meetingId}`,
        dataToSend
      );
      showToast("✅ Meeting updated successfully!", "success");
    } else {
      console.log("Creating new meeting:", dataToSend);
      await axios.post("http://localhost:5000/api/meetings", dataToSend);
      showToast("✅ Meeting scheduled successfully!", "success");
    }

    onSuccess();
    onClose();
  } catch (error) {
    console.error("Error saving meeting:", error);
    console.error("Error response:", error.response?.data);
    showToast(
      `❌ Failed to ${editData ? "update" : "schedule"} meeting. ${
        error.response?.data?.message || error.message
      }`,
      "error"
    );
  }
};

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Add Title, e.g., Project Stand-up Meeting"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      />

      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
        <span className="text-blue-600">📅</span>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="flex-1 outline-none text-gray-700"
        />
      </div>

      <ParticipantSelector
        selectedParticipants={selectedParticipants}
        onChange={setSelectedParticipants}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description:
        </label>
        <textarea
          name="description"
          placeholder="Meeting Description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        ></textarea>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {editData ? "Update Meeting" : "Schedule Meeting"}
        </button>
      </div>
    </div>
  );
}

// Main Calendar Component
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Task");
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [toast, setToast] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleRefresh = async () => {
    await fetchData();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
        showToast("✅ Task deleted successfully!", "success");
        await fetchData();
        setShowDetailModal(false);
      } catch (error) {
        console.error("Error deleting task:", error);
        showToast("❌ Failed to delete task!", "error");
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingItem(task);
    setEditingType("Task");
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`);
        showToast("✅ Event deleted successfully!", "success");
        await fetchData();
        setShowDetailModal(false);
      } catch (error) {
        console.error("Error deleting event:", error);
        showToast("❌ Failed to delete event!", "error");
      }
    }
  };

  const handleEditEvent = (event) => {
    setEditingItem(event);
    setEditingType("Event");
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        await axios.delete(`http://localhost:5000/api/meetings/${meetingId}`);
        showToast("✅ Meeting deleted successfully!", "success");
        await fetchData();
        setShowDetailModal(false);
      } catch (error) {
        console.error("Error deleting meeting:", error);
        showToast("❌ Failed to delete meeting!", "error");
      }
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditingItem(meeting);
    setEditingType("Meeting");
    setShowDetailModal(false);
    setShowEditModal(true);
  };

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

  const getDateStyling = (day) => {
    if (!day) return "border border-transparent h-24 bg-transparent";
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
      "relative border rounded-xl p-3 text-sm cursor-pointer transition-all duration-300 h-24 flex flex-col";

    if (isToday)
      return (
        base +
        " bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg transform scale-105 font-bold"
      );

    const hasItems =
      taskItems.length || eventItems.length || meetingItems.length;
    if (hasItems) {
      return (
        base +
        " bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-xl hover:scale-105 font-medium"
      );
    }
    return (
      base +
      " bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
    );
  };

  const getItemDots = (day) => {
    if (!day) return null;
    const { taskItems, eventItems, meetingItems } = getItemsForDate(
      currentYear,
      currentMonth,
      day
    );
    const dots = [];
    if (taskItems.length)
      dots.push(
        <div key="task" className="w-2 h-2 rounded-full bg-blue-500" />
      );
    if (eventItems.length)
      dots.push(
        <div key="event" className="w-2 h-2 rounded-full bg-green-500" />
      );
    if (meetingItems.length)
      dots.push(
        <div key="meeting" className="w-2 h-2 rounded-full bg-yellow-500" />
      );
    return dots.length ? (
      <div className="flex gap-1 mt-auto">{dots}</div>
    ) : null;
  };

  const calendarData = generateCalendarData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <CalendarIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Personal Calendar
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your schedule efficiently
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-3 bg-white rounded-xl hover:bg-gray-100 transition-all shadow-md hover:shadow-lg border border-gray-200"
              title="Refresh"
            >
              <RotateCcw
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} /> Create New
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {tasks.length}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Events
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {events.length}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <Tag className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-yellow-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Meetings
                </p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {meetings.length}
                </p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-xl">
                <Users className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
                }
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all shadow-md"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md text-sm font-medium"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
                }
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-gray-600 font-bold text-sm py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {calendarData.flat().map((date, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    handleDateClick(currentYear, currentMonth, date)
                  }
                  className={getDateStyling(date)}
                >
                  <span className="font-semibold">{date}</span>
                  {getItemDots(date)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Meetings</span>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="mt-[100px] bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Create New</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white hover:bg-white/20 rounded-xl p-2 transition-all"
                  >
                    <span className="text-3xl">×</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("Task")}
                    className={`px-6 py-3 font-medium transition-all ${
                      activeTab === "Task"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Task
                  </button>
                  <button
                    onClick={() => setActiveTab("Event")}
                    className={`px-6 py-3 font-medium transition-all ${
                      activeTab === "Event"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Event
                  </button>
                  <button
                    onClick={() => setActiveTab("Meeting")}
                    className={`px-6 py-3 font-medium transition-all ${
                      activeTab === "Meeting"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Meeting
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                  {activeTab === "Task" && (
                    <TaskForm
                      onClose={() => setShowCreateModal(false)}
                      onSuccess={fetchData}
                      showToast={showToast}
                    />
                  )}
                  {activeTab === "Event" && (
                    <EventForm
                      onClose={() => setShowCreateModal(false)}
                      onSuccess={fetchData}
                      showToast={showToast}
                    />
                  )}
                  {activeTab === "Meeting" && (
                    <MeetingForm
                      onClose={() => setShowCreateModal(false)}
                      onSuccess={fetchData}
                      showToast={showToast}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedDateInfo && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedDateInfo.date}
                    </h2>
                    <p className="text-blue-100 flex items-center gap-2">
                      <CalendarIcon size={16} />
                      {selectedDateInfo.taskItems.length +
                        selectedDateInfo.eventItems.length +
                        selectedDateInfo.meetingItems.length}{" "}
                      item(s) scheduled
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-white hover:bg-white/20 rounded-xl p-2 transition-all"
                  >
                    <span className="text-3xl">×</span>
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[60vh] space-y-4">
                {selectedDateInfo.taskItems.map((t) => (
                  <div
                    key={t._id}
                    className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-lg text-gray-800">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium">
                          Task
                        </span>
                        <button
                          onClick={() => handleEditTask(t)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(t._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div>Date: {t.date}</div>
                      <div>Time: {t.time}</div>
                      <div>Participants: {t.participants}</div>
                      {t.description && <div>Description: {t.description}</div>}
                    </div>
                  </div>
                ))}

                {selectedDateInfo.eventItems.map((e) => (
                  <div
                    key={e._id}
                    className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-green-100/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-lg text-gray-800">
                        {e.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium">
                          Event
                        </span>
                        <button
                          onClick={() => handleEditEvent(e)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(e._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-green-500" />
                        <span>{e.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-green-500" />
                        <span>{e.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-green-500" />
                        <span>{e.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-green-500" />
                        <span>{e.participants}</span>
                      </div>
                      {e.description && (
                        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-green-200">
                          <FileText
                            size={16}
                            className="text-green-500 mt-0.5"
                          />
                          <span>{e.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {selectedDateInfo.meetingItems.map((m) => (
                  <div
                    key={m._id || m.id}
                    className="border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-lg text-gray-800">
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-medium">
                          Meeting
                        </span>
                        <button
                          onClick={() => handleEditMeeting(m)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(m._id || m.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-yellow-500" />
                        <span>{m.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-yellow-500" />
                        <span>
                          {m.time ||
                            (m.startTime && m.endTime
                              ? `${m.startTime} - ${m.endTime}`
                              : "Time not set")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-yellow-500" />
                        <span>{m.category || "Meeting"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-yellow-500" />
                        <span>{m.participants}</span>
                      </div>
                      {m.description && (
                        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-yellow-200">
                          <FileText
                            size={16}
                            className="text-yellow-500 mt-0.5"
                          />
                          <span>{m.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="mt-[100px] bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Edit {editingType}</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingItem(null);
                      setEditingType(null);
                    }}
                    className="text-white hover:bg-white/20 rounded-xl p-2 transition-all"
                  >
                    <span className="text-3xl">×</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="overflow-y-auto max-h-[60vh]">
                  {editingType === "Task" && (
                    <TaskForm
                      onClose={() => {
                        setShowEditModal(false);
                        setEditingItem(null);
                        setEditingType(null);
                      }}
                      onSuccess={fetchData}
                      editData={editingItem}
                      showToast={showToast}
                    />
                  )}
                  {editingType === "Event" && (
                    <EventForm
                      onClose={() => {
                        setShowEditModal(false);
                        setEditingItem(null);
                        setEditingType(null);
                      }}
                      onSuccess={fetchData}
                      editData={editingItem}
                      showToast={showToast}
                    />
                  )}
                  {editingType === "Meeting" && (
                    <MeetingForm
                      onClose={() => {
                        setShowEditModal(false);
                        setEditingItem(null);
                        setEditingType(null);
                      }}
                      onSuccess={fetchData}
                      editData={editingItem}
                      showToast={showToast}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}