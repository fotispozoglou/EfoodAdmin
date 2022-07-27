export const mobileNavbarCompletedOrdersBtn = document.querySelector("#mnavbar_orders_completed");
export const mobileNavbarPendingOrdersBtn = document.querySelector("#mnavbar_orders_pending");
export const mobileNavbarCuisineOrdersBtn = document.querySelector("#mnavbar_orders_cuisine");
export const mobileNavbarDeliveryOrdersBtn = document.querySelector("#mnavbar_orders_delivery");

export const completedOrdersNumber = document.querySelector("#mnavbar_orders_completed_number");
export const pendingOrdersNumber = document.querySelector("#mnavbar_orders_pending_number");
export const cuisineOrdersNumber = document.querySelector("#mnavbar_orders_cuisine_number");
export const deliveryOrdersNumber = document.querySelector("#mnavbar_orders_delivery_number");

const ordersErrorIcon = document.querySelector("#orders_error_icon");

import { start } from "./checker.js";

import { initializeMakingOrders } from "../../models/orders/cuisine.js";

export const setOrdersError = error => {

  ordersErrorIcon.setAttribute('title', error);

  ordersErrorIcon.classList.remove('hidden');

};

export const hideOrdersError = () => { ordersErrorIcon.classList.add('hidden'); };

export const initOrders = async () => {

  initializeMakingOrders();

  start();

};
