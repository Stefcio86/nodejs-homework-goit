const express = require('express');
const Joi = require('joi');
const { listContacts, getContactById, addContact, removeContact, updateContact } = require('../../models/contacts');

const router = express.Router();


const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
});


router.get('/', async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get('/:contactId', async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) return res.status(404).json({ message: 'Not found' });
  res.status(200).json(contact);
});


router.post('/', async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ message: `missing required ${error.details[0].context.key} - field` });
  
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});


router.delete('/:contactId', async (req, res) => {
  const removedContact = await removeContact(req.params.contactId);
  if (!removedContact) return res.status(404).json({ message: 'Not found' });
  res.status(200).json({ message: 'contact deleted' });
});

router.put('/:contactId', async (req, res) => {
  if (Object.keys(req.body).length === 0) return res.status(400).json({ message: 'missing fields' });

  const updatedContact = await updateContact(req.params.contactId, req.body);
  if (!updatedContact) return res.status(404).json({ message: 'Not found' });
  res.status(200).json(updatedContact);
});

module.exports = router;
