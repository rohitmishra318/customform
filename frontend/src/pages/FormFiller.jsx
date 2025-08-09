import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';

// Import the view components
import ComprehensionView from '../components/views/ComprehensionView';
import CategorizeView from '../components/views/CategorizeView';
import ClozeView from '../components/views/ClozeView';

const FormFiller = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/forms/${formId}`);
                setForm(response.data);
                console.log("Form Data Received:", response.data); 
            } catch (err) {
                setError('Failed to load the form. Please check the URL or make sure the form exists.');
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [formId]);

    const handleAnswerChange = useCallback((questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    }, []);

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer,
            }));
            await axios.post(`http://localhost:5000/api/forms/${formId}/responses`, {
                answers: formattedAnswers,
            });
            setIsSubmitted(true);
        } catch (err) {
            alert('Failed to submit your response.');
            console.error('Submission error:', err);
        }
    };

    if (loading) {
        return <p className="text-center mt-20 text-lg text-slate-400">Loading Form...</p>;
    }
    
    if (error) {
        return <p className="text-center mt-20 text-lg text-red-400">{error}</p>;
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
                <Confetti width={width} height={height} recycle={false} />
                <div className="bg-slate-800/80 backdrop-blur-lg p-10 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg mx-auto border border-slate-700">
                    <svg className="w-24 h-24 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h1 className="text-4xl font-bold text-slate-100 mt-6 mb-2">Submission Received!</h1>
                    <p className="text-lg text-slate-400 mb-8">Thank you for your time. Your response has been recorded.</p>
                    <Link 
                        to="/" 
                        className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Create Another Form
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
            {/* --- Decorative Background Blobs --- */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

            <header className="bg-slate-900/70 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-slate-700">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        FormCraft
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-4 sm:p-8 relative z-0">
                <div className="space-y-8">
                    <div className="bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
                        {form.headerImage && (
                            <img
                                src={form.headerImage}
                                alt={form.title}
                                className="w-full h-56 object-cover rounded-lg mb-6"
                            />
                        )}
                        <h1 className="text-4xl font-bold text-slate-100">{form.title}</h1>
                        <p className="text-lg text-slate-400 mt-2">Fill out the form below.</p>
                    </div>
                    
                    {form.questions.map((question) => {
                        switch (question.type) {
                            case 'Comprehension':
                                return <ComprehensionView key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                            case 'Categorize':
                                return <CategorizeView key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                            case 'Cloze':
                                return <ClozeView key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                            default:
                                return <p key={question._id} className="text-center text-red-400">Unsupported question type.</p>;
                        }
                    })}

                    <div className="text-center pt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-10 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Submit Response
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FormFiller;
