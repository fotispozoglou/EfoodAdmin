import { GET, POST } from '../../general/request.js';

export const state = {
  info: {
    username: ''
  },
  isLoggedIn: false
}

export const enablePermission = async ( id, code ) => {

  return await POST('/admin/permissions/enable', { id, code });

};

export const disablePermission = async ( id, code ) => {

  return await POST('/admin/permissions/disable', { id, code });

};

export const loadAdminInfo = async () => {

  const { data, error } = await GET('/admin/info');

  if ( error ) return { error };

  const { isLoggedIn } = data;

  if ( !isLoggedIn ) window.location = '/admin/login';

  state.info.username = data.info.username;

};

export const loadAdmins = async () => {

  const { data, error } = await GET('/admin/all');

  if ( error ) return { error };

  const { permissions, admins } = data;

  return { permissions, admins };

};