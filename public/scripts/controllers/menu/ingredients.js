import IngredientsView from '../../views/menu/ingredients/IngredientsView.js';

import { closeMobileNavbar, controlConfirmAction } from "../main.js";
import * as model from "../../models/menu/ingredients.js";
import EditIngredientView from '../../views/menu/ingredients/EditIngredientView.js';
import { DEFAULT_DURATION, LONG } from '../../views/general/Notification.js';
import { GENERAL, ITEM } from '../../config/statusCodes.js';
import { addNotification } from '../general/notifications.js';

import { MESSAGE } from '../../config/types.js';
import ViewManager from '../../views/ViewManager.js';

const controlUpdateIngredient = async ingrdientID => {

  const ingredientData = EditIngredientView.getViewData();

  const { data, error } = await model.updateIngredient( ingrdientID, ingredientData );

  const { status } = data;

  const updatingError = { text: "error updating ingredient", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.UPDATING_ERROR ) return addNotification( updatingError );

  if ( status === GENERAL.SUCCESS ) {

    IngredientsView.updateIngredientName( ingrdientID, ingredientData.name );

    EditIngredientView.onSuccess('ingredient updated successfully');

  } else {

    const { invalidFields } = data;

    EditIngredientView.onError( invalidFields );

  }

};

const controlRenderEditIngredient = async ingredientID => {

  const { data, error } = await model.loadIngredient( ingredientID );

  const { status } = data;

  const loadingError = { text: "error loading ingredient", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.LOADING_ERROR ) return addNotification( loadingError );

  EditIngredientView.setTitle('edit ingredient');

  ViewManager.render( EditIngredientView, {
    item: data,
    methods: {
      onGoBack: controlRenderIngredients
    },
    actions: [{ name: 'update', exec: () => { controlUpdateIngredient( ingredientID ); }}]
  }, true);

};

const controlAddIngredient = async () => {

  const ingredientData = EditIngredientView.getViewData();

  const { data, error } = await model.addIngredient( ingredientData );

  const { status } = data;

  const addingError = { text: "error adding ingredient", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.ADDING_ERROR ) return addNotification( addingError );

  if ( status === GENERAL.SUCCESS ) {

    const { newIngredient } = data;

    IngredientsView.add( newIngredient );

    model.addStateIngredients( newIngredient );

    EditIngredientView.onSuccess('ingredient added successfully');

  } else {

    const { invalidFields } = data;

    EditIngredientView.onError( invalidFields );

  }

};

const controlRenderAddIngredient = () => {

  EditIngredientView.setTitle('add ingredient');

  ViewManager.render( EditIngredientView, {
    item: {  },
    methods: {
      onGoBack: controlRenderIngredients
    },
    actions: [{ name: 'add', exec: () => { controlAddIngredient(  ); }}]
  }, true);

};

const controlRemoveIngredient = async ingredientID => {

  const { data, error } = await model.deleteIngredients( ingredientID );

  const { status } = data;

  const removingError = { text: "error removing ingredient", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.DELETING_ERROR ) return addNotification( removingError );

  IngredientsView.removeItems( ingredientID );

  model.removeStateIngredients( ingredientID );

};

const controlRemoveSelectedIngredients = async () => {

  const { selectedIngredients } = model.state;

  await model.deleteSelectedIngredients(  );

  IngredientsView.removeItems( ...selectedIngredients );

  model.state.selectedIngredients = [  ];

  controlUnselectAllIngredients();

};

const controlIngredientSelect = IID => {

  if ( model.state.selectedIngredients.includes( IID ) ) {

    model.state.selectedIngredients.splice( model.state.selectedIngredients.indexOf( IID ), 1 );

    IngredientsView.updateTotalToRemove( model.state.selectedIngredients.length );

    return false;

  }

  model.state.selectedIngredients.push( IID );

  IngredientsView.updateTotalToRemove( model.state.selectedIngredients.length );

  return true;

};

const controlSelectAllIngredients = () => {

  model.state.selectedIngredients = [  ];

  model.selectAllIngredients();

  IngredientsView.selectAll();

  IngredientsView.updateTotalToRemove( model.state.selectedIngredients.length );

};

const controlUnselectAllIngredients = () => {

  model.unselectAllIngredients();

  IngredientsView.unselectAll();

  IngredientsView.updateTotalToRemove( model.state.selectedIngredients.length );

};

export const controlRenderIngredients = async () => {

  if ( !model.state.loadedIngredients ) await model.loadIngredients();

  ViewManager.setRenderPrevious( controlRenderIngredients );

  ViewManager.render( IngredientsView, {
    items: model.state.ingredients,
    methods: {
      onAddItem: controlRenderAddIngredient,
      onRemoveItems: () => { 
        
        controlConfirmAction( 
          `Delete ${ model.state.selectedIngredients.length } ingredients`, 
          { 
            text: "delete", 
            confirmExec: () => { controlRemoveSelectedIngredients(  ); } 
          },
          model.state.ingredients.filter( i => model.state.selectedIngredients.includes( i._id ) ).map( i => { return { _id: i._id, name: i.name } } ) 
        ); 
      
      },
      onSelectAll: controlSelectAllIngredients,
      onUnselectAll: controlUnselectAllIngredients
    },
    itemMethods: {
      onClick: controlRenderEditIngredient,
      onRemove: id => { 
        
        controlConfirmAction(
          `Delete ingredient`, 
          {  
            text: 'delete', 
            confirmExec: () => { controlRemoveIngredient( id ); } 
          },
          [ model.state.ingredients.find( i => i._id === id ) ]
        );

      },
      onSelect: controlIngredientSelect
    }
  }, true);

  closeMobileNavbar();

};

export const controlLoadIngredients = async () => { await loadIngredients(  ); };