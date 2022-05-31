import Notification from "../../views/general/Notification.js";
import { SHORT, LONG } from "../../views/general/Notification.js";

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