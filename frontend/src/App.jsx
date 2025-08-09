import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormBuilder from './pages/FormBuilder';
import FormFiller from './pages/FormFiller'; // 1. Import this

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<FormBuilder />} />
          
          {/* 2. Uncomment this route */}
          <Route path="/form/:formId" element={<FormFiller />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;