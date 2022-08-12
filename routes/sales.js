const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    res.send('This is sales page');
});

module.exports = router;