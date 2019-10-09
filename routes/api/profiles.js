const express = require('express');
const router = express.Router();

//@route GET api/profiles/test
//@desc tests profiles route
//@access Public
router.get('/test', ( req,res) => res.json({msg:"profile works"}));

module.exports = router;