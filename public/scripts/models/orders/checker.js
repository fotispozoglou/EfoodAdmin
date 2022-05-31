import { GET } from "../../general/request.js";
import { API_SERVER_URL } from "../../config/config.js";
const ORDERS_API_URL = `${ API_SERVER_URL }/orders/admin`;

export const state = {
  lastCheckTime: 0
};

let checkForNewOrdersInterval;

export const checkForNewOrders = async responseCallback => {

  const { data, error } = await GET(`${ ORDERS_API_URL }/live?lct=${ state.lastCheckTime }`);

  if ( !error ) {

    state.lastCheckTime = data.time;

    responseCallback( data );

  }

};

export const startCheckForNewOrders = async responseCallback => {

  checkForNewOrdersInterval = setInterval(async () => checkForNewOrders( responseCallback ) , 10000);

};

export const stopCheckForNewOrders = async () => {

  clearInterval( checkForNewOrdersInterval );

};