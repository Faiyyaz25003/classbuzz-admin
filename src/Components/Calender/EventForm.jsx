// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function EventForm({ onClose }) {
//   const [formData, setFormData] = useState({
//     title: "",
//     date: "2025-10-05",
//     participants: "",
//     category: "",
//     time: "",
//     description: "",
//     remindBefore: 15,
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/events",
//         formData
//       );
//       toast.success("✅ Event created successfully!");
//       console.log("Created Event:", response.data);
//       onClose();
//     } catch (error) {
//       console.error("Error creating event:", error);
//       toast.error("❌ Failed to create event. Try again!");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <ToastContainer position="top-right" autoClose={2000} />

//       {/* Title */}
//       <input
//         type="text"
//         name="title"
//         placeholder="Add Title"
//         value={formData.title}
//         onChange={handleChange}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//       />

//       {/* Date */}
//       <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
//         <span className="text-blue-600">📅</span>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           className="flex-1 outline-none text-gray-700"
//         />
//       </div>

//       {/* Participants */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Participants (Optional):
//         </label>
//         <input
//           type="text"
//           name="participants"
//           placeholder="Enter participants"
//           value={formData.participants}
//           onChange={handleChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//         />
//       </div>

//       {/* Category */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Category:
//         </label>
//         <select
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//         >
//           <option value="">Select Category</option>
//           <option>🔵 Daily Task</option>
//           <option>🔴 Meeting</option>
//           <option>🟢 Reminder</option>
//           <option>🟣 Deadline</option>
//           <option>🟡 Leaves</option>
//           <option>🟠 Other</option>
//         </select>
//       </div>

//       {/* Time */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Time:
//         </label>
//         <input
//           type="time"
//           name="time"
//           value={formData.time}
//           onChange={handleChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//         />
//       </div>

//       {/* Description */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Description:
//         </label>
//         <textarea
//           name="description"
//           placeholder="Add Description"
//           rows="3"
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//         ></textarea>
//       </div>

//       {/* Reminder */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Remind Before:
//         </label>
//         <div className="flex items-center gap-2">
//           <input
//             type="number"
//             name="remindBefore"
//             value={formData.remindBefore}
//             onChange={handleChange}
//             className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//           />
//           <span className="text-gray-600">minutes</span>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4 pt-4">
//         <button
//           onClick={onClose}
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Create Event
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "2025-10-05",
    participants: [],
    category: "",
    time: "",
    description: "",
    remindBefore: 15,
  });

  const [allUsers, setAllUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Handle field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Fetch users when clicking participants field
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

  // 🔹 Toggle participant select/deselect
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

  // 🔹 Submit Event
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
    <div className="space-y-4 relative">
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

      {/* Participants Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Participants:
        </label>

        {/* Selected participants */}
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
