import ConfirmActionView from "../views/general/ConfirmActionView.js";
import ListItem from "../views/base/ListItem.js";

const mobileNavbar = document.querySelector("#mnavbar_background");

export const openMobileNavbar = () => { mobileNavbar.style.left = '0%'; };
export const closeMobileNavbar = () => { mobileNavbar.style.left = '-100%'; };

export let selectedOption;

export const setSelectedButton = toSelect => {

  if ( selectedOption ) selectedOption.classList.remove('selected_mnavbar_sub_option');

  selectedOption = toSelect;

  selectedOption.classList.add('selected_mnavbar_sub_option');

};

export const controlConfirmAction = async ( title, confirm, effectedItems, itemComponent = ListItem ) => {

  document.querySelector("body").classList.add('hide_overflow');

  ConfirmActionView.render({
    title,
    confirm,
    effectedItems,
    itemComponent
  });

}