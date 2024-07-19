const AsyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = AsyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

// @desc    Get a contact by ID
// @route   GET /api/contacts/:id
// @access  Private
const getContact = AsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Unauthorized access');
    }
    res.status(200).json(contact);
});

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
const postContact = AsyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const newContact = await Contact.create({
        name, email, phone, user_id: req.user.id
    });
    res.status(201).json(newContact);
});

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const putContact = AsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Unauthorized access');
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = AsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Unauthorized access');
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact deleted successfully' });
});

module.exports = { getContacts, getContact, postContact, putContact, deleteContact };