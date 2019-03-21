"use strict";

/**
 * Repräsentiert eine "page" von Entities, wie sie vom REST-API
 * geliefert wird.
 */
app.factory("Seite", function () {

    function Seite(konstruktor, data) {

        // Schreibgeschützte Properties und ihre Defaultwerte
        let properties = {
            page: {},
            entities: [],

            vorige: undefined,
            naechste: undefined,
            erste: undefined,
            letzte: undefined,
            istErste: undefined,
            istLetzte: undefined,
        };

        // Daten den Properties zuweisen
        Object.assign(this, properties, data);

        // Anonyme Objekte in Entities umwandeln
        this.entities = data[konstruktor.path]
            .map(obj => new konstruktor(obj));

        // Unerwünschte Properties entfernen
        delete this._embedded;
        delete this[konstruktor.path];

        // Hilfsvariable erzeugen
        this.vorige = this.page.number - 1;
        this.naechste = this.page.number + 1;
        this.erste = 0;
        this.letzte = this.page.totalPages-1;

        this.istErste = this.page.number <= this.erste;
        this.istLetzte = this.page.number >= this.letzte;

        // Properties schreibschützen
        Object.keys(properties).forEach(k => Object.defineProperty(this, k, {writable: false}));
    }

    return Seite;
});
