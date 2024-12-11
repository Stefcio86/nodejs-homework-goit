const express = require('express');
const auth = require('../../middlewares/auth'); 
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../models/contact');

const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const contacts = await listContacts(req.user._id);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:contactId', auth, async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user._id);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const newContact = await addContact(req.body, req.user._id);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/:contactId', auth, async (req, res) => {
  try {
    const removedContact = await removeContact(req.params.contactId, req.user._id);
    if (!removedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:contactId', auth, async (req, res) => {
  try {
    const updatedContact = await updateContact(req.params.contactId, req.body, req.user._id);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.patch('/:contactId/favorite', auth, async (req, res) => {
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: 'missing field favorite' });
  }

  try {
    const updatedContact = await updateStatusContact(req.params.contactId, favorite, req.user._id);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
