const mongoose = require('mongoose');
const app = require('./app'); 
require('dotenv').config();


const DB_HOST = process.env.DB_HOST || 'mongodb+srv://mstefansiu:jtPKLTDsakEPCbJA@hwnode3.aq8df.mongodb.net/HwNode3?retryWrites=true&w=majority';

const PORT = process.env.PORT || 3000;

mongoose.connect(DB_HOST)
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
