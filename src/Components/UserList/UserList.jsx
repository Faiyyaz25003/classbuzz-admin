"use client";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  RefreshCw,
  Search,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // ✅ Fetch users from backend API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Filter stats
  const stats = {
    All: users.length,
    Student: users.filter((u) => u.positions?.includes("Student")).length,
    Professor: users.filter((u) => u.positions?.includes("Professor")).length,
    "Assistant Professor": users.filter((u) =>
      u.positions?.includes("Assistant Professor")
    ).length,
    "Lab Assistant": users.filter((u) => u.positions?.includes("Lab Assistant"))
      .length,
    Librarian: users.filter((u) => u.positions?.includes("Librarian")).length,
    Monitor: users.filter((u) => u.positions?.includes("Monitor")).length,
    HOD: users.filter((u) => u.positions?.includes("HOD")).length,
    Principal: users.filter((u) => u.positions?.includes("Principal")).length,
  };

  // ✅ Search + filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    const matchesFilter =
      activeFilter === "All" || user.positions?.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ Helpers
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  const getPositionColor = (position) => {
    const colors = {
      Student: "bg-blue-100 text-blue-700",
      Professor: "bg-purple-100 text-purple-700",
      "Assistant Professor": "bg-indigo-100 text-indigo-700",
      "Lab Assistant": "bg-green-100 text-green-700",
      Librarian: "bg-pink-100 text-pink-700",
      Monitor: "bg-teal-100 text-teal-700",
      HOD: "bg-red-100 text-red-700",
      Principal: "bg-gray-200 text-gray-800",
    };
    return colors[position] || "bg-blue-50 text-blue-700";
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-3 sm:p-4 md:p-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* 🔹 Header */}
        <motion.div
          className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            👥 Employee Management
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
              />
            </div>

            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* 🔹 Filters */}
        <div className="bg-white shadow-sm rounded-lg p-2">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {Object.entries(stats).map(([filter, count]) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {filter}
                <span className="ml-1 text-gray-400">({count})</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 🔹 Table */}
        <motion.div
          className="bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="mx-auto w-8 h-8 text-blue-400 animate-spin mb-3" />
              Loading users...
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                  <tr>
                    {[
                      "Employee",
                      "Contact",
                      "Department",
                      "Position",
                      "Details",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence mode="wait">
                    {currentUsers.map((user, i) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${getAvatarColor(
                                user.name
                              )} flex items-center justify-center text-white font-semibold text-sm shadow-md`}
                            >
                              {getInitials(user.name)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          <div className="flex items-center gap-1 text-xs mb-1">
                            <Mail className="w-3 h-3 text-blue-500" />{" "}
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3 text-green-500" />{" "}
                            {user.phone}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {user.departments?.join(", ") || "—"}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {user.positions?.map((p) => (
                              <span
                                key={p}
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(
                                  p
                                )}`}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-700 space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Eye className="w-3 h-3 text-purple-500" />
                            {user.gender || "N/A"}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3 h-3 text-orange-500" />
                            {user.joinDate
                              ? new Date(user.joinDate).toLocaleDateString()
                              : "—"}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* 🔹 Pagination */}
        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <motion.div
            className="bg-white rounded-xl shadow-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-blue-600">
                  {Math.min(startIndex + usersPerPage, filteredUsers.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-blue-600">
                  {filteredUsers.length}
                </span>{" "}
                entries
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`dots-${idx}`}
                        className="px-3 py-2 text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[40px] h-10 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronsRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
