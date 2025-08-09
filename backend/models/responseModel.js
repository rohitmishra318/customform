const mongoose = require('mongoose');
const { Schema } = mongoose;

const responseSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form', // This creates a reference to the Form model
    required: true,
  },
  answers: [{
    questionId: Schema.Types.ObjectId,
    answer: Schema.Types.Mixed, // Using Mixed to store various answer formats
  }],
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);