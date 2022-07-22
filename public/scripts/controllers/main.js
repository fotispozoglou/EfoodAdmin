const mobileNavbar = document.querySelector("#mnavbar_background");
let openMobileNavbarBtn;
const closeMobileNavbarBtn = document.querySelector("#close_mnavbar");
const mnavbar = document.querySelector("#mnavbar");

import { loadAdminInfo } from "../models/admin/admin.js";
import ConfirmActionView from "../views/general/ConfirmActionView.js";
import { controlRenderAdminBar, controlRenderEditAdminInfo } from "./admin/admin.js";
import { initMenu } from "./menu/main.js";
import { initOrders } from "./orders/main.js";
import { initAnalytics } from "./analytics/main.js";
import ListItem from "../views/base/ListItem.js";
import Router from "./Router.js";
import { controlRenderCompletedOrder, controlRenderCompletedOrders } from "./orders/completed.js";
import { controlRenderPendingOrders } from "./orders/pending.js";
import { controlRenderCuisineOrders } from "./orders/cuisine.js";
import { controlRenderDeliveryOrder, controlRenderDeliveryOrders } from "./orders/delivery.js";
import { controlRenderOrdersAnalytics } from "./analytics/orders.js";
import { setAPIToken } from "../general/request.js";
import { controlRenderAddTier, controlRenderEditTier, controlRenderTiers } from "./menu/tiers.js";
import { controlRenderAddIngredient, controlRenderEditIngredient, controlRenderIngredients } from "./menu/ingredients.js";
import { controlRenderAddProductsCategory, controlRenderEditProductsCategory, controlRenderProductsCategories } from "./menu/productsCategories.js";
import { controlRenderAddProduct, controlRenderEditProduct, controlRenderProducts } from "./menu/products.js";

export const openMobileNavbar = () => { mobileNavbar.style.left = '0%'; };
export const closeMobileNavbar = () => { mobileNavbar.style.left = '-100%'; };

export let selectedOption;

export const router = new Router();

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

  setAPIToken( window.api_token );

  delete window.api_token;

  await loadAdminInfo();

  await initMenu();

  await initOrders();

  await initAnalytics();

  router.route(
    { path: '/products', render: controlRenderProducts },
    { path: '/products/add', render: controlRenderAddProduct },
    { path: '/products/:productID', render: controlRenderEditProduct },
    { path: '/ingredients', render: controlRenderIngredients },
    { path: '/ingredients/add', render: controlRenderAddIngredient },
    { path: '/ingredients/:ingredientID', render: controlRenderEditIngredient },
    { path: '/tiers', render: controlRenderTiers },
    { path: '/tiers/add', render: controlRenderAddTier },
    { path: '/tiers/:tierID', render: controlRenderEditTier },
    { path: '/productsCategories', render: controlRenderProductsCategories },
    { path: '/productsCategories/add', render: controlRenderAddProductsCategory },
    { path: '/productsCategories/:productsCategoryID', render: controlRenderEditProductsCategory },
    { path: '/completed', render: controlRenderCompletedOrders },
    { path: '/completed/:orderID', render: controlRenderCompletedOrder },
    { path: '/pending', render: controlRenderPendingOrders },
    { path: '/cuisine', render: controlRenderCuisineOrders },
    { path: '/delivery', render: controlRenderDeliveryOrders },
    { path: '/delivery/:orderID', render: controlRenderDeliveryOrder },
    { path: '/analytics', render: controlRenderOrdersAnalytics },
    { path: '/account', render: controlRenderEditAdminInfo }
  );

  router.init();

  controlRenderAdminBar();

  openMobileNavbarBtn = document.querySelector("#open_mnavbar_btn");

  initialiazeListeners();

};

Array.prototype.removeMany = function( keyPathName, ...keys ) {

  this.filter(item => keys.includes( item[`${ keyPathName }`] )).forEach(item => this.splice(this.indexOf( item ), 1));

  return this;

}

init();