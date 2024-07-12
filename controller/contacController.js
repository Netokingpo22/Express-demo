const AsyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@router GET /api/contacts
//@access private
const getContacts = AsyncHandler(async (req, res) => {
    const c = await Contact.find({ user_id: req.user.id });
    res.status(200).json(c);
})

//@desc Get contact
//@router GET /api/contacts/:id
//@access private
const getContact = AsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Contact is not valid for user');
    }
    res.status(200).json(contact);
});

//@desc Post contact
//@router POST /api/contacts
//@access private
const postContact = AsyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const c = await Contact.create({
        name, email, phone, user_id: req.user.id
    })
    res.status(201).json(c);
})

//@desc Put contact
//@router PUT /api/contacts/:id
//@access private
const putContact = AsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Contact is not valid for user');
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
})

//@desc Delete contact
//@router DELETE /api/contacts/:id
//@access private
const deleteContact = AsyncHandler(async (req, res) => {
    const contact = await await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Contact is not valid for user');
    }
    await Contact.findOneAndDelete(req.params.id)
    res.status(200).json(contact);
})

module.exports = { getContacts, getContact, postContact, putContact, deleteContact }