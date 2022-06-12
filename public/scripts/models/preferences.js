export const model = {
  
};

export const getPreference = key => {

  return localStorage.getItem( key );

};

export const getJSONPreference = key => {

  return JSON.parse(localStorage.getItem( key ));

};

export const saveJSONPreference = ( key, value ) => {

  localStorage.setItem( key, JSON.stringify( value ) );

}

export const removeFromPreference = ( key, ...values ) => {

  let array = JSON.parse(localStorage.getItem( key ));

  for ( const value of values ) {

    array.splice( array.indexOf( value ), 1 );

  }

  localStorage.setItem( key, JSON.stringify( array ) );

};

export const pushToPreference = ( key, ...values ) => {

  let array = JSON.parse(localStorage.getItem( key ));

  if ( !array ) array = [  ];

  array.push( ...values );

  localStorage.setItem( key, JSON.stringify( array ) );

};

export const savePreference = ( key, value ) => {

  localStorage.setItem( key, value );

};