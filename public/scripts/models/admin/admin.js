import { SERVER_URL } from "../../config/config.js";
import { GET, PUT } from "../../general/request.js";
const ADMIN_URL = `${ SERVER_URL }/admin`;

import { ITEM } from "../../config/statusCodes.js";

import { POST_FORM } from "../../general/request.js";

export const state = {
  info: {
    username: '',
    id: '',
    image: ''
  },
  isLoggedIn: false
}

export const updateAdminInfo = async data => {

  const { username } = data;

  const { data: response, error } = await PUT(`${ ADMIN_URL }/info`, { username, id: state.info.id });

  if ( error ) return { error };

  return { data: response };

};

export const loadAdminInfo = async () => {

  const { data, error } = await GET("/admin/info");

  if ( error ) return { error };

  const { isLoggedIn } = data;

  if ( !isLoggedIn ) window.location = '/admin/login';

  state.info = data.info;

};