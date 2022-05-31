import { API_SERVER_URL } from "../../config/config.js";
const TIERS_URL = `${ API_SERVER_URL }/tiers`;

import { DELETE, GET, PUT } from "../../general/request.js";

export const state = {
  loadedTiers: false,
  tiers: [  ],
  selectedTiers: [  ]
};

export const selectAllTiers = () => {

  state.selectedTiers.push( ...state.tiers.filter( t => !state.selectedTiers.includes( t._id ) ).map( t => t._id ) );

};

export const unselectAllProducts = () => {

  state.selectedTiers = [  ];

};

export const deleteSelectedTiers = async () => {

  await deleteTiers( ...state.selectedTiers );

  removeStateTiers( ...state.selectedTiers );

};

export const getTiersData = ( ...tiersIDS ) => {

  const tiers = [  ];

  for ( const tier of state.tiers ) {

    if ( tiersIDS.includes(tier._id) ) {

      tiers.push({ _id: tier._id, name: tier.name });

    }

  }

  return tiers;

};

export const addStateTiers = ( ...tiers ) => {

  state.tiers.push( ...tiers );

};

export const removeStateTiers = ( ...tiersIDS ) => {

  state.tiers.removeMany( '_id', ...tiersIDS );

};

export const addTier = async data => {

  return await PUT(`${ TIERS_URL }/add`, data);

};

export const updateTier = async ( id, data ) => {

  return await PUT(`${ TIERS_URL }/${ id }`, data);

};

export const deleteTiers = async ( ...tiersIDS ) => {

  return await DELETE(`${ TIERS_URL }`, { tiersIDS });

};

export const loadTier = async id => {

  return await GET(`${ TIERS_URL }/${ id }/false`);

};

export const loadTiers = async () => {

  const { data, error } = await GET(`${ TIERS_URL }/all`);

  if ( !error ) {

    state.tiers = [ ...data ];

    state.loadedTiers = true;

  }

};