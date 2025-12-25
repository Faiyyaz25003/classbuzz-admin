
"use client";
import { useEffect, useState } from "react";
import { Video, BookOpen, ArrowLeft, Filter } from "lucide-react";

export default function RecordedLectures() {
  const [lectures, setLectures] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Admin form states
  const [className, setClassName] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // 🔍 Filter states
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  // 🔁 Convert ANY YouTube URL to EMBED
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    if (url.includes("watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  // 🔄 Fetch lectures
  const fetchLectures = async () => {
    const res = await fetch("http://localhost:5000/api/lectures");
    const data = await res.json();

    const grouped = {};
    data.forEach((lec) => {
      if (!grouped[lec.className]) grouped[lec.className] = [];
      grouped[lec.className].push(lec);
    });

    setLectures(grouped);
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  // ➕ Add Lecture
  const addLecture = async () => {
    if (!className || !title || !videoUrl) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("http://localhost:5000/api/lectures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        className,
        title,
        subject,
        date,
        videoUrl,
      }),
    });

    fetchLectures();
    setTitle("");
    setSubject("");
    setDate("");
    setVideoUrl("");
    alert("Lecture Added ✅");
  };

  // 🎯 FILTER LOGIC
  const filteredLectures =
    lectures[selectedClass]?.filter((vid) => {
      const matchSubject = filterSubject
        ? vid.subject?.toLowerCase() === filterSubject.toLowerCase()
        : true;

      const matchDate = filterDate ? vid.date === filterDate : true;

      const matchTitle = searchTitle
        ? vid.title?.toLowerCase().includes(searchTitle.toLowerCase())
        : true;

      return matchSubject && matchDate && matchTitle;
    }) || [];

  // Get unique subjects for dropdown
  const subjects =
    lectures[selectedClass]
      ?.map((v) => v.subject)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-indigo-500 p-6 flex justify-between">
        <h1 className="text-3xl font-bold flex gap-2 items-center">
          <Video /> EduStream
        </h1>
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Admin Panel
        </button>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="bg-white p-6 max-w-3xl mx-auto mt-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Upload Lecture</h2>

          <input
            placeholder="Class Name"
            className="w-full border p-2 rounded mb-2"
            onChange={(e) => setClassName(e.target.value)}
          />
          <input
            placeholder="Lecture Title"
            className="w-full border p-2 rounded mb-2"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Subject"
            className="w-full border p-2 rounded mb-2"
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            type="date"
            className="w-full border p-2 rounded mb-2"
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            placeholder="YouTube Video URL"
            className="w-full border p-2 rounded mb-3"
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <button
            onClick={addLecture}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Add Lecture
          </button>
        </div>
      )}

      {/* Class List */}
      {!selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {Object.keys(lectures).map((cls) => (
            <div
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition text-center"
            >
              <BookOpen className="mx-auto mb-2" />
              <h3 className="font-bold">{cls}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Videos + Filters */}
      {selectedClass && (
        <div className="p-6">
          <button
            onClick={() => setSelectedClass(null)}
            className="mb-4 flex gap-2 items-center text-indigo-600"
          >
            <ArrowLeft /> Back
          </button>

          {/* 🔍 FILTER BAR */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              placeholder="Search by title"
              className="border p-2 rounded"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border p-2 rounded"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />

            <button
              onClick={() => {
                setSearchTitle("");
                setFilterSubject("");
                setFilterDate("");
              }}
              className="bg-gray-200 rounded px-3"
            >
              Clear Filters
            </button>
          </div>

          {/* 🎬 Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLectures.length === 0 && (
              <p className="text-center col-span-2 text-gray-500">
                No lectures found
              </p>
            )}

            {filteredLectures.map((vid) => (
              <div
                key={vid._id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="p-4 bg-indigo-600 text-white">
                  <h3 className="font-bold">{vid.title}</h3>
                  <p className="text-sm">
                    {vid.subject} • {vid.date}
                  </p>
                </div>

                <iframe
                  src={`${getEmbedUrl(
                    vid.videoUrl
                  )}?controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=1&playsinline=1`}
                  className="w-full h-64"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
