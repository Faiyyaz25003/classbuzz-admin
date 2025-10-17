
"use client";
import React, { useState } from "react";
import Header from "./Header";
import StatsGrid from "./StatsGrid";
import AttendanceChart from "./AttendanceChart";
import PerformanceChart from "./PerformanceChart";
import CourseProgress from "./CourseProgress";
import TaskDistribution from "./TaskDistribution";
import RecentActivities from "./RecentActivities";
import UpcomingEvents from "./UpcomingEvents";
import { Calendar, Users, BookOpen, TrendingUp } from "lucide-react";

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

  const attendanceData = [
    { day: "Mon", present: 85, absent: 15 },
    { day: "Tue", present: 92, absent: 8 },
    { day: "Wed", present: 88, absent: 12 },
    { day: "Thu", present: 95, absent: 5 },
    { day: "Fri", present: 90, absent: 10 },
  ];

  const performanceData = [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 85 },
    { month: "May", score: 88 },
    { month: "Jun", score: 92 },
  ];

  const courseProgress = [
    { name: "Mathematics", value: 85 },
    { name: "Physics", value: 72 },
    { name: "Chemistry", value: 90 },
    { name: "English", value: 68 },
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
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AttendanceChart data={attendanceData} />
          <PerformanceChart data={performanceData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <CourseProgress data={courseProgress} />
          <TaskDistribution data={pieData} COLORS={COLORS} />
          <RecentActivities activities={recentActivities} />
        </div>
        <UpcomingEvents events={upcomingEvents} />
      </div>
    </div>
  );
};

export default Dashboard;
