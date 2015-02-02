## coSelectableItems

**NOTE:** The selectable values must be in place when the directive is started. No async fetching and then populating.

#### Directive HTML
```html
<co-selectable-items
    selectable-values="formattedSelectableValues"
    selected-values="selectedThingsThatBeep"
    trigger-reload="watchThisForRefreshingSelectable" // OPTIONAL reload the selectable items
    exclude-from-form="true"> // OPTIONAL, don't trigger dirty on form
</co-selectable-items>
```

#### Directive JavaScript
```javascript
// list of all selectable value objects and a display name to show in the GUI
// NOTE: this list must be prepared before sending to directive
$scope.formattedSelectableValues = [{
    refValue: { key: 'blipp', value: 'beep' } // comparison with selected value, can be any object type
    displayName: 'A blipper that beeps'
}];

// resource container for selected values
$scope.selectedThingsThatBeep = myFetchedResource.listOfThingsThatBeep
// would looke like this: [{ key: 'blipp', value: 'beep' }]
```

`refValue` can be of any type, it's used for comparison with the selectedValue. If the selectedValues are strings, refValue should also be a string.