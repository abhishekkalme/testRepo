import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { total, correct, wrong } = location.state || {};

  if (!total) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">No result data. Please take a quiz first.</p>
          <button
            onClick={() => navigate("/view")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Quiz Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Result Summary</h2>
        <div className="space-y-4 text-lg">
          <p className="text-gray-800">Total Questions: <span className="font-semibold">{total}</span></p>
          <p className="text-green-600">Correct Answers: <span className="font-bold">{correct}</span></p>
          <p className="text-red-500">Wrong Answers: <span className="font-bold">{wrong}</span></p>
        </div>
        <button
          onClick={() => navigate("/history")}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
        >
          View Quiz History
        </button>
      </div>
    </div>
  );
}