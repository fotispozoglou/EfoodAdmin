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