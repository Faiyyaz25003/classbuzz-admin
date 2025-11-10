"use client";
import React, { useState } from "react";
import {
  Users,
  Percent,
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  Award,
  GraduationCap,
} from "lucide-react";

export default function PerformanceDashboard({ students }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const classList = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Artificial Intelligence & Data Science",
    "Biotechnology",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Commerce",
    "Business Administration",
    "Economics",
    "English",
    "Psychology",
    "Sociology",
    "Fine Arts",
    "Mass Communication",
    "Other",
  ];

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-dashed border-indigo-200">
        <GraduationCap className="w-16 h-16 text-indigo-300 mb-4" />
        <p className="text-gray-600 text-lg font-medium">
          No student data available yet.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Add students to see their performance metrics
        </p>
      </div>
    );
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass ? student.class === selectedClass : true;
    return matchesSearch && matchesClass;
  });

  const sortedStudents = [...filteredStudents].sort(
    (a, b) => b.percentage - a.percentage
  );

  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / itemsPerPage);

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass]);
  const avgPercentage = totalStudents
    ? (
        sortedStudents.reduce((sum, s) => sum + Number(s.percentage || 0), 0) /
        totalStudents
      ).toFixed(2)
    : 0;

  const topPerformer = sortedStudents.length > 0 ? sortedStudents[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Performance 
          </h1>   
          <p className="text-gray-600">
            Track and analyze student academic achievements
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Total Students */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-500 p-3 rounded-2xl">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  +12%
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Total Students
              </p>
              <p className="text-4xl font-bold text-gray-900">
                {totalStudents}
              </p>
            </div>
          </div>

          {/* Card 2 - Average Score */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-500 p-3 rounded-2xl">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  +5%
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Avg. Performance
              </p>
              <p className="text-4xl font-bold text-gray-900">
                {avgPercentage}%
              </p>
            </div>
          </div>

          {/* Card 3 - Top Score */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
            <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-orange-500 p-3 rounded-2xl">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  +8%
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Top Score
              </p>
              <p className="text-4xl font-bold text-gray-900">
                {topPerformer ? `${topPerformer.percentage}%` : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Search & Filter Bar - Inside Table Container */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>

              {/* Class Filter */}
              <div className="relative lg:w-80">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">All Classes</option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1e7a8c] to-[#2596ad] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student, idx) => {
                    const rank = indexOfFirstItem + idx + 1;
                    let rankBadge = null;

                    if (rank === 1) {
                      rankBadge = (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg">
                          🥇 1st
                        </span>
                      );
                    } else if (rank === 2) {
                      rankBadge = (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-lg">
                          🥈 2nd
                        </span>
                      );
                    } else if (rank === 3) {
                      rankBadge = (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg">
                          🥉 3rd
                        </span>
                      );
                    } else {
                      rankBadge = (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                          {rank}
                        </span>
                      );
                    }

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-indigo-50 transition-colors ${
                          rank <= 3
                            ? "bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4">{rankBadge}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {student.rollNo}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold mr-3">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {student.class}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                            Sem {student.semester}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                              <div
                                className={`h-2 rounded-full ${
                                  student.percentage >= 85
                                    ? "bg-gradient-to-r from-green-400 to-green-600"
                                    : student.percentage >= 70
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : "bg-gradient-to-r from-red-400 to-red-600"
                                }`}
                                style={{ width: `${student.percentage}%` }}
                              ></div>
                            </div>
                            <span
                              className={`text-sm font-bold min-w-[50px] ${
                                student.percentage >= 85
                                  ? "text-green-600"
                                  : student.percentage >= 70
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {student.percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">
                        No students match your search or filter.
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Try adjusting your filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(indexOfLastItem, totalStudents)}
                </span>{" "}
                of <span className="font-semibold">{totalStudents}</span>{" "}
                students
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-300"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-300"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
