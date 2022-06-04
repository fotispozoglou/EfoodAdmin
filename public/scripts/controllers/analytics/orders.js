import ViewManager from '../../views/ViewManager.js';
import OrdersAnalyticsView from "../../views/analytics/OrdersAnalyticsView.js";

export const controlRenderOrdersAnalytics = async () => {

  ViewManager.render( OrdersAnalyticsView, {}, true );

};