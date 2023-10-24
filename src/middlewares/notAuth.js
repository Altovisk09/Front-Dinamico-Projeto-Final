function notAuth(req, res, next){
    if(!req.session.userLogged){
        return res.redirect('/signin')
    }
    next()
}

module.exports= notAuth;