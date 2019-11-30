const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}
 
const isEmpty = (s) => {
    if (s.trim() === '') return true;
    else return false;
}

exports.validateSignupData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Email must not be empty'
    } else if (isEmpty(data.username)) {
        errors.username = 'Username must not be empty'
    } else if (!isEmail(data.email)){
        errors.email = 'Must be a valid email address'
    } else if (isEmpty(data.username)) {
        errors.username = 'Username must not be empty'
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateProgramData = (data) => {
    let errors = {};
    if (!data.title) {
        errors.title = 'Program must have a title';
    } else if (isEmpty(data.title)) {
        errors.title = 'Program title must not be emtpy';
    } else if (!data.program) {
        errors.program = 'Must have a program'
    } else if (isEmpty(data.program)) {
        errors.program = 'Program cannot be empty'
    } else if (!data.description) {
        errors.description = 'Must have a description'
    } else if (isEmpty(data.description)) {
        errors.description = 'Description cannot be empty'
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateGetProgram = (data) => {
    let errors = {};
    if (!data.title) {
        errors.title = 'Program must have a title';
    } else if (isEmpty(data.title)) {
        errors.title = 'Program title must not be emtpy';
    } else if (!data.program) {
        errors.program = 'Must have a program'
    } else if (isEmpty(data.program)) {
        errors.program = 'Program cannot be empty'
    } 
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateDeleteProgram = (data) => {
    let errors = {};
    if (!data.title) {
        errors.title = 'Must have a program title';
    }
    if (isEmpty(data.title)) {
        errors.title = 'Program title must not be emtpy';
    }
    if (!data.language) {
        errors.language = 'Must have a language';
    }
    if (isEmpty(data.language)) {
        errors.language = 'Language cannot be blank';
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validatePrivateProgram = (data) => {
    let errors = {};
    if (!data.title) {
        errors.title = 'Must have a program title';
    }
    if (isEmpty(data.title)) {
        errors.title = 'Program title must not be emtpy';
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}
