const { PERMISSIONS } = require('../config/permissions.js');

module.exports.isAdmin = async ( req, res, next ) => {

  if ( !req.user ) return res.redirect('/admin/login');

  if ( !req.user.isAdmin ) return res.redirect('/admin/login');

  if ( req.user.isAdmin === false ) return res.redirect('/admin/login');

  next();

};

module.exports.canEditPermissions = async ( req, res, next ) => {

  const { user } = req;

  if ( user === undefined || user === null ) return res.sendStatus( 403 );

  if ( user.isAdmin === undefined || user.isAdmin === null || user.isAdmin === false ) return res.sendStatus( 403 );

  if ( user.permissions === undefined || !user.permissions.includes( PERMISSIONS.PERMISSIONS_MODIFY ) ) return res.sendStatus( 403 );

  next();

};