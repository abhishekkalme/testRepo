import React, { useState } from "react";
import axios from "axios";

export default function GroupResultSummary() {
  const [groupName, setGroupName] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.post("http://localhost:5000/group-results", {
        groupName,
      });
      setResults(res.data);
      setError("");
    } catch (err) {
      setResults([]);
      setError(err.response?.data?.error || "Failed to fetch results");
    }
  };
 return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Quiz Result Summary</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group/quiz name"
            className="w-full md:w-2/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            Get Results
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        {results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-purple-100 text-purple-800">
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Roll No</th>
                  <th className="py-2 px-4 border text-green-700">Correct</th>
                  <th className="py-2 px-4 border text-red-600">Wrong</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border">{r.username}</td>
                    <td className="py-2 px-4 border">{r.rollNo}</td>
                    <td className="py-2 px-4 border text-green-700 font-semibold">{r.correct}</td>
                    <td className="py-2 px-4 border text-red-600 font-semibold">{r.wrong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}