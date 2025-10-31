import React, { useEffect, useState } from "react";
import { Eye, Search, X, Download } from "lucide-react";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState(null); // { url, type, label }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
       const res = await fetch("http://localhost:5000/api/documents");
        const contentType = res.headers.get("content-type") || "";

        // If server returned HTML (React dev server or error page), throw helpful error
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response from /api/documents:", text);
          throw new Error(
            "API did not return JSON. Check backend route or URL (you might be hitting an HTML page)."
          );
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

  // filter by userId or file name
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
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-gray-600">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <p className="text-red-600 font-medium mb-3">Error: {error}</p>
        <p className="text-sm text-gray-500 text-center">
          Ensure backend is running and <code>/api/documents</code> returns
          JSON.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[300px] mt-[50px] py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              All Uploaded Documents
            </h1>
            <p className="text-sm text-gray-500">
              Showing uploads from all users
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by userId or filename..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-0 focus:border-blue-400 w-72"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-800">
                    {doc.userId || "—"}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(
                    doc.createdAt || doc.updatedAt || Date.now()
                  ).toLocaleString()}
                </div>
              </div>

              {/* Files preview area */}
              <div className="flex flex-col gap-2">
                {/* Aadhaar Front */}
                <FilePreviewRow
                  label="Aadhaar Front"
                  path={doc.aadhaarFront}
                  onView={() => openPreview(doc.aadhaarFront, "Aadhaar Front")}
                />

                <FilePreviewRow
                  label="Aadhaar Back"
                  path={doc.aadhaarBack}
                  onView={() => openPreview(doc.aadhaarBack, "Aadhaar Back")}
                />

                <FilePreviewRow
                  label="PAN"
                  path={doc.pan}
                  onView={() => openPreview(doc.pan, "PAN")}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border bg-white disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && activeFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="font-medium text-gray-800">
                    {activeFile.label}
                  </div>
                  <div className="text-xs text-gray-500">{activeFile.url}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3 py-1 rounded-md border flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center">
              {activeFile.type === "image" ? (
                <img
                  src={activeFile.url}
                  alt={activeFile.label}
                  className="max-w-full max-h-[80vh] object-contain rounded-md"
                />
              ) : (
                <iframe
                  title={activeFile.label}
                  src={activeFile.url}
                  className="w-full h-[80vh] border rounded-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- small subcomponent for file row ---------- */
function FilePreviewRow({ label, path, onView }) {
  const fileExists = !!path;
  const imgPreview =
    fileExists && !path.toLowerCase().endsWith(".pdf") ? (
      <img
        src={
          path.startsWith("http")
            ? path
            : `http://localhost:5000/${path.replace(/^\/+/, "")}`
        }
        alt={label}
        className="w-28 h-20 object-cover rounded-md border"
      />
    ) : null;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-xs">
          {label
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">{label}</div>
          <div className="text-xs text-gray-500">
            {fileExists ? path.split("/").pop() : "Not uploaded"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {fileExists ? (
          <>
            <button
              onClick={onView}
              className="px-3 py-1 rounded-md border text-sm bg-white hover:shadow"
            >
              View
            </button>
            <a
              href={
                path.startsWith("http")
                  ? path
                  : `http://localhost:5000/${path.replace(/^\/+/, "")}`
              }
              target="_blank"
              rel="noreferrer"
              download
              className="px-3 py-1 rounded-md border text-sm flex items-center gap-1"
            >
              <Download className="w-4 h-4" /> Open
            </a>
          </>
        ) : (
          <div className="text-xs text-gray-400">—</div>
        )}
      </div>
    </div>
  );
}
