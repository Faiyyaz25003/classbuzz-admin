
import React, { useEffect, useState } from "react";
import {
  Eye,
  Search,
  X,
  Download,
  FileText,
  Image,
  CreditCard,
  Trash2,
} from "lucide-react";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users first
        const usersRes = await fetch("http://localhost:5000/api/users");
        const usersData = await usersRes.json();

        // Create a map of userId -> user name
        const usersMap = {};
        (usersData || []).forEach((user) => {
          usersMap[user._id] = user.name || user.username || "Unknown User";
        });
        setUsers(usersMap);

        // Fetch documents
        const res = await fetch("http://localhost:5000/api/documents");
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response from /api/documents:", text);
          throw new Error(
            "API did not return JSON. Check backend route or URL."
          );
        }

        const data = await res.json();

        // Process documents
        const processed = (data || []).map((d) => ({
          ...d,
          userId: d.userId || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          userName: usersMap[d.userId] || "Unknown User",
        }));

        setDocuments(processed);
        setFiltered(processed);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(documents);
    } else {
      const f = documents.filter((d) => {
        const userId = (d.userId || "").toString().toLowerCase();
        const userName = (d.userName || "").toLowerCase();
        const anyFileName =
          (d.aadhaarFront || "") + (d.aadhaarBack || "") + (d.pan || "");
        return (
          userId.includes(q) ||
          userName.includes(q) ||
          anyFileName.toLowerCase().includes(q)
        );
      });
      setFiltered(f);
      setPage(1);
    }
  }, [query, documents]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openPreview = (filePath, label) => {
    if (!filePath) return;
    const fullUrl = filePath.startsWith("http")
      ? filePath
      : `http://localhost:5000/${filePath.replace(/^\/+/, "")}`;
    const isPDF = fullUrl.toLowerCase().endsWith(".pdf");
    setActiveFile({ url: fullUrl, type: isPDF ? "pdf" : "image", label });
    setModalOpen(true);
  };

  const handleDeleteClick = (doc) => {
    setDeleteTarget(doc);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/documents/${deleteTarget.userId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Failed to delete document");
      }

      // Remove from state
      const updated = documents.filter((d) => d._id !== deleteTarget._id);
      setDocuments(updated);
      setFiltered(updated);

      // Close modal
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete document: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg font-medium animate-pulse">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-bold text-xl mb-3">⚠️ {error}</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Ensure backend is running and{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              /api/documents
            </code>{" "}
            returns JSON.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                📂 Document Vault
              </h1>
              <p className="text-gray-600 text-sm">
                Review and preview all uploaded verification documents
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by Name, User ID or filename..."
                  className="pl-11 pr-5 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 w-80 transition-all duration-300 group-hover:shadow-xl"
                />
                <div className="absolute left-4 top-3.5 text-gray-400 group-hover:text-blue-500 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white px-5 py-3 rounded-xl shadow-lg border-2 border-gray-100">
                <span className="text-sm font-semibold text-gray-700">
                  {filtered.length}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  result{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Documents
                  </p>
                  <p className="text-3xl font-bold mt-1">{documents.length}</p>
                </div>
                <FileText className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">
                    Filtered Results
                  </p>
                  <p className="text-3xl font-bold mt-1">{filtered.length}</p>
                </div>
                <Search className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Current Page
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {page} / {totalPages}
                  </p>
                </div>
                <Eye className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-7">
          {paginated.map((doc) => (
            <div
              key={doc._id}
              className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-blue-300 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">
                      {(doc.userName || "U").toString().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      User Name
                    </p>
                    <p className="font-bold text-gray-800 text-lg">
                      {doc.userName || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      ID: {doc.userId || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                    {new Date(
                      doc.createdAt || doc.updatedAt || Date.now()
                    ).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleDeleteClick(doc)}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
                    title="Delete Document"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* File Rows */}
              <div className="flex flex-col gap-3">
                <FilePreviewRow
                  label="Aadhaar Front"
                  path={doc.aadhaarFront}
                  icon={<CreditCard className="w-5 h-5" />}
                  color="blue"
                  onView={() => openPreview(doc.aadhaarFront, "Aadhaar Front")}
                />
                <FilePreviewRow
                  label="Aadhaar Back"
                  path={doc.aadhaarBack}
                  icon={<CreditCard className="w-5 h-5" />}
                  color="indigo"
                  onView={() => openPreview(doc.aadhaarBack, "Aadhaar Back")}
                />
                <FilePreviewRow
                  label="PAN Card"
                  path={doc.pan}
                  icon={<Image className="w-5 h-5" />}
                  color="purple"
                  onView={() => openPreview(doc.pan, "PAN")}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-10 bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <div className="text-gray-600">
            Page <span className="font-bold text-blue-600 text-lg">{page}</span>{" "}
            of{" "}
            <span className="font-bold text-blue-600 text-lg">
              {totalPages}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 rounded-xl border-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 disabled:hover:shadow-lg"
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 rounded-xl border-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 disabled:hover:shadow-lg"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {modalOpen && activeFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] shadow-2xl overflow-hidden border-4 border-blue-200">
            <div className="flex items-center justify-between p-5 border-b-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg">{activeFile.label}</div>
                  <div className="text-xs text-blue-100 truncate max-w-md">
                    {activeFile.url}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activeFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-4 py-2 rounded-xl bg-white text-blue-600 flex items-center gap-2 font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" /> Download
                </a>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {activeFile.type === "image" ? (
                <img
                  src={activeFile.url}
                  alt={activeFile.label}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-4 border-white"
                />
              ) : (
                <iframe
                  title={activeFile.label}
                  src={activeFile.url}
                  className="w-full h-[75vh] border-4 border-white rounded-2xl shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border-4 border-red-200">
            <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Delete Document?</h3>
                  <p className="text-red-100 text-sm mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to delete documents for:
                </p>
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border-2 border-red-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {(deleteTarget.userName || "U")
                        .toString()
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      User Name
                    </p>
                    <p className="font-bold text-gray-800">
                      {deleteTarget.userName || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      ID: {deleteTarget.userId || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Subcomponent: File Row --- */
function FilePreviewRow({ label, path, icon, color, onView }) {
  const fileExists = !!path;
  const baseUrl = "http://localhost:5000/";
  const fileUrl = path
    ? path.startsWith("http")
      ? path
      : `${baseUrl}${path.replace(/^\/+/, "")}`
    : "";

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
    purple: "bg-purple-100 text-purple-600 border-purple-200",
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        fileExists
          ? "bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50"
          : "bg-gray-50 opacity-60"
      } transition-all duration-300 rounded-xl p-3 border-2 ${
        fileExists ? "border-gray-100 hover:border-blue-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 ${colorClasses[color]} border-2 font-bold rounded-xl flex items-center justify-center shadow-md`}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">{label}</div>
          <div className="text-xs text-gray-500 truncate max-w-[140px]">
            {fileExists ? path.split("/").pop() : "Not uploaded"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {fileExists ? (
          <>
            <button
              onClick={onView}
              className="px-4 py-2 rounded-lg border-2 border-blue-400 text-sm font-semibold bg-white text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View
            </button>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="px-4 py-2 rounded-lg border-2 border-indigo-400 text-sm font-semibold flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" /> Open
            </a>
          </>
        ) : (
          <div className="text-xs text-gray-400 font-medium">—</div>
        )}
      </div>
    </div>
  );
}