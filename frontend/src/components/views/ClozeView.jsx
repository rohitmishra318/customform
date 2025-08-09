import React, { useState, useEffect } from 'react';

const ClozeView = ({ question, onAnswerChange }) => {
  const [selectedBlankIndex, setSelectedBlankIndex] = useState(null);
  const [placedAnswers, setPlacedAnswers] = useState({});
  // --- NEW: State to manage the words available in the word bank ---
  const [wordBank, setWordBank] = useState(question.options || []);

  useEffect(() => {
    const finalAnswers = question.sentence.split('__BLANK__').slice(0, -1).map((_, index) => {
      return placedAnswers[index] || '';
    });
    onAnswerChange(question._id, finalAnswers);
  }, [placedAnswers, question, onAnswerChange]);

  const handleBlankSelect = (blankIndex) => {
    // If a filled blank is clicked, return its word to the word bank
    if (placedAnswers[blankIndex]) {
      const wordToReturn = placedAnswers[blankIndex];
      const newPlacedAnswers = { ...placedAnswers };
      delete newPlacedAnswers[blankIndex];
      
      setPlacedAnswers(newPlacedAnswers);
      // --- NEW: Add the word back to the word bank ---
      setWordBank(prev => [...prev, wordToReturn]);
      setSelectedBlankIndex(null);
    } else {
      // Otherwise, select the empty blank
      setSelectedBlankIndex(prev => (prev === blankIndex ? null : blankIndex));
    }
  };

  const handleWordSelect = (word, wordIndex) => {
    if (selectedBlankIndex !== null) {
      setPlacedAnswers(prev => ({
        ...prev,
        [selectedBlankIndex]: word,
      }));
      
      // --- NEW: Remove the selected word from the word bank by its index ---
      setWordBank(prev => prev.filter((_, i) => i !== wordIndex));
      setSelectedBlankIndex(null);
    }
  };

  const sentenceParts = question.sentence.split('__BLANK__');

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

      <h3 className="text-xl font-bold text-slate-200 mb-1">Complete the sentence:</h3>
      <p className="text-sm text-slate-400 mb-6">
        {selectedBlankIndex !== null
          ? 'Now, select a word from the Word Bank below.'
          : 'Click a blank space to select it.'}
      </p>

      {/* Sentence with Clickable Blanks */}
      <div className="flex flex-wrap items-center gap-x-2 text-xl mb-8 p-4 bg-slate-900/50 rounded-lg text-slate-300">
        {sentenceParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < sentenceParts.length - 1 && (
              <button
                onClick={() => handleBlankSelect(index)}
                className={`inline-block align-middle rounded-md transition-all duration-200 border-2 text-center font-semibold ${
                  selectedBlankIndex === index
                    ? 'border-indigo-400 scale-105'
                    : 'border-slate-600 border-dashed'
                }`}
                style={{ minWidth: '120px', minHeight: '44px' }}
              >
                {placedAnswers[index] ? (
                  <span className="text-indigo-300">{placedAnswers[index]}</span>
                ) : (
                  <span className="text-slate-500">...</span>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Word Bank */}
      <div className="p-4 rounded-lg border-2 border-dashed border-slate-700">
        <h4 className="font-bold text-center mb-3 text-slate-300">Word Bank</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {wordBank.length > 0 ? (
            // --- UPDATED: Map over the new 'wordBank' state ---
            wordBank.map((word, index) => (
              <button
                key={`${word}-${index}`} // Use index in key to handle duplicates
                onClick={() => handleWordSelect(word, index)} // Pass index to handler
                disabled={selectedBlankIndex === null}
                className={`p-3 rounded-md shadow-md transition-colors text-slate-200 ${
                  selectedBlankIndex !== null
                    ? 'bg-slate-700 hover:bg-slate-600 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {word}
              </button>
            ))
          ) : (
            <p className="text-slate-500">All words have been used.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClozeView;
