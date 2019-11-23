const { db } = require('../util/admin');

const config = require('../config');

const { validateSignupData } = require('../util/validators')

const firebase = require('firebase');
firebase.initializeApp(config);

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email, 
        username: req.body.username,
        password: req.body.password,
    };

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) {
        return res.status(400).json(errors);
    }

    let token, userId;
    db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
        if (doc.exists) {
            return res.status(400).json({ message: 'This username is already taken' });
        } else {
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((idtoken) => {
        token = idtoken; 
        const userCredentials = {
            username: newUser.username,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${ newUser.username }`).set(userCredentials);
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
}

exports.login = (req, res) => {
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
}