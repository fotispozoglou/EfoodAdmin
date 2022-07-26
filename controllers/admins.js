const Admin = require('../models/admin.js');
const jwt = require('jsonwebtoken');

const { PERMISSIONS_FULL } = require('../config/permissions.js');
const { GENERAL } = require('../config/statusCodes.js');

const generateAPIAuthToken = async user => {

  return jwt.sign({ _id: user._id, username: user.username, permissions: user.permissions, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET, { expiresIn: '999999999s' });

};

module.exports.getAPIToken = async ( req, res ) => {

  const { user } = req;

  if ( !user ) return res.redirect('/admin/login');

  const token = await generateAPIAuthToken( user );

  await Admin.updateOne({ _id: user._id }, { $set: { token } });

  res.send(JSON.stringify({ w: true }));

};

module.exports.getAdminInfo = async ( req, res ) => {

  const { user } = req;

  const isLoggedIn = req.isAuthenticated();

  res.send(JSON.stringify( isLoggedIn ? { info: { username: user.username, id: user._id, image: user.image.url }, isLoggedIn } : { isLoggedIn }));

};

module.exports.getAllAdmins = async ( req, res ) => {

  const admins = await Admin.find({});

  res.send(JSON.stringify({ permissions: PERMISSIONS_FULL, admins } ));

};

module.exports.renderLogin = async ( req, res ) => {

  res.render("login");

};

module.exports.updateAdminInfo = async ( req, res ) => {

  const { username, id } = req.body;

  await Admin.updateOne({ _id: id }, { $set: { username }}, { upsert: true });

  console.log(req.user);

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};

module.exports.login = async (req, res) => {

  const token = await generateAPIAuthToken( req.user );

  await Admin.updateOne({ _id: req.user._id }, { $set: { token } });
  
  const redirectUrl = req.session.returnTo || '/products';
  
  delete req.session.returnTo;
  
  res.redirect(redirectUrl);

}

module.exports.enablePermission = async ( req, res ) => {

  const { id, code } = req.body;

  await Admin.updateOne(
    { _id: id }, 
    { $push: { permissions: code } }
  );

  res.send( JSON.stringify({ status: GENERAL.SUCCESS, addedCode: code }) );

};

module.exports.disablePermission = async ( req, res ) => {

  const { id, code } = req.body;

  await Admin.updateOne(
    { _id: id }, 
    { $pull: { permissions: code } }
  );

  res.send( JSON.stringify({ status: GENERAL.SUCCESS, addedCode: code }) );

};

module.exports.logout = (req, res) => {

  req.logout(function(err) {
    
    if (err) { return next(err); }
    
    res.redirect('/');
      
  });

}
