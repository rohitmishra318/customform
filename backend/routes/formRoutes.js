const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  createForm,
  getFormById,
  createResponse,
} = require('../controllers/formController');

// --- Form Routes ---
// POST /api/forms -> To create a new form
router.post('/forms', createForm);

// GET /api/forms/:id -> To get a specific form
router.get('/forms/:id', getFormById);

// --- Response Route ---
// POST /api/forms/:formId/responses -> To submit a response
router.post('/forms/:formId/responses', createResponse);

module.exports = router;