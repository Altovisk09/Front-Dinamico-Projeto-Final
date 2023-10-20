const viewController = {
    index: (req, res) => {
        res.render('index')
    },
    singup: (req, res) => {
        res.render('singup')
    }
}

module.exports = viewController;