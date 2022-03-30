const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']
        if(!token) {
         return res.status(403).send({status: false, message: `Missing authentication token in request`})
        } 

        const decodeToken = await jwt.verify(token, 'Project-Books')
        if(!decodeToken) {
            return res.status(403).send({status: false, message: `Invalid authentication token in request`})
        }

       req.userId = decodeToken.userId;

        next()
    } catch (error) {
        console.error(`Error! ${error.message}`)
        res.status(500).send({status: false, message: error.message})
    }
}

module.exports.userAuth = userAuth
