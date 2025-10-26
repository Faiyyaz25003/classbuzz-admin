"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MeetingForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "2025-10-05",
    participants: [],
    startTime: "",
    endTime: "",
    description: "",
  });

  const [allUsers, setAllUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch users when clicking participants input
  const handleFetchUsers = async () => {
    try {
      setShowDropdown(!showDropdown);
      if (allUsers.length === 0) {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/users");
        setAllUsers(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("❌ Failed to load users!");
    }
  };

  // Toggle participant selection
  const toggleParticipant = (userName) => {
    setFormData((prev) => {
      const alreadySelected = prev.participants.includes(userName);
      return {
        ...prev,
        participants: alreadySelected
          ? prev.participants.filter((p) => p !== userName)
          : [...prev.participants, userName],
      };
    });
  };

  // Submit meeting
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/meetings",
        formData
      );
      toast.success("✅ Meeting scheduled successfully!");
      console.log("Created Meeting:", response.data);
      onClose();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("❌ Failed to schedule meeting. Try again!");
    }
  };

  return (
    <div className="space-y-4 relative">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Add Title, e.g., Project Stand-up Meeting"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      />

      {/* Date */}
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

      {/* Participants */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Participants (Required):
        </label>
        <div
          className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white flex flex-wrap gap-2"
          onClick={handleFetchUsers}
        >
          {formData.participants.length === 0 && (
            <span className="text-gray-400">Select participants</span>
          )}
          {formData.participants.map((p, i) => (
            <span
              key={i}
              className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {p}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleParticipant(p);
                }}
                className="text-xs text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Dropdown list */}
        {showDropdown && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {isLoading ? (
              <p className="p-2 text-gray-500 text-sm text-center">
                Loading users...
              </p>
            ) : allUsers.length > 0 ? (
              allUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleParticipant(user.name)}
                  className={`px-3 py-2 cursor-pointer hover:bg-red-100 ${
                    formData.participants.includes(user.name)
                      ? "bg-red-50 font-medium text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {user.name}
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-500 text-sm text-center">
                No users found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Time */}
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

      {/* Description */}
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

      {/* Buttons */}
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
          Schedule Meeting
        </button>
      </div>
    </div>
  );
}
