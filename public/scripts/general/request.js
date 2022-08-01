import { MESSAGE } from "../config/types.js";
import { showNotification } from "../controllers/general/notifications.js";
let API_TOKEN = null;
let TOKEN = null;

export const setAPIToken = ( key, key2, loggedIn ) => {

  API_TOKEN = key;
  TOKEN = key2;

};

let hasInternetError = false;

const handleNoConnection = () => {

  hasInternetError = true;

  showNotification("no internet connection", MESSAGE.MESSAGE_ERROR);

};

const getRequestOptions = async ( method, body = {}) => {

  if ( !navigator.onLine ) {

    handleNoConnection();

    return { error: Error("No Internet") };

  };

  hasInternetError = false;

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${ TOKEN }`,
      'Content-type': 'application/json',
      'CSRF-Token': API_TOKEN
    }
  }

  if ( method !== "GET" ) options.body = JSON.stringify( body );

  return { options };

};

export const GET = async url => {

  const { options, error } = await getRequestOptions('GET');

  if ( error ) return { error: Error("Cannot Get Options") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { return { error }; });

};

export const POST = async ( url, body ) => {

  const { options, error } = await getRequestOptions('POST', body);

  if ( error ) return { error: Error("Cannot Get Options") };

  if ( !navigator.onLine ) return { error: new Error("NetworkError") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { 

      return { error };
    
    });

};

export const PUT = async ( url, body ) => {

  const { options, error } = await getRequestOptions('PUT', body);

  if ( error ) return { error: Error("Cannot Get Options") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { return { error }; });

};

export const DELETE = async ( url, body ) => {

  const { options, error } = await getRequestOptions('DELETE', body);

  if ( error ) return { error: Error("Cannot Get Options") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { return { error }; });

};

export const POST_FORM = async ( url, formData ) => {

  return await fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(response => {

    if ( response.status === 200 ) return response.json();

    throw new Error( response.status );

  })
  .then(data => {

    return { data };

  })
  .catch(error => { return { error }; });

}

export const PUT_FORM = async ( url, formData ) => {

  return await fetch(url, {
    method: 'PUT',
    body: formData
  })
  .then(response => {

    if ( response.status === 200 ) return response.json();

    throw new Error( response.status );

  })
  .then(data => {

    return { data };

  })
  .catch(error => { return { error }; });

}