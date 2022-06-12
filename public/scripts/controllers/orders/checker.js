import * as model from '../../models/orders/checker.js';
import { ORDER } from '../../config/statusCodes.js';
import { controlNotifyNewPendingOrder, controlNotifyEndOfCheck as notifyPendingEnd } from './pending.js';
import { controlNotifyNewCuisineOrder, controlNotifyEndOfCheck as notifyCuisineEnd } from './cuisine.js';
import { controlNotifyNewDeliveryOrder, controlNotifyEndOfCheck as notifyDeliveryEnd } from './delivery.js';

export const controlCheckOrders = async data => {

  const { orders } = data;

  if ( orders.length > 0 ) {

    for ( const order of orders ) {

      if ( order.status.number === ORDER.STATUS_PENDING ) controlNotifyNewPendingOrder( order );

      if ( order.status.number === ORDER.STATUS_ACCEPTED ) controlNotifyNewCuisineOrder( order );

      if ( order.status.number === ORDER.STATUS_DELIVERING ) controlNotifyNewDeliveryOrder( order );
      
    }

  }

  notifyPendingEnd();

  notifyDeliveryEnd();

  notifyCuisineEnd();

};

export const addToCorrectList = order => {

  if ( order.status.number === ORDER.STATUS_PENDING ) controlNotifyNewPendingOrder( order );

  if ( order.status.number === ORDER.STATUS_ACCEPTED ) controlNotifyNewCuisineOrder( order );

  if ( order.status.number === ORDER.STATUS_DELIVERING ) controlNotifyNewDeliveryOrder( order );

};

export const start = async () => {

  model.checkForNewOrders( controlCheckOrders ).then(() => {

    setTimeout(() => { model.startCheckForNewOrders( controlCheckOrders ); }, 10000);

  });

  window.stopCheck = () => { model.stopCheckForNewOrders(); };

};