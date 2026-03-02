

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StatCard = ({ icon, label, value, color }) => (
  <div
    className={`bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 border-l-4 ${color}`}
  >
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  </div>
);

export default function FeeManagement() {
  const [users, setUsers] = useState([]);
  const [fees, setFees] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState("All");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    installment: "",
    paymentMethod: "Cash",
    paymentName: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fees");
      setFees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/fees/add", formData);
      setSuccessMsg("Fee Added Successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchFees();
      setFormData({
        userId: "",
        amount: "",
        installment: "",
        paymentMethod: "Cash",
        paymentName: "",
      });
    } catch (error) {
      alert("Error adding fee");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (fee) => {
    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("ABC SCHOOL", 105, 18, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Fee Payment Receipt", 105, 30, { align: "center" });

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);

    const infoY = 55;
    doc.setFont("helvetica", "bold");
    doc.text("Receipt Details", 20, infoY);
    doc.setDrawColor(37, 99, 235);
    doc.line(20, infoY + 2, 100, infoY + 2);

    doc.setFont("helvetica", "normal");
    const fields = [
      ["Receipt ID:", fee._id],
      ["Date:", new Date(fee.feeDate).toLocaleDateString()],
      ["Student Name:", fee.userId?.name],
      ["Installment:", `Installment ${fee.installment}`],
      ["Payment Method:", fee.paymentMethod],
    ];
    if (fee.paymentName) fields.push(["Transaction ID:", fee.paymentName]);

    fields.forEach(([label, value], i) => {
      doc.text(label, 20, infoY + 12 + i * 8);
      doc.text(String(value), 70, infoY + 12 + i * 8);
    });

    autoTable(doc, {
      startY: infoY + 12 + fields.length * 8 + 6,
      head: [["Description", "Amount"]],
      body: [["Tuition Fee", `Rs.${fee.amount}`]],
      headStyles: { fillColor: [37, 99, 235] },
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.setFillColor(240, 245, 255);
    doc.rect(14, finalY + 8, 182, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235);
    doc.text(`Total Paid: Rs.${fee.amount}`, 20, finalY + 18);

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Authorized Signature", 140, finalY + 40);
    doc.line(135, finalY + 42, 195, finalY + 42);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for your payment!", 105, 285, { align: "center" });

    doc.save(`Receipt_${fee.userId?.name}.pdf`);
  };

  const filteredFees =
    selectedInstallment === "All"
      ? fees
      : fees.filter((f) => f.installment === Number(selectedInstallment));

  const totalRevenue = fees.reduce((acc, f) => acc + Number(f.amount), 0);
  const installmentCount = (n) =>
    fees.filter((f) => f.installment === n).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-8 font-sans">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            🎓 Fee Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage student fee payments & receipts
          </p>
        </div>
        <div className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow">
          ABC School
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon="👨‍🎓"
          label="Total Students"
          value={users.length}
          color="border-blue-500"
        />
        <StatCard
          icon="✅"
          label="Fees Collected"
          value={fees.length}
          color="border-green-500"
        />
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`Rs.${totalRevenue.toLocaleString()}`}
          color="border-indigo-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", 1, 2, 3].map((item) => (
          <button
            key={item}
            onClick={() => setSelectedInstallment(item)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
              selectedInstallment === item
                ? "bg-blue-600 text-white shadow-blue-200 shadow-md scale-105"
                : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            {item === "All"
              ? "🗂 All Students"
              : `📋 Installment ${item} (${installmentCount(item)})`}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-700 mb-5 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm">
            + New
          </span>
          Add Fee Payment
        </h2>

        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
            ✅ {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <select
            required
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
            className="border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          >
            <option value="">👤 Select Student</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount (Rs.)"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />

          <select
            required
            value={formData.installment}
            onChange={(e) =>
              setFormData({ ...formData, installment: e.target.value })
            }
            className="border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          >
            <option value="">📋 Select Installment</option>
            <option value="1">Installment 1</option>
            <option value="2">Installment 2</option>
            <option value="3">Installment 3</option>
          </select>

          <select
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({ ...formData, paymentMethod: e.target.value })
            }
            className="border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          >
            <option value="Cash">💵 Cash</option>
            <option value="UPI">📱 UPI</option>
            <option value="Cheque">🏦 Cheque</option>
          </select>

          <input
            type="text"
            placeholder="🔖 Transaction ID (Optional)"
            value={formData.paymentName}
            onChange={(e) =>
              setFormData({ ...formData, paymentName: e.target.value })
            }
            className="border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 col-span-1 sm:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="col-span-1 sm:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md disabled:opacity-60"
          >
            {loading ? "⏳ Adding..." : "✅ Add Fee Payment"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">📊 Fee Records</h2>
          <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
            {filteredFees.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Installment</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {fee.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        {fee.userId?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      Rs.{Number(fee.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Installment {fee.installment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          fee.paymentMethod === "Cash"
                            ? "bg-yellow-100 text-yellow-700"
                            : fee.paymentMethod === "UPI"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {fee.paymentMethod === "Cash"
                          ? "💵"
                          : fee.paymentMethod === "UPI"
                            ? "📱"
                            : "🏦"}{" "}
                        {fee.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(fee.feeDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => downloadReceipt(fee)}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm"
                      >
                        📄 Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">
        © {new Date().getFullYear()} ABC School Fee Management System
      </p>
    </div>
  );
}