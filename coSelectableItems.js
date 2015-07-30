var angular_1 = require('angular');
var coSelectableItemsTemplate = "<div>\n  <!-- selectable items: available -->\n  <div class=\"row\">\n    <h5 data-ng-transclude data-translate></h5>\n    <div class=\"col-xs-5\">\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n          <h3 class=\"panel-title\">\n            <input class=\"form-control\" type=\"search\" name=\"searchAvailable\" placeholder=\"Filter available\" data-co-ignored-input data-ng-model=\"searchAvailable\">\n          </h3>\n        </div>\n        <div class=\"panel-body\" style=\"height: 150px; overflow: auto; padding: 0px;\">\n          <table class=\"table table-hover\">\n            <tbody>\n              <tr data-ng-repeat=\"selectableValue in selectableValues | filter: { selected: false } | filter: { displayName: searchAvailable } |  orderBy:'displayName' as filteredSelectable track by $index\"\n              data-ng-click=\"addValue(selectableValue)\" style=\"cursor: pointer;\">\n                <td>{{ selectableValue.displayName }}</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-xs-2\">\n      <div class=\"row text-center\" style=\"margin-top: 60px;\">\n        <button type=\"button\" class=\"btn btn-primary\" style=\"width: 50px;\" ng-click=\"removeAll()\">\n          &lt;&lt;\n        </button>\n      </div>\n      <div class=\"row text-center\">\n        <button type=\"button\" class=\"btn btn-primary\" style=\"width: 50px;\" ng-click=\"addAll()\">\n          &gt;&gt;\n        </button>\n      </div>\n    </div>\n    <!-- selectable items: selected -->\n    <div class=\"col-xs-5\">\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n          <h3 class=\"panel-title\">\n            <input class=\"form-control\" type=\"search\" name=\"searchSelected\" placeholder=\"Filter selected\" data-co-ignored-input data-ng-model=\"searchSelected\">\n          </h3>\n        </div>\n        <div class=\"panel-body\" style=\"height: 150px; overflow: auto; padding: 0px;\">\n          <table class=\"table table-hover\">\n            <tbody>\n              <tr data-ng-repeat=\"selectedValue in selectableValues | filter: { selected: true } | filter: { displayName: searchSelected } |  orderBy:'displayName' as filteredSelected\"\n              data-ng-click=\"removeValue(selectedValue)\" style=\"cursor: pointer;\">\n                <td>{{ selectedValue.displayName }}</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
angular_1.default.module('coSelectableItems', [])
    .directive('coSelectableItems', coSelectableItems);
function coSelectableItems() {
    var _this = this;
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
        link: function (scope, element, attrs, formCtrl) {
            scope.searchAvailable = '';
            scope.searchSelected = '';
            scope.selectedValues = scope.selectedValues || [];
            // Use triggerReload if the selectableValues will change
            if (attrs.triggerReload) {
                scope.$watch('triggerReload', function () {
                    initializeSelectableValues();
                });
            }
            else {
                initializeSelectableValues();
            }
            scope.addValue = function (valueToAddIn) {
                var valueToAdd = valueToAddIn || _this.selectableValue;
                if (!scope.excludeFromForm) {
                    formCtrl.$setDirty();
                }
                for (var i = 0; i < scope.selectedValues.length; i++) {
                    if (angular_1.default.equals(valueToAdd.refValue, scope.selectedValues[i])) {
                        return;
                    }
                }
                valueToAdd.selected = true;
                scope.selectedValues.push(valueToAdd.refValue);
            };
            scope.removeValue = function (valueToRemoveIn) {
                var valueToRemove = valueToRemoveIn || _this.selectedValue;
                if (!scope.excludeFromForm) {
                    formCtrl.$setDirty();
                }
                for (var i = 0; i < scope.selectedValues.length; i++) {
                    if (angular_1.default.equals(valueToRemove.refValue, scope.selectedValues[i])) {
                        valueToRemove.selected = false;
                        scope.selectedValues.splice(i, 1);
                        return;
                    }
                }
            };
            scope.addAll = function () {
                scope.filteredSelectable.forEach(function (valueToAdd) {
                    scope.addValue(valueToAdd);
                });
            };
            scope.removeAll = function () {
                scope.filteredSelected.forEach(function (valueToRemove) {
                    scope.removeValue(valueToRemove);
                });
            };
            function initializeSelectableValues() {
                var selectableLength = scope.selectableValues.length;
                var jsonList = angular_1.default.toJson(scope.selectedValues);
                var j;
                for (j = 0; j < selectableLength; j++) {
                    var item = scope.selectableValues[j];
                    var refVal = angular_1.default.toJson(item.refValue);
                    item.selected = !!~jsonList.indexOf(refVal);
                }
            }
        }
    };
}
//# sourceMappingURL=coSelectableItems.js.map