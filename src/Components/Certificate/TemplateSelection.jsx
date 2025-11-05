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

// Template Selection Component
const TemplateSelection = ({ onSelectTemplate }) => {
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
                onClick={() => onSelectTemplate(template)}
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
};

export default TemplateSelection;