const express = require('express');
const router = express.Router();
const passport = require('passport');
const admins = require('../controllers/admins.js');
const { canEditPermissions, isAdmin } = require('../middlewares/admin.js');
const { loginLimiter } = require('../middlewares/limiters.js');

router.route('/login')
  .post( loginLimiter, passport.authenticate('local', { failureFlash: false, failureRedirect: '/admin/login' }), admins.login);

router.route('/info')
  .get( isAdmin, admins.getAdminInfo )
  .put( isAdmin, admins.updateAdminInfo );

router.route('/all')
  .get( isAdmin, admins.getAllAdmins );

router.get('/logout', isAdmin, admins.logout);

module.exports = router;