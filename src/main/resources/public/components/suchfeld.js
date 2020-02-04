"use strict";

/**
 * Zeigt ein Texteingabefeld mit einem "Löschen"-Button an.
 *
 * Verwendung:
 *   <suchfeld ...></suchfeld>
 *
 * Attribute (optional, wenn nicht anders angegeben):
 *   ng-model     (erforderlich) Controller-Property, in dem der Suchbegriff
 *                zu speichern ist
 *   ng-change    AngularJS-Ausdruck, der bei Änderungen von "ng-model" ausgewertet wird
 *   name         Name dieses Elements in einem Formular
 *   placeholder  Platzhalter-Text bei leerem Eingabefeld
 */
app.component("suchfeld", {
    templateUrl: "components/suchfeld.html",
    require: {
        ngModel: ""
    },
    bindings: {
        name: "@",
        placeholder: "@",
        required: "@",
        ngChange: "&"
    },
    controller: "SuchfeldController"
});


app.controller("SuchfeldController", function($scope, $element) {
    var input = $element.find("input");

    this.$onInit = () => {
        Object.keys(this)
            .filter(k => angular.isString(this[k]))
            .forEach(k => input.attr(k, this[k]));
    };


    this.aktualisieren = (suchbegriff) => {
        this.ngModel.$setViewValue(suchbegriff || "");
        this.ngChange();
    };


    $scope.$watch("$ctrl.ngModel.$modelValue", newVal => {
        this.suchbegriff = newVal;
    });

});
