"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_FOLDER = "http://localhost:5000/api/folders";
const API_ASSIGNMENT = "http://localhost:5000/api/assignments";

const FOLDER_THEMES = [
  {
    // gradient: "from-indigo-500 to-violet-600",
    gradient: "bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be]",
    light: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
    emoji: "📘",
  },
  {
    // gradient: "from-sky-500 to-blue-600",
    gradient: "bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be]",
    light: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
    emoji: "📗",
  },
  {
    // gradient: "from-emerald-500 to-teal-600",
    gradient: "bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be]",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    emoji: "📙",
  },
  {
    // gradient: "from-amber-500 to-orange-500",
    gradient: "bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be]",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    emoji: "📕",
  },
  {
    // gradient: "from-pink-500 to-rose-500",
    gradient: "bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be]",
    light: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
    badge: "bg-pink-100 text-pink-700",
    dot: "bg-pink-500",
    emoji: "📒",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  },
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-700 border border-green-200",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border border-red-200",
  },
};

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium transition-all ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      {msg}
    </div>
  );
}

function InfoPill({ label, value, theme }) {
  return (
    <div
      className={`flex flex-col px-4 py-3 rounded-xl ${theme.light} ${theme.border} border`}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
        {label}
      </span>
      <span className={`text-sm font-bold ${theme.text}`}>{value || "—"}</span>
    </div>
  );
}

export default function AdminAssignment() {
  const [folders, setFolders] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const [teacher, setTeacher] = useState("");
  const [department, setDepartment] = useState("");
  const [className, setClassName] = useState("");
  const [docName, setDocName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [rejectReason, setRejectReason] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("folders");

  const showToast = (msg, type) => setToast({ msg, type });

  const getFolders = async () => {
    try {
      const res = await axios.get(API_FOLDER);
      setFolders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFolders();
  }, []);

  const createFolder = async () => {
    if (!className || !docName || !adminPassword) {
      showToast("Required fields missing", "error");
      return;
    }
    try {
      await axios.post(`${API_FOLDER}/create`, {
        teacher,
        department,
        className,
        docName,
        password: adminPassword,
      });
      showToast("Folder created successfully", "success");
      setTeacher("");
      setDepartment("");
      setClassName("");
      setDocName("");
      setAdminPassword("");
      getFolders();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFolder = async (id) => {
    await axios.delete(`${API_FOLDER}/${id}`);
    showToast("Folder deleted", "success");
    if (selectedFolder?._id === id) {
      setSelectedFolder(null);
      setAssignments([]);
    }
    getFolders();
  };

  const openFolder = async (folder, theme) => {
    setSelectedFolder(folder);
    setSelectedTheme(theme);
    const res = await axios.get(`${API_ASSIGNMENT}/folder/${folder._id}`);
    setAssignments(res.data);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const verifyAssignment = async (id) => {
    await axios.put(`${API_ASSIGNMENT}/verify/${id}`);
    showToast("Assignment verified", "success");
    openFolder(selectedFolder, selectedTheme);
  };

  const rejectAssignment = async () => {
    await axios.put(`${API_ASSIGNMENT}/reject/${rejectId}`, {
      reason: rejectReason,
    });
    setRejectReason("");
    setRejectId(null);
    showToast("Assignment rejected", "success");
    openFolder(selectedFolder, selectedTheme);
  };

  const pending = assignments.filter((a) => a.status === "pending").length;
  const verified = assignments.filter((a) => a.status === "verified").length;
  const rejected = assignments.filter((a) => a.status === "rejected").length;

  return (
    <div
      className="min-h-screen mt-[10px] bg-white"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* ── TOP HEADER ── */}
      <header className="bg-white border-b  border-gray-100 sticky top-0 z-30 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="font-bold text-gray-800 text-lg tracking-tight">
            Assignments
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
          Active
        </div>
      </header>

      {/* ── FOLDER INFO BANNER (shown when folder selected) ── */}
      {selectedFolder && selectedTheme && (
        <div
          className={`w-full bg-gradient-to-r ${selectedTheme.gradient} px-8 py-5`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => {
                  setSelectedFolder(null);
                  setAssignments([]);
                }}
                className="text-white/70 hover:text-white text-xs flex items-center gap-1 transition-colors"
              >
                ← Back
              </button>
              <span className="text-white/50 text-xs">/</span>
              <span className="text-white/90 text-xs font-medium">
                Folder Details
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                {selectedTheme.emoji}
              </div>
              <div>
                <h2 className="text-white font-bold text-xl leading-tight">
                  {selectedFolder.className}
                </h2>
                <p className="text-white/70 text-sm">
                  {selectedFolder.docName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">
                  Teacher
                </p>
                <p className="text-white font-semibold text-sm">
                  {selectedFolder.teacher || "—"}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">
                  Department
                </p>
                <p className="text-white font-semibold text-sm">
                  {selectedFolder.department || "—"}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">
                  Class
                </p>
                <p className="text-white font-semibold text-sm">
                  {selectedFolder.className}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">
                  Total Submitted
                </p>
                <p className="text-white font-semibold text-sm">
                  {assignments.length} files
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-white/80 text-xs">
                <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                {pending} Pending
              </span>
              <span className="flex items-center gap-1.5 text-white/80 text-xs">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                {verified} Verified
              </span>
              <span className="flex items-center gap-1.5 text-white/80 text-xs">
                <span className="w-2 h-2 bg-red-300 rounded-full"></span>
                {rejected} Rejected
              </span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* ── ASSIGNMENTS VIEW ── */}
        {selectedFolder ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Submissions</h3>
              <span className="text-sm text-gray-400">
                {assignments.length} total
              </span>
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-medium">No assignments submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((a, i) => {
                  const sc = statusConfig[a.status] || statusConfig.pending;
                  return (
                    <div
                      key={a._id}
                      className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                          {a.studentName?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {a.studentName}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <a
                              href={a.fileUrl}
                              target="_blank"
                              className="text-indigo-500 text-xs hover:underline flex items-center gap-1"
                            >
                              📎 Open File
                            </a>
                            <span
                              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${sc.color}`}
                            >
                              {sc.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => verifyAssignment(a._id)}
                          className="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => setRejectId(a._id)}
                          className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ── MAIN DASHBOARD ── */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* CREATE FOLDER FORM */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white flex items-center justify-center text-xs font-bold">
                    +
                  </div>
                  <h2 className="font-bold text-gray-800">Create New Folder</h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      placeholder: "Teacher Name",
                      value: teacher,
                      set: setTeacher,
                      icon: "👤",
                    },
                    {
                      placeholder: "Department",
                      value: department,
                      set: setDepartment,
                      icon: "🏫",
                    },
                    {
                      placeholder: "Class Name *",
                      value: className,
                      set: setClassName,
                      icon: "📚",
                    },
                    {
                      placeholder: "Document Name *",
                      value: docName,
                      set: setDocName,
                      icon: "📄",
                    },
                  ].map(({ placeholder, value, set, icon }) => (
                    <div key={placeholder} className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                        {icon}
                      </span>
                      <input
                        className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => set(e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                      🔒
                    </span>
                    <input
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      placeholder="Admin Password *"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={createFolder}
                  className="w-full mt-5 bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm shadow-indigo-200"
                >
                  Create Folder
                </button>
              </div>

              {/* Summary stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {folders.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Total Folders</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-bold text-emerald-500">
                    {folders.length > 0 ? "Active" : "Empty"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Status</p>
                </div>
              </div>
            </div>

            {/* FOLDER GRID */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">All Folders</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {folders.length} folders
                </span>
              </div>

              {folders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-sm font-medium">No folders yet</p>
                  <p className="text-xs mt-1">
                    Create your first folder on the left
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {folders.map((folder, i) => {
                    const theme = FOLDER_THEMES[i % FOLDER_THEMES.length];
                    return (
                      <div
                        key={folder._id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                        onClick={() => openFolder(folder, theme)}
                      >
                        {/* Color header */}
                        <div
                          className={`h-24 bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative overflow-hidden`}
                        >
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage:
                                "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)",
                              backgroundSize: "20px 20px",
                            }}
                          ></div>
                          <span className="text-4xl drop-shadow-sm">
                            {theme.emoji}
                          </span>
                        </div>

                        {/* Card body */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 text-sm truncate">
                            {folder.className}
                          </h3>
                          {folder.teacher && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              👤 {folder.teacher}
                            </p>
                          )}
                          {folder.department && (
                            <p className="text-xs text-gray-400 truncate">
                              🏫 {folder.department}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${theme.badge}`}
                            >
                              {folder.docName || "Assignment"}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFolder(folder._id);
                              }}
                              className="text-gray-300 hover:text-red-400 transition-colors text-xs"
                              title="Delete folder"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* REJECT MODAL */}
      {rejectId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-sm">
                ✕
              </div>
              <h3 className="font-bold text-gray-800">Reject Assignment</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Please provide a reason for rejection.
            </p>
            <textarea
              className="border border-gray-200 w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              rows={3}
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setRejectId(null);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={rejectAssignment}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm shadow-red-200"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
