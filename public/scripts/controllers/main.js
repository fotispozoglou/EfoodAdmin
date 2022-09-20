const mobileNavbar = document.querySelector("#mnavbar_background");
let openMobileNavbarBtn;
const closeMobileNavbarBtn = document.querySelector("#close_mnavbar");
const mnavbar = document.querySelector("#mnavbar");

import { controlRenderAdminBar, controlRenderEditAdminInfo } from "./admin/admin.js";
import { router } from "./Router.js";
import { controlRenderCompletedOrder, controlRenderCompletedOrders } from "./orders/completed.js";
import { controlRenderPendingOrders } from "./orders/pending.js";
import { controlRenderCuisineOrders } from "./orders/cuisine.js";
import { controlRenderDeliveryOrder, controlRenderDeliveryOrders } from "./orders/delivery.js";
import { setAPIToken } from "../general/request.js";
import { controlRenderAddTier, controlRenderEditTier, controlRenderTiers } from "./menu/tiers.js";
import { controlRenderAddIngredient, controlRenderEditIngredient, controlRenderIngredients } from "./menu/ingredients.js";
import { controlRenderAddProductsCategory, controlRenderEditProductsCategory, controlRenderProductsCategories } from "./menu/productsCategories.js";
import { controlRenderAddProduct, controlRenderEditProduct, controlRenderProducts } from "./menu/products.js";
import { loadAdminInfo } from "../models/admin/admin.js";
import { initOrders } from "./orders/main.js";
import { initMenu } from "./menu/main.js";
import { openMobileNavbar, closeMobileNavbar } from "./general.js";

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

const init = async () => {

  setAPIToken( window.api_token, window.token );

  delete window.api_token;
  delete window.token;

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
    { path: '/account', render: controlRenderEditAdminInfo }
  );

  document.querySelectorAll('.first_render_phase').forEach( element => {

    element.classList.add('hidden')

  });

  router.init();

  await loadAdminInfo();

  await initMenu();

  await initOrders();

  controlRenderAdminBar();

  openMobileNavbarBtn = document.querySelector("#open_mnavbar_btn");

  initialiazeListeners();

};

Array.prototype.removeMany = function( keyPathName, ...keys ) {

  this.filter(item => keys.includes( item[`${ keyPathName }`] )).forEach(item => this.splice(this.indexOf( item ), 1));

  return this;

}

init();