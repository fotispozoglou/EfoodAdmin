import ProductsView from '../../views/menu/products/ProductsView.js';
import EditProductView from '../../views/menu/products/EditProductView.js';

import { closeMobileNavbar, controlConfirmAction } from "../main.js";
import * as model from "../../models/menu/products.js";

import * as tiersState from '../../models/menu/tiers.js';
import * as productsCategoriesState from '../../models/menu/productsCategories.js';

import { GENERAL, ITEM } from '../../config/statusCodes.js';
import { addNotification } from '../general/notifications.js';
import { LONG } from '../../views/general/Notification.js';
import { MESSAGE } from '../../config/types.js';
import ViewManager from '../../views/ViewManager.js';
import ProductAvailabilityElement from '../../views/general/ProductAvailabilityElement.js';

const controlUpdateProduct = async productID => {

  const productData = EditProductView.getViewData();

  const { data, error } = await model.updateProduct( productID, productData );

  const { status } = data;

  const updatingError = { text: "error updating product", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.UPDATING_ERROR ) return addNotification( updatingError );

  if ( status === GENERAL.SUCCESS ) {

    ProductsView.updateProductName( productID, productData.name );

    EditProductView.onSuccess('product updated successfully');

  } else {

    const { invalidFields } = data;

    EditProductView.onError( invalidFields );

  }

};

const controlRenderEditProduct = async productID => {

  const { data: { data: product, status }, error } = await model.loadProduct( productID );

  const loadingError = { text: "error loading product", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.LOADING_ERROR ) return addNotification( loadingError );

  EditProductView.setTitle('edit product');

  ViewManager.render( EditProductView,
    {
      item: product,
      methods: {
        onGoBack: controlRenderProducts
      },
      itemSupplements: {
        allTiers: tiersState.state.tiers,
        productsCategories: productsCategoriesState.state.productsCategories
      },
      actions: [{ name: 'update', exec: () => { controlUpdateProduct( productID ); }}]
    }, true);

};

const controlAddProduct = async () => {

  const productData = EditProductView.getViewData();

  const { data, error } = await model.addProduct( productData );

  const { status } = data;

  const addingError = { text: "error adding product", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.ADDING_ERROR ) return addNotification( addingError );

  if ( status === GENERAL.SUCCESS ) {

    const { newProduct } = data;

    ProductsView.add( newProduct );
    
    model.addStateProducts( newProduct );

    EditProductView.onSuccess('product added successfully');

  } else {

    const { invalidFields } = data;

    EditProductView.onError( invalidFields );

  }

};

const controlRenderAddProduct = () => {

  EditProductView.setTitle('add product');

  ViewManager.render( EditProductView,
    {
      item: {  },
      methods: {
        onGoBack: controlRenderProducts
      },
      itemSupplements: {
        allTiers: tiersState.state.tiers,
        productsCategories: productsCategoriesState.state.productsCategories
      },
      actions: [{ name: 'add', exec: () => { controlAddProduct(  ); }}]
    }, true);

};

const controlRemoveProduct = async productID => {

  const { data, error } = await model.deleteProducts( productID );

  const { status } = data;

  const removingError = { text: "error deleting product", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error || status === ITEM.DELETING_ERROR ) return addNotification( removingError );

  ProductsView.removeItems( productID );

  model.removeStateProducts( productID );

  model.removeSelectedProduct( productID );

  ProductsView.updateTotalToRemove( model.state.selectedProducts.length );

};

const controlRemoveSelectedProducts = async () => {

  const { selectedProducts } = model.state;

  await model.deleteSelectedProducts(  );

  ProductsView.removeItems( ...selectedProducts );

  model.state.selectedProducts = [  ];

  controlUnselectAllProducts();

};

const controlProductSelect = PID => {

  if ( model.state.selectedProducts.includes( PID ) ) {

    model.state.selectedProducts.splice( model.state.selectedProducts.indexOf( PID ), 1 );

    ProductsView.updateTotalToRemove( model.state.selectedProducts.length );

    return false;

  }

  model.state.selectedProducts.push( PID );

  ProductsView.updateTotalToRemove( model.state.selectedProducts.length );

  return true;

};

const controlSelectAllProducts = () => {

  model.selectAllProducts();

  ProductsView.selectAll();

  ProductsView.updateTotalToRemove( model.state.selectedProducts.length );

};

const controlUnselectAllProducts = () => {

  model.unselectAllProducts();

  ProductsView.unselectAll();

  ProductsView.updateTotalToRemove( model.state.selectedProducts.length );

};

const controlChangeProductAvailability = async ( id, available ) => {

  const { data, error } = await model.updateProductAvailability( id, available );

  const availabilityError = { text: "error setting availability", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error ) return addNotification( availabilityError );

  ProductsView.updateProductAvailability( id, available );

};

const controlSwitchSelectedAvailability = async (  ) => {

  const { selectedProducts } = model.state;

  const { data, error } = await model.switchSelectedAvailability();

  const availabilityError = { text: "error setting availability", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

  if ( error ) return addNotification( availabilityError );

  model.updateProductsStateAvailability( data.products );

  ProductsView.updateProductsAvailability( data.products );

};

export const controlRenderProducts = async () => {

  ViewManager.setRenderPrevious( controlRenderProducts );

  if ( !model.state.loadedProducts ) await model.loadProducts(); 

  ViewManager.render( ProductsView, {
    items: model.state.products,
    methods: {
      onAddItem: controlRenderAddProduct,
      onRemoveItems: () => { 
        
        controlConfirmAction(
          `Delete ${ model.state.selectedProducts.length } products`, 
          { 
            text: 'delete', 
            confirmExec: () => { controlRemoveSelectedProducts(  ); }
          },
          model.state.products.filter( p => model.state.selectedProducts.includes( p._id ) ).map( p => { return { _id: p._id, name: p.name } } )
        );

      },
      onSelectAll: controlSelectAllProducts,
      onUnselectAll: controlUnselectAllProducts,
      onSwitchAvailability: () => { 
        
        controlConfirmAction(
          `Switch Availability Of ${ model.state.selectedProducts.length } Products`, 
          { 
            text: 'delete', 
            confirmExec: () => { controlSwitchSelectedAvailability(  ); },
          },
          model.state.products.filter( p => model.state.selectedProducts.includes( p._id ) ).map( p => { return { _id: p._id, name: p.name, available: p.available } } ),
          ProductAvailabilityElement
        );

      }
    },
    itemMethods: {
      onClick: controlRenderEditProduct,
      onRemove: id => { 
        
        controlConfirmAction(
          `Delete product`, 
          { 
            text: 'delete', 
            confirmExec: () => { controlRemoveProduct( id ); } 
          },
          [ model.state.products.find( p => p._id === id ) ]
        ); 

      },
      onSelect: controlProductSelect,
      onChangeAvailability: ( id, value ) => { controlChangeProductAvailability( id, value ); }
    }
  }, true);

  closeMobileNavbar();

};