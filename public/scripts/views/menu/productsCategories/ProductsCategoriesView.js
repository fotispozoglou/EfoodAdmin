import EmptyListItem from "../../base/EmptyListItem.js";
import MenuItemsView from "../MenuItemsView.js";
import ProductsCategory from "./ProductsCategory.js";

export default new class ProductsCategoriesView extends MenuItemsView {
  _itemComponent = ProductsCategory;
  _addProductsCategoryBtn;
  _removeProductsCategoriesBtn;
  _totalToRemove;
  id = "products_categories";
  title = "products categories";
  _noSearchText = "No Products Categories Found";
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Products Categories', icon: 'fa-list' }, {  });
  _backURL = "/productsCategories";
  _addURL = "/productsCategories/add";

  updateProductsCategoryName( productsCategoryID, name ) {

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getID() === productsCategoryID ) itemElement.updateName( name );

    }

  }

}