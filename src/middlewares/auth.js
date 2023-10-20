function auth(req, res, next){
    if(req.session.userLogged){
        return res.redirect('/projects')
    }
    next()
}

module.exports= auth;