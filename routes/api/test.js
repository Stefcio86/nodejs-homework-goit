const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/db-check', async (req, res) => {
  try {
    
    const dbState = mongoose.connection.readyState;
    const status = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    res.status(200).json({ databaseStatus: status[dbState] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
