// Import our models
const Form = require('../models/formModel');
const Response = require('../models/responseModel');

// Controller function to create a new form
const createForm = async (req, res) => {
  try {
    const newForm = new Form(req.body);
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ message: 'Error creating form', error: error.message });
  }
};

// Controller function to get a specific form by its ID
const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching form', error: error.message });
  }
};

// Controller function to submit a response for a form
const createResponse = async (req, res) => {
  try {
    const newResponse = new Response({
      formId: req.params.formId,
      answers: req.body.answers,
    });
    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting response', error: error.message });
  }
};

// Export the controller functions
module.exports = {
  createForm,
  getFormById,
  createResponse,
};