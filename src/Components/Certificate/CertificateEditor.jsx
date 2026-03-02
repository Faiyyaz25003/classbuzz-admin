
import React, { useState } from "react";
import { Upload, X, Printer } from "lucide-react";

const CertificateEditor = ({ template, onBack }) => {
  const [formData, setFormData] = useState({
    title: template?.defaultTitle || "Certificate of Achievement",
    studentName: "",
    class: "",
    rollNo: "",
    issuedBy: "",
    date: "",
    remarks: "",
    signature: "",
    medalColor: "gold",
  });

  const [signaturePreview, setSignaturePreview] = useState(null);
  const [isCreated, setIsCreated] = useState(false);

  const medalColors = {
    gold: {
      gradient: "from-amber-400 to-yellow-600",
      border: "border-amber-500",
      text: "text-amber-600",
      bg: "bg-amber-50",
      hex1: "#fbbf24",
      hex2: "#ca8a04",
      borderHex: "#f97316",
      outerBg: "linear-gradient(to bottom right, #fff7ed, #ffedd5)",
    },
    silver: {
      gradient: "from-slate-300 to-slate-500",
      border: "border-slate-400",
      text: "text-slate-600",
      bg: "bg-slate-50",
      hex1: "#cbd5e1",
      hex2: "#64748b",
      borderHex: "#94a3b8",
      outerBg: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
    },
    bronze: {
      gradient: "from-orange-400 to-amber-700",
      border: "border-orange-600",
      text: "text-orange-700",
      bg: "bg-orange-50",
      hex1: "#fb923c",
      hex2: "#b45309",
      borderHex: "#ea580c",
      outerBg: "linear-gradient(to bottom right, #fff7ed, #fed7aa)",
    },
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
        setFormData({ ...formData, signature: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignaturePreview(null);
    setFormData({ ...formData, signature: "" });
  };

  const handleReset = () => {
    setFormData({
      title: template?.defaultTitle || "Certificate of Achievement",
      studentName: "",
      class: "",
      rollNo: "",
      issuedBy: "",
      date: "",
      remarks: "",
      signature: "",
      medalColor: "gold",
    });
    setSignaturePreview(null);
    setIsCreated(false);
  };

  const handleCreate = () => {
    if (!formData.studentName) {
      alert(
        "⚠️ Please enter the student name before creating the certificate!",
      );
      return;
    }
    setIsCreated(true);
  };

  const handlePrint = () => {
    if (!isCreated) {
      alert("⚠️ Please create the certificate first!");
      return;
    }

    const medal = medalColors[formData.medalColor];
    const formattedDate = formData.date
      ? new Date(formData.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

    const printWindow = window.open("", "_blank");
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${formData.studentName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              /* KEY FIX: Force all backgrounds and colors to print */
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }

            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              @page {
                size: A4 landscape;
                margin: 10mm;
              }
              .no-print { display: none !important; }
            }

            .print-btn {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              z-index: 100;
            }
            .print-btn:hover { background: #2563eb; }

            /* OUTER BORDER - same as preview */
            .cert-outer {
              border: 10px solid ${medal.borderHex};
              border-radius: 16px;
              padding: 24px;
              background: ${medal.outerBg};
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              width: 850px;
              max-width: 100%;
            }

            /* INNER WHITE BOX */
            .cert-inner {
              border: 4px solid #e2e8f0;
              background: #ffffff;
              padding: 48px 56px;
              text-align: center;
              min-height: 480px;
              position: relative;
              border-radius: 4px;
            }

            /* MEDAL CIRCLE - gradient filled circle */
            .medal-circle {
              width: 72px;
              height: 72px;
              border-radius: 50%;
              background: linear-gradient(135deg, ${medal.hex1}, ${medal.hex2});
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 24px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            /* TITLE - gradient text */
            .cert-title {
              font-size: 34px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 4px;
              margin-bottom: 16px;
              /* Use solid color fallback for print since gradient text is tricky */
              color: ${medal.hex2};
              /* Try gradient text for screen */
              background: linear-gradient(135deg, ${medal.hex1}, ${medal.hex2});
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* DECORATIVE LINE */
            .decorative-line {
              width: 80px;
              height: 3px;
              background: linear-gradient(135deg, ${medal.hex1}, ${medal.hex2});
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0 auto 24px;
              border-radius: 2px;
            }

            .cert-subtitle {
              font-size: 13px;
              color: #64748b;
              font-style: italic;
              margin-bottom: 24px;
            }

            .cert-name {
              font-size: 34px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 10px;
              letter-spacing: 1px;
            }

            .cert-details {
              font-size: 13px;
              color: #374151;
              margin-bottom: 24px;
              display: flex;
              justify-content: center;
              gap: 40px;
            }

            .cert-remarks {
              font-size: 14px;
              color: #475569;
              max-width: 520px;
              margin: 0 auto;
              line-height: 1.7;
            }

            .cert-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 48px;
              padding: 0 10px;
            }

            .label {
              font-size: 11px;
              color: #94a3b8;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .issued-name {
              font-size: 17px;
              font-weight: 700;
              color: #0f172a;
            }

            .issued-date {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }

            .sig-right { text-align: right; }

            .sig-line {
              border-top: 2px solid #0f172a;
              width: 130px;
              margin-top: 32px;
              margin-left: auto;
            }

            .sig-image {
              height: 54px;
              margin-top: 8px;
              margin-left: auto;
              display: block;
              max-width: 150px;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <button class="print-btn no-print" onclick="window.print()">🖨️ Print Certificate</button>

          <div class="cert-outer">
            <div class="cert-inner">

              <!-- Medal Circle -->
              <div class="medal-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"
                  fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>

              <!-- Title -->
              <div class="cert-title">${formData.title}</div>
              <div class="decorative-line"></div>
              <div class="cert-subtitle">This certificate is proudly presented to</div>

              <!-- Name -->
              <div class="cert-name">${formData.studentName}</div>

              <!-- Class & Roll No -->
              ${
                formData.class || formData.rollNo
                  ? `
              <div class="cert-details">
                ${formData.class ? `<span>Class: <strong>${formData.class}</strong></span>` : ""}
                ${formData.rollNo ? `<span>Roll No: <strong>${formData.rollNo}</strong></span>` : ""}
              </div>`
                  : ""
              }

              <!-- Remarks -->
              <div class="cert-remarks">
                ${formData.remarks || "For outstanding performance and dedication to excellence."}
              </div>

              <!-- Footer -->
              <div class="cert-footer">
                <div>
                  <div class="label">Issued By</div>
                  <div class="issued-name">${formData.issuedBy || "School Admin"}</div>
                  ${formattedDate ? `<div class="issued-date">Date: ${formattedDate}</div>` : ""}
                </div>
                <div class="sig-right">
                  <div class="label">Authorized Signature</div>
                  ${
                    formData.signature
                      ? `<img src="${formData.signature}" class="sig-image" alt="Signature" />`
                      : `<div class="sig-line"></div>`
                  }
                </div>
              </div>

            </div>
          </div>

          <script>
            window.onafterprint = function() { window.close(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const currentMedalColor = medalColors[formData.medalColor];
  const Icon =
    template?.icon ||
    (() => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
          >
            ← Back to Templates
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`p-3 bg-gradient-to-r ${template?.color || "from-amber-400 to-yellow-600"} rounded-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {template?.name || "Certificate Editor"}
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Certificate Title"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Student Name *"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="Class"
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  placeholder="Roll No"
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <select
                name="medalColor"
                value={formData.medalColor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="gold">🥇 Gold</option>
                <option value="silver">🥈 Silver</option>
                <option value="bronze">🥉 Bronze</option>
              </select>

              <input
                type="text"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleInputChange}
                placeholder="Issued By"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Achievement description..."
                rows="3"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {!signaturePreview ? (
                <label className="w-full flex flex-col items-center px-4 py-6 bg-slate-50 text-slate-500 rounded-lg border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-100 transition">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">Upload Signature</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                  />
                </label>
              ) : (
                <div className="relative bg-slate-50 p-4 rounded-lg border border-slate-300">
                  <button
                    onClick={removeSignature}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={signaturePreview}
                    alt="Signature"
                    className="max-h-20 mx-auto"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreate}
                  className={`flex-1 py-2 px-4 text-sm bg-gradient-to-r ${template?.color || "from-amber-400 to-yellow-600"} text-white rounded-lg font-semibold hover:opacity-90 transition`}
                >
                  ✅ Create Certificate
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800">Live Preview</h3>
              <button
                onClick={handlePrint}
                disabled={!isCreated}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition font-semibold ${
                  isCreated
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>

            {isCreated ? (
              <div
                style={{
                  border: `10px solid ${currentMedalColor.borderHex}`,
                  borderRadius: "16px",
                  padding: "24px",
                  background: currentMedalColor.outerBg,
                }}
              >
                <div
                  style={{
                    border: "4px solid #e2e8f0",
                    background: "white",
                    padding: "40px 48px",
                    textAlign: "center",
                    minHeight: "420px",
                    position: "relative",
                    borderRadius: "4px",
                  }}
                >
                  {/* Medal Icon */}
                  <div className="flex justify-center mb-5">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentMedalColor.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h1
                    className={`text-3xl font-black uppercase tracking-widest mb-3 bg-gradient-to-r ${currentMedalColor.gradient} bg-clip-text text-transparent`}
                  >
                    {formData.title}
                  </h1>

                  {/* Decorative Line */}
                  <div
                    className={`w-16 h-1 mx-auto mb-4 rounded-full bg-gradient-to-r ${currentMedalColor.gradient}`}
                  />

                  <p className="text-xs text-slate-500 italic mb-5">
                    This certificate is proudly presented to
                  </p>

                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-wide">
                    {formData.studentName}
                  </h2>

                  {(formData.class || formData.rollNo) && (
                    <div className="flex justify-center gap-8 text-xs text-slate-700 mb-5">
                      {formData.class && (
                        <span>
                          Class: <strong>{formData.class}</strong>
                        </span>
                      )}
                      {formData.rollNo && (
                        <span>
                          Roll No: <strong>{formData.rollNo}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto mb-6">
                    {formData.remarks ||
                      "For outstanding performance and dedication to excellence."}
                  </p>

                  <div className="flex justify-between items-end mt-10 px-2">
                    <div className="text-left">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                        Issued By
                      </p>
                      <p className="font-bold text-slate-900 text-base">
                        {formData.issuedBy || "School Admin"}
                      </p>
                      {formData.date && (
                        <p className="text-xs text-slate-500 mt-1">
                          Date:{" "}
                          {new Date(formData.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                        Authorized Signature
                      </p>
                      {formData.signature ? (
                        <img
                          src={formData.signature}
                          alt="Signature"
                          className="h-12 w-auto ml-auto"
                        />
                      ) : (
                        <div className="border-t-2 border-slate-900 w-32 mt-7 ml-auto"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <div className="text-5xl mb-4">🖋️</div>
                <p className="text-center italic text-sm">
                  Fill in details and click "Create Certificate" to generate
                  your certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor;