import ViewManager from '../../views/ViewManager.js';
import OrdersAnalyticsView from "../../views/analytics/OrdersAnalyticsView.js";

import { addNotification } from '../general/notifications.js';
import { LONG } from '../../views/general/Notification.js';
import { MESSAGE } from '../../config/types.js';

import * as model from '../../models/analytics/orders.js';

import { closeMobileNavbar, controlConfirmAction, setSelectedButton } from "../main.js";
import { ordersAnalyticsBtn } from './main.js';

export const controlRenderOrdersAnalytics = async () => {

  const { data, error } = await model.loadAllOrdersAnalytics();

  const notification = { text: "Error Loading Analytics", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error ) return addNotification( notification );

  const { orders } = data;

  ViewManager.render( OrdersAnalyticsView, {
    orders
  }, true );

  setSelectedButton( ordersAnalyticsBtn );

  closeMobileNavbar();

};