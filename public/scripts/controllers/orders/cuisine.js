import * as model from '../../models/orders/cuisine.js';

import { closeMobileNavbar } from '../main.js';
import CuisineOrdersView from '../../views/orders/cuisine/CuisineOrdersView.js';
import ViewManager from '../../views/ViewManager.js';
import CuisineOrderView from '../../views/orders/cuisine/CuisineOrderView.js';
import { addNotification } from '../general/notifications.js';

import { MESSAGE } from '../../config/types.js';
import { cuisineOrdersNumber } from './main.js';
import { ORDER } from '../../config/statusCodes.js';
import { addToCorrectList } from './checker.js';

const controlReadyOrder = async orderID => {

  const { data, error } = await model.readyOrder( orderID );

  if ( error ) return addNotification({ text: "Failed to ready order", type: MESSAGE.ERROR, duration: 4 });

  CuisineOrdersView.removeItems( orderID );

  addToCorrectList({ status: data.actualStatus, _id: orderID });

};

const controlShowOrder = async orderID => {

  const { data, error } = await model.loadOrder( orderID );

  if ( error ) return addNotification({ text: "Error loading order", type: MESSAGE.ERROR, duration: 4 });

  ViewManager.render( CuisineOrderView, {
    order: data.order,
    methods: {
      onGoBack: controlRenderCuisineOrders
    }
  }, true);

};

export const controlNotifyEndOfCheck = async () => {

  if ( ViewManager.getRenderedViewID() === CuisineOrdersView.getID() ) {

    const { data, error } = await model.loadAcceptedOrders();

    if ( error ) return;

    const { orders } = data;

    CuisineOrdersView.add( ...orders );

  }

};

export const controlNotifyNewCuisineOrder = order => {

  if ( order.status !== ORDER.STATUS_ACCEPTED ) return addToCorrectList( order );

  const { _id } = order;

  model.state.toLoadIDS.push( _id );

  model.state.newOrdersCount += 1;

  cuisineOrdersNumber.textContent = `${ model.state.newOrdersCount }`;

}

export const controlRenderCuisineOrders = async () => {

  ViewManager.setRenderPrevious( controlRenderCuisineOrders );

  ViewManager.render( CuisineOrdersView, {
    items: model.state.orders,
    itemMethods: {
      onOrderReady: orderID => { controlReadyOrder( orderID ) },
      onShowOrder: orderID => { controlShowOrder( orderID ); }
    }
  }, true);

  if ( model.state.toLoadIDS.length > 0 ) {
    
    const { data, error } = await model.loadAcceptedOrders();

    CuisineOrdersView.add( ...data.orders );

  }

  model.state.newOrdersCount = 0;

  cuisineOrdersNumber.textContent = ``;

  closeMobileNavbar();

};