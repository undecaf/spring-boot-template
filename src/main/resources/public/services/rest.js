"use strict";

app.service("RestService", function ($mdToast, $http, $log, Seite) {

    $log.debug("RestService()");

    const API_PFAD = "http://localhost:8080/api/"


    /**
     * Liefert ein Promise auf eine Seite von Entities der
     * angegebenen Type. Existiert die Seite nicht, so wird
     * die letzte vorhandene Seite geliefert.
     */
    this.seiteLaden = (konstruktor, page, size) => {
        $log.debug("RestService.seiteLaden()", konstruktor.name, page, size);

        return $http
            .get(`${API_PFAD}${konstruktor.path}`,
                { params: { page: page || 0, size: size || 10 } }
            )
            .then(response => {
                $log.debug("RestService.seiteLaden() OK", response);

                // Seitennummer im zulässigen Bereich, oder keine Seiten?
                if (response.data.page.number < response.data.page.totalPages || !response.data.page.totalElements) {
                    // OK, Seite erzeugen und zurückgeben
                    return new Seite(konstruktor, response.data);

                } else {
                    // Letzte vorhandene Seite ausliefern
                    return this.seiteLaden(
                        konstruktor,
                        response.data.page.totalPages-1,
                        size);
                }
            })
            .catch(fehlerBehandeln);
    };


    /**
     * Löscht die angegebene Entity von Server und liefert ein
     * Promise auf den Erfolg.
     */
    this.loeschen = (entity) => {
        $log.debug("RestService.loeschen()", entity);

        // Stammt die Entity vom Server, oder wurde sie lokal erzeugt?
        if (entity._links && entity._links.self) {
            return $http
                .delete(entity._links.self.href)
                .catch(fehlerBehandeln);

        } else {
            // Entity stammt nicht vom Server und kann dort nicht gelöscht werden
            fehlerBehandeln({ status: 404, statusText: "Not found", data: {} });
            return Promise.reject();
        }
    };


    /**
     * Aktualisiert oder erzeugt die angegebene Entity auf dem Server,
     * je nachdem, ob sie bereits vom Server stammt oder nicht. Liefert
     * ein Promise auf die gespeicherte Entity.
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

});
