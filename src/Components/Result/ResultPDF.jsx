import React from "react";
import { Download } from "lucide-react";

export default function ResultPDF({ student }) {
  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const generatePDF = () => {
    const grade = getGrade(student.percentage);

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Result Card - ${student.name}</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
          }
          .header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .info-section {
            background: #f7fafc;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
          }
          .info-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
          }
          .info-item {
            padding: 10px;
          }
          .info-label {
            font-size: 12px;
            color: #718096;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 16px;
            font-weight: bold;
            color: #2d3748;
          }
          .marks-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .marks-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .marks-table th {
            padding: 15px;
            text-align: left;
            font-size: 14px;
          }
          .marks-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          .marks-table tbody tr:hover {
            background: #f7fafc;
          }
          .marks-table tfoot {
            background: #edf2f7;
            font-weight: bold;
          }
          .performance-section {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
          }
          .performance-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 15px;
          }
          .performance-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .performance-label {
            font-size: 12px;
            color: #718096;
            margin-bottom: 10px;
          }
          .performance-value {
            font-size: 28px;
            font-weight: bold;
          }
          .percentage { color: #667eea; }
          .grade { color: #48bb78; }
          .result-pass { color: #48bb78; }
          .result-fail { color: #f56565; }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            font-size: 12px;
            color: #718096;
          }
          h2 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏆 RESULT CARD</h1>
          <p>Academic Performance Report</p>
        </div>

        <div class="info-section">
          <div class="info-row">
            <div class="info-item">
              <div class="info-label">Student Name</div>
              <div class="info-value">${student.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Roll Number</div>
              <div class="info-value">${student.rollNo}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <div class="info-label">Class</div>
              <div class="info-value">${student.class}</div>
            </div>
            ${
              student.semester
                ? `
            <div class="info-item">
              <div class="info-label">Semester</div>
              <div class="info-value">${student.semester}</div>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <h2>📚 Subject-wise Marks</h2>
        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th style="text-align: center;">Marks Obtained</th>
              <th style="text-align: center;">Maximum Marks</th>
              <th style="text-align: center;">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${student.subjects
              .map((subject) => {
                const subPercent = (
                  (subject.marks / subject.maxMarks) *
                  100
                ).toFixed(2);
                return `
                <tr>
                  <td>${subject.name}</td>
                  <td style="text-align: center; font-weight: bold;">${subject.marks}</td>
                  <td style="text-align: center;">${subject.maxMarks}</td>
                  <td style="text-align: center; font-weight: bold;">${subPercent}%</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td>TOTAL</td>
              <td style="text-align: center;">${student.subjects.reduce(
                (sum, s) => sum + Number(s.marks),
                0
              )}</td>
              <td style="text-align: center;">${student.subjects.reduce(
                (sum, s) => sum + Number(s.maxMarks),
                0
              )}</td>
              <td style="text-align: center;">${student.percentage}%</td>
            </tr>
          </tfoot>
        </table>

        <div class="performance-section">
          <h2>📈 Overall Performance</h2>
          <div class="performance-grid">
            <div class="performance-card">
              <div class="performance-label">Total Percentage</div>
              <div class="performance-value percentage">${
                student.percentage
              }%</div>
            </div>
            <div class="performance-card">
              <div class="performance-label">Grade</div>
              <div class="performance-value grade">${grade}</div>
            </div>
            <div class="performance-card">
              <div class="performance-label">Result</div>
              <div class="performance-value ${
                student.percentage >= 40 ? "result-pass" : "result-fail"
              }">
                ${student.percentage >= 40 ? "PASS" : "FAIL"}
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated result card and does not require a signature.</p>
          <p>Generated on ${new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window for printing
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <button
      onClick={generatePDF}
      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 text-xs font-semibold"
    >
      <Download className="w-3 h-3" />
      PDF
    </button>
  );
}


