const express = require("express");
const router = express.Router();
const { addBook, updateBook, deleteBook, getBooks, getBookbyId} = require("../controllers/bookController");
const { auth } = require("../middlewares/auth.js");
const {shareBook} = require("../controllers/activityController.js");

router.post('/addbook', auth, addBook);
router.put('/updatebook/:bookId', auth, updateBook); 
router.delete('/deletebook/:bookId', auth, deleteBook);
router.get('/getbooks', auth, getBooks);
router.get('/getbook/:bookId',getBookbyId);
router.post('/share/book/:bookId', auth, shareBook);



module.exports = router;
