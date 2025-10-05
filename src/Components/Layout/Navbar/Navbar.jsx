
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
//   X,
//   CalendarCheck,
// } from "lucide-react";

// import Register from "@/Components/Auth/Register/Register";
// import Calendar from "@/Components/Calender/Calender";

// export default function Navbar() {
//   const pathname = "/";
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
//       if (!e.target.closest(".notification-dropdown"))
//         setIsNotificationOpen(false);
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

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
//     {
//       id: 3,
//       title: "Grade Posted",
//       message: "Your physics test score is available",
//       time: "2 hours ago",
//       unread: false,
//     },
//   ];

//   const navLinks = [
//     { name: "Dashboard", href: "/" },
//     { name: "Classes", href: "/classes" },
//     { name: "Assignments", href: "/assignments" },
//     { name: "Calendar", href: "/calendar" },
//   ];

//   return (
//     <>
//       <nav
//         className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-80 left-0 ${
//           isScrolled
//             ? "bg-[#1e7a8c]/95 backdrop-blur-md shadow-lg"
//             : "bg-gradient-to-r from-[#1e7a8c] to-[#2596ad]"
//         }`}
//       >
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             {/* Left Section - Search */}
//             <div className="flex items-center gap-4 lg:gap-6 flex-1">
//               <div className="hidden md:flex flex-1 max-w-2xl">
//                 <div className="relative w-full group">
//                   <Search
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors"
//                     size={22}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search anything..."
//                     className="w-full pl-14 pr-6 py-4 text-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/70 rounded-2xl focus:border-white/40 focus:bg-white/20 focus:outline-none transition-all duration-300"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Right Section - Actions */}
//             <div className="flex items-center gap-2 sm:gap-4">
//               {/* Mobile Search Button */}
//               <button className="md:hidden text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
//                 <Search size={20} />
//               </button>

//               {/* Register Button */}
//               <button
//                 title="Register Student"
//                 onClick={() => setIsStudentModalOpen(true)}
//                 className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-300"
//               >
//                 <UserPlus size={20} />
//               </button>

//               {/* Calendar Button */}
//               <button
//                 title="Calendar"
//                 onClick={() => setIsCalendarOpen(true)}
//                 className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-300"
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
//                     3
//                   </span>
//                 </button>

//                 {/* Notification Dropdown */}
//                 {isNotificationOpen && (
//                   <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
//                     <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
//                       <h3 className="text-white font-semibold text-lg">
//                         Notifications
//                       </h3>
//                       <p className="text-cyan-100 text-sm">
//                         You have {notifications.filter((n) => n.unread).length}{" "}
//                         unread messages
//                       </p>
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                       {notifications.map((notif) => (
//                         <div
//                           key={notif.id}
//                           className={`p-4 border-b border-gray-100 hover:bg-cyan-50 transition-colors cursor-pointer ${
//                             notif.unread ? "bg-blue-50/50" : ""
//                           }`}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div
//                               className={`w-2 h-2 rounded-full mt-2 ${
//                                 notif.unread ? "bg-blue-500" : "bg-gray-300"
//                               }`}
//                             ></div>
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-gray-800">
//                                 {notif.title}
//                               </h4>
//                               <p className="text-sm text-gray-600 mt-1">
//                                 {notif.message}
//                               </p>
//                               <p className="text-xs text-gray-400 mt-2">
//                                 {notif.time}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="p-3 bg-gray-50 text-center">
//                       <button className="text-[#1e88a8] font-medium text-sm hover:underline">
//                         View All Notifications
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Profile Dropdown */}
//               <div className="relative profile-dropdown">
//                 <div className="relative inline-flex items-center">
//                   <button
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
//                   >
//                     <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center shadow-md relative">
//                       <User size={20} className="text-white" />
//                     </div>
//                     <div className="hidden sm:block text-left">
//                       <p className="text-sm font-semibold text-white">
//                         Faiyyaz Khan
//                       </p>
//                       <p className="text-xs text-white/80">Administrator</p>
//                     </div>
//                     <ChevronDown
//                       size={16}
//                       className={`hidden sm:block text-white/80 transition-transform duration-300 ${
//                         isProfileOpen ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>
//                 </div>

//                 {/* Profile Dropdown Menu */}
//                 {isProfileOpen && (
//                   <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
//                     <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
//                           <User size={24} className="text-white" />
//                         </div>
//                         <div>
//                           <p className="text-white font-semibold">
//                             Faiyyaz Khan
//                           </p>
//                           <p className="text-cyan-100 text-sm">
//                             faiyyaz@classbuzz.com
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-2">
//                       <Link
//                         href="/profile"
//                         className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
//                       >
//                         <User size={18} />
//                         <span className="font-medium">My Profile</span>
//                       </Link>
//                       <Link
//                         href="/messages"
//                         className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
//                       >
//                         <Mail size={18} />
//                         <span className="font-medium">Messages</span>
//                       </Link>
//                       <Link
//                         href="/settings"
//                         className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
//                       >
//                         <Settings size={18} />
//                         <span className="font-medium">Settings</span>
//                       </Link>
//                       <div className="h-px bg-gray-200 my-2"></div>
//                       <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 hover:text-red-700">
//                         <LogOut size={18} />
//                         <span className="font-medium">Logout</span>
//                       </button>
//                     </div>
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

//       {/* Register Student - Shows below navbar and next to sidebar */}
//       {isStudentModalOpen && (
//         <div className="fixed top-16 lg:top-20 lg:left-80 left-0 right-0 bottom-0 z-20 bg-gray-50 overflow-auto">
//           <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">

//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   Register Student
//                 </h2>
              
//               </div>
//               <Register onSuccess={() => setIsStudentModalOpen(false)} />
          
//           </div>
//         </div>
//       )}

//       {/* Calendar - Shows below navbar and next to sidebar */}
//       {isCalendarOpen && (
//         <div className="fixed top-16 lg:top-20 lg:left-80 left-0 right-0 bottom-0 z-20 bg-gray-50 overflow-auto">
//           <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
            
             
//               <Calendar />
          
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
  Mail,
  UserPlus,
  CalendarCheck,
} from "lucide-react";

import Register from "@/Components/Auth/Register/Register";
import Calendar from "@/Components/Calender/Calender";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeView, setActiveView] = useState(null); // "register" | "calendar" | null

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
      if (!e.target.closest(".notification-dropdown"))
        setIsNotificationOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Notification data
  const notifications = [
    {
      id: 1,
      title: "New Assignment",
      message: "Math homework due tomorrow",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Team sync at 3 PM today",
      time: "1 hour ago",
      unread: true,
    },
  ];

  // Toggle between views (register/calendar)
  const handleViewToggle = (view) => {
    setActiveView((prev) => (prev === view ? null : view));
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-80 left-0 ${
          isScrolled
            ? "bg-[#1e7a8c]/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-r from-[#1e7a8c] to-[#2596ad]"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-14 pr-6 py-4 text-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/70 rounded-2xl focus:border-white/40 focus:bg-white/20 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Register */}
              <button
                title="Register Student"
                onClick={() => handleViewToggle("register")}
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  activeView === "register"
                    ? "bg-white/30"
                    : "bg-white/10 hover:bg-white/20"
                } text-white/90 hover:text-white transition-all duration-300`}
              >
                <UserPlus size={20} />
              </button>

              {/* Calendar */}
              <button
                title="Calendar"
                onClick={() => handleViewToggle("calendar")}
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  activeView === "calendar"
                    ? "bg-white/30"
                    : "bg-white/10 hover:bg-white/20"
                } text-white/90 hover:text-white transition-all duration-300`}
              >
                <CalendarCheck size={20} />
              </button>

              {/* Notifications */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-300"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
                      <h3 className="text-white font-semibold text-lg">
                        Notifications
                      </h3>
                      <p className="text-cyan-100 text-sm">
                        {notifications.length} new updates
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-gray-100 hover:bg-cyan-50 transition-colors cursor-pointer ${
                            n.unread ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <h4 className="font-semibold text-gray-800">
                            {n.title}
                          </h4>
                          <p className="text-sm text-gray-600">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <User size={20} className="text-white" />
                  <div className="flex flex-col items-start leading-tight text-white text-sm">
                    <span className="font-semibold">Faiyyaz Khan</span>
                    <span className="text-xs text-white/70">Administrator</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-white/80 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 transition-colors text-gray-700"
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 transition-colors text-gray-700"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Animation */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </nav>

      {/* ACTIVE VIEW BELOW NAVBAR */}
      {activeView === "register" && (
        <div className="fixed top-16 lg:top-20 lg:left-80 left-0 right-0 bottom-0 z-20 bg-gray-50 overflow-auto">
          <div className="p-6">
            <Register />
          </div>
        </div>
      )}

      {activeView === "calendar" && (
        <div className="fixed top-16 lg:top-20 lg:left-80 left-0 right-0 bottom-0 z-20 bg-gray-50 overflow-auto">
          <div className="p-6">
            <Calendar />
          </div>
        </div>
      )}
    </>
  );
}
