"use client";

import { useState } from "react";

export default function LibraryPage() {
  const [active, setActive] = useState(null); // null, "all", "my", "expire"

  const allBooks = [
    { id: 1, name: "Math Book" },
    { id: 2, name: "Physics Book" },
    { id: 3, name: "Chemistry Book" },
    { id: 4, name: "Biology Book" },
    { id: 5, name: "English Grammar" },
    { id: 6, name: "Computer Science" },
    { id: 7, name: "JavaScript Guide" },
    { id: 8, name: "React Handbook" },
    { id: 9, name: "NextJS Basics" },
    { id: 10, name: "Tailwind CSS" },
  ];

  const myBooks = [
    { id: 1, name: "Math Book" },
    { id: 2, name: "Physics Book" },
    { id: 3, name: "JavaScript Guide" },
    { id: 4, name: "React Handbook" },
    { id: 5, name: "NextJS Basics" },
  ];

  const expireBooks = [
    { id: 1, name: "Math Book" },
    { id: 2, name: "Physics Book" },
    { id: 3, name: "React Handbook" },
  ];

  const getBooks = () => {
    if (active === "all") return allBooks;
    if (active === "my") return myBooks;
    if (active === "expire") return expireBooks;
    return [];
  };

  const getTitle = () => {
    if (active === "all") return "All Books";
    if (active === "my") return "My Books";
    if (active === "expire") return "Expire Within 7 Days";
  };

  return (
    <div className="p-10">
      {/* Upload Section */}
      <div className="bg-gray-100 p-6 rounded-xl mb-10">
        <h1 className="text-2xl font-bold mb-4">Admin Library</h1>

        <div className="flex gap-4">
          <input className="border p-2 w-1/3" placeholder="Course" />
          <input className="border p-2 w-1/3" placeholder="Subject" />
          <input className="border p-2 w-1/3" placeholder="Book Name" />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Upload PDF
        </button>
      </div>

      {/* Cards */}
      {!active && (
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => setActive("all")}
            className="border-4 p-10 text-3xl font-bold cursor-pointer hover:bg-gray-100 text-center"
          >
            All Book
          </div>

          <div
            onClick={() => setActive("my")}
            className="border-4 p-10 text-3xl font-bold cursor-pointer hover:bg-gray-100 text-center"
          >
            My Books
          </div>

          <div
            onClick={() => setActive("expire")}
            className="border-4 p-10 text-3xl font-bold cursor-pointer hover:bg-gray-100 text-center"
          >
            Books Expire within 7 Days
          </div>
        </div>
      )}

      {/* Books Section */}
      {active && (
        <div>
          <button
            onClick={() => setActive(null)}
            className="mb-6 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back
          </button>

          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>

            <div className="grid grid-cols-3 gap-4">
              {getBooks().map((book) => (
                <div
                  key={book.id}
                  className="border p-4 rounded-lg shadow hover:bg-gray-100"
                >
                  📚 {book.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
