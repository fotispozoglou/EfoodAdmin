import Notification, { DEFAULT_DURATION } from "../../views/general/Notification.js";
import { SHORT, LONG } from "../../views/general/Notification.js";
import { MESSAGE } from "../../config/types.js";

export const NETWORK_ERROR_NOTIFICATION = { 
  text: "You are not connected to a network", 
  type: MESSAGE.MESSAGE_ERROR, 
  duration: LONG 
};

export const SERVER_ERROR_NOTIFICATION = { 
  text: "An server error occured", 
  type: MESSAGE.MESSAGE_ERROR, 
  duration: LONG 
};

const notifications = [];

let isRendered = false;

const removeFirst = () => {

  notifications.splice( 0, 1 ); 
  
  isRendered = false; 
  
  handleNotificationsQueue();

};

const handleNotificationsQueue = () => {

  if ( isRendered || notifications.length < 1 ) return;

  const notification = new Notification( notifications[0], () => { removeFirst(); } );

  notification.show();

  isRendered = true;

};

export const addNotification = notification => {

  notifications.push( notification );

  handleNotificationsQueue();

};

export const showNotification = ( message, type, duration = DEFAULT_DURATION ) => {

  addNotification({ text: message, type, duration });

};