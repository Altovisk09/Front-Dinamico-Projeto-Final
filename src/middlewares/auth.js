function authenticated(req, res, next){
    if(req.session.userLogged){
       return next()    
    }
    res.redirect('/projects')
};

module.exports = authenticated;