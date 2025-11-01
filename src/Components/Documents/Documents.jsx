
import { useState, useEffect } from "react";
import { FileText, Download, Trash2, Users, Eye, Search } from "lucide-react";

export default function AdminDocuments() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAllUsersDocuments();
  }, []);

  const fetchAllUsersDocuments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/documents/admin/all-users"
      );
      const data = await response.json();

      if (data.success) {
        setUsersData(data.users);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Document deleted successfully");
        fetchAllUsersDocuments();
      } else {
        alert(data.message || "Failed to delete document");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting document");
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/documents/download/${documentId}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      alert("Error downloading document");
    }
  };

  const filteredUsers = usersData.filter((user) =>
    user._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Loading documents...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  All Users Documents
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Total Users: {usersData.length} | Total Documents:{" "}
                  {usersData.reduce(
                    (sum, user) => sum + user.totalDocuments,
                    0
                  )}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by User ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* User Header */}
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 cursor-pointer"
                  onClick={() =>
                    setSelectedUser(selectedUser === user._id ? null : user._id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          User ID: {user._id}
                        </h3>
                        <p className="text-blue-100 text-sm">
                          {user.totalDocuments} document
                          {user.totalDocuments !== 1 ? "s" : ""} | Last upload:{" "}
                          {formatDate(user.lastUpload)}
                        </p>
                      </div>
                    </div>
                    <Eye
                      className={`w-6 h-6 text-white transition-transform ${
                        selectedUser === user._id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Documents List */}
                {selectedUser === user._id && (
                  <div className="p-4 space-y-3">
                    {user.documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">
                                {doc.originalName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Type:{" "}
                                <span className="font-medium">
                                  {doc.documentType}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">
                                Size: {formatFileSize(doc.fileSize)} | Uploaded:{" "}
                                {formatDate(doc.uploadedAt)}
                              </p>
                              <span
                                className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                                  doc.status === "verified"
                                    ? "bg-green-100 text-green-700"
                                    : doc.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {doc.status?.toUpperCase() || "PENDING"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() =>
                                handleDownload(doc._id, doc.originalName)
                              }
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc._id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}