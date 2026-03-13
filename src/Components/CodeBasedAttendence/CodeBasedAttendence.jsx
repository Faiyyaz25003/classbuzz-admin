
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CodeBasedAttendence() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [code, setCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await axios.get("http://localhost:5000/api/course");

        setCourses(res.data);

      } catch (err) {

        console.log(err);

      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const generateCode = () => {

    const newCode = Math.floor(100000 + Math.random() * 900000);

    setCode(newCode);

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // SUBJECT PAGE
  if (selectedSubject) {
    return (

      <div className="p-10 bg-gray-50 min-h-screen border-4 border-black">

        <div className="flex justify-between items-center mb-16">

          <h1 className="text-3xl font-bold underline">
            {selectedSubject.name}
          </h1>

          <button
            onClick={generateCode}
            className="border-2 border-black px-6 py-2 font-semibold hover:bg-gray-200"
          >
            Code
          </button>

        </div>

        {code && (

          <div className="border-4 border-black rounded-3xl p-12 flex justify-between items-center max-w-4xl">

            <h2 className="text-xl">
              {selectedSubject.name} Lecture Attendence Verification Code
            </h2>

            <div className="border-4 border-black px-20 py-4 text-2xl font-bold tracking-widest">

              {code}

            </div>

          </div>

        )}

        <button
          onClick={() => {
            setSelectedSubject(null);
            setCode(null);
          }}
          className="mt-10 text-gray-600"
        >
          ← Back
        </button>

      </div>
    );
  }

  // SUBJECT LIST
  if (selectedSemester) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">

        <button
          onClick={() => setSelectedSemester(null)}
          className="text-gray-500 mb-6"
        >
          ← Back to Semesters
        </button>

        <h1 className="text-4xl font-bold mb-10">Subjects</h1>

        <div className="flex flex-col gap-6">

          {selectedSemester.subjects.map((sub, i) => (
            <div
              key={i}
              onClick={() => setSelectedSubject(sub)}
              className="flex justify-between items-center p-6 bg-white border rounded-xl shadow hover:scale-105 transition cursor-pointer"
            >

              <h2 className="text-2xl font-semibold">{sub.name}</h2>

              <span className="text-xl">➜</span>

            </div>
          ))}

        </div>

      </div>
    );
  }

  // SEMESTER LIST
  if (selectedCourse) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">

        <button
          onClick={() => setSelectedCourse(null)}
          className="text-gray-500 mb-6"
        >
          ← Back to Courses
        </button>

        <h1 className="text-4xl font-bold mb-10">Semesters</h1>

        <div className="flex flex-col gap-6">

          {selectedCourse.semesters.map((sem, i) => (
            <div
              key={i}
              onClick={() => setSelectedSemester(sem)}
              className="flex justify-between items-center p-6 bg-white border rounded-xl shadow hover:scale-105 transition cursor-pointer"
            >

              <h2 className="text-2xl font-semibold">
                Semester {sem.semester}
              </h2>

              <span className="text-xl">➜</span>

            </div>
          ))}

        </div>

      </div>
    );
  }

  // COURSE LIST
  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      <h1 className="text-4xl font-bold mb-12 text-gray-800">
        Courses
      </h1>

      <div className="flex flex-col gap-6">

        {courses.map((course, i) => (
          <div
            key={i}
            onClick={() => setSelectedCourse(course)}
            className="flex justify-between items-center p-6 bg-white border rounded-xl shadow hover:scale-105 transition cursor-pointer"
          >

            <h2 className="text-2xl font-semibold">
              {course.name}
            </h2>

            <span className="text-xl">➜</span>

          </div>
        ))}

      </div>

    </div>
  );
}