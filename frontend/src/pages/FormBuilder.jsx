import React, { useState } from 'react';
import axios from 'axios';
import QuestionList from '../components/QuestionList';

// --- Helper Icon Components (Updated stroke for dark mode) ---
const IconSave = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;


const FormBuilder = () => {
    const [title, setTitle] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [savedFormLink, setSavedFormLink] = useState('');

    // --- NEW: Read Cloudinary config from environment variables ---
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // All functions (handleImageUpload, etc.) remain the same.
    const handleImageUpload = async (file) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );
            setIsUploading(false);
            return response.data.secure_url;
        } catch (error) {
            console.error('Image upload failed:', error);
            setIsUploading(false);
            return null;
        }
    };

    const onHeaderImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) {
                setHeaderImage(imageUrl);
            }
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { type: 'Categorize', questionText: '' },
        ]);
    };

    const handleSaveForm = async () => {
        if (!title) {
            alert('Please enter a form title.');
            return;
        }
        try {
            const formStructure = { title, headerImage, questions };
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/forms`, formStructure);
            const link = `${window.location.origin}/form/${response.data._id}`;
            setSavedFormLink(link);
        } catch (error) {
            console.error('Error saving form:', error);
            alert('Failed to save the form. Check the console for details.');
        }
    };
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(savedFormLink);
        alert('Link copied to clipboard!');
    };


    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
            {/* --- Decorative Background Blobs for Dark Mode --- */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

            {/* --- App Header for Dark Mode --- */}
            <header className="bg-slate-900/70 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-slate-700">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        FormCraft
                    </h1>
                    <button
                        onClick={handleSaveForm}
                        disabled={isUploading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-lg transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed shadow-md"
                    >
                        <IconSave />
                        {isUploading ? 'Uploading...' : 'Save Form'}
                    </button>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="max-w-4xl mx-auto p-4 sm:p-8 relative z-0">
                {savedFormLink ? (
                    // --- Enhanced "Form Saved" Card for Dark Mode ---
                    <div className="p-8 bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl text-center border border-slate-700">
                        <svg className="w-24 h-24 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="text-3xl font-bold mt-6 mb-2 text-slate-100">Form Saved!</h2>
                        <p className="text-slate-400 mb-6">Your form is live. Share the link below with your audience.</p>
                        <div className="flex items-center justify-between mt-2 p-3 bg-slate-900 border border-slate-600 rounded-lg">
                            <a href={savedFormLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-semibold truncate">
                                {savedFormLink}
                            </a>
                            <button onClick={copyToClipboard} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold p-2 rounded-lg ml-4 transition-transform transform hover:scale-110">
                                <IconCopy />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* --- Form Title & Header Card for Dark Mode --- */}
                        <div className="bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700">
                            <input
                                type="text"
                                placeholder="Form Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-4xl font-bold border-none focus:ring-0 p-0 mb-6 bg-transparent placeholder-slate-500"
                            />
                            <div className="h-px bg-slate-700 my-4"></div>
                            <label className="block text-lg font-medium text-slate-300 mb-2">Header Image</label>
                            {headerImage && (
                                <img
                                    src={headerImage}
                                    alt="Form Header"
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                            )}
                            <input
                                type="file"
                                onChange={onHeaderImageChange}
                                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-900/50 file:text-indigo-300 hover:file:bg-indigo-900 cursor-pointer"
                            />
                            {isUploading && <p className="text-blue-400 text-sm mt-2">Uploading...</p>}
                        </div>

                        <QuestionList
                            questions={questions}
                            setQuestions={setQuestions}
                            handleImageUpload={handleImageUpload}
                        />

                        <div className="flex justify-center mt-8">
                            <button
                                onClick={addQuestion}
                                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                <IconPlus />
                                Add Question
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FormBuilder;
