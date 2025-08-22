import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async () => {
    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        navigate("/dashboard");
      } else {
        alert("Registration successful. Now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className=" fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 ">
      <div className="w-[500px] h-[400px]  bg-white p-8 rounded-2xl shadow-xl flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{isLogin ? "Login" : "Register"}</h2>
      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
         className="mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"

        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
       className="mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"

      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
          className="mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"

      />
      <button onClick={handleSubmit} className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition">
        {isLogin ? "Login" : "Register"}
      </button>
      <p className="text-center mt-6 text-sm text-gray-600">

        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={toggleForm} className="text-purple-600 hover:underline font-medium">
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
      </div>
    </div>
  );
}