"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const STATUS_CONFIG = {
  accepted: {
    label: "Accepted",
    icon: "✓",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    cardGradient: "from-emerald-500 to-teal-600",
  },
  pending: {
    label: "Pending",
    icon: "○",
    gradient: "from-amber-400 to-orange-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    cardGradient: "from-violet-500 to-indigo-600",
  },
  rejected: {
    label: "Rejected",
    icon: "✕",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    cardGradient: "from-violet-500 to-indigo-600",
  },
};

const DOC_ICONS = {
  aadhaar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  marksheet: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  photo: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  default: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  ),
};

function getDocIcon(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("aadhar") || lower.includes("aadhaar"))
    return DOC_ICONS.aadhaar;
  if (lower.includes("mark") || lower.includes("sheet"))
    return DOC_ICONS.marksheet;
  if (lower.includes("photo") || lower.includes("pic")) return DOC_ICONS.photo;
  return DOC_ICONS.default;
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} border`}
    >
      <span className="text-sm leading-none">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

function DocumentRow({ doc, onAccept, onReject, onDelete, actionLoading }) {
  const isLoading = actionLoading === doc._id;
  const uploaded = !!doc.fileUrl;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        uploaded
          ? "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100"
          : "bg-gray-50 border border-dashed border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`p-1.5 rounded-lg ${uploaded ? "text-indigo-500 bg-indigo-50" : "text-gray-300 bg-gray-100"}`}
        >
          {getDocIcon(doc.name)}
        </span>
        <span
          className={`text-sm font-medium ${uploaded ? "text-gray-800" : "text-gray-400"}`}
        >
          {doc.name}
        </span>
      </div>

      {uploaded ? (
        <div className="flex items-center gap-2">
          <StatusBadge status={doc.status} />
          <div className="flex items-center gap-1 ml-2">
            {/* View */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="View"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </a>
            {/* Download */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.fileUrl}`}
              download
              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Download"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
            {/* Accept */}
            {doc.status !== "accepted" && (
              <button
                onClick={() => onAccept(doc._id)}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                title="Accept"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            )}
            {/* Reject */}
            {doc.status !== "rejected" && (
              <button
                onClick={() => onReject(doc._id)}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40"
                title="Reject"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {/* Delete */}
            <button
              onClick={() => onDelete(doc._id)}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
              title="Delete"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
          Not uploaded
        </span>
      )}
    </div>
  );
}

function UserCard({
  userName,
  docs,
  onAccept,
  onReject,
  onDelete,
  actionLoading,
}) {
  const uploaded = docs.filter((d) => d.fileUrl);
  const total = docs.length;
  const allAccepted =
    uploaded.length > 0 && uploaded.every((d) => d.status === "accepted");
  const anyRejected = uploaded.some((d) => d.status === "rejected");
  const overallStatus = allAccepted
    ? "accepted"
    : anyRejected
      ? "rejected"
      : "pending";
  const cfg = STATUS_CONFIG[overallStatus];
  const rejectedDocs = uploaded
    .filter((d) => d.status === "rejected")
    .map((d) => d.name);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Card Header */}
      <div className={`bg-gradient-to-br ${cfg.cardGradient} p-5 text-white`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold leading-tight">{userName}</h3>
            <p className="text-white/70 text-sm mt-0.5">
              {uploaded.length}/{total} Documents
            </p>
          </div>
          <button
            onClick={() =>
              onDelete(
                null,
                docs.map((d) => d._id),
              )
            }
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            title="Delete all user documents"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
          </button>
        </div>
        {/* Overall Status Bar */}
        <div
          className={`w-full rounded-full bg-gradient-to-r ${cfg.gradient} p-0.5`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
            <span className="text-sm font-medium">{cfg.icon}</span>
            <span className="text-sm font-semibold">{cfg.label}</span>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="p-4 space-y-2 flex-1">
        {docs.map((doc) => (
          <DocumentRow
            key={doc._id}
            doc={doc}
            onAccept={onAccept}
            onReject={onReject}
            onDelete={(id) => onDelete(id)}
            actionLoading={actionLoading}
          />
        ))}
      </div>

      {/* Rejection reason */}
      {anyRejected && rejectedDocs.length > 0 && (
        <div className="px-4 pb-4">
          <p className="text-xs text-rose-500 font-medium">
            Reason: Missing {rejectedDocs.join(" and ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/documents`);
      setDocuments(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`http://localhost:5000/api/documents/accept/${id}`);
      setDocuments((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: "accepted" } : d)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`http://localhost:5000/api/documents/reject/${id}`);
      setDocuments((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: "rejected" } : d)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setActionLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Group by user
  const grouped = documents.reduce((acc, doc) => {
    const userId = doc.user?._id || "unknown";
    const userName = doc.user?.name || "Unknown User";
    if (!acc[userId]) acc[userId] = { userName, docs: [] };
    acc[userId].docs.push(doc);
    return acc;
  }, {});

  // Stats
  const totalDocs = documents.length;
  const acceptedCount = documents.filter((d) => d.status === "accepted").length;
  const pendingCount = documents.filter((d) => d.status === "pending").length;
  const rejectedCount = documents.filter((d) => d.status === "rejected").length;
  const totalUsers = Object.keys(grouped).length;

  // Filter + search
  const filteredGroups = Object.entries(grouped).filter(
    ([, { userName, docs }]) => {
      const matchSearch = userName.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (filter === "all") return true;
      return docs.some((d) => d.status === filter);
    },
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              📂 Document Review
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalUsers} users · {totalDocs} documents
            </p>
          </div>
          <button
            onClick={fetchDocuments}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: totalUsers,
              color: "from-violet-500 to-indigo-600",
              icon: "👥",
            },
            {
              label: "Accepted",
              value: acceptedCount,
              color: "from-emerald-400 to-teal-500",
              icon: "✅",
            },
            {
              label: "Pending",
              value: pendingCount,
              color: "from-amber-400 to-orange-400",
              icon: "⏳",
            },
            {
              label: "Rejected",
              value: rejectedCount,
              color: "from-rose-400 to-pink-500",
              icon: "❌",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-lg`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-white/80 text-sm font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-white rounded-xl border border-gray-200 p-1 gap-1 shadow-sm">
            {["all", "accepted", "pending", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading documents...</p>
            </div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm mt-1">
              Try changing the filter or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGroups.map(([userId, { userName, docs }]) => (
              <UserCard
                key={userId}
                userName={userName}
                docs={docs}
                onAccept={handleAccept}
                onReject={handleReject}
                onDelete={handleDelete}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
