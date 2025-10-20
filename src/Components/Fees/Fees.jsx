
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
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [receiptModalId, setReceiptModalId] = useState(null);
  const [installmentFilter, setInstallmentFilter] = useState("All");
  const usersPerPage = 10;

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

  const totalStudents = filteredUsers.length;
  const paidStudents = filteredUsers.filter((u) => u.feesPaid).length;
  const totalRevenue = filteredUsers.reduce(
    (sum, u) => sum + (u.feeAmount || 0),
    0
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSubmitFee = async (
    userId,
    amount,
    installment,
    paymentMethod,
    paymentName,
  ) => {
    try {
      await axios.post("http://localhost:5000/api/fees", {
        userId,
        amount,
        installment,
        paymentMethod,
        paymentName,
      });

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
      setPaymentMethod("");
      setPaymentName("");
      alert("✅ Fee saved successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error saving fee");
    }
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

  const selectedReceiptUser = users.find((u) => u._id === receiptModalId);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
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

                        <td className="px-6 py-4 text-gray-700 text-sm">
                          {user.departments?.join(", ") || "—"}
                        </td>

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

                        <td className="px-6 py-4 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setOpenFormId(user._id)}
                            className="p-3 bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                          >
                            <Edit3 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setReceiptModalId(user._id)}
                            className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

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

        <AnimatePresence>
          {openFormId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative"
              >
                <h2 className="text-2xl font-bold mb-4">Fee Payment Form</h2>
                <button
                  onClick={() => {
                    setOpenFormId(null);
                    setPaymentMethod("");
                    setPaymentName("");
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <X />
                </button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const amount = e.target.amount.value;
                    const installment = e.target.installment.value;
                    handleSubmitFee(
                      openFormId,
                      amount,
                      installment,
                      paymentMethod,
                      paymentName
                    );
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount *
                    </label>
                    <input
                      name="amount"
                      type="number"
                      required
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Installment *
                    </label>
                    <select
                      name="installment"
                      required
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="1">Installment 1</option>
                      <option value="2">Installment 2</option>
                      <option value="3">Installment 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method *
                    </label>
                    <select
                      name="paymentMethod"
                      required
                      value={paymentMethod}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        if (e.target.value === "Cash") {
                          setPaymentName("");
                        }
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>

                  {(paymentMethod === "Cheque" ||
                    paymentMethod === "Online") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {paymentMethod === "Cheque"
                          ? "Account Number"
                          : "Transaction ID / Online Reference"}{" "}
                        *
                      </label>
                      <input
                        name="paymentName"
                        type="text"
                        required
                        value={paymentName}
                        onChange={(e) => setPaymentName(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-all"
                  >
                    Save Fee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenFormId(null);
                      setPaymentMethod("");
                      setPaymentName("");
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* <AnimatePresence>
          {receiptModalId && selectedReceiptUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative"
              >
                <h2 className="text-2xl font-bold mb-4">
                  Fee Receipt - {selectedReceiptUser.name}
                </h2>
                <button
                  onClick={() => setReceiptModalId(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <X />
                </button>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-600 font-medium mb-1">
                        Amount Paid
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{selectedReceiptUser.feeAmount}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Installment
                      </p>
                      <p className="text-lg font-semibold text-blue-700">
                        {selectedReceiptUser.installment}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Email:
                      </span>
                      <span className="text-gray-800 text-sm flex-1 break-all">
                        {selectedReceiptUser.email}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Phone:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.phone}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Department:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.departments?.join(", ") || "—"}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Positions:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.positions?.join(", ")}
                      </span>
                    </div>

                    <div className="flex items-start pt-2 border-t border-gray-200">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Payment Date:
                      </span>
                      <span className="text-gray-800 text-sm font-semibold flex-1">
                        {selectedReceiptUser.feeDate
                          ? new Date(
                              selectedReceiptUser.feeDate
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence> */}

        <AnimatePresence>
          {receiptModalId && selectedReceiptUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative"
              >
                <h2 className="text-2xl font-bold mb-4">
                  Fee Receipt - {selectedReceiptUser.name}
                </h2>
                <button
                  onClick={() => setReceiptModalId(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <X />
                </button>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-600 font-medium mb-1">
                        Amount Paid
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{selectedReceiptUser.feeAmount}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Installment
                      </p>
                      <p className="text-lg font-semibold text-blue-700">
                        {selectedReceiptUser.installment}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Email:
                      </span>
                      <span className="text-gray-800 text-sm flex-1 break-all">
                        {selectedReceiptUser.email}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Phone:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.phone}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Department:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.departments?.join(", ") || "—"}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Positions:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.positions?.join(", ")}
                      </span>
                    </div>

                    {/* ✅ Payment Method */}
                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Payment Method:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.paymentMethod || "—"}
                      </span>
                    </div>

                    {/* ✅ Transaction/Ref */}
                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Transaction/Ref:
                      </span>
                      <span className="text-gray-800 text-sm flex-1">
                        {selectedReceiptUser.paymentName || "—"}
                      </span>
                    </div>

                    <div className="flex items-start pt-2 border-t border-gray-200">
                      <span className="text-gray-500 text-sm font-medium min-w-[100px]">
                        Payment Date:
                      </span>
                      <span className="text-gray-800 text-sm font-semibold flex-1">
                        {selectedReceiptUser.feeDate
                          ? new Date(
                              selectedReceiptUser.feeDate
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
