import DOMElement from '../../base/DOMElement.js';

export class ChartElement extends DOMElement {
  _type;
  _data;
  _options;
  _chart;
  _title;
  _context;
  _type = 'line';
  _chartCanvas;

  constructor( title, data = [], options ) {
    super("div");

    this._title = title;
    this._data = data;
    this._options = options;

    this._chartCanvas = document.createElement("canvas");

    this._context = this._chartCanvas.getContext('2d');

  }

  build( color ) {

    const labels = this._data.map(d => d.label);
    const chartData = this._data.map(d => d.value);

    this._options.responsive = true;

    const config = {
      type: this._type,
      data: {
        labels: labels,
        datasets: [
          {
            label: this._title,
            data: chartData,
            fill: true,
            borderColor: `${ color }`,
            backgroundColor: `${ color }a1`
          },
        ],
      },
      options: this._options
    };

    this._chart = new Chart( this._context, config );

    window.test = this._chart;

    this.append( this._chartCanvas ).setClass('chart_element');

    return this.getElement();

  }

}