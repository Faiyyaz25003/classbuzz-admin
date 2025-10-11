import React, { useEffect, useState } from "react";
import axios from "axios";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);

  // Fetch all leave requests
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leave");
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  // Handle Accept / Reject
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/${id}`, { status });
      alert(`Leave ${status} successfully! Email sent to user.`);
      fetchLeaves(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update leave status.");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Leave Requests</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">From</th>
            <th className="p-2 border">To</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="text-sm">
              <td className="p-2 border">{leave.userId?.name}</td>
              <td className="p-2 border">{leave.userId?.email}</td>
              <td className="p-2 border">{leave.reason}</td>
              <td className="p-2 border">{leave.fromDate}</td>
              <td className="p-2 border">{leave.toDate}</td>
              <td
                className={`p-2 border font-semibold ${
                  leave.status === "Accepted"
                    ? "text-green-600"
                    : leave.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {leave.status}
              </td>
              <td className="p-2 border">
                {leave.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(leave._id, "Accepted")}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(leave._id, "Rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leave;
