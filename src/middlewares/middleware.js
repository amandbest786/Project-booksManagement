const jwt = require('jsonwebtoken');

let authentication = async function(req, res, next){        //authentication for the token validation. 
    try{
        let token = req.headers['x-api-key']        //header
        if (!token){
            return res.status(400).send({ msg: "Token must be present" });      //validating the token is present in headers or not.
        }
        next()         //if token is present then move to the next
    }
    catch (err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

let authorizationToCreate = async function(req, res, next){         //authorization for the authorized user
    try {
        const token = req.headers['x-api-key']      //header
        const decodedToken = jwt.verify(token, "Project-Books");        //verify the secret key
        const userLoggedIn = decodedToken._id       //decode token by checking the userId
        const userIdFromBody = req.body.userId      
        if (userLoggedIn !== userIdFromBody) return res.status(403).send("You are not autherised to access.")    //similar user or not
        next()      //if token is for the same user then move to the next

    }
    catch (err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

let authorization = async function(req, res, next){         //authorization for the authorized user
    try {
        const token = req.headers['x-api-key']      //header
        const decodedToken = jwt.verify(token, "Project-Books");        //verify the secret key
        const userLoggedIn = decodedToken._id       //decode token by checking the userId
        const bookId = req.params.bookId
        const findBook = await bookModel.findById(bookId)       //finding the bookId in bookModel
        const userIdFromBook = findBook.userId.toString()    //converting UserId into Strings
        if (userLoggedIn !== userIdFromBook) return res.status(403).send("You are not autherised to access.")      //similar user or not
        next()       //if token is for the same user then move to the next

    }
    catch (err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

module.exports.authentication = authentication
module.exports.authorization = authorization
module.exports.authorizationToCreate = authorizationToCreate