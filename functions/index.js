const functions = require('firebase-functions');

const cors = require('cors');

const { signup, login } = require('./handlers/users');

const express = require('express');
const app = express();


app.use(cors());

// users routes
app.post('/login', login);
app.post('/signup', signup);

app.post('/testToken', (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }
    admin.auth().verifyIdToken(req.headers.token)
    .then((decodedToken) => {
        return res.status(200).json({ token: decodedToken }); 
    })
    .catch((err) => {
        return res.status(401).json({ err }); 
    });
});




exports.api = functions.https.onRequest(app);
