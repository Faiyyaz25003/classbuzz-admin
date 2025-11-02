
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
  Check,
  X,
  Clock,
} from "lucide-react";

export default function Documents() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectUserId, setRejectUserId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

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

  const handleDownload = (id, field) => {
    window.open(`http://localhost:5000/api/documents/download/${id}/${field}`);
  };

  const handlePreview = (id, field) => {
    window.open(`http://localhost:5000/uploads/${id}/${field}`, "_blank");
  };

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

  const handleAccept = async (id) => {
    if (!window.confirm("Accept all documents for this user?")) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/documents/accept/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to accept documents");
      }
      alert(data.message || "Documents accepted successfully");
      await fetchDocuments();
    } catch (error) {
      console.error(error);
      alert(error.message || "Error accepting documents");
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (id) => {
    setRejectUserId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectUserId(null);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectUserId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/documents/reject/${rejectUserId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectReason.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reject documents");
      }
      alert(data.message || "Documents rejected successfully");
      await fetchDocuments();
      closeRejectModal();
    } catch (error) {
      console.error(error);
      alert(error.message || "Error rejecting documents");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    let filtered = users;
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
    } else if (activeTab === "accepted") {
      filtered = filtered.filter((user) => user.status === "accepted");
    } else if (activeTab === "rejected") {
      filtered = filtered.filter((user) => user.status === "rejected");
    } else if (activeTab === "pending") {
      filtered = filtered.filter((user) => user.status === "pending");
    }
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
      id: "pending",
      label: "Pending",
      icon: Clock,
      count: users.filter((u) => u.status === "pending").length,
    },
    {
      id: "accepted",
      label: "Accepted",
      icon: CheckCircle,
      count: users.filter((u) => u.status === "accepted").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      icon: X,
      count: users.filter((u) => u.status === "rejected").length,
    },
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    const icons = {
      pending: Clock,
      accepted: CheckCircle,
      rejected: X,
    };
    const Icon = icons[status] || Clock;
    const style = styles[status] || styles.pending;
    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
      >
        <Icon size={12} />
        <span className="capitalize">{status || "pending"}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] bg-clip-text text-transparent mb-3">
            Document Manager
          </h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-amber-100 p-2 sm:p-3 rounded-lg">
                <Clock className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-emerald-100 p-2 sm:p-3 rounded-lg">
                <CheckCircle className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Accepted</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.status === "accepted").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                <X className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Rejected</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.status === "rejected").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <FileText className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Documents</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
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

        <div className="mb-6 sm:mb-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 text-sm sm:text-base rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent shadow-lg bg-white transition-all duration-200"
              />
            </div>

            <div className="relative sm:w-64">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3.5 sm:py-4 text-sm sm:text-base rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent shadow-lg bg-white font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:border-[#0f4c5c]"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label} ({tab.count})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {activeTab !== "all" && (
            <div className="max-w-4xl mx-auto mt-4">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] text-white px-4 py-3 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  {(() => {
                    const currentTab = tabs.find((t) => t.id === activeTab);
                    const Icon = currentTab?.icon || FolderOpen;
                    return (
                      <>
                        <Icon size={18} />
                        <span className="font-semibold text-sm sm:text-base">
                          Showing: {currentTab?.label} ({currentTab?.count})
                        </span>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setActiveTab("all")}
                  className="text-xs sm:text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-white rounded-xl sm:rounded-2xl shadow-md">
            <div className="bg-gray-100 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FileText className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg sm:text-xl font-medium mb-2">
              {searchQuery ? "No documents found" : "No documents uploaded yet"}
            </p>
            <p className="text-gray-400 text-sm sm:text-base px-4">
              {searchQuery
                ? "Try a different search term"
                : "Documents will appear here once uploaded"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => {
              const isComplete = user.aadhaar && user.marksheet && user.photo;
              const docCount =
                (user.aadhaar ? 1 : 0) +
                (user.marksheet ? 1 : 0) +
                (user.photo ? 1 : 0);
              const status = user.status || "pending";

              return (
                <div
                  key={user._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
                          <User className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                            {user.name}
                          </h3>
                          <p className="text-white/80 text-xs sm:text-sm">
                            {docCount}/3 Documents
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={loading}
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition-all"
                        title="Delete entire user record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mb-3">{getStatusBadge(status)}</div>

                    <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${(docCount / 3) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                    {user.aadhaar ? (
                      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                            <CreditCard
                              className="text-emerald-600"
                              size={18}
                            />
                          </div>
                          <span className="font-semibold text-gray-700 text-sm sm:text-base truncate">
                            Aadhaar Card
                          </span>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handlePreview(user._id, "aadhaar")}
                            className="text-emerald-600 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownload(user._id, "aadhaar")}
                            className="text-emerald-600 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDocument(user._id, "aadhaar")
                            }
                            className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 opacity-60">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-gray-200 p-1.5 sm:p-2 rounded-lg">
                            <CreditCard className="text-gray-400" size={18} />
                          </div>
                          <span className="font-medium text-gray-400 text-sm sm:text-base">
                            Aadhaar Card
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Not uploaded
                        </span>
                      </div>
                    )}

                    {user.marksheet ? (
                      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-200">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="bg-amber-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                            <FileText className="text-amber-600" size={18} />
                          </div>
                          <span className="font-semibold text-gray-700 text-sm sm:text-base truncate">
                            Marksheet
                          </span>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handlePreview(user._id, "marksheet")}
                            className="text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDownload(user._id, "marksheet")
                            }
                            className="text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDocument(user._id, "marksheet")
                            }
                            className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 opacity-60">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-gray-200 p-1.5 sm:p-2 rounded-lg">
                            <FileText className="text-gray-400" size={18} />
                          </div>
                          <span className="font-medium text-gray-400 text-sm sm:text-base">
                            Marksheet
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Not uploaded
                        </span>
                      </div>
                    )}

                    {user.photo ? (
                      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                            <Image className="text-purple-600" size={18} />
                          </div>
                          <span className="font-semibold text-gray-700 text-sm sm:text-base truncate">
                            Photo
                          </span>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handlePreview(user._id, "photo")}
                            className="text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownload(user._id, "photo")}
                            className="text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDocument(user._id, "photo")
                            }
                            className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-1.5 sm:p-2 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 opacity-60">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-gray-200 p-1.5 sm:p-2 rounded-lg">
                            <Image className="text-gray-400" size={18} />
                          </div>
                          <span className="font-medium text-gray-400 text-sm sm:text-base">
                            Photo
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Not uploaded
                        </span>
                      </div>
                    )}

                    {status === "rejected" && user.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-700 mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-600">
                          {user.rejectionReason}
                        </p>
                      </div>
                    )}

                    {status === "pending" && (
                      <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleAccept(user._id)}
                          disabled={loading || !isComplete}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                            isComplete
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                          title={
                            !isComplete
                              ? "All documents required"
                              : "Accept documents"
                          }
                        >
                          <Check size={18} />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => openRejectModal(user._id)}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <X size={18} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Reject Documents</h2>
                  <p className="text-white/80 text-sm">
                    Please provide a reason for rejection
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejecting these documents..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200"
                rows="4"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                This reason will be visible to the user
              </p>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={closeRejectModal}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}