import { API_SERVER_URL } from "../../config/config.js";
const PRODUCTS_URL = `${ API_SERVER_URL }/products`;

import { GET, POST, DELETE, PUT, POST_FORM } from "../../general/request.js";

export const state = {
  products: [  ],
  selectedProducts: [  ],
  loadedProducts: false
};

export const selectAllProducts = () => {

  state.selectedProducts.push( ...state.products.filter( p => !state.selectedProducts.includes( p._id ) ).map( sp => sp._id ) );

};

export const unselectAllProducts = () => {

  state.selectedProducts = [  ];

};

export const addSelectedProduct = productID => {

  state.selectedProducts.push( productID );

};

export const removeSelectedProduct = productID => {

  state.selectedProducts.splice( state.selectedProducts.indexOf( productID ), 1 );

};

export const addStateProducts = ( ...newProducts ) => {

  state.products.push( ...newProducts );

};

export const removeStateProducts = ( ...productsIDS ) => {

  state.products.removeMany( '_id', ...productsIDS );

};

export const addProduct = async data => {

  const { data: response, error } = await POST(`${ PRODUCTS_URL }/add`, data);

  if ( error ) return { error };

  return { data: response };

};

export const updateProduct = async ( id, data ) => {

  const { data: response, error } = await PUT(`${ PRODUCTS_URL }/${ id }`, data);

  if ( error ) return { error };

  return { data: response };

};

export const updateProductAvailability = async ( id, available ) => {

  const { data: response, error } = await PUT(`${ PRODUCTS_URL }/available/${ id }`, { id, available });

  if ( error ) return { error };

  return { data: response };

};

export const updateProductsStateAvailability = products => {

  const ids = products.map( product => product._id );

  for ( let index = 0; index < state.products.length; index += 1 ) {
    
    const productID = state.products[ index ]._id;

    if ( ids.includes( productID ) ) {

      state.products[ index ].available = products[ ids.indexOf( productID ) ].available;

    }

  }

};

export const switchSelectedAvailability = async () => {

  const { data: response, error } = await PUT(`${ PRODUCTS_URL }/available/switch`, { productsIDS: state.selectedProducts });

  if ( error ) return { error };

  return { data: response };

};

export const deleteProducts = async ( ...productsIDS ) => {

  return await DELETE(`${ PRODUCTS_URL }`, { productsIDS });

};

export const deleteSelectedProducts = async () => {

  const { data, error } = await deleteProducts( ...state.selectedProducts );

  if ( !error ) {

    removeStateProducts( ...state.selectedProducts );

    return { data };

  }

  return { error };

};

export const loadProduct = async id => {

  return await GET(`${ PRODUCTS_URL }/${ id }/false`);

};

export const loadProducts = async () => {

  const { data, error } = await GET(`${ PRODUCTS_URL }/all`);

  if ( !error ) {

    state.products = [ ...data ];

    state.loadedProducts = true;

  }

};