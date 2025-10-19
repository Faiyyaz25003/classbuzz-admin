"use client";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  RefreshCw,
  Calendar,
  Eye,
  X,
  Edit3,
  Search,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Fees() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openFormId, setOpenFormId] = useState(null);
  const [installmentFilter, setInstallmentFilter] = useState("All");
  const usersPerPage = 10;

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      const usersWithFees = res.data.map((u) => ({
        ...u,
        feesPaid: u.feesPaid || false,
        feeAmount: u.feeAmount || 0,
        installment: u.installment || 0,
      }));
      setUsers(usersWithFees);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination & filtering
  const filteredUsers = users
    .filter((user) =>
      user.positions?.some((p) => p === "Student" || p === "Monitor")
    )
    .filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) =>
      installmentFilter === "All"
        ? true
        : user.installment === parseInt(installmentFilter)
    );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // Statistics
  const totalStudents = filteredUsers.length;
  const paidStudents = filteredUsers.filter((u) => u.feesPaid).length;
  const totalRevenue = filteredUsers.reduce(
    (sum, u) => sum + (u.feeAmount || 0),
    0
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Update fee with cumulative logic
  const handleSubmitFee = (userId, amount, installment) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u._id === userId) {
          const newAmount = u.feeAmount + parseFloat(amount);
          const newInstallment = parseInt(installment);
          return {
            ...u,
            feesPaid: true,
            feeAmount: newAmount,
            installment: newInstallment,
          };
        }
        return u;
      })
    );
    setOpenFormId(null);
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
      "from-blue-400 to-blue-500",
      "from-green-400 to-green-500",
      "from-purple-400 to-purple-500",
      "from-pink-400 to-pink-500",
      "from-indigo-400 to-indigo-500",
      "from-teal-400 to-teal-500",
      "from-orange-400 to-orange-500",
      "from-cyan-400 to-cyan-500",
    ];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  const getPositionColor = (position) => {
    const colors = {
      Student: "bg-blue-100 text-blue-800",
      Professor: "bg-purple-100 text-purple-800",
      "Assistant Professor": "bg-indigo-100 text-indigo-800",
      "Lab Assistant": "bg-green-100 text-green-800",
      Librarian: "bg-pink-100 text-pink-800",
      Monitor: "bg-teal-100 text-teal-800",
      HOD: "bg-red-100 text-red-800",
      Principal: "bg-gray-200 text-gray-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                Student Fee Management
              </h1>
              <p className="text-gray-600 text-sm">
                Track and manage student fee payments efficiently
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-64 pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUsers}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-5 h-5" /> Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Students
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {totalStudents}
                </h3>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Fees Paid
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {paidStudents}
                </h3>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Revenue
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                  ₹{totalRevenue.toLocaleString()}
                </h3>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Installment Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {["All", "1", "2", "3"].map((inst) => (
            <motion.button
              key={inst}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInstallmentFilter(inst);
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all shadow-md ${
                installmentFilter === inst
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {inst === "All" ? "All Students" : `Installment ${inst}`}
            </motion.button>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="mx-auto w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className="text-gray-700 text-lg">Loading students...</p>
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto w-12 h-12 text-yellow-400 mb-4" />
              <p className="text-gray-700 text-lg">
                No student or monitor records found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Fees
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {currentUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Student */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(
                                user.name
                              )} flex items-center justify-center text-white font-bold text-lg shadow`}
                            >
                              {getInitials(user.name)}
                            </div>
                            <span className="font-medium text-gray-800">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-6 py-4 text-gray-700 text-sm">
                          {user.departments?.join(", ") || "—"}
                        </td>

                        {/* Position */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {user.positions?.map((p) => (
                              <span
                                key={p}
                                className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getPositionColor(
                                  p
                                )}`}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Details */}
                        <td className="px-6 py-4">
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-gray-500" />
                              {user.gender || "N/A"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {user.joinDate
                                ? new Date(user.joinDate).toLocaleDateString()
                                : "—"}
                            </div>
                          </div>
                        </td>

                        {/* Fees */}
                        <td className="px-6 py-4">
                          {user.feesPaid ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <div>
                                <p className="text-gray-800 font-semibold">
                                  ₹{user.feeAmount}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Installment {user.installment}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                              <span className="text-gray-500 text-sm">
                                Not Paid
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          {openFormId === user._id ? (
                            <form
                              className="flex gap-2 items-center"
                              onSubmit={(e) => {
                                e.preventDefault();
                                const amount = e.target.amount.value;
                                const installment = e.target.installment.value;
                                handleSubmitFee(user._id, amount, installment);
                              }}
                            >
                              <input
                                name="amount"
                                type="number"
                                placeholder="Amount"
                                required
                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm w-24 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <select
                                name="installment"
                                required
                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="1">Installment 1</option>
                                <option value="2">Installment 2</option>
                                <option value="3">Installment 3</option>
                              </select>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium shadow-md"
                              >
                                Save
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setOpenFormId(null)}
                                className="p-2 bg-red-500 text-white rounded-lg shadow-md"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </form>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setOpenFormId(user._id)}
                              className="p-3 bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                              <Edit3 className="w-5 h-5" />
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
            >
              Prev
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(p)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  p === currentPage
                    ? "bg-blue-500 text-white shadow-md"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {p}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
