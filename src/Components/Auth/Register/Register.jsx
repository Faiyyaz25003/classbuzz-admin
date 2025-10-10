
"use client";
import { useState } from "react";
import {
  Calendar,
  Mail,
  Phone,
  UserPlus,
  Building2,
  Briefcase,
} from "lucide-react";
import axios from "axios";
export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    departments: [""],
    positions: [""],
    joinDate: "",
  });

  const departmentsList = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Artificial Intelligence & Data Science",
    "Biotechnology",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Commerce",
    "Business Administration",
    "Economics",
    "English",
    "Psychology",
    "Sociology",
    "Fine Arts",
    "Mass Communication",
    "Other (Custom)",
  ];

  const positionsList = [
    "Student",
    "Professor",
    "Assistant Professor",
    "Lab Assistant",
    "Librarian",
    "Monitor",
    "HOD (Head of Department)",
    "Principal",
    "Other (Custom)",
  ];

  const [customDepartments, setCustomDepartments] = useState({});
  const [customPositions, setCustomPositions] = useState({});
  const [customMode, setCustomMode] = useState({
    department: {},
    position: {},
  });

  const handleChange = (e, type, index) => {
    const value = e.target.value;

    if (type === "department") {
      const newDeps = [...form.departments];
      newDeps[index] = value;
      setForm({ ...form, departments: newDeps });

      if (value === "Other (Custom)") {
        setCustomMode({
          ...customMode,
          department: { ...customMode.department, [index]: "pending" },
        });
      }
    } else if (type === "position") {
      const newPos = [...form.positions];
      newPos[index] = value;
      setForm({ ...form, positions: newPos });

      if (value === "Other (Custom)") {
        setCustomMode({
          ...customMode,
          position: { ...customMode.position, [index]: "pending" },
        });
      }
    } else if (type === "customDepartment") {
      setCustomDepartments({ ...customDepartments, [index]: value });
    } else if (type === "customPosition") {
      setCustomPositions({ ...customPositions, [index]: value });
    } else {
      setForm({ ...form, [e.target.name]: value });
    }
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   // Prepare payload (merge custom fields)
   const payload = {
     ...form,
     departments: form.departments.map((dep, i) =>
       dep === "Other (Custom)" ? customDepartments[i] : dep
     ),
     positions: form.positions.map((pos, i) =>
       pos === "Other (Custom)" ? customPositions[i] : pos
     ),
   };

   try {
     const res = await axios.post(
       "http://localhost:5000/api/users/register",
       payload
     );
     alert(res.data.message);
   } catch (err) {
     // Safe access
     const message =
       err?.response?.data?.message || err.message || "Registration failed";
     alert(message);
   }
 };

  
  const addField = (type) => {
    if (type === "department") {
      setForm({ ...form, departments: [...form.departments, ""] });
    } else if (type === "position") {
      setForm({ ...form, positions: [...form.positions, ""] });
    }
  };

  const removeField = (type, index) => {
    if (type === "department") {
      const newDeps = [...form.departments];
      newDeps.splice(index, 1);
      setForm({ ...form, departments: newDeps });
    } else if (type === "position") {
      const newPos = [...form.positions];
      newPos.splice(index, 1);
      setForm({ ...form, positions: newPos });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <UserPlus className="text-blue-600" />
        Register Form
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter full name"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <div className="flex items-center border rounded-lg">
          <Mail className="ml-3 text-gray-400" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full p-3 focus:outline-none rounded-lg"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="flex items-center border rounded-lg">
          <Phone className="ml-3 text-gray-400" />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full p-3 focus:outline-none rounded-lg"
          />
        </div>
      </div>

      {/* Departments */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Department(s)
        </label>
        {form.departments.map((dept, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <Building2 className="text-gray-400 w-5 h-5" />
            {!customMode.department[index] ? (
              <select
                value={dept}
                onChange={(e) => handleChange(e, "department", index)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departmentsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            ) : customMode.department[index] === "pending" ? (
              <button
                type="button"
                onClick={() =>
                  setCustomMode({
                    ...customMode,
                    department: { ...customMode.department, [index]: true },
                  })
                }
                className="text-blue-600 font-semibold hover:underline"
              >
                + Add Department
              </button>
            ) : (
              <input
                type="text"
                placeholder="Enter custom department"
                value={customDepartments[index] || ""}
                onChange={(e) => handleChange(e, "customDepartment", index)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
            {form.departments.length > 1 && (
              <button
                type="button"
                onClick={() => removeField("department", index)}
                className="text-red-500 font-bold"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("department")}
          className="text-blue-600 text-sm font-semibold mt-2 hover:underline"
        >
          + Add More Department
        </button>
      </div>

      {/* Positions */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Position(s)
        </label>
        {form.positions.map((pos, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <Briefcase className="text-gray-400 w-5 h-5" />
            {!customMode.position[index] ? (
              <select
                value={pos}
                onChange={(e) => handleChange(e, "position", index)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Position</option>
                {positionsList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            ) : customMode.position[index] === "pending" ? (
              <button
                type="button"
                onClick={() =>
                  setCustomMode({
                    ...customMode,
                    position: { ...customMode.position, [index]: true },
                  })
                }
                className="text-blue-600 font-semibold hover:underline"
              >
                + Add Position
              </button>
            ) : (
              <input
                type="text"
                placeholder="Enter custom position"
                value={customPositions[index] || ""}
                onChange={(e) => handleChange(e, "customPosition", index)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
            {form.positions.length > 1 && (
              <button
                type="button"
                onClick={() => removeField("position", index)}
                className="text-red-500 font-bold"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("position")}
          className="text-blue-600 text-sm font-semibold mt-2 hover:underline"
        >
          + Add More Position
        </button>
      </div>

      {/* Join Date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Joining Date
        </label>
        <div className="flex items-center border rounded-lg">
          <Calendar className="ml-3 text-gray-400" />
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            className="w-full p-3 focus:outline-none rounded-lg"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
      >
        Register
      </button>
    </div>
  );
};
