// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Save, Trash2, X, ChevronDown, Book, Pencil } from "lucide-react";

// export default function Course() {
//   const API = "http://localhost:5000/api/courses"; // your backend URL

//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedSemester, setSelectedSemester] = useState("");
//   const [subjectName, setSubjectName] = useState("");
//   const [credits, setCredits] = useState("2");
//   const [expandedCourses, setExpandedCourses] = useState({});
//   const [editingSubjectId, setEditingSubjectId] = useState(null);
//   const [editName, setEditName] = useState("");
//   const [editCredits, setEditCredits] = useState("");

//   // 📌 Load all courses from API
//   const loadCourses = async () => {
//     try {
//       const res = await axios.get(API);
//       setCourses(res.data.courses);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     loadCourses();
//   }, []);

//   const courseOptions = [
//     "Computer Science (B.COM)",
//     "Information Technology (BSCIT)",
//     "Electronics & Communication (BFM)",
//     "Mechanical Engineering (BAF)",
//     "Data Science (BSC. DS)",
//     "Management Studies (BMS)",
//     "Banking and Insurance (BBI)",
//     "Multimedia and Mass Communication (BAMMC)",
//   ];

//   const semesterOptions = [
//     "Semester 1",
//     "Semester 2",
//     "Semester 3",
//     "Semester 4",
//     "Semester 5",
//     "Semester 6",
//     "Semester 7",
//     "Semester 8",
//   ];

//   // 📌 ADD SUBJECT (POST API)
//   const addSubject = async () => {
//     if (!selectedCourse || !selectedSemester || !subjectName || !credits) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       await axios.post(`${API}/subject`, {
//         courseName: selectedCourse,
//         semester: parseInt(selectedSemester.split(" ")[1]),
//         subjectName,
//         credits: parseInt(credits),
//       });

//       loadCourses();
//       setSubjectName("");
//       setCredits("2");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // 📌 DELETE COURSE (DELETE API)
//   const deleteCourse = async (courseId) => {
//     try {
//       await axios.delete(`${API}/${courseId}`);
//       loadCourses();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // 📌 START EDIT
//   const startEditSubject = (subject) => {
//     setEditingSubjectId(subject.id);
//     setEditName(subject.name);
//     setEditCredits(subject.credits);
//   };

//   // 📌 SAVE EDIT (PUT API)
//   const saveEditSubject = async (courseId, semesterNum, subjectId) => {
//     try {
//       await axios.put(
//         `${API}/${courseId}/semester/${semesterNum}/subject/${subjectId}`,
//         {
//           name: editName,
//           credits: editCredits,
//         }
//       );

//       loadCourses();
//       setEditingSubjectId(null);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const toggleCourse = (courseId) => {
//     setExpandedCourses((prev) => ({
//       ...prev,
//       [courseId]: !prev[courseId],
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center gap-3">
//             <Book className="w-8 h-8 text-indigo-600" />
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Course Management System
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Manage courses, semesters, and subjects
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Form */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="text-2xl font-bold mb-6">Add New Course Data</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label className="font-medium">Select Course</label>
//               <select
//                 value={selectedCourse}
//                 onChange={(e) => setSelectedCourse(e.target.value)}
//                 className="w-full px-4 py-3 border mt-2 rounded-lg"
//               >
//                 <option value="">Choose a course...</option>
//                 {courseOptions.map((course) => (
//                   <option key={course} value={course}>
//                     {course}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="font-medium">Select Semester</label>
//               <select
//                 value={selectedSemester}
//                 onChange={(e) => setSelectedSemester(e.target.value)}
//                 className="w-full px-4 py-3 border mt-2 rounded-lg"
//               >
//                 <option value="">Choose semester...</option>
//                 {semesterOptions.map((sem) => (
//                   <option key={sem} value={sem}>
//                     {sem}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="font-medium">Subject Name</label>
//               <input
//                 type="text"
//                 value={subjectName}
//                 onChange={(e) => setSubjectName(e.target.value)}
//                 className="w-full px-4 py-3 border mt-2 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="font-medium">Credits</label>
//               <input
//                 type="number"
//                 value={credits}
//                 onChange={(e) => setCredits(e.target.value)}
//                 className="w-full px-4 py-3 border mt-2 rounded-lg"
//               />
//             </div>
//           </div>

//           <button
//             onClick={addSubject}
//             className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
//           >
//             Add Subject
//           </button>
//         </div>

//         {/* ALL COURSES */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-2xl font-bold mb-6">All Courses</h2>

//           {courses.map((course) => (
//             <div
//               key={course._id}
//               className="border border-gray-200 rounded-lg mb-4"
//             >
//               <div
//                 className="bg-green-50 border-l-4 border-green-500 p-4 flex justify-between cursor-pointer"
//                 onClick={() => toggleCourse(course._id)}
//               >
//                 <span className="font-bold uppercase">{course.name}</span>

//                 <button
//                   onClick={() => deleteCourse(course._id)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <Trash2 />
//                 </button>
//               </div>

//               {expandedCourses[course._id] && (
//                 <div className="p-6 space-y-8">
//                   {course.semesters.map((sem) => (
//                     <div key={sem.semester}>
//                       <h3 className="font-bold mb-4">
//                         SEMESTER {sem.semester}
//                       </h3>

//                       <table className="w-full border">
//                         <thead>
//                           <tr className="bg-orange-500 text-white">
//                             <th className="border px-4 py-3">Sr</th>
//                             <th className="border px-4 py-3">Subject</th>
//                             <th className="border px-4 py-3">Credits</th>
//                             <th className="border px-4 py-3">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {sem.subjects.map((sub, idx) => (
//                             <tr key={sub.id} className="hover:bg-gray-50">
//                               <td className="border px-4 py-3">{idx + 1}</td>

//                               <td className="border px-4 py-3">
//                                 {editingSubjectId === sub.id ? (
//                                   <input
//                                     value={editName}
//                                     onChange={(e) =>
//                                       setEditName(e.target.value)
//                                     }
//                                     className="px-2 py-1 border rounded"
//                                   />
//                                 ) : (
//                                   sub.name
//                                 )}
//                               </td>

//                               <td className="border px-4 py-3 text-center">
//                                 {editingSubjectId === sub.id ? (
//                                   <input
//                                     type="number"
//                                     value={editCredits}
//                                     onChange={(e) =>
//                                       setEditCredits(e.target.value)
//                                     }
//                                     className="w-20 px-2 py-1 border rounded"
//                                   />
//                                 ) : (
//                                   sub.credits
//                                 )}
//                               </td>

//                               <td className="border px-4 py-3 text-center">
//                                 {editingSubjectId === sub.id ? (
//                                   <div className="flex gap-2 justify-center">
//                                     <button
//                                       onClick={() =>
//                                         saveEditSubject(
//                                           course._id,
//                                           sem.semester,
//                                           sub.id
//                                         )
//                                       }
//                                       className="px-3 py-1 bg-green-600 text-white rounded"
//                                     >
//                                       Save
//                                     </button>
//                                     <button
//                                       onClick={() => setEditingSubjectId(null)}
//                                       className="px-3 py-1 bg-gray-400 text-white rounded"
//                                     >
//                                       Cancel
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <button
//                                     onClick={() => startEditSubject(sub)}
//                                     className="text-blue-600 hover:text-blue-800"
//                                   >
//                                     <Pencil className="w-5 h-5" />
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Book, Pencil } from "lucide-react";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [credits, setCredits] = useState("2");
  const [expandedCourses, setExpandedCourses] = useState({});
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCredits, setEditCredits] = useState("");

  const courseOptions = [
    "Computer Science (B.COM)",
    "Information Technology (BSCIT)",
    "Electronics & Communication (BFM)",
    "Mechanical Engineering (BAF)",
    "Data Science (BSC. DS)",
    "Management Studies (BMS)",
    "Banking and Insurance (BBI)",
    "Multimedia and Mass Communication (BAMMC)",
  ];

  const semesterOptions = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  // *******************************
  // LOAD ALL COURSES FROM API
  // *******************************
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data.data);
    } catch (err) {
      console.log("Error fetching:", err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // *******************************
  // ADD SUBJECT API
  // *******************************
  const addSubject = async () => {
    if (!selectedCourse || !selectedSemester || !subjectName) {
      alert("Fill all fields");
      return;
    }

    const semesterNum = parseInt(selectedSemester.split(" ")[1]);

    try {
      await axios.post("http://localhost:5000/api/course/subject", {
        courseName: selectedCourse,
        semester: semesterNum,
        subjectName,
        credits: parseInt(credits),
      });

      fetchCourses();
      setSubjectName("");
      setCredits("2");
    } catch (err) {
      console.log(err);
      alert("Error adding subject");
    }
  };

  // *******************************
  // START EDIT
  // *******************************
  const startEdit = (subject) => {
    setEditId(subject._id);
    setEditName(subject.name);
    setEditCredits(subject.credits);
  };

  // *******************************
  // UPDATE SUBJECT API
  // *******************************
  const saveEditSubject = async (courseId, semesterNum, subjectId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/course/${courseId}/semester/${semesterNum}/subject/${subjectId}`,
        {
          name: editName,
          credits: editCredits,
        }
      );

      setEditId(null);
      fetchCourses();
    } catch (err) {
      console.log(err);
      alert("Error updating subject");
    }
  };

  // *******************************
  // DELETE COURSE API
  // *******************************
  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/course/${courseId}`);
      fetchCourses();
    } catch (err) {
      console.log(err);
      alert("Error deleting");
    }
  };

  // Expand/Collapse
  const toggleCourse = (id) => {
    setExpandedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-3">
          <Book className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">Course Management System</h1>
            <p className="text-gray-600 mt-1">
              Manage courses, semesters, and subjects
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add New Subject Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Add New Course Data</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Dropdown */}
            <div>
              <label className="font-medium">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
              >
                <option value="">Choose course...</option>
                {courseOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown */}
            <div>
              <label className="font-medium">Select Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
              >
                <option value="">Choose semester...</option>
                {semesterOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Subject Name */}
            <div>
              <label className="font-medium">Subject Name</label>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
                placeholder="Enter subject"
              />
            </div>

            {/* Credits */}
            <div>
              <label className="font-medium">Credits</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={addSubject}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg"
          >
            Add Subject
          </button>
        </div>

        {/* List All Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">All Courses</h2>

          {courses.length === 0 ? (
            <p className="text-center text-gray-500">No courses found.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="border border-gray-200 rounded-lg mb-5"
              >
                {/* Course Header */}
                <div
                  className="bg-green-50 border-l-4 border-green-500 p-4 flex justify-between cursor-pointer"
                  onClick={() => toggleCourse(course._id)}
                >
                  <span className="font-bold uppercase">{course.name}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCourse(course._id);
                    }}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedCourses[course._id] &&
                  course.semesters.map((sem) => (
                    <div key={sem.semester} className="p-6">
                      <h3 className="font-bold mb-4">
                        SEMESTER {sem.semester}
                      </h3>

                      <table className="w-full border">
                        <thead>
                          <tr className="bg-orange-500 text-white">
                            <th className="border px-4 py-3">Sr</th>
                            <th className="border px-4 py-3">Subject</th>
                            <th className="border px-4 py-3">Credits</th>
                            <th className="border px-4 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sem.subjects.map((sub, index) => (
                            <tr key={sub._id} className="hover:bg-gray-50">
                              <td className="border px-4 py-3">{index + 1}</td>

                              {/* Subject Name */}
                              <td className="border px-4 py-3">
                                {editId === sub._id ? (
                                  <input
                                    value={editName}
                                    onChange={(e) =>
                                      setEditName(e.target.value)
                                    }
                                    className="px-2 py-1 border rounded"
                                  />
                                ) : (
                                  sub.name
                                )}
                              </td>

                              {/* Credits */}
                              <td className="border px-4 py-3 text-center">
                                {editId === sub._id ? (
                                  <input
                                    value={editCredits}
                                    type="number"
                                    onChange={(e) =>
                                      setEditCredits(e.target.value)
                                    }
                                    className="px-2 py-1 w-20 border rounded"
                                  />
                                ) : (
                                  sub.credits
                                )}
                              </td>

                              <td className="border px-4 py-3 text-center">
                                {editId === sub._id ? (
                                  <button
                                    onClick={() =>
                                      saveEditSubject(
                                        course._id,
                                        sem.semester,
                                        sub._id
                                      )
                                    }
                                    className="px-4 py-1 bg-green-600 text-white rounded"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => startEdit(sub)}
                                    className="text-blue-600"
                                  >
                                    <Pencil className="w-5 h-5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
