import * as model from '../../models/orders/delivery.js';

import { closeMobileNavbar, setSelectedButton } from '../main.js';
import DeliveryOrdersView from '../../views/orders/delivery/DeliveryOrdersView.js';
import DeliveryOrderView from '../../views/orders/delivery/DeliveryOrderView.js';
import ViewManager from '../../views/ViewManager.js';
import { deliveryOrdersNumber, mobileNavbarDeliveryOrdersBtn } from './main.js';
import { ORDER } from '../../config/statusCodes.js';
import { addToCorrectList } from './checker.js';
import { showNotification } from '../general/notifications.js';
import { MESSAGE } from '../../config/types.js';
import { SHORT } from '../../views/general/Notification.js';

// const controlReadyOrder = async orderID => {

//   await model.readyOrder( orderID );

//   CuisineOrdersView.removeOrder( orderID );

// };

const controlCompleteOrder = async orderID => {

  const { data, error } = await model.completeOrder( orderID );

  if ( error ) return showNotification("error completing order", MESSAGE.MESSAGE_ERROR);

  DeliveryOrdersView.removeItems( orderID );

  addToCorrectList({ status: data.actualStatus, _id: orderID });

  showNotification("order completed", MESSAGE.MESSAGE_SUCCESS, SHORT);

}

const controlCallClient = async orderID => {

  const { data, error } = await model.getClientPhone( orderID );

  if ( error ) return showNotification("error getting client's phone", MESSAGE.MESSAGE_ERROR);

  window.open(`tel:${ data.phone }`, '_self');

};

export const controlRenderDeliveryOrder = async ({ orderID }) => {

  const { order, error } = await model.loadDeliveryOrder( orderID );

  if ( error ) return showNotification("error loading order", MESSAGE.MESSAGE_ERROR);

  ViewManager.render( DeliveryOrderView, {
    order,
    methods: {
      onGoBack: controlRenderDeliveryOrders,
      onCompleteOrder: controlCompleteOrder,
      onCallClient: controlCallClient
    }
  }, true);

};

export const controlNotifyEndOfCheck = async () => {

  if ( ViewManager.getRenderedViewID() === DeliveryOrdersView.getID() ) {

    const { data, error } = await model.loadDeliveryOrders();

    if ( error ) return;

    const { orders } = data;

    DeliveryOrdersView.add( ...orders );

    model.state.newOrdersCount = 0;

    deliveryOrdersNumber.textContent = ``;

  }

};

export const controlNotifyNewDeliveryOrder = order => {

  if ( order.status.number !== ORDER.STATUS_DELIVERING ) return addToCorrectList( order );

  const { _id } = order;

  model.state.toLoadIDS.push( _id );

  model.state.newOrdersCount += 1;

  deliveryOrdersNumber.textContent = `${ model.state.newOrdersCount }`;

};

export const controlRenderDeliveryOrders = async () => {

  setSelectedButton( mobileNavbarDeliveryOrdersBtn );

  ViewManager.render( DeliveryOrdersView, {
    items: model.state.orders,
    itemMethods: {
      onOrderClick: controlRenderDeliveryOrder,
      onOrderComplete: controlCompleteOrder
    } 
  }, true);

  if ( model.state.toLoadIDS.length > 0 ) {
    
    const { data, error } = await model.loadDeliveryOrders();

    if ( error ) {

      closeMobileNavbar();

      return showNotification("error loading orders", MESSAGE.MESSAGE_ERROR);

    }

    model.state.newOrdersCount = 0;

    DeliveryOrdersView.add( ...data.orders );

  }

  deliveryOrdersNumber.textContent = ``;

  closeMobileNavbar();

};