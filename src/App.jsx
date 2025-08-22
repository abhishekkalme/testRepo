import React, { useState } from "react";
import axios from "axios";

function DynamicForm() {
  const username=localStorage.getItem("username");
  const [groupName ,setGroupName]=useState("");
  const [duration,setDuration]=useState("");
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
   const [savedQuizName,setsavedQuizName]=useState("");
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
    const {name,value}=e.target;
    const updated = [...forms];
    updated[index][name] = value;
    setForms(updated);
  };

  const generateRandomcode=() =>
  {
    return Math.floor(1000+Math.random()*9000).toString();
  };
  const handleSubmit = async () => {
     if(!groupName)
     {
      alert("please enter groupName");
      return;
     }
     const combinedGroupName=`${groupName}_${generateRandomcode()}`;
    try {
      const response = await axios.post("http://localhost:5000/save-groups", {
        groupName:combinedGroupName,
        forms,
        creator:username,
        duration:parseInt(duration),
      });
      alert("Saved successfully!");
      setsavedQuizName(combinedGroupName);
      setGroupName("");
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
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save data");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Quiz</h2>

        <input
          type="text"
          placeholder="Enter quiz name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
          <input
              type="number"
              placeholder="Duration(minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        {forms.map((form, index) => (
          <div key={index} className="mb-6 border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50">
            <textarea
              placeholder="Enter question"
              name="text"
              value={form.text}
              onChange={(e) => handleChange(index, e)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="input1"
                placeholder="Option 1"
                value={form.input1}
                onChange={(e) => handleChange(index, e)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="input2"
                placeholder="Option 2"
                value={form.input2}
                onChange={(e) => handleChange(index, e)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="input3"
                placeholder="Option 3"
                value={form.input3}
                onChange={(e) => handleChange(index, e)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="input4"
                placeholder="Option 4"
                value={form.input4}
                onChange={(e) => handleChange(index, e)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <input
              type="text"
              name="answer"
              placeholder="Correct Answer"
              value={form.answer}
              onChange={(e) => handleChange(index, e)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
              

            {forms.length > 1 && (
              <button
                onClick={() => removeFormGroup(index)}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Remove Question
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-4 justify-between mt-6">
          <button
            onClick={addFormGroup}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Add Question
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Submit Quiz
          </button>
        </div>

        {savedQuizName && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-md">
            <strong>Saved Quiz Name:</strong> {savedQuizName}
          </div>
        )}
      </div>
    </div>
  );
}


export default DynamicForm;