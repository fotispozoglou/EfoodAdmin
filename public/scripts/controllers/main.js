const mobileNavbar = document.querySelector("#mnavbar_background");
let openMobileNavbarBtn;
const closeMobileNavbarBtn = document.querySelector("#close_mnavbar");
const mnavbar = document.querySelector("#mnavbar");

import { loadAdminInfo } from "../models/admin/admin.js";
import ConfirmActionView from "../views/general/ConfirmActionView.js";
import { controlRenderAdminBar } from "./admin/admin.js";
import { initMenu } from "./menu/main.js";
import { initOrders } from "./orders/main.js";
import { initAnalytics } from "./analytics/main.js";
import { controlRenderProducts } from "./menu/products.js";
import { addNotification } from "./general/notifications.js";
import { MESSAGE } from "../config/types.js";
import { LONG } from "../views/general/Notification.js";
import ListItem from "../views/base/ListItem.js";

export const openMobileNavbar = () => { mobileNavbar.style.left = '0%'; };
export const closeMobileNavbar = () => { mobileNavbar.style.left = '-100%'; };

export let selectedOption;

export const setSelectedButton = toSelect => {

  if ( selectedOption ) selectedOption.classList.remove('selected_mnavbar_sub_option');

  selectedOption = toSelect;

  selectedOption.classList.add('selected_mnavbar_sub_option');

};

const initialiazeListeners = () => {

  mnavbar.addEventListener('click', e => { e.stopPropagation() });

  openMobileNavbarBtn.addEventListener('click', e => {

    e.stopPropagation();

    openMobileNavbar();

  });

  closeMobileNavbarBtn.addEventListener('click', () => {

    closeMobileNavbar();

  });

  mobileNavbar.addEventListener('click', () => {

    closeMobileNavbar();

  });

  const navbar = document.querySelector("#navbar");

  document.documentElement.style.setProperty('--navbar-height', `${navbar.getClientRects()[0].height}px`);

};

export const controlConfirmAction = async ( title, confirm, effectedItems, itemComponent = ListItem ) => {

  document.querySelector("body").classList.add('hide_overflow');

  ConfirmActionView.render({
    title,
    confirm,
    effectedItems,
    itemComponent
  });

} 

const init = async () => {

  await loadAdminInfo();

  await initMenu();

  await initOrders();

  await initAnalytics();

  controlRenderAdminBar();

  openMobileNavbarBtn = document.querySelector("#open_mnavbar_btn");

  await controlRenderProducts();

  initialiazeListeners();

};

Array.prototype.removeMany = function( keyPathName, ...keys ) {

  this.filter(item => keys.includes( item[`${ keyPathName }`] )).forEach(item => this.splice(this.indexOf( item ), 1));

  return this;

}

init();