import EditItemView from "../../base/EditItemView.js";
import InputElement from "../../general/inputs/InputElement.js";

import NumberInput from "../../general/inputs/NumberInput.js";

export default new class EditIngredientView extends EditItemView {
  title = "edit ingredients";
  _backURL = "/ingredients";

  _generateInputs() {

    const { name = '', price = 1 } = this._data.item;

    const nameElement = new InputElement( "name", name ).build().setPlaceholder('name of ingredient');

    const priceElement = new NumberInput( "price", price, 0.2, 0, 100 ).build().setPlaceholder('price of ingredient');

    this._inputs.push( 
      [ 'name', nameElement], 
      [ 'price', priceElement ]
    );

    this.addDataElements(
      ['name', () => { return nameElement.getValue(); }],
      ['price', () => { return priceElement.getValue(); }]
    );

    return [ nameElement.getElement(), priceElement.getElement() ];

  }

}