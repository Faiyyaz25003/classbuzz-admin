import React from "react";
import { Clock } from "lucide-react";

const RecentActivities = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-teal-600" />
        Recent Activities
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500">{activity.course}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
