// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function UpcomingExams() {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedSemester, setSelectedSemester] = useState("");
//   const [subjects, setSubjects] = useState([]);

//   const [timetable, setTimetable] = useState([]);

//   /* FETCH COURSES */

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/course");
//         setCourses(res.data || []);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchCourses();
//   }, []);

//   /* COURSE SELECT */

//   const handleCourseSelect = (id) => {
//     setSelectedCourse(id);
//     setSelectedSemester("");
//     setSubjects([]);
//     setTimetable([]);
//   };

//   /* SEMESTER SELECT */

//   const handleSemesterSelect = (sem) => {
//     setSelectedSemester(sem);

//     const course = courses.find((c) => c._id === selectedCourse);

//     const semesterData = course?.semesters?.find(
//       (s) => s.semester.toString() === sem,
//     );

//     const subs = semesterData?.subjects || [];

//     setSubjects(subs);

//     const table = subs.map((s) => ({
//       subject: s.name,
//       date: "",
//       time: "",
//       room: "",
//     }));

//     setTimetable(table);
//   };

//   /* HANDLE INPUT */

//   const handleChange = (index, field, value) => {
//     const updated = [...timetable];

//     updated[index][field] = value;

//     setTimetable(updated);
//   };

//   /* SAVE TIMETABLE */

//   const handleSave = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/exam-timetable", {
//         course: selectedCourse,
//         semester: selectedSemester,
//         timetable: timetable,
//       });

//       alert("Exam Time Table Saved Successfully");
//     } catch (error) {
//       console.log(error);
//       alert("Error saving timetable");
//     }
//   };

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Create Exam Time Table</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* COURSE */}

//         <div>
//           <label className="font-semibold">Select Course *</label>

//           <select
//             className="w-full p-3 border rounded-lg mt-1"
//             value={selectedCourse}
//             onChange={(e) => handleCourseSelect(e.target.value)}
//           >
//             <option value="">Select Course</option>

//             {courses.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* SEMESTER */}

//         <div>
//           <label className="font-semibold">Select Semester *</label>

//           <select
//             className="w-full p-3 border rounded-lg mt-1"
//             value={selectedSemester}
//             onChange={(e) => handleSemesterSelect(e.target.value)}
//             disabled={!selectedCourse}
//           >
//             <option value="">Select Semester</option>

//             {selectedCourse &&
//               courses
//                 .find((c) => c._id === selectedCourse)
//                 ?.semesters?.map((s) => (
//                   <option key={s.semester} value={s.semester}>
//                     Semester {s.semester}
//                   </option>
//                 ))}
//           </select>
//         </div>
//       </div>

//       {/* TIME TABLE */}

//       {timetable.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4">Exam Time Table</h2>

//           <div className="overflow-x-auto">
//             <table className="w-full border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3 border">Subject</th>
//                   <th className="p-3 border">Exam Date</th>
//                   <th className="p-3 border">Exam Time</th>
//                   <th className="p-3 border">Room</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {timetable.map((item, index) => (
//                   <tr key={index}>
//                     <td className="p-3 border">{item.subject}</td>

//                     <td className="p-3 border">
//                       <input
//                         type="date"
//                         className="border p-2 rounded w-full"
//                         value={item.date}
//                         onChange={(e) =>
//                           handleChange(index, "date", e.target.value)
//                         }
//                       />
//                     </td>

//                     <td className="p-3 border">
//                       <input
//                         type="time"
//                         className="border p-2 rounded w-full"
//                         value={item.time}
//                         onChange={(e) =>
//                           handleChange(index, "time", e.target.value)
//                         }
//                       />
//                     </td>

//                     <td className="p-3 border">
//                       <input
//                         type="text"
//                         placeholder="Room No"
//                         className="border p-2 rounded w-full"
//                         value={item.room}
//                         onChange={(e) =>
//                           handleChange(index, "room", e.target.value)
//                         }
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={handleSave}
//             className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
//           >
//             Save Time Table
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpcomingExams() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [timetable, setTimetable] = useState([]);
  const [timetableId, setTimetableId] = useState(null);

  /* FETCH COURSES */

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* COURSE SELECT */

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);

    setSelectedSemester("");
    setTimetable([]);
    setTimetableId(null);
  };

  /* SEMESTER SELECT */

  const handleSemesterSelect = async (semester) => {
    setSelectedSemester(semester);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/exam-timetable`
      );

      const table = res.data.find(
        (t) =>
          t.course?._id === selectedCourse &&
          t.semester.toString() === semester
      );

      if (table) {
        setTimetable(table.timetable);
        setTimetableId(table._id);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    /* IF TIMETABLE NOT EXIST */

    const course = courses.find((c) => c._id === selectedCourse);

    const semesterData = course?.semesters?.find(
      (s) => s.semester.toString() === semester
    );

    const subjects = semesterData?.subjects || [];

    const table = subjects.map((sub) => ({
      subject: sub.name,
      date: "",
      time: "",
      room: "",
    }));

    setTimetable(table);
  };

  /* HANDLE INPUT */

  const handleChange = (index, field, value) => {
    const updated = [...timetable];
    updated[index][field] = value;
    setTimetable(updated);
  };

  /* SAVE */

  const handleSave = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/exam-timetable", {
        course: selectedCourse,
        semester: selectedSemester,
        timetable,
      });

      setTimetableId(res.data.data._id);

      alert("Timetable Saved");
    } catch (error) {
      console.log(error);
      alert("Error saving timetable");
    }
  };

  /* UPDATE ROW */

  const updateRow = async (index) => {
    try {
      await axios.put(
        `http://localhost:5000/api/exam-timetable/${timetableId}/row/${index}`,
        timetable[index]
      );

      alert("Row Updated");
    } catch (error) {
      console.log(error);
    }
  };

  /* DELETE ROW */

  const deleteRow = async (index) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/exam-timetable/${timetableId}/row/${index}`
      );

      const updated = timetable.filter((_, i) => i !== index);
      setTimetable(updated);
    } catch (error) {
      console.log(error);
    }
  };

  /* DELETE FULL */

  const deleteTimetable = async () => {
    if (!confirm("Delete full timetable?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/exam-timetable/${timetableId}`
      );

      setTimetable([]);
      setTimetableId(null);

      alert("Timetable Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Create Exam Time Table</h1>

      {/* COURSE + SEMESTER */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* COURSE */}

        <div>
          <label className="font-semibold">Select Course</label>

          <select
            className="w-full border p-3 rounded mt-1"
            value={selectedCourse}
            onChange={(e) => handleCourseSelect(e.target.value)}
          >
            <option value="">Select Course</option>

            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEMESTER */}

        <div>
          <label className="font-semibold">Select Semester</label>

          <select
            className="w-full border p-3 rounded mt-1"
            value={selectedSemester}
            onChange={(e) => handleSemesterSelect(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">Select Semester</option>

            {selectedCourse &&
              courses
                .find((c) => c._id === selectedCourse)
                ?.semesters?.map((s) => (
                  <option key={s.semester} value={s.semester}>
                    Semester {s.semester}
                  </option>
                ))}
          </select>
        </div>
      </div>

      {/* TABLE */}

      {timetable.length > 0 && (
        <div className="mt-10">

          <div className="flex justify-between mb-4">

            <h2 className="text-xl font-bold">Exam Time Table</h2>

            {timetableId && (
              <button
                onClick={deleteTimetable}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Full
              </button>
            )}
          </div>

          <table className="w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Subject</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Room</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {timetable.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 border">{item.subject}</td>

                  <td className="p-3 border">
                    <input
                      type="date"
                      className="border p-2 rounded w-full"
                      value={item.date}
                      onChange={(e) =>
                        handleChange(index, "date", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-3 border">
                    <input
                      type="time"
                      className="border p-2 rounded w-full"
                      value={item.time}
                      onChange={(e) =>
                        handleChange(index, "time", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-3 border">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={item.room}
                      onChange={(e) =>
                        handleChange(index, "room", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-3 border flex gap-2">

                    {timetableId && (
                      <button
                        onClick={() => updateRow(index)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Update
                      </button>
                    )}

                    {timetableId && (
                      <button
                        onClick={() => deleteRow(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!timetableId && (
            <button
              onClick={handleSave}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
            >
              Save Time Table
            </button>
          )}
        </div>
      )}
    </div>
  );
}