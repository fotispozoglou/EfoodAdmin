import TiersView from '../../views/menu/tiers/TiersView.js';

import { closeMobileNavbar, controlConfirmAction } from "../main.js";
import * as model from "../../models/menu/tiers.js";
import EditTiersView from '../../views/menu/tiers/EditTiersView.js';

import { state as ingredientsState, loadIngredients } from '../../models/menu/ingredients.js';
import { GENERAL, ITEM } from '../../config/statusCodes.js';
import { addNotification } from '../general/notifications.js';
import { DEFAULT_DURATION, LONG } from '../../views/general/Notification.js';
import { MESSAGE } from '../../config/types.js';
import ViewManager from '../../views/ViewManager.js';

const controlUpdateTier = async tierID => {

  const tierData = EditTiersView.getViewData();

  const { data, error } = await model.updateTier( tierID, tierData );

  const { status } = data;

  const updatingError = { text: "error updating tier", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( status === GENERAL.SUCCESS ) {

    TiersView.updateTierName( tierID, tierData.name );

    EditTiersView.onSuccess('tier updated successfully');

  } else {

    const { invalidFields } = data;

    EditTiersView.onError( invalidFields );

  }

};

const controlRenderEditTier = async tierID => {

  if ( !ingredientsState.loadedIngredients ) await loadIngredients();

  const { data, error } = await model.loadTier( tierID );

  const { status } = data;

  const loadingError = { text: "error loading tier", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.LOADING_ERROR ) return addNotification( loadingError );

  ViewManager.render( EditTiersView, {
    item: data,
    methods: {
      onGoBack: controlRenderTiers
    },
    itemSupplements: {
      allIngredients: ingredientsState.ingredients
    },
    actions: [{ name: 'update', exec: () => { controlUpdateTier( tierID ); }}]
  }, true);

};

const controlAddTier = async () => {

  const tierData = EditTiersView.getViewData();

  const { data, error } = await model.addTier( tierData );

  const { status } = data;

  const addingError = { text: "error adding tier", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.ADDING_ERROR ) return addNotification( addingError );

  if ( status === GENERAL.SUCCESS ) {

    const { newTier } = data;

    TiersView.add( newTier );

    model.addStateTiers( newTier );

    EditTiersView.onSuccess('tier added successfully');

  } else {

    const { invalidFields } = data;

    EditTiersView.onError( invalidFields );

  }

};

const controlRenderAddTier = async () => {

  if ( !ingredientsState.loadedIngredients ) await loadIngredients();

  ViewManager.render( EditTiersView, {
    item: {  },
    methods: {
      onGoBack: controlRenderTiers
    },
    itemSupplements: {
      allIngredients: ingredientsState.ingredients
    },
    actions: [{ name: 'add', exec: () => { controlAddTier(  ); }}]
  }, true);

};

const controlRemoveTier = async tierID => {

  const { data, error } = await model.deleteTiers( tierID );

  const { status } = data;

  const removingError = { text: "error removing tier", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.DELETING_ERROR ) return addNotification( removingError );

  TiersView.removeItems( tierID );

  model.removeStateTiers( tierID );

};

const controlRemoveSelectedTiers = async () => {

  const { selectedTiers } = model.state;

  await model.deleteSelectedTiers(  );

  TiersView.removeItems( ...selectedTiers );

  model.state.selectedTiers = [  ];

  controlUnselectAllTiers();

};

const controlTierSelect = TID => {

  if ( model.state.selectedTiers.includes( TID ) ) {

    model.state.selectedTiers.splice( model.state.selectedTiers.indexOf( TID ), 1 );

    TiersView.updateTotalToRemove( model.state.selectedTiers.length );

    return false;

  }

  model.state.selectedTiers.push( TID );
  
  TiersView.updateTotalToRemove( model.state.selectedTiers.length );

  return true;

};

const controlSelectAllTiers = () => {

  model.state.selectedTiers = [  ];

  model.selectAllTiers();

  TiersView.selectAll();

  TiersView.updateTotalToRemove( model.state.selectedTiers.length );

};

const controlUnselectAllTiers = () => {

  model.unselectAllProducts();

  TiersView.unselectAll();

  TiersView.updateTotalToRemove( model.state.selectedTiers.length );

};

export const controlRenderTiers = async () => {

  if ( !model.state.loadedTiers ) await model.loadTiers();

  ViewManager.setRenderPrevious( controlRenderTiers );

  ViewManager.render( TiersView, {
    items: model.state.tiers,
    methods: {
      onAddItem: controlRenderAddTier,
      onRemoveItems: () => { 
        
        controlConfirmAction( 
          `Delete ${ model.state.selectedTiers.length } tiers`, 
          { 
            text: 'delete', 
            confirmExec: () => { controlRemoveSelectedTiers(  ); } 
          },
          model.state.tiers.filter( t => model.state.selectedTiers.includes( t._id ) ).map( t => { return { _id: t._id, name: t.name } } ) 
        );

      },
      onSelectAll: controlSelectAllTiers,
      onUnselectAll: controlUnselectAllTiers
    },
    itemMethods: {
      onClick: controlRenderEditTier,
      onRemove: id => { 
        
        controlConfirmAction(
          `Delete tier`, 
          { 
            text: 'delete', 
            confirmExec: () => { controlRemoveTier( id ); } 
          },
          [ model.state.tiers.find( t => t._id === id ) ]
        );

      },
      onSelect: controlTierSelect
    }
  }, true);

  closeMobileNavbar();

};

export const controlLoadTiers = async () => { await model.loadTiers(  ); };