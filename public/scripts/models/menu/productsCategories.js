import { API_SERVER_URL } from "../../config/config.js";
const PRODUCTS_CATEGORIES_URL = `${ API_SERVER_URL }/productsCategories`;

import { GET, DELETE, PUT } from "../../general/request.js";

export const state = {
  loadedProductsCategories: false,
  productsCategories: [  ],
  selectedProductsCategories: [  ]
}

export const selectAllProductsCategories = () => {

  state.selectedProductsCategories.push( ...state.productsCategories.filter( sp => !state.selectedProductsCategories.includes( sp._id ) ).map( sp => sp._id ) );

};

export const unselectAllProductsCategories = () => {

  state.selectedProductsCategories = [  ];

}

export const addStateProductsCategories = ( ...productsCategories ) => {

  state.productsCategories.push( ...productsCategories );

};

export const removeStateProductsCategories = ( ...productsCategoriesIDS ) => {

  state.productsCategories.removeMany( '_id', ...productsCategoriesIDS );

}
 
export const addProductsCategory = async data => {

  return await PUT(`${ PRODUCTS_CATEGORIES_URL }/add`, data);

};

export const updateProductsCategory = async ( id, data ) => {

  return await PUT(`${ PRODUCTS_CATEGORIES_URL }/${ id }`, data);

};

export const deleteProductsCategories = async ( ...productsCategoriesIDS ) => {

  return await DELETE(`${ PRODUCTS_CATEGORIES_URL }`, { productsCategoriesIDS });

};

export const deleteSelectedProductsCategories = async () => {

  await deleteProductsCategories( ...state.selectedProductsCategories );

  removeStateProductsCategories( ...state.selectedProductsCategories );

};

export const loadProductsCategory = async id => {

  return await GET(`${ PRODUCTS_CATEGORIES_URL }/${ id }`);

};

export const loadProductsCategories = async () => {

  const { data, error } = await GET(`${ PRODUCTS_CATEGORIES_URL }/all`);

  if ( !error ) {

    state.productsCategories = [ ...data ];

    state.loadedProductsCategories = true;

  }

};
