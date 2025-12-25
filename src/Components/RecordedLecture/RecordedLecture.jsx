import { useState } from "react";
import {
  Video,
  BookOpen,
  Plus,
  ArrowLeft,
  Upload,
  Play,
  Calendar,
  Book,
} from "lucide-react";

export default function RecordedLectures() {
  const [lectures, setLectures] = useState({
    "1st Standard": [
      {
        title: "Introduction to Numbers",
        subject: "Mathematics",
        date: "2024-01-15",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: "Basic Addition",
        subject: "Mathematics",
        date: "2024-01-20",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
    "2nd Standard": [
      {
        title: "Multiplication Tables",
        subject: "Mathematics",
        date: "2024-01-18",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  });
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Admin form states
  const [className, setClassName] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Save lecture
  const addLecture = () => {
    if (!className || !title || !subject || !date || !videoUrl) {
      alert("All fields required");
      return;
    }

    const updated = { ...lectures };
    if (!updated[className]) {
      updated[className] = [];
    }
    updated[className].push({ title, subject, date, videoUrl });
    setLectures(updated);

    setTitle("");
    setSubject("");
    setDate("");
    setVideoUrl("");
    alert("Lecture Added Successfully! ✓");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-xl">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">EduStream</h1>
                <p className="text-sm text-gray-500">
                  Recorded Lecture Library
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              {showAdminPanel ? "Close Admin" : "Admin Panel"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ================= ADMIN PANEL ================= */}
        {showAdminPanel && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Upload New Lecture
              </h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1st Standard"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics, Science"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Introduction to Algebra"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Video URL (YouTube Embed)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={addLecture}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add Lecture
              </button>
            </div>
          </div>
        )}

        {/* ================= CLASS LIST ================= */}
        {!selectedClass && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                Available Classes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(lectures).map((cls) => (
                <div
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-indigo-400 p-8 cursor-pointer transition-all transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {cls}
                    </h3>
                    <p className="text-gray-500 font-medium">
                      {lectures[cls].length} lecture
                      {lectures[cls].length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CLASS VIDEOS ================= */}
        {selectedClass && (
          <div>
            <button
              onClick={() => setSelectedClass(null)}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg mb-6 shadow-md hover:shadow-lg transition-all border-2 border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Classes
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-indigo-200">
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedClass}
              </h2>
              <p className="text-gray-600 mt-1">
                {lectures[selectedClass]?.length} recorded lecture
                {lectures[selectedClass]?.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lectures[selectedClass]?.map((vid, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-gray-100 overflow-hidden transition-all transform hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Play className="w-5 h-5" />
                      <h4 className="text-lg font-bold">{vid.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        <span>{vid.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(vid.date).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="relative rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        width="100%"
                        height="280"
                        src={vid.videoUrl}
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


