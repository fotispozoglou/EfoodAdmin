import { closeMobileNavbar, controlConfirmAction, setSelectedButton } from "../general.js";
import * as model from "../../models/menu/productsCategories.js";
import EditProductsCategoryView from '../../views/menu/productsCategories/EditProductsCategoriesView.js';
import { GENERAL, ITEM } from '../../config/statusCodes.js';
import { showNotification } from '../general/notifications.js';
import { MESSAGE } from '../../config/types.js';
import ViewManager from '../../views/ViewManager.js';
import { mobileNavbarProductsCategoriesBtn } from './main.js';

import ProductsCategoriesView from '../../views/menu/productsCategories/ProductsCategoriesView.js';

const controlUpdateProductsCategory = async productsCategoryID => {

  const productsCategoryData = EditProductsCategoryView.getViewData();

  const { data, error } = await model.updateProductsCategory( productsCategoryID, productsCategoryData );

  if ( error || data.status === ITEM.UPDATING_ERROR ) return showNotification( "error updating products category", MESSAGE.MESSAGE_ERROR );

  if ( data.status === GENERAL.SUCCESS ) {

    ProductsCategoriesView.updateProductsCategoryName( productsCategoryID, productsCategoryData.name );

    EditProductsCategoryView.onSuccess('products category updated successfully');

  } else {

    const { invalidFields } = data;

    EditProductsCategoryView.onError( invalidFields );

  }

};

export const controlRenderEditProductsCategory = async ({productsCategoryID}) => {

  const { data, error } = await model.loadProductsCategory( productsCategoryID );

  if ( error || data.status === ITEM.LOADING_ERROR ) return showNotification( "error loading products category", MESSAGE.MESSAGE_ERROR );

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

  if ( error || data.status === ITEM.ADDING_ERROR ) return showNotification( "error adding products category", MESSAGE.MESSAGE_ERROR );

  if ( data.status === GENERAL.SUCCESS ) {

    const { newProductsCategory } = data;

    ProductsCategoriesView.add( newProductsCategory );

    model.addStateProductsCategories( newProductsCategory );

    EditProductsCategoryView.onSuccess('products category added successfully');

  } else {

    const { invalidFields } = data;

    EditProductsCategoryView.onError( invalidFields );

  }

};

export const controlRenderAddProductsCategory = () => {

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

  if ( error || data.status === ITEM.DELETING_ERROR ) return showNotification( "error deleting products category", MESSAGE.MESSAGE_ERROR );

  ProductsCategoriesView.removeItems( productsCategoryID );

  model.removeStateProductsCategories( productsCategoryID );

};

const controlRemoveSelectedProductsCategories = async () => {

  const { selectedProductsCategories } = model.state;

  const { data, error } = await model.deleteSelectedProductsCategories(  );

  if ( error || data.status === ITEM.DELETING_ERROR ) return showNotification("error deleting products categories", MESSAGE.MESSAGE_ERROR);

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

const controlRemoveProductsCategories = () => {

  controlConfirmAction( 
    `Delete ${ model.state.selectedProductsCategories.length } products categories`, 
    { 
      text: 'delete', 
      confirmExec: () => { controlRemoveSelectedProductsCategories(  ); }  
    },
    model.state.productsCategories.filter( pc => model.state.selectedProductsCategories.includes( pc._id ) ).map( pc => { return { _id: pc._id, name: pc.name } } )
  );

};

const controlRemoveProductsCategoryAsk = id => { 
        
  controlConfirmAction(
    `Delete products category`, 
    { 
      text: 'delete', 
      confirmExec: () => { controlRemoveProductsCategory( id ); } 
    },
    [ model.state.productsCategories.find( pc => pc._id === id ) ]
  );

};

export const controlRenderProductsCategories = async () => {

  setSelectedButton( mobileNavbarProductsCategoriesBtn );

  ViewManager.render( ProductsCategoriesView, {
    items: model.state.productsCategories,
    loding: !model.state.loadedProductsCategories,
    methods: {
      onAddItem: controlRenderAddProductsCategory,
      onRemoveItems: controlRemoveProductsCategories,
      onSelectAll: controlSelectAllProductsCategories,
      onUnselectAll: controlUnselectAllProductsCategories
    },
    itemMethods: {
      onClick: controlRenderEditProductsCategory,
      onRemove: controlRemoveProductsCategoryAsk,
      onSelect: controlProductsCategorySelect
    }
  }, true);

  if ( !model.state.loadedProductsCategories ) {
    
    await model.loadProductsCategories();

    ProductsCategoriesView.add( ...model.state.productsCategories );

  }

  closeMobileNavbar();

};

export const controlLoadProductsCategories = async () => { await model.loadProductsCategories(  ); };