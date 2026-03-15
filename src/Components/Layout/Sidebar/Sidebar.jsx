"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserPlus,
  BookOpen,
  GraduationCap,
  Briefcase,
  Bell,
  Video,
  FolderOpen,
  Library,
  Award,
  ClipboardList,
  CalendarDays,
  Mic2,
} from "lucide-react";

import Dashboard from "@/Components/Dashboard/Dashboard";
import Attendance from "@/Components/Attendance/Attendance";
import Leave from "@/Components/LeaveList/LeaveList";
import UserList from "@/Components/UserList/UserList";
import Fees from "@/Components/Fees/Fees";
import Documents from "@/Components/Documents/Documents";
import Certificate from "@/Components/Certificate/Certificate";
import Result from "@/Components/Result/Result";
import Course from "@/Components/Course/Course";
import Schedule from "@/Components/Schedule/Schedule";
import RecordedLectures from "@/Components/RecordedLecture/RecordedLecture";
import Assignment from "@/Components/Folder/Folder";
import UpcomingExams from "@/Components/UpcomingExams/UpcomingExams";
import LibraryManagement from "@/Components/LibraryManagement/LibraryManagement";
import JobsOpportunity from "@/Components/JobsOpportunity/JobsOpportunity";
import Announcement from "@/Components/Announcement/Announcement";
import Notes from "@/Components/Notes/Notes";
import CodeBasedAttendence from "@/Components/CodeBasedAttendence/CodeBasedAttendence";
import ZoomMeeting from "@/Components/ZoomMeeting/ZoomMeeting";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
      { id: "user", name: "User", icon: UserPlus },
    ],
  },
  {
    label: "Academic",
    items: [
      { id: "course", name: "Courses", icon: BookOpen },
      { id: "schedule", name: "Schedule", icon: CalendarDays },
      { id: "attendance", name: "Attendance", icon: CalendarCheck },
      {
        id: "codeBasedAttendence",
        name: "Code Attendance",
        icon: CalendarCheck,
      },
    ],
  },
  {
    label: "Exams & Results",
    items: [
      { id: "upcomingExams", name: "Upcoming Exams", icon: ClipboardList },
      { id: "result", name: "Result", icon: GraduationCap },
      { id: "certificate", name: "Certificate", icon: Award },
      { id: "assignment", name: "Assignment", icon: FolderOpen },
    ],
  },
  {
    label: "Study Material",
    items: [
      { id: "notes", name: "Notes", icon: FileText },
      { id: "documents", name: "Documents", icon: FileText },
      { id: "record", name: "Recorded Lecture", icon: Mic2 },
    ],
  },
  {
    label: "Communication",
    items: [
      { id: "announcement", name: "Announcement", icon: Bell },
      { id: "event", name: "Event", icon: CalendarDays },
      { id: "zoomMeeting", name: "Zoom Meeting", icon: Video },
    ],
  },
  {
    label: "Management",
    items: [
      { id: "fees", name: "Fees Record", icon: Clock },
      { id: "leave", name: "Leave Management", icon: Clock },
      { id: "libraryManagement", name: "Library", icon: Library },
      { id: "jobsOpportunity", name: "Jobs Opportunity", icon: Briefcase },
    ],
  },
];

export default function Sidebar() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLinkClick = (id) => {
    setCurrentView(id);
    if (isMobile) setIsMobileOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "attendance":
        return <Attendance />;
      case "codeBasedAttendence":
        return <CodeBasedAttendence />;
      case "leave":
        return <Leave />;
      case "user":
        return <UserList />;
      case "fees":
        return <Fees />;
      case "jobsOpportunity":
        return <JobsOpportunity />;
      case "course":
        return <Course />;
      case "documents":
        return <Documents />;
      case "certificate":
        return <Certificate />;
      case "schedule":
        return <Schedule />;
      case "notes":
        return <Notes />;
      case "result":
        return <Result />;
      case "announcement":
        return <Announcement />;
      case "zoomMeeting":
        return <ZoomMeeting />;
      case "record":
        return <RecordedLectures />;
      case "upcomingExams":
        return <UpcomingExams />;
      case "assignment":
        return <Assignment />;
      case "libraryManagement":
        return <LibraryManagement />;
      default:
        return <Fees />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 bg-[#0f4c5c] text-white p-2.5 rounded-xl shadow-lg lg:hidden"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen bg-gradient-to-b from-[#0a3a47] via-[#0f4c5c] to-[#1a6d88]
          text-white flex flex-col shadow-2xl
          transition-all duration-500 ease-in-out
          ${isCollapsed && !isMobile ? "w-[72px]" : "w-72"}
          ${isMobile ? "fixed top-0 left-0 z-40" : "fixed"}
          ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Collapse button (desktop) */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3.5 top-9 bg-white text-[#1e88a8] rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 z-10 border border-[#1e88a8]/20"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        )}

        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-white/10
            ${isCollapsed && !isMobile ? "justify-center px-0" : ""}
          `}
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-cyan-400/30 rounded-xl blur-md" />
            <Image
              src="/logo.png"
              alt="Logo"
              width={isCollapsed && !isMobile ? 36 : 44}
              height={isCollapsed && !isMobile ? 36 : 44}
              className="relative rounded-xl shadow-lg"
            />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight leading-none">
                ClassBuzz
              </h1>
              <p className="text-[10px] text-cyan-300/70 mt-1 tracking-widest uppercase">
                Track · Achieve · Succeed
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-1">
              {/* Group label */}
              {(!isCollapsed || isMobile) && (
                <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-cyan-300/50 px-3 py-2 mt-2">
                  {group.label}
                </p>
              )}
              {isCollapsed && !isMobile && (
                <div className="w-8 h-px bg-white/15 mx-auto my-3" />
              )}

              {group.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    title={isCollapsed && !isMobile ? item.name : undefined}
                    className={`
                      w-full flex items-center gap-3 rounded-xl transition-all duration-200
                      ${isCollapsed && !isMobile ? "justify-center px-0 py-2.5 mx-auto w-11 h-11" : "px-3 py-2.5"}
                      ${
                        isActive
                          ? "bg-white text-[#0f4c5c] shadow-lg font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <item.icon
                      size={18}
                      className={`shrink-0 transition-colors ${isActive ? "text-[#1e88a8]" : ""}`}
                    />
                    {(!isCollapsed || isMobile) && (
                      <span className="text-[13px] truncate">{item.name}</span>
                    )}
                    {/* Active indicator dot */}
                    {isActive && (!isCollapsed || isMobile) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1e88a8] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {(!isCollapsed || isMobile) && (
          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center shrink-0">
                <User size={15} className="text-cyan-200" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-[10px] text-cyan-300/60 truncate">
                  admin@classbuzz.com
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-500 ${
          isMobile ? "" : isCollapsed ? "ml-[72px]" : "ml-72"
        }`}
      >
        <main className="pt-16 lg:pt-20 p-6 min-h-screen bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
