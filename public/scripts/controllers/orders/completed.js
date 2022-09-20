import CompletedOrdersView from "../../views/orders/completed/CompletedOrdersView.js";

import * as model from '../../models/orders/completed.js';
import { closeMobileNavbar, setSelectedButton } from "../general.js";
import ViewManager from "../../views/ViewManager.js";
import { completedOrdersNumber, mobileNavbarCompletedOrdersBtn } from "./main.js";
import { showNotification } from '../general/notifications.js';
import { MESSAGE } from '../../config/types.js';
import CompletedOrderView from "../../views/orders/completed/CompletedOrderView.js";

export const controlNotifyNewCompletedOrder = order => {

  model.state.orders.push( order );

  if ( CompletedOrdersView.hasRendered() ) CompletedOrdersView.add( order );

  if ( ViewManager.getRenderedViewID() === CompletedOrdersView.getID() ) return;

  model.state.newOrdersCount += 1;

  completedOrdersNumber.textContent = `${ model.state.newOrdersCount }`;

};

const controlLoadNextCompletedOrders = async () => {

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

export const controlRenderCompletedOrder = async ({ orderID }) => {

  const { data, error } = await model.loadCompletedOrder( orderID );

  if ( error ) return showNotification("error loading order", MESSAGE.MESSAGE_ERROR );

  ViewManager.render( CompletedOrderView, {
    order: data.order,
    methods: {

    }
  }, true);

}

export const controlRenderCompletedOrders = async () => {

  setSelectedButton( mobileNavbarCompletedOrdersBtn );

  ViewManager.render( CompletedOrdersView, {
    items: [  ],
    loading: !model.state.loadedCompletedOrders,
    methods: {
      onIntersect: controlLoadNextCompletedOrders,
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