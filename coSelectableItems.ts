let coSelectableItemsTemplate = `<div>
  <!-- selectable items: available -->
  <div class="row">
    <h5 data-ng-transclude data-translate></h5>
    <div class="col-xs-5">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">
            <input class="form-control" type="search" name="searchAvailable" placeholder="Filter available" data-co-ignored-input data-ng-model="searchAvailable">
          </h3>
        </div>
        <div class="panel-body" style="height: 150px; overflow: auto; padding: 0px;">
          <table class="table table-hover">
            <tbody>
              <tr data-ng-repeat="selectableValue in selectableValues | filter: { selected: false } | filter: { displayName: searchAvailable } |  orderBy:'displayName' as filteredSelectable track by $index"
              data-ng-click="addValue(selectableValue)" style="cursor: pointer;">
                <td>{{ selectableValue.displayName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col-xs-2">
      <div class="row text-center" style="margin-top: 60px;">
        <button type="button" class="btn btn-primary" style="width: 50px;" ng-click="removeAll()">
          &lt;&lt;
        </button>
      </div>
      <div class="row text-center">
        <button type="button" class="btn btn-primary" style="width: 50px;" ng-click="addAll()">
          &gt;&gt;
        </button>
      </div>
    </div>
    <!-- selectable items: selected -->
    <div class="col-xs-5">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">
            <input class="form-control" type="search" name="searchSelected" placeholder="Filter selected" data-co-ignored-input data-ng-model="searchSelected">
          </h3>
        </div>
        <div class="panel-body" style="height: 150px; overflow: auto; padding: 0px;">
          <table class="table table-hover">
            <tbody>
              <tr data-ng-repeat="selectedValue in selectableValues | filter: { selected: true } | filter: { displayName: searchSelected } |  orderBy:'displayName' as filteredSelected"
              data-ng-click="removeValue(selectedValue)" style="cursor: pointer;">
                <td>{{ selectedValue.displayName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>`

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