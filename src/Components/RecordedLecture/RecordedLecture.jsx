"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Video,
  BookOpen,
  Calendar,
  Upload,
  Link2,
  FileText,
  Save,
  Trash2,
  PlayCircle,
  Loader2,
  FileVideo,
  Sparkles,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function RecordedLecture() {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLectures, setLoadingLectures] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    semester: "",
    subject: "",
    lectureTitle: "",
    date: "",
    youtubeUrl: "",
    videoFile: null,
    summary: "",
  });

  useEffect(() => {
    fetchCourses();
    fetchLectures();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await axios.get(`${API_BASE}/api/course`);
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.courses)
          ? res.data.courses
          : [];
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchLectures = async () => {
    try {
      setLoadingLectures(true);
      const res = await axios.get(`${API_BASE}/api/lectures`);
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.lectures)
          ? res.data.lectures
          : [];
      setLectures(data);
    } catch (error) {
      console.error("Error fetching lectures:", error);
      setLectures([]);
    } finally {
      setLoadingLectures(false);
    }
  };

  const departments = useMemo(() => {
    return courses
      .map((item) => item.name || item.department || item.className)
      .filter(Boolean);
  }, [courses]);

  const selectedCourse = useMemo(() => {
    return courses.find(
      (item) =>
        (item.name || item.department || item.className) ===
        formData.department,
    );
  }, [courses, formData.department]);

  const semesters = useMemo(() => {
    if (!selectedCourse || !Array.isArray(selectedCourse.semesters)) return [];
    return selectedCourse.semesters.map((sem) => sem.semester).filter(Boolean);
  }, [selectedCourse]);

  const subjects = useMemo(() => {
    if (!selectedCourse || !formData.semester) return [];

    const selectedSemesterObj = selectedCourse.semesters?.find(
      (sem) => String(sem.semester) === String(formData.semester),
    );

    if (!selectedSemesterObj) return [];

    const semesterSubjects = selectedSemesterObj.subjects || [];

    return semesterSubjects
      .map((sub) => {
        if (typeof sub === "string") return sub;
        return sub.name || sub.subjectName || sub.title;
      })
      .filter(Boolean);
  }, [selectedCourse, formData.semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        semester: "",
        subject: "",
      }));
      return;
    }

    if (name === "semester") {
      setFormData((prev) => ({
        ...prev,
        semester: value,
        subject: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      videoFile: e.target.files[0] || null,
    }));
  };

  const resetForm = () => {
    setFormData({
      department: "",
      semester: "",
      subject: "",
      lectureTitle: "",
      date: "",
      youtubeUrl: "",
      videoFile: null,
      summary: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("department", formData.department);
      payload.append("semester", formData.semester);
      payload.append("subject", formData.subject);
      payload.append("lectureTitle", formData.lectureTitle);
      payload.append("date", formData.date);
      payload.append("youtubeUrl", formData.youtubeUrl);
      payload.append("summary", formData.summary);

      if (formData.videoFile) {
        payload.append("videoFile", formData.videoFile);
      }

      await axios.post(`${API_BASE}/api/lectures`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Lecture saved successfully");
      resetForm();
      fetchLectures();
    } catch (error) {
      console.error("Submit error:", error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLecture = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/lectures/${id}`);
      alert("Lecture deleted successfully");
      fetchLectures();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Add Recorded Lecture
            </h1>
            <p className="text-sm text-gray-500">
              Upload video details with department, semester and subject
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-lg md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Class
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
                  required
                >
                  <option value="">
                    {loadingCourses
                      ? "Loading departments..."
                      : "Select Department"}
                  </option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Semester
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem, index) => (
                    <option key={index} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Lecture Title
              </label>
              <input
                type="text"
                name="lectureTitle"
                value={formData.lectureTitle}
                onChange={handleChange}
                placeholder="Enter lecture title"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Subject
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                YouTube Video URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Choose Video
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-gray-600 transition hover:border-blue-500 hover:bg-blue-50">
              <Upload className="h-5 w-5" />
              <span>
                {formData.videoFile
                  ? formData.videoFile.name
                  : "Click to upload video file"}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-xs text-gray-500">
              Video upload karoge to AI automatically transcript aur summary
              banane ki koshish karega.
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Summary of Video
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={8}
                placeholder="Leave empty for AI-generated summary"
                className="w-full rounded-2xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating summary...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Lecture
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-lg md:p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Saved Lectures
          </h2>

          {loadingLectures ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading lectures...
            </div>
          ) : lectures.length === 0 ? (
            <p className="text-gray-500">No lectures found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {lecture.lectureTitle || "Untitled Lecture"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {lecture.department || "No Department"} | Semester{" "}
                        {lecture.semester || "N/A"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteLecture(lecture._id)}
                      className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">Subject:</span>{" "}
                    {lecture.subject || "No subject available"}
                  </p>

                  <p className="mb-3 text-sm text-gray-700">
                    <span className="font-semibold">Date:</span>{" "}
                    {lecture.date || "No date available"}
                  </p>

                  {lecture.summaryGeneratedByAI && (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Summary Generated
                    </div>
                  )}

                  <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-semibold text-gray-800">
                        Summary
                      </h4>
                    </div>

                    <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                      {lecture.summary?.trim()
                        ? lecture.summary
                        : "Summary not available for this lecture."}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {lecture.youtubeUrl && (
                      <a
                        href={lecture.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        <PlayCircle className="h-4 w-4" />
                        YouTube
                      </a>
                    )}

                    {lecture.videoFile && (
                      <a
                        href={`${API_BASE}/${lecture.videoFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
                      >
                        <FileVideo className="h-4 w-4" />
                        View Video
                      </a>
                    )}
                  </div>

                  {lecture.videoFile && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
                      <video
                        controls
                        className="h-56 w-full bg-black object-cover"
                        src={`${API_BASE}/${lecture.videoFile}`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {lecture.transcript?.trim() && (
                    <details className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <summary className="cursor-pointer text-sm font-medium text-blue-600">
                        View Transcript
                      </summary>
                      <div className="mt-3 max-h-48 overflow-y-auto whitespace-pre-line text-sm text-gray-700">
                        {lecture.transcript}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
