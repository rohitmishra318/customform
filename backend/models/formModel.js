const mongoose = require('mongoose');
const { Schema } = mongoose;

// This is a sub-schema for individual questions within a form
const questionSchema = new Schema({
  type: {
    type: String,
    enum: ['Categorize', 'Cloze', 'Comprehension'],
    required: true,
  },
  questionText: String,
  image: String, // URL for an optional image for the question

  // --- Fields specific to 'Categorize' questions ---
  categories: [String],
  items: [{
    text: String,
    category: String,
  }],

  // --- Fields specific to 'Cloze' questions ---
  sentence: String, // The sentence with placeholders
  options: [String], // The options for the blanks

  // --- Fields specific to 'Comprehension' questions ---
  passage: String,
  mcqs: [{
    question: String,
    options: [String],
    correctAnswer: String,
  }],
});

const formSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  headerImage: String, // URL for the form's header image
  questions: [questionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);