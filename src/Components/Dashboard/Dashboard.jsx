
"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import StatsGrid from "./StatsGrid";
import AttendanceChart from "./AttendanceChart";
import PerformanceChart from "./PerformanceChart";
import CourseProgress from "./CourseProgress";
import TaskDistribution from "./TaskDistribution";
import RecentActivities from "./RecentActivities";
import UpcomingEvents from "./UpcomingEvents";
import { Calendar, Users, BookOpen, TrendingUp } from "lucide-react";
import PerformanceDashboard from "./PerformanceDashboard";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState("0"); // default value
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

  // Dummy students data for Performance Dashboard
  const [studentsData] = useState([
    {
      id: 1,
      rollNo: "CS001",
      name: "Aman Kumar",
      class: "Computer Science",
      semester: "Semester 5",
      percentage: 92.5,
      subjects: [
        { name: "Data Structures", marks: 95, maxMarks: 100 },
        { name: "Algorithms", marks: 90, maxMarks: 100 },
        { name: "Database Systems", marks: 92, maxMarks: 100 },
      ],
    },
    {
      id: 2,
      rollNo: "IT002",
      name: "Riya Sharma",
      class: "Information Technology",
      semester: "Semester 5",
      percentage: 88.7,
      subjects: [
        { name: "Web Development", marks: 90, maxMarks: 100 },
        { name: "Cloud Computing", marks: 87, maxMarks: 100 },
        { name: "Software Engineering", marks: 89, maxMarks: 100 },
      ],
    },
    {
      id: 3,
      rollNo: "CS003",
      name: "Karan Singh",
      class: "Computer Science",
      semester: "Semester 5",
      percentage: 91.3,
      subjects: [
        { name: "Machine Learning", marks: 93, maxMarks: 100 },
        { name: "AI Fundamentals", marks: 90, maxMarks: 100 },
        { name: "Data Mining", marks: 91, maxMarks: 100 },
      ],
    },
    {
      id: 4,
      rollNo: "EC004",
      name: "Priya Patel",
      class: "Electronics & Communication",
      semester: "Semester 4",
      percentage: 85.4,
      subjects: [
        { name: "Digital Electronics", marks: 88, maxMarks: 100 },
        { name: "Signal Processing", marks: 83, maxMarks: 100 },
        { name: "Communication Systems", marks: 85, maxMarks: 100 },
      ],
    },
    {
      id: 5,
      rollNo: "ME005",
      name: "Rahul Verma",
      class: "Mechanical Engineering",
      semester: "Semester 3",
      percentage: 78.6,
      subjects: [
        { name: "Thermodynamics", marks: 80, maxMarks: 100 },
        { name: "Fluid Mechanics", marks: 77, maxMarks: 100 },
        { name: "Manufacturing Process", marks: 79, maxMarks: 100 },
      ],
    },
    {
      id: 6,
      rollNo: "IT006",
      name: "Neha Gupta",
      class: "Information Technology",
      semester: "Semester 5",
      percentage: 87.2,
      subjects: [
        { name: "Mobile App Development", marks: 89, maxMarks: 100 },
        { name: "Cybersecurity", marks: 85, maxMarks: 100 },
        { name: "IoT", marks: 88, maxMarks: 100 },
      ],
    },
    {
      id: 7,
      rollNo: "CS007",
      name: "Vikram Joshi",
      class: "Computer Science",
      semester: "Semester 6",
      percentage: 89.8,
      subjects: [
        { name: "Blockchain", marks: 92, maxMarks: 100 },
        { name: "Computer Networks", marks: 88, maxMarks: 100 },
        { name: "Operating Systems", marks: 89, maxMarks: 100 },
      ],
    },
    {
      id: 8,
      rollNo: "AI008",
      name: "Simran Kaur",
      class: "Artificial Intelligence & Data Science",
      semester: "Semester 4",
      percentage: 90.5,
      subjects: [
        { name: "Deep Learning", marks: 93, maxMarks: 100 },
        { name: "Natural Language Processing", marks: 89, maxMarks: 100 },
        { name: "Computer Vision", marks: 90, maxMarks: 100 },
      ],
    },
    {
      id: 9,
      rollNo: "EC009",
      name: "Arjun Reddy",
      class: "Electronics & Communication",
      semester: "Semester 5",
      percentage: 82.3,
      subjects: [
        { name: "VLSI Design", marks: 84, maxMarks: 100 },
        { name: "Embedded Systems", marks: 81, maxMarks: 100 },
        { name: "Microprocessors", marks: 82, maxMarks: 100 },
      ],
    },
    {
      id: 10,
      rollNo: "ME010",
      name: "Kavita Nair",
      class: "Mechanical Engineering",
      semester: "Semester 4",
      percentage: 75.8,
      subjects: [
        { name: "Heat Transfer", marks: 78, maxMarks: 100 },
        { name: "Machine Design", marks: 74, maxMarks: 100 },
        { name: "Engineering Materials", marks: 75, maxMarks: 100 },
      ],
    },
  ]);

  // Fetch total students from API
  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();
        setTotalStudents(data.length); // Assuming API returns an array of users
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchTotalStudents();
  }, []);

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
      value: totalStudents,
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

        {/* Performance Dashboard with Student Data */}
        <div className="mt-8">
          <PerformanceDashboard students={studentsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;