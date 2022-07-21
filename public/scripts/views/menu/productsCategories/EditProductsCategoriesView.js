import EditItemView from "../../base/EditItemView.js";
import InputElement from "../../general/inputs/InputElement.js";

export default new class EditProductsCategoriesView extends EditItemView {
  title = "edit products category";
  _backURL = "/productsCategories";

  _generateInputs() {

    const { name = '' } = this._data.item;

    const nameElement = new InputElement( "name", name ).build().setPlaceholder('name of category');

    this._inputs.push( [ 'name', nameElement ] );

    this._inputs.push( 
      [ 'name', nameElement]
    );

    this.addDataElements(
      ['name', () => { return nameElement.getValue(); }]
    );

    return [ nameElement.getElement() ];

  }

}