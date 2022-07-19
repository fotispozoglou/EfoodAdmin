import { API_SERVER_URL } from "../../config/config.js";
const INGREDIENTS_API_URL = `${ API_SERVER_URL }/ingredients`;

import { GET, DELETE, PUT } from "../../general/request.js";

export const state = {
  loadedIngredients: false,
  ingredients: [  ],
  selectedIngredients: [  ]
}

export const selectAllIngredients = () => {

  state.selectedIngredients.push( ...state.ingredients.filter( i => !state.selectedIngredients.includes( i._id ) ).map( si => si._id ) );

};

export const unselectAllIngredients = () => {

  state.selectedIngredients = [  ];

};

export const addStateIngredients = ( ...ingredients ) => {

  state.ingredients.push( ...ingredients );

};

export const removeStateIngredients = ( ...ingredientsIDS ) => {

  state.ingredients.removeMany( '_id', ...ingredientsIDS );

};

export const addIngredient = async ingredientData => {

  return await PUT(`${ INGREDIENTS_API_URL }/add`, ingredientData);

};

export const updateIngredient = async ( id, ingredientData ) => {

  return await PUT(`${ INGREDIENTS_API_URL }/${ id }`, ingredientData);

};

export const deleteIngredients = async ( ...ingredientsIDS ) => {

  return await DELETE(`${ INGREDIENTS_API_URL }/`, { ingredientsIDS });

};

export const deleteSelectedIngredients = async () => {

  const { data, error } = await deleteIngredients( ...state.selectedIngredients );

  if ( !error ) {

    removeStateIngredients( ...state.selectedIngredients );

    return { data };

  }

  return { error };

};

export const loadIngredient = async id => {

  return await GET(`${ INGREDIENTS_API_URL }/${ id }`);

};

export const loadIngredients = async () => {

  const { data, error } = await GET(`${ INGREDIENTS_API_URL }/all`);

  if ( !error ) {

    state.ingredients = [ ...data ];

    state.loadedIngredients = true;

  }

};

