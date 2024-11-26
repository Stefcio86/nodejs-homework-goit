const Contact = require('./contact'); 
const { contactSchema } = require('./validation'); 

const listContacts = async () => {
  return await Contact.find(); 
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const addContact = async ({ name, email, phone }) => {
  
  const { error } = contactSchema.validate({ name, email, phone });
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
  }

  
  const duplicate = await Contact.findOne({ $or: [{ name }, { phone }] });
  if (duplicate) {
    throw new Error('Contact with this name or phone number already exists');
  }

  return await Contact.create({ name, email, phone });
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

const updateContact = async (contactId, body) => {
  
  const { error } = contactSchema.validate(body);
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
  }

  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatusContact = async (contactId, { favorite }) => {
  if (typeof favorite !== 'boolean') {
    throw new Error('Validation error: "favorite" must be a boolean');
  }

  return await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
