import React from "react";
import { BookOpen } from "lucide-react";

const CourseProgress = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-teal-600" />
        Course Progress
      </h3>
      <div className="space-y-4">
        {data.map((course, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {course.name}
              </span>
              <span className="text-sm font-bold text-teal-600">
                {course.value}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${course.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;
