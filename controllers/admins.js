const Admin = require('../models/admin.js');
const jwt = require('jsonwebtoken');

const { GENERAL } = require('../config/statusCodes.js');

const generateAPIAuthToken = async user => {

  return jwt.sign({ _id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET, { expiresIn: '999999999s' });

};

module.exports.getAdminInfo = async ( req, res ) => {

  const { user } = req;

  const isLoggedIn = req.isAuthenticated();

  res.send(JSON.stringify( isLoggedIn ? { info: { username: user.username, id: user._id }, isLoggedIn } : { isLoggedIn }));

};

module.exports.renderLogin = async ( req, res ) => {

  res.render("login");

};

module.exports.updateAdminInfo = async ( req, res ) => {

  const { username, id } = req.body;

  // await Admin.updateOne({ _id: id }, { $set: { username }}, { upsert: true });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};

module.exports.login = async (req, res) => {

  const token = await generateAPIAuthToken( req.user );

  await Admin.updateOne({ _id: req.user._id }, { $set: { token } });
  
  const redirectUrl = req.session.returnTo || '/products';
  
  delete req.session.returnTo;
  
  res.redirect(redirectUrl);

}

module.exports.logout = (req, res) => {

  req.logout(function(err) {
    
    if (err) { return next(err); }
    
    res.redirect('/');
      
  });

}
