import React, { useEffect, useState } from "react";
import axios from "axios";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);

  // Fetch all leave requests from backend
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leave"); // ✅ Correct endpoint
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  // Handle Accept / Reject status change
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/${id}`, { status }); // ✅ We'll add this route in backend
      alert(`Leave ${status} successfully!`);
      fetchLeaves(); // refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update leave status.");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Leave Applications
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full border border-gray-300 rounded-xl">
          <thead>
            <tr className="bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white">
              <th className="p-3 border">Employee</th>
              <th className="p-3 border">Approver</th>
              <th className="p-3 border">Leave Type</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">From</th>
              <th className="p-3 border">To</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-6 text-gray-500 font-medium"
                >
                  No leave applications found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-b text-sm">
                  <td className="p-3 border text-gray-700">
                    {leave.userName || "N/A"}
                  </td>
                  <td className="p-3 border">{leave.approver}</td>
                  <td className="p-3 border">{leave.leaveType}</td>
                  <td className="p-3 border truncate max-w-xs">
                    {leave.reason}
                  </td>
                  <td className="p-3 border">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    {new Date(leave.toDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-3 border font-semibold ${
                      leave.status === "Accepted"
                        ? "text-green-600"
                        : leave.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {leave.status}
                  </td>
                  <td className="p-3 border">
                    {leave.status === "Pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(leave._id, "Accepted")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(leave._id, "Rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="italic text-gray-500">No Action</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
