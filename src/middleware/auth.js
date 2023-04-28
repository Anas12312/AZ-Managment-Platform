const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Aurhorization');
        const decoded = jwt.verify(token, process.env.SECRET)
        
    } catch (error) {
        res.status(401).send({ error: 'User not authorized' })
    }
}

module.exports = auth;