import ProductsCategoriesView from '../../views/menu/productsCategories/ProductsCategoriesView.js';

import { closeMobileNavbar, controlConfirmAction } from "../main.js";
import * as model from "../../models/menu/productsCategories.js";
import EditProductsCategoryView from '../../views/menu/productsCategories/EditProductsCategoriesView.js';
import { GENERAL, ITEM } from '../../config/statusCodes.js';
import { addNotification } from '../general/notifications.js';
import { DEFAULT_DURATION, LONG } from '../../views/general/Notification.js';
import { MESSAGE } from '../../config/types.js';
import ViewManager from '../../views/ViewManager.js';
import IngredientsView from '../../views/menu/ingredients/IngredientsView.js';

const controlUpdateProductsCategory = async productsCategoryID => {

  const productsCategoryData = EditProductsCategoryView.getViewData();

  const { data, error } = await model.updateProductsCategory( productsCategoryID, productsCategoryData );

  const { status } = data;

  const updatingError = { text: "error updating products category", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.UPDATING_ERROR ) return addNotification( updatingError );

  if ( status === GENERAL.SUCCESS ) {

    ProductsCategoriesView.updateProductsCategoryName( productsCategoryID, productsCategoryData.name );

    EditProductsCategoryView.onSuccess('products category updated successfully');

  } else {

    const { invalidFields } = data;

    EditProductsCategoryView.onError( invalidFields );

  }

};

const controlRenderEditProductsCategory = async productsCategoryID => {

  const { data, error } = await model.loadProductsCategory( productsCategoryID );

  const { status } = data;

  const loadingError = { text: "error loading products category", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.LOADING_ERROR ) return addNotification( loadingError );

  if ( !error ) {

    EditProductsCategoryView.setTitle('edit products category');

    ViewManager.render( EditProductsCategoryView, {
      item: data,
      methods: {
        onGoBack: controlRenderProductsCategories
      },
      actions: [{ name: 'update', exec: () => { controlUpdateProductsCategory( productsCategoryID ); }}]
    }, true);

  }

};

const controlAddProductsCategory = async () => {

  const productsCategoryData = EditProductsCategoryView.getViewData();

  const { data, error } = await model.addProductsCategory( productsCategoryData );

  const { status } = data;

  const addingError = { text: "error adding products category", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.ADDING_ERROR ) return addNotification( addingError );

  if ( status === GENERAL.SUCCESS ) {

    const { newProductsCategory } = data;

    ProductsCategoriesView.add( newProductsCategory );

    model.addStateProductsCategories( newProductsCategory );

    EditProductsCategoryView.onSuccess('products category added successfully');

  } else {

    const { invalidFields } = data;

    EditProductsCategoryView.onError( invalidFields );

  }

};

const controlRenderAddProductscategory = () => {

  EditProductsCategoryView.setTitle('add products category');

  ViewManager.render( EditProductsCategoryView, {
    item: {  },
    methods: {
      onGoBack: controlRenderProductsCategories
    },
    actions: [{ name: 'add', exec: () => { controlAddProductsCategory(  ); }}]
  }, true);

};

const controlRemoveProductsCategory = async productsCategoryID => {

  const { data, error } = await model.deleteProductsCategories( productsCategoryID );

  const { status } = data;

  const removingError = { text: "error removing products category", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.DELETING_ERROR ) return addNotification( removingError );

  ProductsCategoriesView.removeItems( productsCategoryID );

  model.removeStateProductsCategories( productsCategoryID );

};

const controlRemoveSelectedProductsCategories = async () => {

  const { selectedProductsCategories } = model.state;

  await model.deleteSelectedProductsCategories(  );

  ProductsCategoriesView.removeItems( ...selectedProductsCategories );

  model.state.selectedProductsCategories = [  ];

  controlUnselectAllProductsCategories();

};

const controlProductsCategorySelect = PCID => {

  if ( model.state.selectedProductsCategories.includes( PCID ) ) {

    model.state.selectedProductsCategories.splice( model.state.selectedProductsCategories.indexOf( PCID ), 1 );

    ProductsCategoriesView.updateTotalToRemove( model.state.selectedProductsCategories.length );

    return false;

  }

  model.state.selectedProductsCategories.push( PCID );

  ProductsCategoriesView.updateTotalToRemove( model.state.selectedProductsCategories.length );

  return true;

};

const controlSelectAllProductsCategories = () => {

  model.selectAllProductsCategories();

  ProductsCategoriesView.selectAll();

  ProductsCategoriesView.updateTotalToRemove( model.state.selectedProductsCategories.length );

};

const controlUnselectAllProductsCategories = () => {

  model.unselectAllProductsCategories();

  ProductsCategoriesView.unselectAll();

  ProductsCategoriesView.updateTotalToRemove( model.state.selectedProductsCategories.length );

};

export const controlRenderProductsCategories = async () => {

  if ( !model.state.loadedProductsCategories ) await model.loadProductsCategories();

  ViewManager.setRenderPrevious( controlRenderProductsCategories );

  ViewManager.render( ProductsCategoriesView, {
    items: model.state.productsCategories,
    methods: {
      onAddItem: controlRenderAddProductscategory,
      onRemoveItems: () => { controlConfirmAction( 
          `Delete ${ model.state.selectedProductsCategories.length } products categories`, 
          { 
            text: 'delete', 
            confirmExec: () => { controlRemoveSelectedProductsCategories(  ); }  
          },
          model.state.productsCategories.filter( pc => model.state.selectedProductsCategories.includes( pc._id ) ).map( pc => { return { _id: pc._id, name: pc.name } } )
        ) 
      },
      onSelectAll: controlSelectAllProductsCategories,
      onUnselectAll: controlUnselectAllProductsCategories
    },
    itemMethods: {
      onClick: controlRenderEditProductsCategory,
      onRemove: id => { 
        
        controlConfirmAction(
          `Delete products category`, 
          { 
            text: 'delete', 
            confirmExec: () => { controlRemoveProductsCategory( id ); } 
          },
          [ model.state.productsCategories.find( pc => pc._id === id ) ]
        );

      },
      onSelect: controlProductsCategorySelect
    }
  }, true);

  closeMobileNavbar();

};

export const controlLoadProductsCategories = async () => { await model.loadProductsCategories(  ); };