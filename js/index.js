// Population(age) + 2000 * Fertility(age) / Population(age) - Mortility(age)

// get data from json
const fs = require("fs");
const data_pop = fs.readFileSync("./data/pop.json");
const data_fert = fs.readFileSync("./data/fert.json");
const data_mort = fs.readFileSync("./data/mort.json");

// parse data to json object
const pop = JSON.parse(data_pop);
const fert = JSON.parse(data_fert);
const mort = JSON.parse(data_mort);

pop.shift();
fert.shift();
mort.shift();

/**
 * region / country
 * type (is it country / region /...)
 * Year
 * Population (in 1000)
 * 0age
 * 1age
 * 2age...
 * 100+age
 */

// start timer
console.time("timer");

// for (let i = 0; i < pop.length; i++) {
//     console.log(pop[i]["__EMPTY"]);
//     console.log(pop[i]["__EMPTY_1"]);
//     console.log(pop[i]["__EMPTY_2"]);
//     console.log(" ")
// }

// stop timer

const data = initData()
// write data as json in data/

console.timeEnd("timer");

/**
 * Diese Funktion konvertiert die Daten aus den JSON-Dateien in das gewünschte Format.
 * Sie durchläuft jeden Eintrag in der 'pop'-Datei und erstellt ein Objekt für jeden Eintrag.
 * 
 * Hinweis: In diesem Beispiel wird angenommen, dass alle Einträge in der 'pop'-Datei
 * das Jahr "2021" haben. Wenn dies nicht der Fall ist, wird das Objekt nicht erstellt.
 * 
 * Rückgabe: Ein Array von Objekten im gewünschten Format. */
function initData() {
    let data = [];

    for (let i = 0; i < pop.length; i++) {
        if (pop[i]["__EMPTY_2"] != "2021") return

        let obj = {
            region: pop[i]["__EMPTY"],
            type: pop[i]["__EMPTY_1"],
            year: pop[i]["__EMPTY_2"],
            totalPopulation: pop[i]["__EMPTY_103"],
            age: []
        }

        for (let j = 4; j < pop[i].length; j++) {
            obj.age.push(Object.entries(pop[i])[j]);
        }
        data.push(obj);
    }

    return data;
}

