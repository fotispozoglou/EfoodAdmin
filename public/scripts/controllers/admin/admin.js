import AdminInfoEdit from "../../views/admin/AdminInfoEdit.js";
import AdminBar from "../../views/admin/AdminBar.js";

import * as model from '../../models/admin/admin.js';
import { closeMobileNavbar } from "../main.js";
import ViewManager from "../../views/ViewManager.js";

const controlUpdateAdminInfo = async () => {

  const data = AdminInfoEdit.getViewData();

  const { data: updateData, error } = await model.updateAdminInfo( data );

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

  AdminBar.render({
    info: model.state.info
  });

  const adminBtn = document.querySelector("#mnavbar_header_admin");

  adminBtn.addEventListener('click', () => {

    controlRenderEditAdminInfo();

  });

  AdminBar.initializeListeners();

};