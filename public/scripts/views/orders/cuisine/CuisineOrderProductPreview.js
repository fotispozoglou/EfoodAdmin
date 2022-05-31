import DOMElement from "../../base/DOMElement.js";

export default class CuisineOrderProductPreview extends DOMElement {
  _original;
  _quantity;

  constructor({ original, quantity }) {  
    super("div");

    this._original = original;
    this._quantity = quantity;

  }

  generateRow( header, data ) {

    const th = new DOMElement("th").setText( header ).setClass('cuisine_order_product_preview_quantity').getElement();
    
    const td = new DOMElement("td").setText( data ).setClass('cuisine_order_product_preview_name').getElement();

    const element = new DOMElement("tr").setClass('cuisine_order_product_preview_row').append( th, td );

    return element.getElement();

  }

  build() {

    const tableData = [
      [`${ this._quantity }x`, this._original.name ], 
    ].map( td => this.generateRow( td[0], td[1] ) );

    this.setClass('cuisine_order_product_preview').append( ...tableData );

    return this._element;

  }

};