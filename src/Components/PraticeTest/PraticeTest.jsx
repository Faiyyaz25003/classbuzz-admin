"use client";

import { useState, useEffect } from "react";

export default function PracticeTest() {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(60);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    difficulty: "",
    questions: 5,
    negative: 0,
  });

  const questions = [
    {
      q: "What is React?",
      options: ["Library", "Language", "Database", "Framework"],
      ans: "Library",
    },
    {
      q: "Which company created Java?",
      options: ["Microsoft", "Sun Microsystems", "Google", "IBM"],
      ans: "Sun Microsystems",
    },
    {
      q: "MongoDB is a?",
      options: ["SQL DB", "NoSQL DB", "Language", "Framework"],
      ans: "NoSQL DB",
    },
    {
      q: "Next.js is based on?",
      options: ["Angular", "Vue", "React", "Node"],
      ans: "React",
    },
    {
      q: "CSS stands for?",
      options: [
        "Cascading Style Sheets",
        "Creative Style System",
        "Color Style Sheet",
        "Computer Style Sheet",
      ],
      ans: "Cascading Style Sheets",
    },
  ];

  useEffect(() => {
    if (started && time > 0) {
      const timer = setInterval(() => {
        setTime((t) => t - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (time === 0) submitTest();
  }, [started, time]);

  const selectOption = (option) => {
    setAnswers({ ...answers, [current]: option });
  };

  const submitTest = () => {
    let correct = 0;
    let wrong = 0;

    questions.slice(0, form.questions).forEach((q, i) => {
      if (answers[i] === q.ans) correct++;
      else if (answers[i]) wrong++;
    });

    const score = correct - wrong * form.negative;

    setResult({
      correct,
      wrong,
      total: form.questions,
      score,
    });

    setStarted(false);
  };

  if (result)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow w-96 text-center">
          <h1 className="text-2xl font-bold mb-4">Result</h1>

          <p>Total Questions: {result.total}</p>
          <p className="text-green-600">Correct: {result.correct}</p>
          <p className="text-red-600">Wrong: {result.wrong}</p>

          <p className="mt-4 text-xl font-semibold">Score: {result.score}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (started)
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Question {current + 1}</h2>

            <div className="text-red-500 font-bold">⏱ {time}s</div>
          </div>

          <p className="mb-4 text-lg">{questions[current].q}</p>

          <div className="space-y-3">
            {questions[current].options.map((op, i) => (
              <button
                key={i}
                onClick={() => selectOption(op)}
                className={`block w-full text-left border p-3 rounded ${
                  answers[current] === op ? "bg-blue-100 border-blue-400" : ""
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Previous
            </button>

            {current < form.questions - 1 ? (
              <button
                onClick={() => setCurrent(current + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitTest}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Practice Test</h1>

        <select
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        >
          <option>Select Subject</option>
          <option>Java</option>
          <option>DBMS</option>
          <option>AI / ML</option>
        </select>

        <select
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        >
          <option>Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <input
          type="number"
          placeholder="Number of Questions"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, questions: Number(e.target.value) })
          }
        />

        <input
          type="number"
          placeholder="Negative Marking"
          className="w-full border p-2 rounded mb-6"
          onChange={(e) =>
            setForm({ ...form, negative: Number(e.target.value) })
          }
        />

        <button
          onClick={() => setStarted(true)}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Start Test
        </button>
      </div>
    </div>
  );
}
