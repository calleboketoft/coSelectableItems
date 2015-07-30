import angular from 'angular'
import coSelectableItemsTemplate from './coSelectableItemsTemplate.html!text'

angular.module('coSelectableItems', [])
  .directive('coSelectableItems', coSelectableItems)

function coSelectableItems () {
  return {
    restrict: 'E',
    require: '?^form',
    scope: {
      selectableValues: '=',
      selectedValues: '=',
      triggerReload: '=',
      excludeFromForm: '='
    },
    transclude: true,
    template: coSelectableItemsTemplate,
    link: (scope, element, attrs, formCtrl) => {

      scope.searchAvailable = ''
      scope.searchSelected = ''
      scope.selectedValues = scope.selectedValues || []

      // Use triggerReload if the selectableValues will change
      if (attrs.triggerReload) {
        scope.$watch('triggerReload', () => {
          initializeSelectableValues()
        })
      } else {
        initializeSelectableValues()
      }

      scope.addValue = (valueToAddIn) => {
        let valueToAdd = valueToAddIn || this.selectableValue;
        if (!scope.excludeFromForm) {
          formCtrl.$setDirty()
        }
        for (let i = 0; i < scope.selectedValues.length; i++) {
          if (angular.equals(valueToAdd.refValue, scope.selectedValues[i])) {
            return
          }
        }
        valueToAdd.selected = true;
        scope.selectedValues.push(valueToAdd.refValue)
      };

      scope.removeValue = (valueToRemoveIn) => {
        let valueToRemove = valueToRemoveIn || this.selectedValue;
        if (!scope.excludeFromForm) {
          formCtrl.$setDirty()
        }
        for (let i = 0; i < scope.selectedValues.length; i++) {
          if (angular.equals(valueToRemove.refValue, scope.selectedValues[i])) {
            valueToRemove.selected = false
            scope.selectedValues.splice(i, 1)
            return
          }
        }
      }

      scope.addAll = () => {
        scope.filteredSelectable.forEach((valueToAdd) => {
          scope.addValue(valueToAdd)
        })
      }

      scope.removeAll = () => {
        scope.filteredSelected.forEach((valueToRemove) => {
          scope.removeValue(valueToRemove)
        })
      }

      function initializeSelectableValues() {
        let selectableLength = scope.selectableValues.length
        let jsonList = angular.toJson(scope.selectedValues)
        let j

        for (j = 0; j < selectableLength; j++) {
          let item = scope.selectableValues[j]
          let refVal = angular.toJson(item.refValue)
          item.selected = !!~jsonList.indexOf(refVal)
        }
      }
    }
  }
}