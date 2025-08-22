import { useEffect, useState } from "react";
import axios from "axios";

export default function UserHistory() {
  const username = localStorage.getItem("username");
  const [created, setCreated] = useState([]);
  const [taken, setTaken] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editForms, setEditForms] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await axios.post("http://localhost:5000/api/user-history", {
      username,
    });
    setCreated(res.data.createdQuizzes);
    setTaken(res.data.takenQuizzes);
  };

 const deleteQuiz = async (groupName) => {
  if (!window.confirm("Are you sure to delete this quiz?")) return;
  await axios.delete(`http://localhost:5000/api/delete-quiz/${groupName}`);
  fetchHistory();
};

  const startEdit = (quiz) => {
    setEditMode(quiz.groupName);
    setEditGroupName(quiz.groupName);
    setEditForms(quiz.forms);
  };

  const handleFormChange = (i, field, value) => {
    const updated = [...editForms];
    updated[i][field] = value;
    setEditForms(updated);
  };

 const saveEdit = async () => {
  await axios.put("http://localhost:5000/api/update-quiz", {
    groupName: editMode, // old groupName
    updatedGroupName: editGroupName,
    updatedForms: editForms,
  });
  setEditMode(null);
  fetchHistory();
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">📜 User Quiz History</h2>

        <div className="mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">📝 Created Quizzes</h3>
          {created.length === 0 ? (
            <p className="text-gray-600">No quizzes created.</p>
          ) : (
            created.map((quiz, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm border border-gray-300"
              >
                {editMode === quiz.groupName ? (
                  <>
                    <input
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      className="w-full mb-2 p-2 border rounded-md"
                    />
                    {editForms.map((q, index) => (
                      <div key={index} className="mb-4 bg-white p-3 rounded shadow-inner">
                        <textarea
                          value={q.text}
                          onChange={(e) =>
                            handleFormChange(index, "text", e.target.value)
                          }
                          placeholder="Question"
                          className="w-full mb-2 p-2 border rounded-md"
                        />
                        {[1, 2, 3, 4].map((num) => (
                          <input
                            key={num}
                            placeholder={`Input${num}`}
                            value={q[`input${num}`]}
                            onChange={(e) =>
                              handleFormChange(index, `input${num}`, e.target.value)
                            }
                            className="w-full mb-2 p-2 border rounded-md"
                          />
                        ))}
                        <input
                          placeholder="Answer"
                          value={q.answer}
                          onChange={(e) => handleFormChange(index, "answer", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    ))}
                    <div className="flex gap-4">
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => setEditMode(null)}
                        className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-lg">{quiz.groupName}</strong>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(quiz.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => startEdit(quiz)}
                          className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white"
                        >
                          ✏ Update
                        </button>
                        <button
                          onClick={() => deleteQuiz(quiz.groupName)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                        >
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-green-700 mb-4">✅ Attempted Quizzes</h3>
          {taken.length === 0 ? (
            <p className="text-gray-600">No quizzes attempted.</p>
          ) : (
            <div className="space-y-3">
              {taken.map((quiz, i) => (
                <div
                  key={i}
                  className="bg-green-50 border border-green-200 p-3 rounded shadow-sm"
                >
                  <strong>{quiz.groupName}</strong> -{" "}
                  <span className="text-gray-700">
                    {new Date(quiz.date).toLocaleString()}
                  </span>
                  <div className="text-sm">
                    ✅ Correct: <span className="text-green-700 font-medium">{quiz.correct}</span>, ❌ Wrong: <span className="text-red-600 font-medium">{quiz.wrong}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}