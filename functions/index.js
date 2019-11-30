const functions = require('firebase-functions');


const cors = require('cors');

const { signup, login } = require('./handlers/users');
const { addCode, getCode, deleteCode, privateCode, unlistCode, listCode, unPrivateCode, getPublicCode, getUserCode } = require('./handlers/code');

const express = require('express');
const app = express();


app.use(cors());

// users routes
app.post('/login', login);
app.post('/signup', signup);

app.get('/getpubliccode', getPublicCode);
app.post('/addcode', addCode);
app.get('/getcode', getCode);
app.delete('/deletecode', deleteCode);
app.get('/getusercode', getUserCode);
app.put('/privatecode', privateCode);
app.put('/unlistcode', unlistCode);
app.put('/unprivatecode', unPrivateCode);
app.put('/listCode', listCode);


exports.api = functions.https.onRequest(app);
