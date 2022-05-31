import * as model from '../../models/orders/pending.js';
import PendingOrdersView from '../../views/orders/pending/PendingOrdersView.js';
import ViewManager from '../../views/ViewManager.js';
import { closeMobileNavbar } from '../main.js';
import { pendingOrdersNumber } from './main.js';
import { state as cuisineState } from '../../models/orders/cuisine.js';
import { ORDER } from '../../config/statusCodes.js';
import { addToCorrectList } from './checker.js';

const controlAcceptOrder = async orderID => {

  const { data, error } = await model.acceptOrder( orderID );

  if ( error ) return addNotification({ text: "Error accepting order", type: MESSAGE.ERROR, duration: 4 });

  PendingOrdersView.removeItems( orderID );

  model.removeStatePendingOrder( orderID );

  addToCorrectList({ status: data.actualStatus, _id: orderID });

  const pendingText = model.state.newOrdersCount > 0 ? model.state.newOrdersCount : '';

  pendingOrdersNumber.textContent = `${ pendingText }`;

};

const controlRejectOrder = async orderID => {

  const { data, error } = await model.rejectOrder( orderID );

  if ( error ) return addNotification({ text: "Error rejecting order", type: MESSAGE.ERROR, duration: 4 });

  PendingOrdersView.removeItems( orderID );

  model.removeStatePendingOrder( orderID );

};

export const controlNotifyEndOfCheck = async () => {

  if ( ViewManager.getRenderedViewID() === PendingOrdersView.getID() ) {

    const { data, error } = await model.loadPendingOrders();

    if ( error ) return;

    const { orders } = data;

    PendingOrdersView.add( ...orders );

  }

};

export const controlNotifyNewPendingOrder = order => {

  const { _id } = order;

  model.state.toLoadIDS.push( _id );

  model.state.newOrdersCount += 1;

  pendingOrdersNumber.textContent = `${ model.state.newOrdersCount }`;

};

export const controlRenderPendingOrders = async () => {

  ViewManager.setRenderPrevious( controlRenderPendingOrders );

  ViewManager.render( PendingOrdersView, {
    items: model.state.orders,
    itemMethods: {
      onAccept: controlAcceptOrder,
      onReject: controlRejectOrder
    }
  }, true);

  if ( model.state.toLoadIDS.length > 0 ) {
    
    const { data, error } = await model.loadPendingOrders();

    PendingOrdersView.add( ...data.orders );

  }

  model.state.newOrdersCount = 0;

  pendingOrdersNumber.textContent = ``;

  closeMobileNavbar();

};