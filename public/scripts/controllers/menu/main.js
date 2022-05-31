const mobileNavbarProductsBtn = document.querySelector("#mnavbar_products");
const mobileNavbarProductsCategoriesBtn = document.querySelector("#mnavbar_products_categories");
const mobileNavbarTiersBtn = document.querySelector("#mnavbar_tiers");
const mobileNavbarIngredientsBtn = document.querySelector("#mnavbar_ingredients");

import { setSelectedButton } from "../main.js";
import { controlRenderIngredients } from "./ingredients.js";
import { controlRenderProducts } from "./products.js";
import { controlRenderProductsCategories, controlLoadProductsCategories } from "./productsCategories.js";
import { controlRenderTiers, controlLoadTiers } from "./tiers.js";

const initializeItems = async () => {

  await controlLoadTiers();

  await controlLoadProductsCategories();

}

const initialiazeListeners = () => {

  setSelectedButton( mobileNavbarProductsBtn );

  mobileNavbarProductsBtn.addEventListener('click', () => {

    controlRenderProducts();

    setSelectedButton( mobileNavbarProductsBtn )

  });

  mobileNavbarProductsCategoriesBtn.addEventListener('click', () => { 
      
    controlRenderProductsCategories();

    setSelectedButton ( mobileNavbarProductsCategoriesBtn );
  
  });

  mobileNavbarTiersBtn.addEventListener('click', () => {

    controlRenderTiers();

    setSelectedButton( mobileNavbarTiersBtn );

  });

  mobileNavbarIngredientsBtn.addEventListener('click', () => {

    controlRenderIngredients();

    setSelectedButton( mobileNavbarIngredientsBtn );

  });

};


export const initMenu = async () => {

  await initializeItems(  );

  initialiazeListeners();

};
