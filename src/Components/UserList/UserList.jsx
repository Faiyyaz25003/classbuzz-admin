
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
  Edit3,
  Ban,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departments: "",
    positions: "",
  });
  const usersPerPage = 10;

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

  // 🔹 Handle Edit Modal
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      departments: user.departments?.join(", ") || "",
      positions: user.positions?.join(", ") || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, {
        ...formData,
        departments: formData.departments.split(",").map((d) => d.trim()),
        positions: formData.positions.split(",").map((p) => p.trim()),
      });
      setEditingUser(null);
      fetchUsers();
      alert("✅ User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("❌ Failed to update user");
    }
  };

  // 🔹 Handle Block / Unblock
  const handleBlock = async (userId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${userId}/block`);
      fetchUsers();
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  // 🔹 Filters, Pagination, etc
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    const matchesFilter =
      activeFilter === "All" || user.positions?.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
                      "Action",
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

                        {/* ✅ Action Column */}
                        <td className="px-4 py-3 text-gray-700">
                          <div className="flex items-center gap-3">
                            <button
                              title="Edit User"
                              onClick={() => handleEdit(user)}
                              className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>

                            <button
                              title={
                                user.isBlocked ? "Unblock User" : "Block User"
                              }
                              onClick={() => handleBlock(user._id)}
                              className={`p-1.5 rounded-full transition ${
                                user.isBlocked
                                  ? "bg-green-100 hover:bg-green-200"
                                  : "bg-red-100 hover:bg-red-200"
                              }`}
                            >
                              <Ban
                                className={`w-4 h-4 ${
                                  user.isBlocked
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              />
                            </button>
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

        {/* 🔹 Edit Modal */}
        <AnimatePresence>
          {editingUser && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  onClick={() => setEditingUser(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  ✏️ Edit User
                </h2>
                <div className="space-y-3">
                  {["name", "email", "phone", "departments", "positions"].map(
                    (field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-600 capitalize">
                          {field}
                        </label>
                        <input
                          type="text"
                          value={formData[field]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
