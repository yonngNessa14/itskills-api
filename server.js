const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const path = require('path');
const passport = require('passport');
require('./models/Users');
const authRoute = require('./routes/authRoutes');
require('./services/passport');


const app = express();
app.use(express.json());

app.use(cors());

mongoose.connect(keys.mongoDbKey, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("mongoDB connected successfully");
})
app.use(passport.initialize());

app.use('/auth', authRoute);


app.get('/api', (req, res) => {
    res.send({ message: 'hello Mr Nelson' });
})


const PORT = process.env.PORT || 5000;

app.listen(PORT);





