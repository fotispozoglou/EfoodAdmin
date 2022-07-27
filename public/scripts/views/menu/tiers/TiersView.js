import EmptyListItem from "../../base/EmptyListItem.js";
import MenuItemsView from "../MenuItemsView.js";
import Tier from "./Tier.js";

export default new class TiersView extends MenuItemsView {
  _itemComponent = Tier;
  _removeTiersBtn;
  _addTiersBtn;
  _totalToRemove;
  id = "tiers";
  title = "tiers";
  _noSearchText = "No Tiers Found";
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Tiers', icon: 'fa-list' }, {  });
  _backURL = "/tiers";
  _searchPlaceholder = "Search Tiers";
  _addURL = "/tiers/add";

  updateTierName( tierID, name ) {

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getID() === tierID ) itemElement.updateName( name );

    }

  }

}