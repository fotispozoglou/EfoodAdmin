import EditItemView from "../../base/EditItemView.js";
import InputElement from "../../general/inputs/InputElement.js";
import NumberInput from "../../general/inputs/NumberInput.js";
import SelectionsElement from "../../general/SelectionsElement.js";

const TYPES = [{ _id: 'checkbox', name: 'checkbox' }, { _id: 'radio', name: 'radio' }, ];

export default new class EditTiersView extends EditItemView {
  title = "edit tier";

  _generateInputs() {

    const { allIngredients } = this._data.itemSupplements;

    const { name = '', ingredients = [], selectedIngredients = [], maxSelections = 1, minSelections = 0, type = "checkbox" } = this._data.item;

    const nameElement = new InputElement( "name", name ).build().setPlaceholder('name of tier');

    const maximumSelectionsElement = new NumberInput( "maximum selections", maxSelections, 1 , 0, 100 )
      .build();

    const selectedIngredientsElement = new SelectionsElement( 
      "defualt ingredients", "checkbox", 
      allIngredients.filter(i => ingredients.includes( i._id )), selectedIngredients, 
      maxSelections, 
      selections => { 
        
        maximumSelectionsElement.updateMinimumValue( selections.length ); 

        if ( maximumSelectionsElement.isInRange( selections.length ) ) {

          maximumSelectionsElement.resetError();

        }
      
      },
    ).build();

    const ingredientsElement = new SelectionsElement( 
      "ingredients", 
      "checkbox", 
      allIngredients, 
      ingredients, 
      allIngredients.length, 
      selections => { 
        
        selectedIngredientsElement.updateSelections( ...allIngredients.filter(i => selections.includes( i._id )) ) 

        maximumSelectionsElement.updateMaximumValue( selections.length );

      }).build();

    maximumSelectionsElement.setMinimumValueError("can't be lower than number of default ingredients");
    maximumSelectionsElement.setMaximumValueError("can't be greater than number of available ingredients");
    maximumSelectionsElement.updateMinimumValue( selectedIngredients.length );
    maximumSelectionsElement.updateMaximumValue( ingredients.length );

    maximumSelectionsElement.onChange( value => { 
      
      if ( value < selectedIngredientsElement.getSelectedCount() ) {

        return maximumSelectionsElement.onError(``);

      }

      selectedIngredientsElement.updateMaxSelections( value ); 
    
    });

    const minimumSelectionsElement = new NumberInput( "minimum selections", minSelections, 1, 0, 100 ).build();

    const typeElement = new SelectionsElement( "type", "radio", TYPES, type, 1 ).build();

    this._inputs.push( 
      [ 'name', nameElement], 
      [ 'ingredients', ingredientsElement ], 
      [ 'maxSelections', maximumSelectionsElement ], 
      [ 'minSelections', minimumSelectionsElement ], 
      [ 'selectedIngredients', selectedIngredientsElement ], 
      [ 'type', typeElement ]
    );

    this.addDataElements(
      ['name', () => { return nameElement.getValue(); }],
      ['ingredients', () => { return ingredientsElement.getSelected(); }],
      ['maxSelections', () => { return maximumSelectionsElement.getValue(); }],
      ['minSelections', () => { return minimumSelectionsElement.getValue(); }],
      ['selectedIngredients', () => { return selectedIngredientsElement.getSelected(); }],
      ['type', () => { return typeElement.getSelected(); }]
    );

    return [ nameElement.getElement(), maximumSelectionsElement.getElement(), minimumSelectionsElement.getElement(), typeElement.getElement(), ingredientsElement.getElement(), selectedIngredientsElement.getElement() ];

  }

}