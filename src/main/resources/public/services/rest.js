"use strict";

/**
 * Erlaubt CRUD-Operationen auf Entities des Servers über dessen REST-API.
 */
app.service("RestService", function ($mdToast, $http, $log, Seite) {

    $log.debug("RestService()");

    const API_PFAD = "api/";


    /**
     * Lädt über das REST-API vom Server eine Seite derjenigen
     * Ressourcen, die der Konstruktor angibt, und liefert ein
     * Promise auf die geladene Seite.
     * Gibt es auf der gewünschten Seite keine Datensätze, so
     * wird die letzte Seite ausgeliefert, auf der noch Datensätze
     * vorhanden sind.
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
    this.seiteLaden = function(konstruktor, seitenNr, parameter, query) {
        $log.debug(`RestService.seiteLaden("${konstruktor.path}", ${seitenNr}, ${parameter}, ${query})`);

        // REST-Pfad und Query-Parameter vorbereiten
        let pfad = query ? `${API_PFAD}${konstruktor.path}/search/${query}` : `${API_PFAD}${konstruktor.path}`,
            params = Object.assign({}, parameter, { page: seitenNr });

        return $http
            .get(pfad, { params: params })
            .then(response => {
                $log.debug("RestService.seiteLaden() OK", response);

                // Geladene Datensätze in den richtigen Datentyp umwandeln
                let seite = response.data,
                    datensaetze = [];

                seite._embedded[konstruktor.path].forEach(datensatz => {
                    datensaetze.push(new konstruktor(datensatz));
                });

                seite[konstruktor.path] = datensaetze;
                delete seite._embedded;

                // Wurde die gewünschte Seite geladen?
                if ((seitenNr < seite.page.totalPages) || (seite.page.totalPages === 0)) {
                    // Ja, oder es wurden überhaupt keine Datensätze gefunden
                    return seite;

                } else {
                    // Gewünschte Seite wurde nicht geladen => letzte Seite laden
                    $log.debug("RestService.seiteLaden(): Seitennummer zu groß", params.page);

                    return this.seiteLaden(konstruktor, seite.page.totalPages-1, parameter, query);
                }
            })
            .catch(fehlerBehandeln);
    };


    /**
     * Lädt über das REST-API vom Server eine einzelne Ressource des
     * angegebenen Konstruktors und liefert ein Promise auf die
     * geladene Ressource.
     *
     * Argumente (optional, wenn nicht anders angegeben):
     *   konstruktor   (erforderlich) Factoryfunktion für geladene
     *                 Objekte, liefert auch ihren Pfad im REST-API
     *   url           (erforderlich) Link zur Ressource
     *   parameter     Namen und Werte der Request-Parameter als
     *                 Objekt
     */
    this.laden = function(konstruktor, url, parameter) {
        $log.debug(`RestService.laden("${konstruktor.path}", ${url})`);

        return $http
            .get(url, { params: parameter })
            .then(response => {
                $log.debug(`RestService.laden() OK`, response);

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
                .delete(entity._links.self.href, { headers: { "If-Match": entity.etag } })
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
     * Ersetzt in den Response-Daten rekursiv alle _embedded-Objekte durch ihre Inhalte.
     */
    function embeddedAufloesen(obj) {
        let embedded;

        if (angular.isArray(obj)) {
            // Arrayelemente umstrukturieren
            obj.forEach(embeddedAufloesen);

        } else if (angular.isObject(obj) && (embedded = obj._embedded)) {
            // Inhalte von _embedded in diesem Objekt platzieren
            Object.keys(embedded).forEach(k => {
                obj[k] = embedded[k];
                embeddedAufloesen(obj[k]);
            })
            delete obj._embedded;
        }

        return obj;
    }


    /**
     * Ersetzt in den Request-Daten alle Entity-Objekte durch ihre self-Links.
     */
    function entitiesVerlinken(obj) {
        if (angular.isArray(obj)) {
            // In Arrayelementen ersetzen
            obj.forEach(entitiesVerlinken);

        } else if (angular.isObject(obj)) {
            // Verlinkte Objekte suchen und durch ihre self-Links ersetzen
            Object.keys(obj).forEach(k => {
                if (obj[k] && obj[k]._links && obj[k]._links.self) {
                    // Templates aus Link entfernen
                    obj[k] = obj[k]._links.self.href.replace(/\{.*\}$/, "");
                }
            });
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
