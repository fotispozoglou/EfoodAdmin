import CompletedOrdersView from "../../views/orders/completed/CompletedOrdersView.js";

import * as model from '../../models/orders/completed.js';
import { closeMobileNavbar } from "../main.js";
import ViewManager from "../../views/ViewManager.js";
import { completedOrdersNumber } from "./main.js";
import { addNotification } from '../general/notifications.js';
import { MESSAGE } from '../../config/types.js';
import { DEFAULT_DURATION, LONG } from '../../views/general/Notification.js';

export const controlNotifyNewCompletedOrder = order => {

  model.state.orders.push( order );

  if ( CompletedOrdersView.hasRendered() ) CompletedOrdersView.add( order );

  if ( ViewManager.getRenderedViewID() === CompletedOrdersView.getID() ) return;

  model.state.newOrdersCount += 1;

  completedOrdersNumber.textContent = `${ model.state.newOrdersCount }`;

};

const controlLoadNextCompletedOrders = async () => {

  console.log("INTERSECTED");

  setTimeout(async () => {

    const { data, error } = await model.loadCompletedOrders();

    if ( error ) {

      const loadingError = { text: "error loading orders", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

      console.log("HIDDING ERROR");

      return addNotification( loadingError );

    }

    if ( data.orders.length > 0 ) {

      CompletedOrdersView.add( ...data.orders );

    }

  }, 750);

};

export const controlRenderCompletedOrders = async () => {

  ViewManager.setRenderPrevious( controlRenderCompletedOrders );

  ViewManager.render( CompletedOrdersView, {
    items: [  ],
    methods: {
      onIntersect: controlLoadNextCompletedOrders
    },
    itemMethods: {
    },
    intersect: true,
    analytics: [
      { label: "today", value: '...' },
      { label: "today income", value: '...' },
      { label: "total", value: '...' },
      { label: "total income", value: '...' }
    ]
  }, true);

  if ( !model.state.loadedCompletedOrders ) {
    
    const { data, error } = await model.loadCompletedOrders();

    CompletedOrdersView.setAnalytics([
      { label: "today", value: data.analytics.todayOrdersCount },
      { label: "today income", value: data.analytics.todayOrdersPrices },
      { label: "total", value: data.analytics.totalOrdersCount },
      { label: "total income", value: data.analytics.totalOrdersPrices }
    ]);

    CompletedOrdersView.add( ...data.orders );

  }

  closeMobileNavbar();

};