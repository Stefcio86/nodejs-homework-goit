const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .message('Phone number must be in the format (123) 456-7890')
    .required(),
});

module.exports = {
  contactSchema,
};
