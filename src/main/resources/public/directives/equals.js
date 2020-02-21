"use strict";

/**
 * Macht ein <input>-Element nur dann valid, wenn sein
 * Wert gleich dem angegebenen AngularJS-Ausdruck ist.
 *
 * Kann mit ng-messages verwendet werden.
 *
 * Verwendung:
 * <input equals="ausdruck" ng-model="...">
 */
app.directive("equals", [
    function() {
        return {
            restrict: "A",
            require: "ngModel",

            link: function(scope, element, attrs, ngModel) {
                const VALIDATION_ATTR = "equals";
                let expr;

                ngModel.$parsers.push(function(value) {
                    ngModel.$setValidity(VALIDATION_ATTR, value === expr);
                    return value;
                });

                scope.$watch(attrs[VALIDATION_ATTR], function(newExpr) {
                    ngModel.$setValidity(VALIDATION_ATTR, ngModel.$viewValue === (expr = newExpr));
                })
            }
        };
    }]);
