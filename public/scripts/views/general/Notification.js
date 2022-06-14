import DOMElement from '../base/DOMElement.js';

import { MESSAGE } from '../../config/types.js';

export const DEFAULT_DURATION = 4 * 1000;
export const SHORT = 2 * 1000;
export const LONG = 6 * 1000;

const SUCCESS_COLOR = "#60bb66";
const ERROR_COLOR = "#bb6060";

export default class Notification extends DOMElement {
  _text;
  _type;
  _duration;
  _handleNext;
  _closeTimeout;
  _progressBar;
  _progress = 0;
  _progressInterval;

  constructor({ text, type, duration }, handleNext ) {
    super("div");

    this._text = text;
    this._type = type;
    this._duration = duration;
    this._handleNext = handleNext;

    this.build();

  }

  onClose( immediate = false ) {

    setTimeout(() => { 

      clearTimeout( this._closeTimeout );

      clearInterval( this._progressInterval );

      this.remove();

      this._handleNext();

    }, immediate ? 0 : 250);

  }

  progress() {

    this._progressInterval = setInterval(() => {

      if ( this._progress > 100 ) return;

      if ( this._progress === 100 ) {

        this.onClose( false );

      }

      this._progressBar.style.width = `${ this._progress }%`;

      this._progress += 1;

    }, (this._duration / 100) );

  }

  show() {

    document.querySelector("#root").insertAdjacentElement('beforeend', this._element);

    window.requestAnimationFrame( () => { this.progress(); } );

  }

  build() {

    console.log(this);

    const textElement = new DOMElement("p").setClass('notification_text').setText( this._text ).getElement();

    const actions = new DOMElement("div").setClass('notification_body_actions').getElement();

    const body = new DOMElement("div").setClass('notification_body').append( textElement, actions ).getElement();

    const closeBtn = new DOMElement("div").setClass('icon fa-times').on('click', () => { this.onClose( true ); }).getElement();

    const closeContainer = new DOMElement("div").setClass('notification_actions').append( closeBtn ).getElement();

    const mainContainer = new DOMElement("div").setClass('notification_main').append( body, closeContainer ).getElement();

    this._progressBar = new DOMElement("div").setClass('progress_bar').getElement();

    const progressContainer = new DOMElement("div").setClass('progress_container').append( this._progressBar ).getElement();

    this.setClass('notification').append( mainContainer, progressContainer ).style(['backgroundColor', this._type === MESSAGE.MESSAGE_SUCCESS ? SUCCESS_COLOR : ERROR_COLOR ]).getElement();

    return this._element;

  }

};