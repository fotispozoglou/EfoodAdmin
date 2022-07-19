import { API_SERVER_URL } from "../../config/config.js";
const ORDERS_API_URL = `${ API_SERVER_URL }/orders/admin`;

import { GET, POST } from '../../general/request.js';

export const state = {
  orders: [  ],
  initialCheckTime: 0,
  newOrdersCount: 0,
  currentPage: 0,
  lastPage: false,
  toLoadIDS: [  ],
  loadedCompletedOrders: false
};

const isInOrders = orderID => {

  return state.orders.findIndex(order => order._id === orderID);

};

export const addOrders = ( ...orders ) => {

  for ( const order of orders ) {

    if ( !isInOrders( order._id ) ) {

      state.orders.push( order );
  
    }

  }

};

export const loadOrder = async orderID => {

  const { data, error } = await GET(`${ ORDERS_API_URL }/${ orderID }/products`);

  if ( error ) return { error };

  return { data };

};

export const searchCompletedOrders = async ( value, excluded ) => {

  const { data, error } = await POST(`${ ORDERS_API_URL }/completed/search`, { value, excluded });

  if ( !error ) {

    return { data };

  }

  return { error };

};

export const loadCompletedOrders = async () => {

  const { data, error } = await GET(`${ ORDERS_API_URL }/completed?page=${ state.currentPage + 1 }&ict=${ state.initialCheckTime }`);

  if ( !error ) {

    state.orders.push( ...data.orders );

    state.currentPage += 1;

    return { data };

  }

  return { error };

};