import DOMElement from '../base/DOMElement.js';

export default class AnalyticsTable extends DOMElement {
  _data;
  _tableBody;
  _labelsColumn;
  _valuesColumn;

  constructor( data ) {
    super("table");

    this._data = data;

  }

  update( analytics ) {

    this._labelsColumn.empty();
    this._valuesColumn.empty();

    for ( const { label, value } of analytics ) {

      this._labelsColumn.append( new DOMElement("th").setClass('table_label').setText( label ).getElement() );

      this._valuesColumn.append( new DOMElement("td").setClass('table_value').setText( value ).getElement() );

    }

  }

  build() {

    const tableTitle = new DOMElement("td").setClass('table_title').setText('orders').getElement();

    const tableHeader = new DOMElement("thead").append( tableTitle ).getElement();

    this._tableBody = new DOMElement("tbody");

    this._labelsColumn = new DOMElement("tr").setClass('table_labels');

    this._valuesColumn = new DOMElement("tr").setClass('table_values');

    for ( const { label, value } of this._data ) {

      this._labelsColumn.append( new DOMElement("th").setClass('table_label').setText( label ).getElement() );

      this._valuesColumn.append( new DOMElement("td").setClass('table_value').setText( value ).getElement() );

    }

    this._tableBody.append( this._labelsColumn.getElement(), this._valuesColumn.getElement() );

    this.append( tableHeader, this._tableBody.getElement() ).getElement();

    return this._element;

  }

};