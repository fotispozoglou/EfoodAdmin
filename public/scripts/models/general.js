export const ensureAPIToken = async () => {

  const localCookie = getCookie('api_token');

  if ( localCookie === undefined || localCookie === null ) {

    await generateAPIToken();

  }

};

export const generateAPIToken = async () => {

  return await axios.post('/admin/generate/token').then(response => { return response.data });

};

export const getCookie = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}