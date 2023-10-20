function notAuth(req, res, next){
    if(!req.session.userLogged){
        return res.redirect('/signup')
    }
    next()
}

module.exports= notAuth;