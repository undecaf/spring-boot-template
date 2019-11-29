"use strict";

/**
 * <file-content-chooser> bietet Fähigkeiten, die über <input type="file"> hinausgehen.
 *
 * Er verwendet das innere HTML-Markup für seine Darstellung und speichert die Inhalte
 * der ausgewählten Dateien als Data-URL oder Array von Data-URLs in einem "ng-model".
 *
 * Dateien, die nicht gelesen werden konnten, werden als "error"-Objekt gespeichert.
 *
 * Verwendung:
 *   <file-content-chooser ...>inneres HTML-Markup</file-content-chooser>
 *
 * Attribute (optional, wenn nicht anders angegeben):
 *   ng-model     (erforderlich) Controller-Property, in dem der Inhalt der ausgewählte(n)
 *                Datei(en) als Data-URL bzw. als Array von Data-URLs zu speichern ist
 *   ng-change    AngularJS-Ausdruck, der bei Änderungen von "ng-model" ausgewertet wird
 *   ng-disabled  AngularJS-Ausdruck, der die Komponente sperrt; ändert die Darstellung des
 *                inneren HTML nicht, d.h. dort sind evtl. zusätzliche Maßnahmen nötig.
 *   name         Name dieses Elements in einem Formular. Wird benötigt, wenn "required"
 *                angegeben ist.
 *   accept       Lässt nur Dateien mit einer dieser MIME-Types auswählen
 *   multiple     Falls angegeben, kann man mehrere Dateien auswählen, und "ng-model" wird
 *                an eine "FileList" gebunden (auch wenn nur eine einzige Datei ausgewählt ist);
 *                andernfalls wird "ng-model" an ein einzelnes "File"-Objekt gebunden
 *   required     validiert im umgebenden Formular, dass eine Datei ausgewählt wurde. Benötigt
 *                zusätzlich das "name"-Attribut.
 */
app.component("fileContentChooser", {
    template: `
        <ng-transclude ng-click="$ctrl.open()" style="cursor: pointer;">file-content-chooser</ng-transclude>
        <input type="file" style="display: none;">
    `,
    transclude: true,
    require: {
        ngModel: ""
    },
    bindings: {
        ngDisabled: "<",
        name: "@",
        accept: "@",
        multiple: "@",
        required: "@"
    },
    controller: "FileContentChooserController"
});


app.controller("FileContentChooserController", function($element) {

    let fileInput = $element.find("input");


    this.$onInit = () => {
        // Attribute dem input-Element zuweisen
        Object.keys(this)
            .filter(k => angular.isString(this[k]))
            .forEach(k => fileInput.attr(k, this[k]));
    };


    // Klicks an das input-Element weiterleiten
    this.open = () => !this.ngDisabled && fileInput[0].click();


    // Auf Dateiauswahl reagieren
    fileInput.on("change", () => {
        let files = fileInput[0].files;
        if (files instanceof FileList) {
            // ng-model nur ändern, wenn tatsächlich eine Dateiauswahl erfolgt ist
            if (!files.length) {
                return;
            }

            var promises = [];

            // Für jede Datei ein Promise auf die Beendigung des Lesens erzeugen
            for (let i = 0; i < files.length; i++) {
                promises.push(
                    new Promise(function(resolve, reject) {
                        let reader = new FileReader();
                        reader.onload = () => { files[i].content = reader.result; resolve(); };
                        reader.onerror = () => { files[i].error = reader.error; reject(); };
                        reader.readAsDataURL(files[i]);
                    })
                );
            }

            // ng-model erst aktualisieren, wenn alle Dateien gelesen wurden
            Promise.all(promises)
                .finally(() => {
                    let viewValue;
                    if (angular.isString(this.multiple)) {
                        // Aus der FileList ein Array von Data-URLs erzeugen
                        viewValue = [];
                        files.forEach(f => viewValue.push(f.content || f.error));
                    } else {
                        // Einzelnen Data-URL übernehmen
                        viewValue = files[0].content || files[0].error;
                    }
                    this.ngModel.$setViewValue(viewValue);
                });

        } else {
            this.ngModel.$setViewValue(undefined);
        }
    });

});
