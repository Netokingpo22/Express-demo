const express = require('express');
const router = express.Router();

const { getContacts, getContact, postContact, putContact, deleteContact } = require('../controller/contacController');
const validateToken = require('../middleware/validateTokenHandler');

// Middleware to validate token for all routes
router.use(validateToken);

// Routes for contacts
router.route('/')
    .get(getContacts)  // Get all contacts
    .post(postContact); // Create a new contact

router.route('/:id')
    .get(getContact)    // Get a specific contact by ID
    .put(putContact)    // Update a specific contact by ID
    .delete(deleteContact); // Delete a specific contact by ID

module.exports = router;