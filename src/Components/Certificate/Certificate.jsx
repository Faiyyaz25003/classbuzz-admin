

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Award,
  Download,
  Trash2,
  Copy,
  Eye,
  Plus,
  Sparkles,
} from "lucide-react";

export default function Certificate() {
  const [form, setForm] = useState({
    studentName: "",
    className: "",
    rollNo: "",
    title: "Certificate of Achievement",
    issuedBy: "School Admin",
    date: new Date().toISOString().slice(0, 10),
    remarks: "",
    theme: "classic",
  });

  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const previewRef = useRef(null);

  const themes = {
    classic: {
      border: "border-slate-900",
      title: "text-sky-700",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    },
    elegant: {
      border: "border-amber-800",
      title: "text-amber-900",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    modern: {
      border: "border-purple-600",
      title: "text-purple-700",
      bg: "bg-gradient-to-br from-purple-50 to-pink-50",
    },
    professional: {
      border: "border-emerald-700",
      title: "text-emerald-800",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    },
  };

  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("school_certificates_v1") || "[]"
      );
      setCertificates(data);
    } catch (e) {
      console.warn("Could not load certificates", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "school_certificates_v1",
        JSON.stringify(certificates)
      );
    } catch (e) {
      console.warn("Could not save certificates", e);
    }
  }, [certificates]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleCreate() {
    if (!form.studentName.trim()) {
      alert("Please enter student name");
      return;
    }
    const id = Date.now().toString();
    const cert = { id, ...form };
    setCertificates((c) => [cert, ...c]);
    setForm((s) => ({ ...s, studentName: "", rollNo: "", remarks: "" }));
  }

  function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setCertificates((c) => c.filter((x) => x.id !== id));
  }

  function openPrintable(cert) {
    const theme = themes[cert.theme] || themes.classic;
    const borderColor =
      cert.theme === "classic"
        ? "#0f172a"
        : cert.theme === "elegant"
        ? "#92400e"
        : cert.theme === "modern"
        ? "#9333ea"
        : "#047857";

    const bgGradient =
      cert.theme === "classic"
        ? "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)"
        : cert.theme === "elegant"
        ? "linear-gradient(135deg, #fffbeb 0%, #ffedd5 100%)"
        : cert.theme === "modern"
        ? "linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)"
        : "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)";

    const html = `
      <html>
        <head>
          <title>${cert.title} - ${cert.studentName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Georgia', 'Times New Roman', serif;
              padding: 2rem; 
              display: flex; 
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
            }
            .cert { 
              width: 800px; 
              height: 560px; 
              border: 12px solid ${borderColor};
              padding: 40px; 
              position: relative;
              background: ${bgGradient};
              box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            }
            .decorative-corner {
              position: absolute;
              width: 60px;
              height: 60px;
              border: 3px solid ${borderColor};
            }
            .top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
            .top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
            .bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
            .bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
            .cert h1 { 
              margin: 0; 
              font-size: 32px; 
              letter-spacing: 2px;
              text-align: center;
              font-weight: 700;
              color: ${borderColor};
              text-transform: uppercase;
              margin-top: 20px;
            }
            .center { text-align: center; margin-top: 30px; }
            .awarded-to { font-size: 16px; color: #666; font-style: italic; }
            .big { 
              font-size: 36px; 
              font-weight: 700; 
              margin-top: 12px;
              color: #1a1a1a;
              text-decoration: underline;
              text-decoration-color: ${borderColor};
              text-underline-offset: 8px;
            }
            .meta { 
              margin-top: 40px; 
              display: flex; 
              justify-content: space-between;
              align-items: flex-end;
            }
            .small { font-size: 14px; }
            .date-badge {
              position: absolute;
              top: 25px;
              right: 50px;
              background: ${borderColor};
              color: white;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            .seal {
              position: absolute;
              bottom: 30px;
              left: 50%;
              transform: translateX(-50%);
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 4px solid ${borderColor};
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              font-size: 10px;
              font-weight: 700;
              color: ${borderColor};
              text-align: center;
            }
            @media print { 
              body { padding: 0; background: white; }
              .cert { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="cert">
            <div class="decorative-corner top-left"></div>
            <div class="decorative-corner top-right"></div>
            <div class="decorative-corner bottom-left"></div>
            <div class="decorative-corner bottom-right"></div>
            
            <div class="date-badge">${escapeHtml(cert.date)}</div>
            
            <h1>${escapeHtml(cert.title)}</h1>
            
            <div class="center">
              <div class="awarded-to">This certificate is proudly awarded to</div>
              <div class="big">${escapeHtml(cert.studentName || "-")}</div>
              <div style="margin-top: 16px; font-size: 15px;">
                <strong>Class:</strong> ${escapeHtml(
                  cert.className || "-"
                )} &nbsp;&nbsp;•&nbsp;&nbsp; 
                <strong>Roll No:</strong> ${escapeHtml(cert.rollNo || "-")}
              </div>
              <div style="margin-top: 20px; font-size: 15px; line-height: 1.6; color: #444; max-width: 600px; margin-left: auto; margin-right: auto;">
                ${escapeHtml(
                  cert.remarks ||
                    "For outstanding performance and dedication to excellence."
                )}
              </div>
            </div>

            <div class="meta">
              <div class="small">
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Issued By</div>
                <strong style="font-size: 16px;">${escapeHtml(
                  cert.issuedBy
                )}</strong>
              </div>
              <div class="small" style="text-align: right;">
                <div style="border-bottom: 2px solid #333; width: 200px; margin-bottom: 4px;"></div>
                <div style="font-size: 12px; color: #666;">Authorized Signature</div>
              </div>
            </div>

            <div class="seal">
              OFFICIAL<br>SEAL
            </div>
          </div>

          <script>
            setTimeout(() => { window.print(); }, 300);
          </script>
        </body>
      </html>
    `;

    const newWin = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=900,height=700"
    );
    if (!newWin) return alert("Please allow popups to print certificates.");
    newWin.document.write(html);
    newWin.document.close();
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  const filteredCerts = certificates.filter(
    (c) =>
      c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentTheme = themes[form.theme] || themes.classic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Award className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Certificate Generator
            </h1>
            <Sparkles className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-gray-600">
            Create beautiful certificates in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Create Certificate</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={form.theme}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="classic">Classic Blue</option>
                    <option value="elegant">Elegant Gold</option>
                    <option value="modern">Modern Purple</option>
                    <option value="professional">Professional Green</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    name="studentName"
                    value={form.studentName}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter student name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <input
                      name="className"
                      value={form.className}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="e.g., 10-A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll No
                    </label>
                    <input
                      name="rollNo"
                      value={form.rollNo}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="e.g., 42"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issued By
                  </label>
                  <input
                    name="issuedBy"
                    value={form.issuedBy}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    rows={3}
                    placeholder="Achievement description..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    Create & Save
                  </button>
                  <button
                    onClick={() =>
                      setForm({
                        studentName: "",
                        className: "",
                        rollNo: "",
                        title: "Certificate of Achievement",
                        issuedBy: "School Admin",
                        date: new Date().toISOString().slice(0, 10),
                        remarks: "",
                        theme: "classic",
                      })
                    }
                    className="px-4 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Saved Certificates</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {certificates.length}
                </span>
              </div>

              <input
                type="text"
                placeholder="Search by name or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              <div className="space-y-2 max-h-96 overflow-auto">
                {filteredCerts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No certificates yet</p>
                  </div>
                )}
                {filteredCerts.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {c.studentName || "-"}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {c.title} • {c.className || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {c.date}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => openPrintable(c)}
                        className="p-1.5 hover:bg-blue-50 rounded transition"
                        title="View/Print"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(c, null, 2)
                          );
                          alert("Certificate data copied!");
                        }}
                        className="p-1.5 hover:bg-green-50 rounded transition"
                        title="Copy JSON"
                      >
                        <Copy className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => openPrintable(form)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => {
                    const id = Date.now().toString();
                    setCertificates((c) => [{ id, ...form }, ...c]);
                    alert("Preview saved!");
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Quick Save
                </button>
              </div>
            </div>

            <div ref={previewRef} className="w-full flex justify-center p-4">
              <div
                className={`relative w-[800px] h-[560px] border-8 ${currentTheme.border} p-8 ${currentTheme.bg} shadow-2xl`}
              >
                <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-current opacity-30"></div>
                <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-current opacity-30"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-current opacity-30"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-current opacity-30"></div>

                <div className="absolute top-6 right-12 bg-current text-white px-4 py-1 rounded-full text-xs font-semibold">
                  {form.date}
                </div>

                <h1
                  className={`text-3xl ${currentTheme.title} font-bold text-center tracking-wider uppercase mt-4`}
                >
                  {form.title}
                </h1>

                <div className="text-center mt-8">
                  <div className="text-sm text-gray-600 italic">
                    This certificate is proudly awarded to
                  </div>
                  <div className="text-4xl font-bold mt-3 underline decoration-4 underline-offset-8">
                    {form.studentName || "Student Name"}
                  </div>
                  <div className="mt-4 text-sm font-medium text-gray-700">
                    <span className="font-semibold">Class:</span>{" "}
                    {form.className || "--"}
                    <span className="mx-3">•</span>
                    <span className="font-semibold">Roll No:</span>{" "}
                    {form.rollNo || "--"}
                  </div>

                  <div className="mt-6 text-center text-gray-700 leading-relaxed px-12">
                    {form.remarks ||
                      "For outstanding performance and dedication to excellence."}
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div className="text-sm">
                    <div className="text-xs text-gray-600 mb-1">Issued By</div>
                    <div className="font-bold text-base">{form.issuedBy}</div>
                  </div>
                  <div className="text-sm text-center">
                    <div className="border-b-2 border-gray-800 w-48 mb-1"></div>
                    <div className="text-xs text-gray-600">
                      Authorized Signature
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 border-current bg-white flex items-center justify-center">
                  <div className="text-[8px] font-bold text-center leading-tight">
                    OFFICIAL
                    <br />
                    SEAL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}