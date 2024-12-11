const Contact = require('./contact');

const listContacts = async (userId) => {
  return await Contact.find({ owner: userId });
};

const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, owner: userId });
};

const addContact = async (data, userId) => {
  return await Contact.create({ ...data, owner: userId });
};

const removeContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, owner: userId });
};

const updateContact = async (contactId, data, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    data,
    { new: true }
  );
};

const updateStatusContact = async (contactId, favorite, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
