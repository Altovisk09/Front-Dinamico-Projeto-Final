const viewController = {
    index: (req, res) => {
        res.render('index')
    },
    signup: (req, res) => {
        res.render('signup')
    }
}

module.exports = viewController;