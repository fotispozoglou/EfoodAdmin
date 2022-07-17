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

  mobileNavbarProductsBtn.addEventListener('click', () => {

    setSelectedButton( mobileNavbarProductsBtn )

  });

  mobileNavbarProductsCategoriesBtn.addEventListener('click', () => { 
      
    setSelectedButton ( mobileNavbarProductsCategoriesBtn );
  
  });

  mobileNavbarTiersBtn.addEventListener('click', () => {

    setSelectedButton( mobileNavbarTiersBtn );

  });

  mobileNavbarIngredientsBtn.addEventListener('click', () => {

    setSelectedButton( mobileNavbarIngredientsBtn );

  });

};


export const initMenu = async () => {

  await initializeItems(  );

  initialiazeListeners();

};
