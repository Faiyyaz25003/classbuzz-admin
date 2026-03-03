// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// const STATUS_CONFIG = {
//   accepted: {
//     label: "Accepted",
//     icon: "✓",
//     gradient: "from-emerald-400 to-teal-500",
//     bg: "bg-emerald-50",
//     text: "text-emerald-700",
//     border: "border-emerald-200",
//     cardGradient: "from-emerald-500 to-teal-600",
//   },
//   pending: {
//     label: "Pending",
//     icon: "○",
//     gradient: "from-amber-400 to-orange-400",
//     bg: "bg-amber-50",
//     text: "text-amber-700",
//     border: "border-amber-200",
//     cardGradient: "from-violet-500 to-indigo-600",
//   },
//   rejected: {
//     label: "Rejected",
//     icon: "✕",
//     gradient: "from-rose-400 to-pink-500",
//     bg: "bg-rose-50",
//     text: "text-rose-700",
//     border: "border-rose-200",
//     cardGradient: "from-violet-500 to-indigo-600",
//   },
// };

// const DOC_ICONS = {
//   aadhaar: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       className="w-4 h-4"
//       stroke="currentColor"
//       strokeWidth={1.8}
//     >
//       <rect x="2" y="5" width="20" height="14" rx="2" />
//       <path d="M2 10h20" />
//     </svg>
//   ),
//   marksheet: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       className="w-4 h-4"
//       stroke="currentColor"
//       strokeWidth={1.8}
//     >
//       <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
//       <polyline points="14 2 14 8 20 8" />
//       <line x1="8" y1="13" x2="16" y2="13" />
//       <line x1="8" y1="17" x2="12" y2="17" />
//     </svg>
//   ),
//   photo: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       className="w-4 h-4"
//       stroke="currentColor"
//       strokeWidth={1.8}
//     >
//       <rect x="3" y="3" width="18" height="18" rx="2" />
//       <circle cx="8.5" cy="8.5" r="1.5" />
//       <polyline points="21 15 16 10 5 21" />
//     </svg>
//   ),
//   default: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       className="w-4 h-4"
//       stroke="currentColor"
//       strokeWidth={1.8}
//     >
//       <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
//       <polyline points="13 2 13 9 20 9" />
//     </svg>
//   ),
// };

// function getDocIcon(name = "") {
//   const lower = name.toLowerCase();
//   if (lower.includes("aadhar") || lower.includes("aadhaar"))
//     return DOC_ICONS.aadhaar;
//   if (lower.includes("mark") || lower.includes("sheet"))
//     return DOC_ICONS.marksheet;
//   if (lower.includes("photo") || lower.includes("pic")) return DOC_ICONS.photo;
//   return DOC_ICONS.default;
// }

// function StatusBadge({ status }) {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} border`}
//     >
//       <span className="text-sm leading-none">{cfg.icon}</span>
//       {cfg.label}
//     </span>
//   );
// }

// function DocumentRow({ doc, onAccept, onReject, onDelete, actionLoading }) {
//   const isLoading = actionLoading === doc._id;
//   const uploaded = !!doc.fileUrl;

//   return (
//     <div
//       className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
//         uploaded
//           ? "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100"
//           : "bg-gray-50 border border-dashed border-gray-200"
//       }`}
//     >
//       <div className="flex items-center gap-3">
//         <span
//           className={`p-1.5 rounded-lg ${uploaded ? "text-indigo-500 bg-indigo-50" : "text-gray-300 bg-gray-100"}`}
//         >
//           {getDocIcon(doc.name)}
//         </span>
//         <span
//           className={`text-sm font-medium ${uploaded ? "text-gray-800" : "text-gray-400"}`}
//         >
//           {doc.name}
//         </span>
//       </div>

//       {uploaded ? (
//         <div className="flex items-center gap-2">
//           <StatusBadge status={doc.status} />
//           <div className="flex items-center gap-1 ml-2">
//             {/* View */}
//             <a
//               href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.fileUrl}`}
//               target="_blank"
//               rel="noreferrer"
//               className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
//               title="View"
//             >
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="w-4 h-4"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                 <circle cx="12" cy="12" r="3" />
//               </svg>
//             </a>
//             {/* Download */}
//             <a
//               href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.fileUrl}`}
//               download
//               className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
//               title="Download"
//             >
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="w-4 h-4"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//                 <polyline points="7 10 12 15 17 10" />
//                 <line x1="12" y1="15" x2="12" y2="3" />
//               </svg>
//             </a>
//             {/* Accept */}
//             {doc.status !== "accepted" && (
//               <button
//                 onClick={() => onAccept(doc._id)}
//                 disabled={isLoading}
//                 className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
//                 title="Accept"
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   className="w-4 h-4"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </button>
//             )}
//             {/* Reject */}
//             {doc.status !== "rejected" && (
//               <button
//                 onClick={() => onReject(doc._id)}
//                 disabled={isLoading}
//                 className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40"
//                 title="Reject"
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   className="w-4 h-4"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <line x1="18" y1="6" x2="6" y2="18" />
//                   <line x1="6" y1="6" x2="18" y2="18" />
//                 </svg>
//               </button>
//             )}
//             {/* Delete */}
//             <button
//               onClick={() => onDelete(doc._id)}
//               disabled={isLoading}
//               className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
//               title="Delete"
//             >
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="w-4 h-4"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <polyline points="3 6 5 6 21 6" />
//                 <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//                 <path d="M10 11v6M14 11v6" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       ) : (
//         <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
//           Not uploaded
//         </span>
//       )}
//     </div>
//   );
// }

// function UserCard({
//   userName,
//   docs,
//   onAccept,
//   onReject,
//   onDelete,
//   actionLoading,
// }) {
//   const uploaded = docs.filter((d) => d.fileUrl);
//   const total = docs.length;
//   const allAccepted =
//     uploaded.length > 0 && uploaded.every((d) => d.status === "accepted");
//   const anyRejected = uploaded.some((d) => d.status === "rejected");
//   const overallStatus = allAccepted
//     ? "accepted"
//     : anyRejected
//       ? "rejected"
//       : "pending";
//   const cfg = STATUS_CONFIG[overallStatus];
//   const rejectedDocs = uploaded
//     .filter((d) => d.status === "rejected")
//     .map((d) => d.name);

//   return (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
//       {/* Card Header */}
//       <div className={`bg-gradient-to-br ${cfg.cardGradient} p-5 text-white`}>
//         <div className="flex items-start justify-between mb-3">
//           <div>
//             <h3 className="text-lg font-bold leading-tight">{userName}</h3>
//             <p className="text-white/70 text-sm mt-0.5">
//               {uploaded.length}/{total} Documents
//             </p>
//           </div>
//           <button
//             onClick={() =>
//               onDelete(
//                 null,
//                 docs.map((d) => d._id),
//               )
//             }
//             className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
//             title="Delete all user documents"
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               className="w-4 h-4"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <polyline points="3 6 5 6 21 6" />
//               <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//             </svg>
//           </button>
//         </div>
//         {/* Overall Status Bar */}
//         <div
//           className={`w-full rounded-full bg-gradient-to-r ${cfg.gradient} p-0.5`}
//         >
//           <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
//             <span className="text-sm font-medium">{cfg.icon}</span>
//             <span className="text-sm font-semibold">{cfg.label}</span>
//           </div>
//         </div>
//       </div>

//       {/* Documents List */}
//       <div className="p-4 space-y-2 flex-1">
//         {docs.map((doc) => (
//           <DocumentRow
//             key={doc._id}
//             doc={doc}
//             onAccept={onAccept}
//             onReject={onReject}
//             onDelete={(id) => onDelete(id)}
//             actionLoading={actionLoading}
//           />
//         ))}
//       </div>

//       {/* Rejection reason */}
//       {anyRejected && rejectedDocs.length > 0 && (
//         <div className="px-4 pb-4">
//           <p className="text-xs text-rose-500 font-medium">
//             Reason: Missing {rejectedDocs.join(" and ")}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function AdminDocuments() {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   const fetchDocuments = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`http://localhost:5000/api/documents`);
//       setDocuments(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const handleAccept = async (id) => {
//     setActionLoading(id);
//     try {
//       await axios.put(`http://localhost:5000/api/documents/accept/${id}`);
//       setDocuments((prev) =>
//         prev.map((d) => (d._id === id ? { ...d, status: "accepted" } : d)),
//       );
//     } catch (err) {
//       alert(err.response?.data?.message || "Action failed");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleReject = async (id) => {
//     setActionLoading(id);
//     try {
//       await axios.put(`http://localhost:5000/api/documents/reject/${id}`);
//       setDocuments((prev) =>
//         prev.map((d) => (d._id === id ? { ...d, status: "rejected" } : d)),
//       );
//     } catch (err) {
//       alert(err.response?.data?.message || "Action failed");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this document?")) return;
//     setActionLoading(id);
//     try {
//       await axios.delete(`http://localhost:5000/api/documents/${id}`);
//       setDocuments((prev) => prev.filter((d) => d._id !== id));
//     } catch (err) {
//       alert(err.response?.data?.message || "Delete failed");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Group by user
//   const grouped = documents.reduce((acc, doc) => {
//     const userId = doc.user?._id || "unknown";
//     const userName = doc.user?.name || "Unknown User";
//     if (!acc[userId]) acc[userId] = { userName, docs: [] };
//     acc[userId].docs.push(doc);
//     return acc;
//   }, {});

//   // Stats
//   const totalDocs = documents.length;
//   const acceptedCount = documents.filter((d) => d.status === "accepted").length;
//   const pendingCount = documents.filter((d) => d.status === "pending").length;
//   const rejectedCount = documents.filter((d) => d.status === "rejected").length;
//   const totalUsers = Object.keys(grouped).length;

//   // Filter + search
//   const filteredGroups = Object.entries(grouped).filter(
//     ([, { userName, docs }]) => {
//       const matchSearch = userName.toLowerCase().includes(search.toLowerCase());
//       if (!matchSearch) return false;
//       if (filter === "all") return true;
//       return docs.some((d) => d.status === filter);
//     },
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
//       {/* Top bar */}
//       <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//               📂 Document Review
//             </h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               {totalUsers} users · {totalDocs} documents
//             </p>
//           </div>
//           <button
//             onClick={fetchDocuments}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               className="w-4 h-4"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path d="M23 4v6h-6" />
//               <path d="M1 20v-6h6" />
//               <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
//             </svg>
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="px-8 py-6">
//         {/* Stats */}
//         <div className="grid grid-cols-4 gap-4 mb-8">
//           {[
//             {
//               label: "Total Users",
//               value: totalUsers,
//               color: "from-violet-500 to-indigo-600",
//               icon: "👥",
//             },
//             {
//               label: "Accepted",
//               value: acceptedCount,
//               color: "from-emerald-400 to-teal-500",
//               icon: "✅",
//             },
//             {
//               label: "Pending",
//               value: pendingCount,
//               color: "from-amber-400 to-orange-400",
//               icon: "⏳",
//             },
//             {
//               label: "Rejected",
//               value: rejectedCount,
//               color: "from-rose-400 to-pink-500",
//               icon: "❌",
//             },
//           ].map((stat) => (
//             <div
//               key={stat.label}
//               className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-lg`}
//             >
//               <div className="text-2xl mb-1">{stat.icon}</div>
//               <div className="text-3xl font-bold">{stat.value}</div>
//               <div className="text-white/80 text-sm font-medium mt-1">
//                 {stat.label}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Filters */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="flex bg-white rounded-xl border border-gray-200 p-1 gap-1 shadow-sm">
//             {["all", "accepted", "pending", "rejected"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
//                   filter === f
//                     ? "bg-indigo-600 text-white shadow-sm"
//                     : "text-gray-500 hover:text-gray-800"
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//           <div className="relative flex-1 max-w-xs">
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <circle cx="11" cy="11" r="8" />
//               <line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search by name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="flex flex-col items-center gap-4">
//               <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
//               <p className="text-gray-500 text-sm">Loading documents...</p>
//             </div>
//           </div>
//         ) : filteredGroups.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
//             <div className="text-6xl mb-4">📭</div>
//             <p className="text-lg font-medium">No documents found</p>
//             <p className="text-sm mt-1">
//               Try changing the filter or search term
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredGroups.map(([userId, { userName, docs }]) => (
//               <UserCard
//                 key={userId}
//                 userName={userName}
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

"use client";

import { useState, useEffect } from "react";
import axios from "axios";

/* ─── Status config ─── */
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
    badge: "bg-amber-50  text-amber-700  border-amber-200",
    bar: "bg-amber-400",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-500",
    badge: "bg-red-50    text-red-600    border-red-200",
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

/* ─── Icons ─── */
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

function getDocIcon(name = "") {
  const l = name.toLowerCase();
  if (l.includes("aadhar") || l.includes("aadhaar") || l.includes("pan"))
    return <CardIcon />;
  if (l.includes("photo") || l.includes("pic")) return <ImgIcon />;
  return <FileIcon />;
}

/* ─── Action button ─── */
function Btn({ onClick, title, color, children, disabled }) {
  const colors = {
    teal: "hover:bg-teal-50    hover:text-teal-600",
    green: "hover:bg-emerald-50 hover:text-emerald-600",
    red: "hover:bg-red-50     hover:text-red-500",
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

/* ─── Document Row ─── */
function DocRow({ doc, onAccept, onReject, onDelete, actionLoading }) {
  const busy = actionLoading === doc._id;
  const up = !!doc.fileUrl;
  const API = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        up
          ? "bg-white border-slate-100 shadow-sm hover:shadow hover:border-teal-200"
          : "bg-slate-50 border-dashed border-slate-200 opacity-60"
      }`}
    >
      {/* Icon */}
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          up ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-300"
        }`}
      >
        {getDocIcon(doc.name)}
      </span>

      {/* Name — takes all remaining space */}
      <span
        className={`flex-1 text-sm font-medium ${up ? "text-slate-700" : "text-slate-400"}`}
      >
        {doc.name}
      </span>

      {/* Right side */}
      {up ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge status={doc.status} />
          <div className="flex items-center gap-0.5 pl-1 border-l border-slate-100">
            <a
              href={`${API}/${doc.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
              title="View"
            >
              <EyeIcon />
            </a>
            <a
              href={`${API}/${doc.fileUrl}`}
              download
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
              title="Download"
            >
              <DownIcon />
            </a>
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
                onClick={() => onReject(doc._id)}
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
  onReject,
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
    pending: "bg-teal-100   text-teal-700",
    rejected: "bg-red-100    text-red-600",
  }[status];

  const progress = docs.length
    ? Math.round((uploaded.length / docs.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* ── Card Header ── */}
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

        {/* Progress bar */}
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

      {/* ── Divider ── */}
      <div className="h-px bg-slate-100 mx-5" />

      {/* ── Documents List ── */}
      <div className="px-4 py-4 flex flex-col gap-2 flex-1">
        {docs.map((doc) => (
          <DocRow
            key={doc._id}
            doc={doc}
            onAccept={onAccept}
            onReject={onReject}
            onDelete={(id) => onDelete(id)}
            actionLoading={actionLoading}
          />
        ))}
      </div>

      {/* ── Rejection note ── */}
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

/* ─── Stat Card ─── */
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

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/documents");
      setDocuments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`http://localhost:5000/api/documents/accept/${id}`);
      setDocuments((p) =>
        p.map((d) => (d._id === id ? { ...d, status: "accepted" } : d)),
      );
    } catch (e) {
      alert(e.response?.data?.message || "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`http://localhost:5000/api/documents/reject/${id}`);
      setDocuments((p) =>
        p.map((d) => (d._id === id ? { ...d, status: "rejected" } : d)),
      );
    } catch (e) {
      alert(e.response?.data?.message || "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    setActionLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/documents/${id}`);
      setDocuments((p) => p.filter((d) => d._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* Group by user */
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
      {/* ── Page Header ── */}
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
            onClick={fetch}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm"
          >
            <RefreshIcon /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* ── Stats ── */}
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

        {/* ── Toolbar ── */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5">
            {["all", "accepted", "pending", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filter === f
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
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

        {/* ── Content ── */}
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