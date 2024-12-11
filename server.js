require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');


const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });
  mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err.message);
  });