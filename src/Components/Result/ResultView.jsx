import React from "react";
import { X, Award, BookOpen, TrendingUp } from "lucide-react";

export default function ResultView({ student, onClose }) {
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-600" };
    if (percentage >= 80) return { grade: "A", color: "text-green-500" };
    if (percentage >= 70) return { grade: "B+", color: "text-blue-500" };
    if (percentage >= 60) return { grade: "B", color: "text-blue-400" };
    if (percentage >= 50) return { grade: "C", color: "text-yellow-500" };
    if (percentage >= 40) return { grade: "D", color: "text-orange-500" };
    return { grade: "F", color: "text-red-500" };
  };

  const gradeInfo = getGrade(student.percentage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">RESULT CARD</h1>
            <p className="text-indigo-100">Academic Performance Report</p>
          </div>
        </div>

        {/* Student Info */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl">
            <div>
              <p className="text-sm text-gray-600 mb-1">Student Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {student.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Roll Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {student.rollNo}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Class</p>
              <p className="text-lg font-semibold text-gray-900">
                {student.class}
              </p>
            </div>
            {student.semester && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Semester</p>
                <p className="text-lg font-semibold text-gray-900">
                  {student.semester}
                </p>
              </div>
            )}
          </div>

          {/* Subject Marks Table */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Subject-wise Marks
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Marks Obtained
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Maximum Marks
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {student.subjects.map((subject, index) => {
                    const subPercent = (
                      (subject.marks / subject.maxMarks) *
                      100
                    ).toFixed(2);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {subject.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-900 font-semibold">
                          {subject.marks}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">
                          {subject.maxMarks}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span
                            className={`font-semibold ${
                              subPercent >= 75
                                ? "text-green-600"
                                : subPercent >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {subPercent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-indigo-50 font-bold">
                    <td className="px-6 py-4 text-sm text-gray-900">TOTAL</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900">
                      {student.subjects.reduce(
                        (sum, s) => sum + Number(s.marks),
                        0
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900">
                      {student.subjects.reduce(
                        (sum, s) => sum + Number(s.maxMarks),
                        0
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900">
                      {student.percentage}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Overall Performance */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Overall Performance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Total Percentage</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {student.percentage}%
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Grade</p>
                <p className={`text-3xl font-bold ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Result</p>
                <p
                  className={`text-xl font-bold ${
                    student.percentage >= 40 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {student.percentage >= 40 ? "PASS" : "FAIL"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
            <p>
              This is a computer-generated result card and does not require a
              signature.
            </p>
            <p className="mt-1">
              Generated on {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
