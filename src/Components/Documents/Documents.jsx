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

      // remove user from list
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting user record");
    } finally {
      setLoading(false);
    }
  };

  // 📥 Download file
  const handleDownload = (id, field) => {
    window.open(`http://localhost:5000/api/documents/download/${id}/${field}`);
  };

  // 👁️ Preview file
  const handlePreview = (id, field) => {
    window.open(`http://localhost:5000/uploads/${id}/${field}`, "_blank");
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
                {/* Header with username + delete button */}
                <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded-full p-2">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white truncate">
                      {user.name}
                    </h3>
                  </div>

                  {/* Delete User Button */}
                  <button
                    disabled={loading}
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-white bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8]  hover:bg-white p-2 rounded-full transition-colors"
                    title="Delete entire user record"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Document list */}
                <div className="p-5 space-y-3">
                  {/* Aadhaar */}
                  {user.aadhaar && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 rounded-lg p-2">
                          <CreditCard className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            Aadhaar Card
                          </p>
                          <p className="text-xs text-gray-500">User identity</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(user._id, "aadhaar")}
                          className="text-emerald-600 hover:text-emerald-800"
                          title="View Aadhaar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(user._id, "aadhaar")}
                          className="text-emerald-600 hover:text-emerald-800"
                          title="Download Aadhaar"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Marksheet */}
                  {user.marksheet && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500 rounded-lg p-2">
                          <FileText className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Marksheet</p>
                          <p className="text-xs text-gray-500">
                            Academic proof
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(user._id, "marksheet")}
                          className="text-amber-600 hover:text-amber-800"
                          title="View Marksheet"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(user._id, "marksheet")}
                          className="text-amber-600 hover:text-amber-800"
                          title="Download Marksheet"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photo */}
                  {user.photo && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-500 rounded-lg p-2">
                          <Image className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Photo</p>
                          <p className="text-xs text-gray-500">User picture</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(user._id, "photo")}
                          className="text-purple-600 hover:text-purple-800"
                          title="View Photo"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(user._id, "photo")}
                          className="text-purple-600 hover:text-purple-800"
                          title="Download Photo"
                        >
                          <Download size={18} />
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
