"use client";
import { useState } from "react";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    dob: "",
    studentClass: "",
    parentName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to register student");

      setMessage({
        type: "success",
        text: "✅ Student registered successfully and email sent!",
      });

      // Reset form
      setForm({
        fullName: "",
        email: "",
        dob: "",
        studentClass: "",
        parentName: "",
        phone: "",
        address: "",
      });

      if (onSuccess) onSuccess(data);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong ❌",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-2xl mt-8">
      <h2 className="text-2xl font-semibold text-center text-[#0f4c5c] mb-6 flex justify-center items-center gap-2">
        <UserPlus className="text-[#1e88a8]" /> Student Registration Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Grid fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <InputField
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <InputField
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={form.dob}
            onChange={handleChange}
          />
          <InputField
            name="studentClass"
            placeholder="Class (e.g., 5A)"
            value={form.studentClass}
            onChange={handleChange}
          />
          <InputField
            name="parentName"
            placeholder="Parent / Guardian Name"
            value={form.parentName}
            onChange={handleChange}
          />
          <InputField
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={3}
          placeholder="Full Address"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#1e88a8] focus:border-transparent outline-none transition-all duration-300"
        ></textarea>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {message.text}
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] hover:from-[#1e88a8] hover:to-[#0f4c5c] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <UserPlus size={18} /> Register Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable input component
function InputField({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#1e88a8] focus:border-transparent outline-none transition-all duration-300"
    />
  );
}
