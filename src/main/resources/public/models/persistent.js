"use strict";

/**
 * Optionale Basisklasse für Entity-Factories.
 */
app.factory("Persistent", function () {

    class Persistent {

        /**
         * Erzeugt aus dem angegebenen Objekt eine neue Instanz dieser Klasse.
         * Properties, die im "objekt" fehlen, erhalten die gleichnamigen Werte
         * aus dem optionalen "defaults"-Objekt.
         */
        constructor(objekt, defaults) {
            // Default- und Objekt-Properties übernehmen
            Object.assign(this, defaults, objekt);

            // Templates von den HAL-Links entfernen
            if (this._links) {
                Object.keys(this._links).forEach(k => {
                    let target = this._links[k];
                    if (target.templated) {
                        target.href = target.href.replace(/\{.*\}$/, "");
                        delete target.templated;
                    }
                });
            }
        }


        /**
         * Liefert true, wenn das andere Objekt mit diesem identisch ist,
         * oder wenn dieses und das andere Objekt vom selben Konstruktur
         * stammen und ihre "_self"-Links gleich sind.
         */
        equals(other) {
            try {
                return other === this
                    || ((other.constructor === this.constructor) && (other._links.self.href === this._links.self.href));
            } catch (err) {
                // _links-, self- oder href-Property nicht gefunden => nicht gleich
                return false;
            }
        }
    }

    return Persistent;
});
