function notAuthenticated(req, res, next){
    if(!req.session.userLogged){
        return next()
    }
    res.redirect('/signup')
};

module.exports = notAuthenticated;