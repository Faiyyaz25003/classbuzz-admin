"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TaskForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "2025-10-05",
    participants: [],
    time: "",
    description: "",
  });

  const [allUsers, setAllUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const dropdownRef = useRef();

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/users");
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("❌ Failed to fetch users!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchText(""); // clear search when closing
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Select or deselect participant
  const toggleParticipant = (name) => {
    setFormData((prev) => {
      const exists = prev.participants.includes(name);
      return {
        ...prev,
        participants: exists
          ? prev.participants.filter((p) => p !== name)
          : [...prev.participants, name],
      };
    });
  };

  // Submit task
  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/tasks", formData);
      toast.success("✅ Task created successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to create task!");
    }
  };

  // Filtered users based on search
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-4 relative">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Add Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Date */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Participants */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Participants:
        </label>

        {/* Selected participants display */}
        <div
          className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white flex flex-wrap gap-2"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {formData.participants.length === 0 && (
            <span className="text-gray-400">Select participants</span>
          )}
          {formData.participants.map((p, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
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

        {/* Dropdown user list */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {/* Search input */}
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none"
            />

            {isLoading ? (
              <p className="p-2 text-gray-500 text-sm text-center">
                Loading users...
              </p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleParticipant(user.name)}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                    formData.participants.includes(user.name)
                      ? "bg-blue-50 font-medium text-blue-600"
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
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Add Description"
        rows="3"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>
    </div>
  );
}
