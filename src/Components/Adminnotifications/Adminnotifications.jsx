"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

// ── Icons ──────────────────────────────────────────────────────
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

// ── Type config ─────────────────────────────────────────────────
const TYPE_CONFIG = {
  announcement: { label: "Announcement", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500", icon: "📢" },
  exam:         { label: "Exam",         color: "bg-red-100 text-red-700 border-red-200",   dot: "bg-red-500",  icon: "📝" },
  holiday:      { label: "Holiday",      color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500", icon: "🎉" },
  fee:          { label: "Fee",          color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500", icon: "💰" },
  assignment:   { label: "Assignment",   color: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500", icon: "📚" },
  leave:        { label: "Leave",        color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500", icon: "🌴" },
  result:       { label: "Result",       color: "bg-teal-100 text-teal-700 border-teal-200",   dot: "bg-teal-500",  icon: "🏆" },
  general:      { label: "General",      color: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-500", icon: "🔔" },
};

const PRIORITY_CONFIG = {
  low:    { label: "Low",    color: "bg-slate-100 text-slate-500" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700" },
  high:   { label: "High",   color: "bg-red-100 text-red-600"    },
};

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
      <span className={`w-2 h-2 rounded-full ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
      {msg}
    </div>
  );
}

function StatCard({ label, value, icon, colorClass }) {
  return (
    <div className={`rounded-2xl border px-5 py-4 flex items-center gap-4 ${colorClass}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    priority: "medium",
    targetAudience: "all",
    targetUsers: [],
    link: "",
    expiresAt: "",
  });

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/notifications`);
      setNotifications(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users`);
      setUsers(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchNotifications(); fetchUsers(); }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      showToast("Title and message are required", "error"); return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/notifications/create`, form);
      showToast("Notification sent successfully!");
      setShowForm(false);
      setForm({ title: "", message: "", type: "general", priority: "medium", targetAudience: "all", targetUsers: [], link: "", expiresAt: "" });
      fetchNotifications();
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to send", "error");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${BASE_URL}/api/notifications/${id}`);
      setNotifications(p => p.filter(n => n._id !== id));
      showToast("Notification deleted");
    } catch (e) { showToast("Failed to delete", "error"); }
    finally { setDeleting(null); }
  };

  const toggleUser = (userId) => {
    setForm(f => ({
      ...f,
      targetUsers: f.targetUsers.includes(userId)
        ? f.targetUsers.filter(id => id !== userId)
        : [...f.targetUsers, userId]
    }));
  };

  // Filter
  const filtered = notifications.filter(n => {
    if (filterType !== "all" && n.type !== filterType) return false;
    if (filterPriority !== "all" && n.priority !== filterPriority) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalSent = notifications.length;
  const highPriority = notifications.filter(n => n.priority === "high").length;
  const readCount = notifications.filter(n => n.readBy?.length > 0).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] flex items-center justify-center shadow-sm">
              <BellIcon />
              <span className="absolute text-white" style={{ fontSize: 20 }}></span>
            </div>
            <div style={{ marginLeft: -40 }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] flex items-center justify-center shadow-sm text-white text-2xl">
                🔔
              </div>
            </div>
            <div style={{ marginLeft: 8 }}>
              <h1 className="text-2xl font-bold text-[#0f4c5c] tracking-tight">Notification Center</h1>
              <p className="text-sm text-slate-500 mt-0.5">Send and manage all notifications</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${showForm ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-gradient-to-r from-[#0f4c5c] to-[#2596be] text-white hover:opacity-90"}`}
          >
            {showForm ? <><XIcon /> Close</> : <><SendIcon /> Send Notification</>}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Sent" value={totalSent} icon="📬" colorClass="bg-white border-slate-200" />
          <StatCard label="High Priority" value={highPriority} icon="🚨" colorClass="bg-red-50 border-red-100" />
          <StatCard label="With Reads" value={readCount} icon="👁️" colorClass="bg-emerald-50 border-emerald-100" />
          <StatCard label="Total Users" value={users.length} icon="👥" colorClass="bg-blue-50 border-blue-100" />
        </div>

        {/* ── Send Form ── */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0f4c5c] to-[#2596be] px-8 py-6">
              <h2 className="text-white font-bold text-xl">Compose Notification</h2>
              <p className="text-white/70 text-sm mt-0.5">Send a notification to all users or specific people</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Fee Payment Reminder"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/30 focus:border-[#1e88a8]"
                />
              </div>
              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Write your notification message here..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/30 focus:border-[#1e88a8]"
                />
              </div>
              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/30">
                  {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
              </div>
              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/30">
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Audience</label>
                <select value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value, targetUsers: [] }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/30">
                  <option value="all">👥 All Users</option>
                  <option value="specific">🎯 Specific Users</option>
                </select>
              </div>
              {/* Expiry */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Expires At (optional)</label>
                <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/30" />
              </div>
              {/* Link */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Action Link (optional)</label>
                <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="e.g. /fees, /assignments" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/30" />
              </div>

              {/* Specific Users selector */}
              {form.targetAudience === "specific" && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select Users</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3">
                    {users.map(u => {
                      const selected = form.targetUsers.includes(u._id);
                      return (
                        <div key={u._id} onClick={() => toggleUser(u._id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-all text-sm ${selected ? "bg-[#0f4c5c] text-white border-[#0f4c5c]" : "bg-slate-50 text-slate-700 border-slate-200 hover:border-[#1e88a8]"}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${selected ? "bg-white/20" : "bg-slate-200"}`}>
                            {selected && <CheckIcon />}
                          </div>
                          <span className="truncate">{u.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  {form.targetUsers.length > 0 && (
                    <p className="text-xs text-[#1e88a8] mt-2 font-semibold">{form.targetUsers.length} user(s) selected</p>
                  )}
                </div>
              )}

              {/* Submit */}
              <div className="md:col-span-2 flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#0f4c5c] to-[#2596be] text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? <>⏳ Sending...</> : <><SendIcon /> Send Notification</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3 shadow-sm">
          {/* Type filter */}
          <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5 flex-wrap">
            <button onClick={() => setFilterType("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === "all" ? "bg-[#0f4c5c] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>All</button>
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <button key={k} onClick={() => setFilterType(k)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filterType === k ? "bg-[#0f4c5c] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{v.icon} {v.label}</button>
            ))}
          </div>
          {/* Priority filter */}
          <div className="flex gap-1.5">
            {["all", "high", "medium", "low"].map(p => (
              <button key={p} onClick={() => setFilterPriority(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${filterPriority === p ? "bg-[#0f4c5c] text-white border-[#0f4c5c]" : "bg-white text-slate-500 border-slate-200 hover:border-[#1e88a8]"}`}>{p === "all" ? "All Priority" : p}</button>
            ))}
          </div>
          {/* Search */}
          <div className="relative ml-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e88a8]/20 focus:border-[#1e88a8] w-56"
            />
          </div>
        </div>

        {/* ── Notification List ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-[3px] border-teal-100 border-t-[#1e88a8] rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading notifications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl border border-slate-200">
            <div className="text-5xl">🔕</div>
            <p className="text-sm font-semibold text-slate-500">No notifications found</p>
            <p className="text-xs text-slate-400">Try adjusting filters or send a new notification</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(n => {
              const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.general;
              const pc = PRIORITY_CONFIG[n.priority] || PRIORITY_CONFIG.medium;
              return (
                <div key={n._id} className="bg-white border border-slate-200 rounded-2xl px-6 py-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                    {tc.icon}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-sm font-bold text-slate-800">{n.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tc.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />{tc.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${pc.color}`}>{pc.label}</span>
                          {n.targetAudience === "all" ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-50 text-teal-600">All Users</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-600">{n.targetUsers?.length || 0} Users</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2">{n.message}</p>
                        {n.link && <p className="text-xs text-[#1e88a8] mt-1">🔗 {n.link}</p>}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          {n.readBy?.length > 0 && (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                              <EyeIcon /> {n.readBy.length} read
                            </span>
                          )}
                          {n.expiresAt && (
                            <span className="text-[11px] text-orange-500 font-medium">⏱ Expires {new Date(n.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(n._id)}
                        disabled={deleting === n._id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all disabled:opacity-40 flex-shrink-0"
                        title="Delete"
                      >
                        <TrashIcon />
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
  );
}