import { API_SERVER_URL } from "../../config/config.js";
import { GET } from "../../general/request.js";

export const state = {

};

export const loadAllOrdersAnalytics = async () => {

  const { data, error } = await GET(`${ API_SERVER_URL }/analytics/orders/all`);

  if ( error ) return { error };

  return { data };

};