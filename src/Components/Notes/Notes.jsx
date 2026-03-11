
"use client";
import { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NotesUpload() {
  const [teacherName, setTeacherName] = useState("");
  const [notes, setNotes] = useState([
    { name: "Lecture Notes", file: null },
    { name: "Assignment", file: null },
    { name: "Reference Material", file: null },
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadedPasswords, setUploadedPasswords] = useState([]);

  const handleNameChange = (index, value) => {
    const updated = [...notes];
    updated[index].name = value;
    setNotes(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...notes];
    updated[index].file = file;
    setNotes(updated);
  };

  const addNote = () => setNotes([...notes, { name: "", file: null }]);

  const removeNote = (index) => setNotes(notes.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (!teacherName.trim()) {
      alert("Please enter your name.");
      return;
    }
    const hasFile = notes.some((n) => n.file);
    if (!hasFile) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("teacherName", teacherName.trim());
    notes.forEach((note, index) => {
      if (note.file) {
        formData.append(`file_${index}`, note.file);
        formData.append(`name_${index}`, note.name || `Note ${index + 1}`);
      }
    });

    try {
      setUploading(true);
      const res = await axios.post(`${BASE_URL}/api/notes/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedPasswords(res.data.data);
      setTeacherName("");
      setNotes([
        { name: "Lecture Notes", file: null },
        { name: "Assignment", file: null },
        { name: "Reference Material", file: null },
      ]);
    } catch (error) {
      alert(error.response?.data?.message || "Upload Failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          📝 Upload Notes
        </h2>

        {/* Teacher Name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-600 mb-1">
            Enter Your Name
          </label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="e.g. Dr. Sharma"
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Notes List */}
        <div className="space-y-3 mb-6">
          {notes.map((note, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-3 items-center"
            >
              <input
                type="text"
                value={note.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Note name"
                className="border rounded-lg px-3 py-2 w-full md:w-1/3 text-sm"
              />
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                className="w-full md:w-1/2 text-sm"
              />
              {index >= 3 && (
                <button
                  onClick={() => removeNote(index)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={addNote}
            className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold text-sm"
          >
            ➕ Add More
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "🚀 Upload All"}
          </button>
        </div>

        {/* Passwords Display After Upload */}
        {uploadedPasswords.length > 0 && (
          <div className="mt-8 border border-teal-200 rounded-xl p-5 bg-teal-50">
            <h3 className="text-base font-bold text-teal-700 mb-3">
              🔐 Generated Passwords — Share with Students
            </h3>
            <div className="space-y-2">
              {uploadedPasswords.map((note) => (
                <div
                  key={note._id}
                  className="flex items-center justify-between bg-white border border-teal-100 rounded-lg px-4 py-2.5"
                >
                  <span className="text-sm text-slate-700 font-medium">
                    📄 {note.name}
                  </span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-lg text-sm tracking-widest">
                    {note.password}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              ⚠️ Save these passwords now — they won't be shown again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
