import { MESSAGE } from "../config/types.js";
import { showNotification } from "../controllers/general/notifications.js";
let API_TOKEN = null;

export const setAPIToken = ( key, loggedIn ) => {

  API_TOKEN = key;

};

const ensureAPIToken = async () => {

  const localCookie = getCookie('auth_token');

  if ( localCookie === undefined || localCookie === null ) {

    const { token, error } = await generateAPIToken();

    if ( error ) return { error: new Error("Cannot Generate Token") };

  }

  return { error: undefined };

};

const generateAPIToken = async () => {

  const options = {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    }
  }

  const { data, error } = await fetch('/admin/generate/token', options);

  if ( !error ) {

    return { data };

  }

  return { error };

};

const getCookie = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

let hasInternet = true;
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

  const { error = undefined } = await ensureAPIToken();

  if ( error ) return { error };

  const token = getCookie('auth_token');

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
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

  console.log( options );

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

  console.log( options );

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