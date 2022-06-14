export const ordersAnalyticsBtn = document.querySelector("#mnavbar_anayltics_orders");

import { controlRenderOrdersAnalytics } from "./orders.js";

const initializeListeners = () => {

  ordersAnalyticsBtn.addEventListener('click', () => {

    controlRenderOrdersAnalytics();

  });

};

export const initAnalytics = async () => {

  initializeListeners();

};