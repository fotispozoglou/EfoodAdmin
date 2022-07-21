import EditItemView from "../../base/EditItemView.js";
import InputElement from "../../general/inputs/InputElement.js";

import NumberInput from "../../general/inputs/NumberInput.js";
import SelectionsElement from "../../general/SelectionsElement.js";
import SwitchElement from "../../general/SwitchElement.js";

export default new class EditProductView extends EditItemView {
  title = "edit product";
  _backURL = "/products";

  _generateInputs() {

    const { allTiers, productsCategories } = this._data.itemSupplements;

    const { name = '', price = 1, description = '', quantity = 1, minQuantity = 1, category, tiers = [  ], available } = this._data.item;

    const nameElement = new InputElement( "name", name ).build().setPlaceholder('name of product');

    const priceElement = new NumberInput( "price", price, 1, 0, 100 ).build().setPlaceholder('price of product');

    const selections = [
      {
        name: 'available',
        value: true,
        selected: available === true
      },
      {
        name: 'not available',
        value: false,
        selected: available === false
      }
    ];

    const availableElement = new SwitchElement( selections ).build();

    const minimumQuantityElement = new NumberInput( "minimum quantity", minQuantity, 1, 0, 10 ).build().setPlaceholder('minimum quantity that can be ordered');

    const quantityElement = new NumberInput( "quantity", quantity, 1, 0, 10 ).build().setPlaceholder('initial quantity');

    const descriptionElement = new InputElement( "description", description ).build().setPlaceholder('description');

    const categoryElement = new SelectionsElement( "category", "radio", productsCategories, category, 1 ).build();

    const tiersElement = new SelectionsElement( "tiers", "checkbox", allTiers, tiers, allTiers.length ).build();

    this._inputs.push( 
      [ 'name', nameElement], 
      [ 'price', priceElement ], 
      [ 'available', availableElement ],
      [ 'minQuantity', minimumQuantityElement ], 
      [ 'quantity', quantityElement ], 
      [ 'description', descriptionElement ], 
      [ 'category', categoryElement ],
      [ 'tiers', tiersElement ]
    );

    this.addDataElements(
      ['name', () => { return nameElement.getValue(); }],
      ['price', () => { return priceElement.getValue(); }],
      ['available', () => { return availableElement.getValue(); }],
      ['minQuantity', () => { return minimumQuantityElement.getValue(); }],
      ['quantity', () => { return quantityElement.getValue(); }],
      ['description', () => { return descriptionElement.getValue(); }],
      ['category', () => { return categoryElement.getSelected(); }],
      ['tiers', () => { return tiersElement.getSelected(); }]
    );

    return [ nameElement.getElement(), priceElement.getElement(), minimumQuantityElement.getElement(), quantityElement.getElement(), descriptionElement.getElement(), categoryElement.getElement(), tiersElement.getElement(), availableElement.getElement() ];

  }

}