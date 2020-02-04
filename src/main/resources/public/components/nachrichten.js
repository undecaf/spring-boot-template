"use strict";

/**
 * Zeigt eine Liste von Nachrichten. Um eine Nachricht in die Liste aufzunehmen,
 * eine der folgenden Methoden aufrufen:
 *
 *   NachrichtenService.success(text): verschwindet automatisch nach 3 Sekunden
 *   NachrichtenService.info(text): verschwindet automatisch nach 3 Sekunden
 *   NachrichtenService.warning(text): verschwindet automatisch nach 5 Sekunden
 *   NachrichtenService.error(text): muss von der Benutzerin geschlossen werden
 *
 * Verwendung:
 *   <nachrichten></nachrichten>
 */
app.component("nachrichten", {
    templateUrl: "components/nachrichten.html",
    controller: function(NachrichtenService) {
        this.nachrichten = NachrichtenService;
    }
});
