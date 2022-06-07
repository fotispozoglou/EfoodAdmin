import { ChartElement } from "./ChartElement.js";

export default class LineChart extends ChartElement {
  _type = 'bar';

  constructor( title, data, options ) {
    super( title, data, options );


  }

};