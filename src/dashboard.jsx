import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-8">🎓 Welcome to Quiz Dashboard</h2>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/create-quiz")}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-xl shadow"
          >
            ➕ Create Quiz
          </button>

          <button
            onClick={() => navigate("/view")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl shadow"
          >
            📝 Take Quiz
          </button>

          <button
            onClick={() => navigate("/group-results")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-xl shadow"
          >
            📊 View Result Summary
          </button>

          <button
            onClick={() => navigate("/history")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-xl shadow"
          >
            📚 View History
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl shadow"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}