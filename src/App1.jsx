import React, { useState,useEffect,useRef} from "react";
import { useNavigate } from "react-router-dom";


import axios from "axios";

export default function GroupViewer() {
  const [query, setQuery] = useState("");
  const [groupData, setGroupData] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username")||"");
  const [rollNo, setRollNo] = useState("");
  const [timeLeft,setTimeLeft]=useState(0);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
const navigate = useNavigate();
const timerRef=useRef(null);
  const [error, setError] = useState("");



  const handleFetch = async () => {
    setError("");
    setGroupData(null);
    try {
      const res = await axios.get(`http://localhost:5000/get-group/${query}`);
      setGroupData(res.data);
      setTimeLeft(res.data.duration*60);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch quiz");
    }
  };
useEffect(() => {
    if (!timeLeft || !groupData) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2,"0");
      const sec=(seconds%60).toString().padStart(2,"0");
      return `${min}:${sec}`;
  };

   const handleOptionChange = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };
  
 const handleSubmit = async () => {
    if (!username || !rollNo) {
      return setError("Please enter your name and roll number.");
    }

    const formattedAnswers = groupData.forms.map((form, index) => ({
      question: form.text,
      selectedOption: answers[index] || "",
    }));

    try {
      await axios.post("http://localhost:5000/submit-response", {
        groupName: groupData.groupName,
        username,
        rollNo,
        answers: formattedAnswers,
      });

      const res = await axios.post("http://localhost:5000/evaluate", {
      groupName: groupData.groupName,
      answers: formattedAnswers,
    });

    navigate("/result", {
      state: {
        total: res.data.total,
        correct: res.data.correct,
        wrong: res.data.wrong,
      },
    });
  } catch (err) {
    console.error(err);
    if(err.response?.data?.error==="you have already submitted your response"){
      setError("you have already submitted your response")
    }else
    setError("Failed to submit or evaluate.");
  }
};


   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Take Quiz</h2>

        <input
          type="text"
          placeholder="Enter quiz name with code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mb-6"
        >
          Fetch Quiz
        </button>

        {groupData && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-700">
              Quiz Code: {groupData.groupName}
            </h3>
         <p className="text-sm text-gray-600 mb-2">
              ⏳ Time Remaining: <span className="font-semibold">{formatTime(timeLeft)}</span>
            </p>
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                readOnly
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {groupData.forms.map((form, index) => (
              <div
                key={index}
                className="mb-6 border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="font-semibold mb-2">Q{index + 1}: {form.text}</p>
                {[form.input1, form.input2, form.input3, form.input4].map((option, idx) => (
                  <label key={idx} className="block mb-2 text-gray-700">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg mt-4"
            >
              Submit Answers
            </button>
          </div>
        )}

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {message && <p className="text-green-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}