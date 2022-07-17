import CompletedOrdersView from "../../views/orders/completed/CompletedOrdersView.js";

import * as model from '../../models/orders/completed.js';
import { closeMobileNavbar } from "../main.js";
import ViewManager from "../../views/ViewManager.js";
import { completedOrdersNumber } from "./main.js";
import { addNotification, showNotification } from '../general/notifications.js';
import { MESSAGE } from '../../config/types.js';
import { DEFAULT_DURATION, LONG } from '../../views/general/Notification.js';
import { controlRenderOrdersAnalytics } from "../analytics/orders.js";

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

      return showNotification( "error loading orders", MESSAGE.MESSAGE_ERROR );

    }

    if ( data.orders.length > 0 ) {

      CompletedOrdersView.add( ...data.orders );

    }

  }, 750);

};

const controlSearchCompletedOrders = async ( value, excluded ) => {

  const { data, error } = await model.searchCompletedOrders( value, excluded );

  if ( !error ) {

    model.addOrders( ...data.orders );

    return { data };

  }

  showNotification("error while searching", MESSAGE.MESSAGE_ERROR);

  return { error };

};

export const controlRenderCompletedOrders = async () => {

  ViewManager.render( CompletedOrdersView, {
    items: [  ],
    methods: {
      onIntersect: controlLoadNextCompletedOrders,
      onRenderAnalytics: () => { controlRenderOrdersAnalytics(); },
      loadAPIOrders: controlSearchCompletedOrders
    },
    itemMethods: {
    },
    intersect: true
  }, true);

  if ( !model.state.loadedCompletedOrders ) {
    
    const { data, error } = await model.loadCompletedOrders();

    if ( error ) {

      closeMobileNavbar();

      return showNotification("can't load completed orders", MESSAGE.MESSAGE_ERROR);

    }

    CompletedOrdersView.add( ...data.orders );

  }

  closeMobileNavbar();

};