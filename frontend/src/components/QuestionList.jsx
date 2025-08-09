import React from 'react';
import QuestionEditor from './QuestionEditor';

const QuestionList = ({ questions, setQuestions, handleImageUpload }) => {
  // Update a specific question in the array
  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  // Remove a question from the array
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-8 mt-8">
      {questions.map((question, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1B2637] p-6 rounded-2xl shadow-md 
                     border border-slate-200 dark:border-gray-700 
                     hover:shadow-lg transition-shadow duration-200"
        >
          <QuestionEditor
            question={question}
            index={index}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            handleImageUpload={handleImageUpload}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
