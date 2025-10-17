import React from "react";
import { Award, Calendar } from "lucide-react";

const UpcomingEvents = ({ events }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-teal-600" />
        Upcoming Events
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border-2 border-gray-100 rounded-xl p-4 hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                {event.type}
              </span>
            </div>
            <h4 className="font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
              {event.title}
            </h4>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {event.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
