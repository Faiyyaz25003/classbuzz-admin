


"use client";
import { useEffect, useState } from "react";
import {
  Eye,
  FileText,
  Image,
  CreditCard,
  User,
  Download,
  Trash2,
  Search,
  FolderOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Documents() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 🧾 Fetch all uploaded documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/documents");
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // 📥 Download file
  const handleDownload = (id, field) => {
    window.open(`http://localhost:5000/api/documents/download/${id}/${field}`);
  };

  // 👁️ Preview file
  const handlePreview = (id, field) => {
    window.open(`http://localhost:5000/uploads/${id}/${field}`, "_blank");
  };

  // 🗑️ Delete specific document (not full user)
  const handleDeleteDocument = async (id, field) => {
    if (!window.confirm(`Delete ${field} document for this user?`)) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/documents/delete/${id}/${field}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete document");
      const data = await res.json();
      alert(data.message || "File deleted successfully");

      await fetchDocuments();
    } catch (error) {
      console.error(error);
      alert("Error deleting document");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete entire user record
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to delete user record");

      alert(data.message || "User deleted successfully");

      await fetchDocuments();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Error deleting user");
    }
  };

  // Filter users based on active tab
  const getFilteredUsers = () => {
    let filtered = users;

    // Filter by document type
    if (activeTab === "aadhaar") {
      filtered = filtered.filter((user) => user.aadhaar);
    } else if (activeTab === "marksheet") {
      filtered = filtered.filter((user) => user.marksheet);
    } else if (activeTab === "photo") {
      filtered = filtered.filter((user) => user.photo);
    } else if (activeTab === "complete") {
      filtered = filtered.filter(
        (user) => user.aadhaar && user.marksheet && user.photo
      );
    } else if (activeTab === "incomplete") {
      filtered = filtered.filter(
        (user) => !user.aadhaar || !user.marksheet || !user.photo
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const tabs = [
    { id: "all", label: "All", icon: FolderOpen, count: users.length },
    {
      id: "aadhaar",
      label: "Aadhaar",
      icon: CreditCard,
      count: users.filter((u) => u.aadhaar).length,
    },
    {
      id: "marksheet",
      label: "Marksheet",
      icon: FileText,
      count: users.filter((u) => u.marksheet).length,
    },
    {
      id: "photo",
      label: "Photo",
      icon: Image,
      count: users.filter((u) => u.photo).length,
    },
    {
      id: "complete",
      label: "Complete",
      icon: CheckCircle,
      count: users.filter((u) => u.aadhaar && u.marksheet && u.photo).length,
    },
    {
      id: "incomplete",
      label: "Incomplete",
      icon: AlertCircle,
      count: users.filter((u) => !u.aadhaar || !u.marksheet || !u.photo).length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4"></div>
          <h1 className="text-4xl md:text-5xl float-left font-bold bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] bg-clip-text text-transparent mb-3">
            Document Manager
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Complete</p>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    users.filter((u) => u.aadhaar && u.marksheet && u.photo)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-lg">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Incomplete</p>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    users.filter((u) => !u.aadhaar || !u.marksheet || !u.photo)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Documents</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.reduce(
                    (acc, u) =>
                      acc +
                      (u.aadhaar ? 1 : 0) +
                      (u.marksheet ? 1 : 0) +
                      (u.photo ? 1 : 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] text-white shadow-lg shadow-blue-500/30 scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-gray-400" size={48} />
            </div>
            <p className="text-gray-500 text-xl font-medium mb-2">
              {searchQuery ? "No documents found" : "No documents uploaded yet"}
            </p>
            <p className="text-gray-400">
              {searchQuery
                ? "Try a different search term"
                : "Documents will appear here once uploaded"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => {
              const isComplete = user.aadhaar && user.marksheet && user.photo;
              const docCount =
                (user.aadhaar ? 1 : 0) +
                (user.marksheet ? 1 : 0) +
                (user.photo ? 1 : 0);

              return (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div
                    className={`p-5 ${
                      isComplete
                        ? "bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8]"
                        : "bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                          <User className="text-white" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white truncate">
                            {user.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {docCount}/3 Documents
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={loading}
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
                        title="Delete entire user record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${(docCount / 3) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Document List */}
                  <div className="p-5 space-y-3">
                    {/* Aadhaar */}
                    {user.aadhaar ? (
                      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-2 rounded-lg">
                            <CreditCard
                              className="text-emerald-600"
                              size={20}
                            />
                          </div>
                          <span className="font-semibold text-gray-700">
                            Aadhaar Card
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview(user._id, "aadhaar")}
                            className="text-emerald-600 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 p-2 rounded-lg transition-all"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownload(user._id, "aadhaar")}
                            className="text-emerald-600 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 p-2 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDocument(user._id, "aadhaar")
                            }
                            className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 p-2 rounded-lg">
                            <CreditCard className="text-gray-400" size={20} />
                          </div>
                          <span className="font-medium text-gray-400">
                            Aadhaar Card
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Not uploaded
                        </span>
                      </div>
                    )}

                    {/* Marksheet */}
                    {user.marksheet ? (
                      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 p-2 rounded-lg">
                            <FileText className="text-amber-600" size={20} />
                          </div>
                          <span className="font-semibold text-gray-700">
                            Marksheet
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview(user._id, "marksheet")}
                            className="text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 p-2 rounded-lg transition-all"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDownload(user._id, "marksheet")
                            }
                            className="text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 p-2 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDocument(user._id, "marksheet")
                            }
                            className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 p-2 rounded-lg">
                            <FileText className="text-gray-400" size={20} />
                          </div>
                          <span className="font-medium text-gray-400">
                            Marksheet
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Not uploaded
                        </span>
                      </div>
                    )}

                    {/* Photo */}
                    {user.photo ? (
                      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Image className="text-purple-600" size={20} />
                          </div>
                          <span className="font-semibold text-gray-700">
                            Photo
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview(user._id, "photo")}
                            className="text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 p-2 rounded-lg transition-all"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownload(user._id, "photo")}
                            className="text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 p-2 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDocument(user._id, "photo")
                            }
                            className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 p-2 rounded-lg">
                            <Image className="text-gray-400" size={20} />
                          </div>
                          <span className="font-medium text-gray-400">
                            Photo
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Not uploaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}