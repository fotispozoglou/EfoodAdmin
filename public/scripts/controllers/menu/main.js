export const mobileNavbarProductsBtn = document.querySelector("#mnavbar_products");
export const mobileNavbarProductsCategoriesBtn = document.querySelector("#mnavbar_products_categories");
export const mobileNavbarTiersBtn = document.querySelector("#mnavbar_tiers");
export const mobileNavbarIngredientsBtn = document.querySelector("#mnavbar_ingredients");
import { controlLoadProductsCategories } from "./productsCategories.js";
import { controlLoadTiers } from "./tiers.js";

const initializeItems = async () => {

  await controlLoadTiers();

  await controlLoadProductsCategories();

}

export const initMenu = async () => {

  await initializeItems(  );

};
