
import React, { useEffect, useState } from "react";
import axios from "axios";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);

  // Fetch all leave requests from backend
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leave");
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  // Handle Accept / Reject status change
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/${id}`, { status });
      alert(`Leave ${status} successfully!`);
      fetchLeaves();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update leave status.");
    }
  };

  // Handle Delete leave
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this leave?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/leave/${id}`);
    alert("Leave deleted successfully!");
    fetchLeaves();
  } catch (error) {
    console.error("Error deleting leave:", error);
    alert("Failed to delete leave.");
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
              <th className="p-3 border">User Name</th>
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
                  <td className="p-3 border flex flex-col gap-2">
                    {leave.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(leave._id, "Accepted")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
                    )}
                    <button
                      onClick={() => handleDelete(leave._id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Delete
                    </button>
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
