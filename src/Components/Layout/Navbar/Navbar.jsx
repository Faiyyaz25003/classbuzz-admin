// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   Bell,
//   Search,
//   User,
//   ChevronDown,
//   Settings,
//   LogOut,
//   Mail,
//   UserPlus,
//   CalendarCheck,
// } from "lucide-react";

// import Register from "@/Components/Auth/Register/Register";
// import Calendar from "@/Components/Calender/Calender";

// export default function Navbar() {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeView, setActiveView] = useState(null); // "register" | "calendar" | null

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Outside click close
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
//       if (!e.target.closest(".notification-dropdown"))
//         setIsNotificationOpen(false);
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Notification data
//   const notifications = [
//     {
//       id: 1,
//       title: "New Assignment",
//       message: "Math homework due tomorrow",
//       time: "5 min ago",
//       unread: true,
//     },
//     {
//       id: 2,
//       title: "Meeting Reminder",
//       message: "Team sync at 3 PM today",
//       time: "1 hour ago",
//       unread: true,
//     },
//   ];

//   // Toggle between views (register/calendar)
//   const handleViewToggle = (view) => {
//     setActiveView((prev) => (prev === view ? null : view));
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav
//         className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-73 left-0 ${
//           isScrolled
//             ? "bg-[#1e7a8c]/95 backdrop-blur-md shadow-lg"
//             : "bg-gradient-to-r from-[#1e7a8c] to-[#2596ad]"
//         }`}
//       >
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             {/* Search */}
//             <div className="hidden md:flex flex-1 max-w-2xl">
//               <div className="relative w-full group">
//                 <Search
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors"
//                   size={22}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search anything..."
//                   className="w-full pl-14 pr-6 py-4 text-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/70 rounded-2xl focus:border-white/40 focus:bg-white/20 focus:outline-none transition-all duration-300"
//                 />
//               </div>
//             </div>

//             {/* ACTION BUTTONS */}
//             <div className="flex items-center gap-3 sm:gap-4">
//               {/* Register */}
//               <button
//                 title="Register Student"
//                 onClick={() => handleViewToggle("register")}
//                 className={`flex items-center justify-center w-10 h-10 rounded-lg ${
//                   activeView === "register"
//                     ? "bg-white/30"
//                     : "bg-white/10 hover:bg-white/20"
//                 } text-white/90 hover:text-white transition-all duration-300`}
//               >
//                 <UserPlus size={20} />
//               </button>

//               {/* Calendar */}
//               <button
//                 title="Calendar"
//                 onClick={() => handleViewToggle("calendar")}
//                 className={`flex items-center justify-center w-10 h-10 rounded-lg ${
//                   activeView === "calendar"
//                     ? "bg-white/30"
//                     : "bg-white/10 hover:bg-white/20"
//                 } text-white/90 hover:text-white transition-all duration-300`}
//               >
//                 <CalendarCheck size={20} />
//               </button>

//               {/* Notifications */}
//               <div className="relative notification-dropdown">
//                 <button
//                   onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                   className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-300"
//                 >
//                   <Bell size={20} />
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
//                     {notifications.length}
//                   </span>
//                 </button>

//                 {isNotificationOpen && (
//                   <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
//                     <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
//                       <h3 className="text-white font-semibold text-lg">
//                         Notifications
//                       </h3>
//                       <p className="text-cyan-100 text-sm">
//                         {notifications.length} new updates
//                       </p>
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                       {notifications.map((n) => (
//                         <div
//                           key={n.id}
//                           className={`p-4 border-b border-gray-100 hover:bg-cyan-50 transition-colors cursor-pointer ${
//                             n.unread ? "bg-blue-50/50" : ""
//                           }`}
//                         >
//                           <h4 className="font-semibold text-gray-800">
//                             {n.title}
//                           </h4>
//                           <p className="text-sm text-gray-600">{n.message}</p>
//                           <p className="text-xs text-gray-400 mt-1">{n.time}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Profile */}
//               <div className="relative profile-dropdown">
//                 <button
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300"
//                 >
//                   <User size={20} className="text-white" />
//                   <div className="flex flex-col items-start leading-tight text-white text-sm">
//                     <span className="font-semibold">Faiyyaz Khan</span>
//                     <span className="text-xs text-white/70">Administrator</span>
//                   </div>
//                   <ChevronDown
//                     size={16}
//                     className={`text-white/80 transition-transform duration-300 ${
//                       isProfileOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {isProfileOpen && (
//                   <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
//                     <Link
//                       href="/profile"
//                       className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 transition-colors text-gray-700"
//                     >
//                       <User size={18} />
//                       <span>My Profile</span>
//                     </Link>
//                     <Link
//                       href="/settings"
//                       className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 transition-colors text-gray-700"
//                     >
//                       <Settings size={18} />
//                       <span>Settings</span>
//                     </Link>
//                     <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
//                       <LogOut size={18} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Animation */}
//         <style jsx>{`
//           @keyframes fade-in {
//             from {
//               opacity: 0;
//               transform: translateY(-10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//           .animate-fade-in {
//             animation: fade-in 0.3s ease-out;
//           }
//         `}</style>
//       </nav>

//       {/* ACTIVE VIEW BELOW NAVBAR */}
//       {activeView === "register" && (
//         <div className="fixed top-16 lg:top-20 lg:left-80 left-0 right-0 bottom-0 z-20 bg-gray-50 overflow-auto">
//           <div className="p-6">
//             <Register />
//           </div>
//         </div>
//       )}

//       {activeView === "calendar" && (
//         <div className="fixed top-16 lg:top-20 lg:left-80 left-0 right-0 bottom-0 z-20 bg-gray-50 overflow-auto">
//           <div className="p-6">
//             <Calendar />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  UserPlus,
  CalendarCheck,
  X,
} from "lucide-react";

import Register from "@/Components/Auth/Register/Register";
import Calendar from "@/Components/Calender/Calender";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
      if (!e.target.closest(".notification-dropdown"))
        setIsNotificationOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New Assignment",
      message: "Math homework due tomorrow",
      time: "5 min ago",
      unread: true,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Team sync at 3 PM today",
      time: "1 hour ago",
      unread: true,
      color: "bg-cyan-500",
    },
  ];

  const handleViewToggle = (view) => {
    setActiveView((prev) => (prev === view ? null : view));
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-72 left-0 ${
          isScrolled
            ? "bg-[#0d4255]/95 backdrop-blur-xl shadow-xl shadow-black/10"
            : "bg-gradient-to-r from-[#0d4255] via-[#0f4c5c] to-[#1e88a8]"
        }`}
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400/0 via-cyan-300/60 to-cyan-400/0" />

        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 lg:h-[70px] gap-4">
            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <div
                className={`relative w-full transition-all duration-300 ${
                  isSearchFocused ? "scale-[1.01]" : ""
                }`}
              >
                <Search
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    isSearchFocused ? "text-white" : "text-white/50"
                  }`}
                  size={17}
                />
                <input
                  type="text"
                  placeholder="Search students, courses, assignments..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border border-white/15 text-white placeholder-white/40 rounded-xl focus:border-cyan-300/50 focus:bg-white/15 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
              {/* Register button */}
              <button
                title="Register Student"
                onClick={() => handleViewToggle("register")}
                className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeView === "register"
                    ? "bg-white text-[#0f4c5c] shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10"
                }`}
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline text-xs">Register</span>
              </button>

              {/* Calendar button */}
              <button
                title="Calendar"
                onClick={() => handleViewToggle("calendar")}
                className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeView === "calendar"
                    ? "bg-white text-[#0f4c5c] shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10"
                }`}
              >
                <CalendarCheck size={16} />
                <span className="hidden sm:inline text-xs">Calendar</span>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1 hidden sm:block" />

              {/* Notifications */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsProfileOpen(false);
                  }}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
                    isNotificationOpen
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10"
                  }`}
                >
                  <Bell size={17} />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-[#0f4c5c]" />
                  )}
                </button>

                {isNotificationOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50"
                    style={{ animation: "dropIn 0.2s ease-out" }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8]">
                      <div>
                        <h3 className="text-white font-semibold text-sm">
                          Notifications
                        </h3>
                        <p className="text-cyan-200/70 text-xs mt-0.5">
                          {notifications.filter((n) => n.unread).length} unread
                        </p>
                      </div>
                      <button className="text-white/60 hover:text-white text-xs underline underline-offset-2">
                        Mark all read
                      </button>
                    </div>
                    {/* Items */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex gap-3 p-3.5 hover:bg-cyan-50/60 transition-colors cursor-pointer ${
                            n.unread ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.color}`}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 text-sm leading-tight">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                      <button className="text-xs text-[#1e88a8] font-medium hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationOpen(false);
                  }}
                  className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isProfileOpen
                      ? "bg-white/20"
                      : "hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-300 to-[#1e88a8] flex items-center justify-center text-white font-bold text-xs shadow-md">
                    FK
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-white text-xs font-semibold">
                      Faiyyaz Khan
                    </span>
                    <span className="text-white/50 text-[10px] mt-0.5">
                      Administrator
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-white/60 transition-transform duration-300 hidden sm:block ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50"
                    style={{ animation: "dropIn 0.2s ease-out" }}
                  >
                    {/* Profile header */}
                    <div className="px-4 py-3 bg-gradient-to-br from-[#0f4c5c]/5 to-cyan-50 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-[#1e88a8] flex items-center justify-center text-white font-bold text-sm">
                          FK
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Faiyyaz Khan
                          </p>
                          <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                      </div>
                    </div>
                    {/* Menu items */}
                    <div className="py-1.5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50 transition-colors text-gray-700 text-sm"
                      >
                        <User size={15} className="text-[#1e88a8]" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50 transition-colors text-gray-700 text-sm"
                      >
                        <Settings size={15} className="text-[#1e88a8]" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1.5">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm">
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes dropIn {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </nav>

      {/* ACTIVE VIEWS */}
      {activeView && (
        <div className="fixed top-14 lg:top-[70px] lg:left-72 left-0 right-0 bottom-0 z-20 bg-gray-50 overflow-auto">
          {/* Close strip */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 capitalize">
              {activeView === "register" ? "Register Student" : "Calendar"}
            </h2>
            <button
              onClick={() => setActiveView(null)}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <div className="p-6">
            {activeView === "register" && <Register />}
            {activeView === "calendar" && <Calendar />}
          </div>
        </div>
      )}
    </>
  );
}