

"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_FOLDER = "http://localhost:5000/api/folders";
const API_ASSIGNMENT = "http://localhost:5000/api/assignments";

const GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-red-400",
  "from-pink-400 to-violet-500",
];

const EMOJIS = ["📘", "📗", "📙", "📕", "📒"];

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {msg}
    </div>
  );
}

export default function AdminAssignment() {
  const [folders, setFolders] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [teacher, setTeacher] = useState("");
  const [department, setDepartment] = useState("");
  const [className, setClassName] = useState("");
  const [docName, setDocName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [rejectReason, setRejectReason] = useState("");
  const [rejectId, setRejectId] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => setToast({ msg, type });

  /* ================= GET FOLDERS ================= */

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

  /* ================= CREATE FOLDER ================= */

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

      showToast("Folder created", "success");

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

  /* ================= DELETE FOLDER ================= */

  const deleteFolder = async (id) => {
    await axios.delete(`${API_FOLDER}/${id}`);
    showToast("Folder deleted", "success");
    getFolders();
  };

  /* ================= GET ASSIGNMENTS ================= */

  const openFolder = async (folder) => {
    setSelectedFolder(folder);

    const res = await axios.get(`${API_ASSIGNMENT}/folder/${folder._id}`);

    setAssignments(res.data);
  };

  /* ================= VERIFY ================= */

  const verifyAssignment = async (id) => {
    await axios.put(`${API_ASSIGNMENT}/verify/${id}`);

    showToast("Assignment verified", "success");

    openFolder(selectedFolder);
  };

  /* ================= REJECT ================= */

  const rejectAssignment = async () => {
    await axios.put(`${API_ASSIGNMENT}/reject/${rejectId}`, {
      reason: rejectReason,
    });

    setRejectReason("");
    setRejectId(null);

    showToast("Assignment rejected", "success");

    openFolder(selectedFolder);
  };

  const totalFiles = assignments.length;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-2xl font-bold mb-6">Admin Assignment Panel</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* CREATE FOLDER */}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Create Folder</h2>

          <input
            className="border w-full mb-3 p-2"
            placeholder="Teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />

          <input
            className="border w-full mb-3 p-2"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <input
            className="border w-full mb-3 p-2"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />

          <input
            className="border w-full mb-3 p-2"
            placeholder="Document Name"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />

          <input
            className="border w-full mb-3 p-2"
            placeholder="Password"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />

          <button
            onClick={createFolder}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create Folder
          </button>
        </div>

        {/* FOLDER LIST */}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Folders</h2>

          <div className="grid grid-cols-2 gap-4">
            {folders.map((folder, i) => (
              <div
                key={folder._id}
                className="border rounded-xl cursor-pointer"
                onClick={() => openFolder(folder)}
              >
                <div
                  className={`h-20 flex items-center justify-center bg-gradient-to-br ${
                    GRADIENTS[i % 5]
                  }`}
                >
                  <span className="text-3xl">{EMOJIS[i % 5]}</span>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold">{folder.className}</h3>

                  <p className="text-xs text-gray-500">{folder.teacher}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder._id);
                    }}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ASSIGNMENTS */}

      {selectedFolder && (
        <div className="bg-white mt-10 p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">
            Assignments - {selectedFolder.className}
          </h2>

          {assignments.length === 0 ? (
            <p>No assignments</p>
          ) : (
            assignments.map((a) => (
              <div
                key={a._id}
                className="border p-3 mb-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{a.studentName}</p>

                  <a
                    href={a.fileUrl}
                    target="_blank"
                    className="text-blue-500 text-sm"
                  >
                    Open File
                  </a>

                  <p className="text-xs">Status: {a.status}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => verifyAssignment(a._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Verify
                  </button>

                  <button
                    onClick={() => setRejectId(a._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* REJECT POPUP */}

      {rejectId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl">
            <h3 className="mb-3 font-bold">Reject Reason</h3>

            <textarea
              className="border w-full p-2 mb-3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <button
              onClick={rejectAssignment}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
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