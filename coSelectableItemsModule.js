angular.module('coSelectableItems', [])

.directive('coSelectableItems', function() {
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
        templateUrl: 'bower_components/coSelectableItems/coSelectableItemsTemplate.html',
        link: function(scope, element, attrs, formCtrl) {

            scope.searchAvailable = '';
            scope.searchSelected = '';
            scope.selectedValues = scope.selectedValues || [];

            // Use triggerReload if the selectableValues will change
            if (attrs.triggerReload) {
                scope.$watch('triggerReload', function() {
                    initializeSelectableValues();
                });
            } else {
                initializeSelectableValues();
            }

            scope.addValue = function(valueToAddIn) {
                var valueToAdd = valueToAddIn || this.selectableValue;
                if (!scope.excludeFromForm) {
                    formCtrl.$setDirty();
                }
                for (var i = 0; i < this.selectedValues.length; i++) {
                    if (angular.equals(valueToAdd.refValue, this.selectedValues[i])) {
                        return;
                    }
                }
                valueToAdd.selected = true;
                this.selectedValues.push(valueToAdd.refValue);
            };

            scope.removeValue = function(valueToRemoveIn) {
                var valueToRemove = valueToRemoveIn || this.selectedValue;
                if (!scope.excludeFromForm) {
                    formCtrl.$setDirty();
                }
                for (var i = 0; i < this.selectedValues.length; i++) {
                    if (angular.equals(valueToRemove.refValue, this.selectedValues[i])) {
                        valueToRemove.selected = false;
						this.selectedValues.splice(i, 1);
                        return;
                    }
                }
            };

            scope.addAll = function() {
                scope.filteredSelectable.forEach(function(valueToAdd) {
                    scope.addValue(valueToAdd);
                });
            };

            scope.removeAll = function() {
                scope.filteredSelected.forEach(function(valueToRemove) {
                    scope.removeValue(valueToRemove);
                });
            };

			function initializeSelectableValues() {
				var selectableLength = scope.selectableValues.length,
					jsonList = angular.toJson(scope.selectedValues),
					j;

				for (j = 0; j < selectableLength; j++) {
					var item = scope.selectableValues[j],
						refVal = angular.toJson(item.refValue);
					item.selected = !!~jsonList.indexOf(refVal);
				}
			}
        }
    };
});

