const fs = require("fs");

const data_pop = fs.readFileSync("./data/pop.json");
const data_fert = fs.readFileSync("./data/fert.json");
const data_mort = fs.readFileSync("./data/mort.json");
const pop = JSON.parse(data_pop);
const fert = JSON.parse(data_fert);
const mort = JSON.parse(data_mort);
pop.shift();
fert.shift();
mort.shift();

const data = initPopData("2021", ["WORLD"])
const data1 = simulateYear(data)

function initPopData(year = "2021", countries = undefined) {
    let data = [];

    // population
    for (let i = 0; i < pop.length; i++) {
        if (pop[i]["__EMPTY_2"] == year && (countries === undefined || countries.includes(pop[i]["__EMPTY"]))) {
            let obj = {
                type: pop[i]["__EMPTY_1"],
                year: pop[i]["__EMPTY_2"],
                pop: [],
                // mort: [],
                // fert: []
            }

            for (let j = 3; j < 103; j++) {
                obj.pop.push(pop[i]["__EMPTY_" + j]);
            }
            data[pop[i]["__EMPTY"]] = obj
        }
    }

    // // mortility
    // for (let i = 0; i < mort.length; i++) {
    //     if (mort[i]["__EMPTY_10"] == year && (countries === undefined || countries.includes(mort[i]["__EMPTY_2"]))) {
    //         for (let j = 11; j < 111; j++) {
    //             data[mort[i]["__EMPTY_2"]].mort.push(mort[i]["__EMPTY_" + j]);
    //         }
    //     }
    // }

    // // fertility
    // for (let i = 0; i < fert.length; i++) {
    //     if (fert[i]["__EMPTY_10"] == year && (countries === undefined || countries.includes(fert[i]["__EMPTY_2"]))) {
    //         for (let j = 11; j < 45; j++) {
    //             data[fert[i]["__EMPTY_2"]].fert.push(fert[i]["__EMPTY_" + j]);
    //         }
    //     }
    // }

    return data;
}

function simulateYear(countries, death_rate = 0.075, birth_rate = 0.06605) {
    console.log(countries)
    // give type of countries
    console.log(typeof countries)

    for(let i = 0; i < countries.length;i++){
        console.log(2);
        const country = countries[i]
        
        for (let i = country.pop.length - 2; i > 0; i--) {
            country.pop[i + 1] = country.pop[i] * (1 - death_rate)
        }

        // 0 age
        country.pop[0] = getChildbearingWomen(pop, fert) * birth_rate
    }

    // countries.forEach((country) => {
    //     console.log(country);

    //     for (let i = country.pop.length - 2; i > 0; i--) {
    //         country.pop[i + 1] = country.pop[i] * (1 - death_rate)
    //     }

    //     // 0 age
    //     country.pop[0] = getChildbearingWomen(pop, fert) * birth_rate

    // })

    return countries;
}

function getChildbearingWomen(pop) {
    let all = 0;

    // women between 15 and 49

    pop.foreach((age, i) => {
        if (age >= 15 && age <= 49)
            all += age / 2
    })

    return all;
}

function getTotalPopulation(countries) {
    let pop = 0;

    countries.foreach((country) => {
        country.pop.foreach((age) => {
            pop += age
        })
    })

    return pop
}

