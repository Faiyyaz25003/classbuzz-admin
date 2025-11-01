

import { useEffect, useState } from "react";
import {
  Eye,
  FileText,
  Image,
  CreditCard,
  User,
  Download,
  Trash2,
} from "lucide-react";

export default function Documents() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧾 Fetch all uploaded documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/documents");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, []);

  // 📥 Download file
  const handleDownload = (id, field) => {
    window.open(`http://localhost:5000/api/documents/download/${id}/${field}`);
  };

  // 👁️ Preview file
  const handlePreview = (id, field) => {
    window.open(`http://localhost:5000/uploads/${id}/${field}`, "_blank");
  };

  // 🗑️ Delete specific document (not full user)
  const handleDeleteDocument = async (id, field) => {
    if (!window.confirm(`Delete ${field} document for this user?`)) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/documents/delete/${id}/${field}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      alert(data.message || "File deleted successfully");

      // Remove the deleted field from UI
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, [field]: null } : user
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error deleting document");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete entire user record
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user record?"))
      return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message || "User deleted successfully");

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting user record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Uploaded Documents
          </h2>
          <p className="text-gray-600">
            View, download, or delete user documents
          </p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-500 text-lg">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded-full p-2">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white truncate">
                      {user.name}
                    </h3>
                  </div>
                  <button
                    disabled={loading}
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-white hover:text-red-300"
                    title="Delete entire user record"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Document List */}
                <div className="p-5 space-y-3">
                  {/* Aadhaar */}
                  {user.aadhaar && (
                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-emerald-600" size={22} />
                        <span className="font-medium">Aadhaar Card</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(user._id, "aadhaar")}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(user._id, "aadhaar")}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDocument(user._id, "aadhaar")
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Marksheet */}
                  {user.marksheet && (
                    <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="text-amber-600" size={22} />
                        <span className="font-medium">Marksheet</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(user._id, "marksheet")}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(user._id, "marksheet")}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDocument(user._id, "marksheet")
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photo */}
                  {user.photo && (
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image className="text-purple-600" size={22} />
                        <span className="font-medium">Photo</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(user._id, "photo")}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(user._id, "photo")}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDocument(user._id, "photo")
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
