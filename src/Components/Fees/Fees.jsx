
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FeeManagement() {
  const [users, setUsers] = useState([]);
  const [fees, setFees] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState("All");

  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    installment: "",
    paymentMethod: "Cash",
    paymentName: "",
  });

  // ===========================
  // Fetch Users
  // ===========================
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // Fetch Fees
  // ===========================
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

  // ===========================
  // Add Fee
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/fees/add", formData);
      alert("Fee Added Successfully ✅");
      fetchFees();

      setFormData({
        userId: "",
        amount: "",
        installment: "",
        paymentMethod: "Cash",
        paymentName: "",
      });
    } catch (error) {
      alert("Error adding fee ❌");
    }
  };

  // ===========================
  // Download Receipt PDF
  // ===========================
  const downloadReceipt = (fee) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("ABC SCHOOL", 70, 20);

    doc.setFontSize(14);
    doc.text("Fee Payment Receipt", 70, 30);

    doc.setFontSize(12);
    doc.text(`Receipt ID: ${fee._id}`, 20, 50);
    doc.text(`Date: ${new Date(fee.feeDate).toLocaleDateString()}`, 20, 58);
    doc.text(`Student Name: ${fee.userId?.name}`, 20, 66);
    doc.text(`Installment: ${fee.installment}`, 20, 74);
    doc.text(`Payment Method: ${fee.paymentMethod}`, 20, 82);

    if (fee.paymentName) {
      doc.text(`Transaction ID: ${fee.paymentName}`, 20, 90);
    }

    autoTable(doc, {
      startY: 100,
      head: [["Description", "Amount"]],
      body: [["Tuition Fee", `₹${fee.amount}`]],
    });

    doc.setFontSize(14);
    doc.text(`Total Paid: ₹${fee.amount}`, 20, doc.lastAutoTable.finalY + 15);

    doc.text("Authorized Signature", 140, doc.lastAutoTable.finalY + 35);

    doc.save(`Receipt_${fee.userId?.name}.pdf`);
  };

  // ===========================
  // Filter
  // ===========================
  const filteredFees =
    selectedInstallment === "All"
      ? fees
      : fees.filter((f) => f.installment === Number(selectedInstallment));

  const totalRevenue = fees.reduce((acc, f) => acc + Number(f.amount), 0);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Student Fee Management</h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Students</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Fees Paid</p>
          <h2 className="text-2xl font-bold">{fees.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Revenue</p>
          <h2 className="text-2xl font-bold">₹{totalRevenue}</h2>
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-4 mb-6">
        {["All", 1, 2, 3].map((item) => (
          <button
            key={item}
            onClick={() => setSelectedInstallment(item)}
            className={`px-4 py-2 rounded-lg ${
              selectedInstallment === item
                ? "bg-blue-600 text-white"
                : "bg-white shadow"
            }`}
          >
            {item === "All" ? "All Students" : `Installment ${item}`}
          </button>
        ))}
      </div>

      {/* ================= FEE FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4"
      >
        <select
          required
          value={formData.userId}
          onChange={(e) =>
            setFormData({
              ...formData,
              userId: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">Select Student</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          required
          value={formData.amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: e.target.value,
            })
          }
          className="border p-2 rounded"
        />

        <select
          required
          value={formData.installment}
          onChange={(e) =>
            setFormData({
              ...formData,
              installment: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">Installment</option>
          <option value="1">Installment 1</option>
          <option value="2">Installment 2</option>
          <option value="3">Installment 3</option>
        </select>

        <select
          value={formData.paymentMethod}
          onChange={(e) =>
            setFormData({
              ...formData,
              paymentMethod: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Cheque</option>
        </select>

        <input
          type="text"
          placeholder="Transaction ID (Optional)"
          value={formData.paymentName}
          onChange={(e) =>
            setFormData({
              ...formData,
              paymentName: e.target.value,
            })
          }
          className="border p-2 rounded col-span-2"
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded-lg"
        >
          Add Fee
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Student</th>
              <th>Amount</th>
              <th>Installment</th>
              <th>Method</th>
              <th>Date</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((fee) => (
              <tr key={fee._id} className="border-b">
                <td>{fee.userId?.name}</td>
                <td>₹{fee.amount}</td>
                <td>{fee.installment}</td>
                <td>{fee.paymentMethod}</td>
                <td>{new Date(fee.feeDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => downloadReceipt(fee)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}