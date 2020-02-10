"use strict";

/**
 * Erlaubt CRUD-Operationen auf Entities des Servers über dessen REST-API.
 */
app.service("RestService", function ($mdToast, $http, $log, Seite) {

    $log.debug("RestService()");

    const API_PFAD = "api/";


    /**
     * Liefert ein Promise auf eine Seite von Entities der
     * angegebenen Type. Existiert die Seite nicht, so wird
     * die letzte vorhandene Seite geliefert.
     *
     * Alle _embedded-Objekte werden durch ihre Inhalte ersetzt.
     *
     * Argumente (optional, wenn nicht anders angegeben):
     *   konstruktor   (erforderlich) Factoryfunktion für geladene
     *                 Objekte, liefert auch ihren Pfad im REST-API
     *   seitenNr      (erforderlich) Nummer der zu ladenden Seite
     *                 (erste Seite === 0)
     *   parameter     Namen und Werte der Request-Parameter als
     *                 Objekt
     *   query         Name der serverseitigen Query-Methode, falls
     *                 eine solche verwendet werden soll
     */
    this.seiteLaden = (konstruktor, seitenNr, parameter, query) => {
        $log.debug("RestService.seiteLaden()", konstruktor.path, seitenNr, parameter, query);

        // REST-Pfad und Query-Parameter vorbereiten
        let pfad = query
            ? `${API_PFAD}${konstruktor.path}/search/${query}`
            : `${API_PFAD}${konstruktor.path}`,
            params = angular.extend({ page: seitenNr }, parameter);

        return $http
            .get(pfad, { params: params })
            .then(response => {
                $log.debug("RestService.seiteLaden() OK", response);

                // Seitennummer im zulässigen Bereich, oder keine Seiten?
                if (response.data.page.number < response.data.page.totalPages || !response.data.page.totalElements) {
                    // OK, Seite erzeugen und zurückgeben
                    return new Seite(konstruktor, response.data);

                } else {
                    // Letzte vorhandene Seite ausliefern
                    params.page = response.data.page.totalPages-1;

                    return this.seiteLaden(
                        konstruktor,
                        null,
                        params,
                        query);
                }
            })
            .catch(fehlerBehandeln);
    };


    /**
     * Lädt über das REST-API vom Server eine einzelne Entity der
     * angegebenen Type und liefert ein Promise auf das geladene Objekt.
     *
     * Argumente (optional, wenn nicht anders angegeben):
     *   konstruktor   (erforderlich) Factoryfunktion für geladene
     *                 Objekte
     *   url           (erforderlich) Link zur Entity; enthält dieser
     *                 ein Template, so wird es ignoriert
     *   parameter     Namen und Werte der Request-Parameter als
     *                 Objekt
     */
    this.laden = (konstruktor, url, parameter) => {
        $log.debug("RestService.laden()", konstruktor.name, url, parameter);

        return $http
            .get(
                url,
                { params: parameter })
            .then(response => {
                $log.debug("RestService.laden() OK", response);

                response.data = new konstruktor(response.data);
                return response.data;
            })
            .catch(fehlerBehandeln);
    };


    /**
     * Löscht die angegebene Entity von Server.
     *
     * Liefert ein Promise auf den Erfolg.
     */
    this.loeschen = (entity) => {
        $log.debug("RestService.loeschen()", entity);

        // Stammt die Entity vom Server, oder wurde sie lokal erzeugt?
        if (entity._links && entity._links.self) {
            return $http
                .delete(
                    entity._links.self.href,
                    { headers: { "If-Match": entity.etag } })
                .catch(fehlerBehandeln);

        } else {
            // Entity stammt nicht vom Server und kann dort nicht gelöscht werden
            fehlerBehandeln({ status: 404, statusText: "Not found", data: {} });
            return Promise.reject();
        }
    };


    /**
     * Aktualisiert oder erzeugt die angegebene Entity auf dem Server,
     * je nachdem, ob sie bereits vom Server stammt oder lokal erzeugt
     * wurde.
     *
     * Liefert ein Promise auf die aktuelle Version der Entity.
     */
    this.speichern = (entity) => {
        // Stammt die Entity vom Server, oder wurde sie lokal erzeugt?
        if (entity._links && entity._links.self) {
            // Entity wurde schon einmal vom Server geladen, aktualisieren
            $log.debug("RestService.speichern(): update", entity);

            return $http
                .patch(
                    entity._links.self.href,
                    entity,
                    { headers: { "If-Match": entity.etag } })
                .then(response => {
                    $log.debug("RestService.speichern(): update OK", response);

                    // Aktualisierten Satz in eine Entity umwandeln
                    return new entity.constructor(response.data);
                })
                .catch(fehlerBehandeln);

        } else {
            // Entity wurde noch nie auf dem Server gespeichert, erzeugen
            $log.debug("RestService.speichern(): insert", entity);

            return $http
                .post(`${API_PFAD}${entity.constructor.path}`, entity)
                .then(response => {
                    $log.debug("RestService.speichern(): insert OK", response);

                    // Neuen Satz in eine Entity umwandeln
                    return new entity.constructor(response.data);
                })
                .catch(fehlerBehandeln);
        }
    };


    /**
     * Zeigt den Fehlercode in einem Toast und liefert ein
     * zurückgewiesenes Promise.
     */
    function fehlerBehandeln(response) {
        $log.error("RestService::fehlerBehandeln()", response);

        $mdToast.showSimple(`Fehler ${response.status}`);
        return Promise.reject();
    }


    /**
     * Ersetzt in den Response-Daten rekursiv alle _embedded-Objekte durch ihre Inhalte
     * und entfernt HATEOAS-Templates ("{...}") von allen _links.
     */
    function embeddedAufloesen(obj) {
        if (angular.isArray(obj)) {
            // Arrayelemente umstrukturieren
            obj.forEach(embeddedAufloesen);

        } else if (angular.isObject(obj)) {
            if (obj._embedded) {
                // Inhalte von _embedded in diesem Objekt platzieren
                let embedded = obj._embedded;

                Object.keys(embedded).forEach(k => {
                    obj[k] = embedded[k];
                    embeddedAufloesen(obj[k]);
                });

                delete obj._embedded;

            } else if (obj.href && obj.templated) {
                // HATEOAS-Template von diesem Link entfernen
                obj.href = obj.href.replace(/\{.*\}$/, "");
                delete obj.templated;

            } else {
                // Properties dieses Objekts abarbeiten
                Object.keys(obj).forEach(k => embeddedAufloesen(obj[k]));
            }
        }

        return obj;
    }


    /**
     * Ersetzt in den Request-Daten alle _eingebetteten_ Entity-Objekte durch ihre self-Links.
     */
    function entitiesVerlinken(obj, rekursiv) {
        if (obj && obj._links && obj._links.self && rekursiv) {
            // Templates aus Link entfernen und Objekt durch diesen Link ersetzen
            return obj._links.self.href.replace(/\{.*\}$/, "");

        } else if (angular.isArray(obj)) {
            // Arrayelemente ersetzen, wenn nötig
            obj.forEach((e, i) => obj[i] = entitiesVerlinken(e, true));

        } else if (angular.isObject(obj)) {
            // Properties ersetzen, wenn nötig
            Object.keys(obj).forEach(k => obj[k] = entitiesVerlinken(obj[k], true));
        }

        return obj;
    }


    // embeddedAufloesen() automatisch auf jede Response anwenden, _nachdem_
    // AngularJS sie von einem JSON-String in ein Objekt umgewandelt hat
    $http.defaults.transformResponse.push(embeddedAufloesen);

    // entitiesVerlinken() vor dem Absenden automatisch auf jeden Request anwenden,
    // _bevor_ AngularJS ihn in einen JSON-String umwandelt
    $http.defaults.transformRequest.unshift(requestData => {
        return entitiesVerlinken(angular.copy(requestData));
    });

});
