angular.module('angular-autocomplete').directive('autoComplete', [
  '$parse',
  function ($parse) {
    var template =
      '<div class="autoComplete uiAutoComplete">' +
        '<div class="autoComplete__input">' +
          '<input ng-model="value">' + 
        '</div>' +
        '<div class="autoComplete__list" ng-if="active">' +
          '<div class="autoComplete__choice" ' + 
                'ng-repeat="choice in filteredChoices = (choices | filter: search)" ' +
                'ng-transclude="" ' +
                'evt-tab-lock="" ' +
                'evt-tab-lock-disabled="!$last" ' +
                'evt-return="setChoice(choice)" ' +
                'ng-click="setChoice(choice)" ' +
                'tabindex="0">' +             
          '</div>' +
          '<div class="autoComplete__choice" ng-if="!filteredChoices.length">' +
              '<span>No Results</span>' +
          '</div>' +
        '</div>' +
      '</div>';

    return {
      scope: true,
      transclude: 'element',
      replace: true,
      template: template,
      link: function (scope, element, attrs) {
        var getModel = $parse(attrs.autoCompleteModel),
            setModel = getModel.assign,
            lastChoice = '';

        scope.setChoice = function (choice) {
          lastChoice = scope.value = choice.name;
          scope.active = false;
          element.find('input')[0].focus();
        };

        scope.$watch('value', function (value) {
          setModel(scope.$parent, value);
        });

        element.on('keyup', function (event) {
          scope.$apply(function () {
            if (lastChoice === scope.value) {
              scope.active = false;
              return;
            }

            scope.choices = scope.$eval(attrs.autoComplete);

            scope.active = !!scope.value;
            scope.search = {name: scope.value};
          });
        });
      }    
    }
  }
]);
