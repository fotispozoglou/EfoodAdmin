import * as model from '../../models/orders/cuisine.js';

import { closeMobileNavbar, setSelectedButton } from '../main.js';
import CuisineOrdersView from '../../views/orders/cuisine/CuisineOrdersView.js';
import ViewManager from '../../views/ViewManager.js';
import { showNotification } from '../general/notifications.js';

import { MESSAGE } from '../../config/types.js';
import { cuisineOrdersNumber, mobileNavbarCuisineOrdersBtn } from './main.js';
import { ORDER } from '../../config/statusCodes.js';
import { addToCorrectList } from './checker.js';
import CuisineHint from '../../views/orders/cuisine/CuisineHint.js';
import { pushToPreference, removeFromPreference } from '../../models/preferences.js';

const controlReadyOrder = async orderID => {

  const { data, error } = await model.readyOrder( orderID );

  if ( error ) return showNotification("error readying order", MESSAGE.ERROR);

  CuisineOrdersView.removeItems( orderID );

  addToCorrectList({ status: data.actualStatus, _id: orderID });

  showNotification("order is ready", MESSAGE.MESSAGE_SUCCESS);

};

const controlCancelOrder = async orderID => {

  const { data, error } = await model.cancelOrder( orderID );

  if ( error ) return showNotification("error canceling order", MESSAGE.ERROR);

  CuisineOrdersView.removeItems( orderID );

  showNotification("order is canceled", MESSAGE.MESSAGE_SUCCESS);

};

export const controlNotifyEndOfCheck = async () => {

  if ( 
    ViewManager.getRenderedViewID() === CuisineOrdersView.getID() ||
    ViewManager.getRenderedViewID() === CuisineHint.getID()
    ) {

    const { data, error } = await model.loadAcceptedOrders();

    if ( error ) return;

    const { orders } = data;

    CuisineOrdersView.add( ...orders );

  }

};

export const controlNotifyNewCuisineOrder = order => {

  if ( order.status.number !== ORDER.STATUS_ACCEPTED ) return addToCorrectList( order );

  const { _id } = order;

  model.state.toLoadIDS.push( _id );

  model.state.newOrdersCount += 1;

  cuisineOrdersNumber.textContent = `${ model.state.newOrdersCount }`;

}

const controlRenderSelectedOrder = async orderID => {

  const { data, error } = await model.loadOrder( orderID );

  if ( error ) return showNotification("error loading order", MESSAGE.MESSAGE_ERROR);

  const { order } = data;

  CuisineOrdersView.renderSelectedOrder( order );

};

const controlToggleMakingOrder = orderID => {

  if ( model.state.makingOrders.includes( orderID ) ) {

    model.state.makingOrders.splice( model.state.makingOrders.indexOf( orderID ), 1 );

    removeFromPreference( 'making', orderID );

    CuisineOrdersView.removeMaking( orderID );

  } else {

    model.state.makingOrders.push( orderID );

    pushToPreference( 'making', orderID );

    CuisineOrdersView.addMaking( orderID );

  }

};

const controlRenderCuisineManagement = async () => {

  if ( model.state.toLoadIDS.length > 0 ) {
    
    const { data, error } = await model.loadAcceptedOrders();

    if ( error ) showNotification("error loading new orders");

    model.state.newOrdersCount = 0;

    CuisineOrdersView.add( ...data.orders );

  }

  CuisineOrdersView.addMaking( ...model.state.makingOrders );

  document.querySelector("#cuisine_orders_container").classList.remove('hidden');

  model.state.newOrdersCount = 0;

  cuisineOrdersNumber.textContent = ``;

};

export const controlRenderCuisineOrders = async () => {

  setSelectedButton( mobileNavbarCuisineOrdersBtn );

  ViewManager.render( CuisineHint, {
    onRenderManagement: () => { controlRenderCuisineManagement(); }
  }, true);

  CuisineOrdersView.render({
    items: model.state.orders,
    itemMethods: {
      onOrderReady: orderID => { controlReadyOrder( orderID ); },
      onCancelOrder: orderID => { controlCancelOrder( orderID ); },
      onLoadOrder: orderID => { controlRenderSelectedOrder( orderID ); },
      onMakingOrder: orderID => { controlToggleMakingOrder( orderID ); }
    }
  });

  closeMobileNavbar();

};