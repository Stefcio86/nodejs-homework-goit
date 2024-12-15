const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, BASE_URL } = process.env;

if (!SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in .env file');
}

sgMail.setApiKey(SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const verificationLink = `${BASE_URL || 'http://localhost:3000'}/api/users/verify/${verificationToken}`;
    const msg = {
      to: email,
      from: 'mstefansiu@gmail.com',
      subject: 'Email Verification',
      html: `<p>To verify your email, click on the link below:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    };

    await sgMail.send(msg);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    throw new Error('Unable to send verification email');
  }
};

module.exports = { sendVerificationEmail };
