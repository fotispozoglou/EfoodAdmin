const mobileNavbarCompletedOrdersBtn = document.querySelector("#mnavbar_orders_completed");
const mobileNavbarPendingOrdersBtn = document.querySelector("#mnavbar_orders_pending");
const mobileNavbarCuisineOrdersBtn = document.querySelector("#mnavbar_orders_cuisine");
const mobileNavbarDeliveryOrdersBtn = document.querySelector("#mnavbar_orders_delivery");

export const completedOrdersNumber = document.querySelector("#mnavbar_orders_completed_number");
export const pendingOrdersNumber = document.querySelector("#mnavbar_orders_pending_number");
export const cuisineOrdersNumber = document.querySelector("#mnavbar_orders_cuisine_number");
export const deliveryOrdersNumber = document.querySelector("#mnavbar_orders_delivery_number");

const ordersErrorIcon = document.querySelector("#orders_error_icon");

import { setSelectedButton } from "../main.js";
import { start, controlCheckOrders } from "./checker.js";
import { controlRenderCompletedOrders } from "./completed.js";
import { controlRenderCuisineOrders } from "./cuisine.js";
import { controlRenderDeliveryOrders } from "./delivery.js";

import { controlRenderPendingOrders } from "./pending.js";

import { checkForNewOrders } from '../../models/orders/checker.js';
import { initializeMakingOrders } from "../../models/orders/cuisine.js";

export const setOrdersError = error => {

  ordersErrorIcon.setAttribute('title', error);

  ordersErrorIcon.classList.remove('hidden');

};

export const hideOrdersError = () => { ordersErrorIcon.classList.add('hidden'); };

const initialiazeListeners = () => {

  mobileNavbarCompletedOrdersBtn.addEventListener('click', () => {

    setSelectedButton ( mobileNavbarCompletedOrdersBtn );

  });

  mobileNavbarPendingOrdersBtn.addEventListener('click', () => { 
      
    setSelectedButton ( mobileNavbarPendingOrdersBtn );
  
  });

  mobileNavbarCuisineOrdersBtn.addEventListener('click', () => {

    setSelectedButton( mobileNavbarCuisineOrdersBtn );

  });

  mobileNavbarDeliveryOrdersBtn.addEventListener('click', () => {

    setSelectedButton( mobileNavbarDeliveryOrdersBtn );

  });

};

export const initOrders = async () => {

  initializeMakingOrders();

  initialiazeListeners();

  start();

};
