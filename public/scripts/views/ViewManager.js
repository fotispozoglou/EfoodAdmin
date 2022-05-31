import View from "./base/View.js";

export const mainRight = document.querySelector("#main_right");
export const mainLeft = document.querySelector("#main_left");

const navbarTitle = document.querySelector("#navbar_title");

export default new class ViewManager {
  _renderedView;
  _previousRenderedView;
  _navbarHeight;
  _renderPrevious;
  _renderedViewID;
  
  setRenderPrevious( fun ) { this._renderPrevious = fun; }

  init( view = View, data ) {

    view.render( data );

    this._renderedViewID = view.getID();

    this.initializeListeners();

  }

  render( view = View, data, hideCurrent = false ) {

    if ( hideCurrent && this._renderedView ) this._renderedView.remove();

    view.render( data );

    this._renderedViewID = view.getID();

    navbarTitle.textContent = view.getTitle();

    this._renderedView = view;

  }

  getRenderedViewID() { return this._renderedViewID; }

  renderPrevious() {

    this._renderPrevious();

  }

};