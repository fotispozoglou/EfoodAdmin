import AdminInfoEdit from "../../views/admin/AdminInfoEdit.js";
import AdminBar from "../../views/admin/AdminBar.js";

import * as model from '../../models/admin/admin.js';
import { closeMobileNavbar } from "../general.js";
import ViewManager from "../../views/ViewManager.js";
import { showNotification } from "../general/notifications.js";
import { MESSAGE } from "../../config/types.js";

const controlUpdateAdminInfo = async () => {

  const data = AdminInfoEdit.getViewData();

  const { data: updateData, error } = await model.updateAdminInfo( data );

  if ( error ) return showNotification("error updating information", MESSAGE.MESSAGE_ERROR);

  showNotification("information updated successfully", MESSAGE.MESSAGE_SUCCESS);

};

export const controlRenderEditAdminInfo = () => {

  ViewManager.render( AdminInfoEdit, {
    info: model.state.info,
    actions: [{ name: 'save', exec: controlUpdateAdminInfo }],
    methods: {
      onGoBack: () => { ViewManager.renderPrevious(); }
    }
  }, true);

  closeMobileNavbar();

};

export const controlRenderAdminBar = () => {

  document.querySelectorAll('.admin_profile_phase').forEach( element => {

    element.classList.add('hidden');

  });

  AdminBar.render({
    info: model.state.info
  });

  const adminBtn = document.querySelector("#mnavbar_header_admin");

  adminBtn.addEventListener('click', () => {

    controlRenderEditAdminInfo();

  });

  AdminBar.initializeListeners();

};