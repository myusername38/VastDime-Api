const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp({
    databaseURL: "https://bubblelocatorapi.firebaseio.com",
    credential: admin.credential.cert ({ 
        project_id: "vastdime-4c82c", 
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDK9bLQdZxji8DF\nJ03txpjb5mZIKjrLV0d3Ys/uGrpFv/2VjJZ45u3tAo+OkBKWEQ/zEqAzjxG+S9Lb\nupZu06qgGVRVwVmKaypN4ykwpjZ/voKw7Gr9dFN0b2p2P1vsGrT3WMlO/k43up9s\nzaXbtOsNAZJCtEhlOaGk6+CZaSVqWvutWe8ZCCmaOQpQ8hKui5Aw099JnFIxyzKc\nbqTQyf9BvdUjEps4fB7J+lnNRRHRBrbjD2VVDr9KcR4wx9ZsyMVz6MuSIiXjB4Lu\nTauVDOEPKFyjDsqJ7qJGzfootZOyNhKaYe29IhLTw46mjE2cZ14kIRZoeS7vNDGk\nYHKs00YBAgMBAAECggEAA7LEicD7jZf7oOQRgEBm4z/rKSFliEnHJmU6rSfXxoME\nJGGHJugXWbhQRHHlOCPoCV7+JBO1SC/3xUj8v4N+zRN1FSnJ1Mhqi+LfKpD8ISmy\nq4sSpoXEKl+diM7TVnBZ+pVdDWH71nm242Z1FqAw9cqrlH4A6+DyrE+KMdAdOPdB\nPDkGt2PmKQTXUK1Wgtgiyt1njvhWisRd/kfBAxGAoqRq/pDT7B89D0/OWjzEM1pU\nCQMXKEIjAqHMYczfDZIdShSZAcLQADYjaM8lP1AIe5szqFyoZEHANagrLuC6MpsR\nrmcZSs1qx898VKJIS7nqylm1mahujCsqplPfVU0UIQKBgQDkVZ4qYkQne4JcjZ7d\nuQJXAHZv1IC0NvYcP69qflkh8e09+6gFHHLU295CMygkMJ2VliLbanr/ZtQI9W2o\nRijAb9uj5fUY5NJ/7eYT+9BY/nJCcAu5X/no8PNuZSaDBaxdb+y0Wd3zI6ISHH8f\nm6p/EvRNbKqlCd1SWQVwkUKpsQKBgQDjjQTxhps7WNV1UVsLZ3V9dwdI6nzSSjQl\n/QzWe4ZkQI50lzPjrUNMgnaXeyWmdSooHTWHy85QDCuQKyhoKu4dgFZqE5f5IcxN\ng78xrPOnjnF3RBW5qFTACUm0Bz8yZrjKC8Uh+KvjC2dHFRk1U0S5NaKpjbaJ+0Qi\n2SoCL8UlUQKBgDGuv3+Rair9INxqpEqyWuP7YcnrfyW3X829vbl6TIKqVWjLPT//\ndK0EOlRFNVLKkT9fL652eNTh1vksDfQzb+KPdEcxXidQgsz7QrjObgMvOkVig+qO\nC5637v/yWnLf5SVfmS2U8EpbUoSGVtLV2D9WLHo8TtUiVFn6rMhVkx/BAoGAKCQT\nUCwHrENyfFyaq/tXPYfG0DUVSd9vLZhjMF7gCUVeG/EkZTCGY7PMCdLehGu8wRDO\nBaONRI+xC6ChYybXlHq0Q8grEfbFXJM2IiQ5Y0B8gaaQEo1AThQVXV295z05seK7\nps+AOvAjCuYM6VxEDkwI4tIt9k9N6LvYbkRRCdECgYEA117ahvdlu/mA3mZTLHDn\nUPga/PjJZzRCgFDTbuDHp22FawFmSE/F1KDziWzldBke3S7z9i07yXHeeNKC1hgm\nxWBQd7GTIe0mK7AxbiLWba+TDmmouQtnX91pWPHXinFJppMwyKEb+N5VZR9NASqU\nHVkuVwTdTPKgHmUsD8GRSiE=\n-----END PRIVATE KEY-----\n", 
       client_email: "firebase-adminsdk-fezv4@vastdime-4c82c.iam.gserviceaccount.com", 
    }) 
});

const config = {
    apiKey: "AIzaSyCkOq0dlnVWuGUbsTVsT2ALebm5knHhJPs",
    authDomain: "vastdime-4c82c.firebaseapp.com",
    databaseURL: "https://vastdime-4c82c.firebaseio.com",
    projectId: "vastdime-4c82c",
    storageBucket: "vastdime-4c82c.appspot.com",
    messagingSenderId: "709383972185",
    appId: "1:709383972185:web:0a45b9adbec795e6e31848",
    measurementId: "G-KWRH3DFWG8"
};

const express = require('express');
const app = express();

const firebase = require('firebase');

firebase.initializeApp(config);

const db = admin.firestore();

app.use(cors());

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

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    let errors = {};
    if(isEmpty(user.email)){
        errors.email = 'Must not be empty';
    } 
    if(isEmpty(user.password)) {
        errors.password = 'Must not be empty';
    } 
    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    } 
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        
        return res.json({ token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({ general: 'Wrong credentials, please try again' });
        } else return res.status(500).json({ error: err.code });
    });
});

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password,
    };
    let errors = {};
    let token, userId;
    if (isEmpty(newUser.email)) {
        errors.email = 'Email must not be empty'
    } else if (!isEmail(newUser.email)){
        errors.email = 'Must be a valid email address'
    } 
    if (Object.keys(errors).length > 0){
        return res.status(400).json(errors);
    } 
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idtoken => {
        token = idtoken; 
        const userCredentials = {
            email: newUser.email,
            password: newUser.password,
            createdAt: new Date().toISOString(),
            userId
        };
    }) 
    .then(() => {
        return res.status(201).json({ token })
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({ message: 'Email is already in use'});    
        } else {
        return res.status(500).json({ error: err.code });
        } 
    });
}); 

const isEmail = (email) => {
   const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if(email.match(regEx)) return true;
   else return false;
}

const isEmpty = (s) => {
    if (s.trim() === '') return true;
    else return false;
}

exports.api = functions.https.onRequest(app);
