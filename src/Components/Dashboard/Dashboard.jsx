"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  Megaphone,
  CalendarOff,
  BookOpen,
  DollarSign,
  ClipboardList,
  Video,
  Briefcase,
  Library,
  TrendingUp,
  Bell,
  RefreshCw,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "http://localhost:5000/api";

// ─── helpers ───────────────────────────────────────────────────
function daysAgo(dateStr) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

function isNew(dateStr) {
  return (Date.now() - new Date(dateStr).getTime()) / 86400000 <= 3;
}

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-red-100 text-red-700",
];

const POS_COLORS = {
  Student: "bg-blue-100 text-blue-700",
  Professor: "bg-purple-100 text-purple-700",
  "Assistant Professor": "bg-indigo-100 text-indigo-700",
  "Lab Assistant": "bg-green-100 text-green-700",
  Librarian: "bg-pink-100 text-pink-700",
  HOD: "bg-red-100 text-red-700",
  Monitor: "bg-amber-100 text-amber-700",
  Principal: "bg-gray-200 text-gray-700",
};

const PIE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

const ANNOUNCE_TYPE_COLORS = {
  Holiday: "bg-teal-100 text-teal-700",
  Exam: "bg-red-100 text-red-700",
  Workshop: "bg-purple-100 text-purple-700",
  Seminar: "bg-blue-100 text-blue-700",
  Notice: "bg-amber-100 text-amber-700",
};

// ─── sub-components ────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  subColor = "text-gray-400",
  iconBg,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
}

function SectionCard({ title, badge, onViewAll, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </h2>
          {badge && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
              {badge}
            </span>
          )}
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 transition"
          >
            View all <ChevronRight size={12} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────
export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, f, a, l, c, m, lec, j] = await Promise.allSettled([
        axios.get(`${API}/users`),
        axios.get(`${API}/fees`),
        axios.get(`${API}/announcements/all`),
        axios.get(`${API}/leave`),
        axios.get(`${API}/course`),
        axios.get(`${API}/meetings`),
        axios.get(`${API}/lectures`),
        axios.get(`${API}/jobs/all`),
      ]);
      if (u.status === "fulfilled") setUsers(u.value.data);
      if (f.status === "fulfilled") setFees(f.value.data);
      if (a.status === "fulfilled") setAnnouncements(a.value.data);
      if (l.status === "fulfilled") setLeaves(l.value.data);
      if (c.status === "fulfilled") setCourses(c.value.data);
      if (m.status === "fulfilled") setMeetings(m.value.data);
      if (lec.status === "fulfilled") setLectures(lec.value.data);
      if (j.status === "fulfilled") setJobs(j.value.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ─── derived data ─────────────────────────────────────────
  const newUsers = users.filter((u) => u.createdAt && isNew(u.createdAt));
  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const totalRevenue = fees.reduce((acc, f) => acc + Number(f.amount || 0), 0);
  const pendingAssignments = 0; // placeholder — fetch if you have an endpoint

  // Role pie
  const roleData = [
    {
      name: "Students",
      value: users.filter((u) => u.positions?.includes("Student")).length || 0,
    },
    {
      name: "Professors",
      value:
        users.filter((u) => u.positions?.includes("Professor")).length || 0,
    },
    {
      name: "Staff",
      value:
        users.filter((u) =>
          u.positions?.some((p) =>
            ["Lab Assistant", "Librarian", "Monitor"].includes(p),
          ),
        ).length || 0,
    },
    {
      name: "Others",
      value:
        users.filter(
          (u) =>
            u.positions?.includes("HOD") || u.positions?.includes("Principal"),
        ).length || 0,
    },
  ].filter((d) => d.value > 0);

  // Registrations last 7 days
  const regData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const count = users.filter((u) => {
      if (!u.createdAt) return false;
      const ud = new Date(u.createdAt);
      return ud.toDateString() === d.toDateString();
    }).length;
    return { day: label, count };
  });

  // Fee installment bar
  const feeInstData = [1, 2, 3].map((n) => ({
    name: `Inst. ${n}`,
    amount: fees
      .filter((f) => f.installment === n)
      .reduce((s, f) => s + Number(f.amount || 0), 0),
  }));

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-blue-500" />
          <p className="text-gray-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">{today}</p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Users}
          label="Total Users"
          value={users.length}
          sub={`+${newUsers.length} this week`}
          subColor="text-teal-600"
          iconBg="bg-blue-500"
        />
        <MetricCard
          icon={UserPlus}
          label="New (Last 3 Days)"
          value={newUsers.length}
          sub="Recently joined"
          subColor="text-teal-600"
          iconBg="bg-teal-500"
        />
        <MetricCard
          icon={Megaphone}
          label="Announcements"
          value={announcements.length}
          sub={`${announcements.slice(0, 3).length} recent`}
          subColor="text-amber-600"
          iconBg="bg-amber-500"
        />
        <MetricCard
          icon={CalendarOff}
          label="Pending Leaves"
          value={pendingLeaves.length}
          sub="Awaiting approval"
          subColor="text-red-500"
          iconBg="bg-red-500"
        />
      </div>

      {/* ── Stats Row 2 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={DollarSign}
          label="Total Fee Revenue"
          value={`₹${(totalRevenue / 1000).toFixed(0)}k`}
          sub="All installments"
          iconBg="bg-green-500"
        />
        <MetricCard
          icon={BookOpen}
          label="Courses"
          value={courses.length}
          sub={`${courses.reduce((a, c) => a + (c.semesters?.length || 0), 0)} semesters`}
          iconBg="bg-purple-500"
        />
        <MetricCard
          icon={Video}
          label="Lectures"
          value={lectures.length}
          sub="Recorded sessions"
          iconBg="bg-indigo-500"
        />
        <MetricCard
          icon={Briefcase}
          label="Jobs Posted"
          value={jobs.length}
          sub="Active openings"
          iconBg="bg-pink-500"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Role Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            User role distribution
          </h2>
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend
                  iconType="square"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              No user data yet
            </div>
          )}
        </div>

        {/* Registrations last 7 days */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Registrations — last 7 days
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regData} barSize={28}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip />
              <Bar
                dataKey="count"
                name="Registrations"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── User List + Announcements ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* User List */}
        <SectionCard
          title="User list"
          badge={newUsers.length > 0 ? `${newUsers.length} new` : null}
        >
          <div className="space-y-1">
            {users.slice(0, 8).map((user, i) => (
              <div
                key={user._id || i}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                >
                  {initials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.name}
                    </p>
                    {user.createdAt && isNew(user.createdAt) && (
                      <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 flex items-center gap-1">
                        <Star size={8} /> New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {user.departments?.join(", ") || "—"}
                    {user.createdAt ? ` · ${daysAgo(user.createdAt)}` : ""}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${POS_COLORS[user.positions?.[0]] || "bg-gray-100 text-gray-600"}`}
                >
                  {user.positions?.[0] || "—"}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                No users found
              </p>
            )}
          </div>
        </SectionCard>

        {/* Announcements */}
        <SectionCard title="Recent Announcements">
          <div className="space-y-1">
            {(announcements.length > 0 ? announcements : [])
              .slice(0, 5)
              .map((a, i) => (
                <div
                  key={a._id || i}
                  className="py-2.5 border-b border-gray-50 last:border-0"
                >
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ANNOUNCE_TYPE_COLORS[a.type] || "bg-gray-100 text-gray-600"}`}
                  >
                    {a.type || "Notice"}
                  </span>
                  <p className="text-sm font-medium text-gray-800 mt-1 truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {a.department || "All departments"}
                    {a.startDate
                      ? ` · ${new Date(a.startDate).toLocaleDateString("en-IN")}`
                      : ""}
                  </p>
                </div>
              ))}
            {announcements.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                No announcements yet
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      {/* ── Fee Chart + Module Stats + Newly Registered ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Fee by installment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm md:col-span-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Fee by installment
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={feeInstData} barSize={36}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
              />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString()}`, "Amount"]}
              />
              <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Module activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Module activity
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Meetings scheduled",
                val: meetings.length,
                color: "bg-blue-500",
                max: 30,
              },
              {
                label: "Leaves total",
                val: leaves.length,
                color: "bg-amber-500",
                max: 50,
              },
              {
                label: "Jobs posted",
                val: jobs.length,
                color: "bg-pink-500",
                max: 30,
              },
              {
                label: "Lectures recorded",
                val: lectures.length,
                color: "bg-indigo-500",
                max: 200,
              },
              {
                label: "Courses available",
                val: courses.length,
                color: "bg-teal-500",
                max: 20,
              },
            ].map(({ label, val, color, max }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{label}</span>
                  <span className="font-semibold text-gray-700">{val}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${Math.min((val / max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newly registered users (last 3 days) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Newly registered
            </h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
              Last 3 days
            </span>
          </div>
          <div className="space-y-2">
            {newUsers.length > 0 ? (
              newUsers.slice(0, 6).map((u, i) => (
                <div key={u._id || i} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                  >
                    {initials(u.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className="text-[10px] text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {u.createdAt ? daysAgo(u.createdAt) : "New"}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Bell size={28} className="text-gray-200" />
                <p className="text-sm text-gray-400">
                  No new users in last 3 days
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Leave Status ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Leave applications
        </h2>
        {leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#0f4c5c] to-[#2596be] text-white">
                  <th className="px-4 py-3 text-left font-medium rounded-tl-xl">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">From</th>
                  <th className="px-4 py-3 text-left font-medium">To</th>
                  <th className="px-4 py-3 text-left font-medium rounded-tr-xl">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaves.slice(0, 6).map((l, i) => (
                  <tr
                    key={l._id || i}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {l.userName || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.leaveType}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {l.fromDate
                        ? new Date(l.fromDate).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {l.toDate
                        ? new Date(l.toDate).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          l.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : l.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">
            No leave applications found
          </p>
        )}
      </div>

      <p className="text-center text-xs text-gray-300 mt-8">
        © {new Date().getFullYear()} Admin Panel · All rights reserved
      </p>
    </div>
  );
}
