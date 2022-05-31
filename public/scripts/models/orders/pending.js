import { API_SERVER_URL } from "../../config/config.js";
const ORDERS_API_URL = `${ API_SERVER_URL }/orders/admin`;

import { ORDER } from "../../config/statusCodes.js";
import { GET, POST } from "../../general/request.js";

export const state = {
  orders: [],
  toLoadIDS: [],
  newOrdersCount: 0,
  hasInitialized: false
};

export const removeStatePendingOrder = orderID => {

  state.orders.removeMany( '_id', orderID );

  state.newOrdersCount -= 1;

};

export const rejectOrder = async orderID => {

  const { data, error } = await POST(`${ ORDERS_API_URL }/${ orderID }/status`, { newStatus: ORDER.STATUS_CANCELED });

  if ( !error ) {

    return { data };

  }

  return { error };

};

export const acceptOrder = async orderID => {

  const { data, error } = await POST(`${ ORDERS_API_URL }/${ orderID }/status`, { newStatus: ORDER.STATUS_ACCEPTED });

  if ( !error ) {

    return { data };

  }

  return { error };

};

export const loadPendingOrders = async () => {

  if ( state.toLoadIDS < 1 ) return { error: "Nothing To Load" };

  const { data, error } = await POST(`${ ORDERS_API_URL }/load/pending`, { ids: state.toLoadIDS });

  if ( !error ) {

    state.toLoadIDS = [  ];

    state.orders.push( data.orders );

    return { data };

  }

  return { error };

};