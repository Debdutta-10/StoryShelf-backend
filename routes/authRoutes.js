const express = require("express");
const router = express.Router();
const {signupUser,loginUser,getUserById} = require("../controllers/userController");
const {auth} = require("../middlewares/auth.js")
router.post('/signup',signupUser);
router.post('/login',loginUser);
router.get('/getuserbyid/:userId', getUserById)

// router.get('/test',auth,(req,res)=>{
//     res.status(200).json({
//         success: true,
//         message: "Protected Route"
//     })
// });


module.exports = router;