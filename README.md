# Client-/Server-Projektvorlage mit Spring Boot und Vue.js

Dieses Repository ist dafür gedacht, in einem IntelliJ-Projekt geklont zu werden.


## Server: Spring Boot

Basiert auf der [Spring Boot-Konfiguration für den SEW-Unterricht](https://github.com/undecaf/sew-medt#spring-boot-konfiguration-f%C3%BCr-den-sew-unterricht-in-medt-an-der-htl3r)
und enthält zusätzliche Features:

+ `Main`-Klasse, macht das das Projekt lauffähig
+ Serverseitige Java-Paketstruktur `server.models` und `server.repositories`
+ Entities-Basisklassen mit Hilfsmethoden für bidirektionale 1:n-Beziehungen:
  + `Persistent` (Primärschlüssel sind fortlaufende Ganzzahlen) 
  + `PersistentUUID` (Primärschlüssel sind UUIDs) 
+ H2-Datenbank im Verzeichnis `db`, wird bei jedem Start neu erzeugt und neu von `src/main/resources/data.sql`
initialisiert
+ REST-API auf `http://127.0.0.1:8080/api` veröffentlicht
+ Unit- und Integrationstests


## Client: Vue.js

Basiert auf der [Vue.js-Projektvorlage](https://github.com/undecaf/vue-boilerplate#opinionated-boilerplate-for-vuejs-web-apps-pwas-and-electron-apps),
die in diesem Projekt folgendermaßen integriert ist:

+ Das gesamte Vue-Projekt befindet sich im Unterverzeichnis `client`.
+ Alle `package.json`-Skripte und IntelliJ-Run-Konfigurationen sind weiterhin verfügbar.
+ `build` speichert sein Ergebnis in `src/main/resources/public`, d.h. es wird vom
Java-Server auf `http://127.0.0.1:8080/` ausgeliefert.
+ `serve` und `dist:serve` binden sich an `http://127.0.0.1:8081`, sofern dieser Port nicht schon
belegt ist.
