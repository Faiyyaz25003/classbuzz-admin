import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Users,
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  Award,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: "New Assignment",
      message: "Math homework due tomorrow",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "Meeting Reminder",
      message: "Team sync at 3 PM today",
      time: "1 hour ago",
    },
  ]);

  // Sample data for charts
  const attendanceData = [
    { day: "Mon", present: 85, absent: 15 },
    { day: "Tue", present: 92, absent: 8 },
    { day: "Wed", present: 88, absent: 12 },
    { day: "Thu", present: 95, absent: 5 },
    { day: "Fri", present: 90, absent: 10 },
  ];

  const courseProgress = [
    { name: "Mathematics", value: 85 },
    { name: "Physics", value: 72 },
    { name: "Chemistry", value: 90 },
    { name: "English", value: 68 },
  ];

  const performanceData = [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 85 },
    { month: "May", score: 88 },
    { month: "Jun", score: 92 },
  ];

  const pieData = [
    { name: "Completed", value: 65 },
    { name: "In Progress", value: 25 },
    { name: "Pending", value: 10 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      icon: Users,
      change: "+12%",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Attendance Rate",
      value: "92%",
      icon: Calendar,
      change: "+5%",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Courses",
      value: "24",
      icon: BookOpen,
      change: "+3",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Avg. Performance",
      value: "85%",
      icon: TrendingUp,
      change: "+8%",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New lecture uploaded",
      course: "Physics 101",
      time: "10 min ago",
    },
    {
      id: 2,
      title: "Assignment graded",
      course: "Mathematics",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Student enrolled",
      course: "Chemistry",
      time: "2 hours ago",
    },
    {
      id: 4,
      title: "Event scheduled",
      course: "Annual Day",
      time: "3 hours ago",
    },
  ];

  const upcomingEvents = [
    { id: 1, title: "Mid-term Exams", date: "Oct 25, 2025", type: "Exam" },
    {
      id: 2,
      title: "Parent-Teacher Meet",
      date: "Oct 30, 2025",
      type: "Meeting",
    },
    { id: 3, title: "Science Fair", date: "Nov 5, 2025", type: "Event" },
  ];

  return (
    <div className="min-h-screen mt-[30px]">
      {/* Enhanced Header with glassmorphism effect */}
      <header className="relative mb-[20px] rounded-2xl bg-gradient-to-br from-[#0a3d4a] via-[#0f4c5c] to-[#1e88a8] text-white shadow-2xl overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left section with enhanced typography */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-gradient-to-b from-teal-300 to-teal-500 rounded-full"></div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-teal-100 mt-1 text-sm font-medium flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Welcome back,{" "}
                    <span className="font-semibold text-white">
                      Faiyyaz Khan
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right section with interactive elements */}
            <div className="flex items-center gap-4">
              {/* Time display */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <svg
                  className="w-5 h-5 text-teal-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-teal-50">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* User avatar with gradient border */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur"></div>
                <div className="relative bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5 rounded-full">
                  <div className="w-10 h-10 bg-[#0f4c5c] rounded-full flex items-center justify-center text-lg font-bold">
                    FK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Weekly Attendance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Course Progress
            </h3>
            <div className="space-y-4">
              {courseProgress.map((course, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {course.name}
                    </span>
                    <span className="text-sm font-bold text-teal-600">
                      {course.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Task Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.course}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="border-2 border-gray-100 rounded-xl p-4 hover:border-teal-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {event.type}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
