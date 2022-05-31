import { ORDER } from "../../config/statusCodes.js";
import { API_SERVER_URL, SERVER_IP, SERVER_URL } from "../../config/config.js";
const ORDERS_API_URL = `${ API_SERVER_URL }/orders/admin`;
const CLIENT_SERVER_URL = `http://${ SERVER_IP }:8000`;

import { GET, POST } from '../../general/request.js';

export const state = {
  loadedDeliveryOrders: false,
  newOrdersCount: 0,
  toLoadIDS: [],
  orders: []
}

export const loadDeliveryOrders = async () => {

  if ( state.toLoadIDS < 1 ) return { error: "Nothing To Load" };

  const { data, error } = await POST(`${ ORDERS_API_URL }/load/delivery`, { ids: state.toLoadIDS });

  if ( !error ) {

    state.toLoadIDS = [  ];

    state.orders.push( data.orders );

    return { data };

  }

  return { error };

};

export const completeOrder = async orderID => {

  const { data, error } = await POST(`${ ORDERS_API_URL }/${ orderID }/status`, { newStatus: ORDER.STATUS_COMPLETED });

  if ( !error ) {

    return { data };

  }

  return { error };

};

export const loadDeliveryOrder = async orderID => {

  const { data, error } = await GET(`${ ORDERS_API_URL }/delivery/${ orderID }`);

  if ( !error ) {

    return { order: data.order };

  }

  return { error };

};