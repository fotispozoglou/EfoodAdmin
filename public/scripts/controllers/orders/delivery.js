import * as model from '../../models/orders/delivery.js';

import { closeMobileNavbar } from '../main.js';
import DeliveryOrdersView from '../../views/orders/delivery/DeliveryOrdersView.js';
import DeliveryOrderView from '../../views/orders/delivery/DeliveryOrderView.js';
import ViewManager from '../../views/ViewManager.js';
import { deliveryOrdersNumber } from './main.js';
import { ORDER } from '../../config/statusCodes.js';
import { addToCorrectList } from './checker.js';

// const controlReadyOrder = async orderID => {

//   await model.readyOrder( orderID );

//   CuisineOrdersView.removeOrder( orderID );

// };

const controlCompleteOrder = async orderID => {

  const { data, error } = await model.completeOrder( orderID );

  if ( error ) return addNotification({ text: "Error completing order", type: MESSAGE.ERROR, duration: 4 });

  DeliveryOrdersView.removeItems( orderID );

  addToCorrectList({ status: data.actualStatus, _id: orderID });

}

const controlRenderDeliveryOrder = async orderID => {

  const { order, error } = await model.loadDeliveryOrder( orderID );

  if ( !error ) {

    ViewManager.render( DeliveryOrderView, {
      order,
      methods: {
        onGoBack: controlRenderDeliveryOrders,
        onCompleteOrder: controlCompleteOrder
      }
    }, true);

  }

};

export const controlNotifyEndOfCheck = async () => {

  if ( ViewManager.getRenderedViewID() === DeliveryOrdersView.getID() ) {

    const { data, error } = await model.loadDeliveryOrders();

    if ( error ) return;

    const { orders } = data;

    DeliveryOrdersView.add( ...orders );

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

  ViewManager.setRenderPrevious( controlRenderDeliveryOrders );

  ViewManager.render( DeliveryOrdersView, {
    items: model.state.orders,
    itemMethods: {
      onOrderClick: controlRenderDeliveryOrder,
      onOrderComplete: controlCompleteOrder
    }
  }, true);

  if ( model.state.toLoadIDS.length > 0 ) {
    
    const { data, error } = await model.loadDeliveryOrders();

    DeliveryOrdersView.add( ...data.orders );

  }

  model.state.newOrdersCount = 0;

  deliveryOrdersNumber.textContent = ``;

  closeMobileNavbar();

};