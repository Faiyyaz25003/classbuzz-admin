"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "2025-10-05",
    participants: "",
    category: "",
    time: "",
    description: "",
    remindBefore: 15,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        formData
      );
      toast.success("✅ Event created successfully!");
      console.log("Created Event:", response.data);
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("❌ Failed to create event. Try again!");
    }
  };

  return (
    <div className="space-y-4">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Add Title"
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Participants (Optional):
        </label>
        <input
          type="text"
          name="participants"
          placeholder="Enter participants"
          value={formData.participants}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
      </div>

      {/* Category */}
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

      {/* Time */}
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

      {/* Description */}
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

      {/* Reminder */}
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
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Event
        </button>
      </div>
    </div>
  );
}
