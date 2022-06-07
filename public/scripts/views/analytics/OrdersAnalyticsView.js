import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';

import LineChart from '../general/charts/LineChart.js';

export default new class OrdersAnalyticsView extends View {
  title = "orders analytics";
  _parent = document.querySelector("#main_center");

  _generateElement() {

    const { orders } = this._data;

    const weeklyOrdersData = [  ];

    const dailyIncomeData = [  ];

    for ( let index = 0; index < orders.labels.length; index += 1 ) {

      weeklyOrdersData.push({  label: orders.labels[index], value: orders.values[ index ] });

      const randomOrdersPrice = Math.floor( (Math.random() * 12) + 4 ) * orders.values[ index ];

      dailyIncomeData.push({  label: orders.labels[index], value: randomOrdersPrice });

    }   

    const allOrdersChart = new LineChart( "Daily Orders", weeklyOrdersData, {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }).build('#c44b4b');

    const dailyIncomeChart = new LineChart( "Daily Income ( € )", dailyIncomeData, {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }).build('#1EB413');

    return new DOMElement("div")
      .setID("orders_analytics")
      .append( allOrdersChart, dailyIncomeChart )
      .getElement();

  }

};