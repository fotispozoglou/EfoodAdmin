export const ordersAnalyticsBtn = document.querySelector("#mnavbar_anayltics_orders");

import { controlRenderOrdersAnalytics } from "./orders.js";

import { setSelectedButton } from "../main.js";

const initializeListeners = () => {

  ordersAnalyticsBtn.addEventListener('click', () => {

    controlRenderOrdersAnalytics();

    setSelectedButton( ordersAnalyticsBtn );

  });

};

export const initAnalytics = async () => {

  initializeListeners();

};