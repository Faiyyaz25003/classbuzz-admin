

import React, { useState } from "react";
import { Upload, X, Download } from "lucide-react";

const CertificateEditor = ({ template, onBack }) => {
  const [formData, setFormData] = useState({
    title: template.defaultTitle,
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
  const [isCreated, setIsCreated] = useState(false); // ✅ Track if certificate is created

  // Medal styles
  const medalColors = {
    gold: {
      gradient: "from-amber-400 to-yellow-600",
      border: "border-amber-500",
      text: "text-amber-600",
      bg: "bg-amber-50",
    },
    silver: {
      gradient: "from-slate-300 to-slate-500",
      border: "border-slate-400",
      text: "text-slate-600",
      bg: "bg-slate-50",
    },
    bronze: {
      gradient: "from-orange-400 to-amber-700",
      border: "border-orange-600",
      text: "text-orange-700",
      bg: "bg-orange-50",
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
      title: template.defaultTitle,
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

  // ✅ Handle Create
  const handleCreate = () => {
    if (!formData.studentName) {
      alert(
        "⚠️ Please enter the student name before creating the certificate!"
      );
      return;
    }
    setIsCreated(true);
    alert("🎉 Certificate created successfully! You can now download it.");
  };

  // ✅ Handle Download as PDF
  const handleDownload = () => {
    const element = document.getElementById("certificate-content");
    if (!element) {
      alert("⚠️ Please create the certificate first!");
      return;
    }

    import("html2canvas").then(({ default: html2canvas }) => {
      import("jspdf").then(({ jsPDF }) => {
        html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          });

          const pdfWidth = 297;
          const pdfHeight = 210;
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;
          const yOffset = (pdfHeight - imgHeight) / 2;

          pdf.addImage(
            imgData,
            "PNG",
            0,
            yOffset > 0 ? yOffset : 0,
            imgWidth,
            imgHeight
          );
          pdf.save(`Certificate_${formData.studentName || "Student"}.pdf`);
        });
      });
    });
  };

  const Icon = template.icon;
  const currentMedalColor = medalColors[formData.medalColor];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
        >
          ← Back to Templates
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM SECTION */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`p-3 bg-gradient-to-r ${template.color} rounded-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {template.name}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Form Fields */}
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Certificate Title"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />

              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Student Name *"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="Class"
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  placeholder="Roll No"
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <select
                name="medalColor"
                value={formData.medalColor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>

              <input
                type="text"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleInputChange}
                placeholder="Issued By"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />

              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Achievement description..."
                rows="3"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />

              {/* Signature Upload */}
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

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreate}
                  className={`flex-1 py-2 px-4 text-sm bg-gradient-to-r ${template.color} text-white rounded-lg font-semibold hover:opacity-90 transition`}
                >
                  Create & Save
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

          {/* PREVIEW SECTION */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800">Live Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  disabled={!isCreated}
                  className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition ${
                    isCreated
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            {isCreated ? (
              <div
                id="certificate-content"
                className={`bg-gradient-to-br ${template.bgGradient} p-6 rounded-lg border-8 ${template.borderColor} shadow-xl`}
              >
                <div className="bg-white p-6 border-4 border-slate-200 relative min-h-[420px] text-center">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`p-3 bg-gradient-to-r ${currentMedalColor.gradient} rounded-full`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h1
                    className={`text-3xl font-bold bg-gradient-to-r ${currentMedalColor.gradient} bg-clip-text text-transparent mb-4 uppercase tracking-wider`}
                  >
                    {formData.title}
                  </h1>

                  <p className="text-xs text-slate-600 italic mb-5">
                    This certificate is proudly presented to
                  </p>

                  <h2 className="text-3xl font-bold text-slate-900 mb-1">
                    {formData.studentName}
                  </h2>

                  {(formData.class || formData.rollNo) && (
                    <div className="flex justify-center gap-6 text-xs text-slate-700 mb-6">
                      {formData.class && <span>Class: {formData.class}</span>}
                      {formData.rollNo && (
                        <span>Roll No: {formData.rollNo}</span>
                      )}
                    </div>
                  )}

                  <p className="text-slate-700 text-sm leading-relaxed max-w-xl mx-auto mb-6">
                    {formData.remarks ||
                      "For outstanding performance and dedication to excellence."}
                  </p>

                  <div className="flex justify-between items-end mt-10 px-6">
                    <div className="text-left">
                      <p className="text-xs text-slate-500 mb-1">Issued By</p>
                      <p className="font-bold text-slate-900 text-base">
                        {formData.issuedBy || "School Admin"}
                      </p>
                      {formData.date && (
                        <p className="text-xs text-slate-600 mt-1">
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
                      <p className="text-xs text-slate-500 mb-1">
                        Authorized Signature
                      </p>
                      {formData.signature ? (
                        <img
                          src={formData.signature}
                          alt="Signature"
                          className="h-12 w-auto mx-auto"
                        />
                      ) : (
                        <div className="border-t-2 border-slate-900 w-28 mt-6"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-500 mt-20 italic">
                🖋️ Fill in details and click "Create & Save" to generate your
                certificate.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor;
