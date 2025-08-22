import React, { useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import Button from "./components/Button";
import FormField from "./components/FormField";
import useToast from "./hooks/useToast";
import Toast from "./components/Toast";

function DynamicForm() {
  const username = localStorage.getItem("username");
  const [groupName, setGroupName] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forms, setForms] = useState([
    {
      text: "",
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      answer: "",
    },
  ]);
  const [savedQuizName, setSavedQuizName] = useState("");
  const { toasts, showToast, removeToast } = useToast();

  const addFormGroup = () => {
    setForms([
      ...forms,
      {
        text: "",
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        answer: "",
      },
    ]);
  };

  const removeFormGroup = (indexToRemove) => {
    const updated = forms.filter((_, index) => index !== indexToRemove);
    setForms(updated);
  };

  const handleChange = (index,e) => {
    const { name, value } = e.target;
    const updated = [...forms];
    updated[index][name] = value;
    setForms(updated);
  };

  const generateRandomcode=() =>
  {
    return Math.floor(1000+Math.random()*9000).toString();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!groupName.trim()) newErrors.groupName = "Quiz name is required";
    if (!duration || duration < 1) newErrors.duration = "Duration must be at least 1 minute";
    
    forms.forEach((form, index) => {
      if (!form.text.trim()) newErrors[`question_${index}`] = "Question is required";
      if (!form.input1.trim() || !form.input2.trim() || !form.input3.trim() || !form.input4.trim()) {
        newErrors[`options_${index}`] = "All options are required";
      }
      if (!form.answer.trim()) newErrors[`answer_${index}`] = "Correct answer is required";
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors before submitting", "error");
      return;
    }
    
    setLoading(true);
    const combinedGroupName = `${groupName}_${generateRandomcode()}`;
    
    try {
      const response = await axios.post("http://localhost:5000/save-groups", {
        groupName: combinedGroupName,
        forms,
        creator: username,
        duration: parseInt(duration),
      });
      
      showToast("Quiz created successfully!", "success");
      setSavedQuizName(combinedGroupName);
      setGroupName("");
      setDuration("");
      setForms([
        {
          text: "",
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        answer: "",
        },
      ]);
      setErrors({});
    } catch (error) {
      console.error("Save error:", error);
      showToast("Failed to save quiz. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Create New Quiz</h1>
              <p className="text-slate-600 dark:text-slate-300">Design engaging quizzes with multiple choice questions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FormField 
                label="Quiz Name" 
                required 
                error={errors.groupName}
                helpText="Choose a descriptive name for your quiz"
              >
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g., JavaScript Fundamentals"
                />
              </FormField>
              
              <FormField 
                label="Duration (minutes)" 
                required 
                error={errors.duration}
                helpText="How long should participants have to complete the quiz?"
              >
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="30"
                />
              </FormField>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Questions</h2>
              
              {forms.map((form, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-6 bg-slate-50 dark:bg-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white">Question {index + 1}</h3>
                    {forms.length > 1 && (
                      <Button
                        onClick={() => removeFormGroup(index)}
                        variant="danger"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <FormField 
                    label="Question" 
                    required 
                    error={errors[`question_${index}`]}
                    className="mb-4"
                  >
                    <textarea
                      name="text"
                      value={form.text}
                      onChange={(e) => handleChange(index, e)}
                      rows="3"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                      placeholder="Enter your question here..."
                    />
                  </FormField>
                  
                  <FormField 
                    label="Answer Options" 
                    required 
                    error={errors[`options_${index}`]}
                    className="mb-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((num) => (
                        <input
                          key={num}
                          type="text"
                          name={`input${num}`}
                          placeholder={`Option ${num}`}
                          value={form[`input${num}`]}
                          onChange={(e) => handleChange(index, e)}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                        />
                      ))}
                    </div>
                  </FormField>
                  
                  <FormField 
                    label="Correct Answer" 
                    required 
                    error={errors[`answer_${index}`]}
                    helpText="Enter the exact text of the correct option"
                  >
                    <input
                      type="text"
                      name="answer"
                      placeholder="Enter the correct answer"
                      value={form.answer}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                    />
                  </FormField>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
              <Button
                onClick={addFormGroup}
                variant="outline"
              >
                ➕ Add Question
              </Button>
              
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={forms.length === 0}
              >
                🚀 Create Quiz
              </Button>
            </div>

            {savedQuizName && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <div>
                    <p className="font-medium text-green-800">Quiz Created Successfully!</p>
                    <p className="text-sm text-green-700">Quiz Code: <code className="font-mono bg-green-100 px-2 py-1 rounded">{savedQuizName}</code></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
      
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


export default DynamicForm;