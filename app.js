const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public'))); // Obsługa plików statycznych



app.use(express.static('public'));


app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
