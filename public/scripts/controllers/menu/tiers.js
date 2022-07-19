import TiersView from '../../views/menu/tiers/TiersView.js';

import { closeMobileNavbar, controlConfirmAction, setSelectedButton } from "../main.js";
import * as model from "../../models/menu/tiers.js";
import EditTiersView from '../../views/menu/tiers/EditTiersView.js';

import { state as ingredientsState, loadIngredients } from '../../models/menu/ingredients.js';
import { GENERAL, ITEM } from '../../config/statusCodes.js';
import { showNotification } from '../general/notifications.js';
import { MESSAGE } from '../../config/types.js';
import ViewManager from '../../views/ViewManager.js';
import { mobileNavbarTiersBtn } from './main.js';

const controlUpdateTier = async tierID => {

  const tierData = EditTiersView.getViewData();

  const { data, error } = await model.updateTier( tierID, tierData );

  if ( error || data.status === ITEM.UPDATING_ERROR ) return showNotification( "error updating tier", MESSAGE.MESSAGE_ERROR );

  if ( data.status === GENERAL.SUCCESS ) {

    TiersView.updateTierName( tierID, tierData.name );

    EditTiersView.onSuccess('tier updated successfully');

  } else {

    const { invalidFields } = data;

    EditTiersView.onError( invalidFields );

  }

};

export const controlRenderEditTier = async ({tierID}) => {

  if ( !ingredientsState.loadedIngredients ) await loadIngredients();

  const { data, error } = await model.loadTier( tierID );

  if ( error || data.status === ITEM.LOADING_ERROR ) return showNotification( "error loading tier", MESSAGE.MESSAGE_ERROR );

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

  if ( error || data.status === ITEM.ADDING_ERROR ) return showNotification( "error adding tier", MESSAGE.MESSAGE_ERROR );

  if ( data.status === GENERAL.SUCCESS ) {

    const { newTier } = data;

    TiersView.add( newTier );

    model.addStateTiers( newTier );

    EditTiersView.onSuccess('tier added successfully');

  } else {

    const { invalidFields } = data;

    EditTiersView.onError( invalidFields );

  }

};

export const controlRenderAddTier = async () => {

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

  if ( error || data.status === ITEM.DELETING_ERROR ) return showNotification( "error deleting tier", MESSAGE.MESSAGE_ERROR );

  TiersView.removeItems( tierID );

  model.removeStateTiers( tierID );

};

const controlRemoveSelectedTiers = async () => {

  const { selectedTiers } = model.state;

  const { data, error } = await model.deleteSelectedTiers(  );

  if ( error || data.status === ITEM.DELETING_ERROR ) return showNotification("error deleting tiers", MESSAGE.MESSAGE_ERROR);

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

  setSelectedButton( mobileNavbarTiersBtn );

  if ( !model.state.loadedTiers ) await model.loadTiers();

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