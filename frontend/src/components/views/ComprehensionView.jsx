import React from 'react';

const ComprehensionView = ({ question, onAnswerChange }) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700">
      {/* Display Question Image if it exists */}
      {question.image && (
        <img
          src={question.image}
          alt="Question context"
          className="w-full rounded-lg mb-6 max-h-80 object-cover"
        />
      )}
      
      <h3 className="text-xl font-bold text-slate-200 mb-4">
        Read the passage and answer the questions below:
      </h3>

      {/* --- NEW: Render Content Blocks for Dark Mode --- */}
      <div className="space-y-6 mb-6 prose prose-invert max-w-none">
        {(question.passage_blocks || []).map((block, index) => {
          if (block.type === 'text') {
            // The 'prose-invert' class will style the text for dark mode
            return <p key={index}>{block.content}</p>;
          }
          if (block.type === 'image') {
            return <img key={index} src={block.url} alt={`Passage image ${index + 1}`} className="w-full rounded-lg" />;
          }
          return null;
        })}
      </div>

      {/* --- MCQ Section Styled for Dark Mode --- */}
      {question.mcqs && question.mcqs.map((mcq) => (
        <div key={mcq._id} className="mb-4 pt-4 border-t border-slate-700">
          <p className="font-semibold text-slate-300 mb-2">{mcq.question}</p>
          <div className="space-y-2">
            {mcq.options.map((option, optIndex) => (
              <label
                key={optIndex}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer border border-transparent has-[:checked]:bg-indigo-900/50 has-[:checked]:border-indigo-500 transition-colors"
              >
                <input
                  type="radio"
                  name={mcq._id}
                  value={option}
                  onChange={(e) => onAnswerChange(mcq._id, e.target.value)}
                  className="form-radio h-5 w-5 text-indigo-500 bg-slate-600 border-slate-500 focus:ring-indigo-500"
                />
                <span className="text-slate-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComprehensionView;
