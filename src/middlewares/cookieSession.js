const Users = require('../models/Users');

function sessionValidation(req, res, next) {
    const userFromSession = req.session.user ? req.session.user.email : null;
    const userFromCookie = req.cookies.logMail;

    if (userFromCookie) {
        let userValid = Users.findUserByfield('email', userFromCookie);
        delete userValid.password;
        if(userValid){
            res.locals.isLogged = true;
            res.locals.userValid = userValid;
        }else{
            res.locals.isLogged = false;
        }
    } else {
        if(userFromSession){
            let userValid = Users.findUserByfield('email', userFromSession);
            res.locals.isLogged = true;
            res.locals.userValid = userValid;
        }else{
            res.locals.isLogged = false;
        }
    }
    next()
}

module.exports = sessionValidation;