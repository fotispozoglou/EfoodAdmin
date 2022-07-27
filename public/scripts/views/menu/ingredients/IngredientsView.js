import EmptyListItem from "../../base/EmptyListItem.js";
import MenuItemsView from "../MenuItemsView.js";
import Ingredient from "./Ingredient.js";

export default new class IngredientsView extends MenuItemsView {
  _itemComponent = Ingredient;
  _removeIngredientsBtn;
  _addIngredientBtn;
  _totalToRemove;
  id = "ingredients";
  title = "ingredients";
  _noSearchText = "No Ingredients Found";
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Ingredients', icon: 'fa-pepper-hot' }, {  });
  _backURL = "/ingredients";
  _searchPlaceholder = "Search Ingredients";
  _addURL = "/ingredients/add";

  updateIngredientName( ingredientID, name ) {

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getID() === ingredientID ) itemElement.updateName( name );

    }

  }

}