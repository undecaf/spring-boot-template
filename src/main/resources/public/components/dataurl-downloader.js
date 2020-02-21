"use strict";

/**
 * Mit einem Klick oder Rechtsklick auf einen <dataurl-downloader> kann man den
 * Download eines Data-URL einer Entity starten. Wenn nötig wird er vorher über
 * das REST-API vom Server geladen, sobald sich die Maus über dem Downloader
 * befindet oder er den Fokus erhält.
 *
 * Der Downloader verwendet das innere HTML-Markup für seine Darstellung.
 *
 * Verwendung:
 *   <dataurl-downloader ...>inneres HTML-Markup</dataurl-downloader>
 *
 * Attribute (optional, wenn nicht anders angegeben):
 *   entity       (erforderlich) AngularJS-Ausdruck für die Entity, die den Data-URL
 *                enthält oder enthalten soll
 *   property     (erforderlich) Name der Data-URL-Property in der Entity
 *   projection   Name der Projektion, die zum Laden des Data-URL vom REST-API verwendet
 *                werden soll
 *   ng-disabled  AngularJS-Ausdruck, der die Komponente sperrt; ändert die Darstellung des
 *                inneren HTML nicht, d.h. dort sind evtl. zusätzliche Maßnahmen nötig.
 */
app.component("dataurlDownloader", {
    template: `
        <a href download="{{ $ctrl.property }}" style="outline: none;">
          <ng-transclude>dataurl-link</ng-transclude>
        </a>
    `,
    controller: "DataurlDownloaderController",
    bindings: {
        entity: "<",
        property: "@",
        projection: "@"
    },
    transclude: true
});


app.controller("DataurlDownloaderController", function ($element, $timeout, RestService) {

    let link = $element.find("a")[0];

    let eventListener = function(event) {
        // Nach dem Laden kann der Data-URL auch null sein, daher:
        if (this.entity[this.property] === undefined) {
            event.stopPropagation();
            event.preventDefault();

            RestService
                .laden(this.entity.constructor, this.entity._links.self.href, { projection: this.projection })
                .then(entity => {
                    link.href = this.entity[this.property] = entity[this.property];
                    $timeout(() => link.dispatchEvent(new MouseEvent(event.type)));
                });
        }
    }.bind(this);

    link.addEventListener("mouseover", eventListener, true);
    link.addEventListener("focus", eventListener, true);

});
