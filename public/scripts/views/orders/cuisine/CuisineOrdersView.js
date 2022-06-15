import View from '../../base/View.js';
import ListElement from '../../base/ListElement.js';
import DOMElement from '../../base/DOMElement.js';
import CuisineOrder from './CuisineOrder.js';
import SelectedCuisineOrder from './SelectedCuisineOrder.js';
import EmptyListItem from '../../base/EmptyListItem.js';

import { classes } from '../../../config/strings.js';

const { ICONS } = classes;

export default new class CuisineOrdersView extends View {
  title = "cuisine orders";
  _ordersElement = ListElement;
  _selectedOrderContainer;
  _selectedOrderElement;
  _selectedOrder;
  _title;
  _messageTimeout;
  _parent = document.querySelector("#main_center");
  _ordersEmptyElement = new EmptyListItem({ _id: 1, name: 'no cuisine orders', icon: 'fa-utensils' }, {  }).build();

  render( data ) {

    if ( data ) this._data = data;

    if ( !this._hasRendered ) {

      this._element = this._generateElement();

      this._parent.insertAdjacentElement('beforeend', this._element);

    }

    this._hasRendered = true;

  }

  add( ...items ) {

    this._ordersElement.add( ...items );

  }

  renderSelectedOrder( order ) {

    const { onOrderReady, onCancelOrder, onMakingOrder } = this._data.itemMethods;

    this._selectedOrderContainer.empty();

    this._selectedOrderElement = new SelectedCuisineOrder( order, { onMakingOrder, onCancelOrder, onOrderReady } );

    this._selectedOrderContainer.append( this._selectedOrderElement.build() );

  }

  showSuccess( message ) {

    if ( this._messageTimeout ) clearTimeout( this._messageTimeout );

    this.updateTitle( message );

    this._title.classList.add('success_watered');

    this._messageTimeout = setTimeout(() => {

      this.updateTitle('select an order');

    }, 2000);

  }

  showError( message ) {

    if ( this._messageTimeout ) clearTimeout( this._messageTimeout );

    this.updateTitle( message );

    this._title.classList.add('errored_watered');

    this._messageTimeout = setTimeout(() => {

      this.updateTitle('select an order');

    }, 2000);

  }

  updateTitle( title ) {

    this._title.classList.remove('success_watered');

    this._title.classList.remove('errored_watered');

    this._title.textContent = title;

  }

  removeMaking( ...ordersIDS ) {

    this._ordersElement.customModify( function( order ) {

      if ( ordersIDS.includes(order.getID()) ) {

        order.removeClass('making_order');

      }

    });

  }

  addMaking( ...ordersIDS ) {

    this._ordersElement.customModify( function( order ) {

      if ( ordersIDS.includes(order.getID()) ) {

        order.addClass('making_order');

      }

    });

  }

  removeItems( ...itemsIDS ) {

    this._ordersElement.remove( ...itemsIDS );

    if ( itemsIDS.includes(this._selectedOrderElement.getID()) ) {

      this._selectedOrderElement.remove();

      this.updateTitle('select an order');

    }

  }

  _generateElement() {

    const { items, choosenOrders } = this._data;

    const { onLoadOrder, onMakingOrder } = this._data.itemMethods;

    this._ordersElement = new ListElement( items, CuisineOrder, "", "all_cuisine_orders", 
      { 
        onLoadOrder: order => { 
        
          if ( this._selectedOrder ) this._selectedOrder.removeClass('selected_cuisine_order');

          this._selectedOrder = order;

          this._selectedOrder.addClass('selected_cuisine_order');

          this.updateTitle( `Selected Order ~ ${ order.getOrderID() }` );

          onLoadOrder( order.getID() );  
      
        }
      });

    this._ordersElement.setNoItemsItem( this._ordersEmptyElement );

    const hideOrdersBtn = new DOMElement("div")
      .addClass( `${ ICONS.TIMES } close_all_cuisine_orders` )
      .on('click', () => { ordersContainer.classList.add('hidden'); })
      .getElement();

    const ordersContainer = new DOMElement("div")
      .setID("all_cuisine_orders_container")
      .addClass('hidden')
      .append( hideOrdersBtn, this._ordersElement.build() )
      .getElement();

    this._selectedOrderContainer = new DOMElement("div")
      .setID("selected_cuisine_order_container")

    const showOrdersBtn = new DOMElement("div")
      .addClass( `${ ICONS.ORDERS } open_cuisine_orders` )
      .on('click', () => { ordersContainer.classList.remove('hidden'); })
      .getElement();

    const closeBtn = new DOMElement("div")
      .addClass( `${ ICONS.TIMES } close_cuisine_orders` )
      .on('click', () => { this._element.classList.add('hidden'); })
      .getElement();

    this._title = new DOMElement("p").setText('select an order').setID("cuisine_orders_title").getElement();

    const header = new DOMElement("div")
      .setID("cuisine_orders_header")
      .append( showOrdersBtn, this._title, closeBtn )
      .getElement();

    const body = new DOMElement("div")
      .setID("cuisine_orders_body")
      .append( this._selectedOrderContainer.getElement(), ordersContainer )
      .getElement();

    return new DOMElement("div").append( header, body ).setClass('hidden').setID('cuisine_orders_container').getElement();

  }

};