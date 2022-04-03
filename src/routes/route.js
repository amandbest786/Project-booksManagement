const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const bookController = require("../controllers/bookController.js");
const reviewController = require("../controllers/reviewController.js");
const middleware = require("../middlewares/middleware.js");
const aws = require("aws-sdk");

//....................aws................................

aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    }
)

let uploadFile = async (file) => {
    return new Promise( function(resolve, reject) {
      
        let s3 = new aws.S3({ apiVersion: "2006-03-01" })
    
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", 
            Key: "Bookcover/" + file.originalname,
            Body: file.buffer
        }
console.log(uploadFile)
      s3.upload(uploadParams, function (err, data) {
            if (err) { 
                return reject({ "error": err }) 
            }
            return resolve(data.Location) 
          }
        )
    }
    )
}

router.post("/write-file-aws", async function (req, res) {
    try {
        let files = req.files
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
}
)

//user API's
router.post("/register", userController.createUser); // CreateUser
router.post("/login", userController.login); // LoginUser

//book API's
router.post("/books", middleware.userAuth, bookController.createBook); // CreateBook
router.get("/books", middleware.userAuth, bookController.getBooksbyquery); //GetBooks
router.post("/books/:bookId", bookController.createBookCover); //createBookCover
router.get("/books/:bookId", middleware.userAuth, bookController.getBooksById); //GetBooksbyID
router.put("/books/:bookId", middleware.userAuth, bookController.updateBooks); //UpdateBooks
router.delete("/books/:bookId", middleware.userAuth, bookController.deleteBooks); //DeleteBooksbyID

//Review API's
router.post("/books/:bookId/review", reviewController.createReview); //CreateReview
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview); //UpdateReview
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview); //DeleteReview

module.exports = router;