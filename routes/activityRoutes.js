const express = require("express");
const router = express.Router();
const {getActivity} = require("../controllers/activityController");

router.get('/activities', getActivity);

module.exports = router;
