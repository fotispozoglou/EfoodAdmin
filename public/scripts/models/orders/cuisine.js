import { ORDER } from "../../config/statusCodes.js";
import { API_SERVER_URL } from "../../config/config.js";
const ORDERS_API_URL = `${ API_SERVER_URL }/orders/admin`;

import { GET, POST } from '../../general/request.js';

export const state = {
  orders: [  ],
  toLoadIDS: [  ],
  newOrdersCount: 0,
  loadedCuisineOrders: false
};

export const loadOrder = async orderID => {

  const { data, error } = await GET(`${ ORDERS_API_URL }/${ orderID }/products`);

  if ( error ) return { error };

  return { data };

};

export const loadAcceptedOrders = async () => {

  if ( state.toLoadIDS < 1 ) return { error: "Nothing To Load" };

  const { data, error } = await POST(`${ ORDERS_API_URL }/load/accepted`, { ids: state.toLoadIDS });

  if ( !error ) {

    state.toLoadIDS = [  ];

    state.orders.push( data.orders );

    return { data };

  }

  return { error };

};

export const readyOrder = async orderID => {

  const { data, error } = await POST(`${ ORDERS_API_URL }/${ orderID }/status`, { newStatus: ORDER.STATUS_DELIVERING });

  if ( !error ) {

    return { data };

  }

  console.log( error );

};