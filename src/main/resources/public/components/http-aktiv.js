"use strict";

/**
 * HTTP-Aktivitätsanzeige: zeigt das innere HTML (oder "Beschäftigt...") an,
 * solange es unbeantwortete HTTP-Requests gibt.
 *
 * Erfasst sowohl $http-Requests als auch das Laden von Komponenten.
 *
 * Verwendung:
 *   <http-aktiv>inneres HTML-Markup</http-aktiv>
 */
app.component("httpAktiv", {
    template: "<div ng-show='$ctrl.aktiv()'><ng-transclude>Beschäftigt...</ng-transclude></div>",
    transclude: true,
    controller: function($http) {
        this.aktiv = () => $http.pendingRequests.length > 0;
    }
});
