import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Button from "./components/Button";

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const dashboardCards = [
    {
      title: "Create Quiz",
      description: "Design and build custom quizzes with multiple choice questions",
      icon: "➕",
      color: "bg-blue-500 hover:bg-blue-600",
      path: "/create-quiz"
    },
    {
      title: "Take Quiz",
      description: "Join and participate in quizzes using quiz codes",
      icon: "📝",
      color: "bg-green-500 hover:bg-green-600",
      path: "/view"
    },
    {
      title: "View Results",
      description: "Check detailed results and performance analytics",
      icon: "📊",
      color: "bg-purple-500 hover:bg-purple-600",
      path: "/group-results"
    },
    {
      title: "Quiz History",
      description: "Review your created quizzes and past attempts",
      icon: "📚",
      color: "bg-orange-500 hover:bg-orange-600",
      path: "/history"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Welcome back, {username}! 👋
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Create engaging quizzes, track performance, and manage your learning experience all in one place.
          </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 p-6 group"
            >
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
            </div>
          ))}
        </div>
        </div>
        {/* Quick Stats Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate("/create-quiz")} 
              variant="primary"
            >
              🚀 Create New Quiz
            </Button>
            <Button 
              onClick={() => navigate("/view")} 
              variant="outline"
            >
              🔍 Join Quiz
            </Button>
            <Button 
              onClick={() => navigate("/history")} 
              variant="secondary"
            >
              📈 View Analytics
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}