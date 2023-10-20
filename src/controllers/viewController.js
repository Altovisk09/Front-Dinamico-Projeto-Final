const viewController = {
    index: (req, res) => {
        res.render('index')
    },
    signup: (req, res) => {
        res.render('signup')
    },
    signin: (req, res) => {
        res.render('signin')
    },
    logged: (req, res) => {
        res.render('projects')
    }
}

module.exports = viewController;