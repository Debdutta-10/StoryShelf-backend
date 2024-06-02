const express = require("express");
const router = express.Router();
const { addBook, deleteBook, getBooks } = require("../controllers/bookController");
const {auth} = require("../middlewares/auth.js")

router.post('/addbook', auth, addBook);
router.get('/getbooks', auth, getBooks);
router.delete('/deletebook/:bookId',auth, deleteBook); 

module.exports = router;
