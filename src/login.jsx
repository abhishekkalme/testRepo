import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import FormField from "./components/FormField";
import useToast from "./hooks/useToast";
import Toast from "./components/Toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!isLogin && !username) newErrors.username = "Username is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setPassword("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        showToast("Login successful!", "success");
        navigate("/dashboard");
      } else {
        showToast("Registration successful! Please log in.", "success");
        setIsLogin(true);
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">QuizMaster</h1>
            <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {!isLogin && (
              <FormField 
                label="Username" 
                required 
                error={errors.username}
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Enter your username"
                />
              </FormField>
            )}
            
            <FormField 
              label="Email" 
              required 
              error={errors.email}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Enter your email"
              />
            </FormField>
            
            <FormField 
              label="Password" 
              required 
              error={errors.password}
              helpText={!isLogin ? "Must be at least 6 characters" : ""}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Enter your password"
              />
            </FormField>
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              loading={loading}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={toggleForm} 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}