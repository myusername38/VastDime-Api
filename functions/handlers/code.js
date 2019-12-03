const { admin, db } = require('../util/admin');

const { validateProgramData, validateGetProgram, validateDeleteProgram, validatePrivateProgram } = require('../util/validators')

exports.addCode = (req, res) => {
    let private = false;
    let unlisted = false;
    let language = 'javascript';
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }

    const { valid, errors } = validateProgramData(req.body);

    if (!valid) {
        return res.status(400).json(errors);
    }
    if (req.body.private) {
        if (req.body.private.toString() === 'true') {
            private = req.body.private;
            unlisted = req.body.private;
        }
    } 
    if (req.body.unlisted && private.toString() === 'false') {
        if (req.body.unlisted.toString() === 'true' || req.body.unlisted.toString() === 'false') {
            unlisted = req.body.unlisted;
        }
    }
    if (req.body.language) {
        if (req.body.language === 'python') {
            language = 'python';
        } else if (req.body.language === 'java') {
            language = 'java';
        } 
    }
    let title = req.body.title.replace(/ /g,'_');
    let username = '';
    admin.auth().verifyIdToken(req.headers.token) 
    .then((decodedToken) => {
        if (!decodedToken.email_verified) {
             return res.status(400).json({ message: 'Please verify email' }); 
        }
        username = decodedToken.name;
        db.doc(`/users/${ username }/code/${ title }`)
        .set({
            title,
            program: req.body.program,
            description: req.body.description,
            language,
            unlisted,
            private,
            lastEdited: new Date().toISOString(),
        }).then(() => {
            if (unlisted.toString() === 'false') {
                db.doc(`/public/${ language }/code/${ username }-${ title }`)
                .set({
                    title, 
                    username,
                    description: req.body.description,
                    lastEdited: new Date().toISOString(),
                })
            }
        }).then(() => {
            return res.status(200).json({ message: 'worked' }); 
        })
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}

exports.getCode = (req, res) => {
    let username = req.query.username;
    let program = req.query.program;    
    db.doc(`/users/${ username }/code/${ program }`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Cannot requested document does not exist' }); 
        }
        else if (doc.data().private) {
            if (!req.headers.token) {
                return  res.status(400).json({ error: 'Cannot access privated code' }); 
            } else {
                admin.auth().verifyIdToken(req.headers.token) 
                .then((decodedToken) => {
                    if (!decodedToken.email_verified) {
                        return res.status(400).json({ message: 'Please verify email' }); 
                    }
                    if (decodedToken.name === username) {
                        return res.status(200).json({ program: doc.data() });
                    } else {
                        return res.status(400).json({ error: 'Not athorized to access this code' }); 
                    }
                })
            }
        } else if (!doc.data().private) {
            return res.status(200).json({ program: doc.data() });
        } else {
            return res.status(500).json({ error: 'Unknown server error'});
        }
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}

exports.deleteCode = (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }
   
    const { valid, errors } = validateDeleteProgram(req.query);

    let language = req.query.language;
    let title = req.query.title;

    if (!valid) {
        return res.status(400).json(errors);
    }
    let username = '';

    admin.auth().verifyIdToken(req.headers.token) 
    .then((decodedToken) => {
        if (!decodedToken.email_verified) {
            return res.status(400).json({ message: 'Please verify email' }); 
        }
        username = decodedToken.name;
        db.doc(`/users/${ username }/code/${ title }`)
        .delete()
        .then(() => {
            console.log(title);
            db.doc(`/public/${ language }/code/${ username }-${ title }`)
            .delete()
        }).then(() => {
            return res.status(200).json({ message: 'worked' }); 
        }) 
    })
    .catch((err) => {
        console.log(err);
        return res.status(400).json({ err }); 
    });
}

exports.privateCode = (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }

    const { valid, errors } = validatePrivateProgram(req.body);
    
    if (!valid) {
        return res.status(400).json(errors);
    }

    let title = req.body.title.replace(/ /g,'_');
    let data = null;
    admin.auth().verifyIdToken(req.headers.token) 
    .then((decodedToken) => {
        if (!decodedToken.email_verified) {
            return res.status(400).json({ message: 'Please verify email' }); 
        }
        username = decodedToken.name;
        db.doc(`/users/${ username }/code/${ title }`)
        .get()
        .then((doc) => {
            data = doc.data(); 
            data.private = true; 
            data.unlisted = true;
        })
        .then(() => {
            db.doc(`/users/${ username }/code/${ title }`).set(data)
            .then(() => {
                db.doc(`/public/${ data.language }/code/${ username }-${ title }`)
                .delete()
            })
            .then(() => {
                return res.status(200).json({ message: 'worked' }); 
            })
        })
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}

exports.unlistCode = (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }

    const { valid, errors } = validatePrivateProgram(req.body);
    
    if (!valid) {
        return res.status(400).json(errors);
    }

    let title = req.body.title.replace(/ /g,'_');
    let data = null;
    admin.auth().verifyIdToken(req.headers.token) 
    .then((decodedToken) => {
        if (!decodedToken.email_verified) {
            return res.status(400).json({ message: 'Please verify email' }); 
        }
        username = decodedToken.name;
        db.doc(`/users/${ username }/code/${ title }`)
        .get()
        .then((doc) => {
            data = doc.data(); 
            data.unlisted = true; 
            data.private = false;
        })
        .then(() => {
            db.doc(`/users/${ username }/code/${ title }`).set(data)
            .then(() => {
                db.doc(`/public/${ data.language }/code/${ username }-${ title }`)
                .delete()
            })
            .then(() => {
                return res.status(200).json({ message: 'worked' }); 
            })
        })
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}

exports.unPrivateCode = (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }

    let listCode = false;

    if (req.body.list) {
        if (req.body.list.toString() === 'true') {
            listCode = true;
        }
    }

    const { valid, errors } = validatePrivateProgram(req.body);
    
    if (!valid) {
        return res.status(400).json(errors);
    }

    let title = req.body.title.replace(/ /g,'_');
    let data = null;
    admin.auth().verifyIdToken(req.headers.token) 
    .then((decodedToken) => {
        if (!decodedToken.email_verified) {
            return res.status(400).json({ message: 'Please verify email' }); 
        }
        username = decodedToken.name;
        db.doc(`/users/${ username }/code/${ title }`)
        .get()
        .then((doc) => {
            data = doc.data(); 
            data.private = false; 
            data.unlisted = false;
        }).then (() => {
                db.doc(`/users/${ username }/code/${ title }`).set(data)
                .then(() => {
                if (listCode) {
                    db.doc(`/public/${ data.language }/code/${ username }-${ title }`)
                    .set({
                        title, 
                        username,
                        description: data.description,
                        lastEdited: data.lastEdited,
                    })
                }
            })
            .then(() => {
                return res.status(200).json({ message: 'worked' }); 
            })
        })
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}

exports.listCode = (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }

    const { valid, errors } = validatePrivateProgram(req.body);
    
    if (!valid) {
        return res.status(400).json(errors);
    }

    let title = req.body.title.replace(/ /g,'_');
    let data = null;
    admin.auth().verifyIdToken(req.headers.token) 
    .then((decodedToken) => {
        if (!decodedToken.email_verified) {
            return res.status(400).json({ message: 'Please verify email' }); 
        }
        username = decodedToken.name;
        db.doc(`/users/${ username }/code/${ title }`)
        .get()
        .then((doc) => {
            data = doc.data(); 
            data.unlisted = false;
            data.private = false; 
        }).then (() => {
            db.doc(`/users/${ username }/code/${ title }`).set(data)
            .then(() => {
            db.doc(`/public/${ data.language }/code/${ username }-${ title }`)
                .set({
                    title, 
                    username,
                    description: data.description,
                    lastEdited: data.lastEdited,
                })
            })
            .then(() => {
                return res.status(200).json({ message: 'worked' }); 
            })
        })
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}

exports.getPublicCode = (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }
    const params = req.query;
    let language = 'javascript';

    if (params.lang) {
        language = params.lang;
        console.log(language);
    }
    let offset = 0;
    if (req.query.offset) {
        try {
            offset = parseInt(req.query.offset);
        } catch(err) {
            return res.status(400).json({ err: 'offset must be an integer' }); 
        } 
    }

    admin.auth().verifyIdToken(req.headers.token) 
    .then(() => {
        db.collection(`/public/${ language }/code`)
        .get()
        .then(data => {
            let programs = [];
            let i = offset;
            data.forEach((doc) => {
                if (i >= offset && i < offset + 50) {
                    programs[programs.length] = doc.data();
                }
                i++;
            })
            return res.status(200).json(programs);
        })
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}

exports.getUserCode = (req, res) => {
    if (!req.headers.token) {
        return  res.status(400).json({ err: 'Must have a token' }); 
    }
    
    let offset = 0;
    if (req.query.offset) {
        try {
            offset = parseInt(req.query.offset);
        } catch(err) {
            return res.status(400).json({ err: 'offset must be an integer' }); 
        } 
    }

    admin.auth().verifyIdToken(req.headers.token) 
    .then((decodedToken) => {
        db.collection(`/users/${ decodedToken.name }/code`)
        .get()
        .then(data => {
            let programs = [];
            let i = 0;
            data.forEach(p => {
                if (i >= offset && i < offset + 50) {
                    programs[programs.length] = p.data();
                }
                i++;
            })
            return res.status(200).json(programs);
        })
    })
    .catch((err) => {
        return res.status(400).json({ err }); 
    });
}
