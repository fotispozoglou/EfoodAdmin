import * as model from '../../models/orders/pending.js';
import PendingOrdersView from '../../views/orders/pending/PendingOrdersView.js';
import ViewManager from '../../views/ViewManager.js';
import { closeMobileNavbar } from '../main.js';
import { pendingOrdersNumber } from './main.js';
import { addToCorrectList } from './checker.js';
import { showNotification } from '../general/notifications.js';
import { MESSAGE } from '../../config/types.js';
import { SHORT } from '../../views/general/Notification.js';

const controlAcceptOrder = async orderID => {

  const { data, error } = await model.acceptOrder( orderID );

  if ( error ) return showNotification("error accepting order", MESSAGE.MESSAGE_ERROR);

  PendingOrdersView.removeItems( orderID );

  model.removeStatePendingOrder( orderID );

  addToCorrectList({ status: data.actualStatus, _id: orderID });

  const pendingText = model.state.newOrdersCount > 0 ? model.state.newOrdersCount : '';

  pendingOrdersNumber.textContent = `${ pendingText }`;

  showNotification("order accepted", MESSAGE.MESSAGE_SUCCESS, SHORT);

};

const controlRejectOrder = async orderID => {

  const { data, error } = await model.rejectOrder( orderID );

  if ( error ) return showNotification("error rejecting order", MESSAGE.MESSAGE_ERROR);

  PendingOrdersView.removeItems( orderID );

  model.removeStatePendingOrder( orderID );

  showNotification("order rejected", MESSAGE.MESSAGE_SUCCESS, SHORT);

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

  ViewManager.render( PendingOrdersView, {
    items: model.state.orders,
    itemMethods: {
      onAccept: controlAcceptOrder,
      onReject: controlRejectOrder
    }
  }, true);

  if ( model.state.toLoadIDS.length > 0 ) {
    
    const { data, error } = await model.loadPendingOrders();

    if ( error ) return showNotification("error loading orders", MESSAGE.MESSAGE_ERROR);

    PendingOrdersView.add( ...data.orders );

  }

  pendingOrdersNumber.textContent = ``;

  closeMobileNavbar();

};