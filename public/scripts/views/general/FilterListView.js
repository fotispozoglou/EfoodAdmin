import DOMElement from "../base/DOMElement.js";
import View from "../base/View.js";

export default new class FilterListView extends View {

  _generateElement() {

    const { filters } = this._data;

    const elementTitle = new DOMElement("p").setID("filter_list_title").setText('Sort Products').getElement();

    const element = new DOMElement("div").setID("filter_list").append( elementTitle );

    for ( const filter of filters ) {

      const filterIcon = new DOMElement("div").setClass(`icon filter_icon fa-${ filter.icon }`).getElement();

      const filterName = new DOMElement("div").setClass('filter_name').setText( filter.name ).getElement();

      const filterElement = new DOMElement("div")
        .on('click', () => { filter.exec(); })
        .append( filterIcon, filterName )
        .setClass('filter')
        .getElement();

      element.append( filterElement );

    }
    
    element.on('click', e => { e.stopPropagation(); });

    const elementBackground = new DOMElement("div")
      .append( element.getElement() )
      .on('click', () => { elementBackground.remove(); })
      .setID("filter_list_background");

    return elementBackground.getElement();

  }

};