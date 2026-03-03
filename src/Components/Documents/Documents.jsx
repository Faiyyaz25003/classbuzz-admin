

"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function fileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}

const S = {
  accepted: {
    label: "Accepted",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-600 border-red-200",
    bar: "bg-red-500",
  },
};

function Badge({ status }) {
  const c = S[status] || S.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-lg text-[11px] font-semibold border whitespace-nowrap ${c.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const DownIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const FileIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);
const CardIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);
const ImgIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const RefreshIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const SearchIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const UsersIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const ClockIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const AlertIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

function getDocIcon(name = "") {
  const l = name.toLowerCase();
  if (l.includes("aadhar") || l.includes("aadhaar") || l.includes("pan"))
    return <CardIcon />;
  if (l.includes("photo") || l.includes("pic")) return <ImgIcon />;
  return <FileIcon />;
}

function Btn({ onClick, title, color, children, disabled }) {
  const colors = {
    teal: "hover:bg-teal-50 hover:text-teal-600",
    green: "hover:bg-emerald-50 hover:text-emerald-600",
    red: "hover:bg-red-50 hover:text-red-500",
  };
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 transition-all disabled:opacity-40 ${colors[color]}`}
    >
      {children}
    </button>
  );
}

/* ─── Rejection Reason Modal ─── */
function RejectModal({ docName, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");

  const QUICK = [
    "Document is blurry or unreadable",
    "Wrong document uploaded",
    "Document is expired",
    "File is corrupted",
    "Signature is missing",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "modalIn 0.2s cubic-bezier(.22,.68,0,1.2)" }}
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <AlertIcon />
          </div>
          <div>
            <h2 className="text-white font-bold text-[15px] leading-tight">
              Reject Document
            </h2>
            <p className="text-red-100 text-xs mt-0.5">
              Provide a reason so the student knows what to fix
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="ml-auto w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <XIcon />
          </button>
        </div>

        {/* ── Document name pill ── */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
            <span className="text-red-400 flex-shrink-0">
              <FileIcon />
            </span>
            <span className="text-sm font-semibold text-red-700 truncate">
              {docName}
            </span>
          </div>
        </div>

        {/* ── Textarea ── */}
        <div className="px-6 pt-4">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Notes for Rejecting Document
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe why this document is being rejected..."
            rows={4}
            className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-400/25 focus:border-red-400 placeholder-slate-400 transition-all"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            {reason.trim().length > 0 ? (
              <span className="text-slate-500 font-medium">
                {reason.trim().length} characters
              </span>
            ) : (
              "Leave blank to send generic rejection reasons to the student"
            )}
          </p>
        </div>

        {/* ── Quick reason chips ── */}
        <div className="px-6 pt-3 pb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Quick select
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK.map((chip) => (
              <button
                key={chip}
                onClick={() => setReason(reason === chip ? "" : chip)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  reason === chip
                    ? "bg-red-500 text-white border-red-500 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason.trim())}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold transition-all shadow-sm shadow-red-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XIcon />
                Submit Rejection
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.94) translateY(10px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}

/* ─── Document Row ─── */
function DocRow({ doc, onAccept, onRejectClick, onDelete, actionLoading }) {
  const busy = actionLoading === doc._id;
  const up = !!doc.fileUrl;
  const fullUrl = fileUrl(doc.fileUrl);

  const handleView = () => {
    if (!fullUrl) return;
    window.open(fullUrl, "_blank", "noreferrer");
  };
  const handleDownload = () => {
    if (!fullUrl) return;
    const a = document.createElement("a");
    a.href = fullUrl;
    a.download = doc.fileUrl.split("/").pop() || doc.name || "document";
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        up
          ? "bg-white border-slate-100 shadow-sm hover:shadow hover:border-teal-200"
          : "bg-slate-50 border-dashed border-slate-200 opacity-60"
      }`}
    >
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${up ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-300"}`}
      >
        {getDocIcon(doc.name)}
      </span>
      <span
        className={`flex-1 text-sm font-medium ${up ? "text-slate-700" : "text-slate-400"}`}
      >
        {doc.name}
      </span>
      {up ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge status={doc.status} />
          <div className="flex items-center gap-0.5 pl-1 border-l border-slate-100">
            <button
              onClick={handleView}
              title="View"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
            >
              <EyeIcon />
            </button>
            <button
              onClick={handleDownload}
              title="Download"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
            >
              <DownIcon />
            </button>
            {doc.status !== "accepted" && (
              <Btn
                onClick={() => onAccept(doc._id)}
                title="Approve"
                color="green"
                disabled={busy}
              >
                <CheckIcon />
              </Btn>
            )}
            {doc.status !== "rejected" && (
              <Btn
                onClick={() => onRejectClick(doc)}
                title="Reject"
                color="red"
                disabled={busy}
              >
                <XIcon />
              </Btn>
            )}
            <Btn
              onClick={() => onDelete(doc._id)}
              title="Delete"
              color="red"
              disabled={busy}
            >
              <TrashIcon />
            </Btn>
          </div>
        </div>
      ) : (
        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg flex-shrink-0">
          Not uploaded
        </span>
      )}
    </div>
  );
}

/* ─── User Card ─── */
function UserCard({
  userName,
  docs,
  onAccept,
  onRejectClick,
  onDelete,
  actionLoading,
}) {
  const uploaded = docs.filter((d) => d.fileUrl);
  const allAccepted =
    uploaded.length > 0 && uploaded.every((d) => d.status === "accepted");
  const anyRejected = uploaded.some((d) => d.status === "rejected");
  const status = allAccepted
    ? "accepted"
    : anyRejected
      ? "rejected"
      : "pending";
  const cfg = S[status];
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const avatarCls = {
    accepted: "bg-emerald-100 text-emerald-700",
    pending: "bg-teal-100 text-teal-700",
    rejected: "bg-red-100 text-red-600",
  }[status];
  const progress = docs.length
    ? Math.round((uploaded.length / docs.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarCls}`}
            >
              {initials}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-800 leading-tight">
                {userName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {uploaded.length} of {docs.length} documents uploaded
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge status={status} />
            <button
              onClick={() =>
                onDelete(
                  null,
                  docs.map((d) => d._id),
                )
              }
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
              title="Delete all"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-slate-400 font-medium">
              Upload progress
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="h-px bg-slate-100 mx-5" />
      <div className="px-4 py-4 flex flex-col gap-2 flex-1">
        {docs.map((doc) => (
          <DocRow
            key={doc._id}
            doc={doc}
            onAccept={onAccept}
            onRejectClick={onRejectClick}
            onDelete={(id) => onDelete(id)}
            actionLoading={actionLoading}
          />
        ))}
      </div>
      {anyRejected && (
        <div className="mx-4 mb-4 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs text-red-500 font-medium">
            ⚠ Rejected:{" "}
            {docs
              .filter((d) => d.status === "rejected")
              .map((d) => d.name)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, iconBg, numColor, bg, border }) {
  return (
    <div
      className={`${bg} rounded-2xl border ${border} px-5 py-4 flex items-center gap-4`}
    >
      <div
        className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
        <p className={`text-2xl font-bold leading-none ${numColor}`}>{value}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ✅ Rejection modal state
  const [rejectModal, setRejectModal] = useState(null); // doc object
  const [rejectLoading, setRejectLoading] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/documents`);
      setDocuments(res.data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`${BASE_URL}/api/documents/accept/${id}`);
      setDocuments((p) =>
        p.map((d) => (d._id === id ? { ...d, status: "accepted" } : d)),
      );
    } catch (e) {
      alert(e.response?.data?.message || "Failed to accept");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Step 1: Open modal
  const handleRejectClick = (doc) => setRejectModal(doc);

  // ✅ Step 2: Submit reason → call API → close modal
  const handleRejectConfirm = async (reason) => {
    if (!rejectModal) return;
    const id = rejectModal._id;
    setRejectLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/documents/reject/${id}`, { reason });
      setDocuments((p) =>
        p.map((d) =>
          d._id === id
            ? { ...d, status: "rejected", rejectionReason: reason }
            : d,
        ),
      );
      setRejectModal(null);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to reject");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleDelete = async (id, ids) => {
    if (ids) {
      if (!confirm("Delete all documents for this user?")) return;
      for (const docId of ids) {
        try {
          await axios.delete(`${BASE_URL}/api/documents/${docId}`);
        } catch (e) {
          console.error(e);
        }
      }
      setDocuments((p) => p.filter((d) => !ids.includes(d._id)));
    } else {
      if (!confirm("Delete this document?")) return;
      setActionLoading(id);
      try {
        await axios.delete(`${BASE_URL}/api/documents/${id}`);
        setDocuments((p) => p.filter((d) => d._id !== id));
      } catch (e) {
        alert(e.response?.data?.message || "Failed to delete");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const grouped = documents.reduce((acc, doc) => {
    const id = doc.user?._id || "unknown";
    const name = doc.user?.name || "Unknown User";
    if (!acc[id]) acc[id] = { name, docs: [] };
    acc[id].docs.push(doc);
    return acc;
  }, {});

  const totalUsers = Object.keys(grouped).length;
  const acceptedCount = documents.filter((d) => d.status === "accepted").length;
  const pendingCount = documents.filter((d) => d.status === "pending").length;
  const rejectedCount = documents.filter((d) => d.status === "rejected").length;

  const filtered = Object.entries(grouped).filter(([, { name, docs }]) => {
    if (!name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "all") return true;
    return docs.some((d) => d.status === filter);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ✅ Rejection Modal */}
      {rejectModal && (
        <RejectModal
          docName={rejectModal.name}
          onConfirm={handleRejectConfirm}
          onCancel={() => !rejectLoading && setRejectModal(null)}
          loading={rejectLoading}
        />
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-7 h-7"
                stroke="white"
                strokeWidth={1.8}
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="12" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-600 tracking-tight">
                Document Review
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Review, approve, and manage student documents
              </p>
            </div>
          </div>
          <button
            onClick={fetchDocs}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm"
          >
            <RefreshIcon /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={totalUsers}
            numColor="text-slate-800"
            bg="bg-white"
            border="border-slate-200"
            iconBg="bg-slate-100"
            icon={
              <span className="text-slate-500">
                <UsersIcon />
              </span>
            }
          />
          <StatCard
            label="Accepted"
            value={acceptedCount}
            numColor="text-emerald-700"
            bg="bg-emerald-50"
            border="border-emerald-100"
            iconBg="bg-emerald-100"
            icon={
              <span className="text-emerald-500">
                <CheckIcon />
              </span>
            }
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            numColor="text-amber-700"
            bg="bg-amber-50"
            border="border-amber-100"
            iconBg="bg-amber-100"
            icon={
              <span className="text-amber-500">
                <ClockIcon />
              </span>
            }
          />
          <StatCard
            label="Rejected"
            value={rejectedCount}
            numColor="text-red-600"
            bg="bg-red-50"
            border="border-red-100"
            iconBg="bg-red-100"
            icon={
              <span className="text-red-500">
                <XIcon />
              </span>
            }
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5">
            {["all", "accepted", "pending", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 w-56 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-[3px] border-teal-100 border-t-teal-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">
              Loading documents…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-8 h-8"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              No documents found
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting the filter or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(([uid, { name, docs }]) => (
              <UserCard
                key={uid}
                userName={name}
                docs={docs}
                onAccept={handleAccept}
                onRejectClick={handleRejectClick}
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








































































































// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

// /* ─── Base API URL ─── */
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// // ✅ FIX: Helper to build correct full file URL from stored path like "uploads/xyz.pdf"
// function fileUrl(path) {
//   if (!path) return "";
//   if (path.startsWith("http")) return path; // already absolute
//   return `${BASE_URL}/${path.replace(/^\/+/, "")}`; // e.g. http://localhost:5000/uploads/file.pdf
// }

// /* ─── Status config ─── */
// const S = {
//   accepted: {
//     label: "Accepted",
//     dot: "bg-emerald-500",
//     badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     bar: "bg-emerald-500",
//   },
//   pending: {
//     label: "Pending",
//     dot: "bg-amber-400",
//     badge: "bg-amber-50  text-amber-700  border-amber-200",
//     bar: "bg-amber-400",
//   },
//   rejected: {
//     label: "Rejected",
//     dot: "bg-red-500",
//     badge: "bg-red-50    text-red-600    border-red-200",
//     bar: "bg-red-500",
//   },
// };

// function Badge({ status }) {
//   const c = S[status] || S.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-lg text-[11px] font-semibold border whitespace-nowrap ${c.badge}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
//       {c.label}
//     </span>
//   );
// }

// /* ─── Icons ─── */
// const EyeIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );
// const DownIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//     <polyline points="7 10 12 15 17 10" />
//     <line x1="12" y1="15" x2="12" y2="3" />
//   </svg>
// );
// const CheckIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2.5}
//   >
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );
// const XIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2.5}
//   >
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );
// const TrashIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//     <path d="M10 11v6M14 11v6" />
//   </svg>
// );
// const FileIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
//     <polyline points="13 2 13 9 20 9" />
//   </svg>
// );
// const CardIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <rect x="2" y="5" width="20" height="14" rx="2" />
//     <path d="M2 10h20" />
//   </svg>
// );
// const ImgIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <rect x="3" y="3" width="18" height="18" rx="2" />
//     <circle cx="8.5" cy="8.5" r="1.5" />
//     <polyline points="21 15 16 10 5 21" />
//   </svg>
// );
// const RefreshIcon = () => (
//   <svg
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path d="M23 4v6h-6" />
//     <path d="M1 20v-6h6" />
//     <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
//   </svg>
// );
// const SearchIcon = () => (
//   <svg
//     className="w-3.5 h-3.5"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//   </svg>
// );
// const UsersIcon = () => (
//   <svg
//     className="w-5 h-5"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={1.8}
//   >
//     <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 00-3-3.87" />
//     <path d="M16 3.13a4 4 0 010 7.75" />
//   </svg>
// );
// const ClockIcon = () => (
//   <svg
//     className="w-5 h-5"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <circle cx="12" cy="12" r="10" />
//     <polyline points="12 6 12 12 16 14" />
//   </svg>
// );

// function getDocIcon(name = "") {
//   const l = name.toLowerCase();
//   if (l.includes("aadhar") || l.includes("aadhaar") || l.includes("pan"))
//     return <CardIcon />;
//   if (l.includes("photo") || l.includes("pic")) return <ImgIcon />;
//   return <FileIcon />;
// }

// function Btn({ onClick, title, color, children, disabled }) {
//   const colors = {
//     teal: "hover:bg-teal-50    hover:text-teal-600",
//     green: "hover:bg-emerald-50 hover:text-emerald-600",
//     red: "hover:bg-red-50     hover:text-red-500",
//   };
//   return (
//     <button
//       onClick={onClick}
//       title={title}
//       disabled={disabled}
//       className={`w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 transition-all disabled:opacity-40 ${colors[color]}`}
//     >
//       {children}
//     </button>
//   );
// }

// /* ─── Document Row ─── */
// function DocRow({ doc, onAccept, onReject, onDelete, actionLoading }) {
//   const busy = actionLoading === doc._id;
//   const up = !!doc.fileUrl;

//   // ✅ FIX: Build correct full URL
//   const fullUrl = fileUrl(doc.fileUrl);

//   // ✅ FIX: View opens in new tab correctly
//   const handleView = () => {
//     if (!fullUrl) return;
//     window.open(fullUrl, "_blank", "noreferrer");
//   };

//   // ✅ FIX: Use direct anchor with target="_blank" + download attribute
//   // Blob fetch won't work cross-origin (CORS). Instead, open via anchor.
//   // The browser will download because the server serves /uploads as static files.
//   const handleDownload = () => {
//     if (!fullUrl) return;
//     const filename = doc.fileUrl.split("/").pop() || doc.name || "document";
//     const a = document.createElement("a");
//     a.href = fullUrl;
//     a.download = filename;
//     a.target = "_blank";
//     a.rel = "noreferrer";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   return (
//     <div
//       className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
//         up
//           ? "bg-white border-slate-100 shadow-sm hover:shadow hover:border-teal-200"
//           : "bg-slate-50 border-dashed border-slate-200 opacity-60"
//       }`}
//     >
//       <span
//         className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${up ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-300"}`}
//       >
//         {getDocIcon(doc.name)}
//       </span>

//       <span
//         className={`flex-1 text-sm font-medium ${up ? "text-slate-700" : "text-slate-400"}`}
//       >
//         {doc.name}
//       </span>

//       {up ? (
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <Badge status={doc.status} />
//           <div className="flex items-center gap-0.5 pl-1 border-l border-slate-100">
//             {/* ✅ FIX: Use buttons with onClick handlers — NOT <a> tags */}
//             <button
//               onClick={handleView}
//               className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
//               title="View"
//             >
//               <EyeIcon />
//             </button>
//             <button
//               onClick={handleDownload}
//               className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
//               title="Download"
//             >
//               <DownIcon />
//             </button>
//             {doc.status !== "accepted" && (
//               <Btn
//                 onClick={() => onAccept(doc._id)}
//                 title="Approve"
//                 color="green"
//                 disabled={busy}
//               >
//                 <CheckIcon />
//               </Btn>
//             )}
//             {doc.status !== "rejected" && (
//               <Btn
//                 onClick={() => onReject(doc._id)}
//                 title="Reject"
//                 color="red"
//                 disabled={busy}
//               >
//                 <XIcon />
//               </Btn>
//             )}
//             <Btn
//               onClick={() => onDelete(doc._id)}
//               title="Delete"
//               color="red"
//               disabled={busy}
//             >
//               <TrashIcon />
//             </Btn>
//           </div>
//         </div>
//       ) : (
//         <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg flex-shrink-0">
//           Not uploaded
//         </span>
//       )}
//     </div>
//   );
// }

// /* ─── User Card ─── */
// function UserCard({
//   userName,
//   docs,
//   onAccept,
//   onReject,
//   onDelete,
//   actionLoading,
// }) {
//   const uploaded = docs.filter((d) => d.fileUrl);
//   const allAccepted =
//     uploaded.length > 0 && uploaded.every((d) => d.status === "accepted");
//   const anyRejected = uploaded.some((d) => d.status === "rejected");
//   const status = allAccepted
//     ? "accepted"
//     : anyRejected
//       ? "rejected"
//       : "pending";
//   const cfg = S[status];

//   const initials = userName
//     .split(" ")
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
//   const avatarCls = {
//     accepted: "bg-emerald-100 text-emerald-700",
//     pending: "bg-teal-100   text-teal-700",
//     rejected: "bg-red-100    text-red-600",
//   }[status];

//   const progress = docs.length
//     ? Math.round((uploaded.length / docs.length) * 100)
//     : 0;

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
//       <div className="px-5 pt-5 pb-4">
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <div
//               className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarCls}`}
//             >
//               {initials}
//             </div>
//             <div>
//               <h3 className="text-[15px] font-semibold text-slate-800 leading-tight">
//                 {userName}
//               </h3>
//               <p className="text-xs text-slate-400 mt-0.5">
//                 {uploaded.length} of {docs.length} documents uploaded
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-1.5 flex-shrink-0">
//             <Badge status={status} />
//             <button
//               onClick={() =>
//                 onDelete(
//                   null,
//                   docs.map((d) => d._id),
//                 )
//               }
//               className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
//               title="Delete all"
//             >
//               <TrashIcon />
//             </button>
//           </div>
//         </div>

//         <div className="mt-4">
//           <div className="flex justify-between items-center mb-1.5">
//             <span className="text-[11px] text-slate-400 font-medium">
//               Upload progress
//             </span>
//             <span className="text-[11px] font-semibold text-slate-500">
//               {progress}%
//             </span>
//           </div>
//           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//             <div
//               className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="h-px bg-slate-100 mx-5" />

//       <div className="px-4 py-4 flex flex-col gap-2 flex-1">
//         {docs.map((doc) => (
//           <DocRow
//             key={doc._id}
//             doc={doc}
//             onAccept={onAccept}
//             onReject={onReject}
//             onDelete={(id) => onDelete(id)}
//             actionLoading={actionLoading}
//           />
//         ))}
//       </div>

//       {anyRejected && (
//         <div className="mx-4 mb-4 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl">
//           <p className="text-xs text-red-500 font-medium">
//             ⚠ Rejected:{" "}
//             {docs
//               .filter((d) => d.status === "rejected")
//               .map((d) => d.name)
//               .join(", ")}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─── Stat Card ─── */
// function StatCard({ label, value, icon, iconBg, numColor, bg, border }) {
//   return (
//     <div
//       className={`${bg} rounded-2xl border ${border} px-5 py-4 flex items-center gap-4`}
//     >
//       <div
//         className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
//       >
//         {icon}
//       </div>
//       <div>
//         <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
//         <p className={`text-2xl font-bold leading-none ${numColor}`}>{value}</p>
//       </div>
//     </div>
//   );
// }

// /* ─── Main Page ─── */
// export default function AdminDocuments() {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   // ✅ FIX: Renamed to avoid conflict with browser's native fetch
//   const fetchDocs = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/api/documents`);
//       setDocuments(res.data);
//     } catch (e) {
//       console.error("Fetch error:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocs();
//   }, []);

//   const handleAccept = async (id) => {
//     setActionLoading(id);
//     try {
//       await axios.put(`${BASE_URL}/api/documents/accept/${id}`);
//       setDocuments((p) =>
//         p.map((d) => (d._id === id ? { ...d, status: "accepted" } : d)),
//       );
//     } catch (e) {
//       alert(e.response?.data?.message || "Failed to accept");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleReject = async (id) => {
//     setActionLoading(id);
//     try {
//       await axios.put(`${BASE_URL}/api/documents/reject/${id}`);
//       setDocuments((p) =>
//         p.map((d) => (d._id === id ? { ...d, status: "rejected" } : d)),
//       );
//     } catch (e) {
//       alert(e.response?.data?.message || "Failed to reject");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ✅ FIX: handleDelete now correctly supports both single and bulk delete
//   const handleDelete = async (id, ids) => {
//     if (ids) {
//       // Bulk delete
//       if (!confirm("Delete all documents for this user?")) return;
//       for (const docId of ids) {
//         try {
//           await axios.delete(`${BASE_URL}/api/documents/${docId}`);
//         } catch (e) {
//           console.error("Delete error for", docId, e);
//         }
//       }
//       setDocuments((p) => p.filter((d) => !ids.includes(d._id)));
//     } else {
//       // Single delete
//       if (!confirm("Delete this document?")) return;
//       setActionLoading(id);
//       try {
//         await axios.delete(`${BASE_URL}/api/documents/${id}`);
//         setDocuments((p) => p.filter((d) => d._id !== id));
//       } catch (e) {
//         alert(e.response?.data?.message || "Failed to delete");
//       } finally {
//         setActionLoading(null);
//       }
//     }
//   };

//   const grouped = documents.reduce((acc, doc) => {
//     const id = doc.user?._id || "unknown";
//     const name = doc.user?.name || "Unknown User";
//     if (!acc[id]) acc[id] = { name, docs: [] };
//     acc[id].docs.push(doc);
//     return acc;
//   }, {});

//   const totalUsers = Object.keys(grouped).length;
//   const acceptedCount = documents.filter((d) => d.status === "accepted").length;
//   const pendingCount = documents.filter((d) => d.status === "pending").length;
//   const rejectedCount = documents.filter((d) => d.status === "rejected").length;

//   const filtered = Object.entries(grouped).filter(([, { name, docs }]) => {
//     if (!name.toLowerCase().includes(search.toLowerCase())) return false;
//     if (filter === "all") return true;
//     return docs.some((d) => d.status === filter);
//   });

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="w-7 h-7"
//                 stroke="white"
//                 strokeWidth={1.8}
//               >
//                 <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
//                 <polyline points="14 2 14 8 20 8" />
//                 <line x1="8" y1="13" x2="16" y2="13" />
//                 <line x1="8" y1="17" x2="12" y2="17" />
//               </svg>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-teal-600 tracking-tight">
//                 Document Review
//               </h1>
//               <p className="text-sm text-slate-500 mt-0.5">
//                 Review, approve, and manage student documents
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={fetchDocs}
//             className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm"
//           >
//             <RefreshIcon /> Refresh
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <StatCard
//             label="Total Users"
//             value={totalUsers}
//             numColor="text-slate-800"
//             bg="bg-white"
//             border="border-slate-200"
//             iconBg="bg-slate-100"
//             icon={
//               <span className="text-slate-500">
//                 <UsersIcon />
//               </span>
//             }
//           />
//           <StatCard
//             label="Accepted"
//             value={acceptedCount}
//             numColor="text-emerald-700"
//             bg="bg-emerald-50"
//             border="border-emerald-100"
//             iconBg="bg-emerald-100"
//             icon={
//               <span className="text-emerald-500">
//                 <CheckIcon />
//               </span>
//             }
//           />
//           <StatCard
//             label="Pending"
//             value={pendingCount}
//             numColor="text-amber-700"
//             bg="bg-amber-50"
//             border="border-amber-100"
//             iconBg="bg-amber-100"
//             icon={
//               <span className="text-amber-500">
//                 <ClockIcon />
//               </span>
//             }
//           />
//           <StatCard
//             label="Rejected"
//             value={rejectedCount}
//             numColor="text-red-600"
//             bg="bg-red-50"
//             border="border-red-100"
//             iconBg="bg-red-100"
//             icon={
//               <span className="text-red-500">
//                 <XIcon />
//               </span>
//             }
//           />
//         </div>

//         <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-3 shadow-sm">
//           <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5">
//             {["all", "accepted", "pending", "rejected"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
//                   filter === f
//                     ? "bg-teal-600 text-white shadow-sm"
//                     : "text-slate-500 hover:text-slate-700"
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//           <div className="relative ml-auto">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//               <SearchIcon />
//             </span>
//             <input
//               type="text"
//               placeholder="Search by name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 w-56 transition-all"
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-32 gap-4">
//             <div className="w-10 h-10 border-[3px] border-teal-100 border-t-teal-600 rounded-full animate-spin" />
//             <p className="text-sm text-slate-400 font-medium">
//               Loading documents…
//             </p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-32 gap-3">
//             <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="w-8 h-8"
//                 stroke="currentColor"
//                 strokeWidth={1.5}
//               >
//                 <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
//                 <polyline points="14 2 14 8 20 8" />
//               </svg>
//             </div>
//             <p className="text-sm font-semibold text-slate-500">
//               No documents found
//             </p>
//             <p className="text-xs text-slate-400">
//               Try adjusting the filter or search term
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {filtered.map(([uid, { name, docs }]) => (
//               <UserCard
//                 key={uid}
//                 userName={name}
//                 docs={docs}
//                 onAccept={handleAccept}
//                 onReject={handleReject}
//                 onDelete={handleDelete}
//                 actionLoading={actionLoading}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }