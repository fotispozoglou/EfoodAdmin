const express = require('express');
const router = express.Router();
const index = require('../controllers/index.js');
const { isAdmin } = require('../middlewares/admin.js');

router.get('/', isAdmin, index.renderIndex);

module.exports = router;