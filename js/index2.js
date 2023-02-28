// Importiere das 'fs'-Modul, um Dateien zu lesen
const fs = require("fs");

// Lies die Daten aus den JSON-Dateien
const data_pop = fs.readFileSync("./data/pop.json");
const data_fert = fs.readFileSync("./data/fert.json");
const data_mort = fs.readFileSync("./data/mort.json");

// Konvertiere die JSON-Daten in JavaScript-Objekte
const pop = JSON.parse(data_pop);
const fert = JSON.parse(data_fert);
const mort = JSON.parse(data_mort);

// Entferne den ersten Eintrag aus jeder der JSON-Dateien (Annahme: es sind Überschriften)
pop.shift();
fert.shift();
mort.shift();

/**
 * Definiere das Datenformat, das du später verwenden möchtest.
 * Es sollte Informationen über Region, Typ, Jahr, Gesamtbevölkerung und Altersgruppen enthalten.
 * Jede Altersgruppe sollte die Anzahl der Personen in dieser Gruppe enthalten.
 * 
 * Beispiel:
 * {
 *   region: "Europa",
 *   type: "Land",
 *   year: "2021",
 *   totalPopulation: 1000000,
 *   age: [
 *     ["0age", 50000],
 *     ["1age", 45000],
 *     ["2age", 40000],
 *     ...
 *   ]
 * }
 */

// Starte einen Timer, um die Ausführungszeit des Programms zu messen
console.time("timer");

// Rufe die Funktion 'initData' auf, um die Daten im gewünschten Format zu generieren
const data = initData();

// Schreibe die generierten Daten in eine Datei
fs.writeFileSync("./data/test.json", JSON.stringify(data));

// Stoppe den Timer
console.timeEnd("timer");


/**
 * Diese Funktion konvertiert die Daten aus den JSON-Dateien in das gewünschte Format.
 * Sie durchläuft jeden Eintrag in der 'pop'-Datei und erstellt ein Objekt für jeden Eintrag.
 * 
 * Hinweis: In diesem Beispiel wird angenommen, dass alle Einträge in der 'pop'-Datei
 * das Jahr "2021" haben. Wenn dies nicht der Fall ist, wird das Objekt nicht erstellt.
 * 
 * Rückgabe: Ein Array von Objekten im gewünschten Format.
 */
function initData() {
    let data = [];

    for (let i = 0; i < pop.length; i++) {
        if (pop[i]["__EMPTY_2"] != "2021") return; // Wenn das Jahr nicht 2021 ist, überspringe diesen Eintrag.

        let obj = {
            region: pop[i]["__EMPTY"],
            type: pop[i]["__EMPTY_1"],
            year: pop[i]["__EMPTY_2"],
            totalPopulation: pop[i]["__EMPTY_103"],
            age: []
        }

        // Füge für jede Altersgruppe die Anzahl der Personen in dieser Gruppe zum Objekt hinzu
        for (let j = 4; j < pop[i].length; j++) {
            obj.age.push(Object.entries(pop[i])[j]);
        }

        data.push(obj);
    }

    return data;
}