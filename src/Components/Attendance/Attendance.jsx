"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PunchinHistory = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [remarkFilter, setRemarkFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const backendURL = "http://localhost:5000/api/attendance";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/history`);
        if (response.data.success) {
          const mergedData = [];
          const tempMap = {};

          response.data.punches.forEach((rec) => {
            const dateKey = new Date(rec.createdAt).toISOString().split("T")[0];
            if (!tempMap[dateKey]) {
              tempMap[dateKey] = { date: dateKey, in: null, out: null };
            }
            if (rec.type === "in") tempMap[dateKey].in = rec;
            if (rec.type === "out") tempMap[dateKey].out = rec;
          });

          for (const key in tempMap) {
            const rec = tempMap[key];
            mergedData.push({
              date: rec.date,
              inTime: rec.in?.time || "",
              inLocation: rec.in?.location || "",
              inPhoto: rec.in?.photo || "",
              outTime: rec.out?.time || "",
              outLocation: rec.out?.location || "",
              outPhoto: rec.out?.photo || "",
              photo: rec.in?.photo || rec.out?.photo || "",
              remark:
                rec.in && rec.out
                  ? "Present"
                  : rec.in && !rec.out
                  ? "Half Day"
                  : "Absent",
            });
          }

          mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
          setAttendanceData(mergedData);
        } else {
          alert("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching punch history from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = attendanceData.filter((record) => {
    const matchesDate = selectedDate
      ? record.date.includes(selectedDate)
      : true;
    const matchesRemark =
      remarkFilter !== "all"
        ? (record.remark || "").toLowerCase() === remarkFilter.toLowerCase()
        : true;
    return matchesDate && matchesRemark;
  });

  const getRemarkStyle = (remark) => {
    switch ((remark || "").toLowerCase()) {
      case "absent":
        return "bg-red-100 text-red-700";
      case "present":
        return "bg-green-100 text-green-700";
      case "leave":
        return "bg-yellow-100 text-yellow-700";
      case "half day":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStats = () => {
    const total = filteredData.length;
    const absent = filteredData.filter(
      (r) => (r.remark || "").toLowerCase() === "absent"
    ).length;
    const present = filteredData.filter(
      (r) => (r.remark || "").toLowerCase() === "present"
    ).length;
    return { total, absent, present };
  };

  const openModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h1 className="text-3xl font-bold text-white text-center">
              ATTENDANCE RECORDS
            </h1>
            <p className="text-white/80 text-center mt-2">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Filter by Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Filter by Remark:
                </label>
                <select
                  value={remarkFilter}
                  onChange={(e) => setRemarkFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Records</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                  <option value="half day">Half Day</option>
                </select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl">
                <div className="text-sm text-green-700 font-medium">
                  Total Records
                </div>
                <div className="text-2xl font-bold text-green-900 mt-1">
                  {stats.total}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl">
                <div className="text-sm text-blue-700 font-medium">
                  Present Days
                </div>
                <div className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.present}
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-100 p-4 rounded-xl">
                <div className="text-sm text-red-700 font-medium">
                  Absent Days
                </div>
                <div className="text-2xl font-bold text-red-900 mt-1">
                  {stats.absent}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center p-6 text-gray-500">
                Loading records...
              </p>
            ) : filteredData.length === 0 ? (
              <p className="text-center p-6 text-gray-500">
                No records found. Adjust your filters.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-blue-500">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      In Location
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                      In Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Out Location
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Out Time
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Remark
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((record, index) => (
                    <tr
                      key={index}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {new Date(record.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {record.inLocation || "-"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-mono font-semibold text-gray-900">
                        {record.inTime || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {record.outLocation || "-"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-mono font-semibold text-gray-900">
                        {record.outTime || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRemarkStyle(
                            record.remark
                          )}`}
                        >
                          {record.remark}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openModal(record)}
                          className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all shadow-md text-sm font-semibold"
                        >
                          Photo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                Details -{" "}
                {new Date(selectedRecord.date).toLocaleDateString("en-GB")}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Punch In Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Punch In
                </h3>

                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedRecord.inTime || "-"}
                </div>

                <div className="text-gray-600 mb-4">
                  {selectedRecord.inLocation || "Location not available"}
                </div>

                {selectedRecord.inPhoto ? (
                  <img
                    src={selectedRecord.inPhoto}
                    alt="Punch In"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Photo
                  </div>
                )}
              </div>

              {/* Punch Out Section */}
              <div className="pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Punch Out
                </h3>

                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedRecord.outTime || "-"}
                </div>

                <div className="text-gray-600 mb-4">
                  {selectedRecord.outLocation || "Location not available"}
                </div>

                {selectedRecord.outPhoto ? (
                  <img
                    src={selectedRecord.outPhoto}
                    alt="Punch Out"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Photo
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchinHistory;
