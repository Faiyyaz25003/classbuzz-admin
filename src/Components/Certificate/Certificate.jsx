

import React, { useState } from "react";
import {
  Award,
  GraduationCap,
  Trophy,
  Medal,
  Star,
  FileText,
  Upload,
  X,
  Download,
} from "lucide-react";

const Certificate = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
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

  const templates = [
    {
      id: "elegant-gold",
      name: "Elegant Gold",
      icon: Award,
      color: "from-amber-600 to-yellow-700",
      borderColor: "border-amber-600",
      bgGradient: "from-amber-50 to-yellow-50",
      defaultTitle: "Certificate of Achievement",
    },
    {
      id: "academic-excellence",
      name: "Academic Excellence",
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-700",
      borderColor: "border-blue-600",
      bgGradient: "from-blue-50 to-indigo-50",
      defaultTitle: "Certificate of Academic Excellence",
    },
    {
      id: "winner-trophy",
      name: "Winner Trophy",
      icon: Trophy,
      color: "from-green-600 to-emerald-700",
      borderColor: "border-green-600",
      bgGradient: "from-green-50 to-emerald-50",
      defaultTitle: "Certificate of Winner",
    },
    {
      id: "merit-award",
      name: "Merit Award",
      icon: Medal,
      color: "from-purple-600 to-pink-700",
      borderColor: "border-purple-600",
      bgGradient: "from-purple-50 to-pink-50",
      defaultTitle: "Certificate of Merit",
    },
    {
      id: "participation",
      name: "Participation",
      icon: Star,
      color: "from-orange-600 to-red-700",
      borderColor: "border-orange-600",
      bgGradient: "from-orange-50 to-red-50",
      defaultTitle: "Certificate of Participation",
    },
    {
      id: "completion",
      name: "Course Completion",
      icon: FileText,
      color: "from-teal-600 to-cyan-700",
      borderColor: "border-teal-600",
      bgGradient: "from-teal-50 to-cyan-50",
      defaultTitle: "Certificate of Completion",
    },
  ];

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

  const handleCardClick = (template) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      title: template.defaultTitle,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
        setFormData({
          ...formData,
          signature: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignaturePreview(null);
    setFormData({
      ...formData,
      signature: "",
    });
  };

  const handleReset = () => {
    setFormData({
      title: selectedTemplate?.defaultTitle || "",
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
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setFormData({
      title: "",
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
  };

  const handleDownload = () => {
    const certificateElement = document.getElementById("certificate-content");

    // Using html2canvas approach
    if (window.html2canvas) {
      window
        .html2canvas(certificateElement, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new window.jspdf.jsPDF({
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
    } else {
      alert("Please use a modern browser to download the certificate.");
    }
  };

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Certificate Templates
            </h1>
            <p className="text-slate-600 text-lg">
              Choose a template to create your certificate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  onClick={() => handleCardClick(template)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                >
                  <div
                    className={`h-32 bg-gradient-to-r ${template.color} flex items-center justify-center`}
                  >
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      {template.defaultTitle}
                    </p>
                    <button
                      className={`w-full py-2 px-4 bg-gradient-to-r ${template.color} text-white rounded-lg font-semibold hover:opacity-90 transition`}
                    >
                      Select Template
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const Icon = selectedTemplate.icon;
  const currentMedalColor = medalColors[formData.medalColor];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Load required libraries */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
        >
          ← Back to Templates
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section - 1 column */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`p-3 bg-gradient-to-r ${selectedTemplate.color} rounded-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {selectedTemplate.name}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Class
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    placeholder="e.g., 10-A"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Roll No
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 42"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Medal Color *
                </label>
                <select
                  name="medalColor"
                  value={formData.medalColor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Issued By
                </label>
                <input
                  type="text"
                  name="issuedBy"
                  value={formData.issuedBy}
                  onChange={handleInputChange}
                  placeholder="School Admin"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Achievement description..."
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Digital Signature (Optional)
                </label>
                {!signaturePreview ? (
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-slate-50 text-slate-500 rounded-lg border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-100 transition">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Upload Signature</span>
                    <span className="text-xs text-slate-400 mt-1">
                      PNG, JPG (Max 2MB)
                    </span>
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
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className={`flex-1 py-2 px-4 text-sm bg-gradient-to-r ${selectedTemplate.color} text-white rounded-lg font-semibold hover:opacity-90 transition`}
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

          {/* Live Preview Section - 2 columns */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800">Live Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                >
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            <div
              className={`bg-gradient-to-br ${selectedTemplate.bgGradient} p-6 rounded-lg border-8 ${selectedTemplate.borderColor} shadow-xl`}
            >
              <div
                id="certificate-content"
                className="bg-white p-6 border-4 border-slate-200 relative min-h-[420px]"
              >
                {/* Decorative Corners */}
                <div
                  className={`absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 ${currentMedalColor.border}`}
                ></div>
                <div
                  className={`absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 ${currentMedalColor.border}`}
                ></div>
                <div
                  className={`absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 ${currentMedalColor.border}`}
                ></div>
                <div
                  className={`absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 ${currentMedalColor.border}`}
                ></div>

                <div className="text-center relative z-10">
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
                    {formData.title || "Certificate Title"}
                  </h1>

                  <p className="text-xs text-slate-600 italic mb-5">
                    This certificate is proudly presented to
                  </p>

                  <div className="mb-6">
                    <h2
                      className="text-3xl font-bold text-slate-900 mb-1"
                      style={{ fontFamily: "serif" }}
                    >
                      {formData.studentName || "Student Name"}
                    </h2>
                    <div
                      className={`h-1 w-48 mx-auto bg-gradient-to-r ${currentMedalColor.gradient} mt-2`}
                    ></div>
                  </div>

                  {(formData.class || formData.rollNo) && (
                    <div className="flex justify-center gap-6 text-xs text-slate-700 mb-6">
                      {formData.class && (
                        <span className="font-semibold">
                          Class: {formData.class}
                        </span>
                      )}
                      {formData.rollNo && (
                        <span className="font-semibold">
                          Roll No: {formData.rollNo}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="max-w-xl mx-auto mb-8">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {formData.remarks ||
                        "For outstanding performance and dedication to excellence in academics and extracurricular activities."}
                    </p>
                  </div>

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
                          className="h-12 w-auto max-w-28 mx-auto"
                        />
                      ) : (
                        <div className="border-t-2 border-slate-900 w-28 mt-6"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;