const express = require("express");
const router = express.Router();
const { addBook, updateBook, deleteBook, getBooks } = require("../controllers/bookController");
const { auth } = require("../middlewares/auth.js");

router.post('/addbook', auth, addBook);
router.put('/updatebook/:bookId', auth, updateBook); 
router.delete('/deletebook/:bookId', auth, deleteBook);
router.get('/getbooks', auth, getBooks);

module.exports = router;
