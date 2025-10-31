
import React, { useEffect, useState } from "react";
import {
  Eye,
  Search,
  X,
  Download,
  FileText,
  Shield,
  CreditCard,
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

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/documents");
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response:", text);
          throw new Error("Backend didn't return valid JSON.");
        }

        const data = await res.json();
        setDocuments(data || []);
        setFiltered(data || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(err.message || "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(documents);
    } else {
      const f = documents.filter((d) => {
        const userId = (d.userId || "").toString().toLowerCase();
        const anyFileName =
          (d.aadhaarFront || "") + (d.aadhaarBack || "") + (d.pan || "");
        return userId.includes(q) || anyFileName.toLowerCase().includes(q);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-violet-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
            <FileText className="absolute inset-0 m-auto w-10 h-10 text-violet-600" />
          </div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">
            Loading documents...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg text-center border-2 border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            ⚠️ Connection Error
          </h2>
          <p className="text-gray-700 mb-2 font-medium">{error}</p>
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mt-4">
            Ensure backend is running and{" "}
            <code className="bg-red-100 px-2 py-1 rounded text-red-700">
              /api/documents
            </code>{" "}
            returns JSON.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[-30px] py-12 px-6 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-300 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
                Documents Hub
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Manage and preview uploaded documents securely
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 gap-4 flex-wrap">
            <div className="relative group flex-1 min-w-[300px] max-w-md">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by User ID or filename..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-purple-200 bg-white/90 backdrop-blur-md shadow-lg focus:shadow-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 text-gray-700 placeholder-gray-400 font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 w-6 h-6 group-focus-within:scale-110 transition-transform" />
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-lg">
                {filtered.length}{" "}
                {filtered.length !== 1 ? "Documents" : "Document"}
              </div>
              <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg border-2 border-purple-200 text-gray-700 font-semibold">
                Page {page}/{totalPages}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Document Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginated.map((doc) => (
              <div
                key={doc._id}
                className="group bg-white/90 backdrop-blur-xl border-2 border-purple-100 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6 relative overflow-hidden"
              >
                {/* Card Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

                <div className="relative z-10">
                  {/* Header Section */}
                  <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-5">
                    <div>
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                        User ID
                      </p>
                      <p className="font-black text-gray-800 text-2xl">
                        {doc.userId || "—"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-100 to-purple-100 px-4 py-2 rounded-xl">
                      <p className="text-xs font-bold text-purple-700">
                        {new Date(
                          doc.createdAt || doc.updatedAt || Date.now()
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Files Section */}
                  <div className="space-y-3">
                    <FilePreviewRow
                      label="Aadhaar Front"
                      path={doc.aadhaarFront}
                      onView={() =>
                        openPreview(doc.aadhaarFront, "Aadhaar Front")
                      }
                      icon={<Shield className="w-5 h-5" />}
                      color="from-emerald-500 to-teal-600"
                    />
                    <FilePreviewRow
                      label="Aadhaar Back"
                      path={doc.aadhaarBack}
                      onView={() =>
                        openPreview(doc.aadhaarBack, "Aadhaar Back")
                      }
                      icon={<Shield className="w-5 h-5" />}
                      color="from-blue-500 to-cyan-600"
                    />
                    <FilePreviewRow
                      label="PAN Card"
                      path={doc.pan}
                      onView={() => openPreview(doc.pan, "PAN")}
                      icon={<CreditCard className="w-5 h-5" />}
                      color="from-orange-500 to-red-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        <div className="flex items-center justify-center mt-12 gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-8 py-4 rounded-2xl font-bold text-lg bg-white/90 backdrop-blur-md border-2 border-purple-200 text-purple-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            ← Previous
          </button>

          <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-lg">
            {page} / {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-8 py-4 rounded-2xl font-bold text-lg bg-white/90 backdrop-blur-md border-2 border-purple-200 text-purple-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Enhanced Modal */}
      {modalOpen && activeFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] shadow-2xl overflow-hidden border-4 border-purple-200">
            <div className="flex items-center justify-between p-6 border-b-2 border-purple-100 bg-gradient-to-r from-violet-500 to-purple-600">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-black text-white text-2xl">
                    {activeFile.label}
                  </div>
                  <div className="text-sm text-purple-100 truncate max-w-md">
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
                  className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/40 text-white flex items-center gap-2 font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-5 h-5" /> Download
                </a>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-3 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/40 hover:bg-white/30 transition-all duration-300 hover:scale-105"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div
              className="p-6 overflow-auto flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
              style={{ maxHeight: "calc(92vh - 100px)" }}
            >
              {activeFile.type === "image" ? (
                <img
                  src={activeFile.url}
                  alt={activeFile.label}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border-4 border-white"
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
    </div>
  );
}

/* --- Enhanced File Preview Row --- */
function FilePreviewRow({ label, path, onView, icon, color }) {
  const fileExists = !!path;
  const baseUrl = "http://localhost:5000/";
  const fileUrl = path
    ? path.startsWith("http")
      ? path
      : `${baseUrl}${path.replace(/^\/+/, "")}`
    : "";

  return (
    <div
      className={`group/item flex items-center justify-between gap-3 bg-gradient-to-r ${
        fileExists ? "from-white to-purple-50/50" : "from-gray-50 to-gray-100"
      } hover:from-purple-50 hover:to-violet-50 transition-all duration-300 border-2 ${
        fileExists ? "border-purple-200" : "border-gray-200"
      } rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${color} text-white font-black rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">{label}</div>
          <div className="text-xs text-gray-500 truncate max-w-[140px] font-medium">
            {fileExists ? path.split("/").pop() : "Not uploaded"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {fileExists ? (
          <>
            <button
              onClick={onView}
              className="px-4 py-2 rounded-xl border-2 border-purple-300 text-sm font-bold bg-white text-purple-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105"
            >
              View
            </button>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="px-4 py-2 rounded-xl border-2 border-purple-300 text-sm font-bold flex items-center gap-1.5 bg-white text-purple-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105"
            >
              <Download className="w-4 h-4" /> Open
            </a>
          </>
        ) : (
          <div className="text-xs text-gray-400 font-semibold px-3 py-1 bg-gray-100 rounded-lg">
            —
          </div>
        )}
      </div>
    </div>
  );
}