"use strict";

/**
 * Wird von components/nachrichten.js benötigt, siehe dort.
 */
app.service("NachrichtenService", function($transitions, $timeout, $log) {

    $log.debug("NachrichtenService()");

    // Timeouts pro Nachrichtentyp (Typen, die hier nicht aufgelistet sind, laufen nie ab)
    const TIMEOUTS = {
        erfolg: 3000,
        info: 3000,
        warnung: 5000
    };

    // Liste der Nachrichten
    this.liste = [];

    // Bei erfolgreicher Navigation die Liste löschen
    $transitions.onSuccess({}, this.loeschen);


    /**
     * Fügt die angegebene Nachricht am Beginn der Liste ein
     * und entfernt sie wieder nach dem entsprechenden Timeout
     * (falls vorhanden).
     */
    this.einfuegen = (typ, text) => {
        $log.debug(`NachrichtenService.neueNachricht("${typ}", "${text}")`);

        let nachricht = { typ, text };
        this.liste.unshift(nachricht);

        // Nachricht nach dem Timeout entfernen
        let timeout = TIMEOUTS[typ];
        if (timeout) {
            $timeout(timeout).then(this.entfernen.bind(this, nachricht));
        }
    };


    /**
     * Diese Methoden fügen bestimmte vordefinierte Nachrichtentypen ein.
     */
    this.erfolg = this.einfuegen.bind(this, "erfolg");

    this.info = this.einfuegen.bind(this, "info");

    this.warnung = this.einfuegen.bind(this, "warnung");

    this.fehler = this.einfuegen.bind(this, "fehler");


    /**
     * Entfernt die angegebene Nachricht aus der Liste.
     */
    this.entfernen = (nachricht) => {
        let index = this.liste.indexOf(nachricht);
        if (index >= 0) {
            this.liste.splice(index, 1);
        }
    };


    /**
     * Entfernt alle Nachrichten aus der Liste.
     */
    this.loeschen = () => {
        this.liste.length = 0;
    };

});
