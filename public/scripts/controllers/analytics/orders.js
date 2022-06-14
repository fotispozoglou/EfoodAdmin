import ViewManager from '../../views/ViewManager.js';
import OrdersAnalyticsView from "../../views/analytics/OrdersAnalyticsView.js";

import { addNotification, showNotification } from '../general/notifications.js';
import { LONG } from '../../views/general/Notification.js';
import { MESSAGE } from '../../config/types.js';

import * as model from '../../models/analytics/orders.js';

import { closeMobileNavbar, controlConfirmAction, setSelectedButton } from "../main.js";
import { ordersAnalyticsBtn } from './main.js';

export const controlRenderOrdersAnalytics = async () => {

  const { data, error } = await model.loadAllOrdersAnalytics();

  if ( error ) return showNotification( "Error Loading Analytics", MESSAGE.MESSAGE_ERROR );

  const { orders } = data;

  ViewManager.render( OrdersAnalyticsView, {
    orders
  }, true );

  setSelectedButton( ordersAnalyticsBtn );

  closeMobileNavbar();

};