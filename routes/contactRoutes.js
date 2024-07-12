const express = require('express');
const router = express.Router();

const { getContacts, getContact, postContact, putContact, deleteContact } = require('../controller/contacController')
const ValidateToken = require('../middleware/validateTokenHandler');

router.use(ValidateToken);
router.route('/').get(getContacts).post(postContact);
router.route('/:id').get(getContact).put(putContact).delete(deleteContact);

module.exports = router;