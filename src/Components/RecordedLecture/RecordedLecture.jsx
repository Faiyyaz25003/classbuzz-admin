"use client";
import { useEffect, useState } from "react";

export default function RecordedLectures() {
  const [lectures, setLectures] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);

  // Admin form states
  const [className, setClassName] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Load data
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lectures")) || {};
    setLectures(stored);
  }, []);

  // Save lecture
  const addLecture = (e) => {
    e.preventDefault();
    if (!className || !title || !videoUrl) return alert("All fields required");

    const updated = { ...lectures };

    if (!updated[className]) {
      updated[className] = [];
    }

    updated[className].push({ title, videoUrl });

    setLectures(updated);
    localStorage.setItem("lectures", JSON.stringify(updated));

    setTitle("");
    setVideoUrl("");
    alert("Lecture Added");
  };

  return (
    <div style={{ padding: 30 }}>
      {/* ================= ADMIN PANEL ================= */}
      <h1>Admin – Upload Recorded Lecture</h1>

      <form onSubmit={addLecture} style={{ marginBottom: 40 }}>
        <input
          placeholder="Class Name (eg: 1st Standard)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <br />
        <br />

        <input
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />

        <input
          placeholder="Video URL (YouTube embed)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <br />
        <br />

        <button>Add Lecture</button>
      </form>

      <hr />

      {/* ================= CLASS LIST ================= */}
      {!selectedClass && (
        <>
          <h2>Recorded Lectures</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {Object.keys(lectures).map((cls) => (
              <div
                key={cls}
                onClick={() => setSelectedClass(cls)}
                style={{
                  border: "2px solid black",
                  padding: 30,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {cls}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= CLASS VIDEOS ================= */}
      {selectedClass && (
        <>
          <button onClick={() => setSelectedClass(null)}>⬅ Back</button>
          <h2>{selectedClass} Lectures</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {lectures[selectedClass]?.map((vid, index) => (
              <div
                key={index}
                style={{ border: "2px solid black", padding: 20 }}
              >
                <h4>{vid.title}</h4>
                <iframe
                  width="100%"
                  height="200"
                  src={vid.videoUrl}
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
