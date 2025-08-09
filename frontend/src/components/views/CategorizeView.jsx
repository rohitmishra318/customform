import React, { useState, useEffect } from 'react';

const CategorizeView = ({ question, onAnswerChange }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    onAnswerChange(question._id, assignments);
  }, [assignments, question._id, onAnswerChange]);

  const handleItemSelect = (itemId) => {
    setSelectedItemId(prev => (prev === itemId ? null : itemId));
  };

  const handleCategorySelect = (categoryName) => {
    if (selectedItemId) {
      setAssignments(prev => ({
        ...prev,
        [selectedItemId]: categoryName,
      }));
      setSelectedItemId(null);
    }
  };

  const unassignedItems = question.items.filter(item => !assignments[item._id]);

  return (
    <div className="bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700">
      {/* Display Question Image if available */}
      {question.image && (
        <img
          src={question.image}
          alt="Question context"
          className="w-full rounded-lg mb-6 max-h-80 object-cover"
        />
      )}

      <h3 className="text-xl font-bold text-slate-200 mb-1">Categorize the following items:</h3>
      <p className="text-sm text-slate-400 mb-6">
        {selectedItemId
          ? 'Now, click on a category below to assign it.'
          : 'Click on an item to select it.'}
      </p>

      {/* Unassigned Items Pool */}
      <div className="p-4 rounded-lg bg-slate-900/50 mb-6">
        <h4 className="font-bold mb-3 text-center text-slate-300">Items to Categorize</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {unassignedItems.length > 0 ? (
            unassignedItems.map(item => (
              <button
                key={item._id}
                onClick={() => handleItemSelect(item._id)}
                className={`p-3 rounded-md shadow-md transition-transform duration-200 text-slate-200 ${
                  selectedItemId === item._id
                    ? 'bg-indigo-500 text-white scale-110'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {item.text}
              </button>
            ))
          ) : (
            <p className="text-slate-500">All items have been categorized!</p>
          )}
        </div>
      </div>

      {/* Category Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {question.categories.map(category => (
          <div
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedItemId
                ? 'cursor-pointer border-dashed border-indigo-400 hover:bg-slate-700/50'
                : 'border-solid border-slate-700'
            }`}
            style={{ minHeight: '150px' }}
          >
            <h4 className="font-bold mb-4 text-center text-slate-300">{category}</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {question.items
                .filter(item => assignments[item._id] === category)
                .map(assignedItem => (
                  <div
                    key={assignedItem._id}
                    className="p-2 rounded-md bg-green-500/20 text-green-300 text-sm font-semibold"
                  >
                    {assignedItem.text}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorizeView;
