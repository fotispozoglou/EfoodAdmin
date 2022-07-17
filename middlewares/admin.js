const { PERMISSIONS } = require('../config/permissions.js');

module.exports.isLoggedIn = async ( req, res, next ) => {

  if ( !req.isAuthenticated() ) return res.send( 404 );

  next();

};

module.exports.isAdmin = async ( req, res, next ) => {

  if ( !req.user ) return res.redirect( 303, '/admin/login');

  if ( !req.user.isAdmin ) return res.redirect( 303, '/admin/login');

  if ( req.user.isAdmin === false ) return res.redirect( 303, '/admin/login');

  next();

};

module.exports.canEditPermissions = async ( req, res, next ) => {

  const { user } = req;

  if ( user === undefined || user === null ) return res.sendStatus( 403 );

  if ( user.isAdmin === undefined || user.isAdmin === null || user.isAdmin === false ) return res.sendStatus( 403 );

  if ( user.permissions === undefined || !user.permissions.includes( PERMISSIONS.PERMISSIONS_MODIFY ) ) return res.sendStatus( 403 );

  next();

};