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