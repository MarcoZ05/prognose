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
console.log(data)
const data1 = simulateYear(data)
console.log(data)

function initPopData(year = "2021", countries = undefined) {
    let data = [];

    // population
    for (let i = 0; i < pop.length; i++) {
        if (pop[i]["__EMPTY_2"] == year && (countries === undefined || countries.includes(pop[i]["__EMPTY"]))) {
            let obj = {
                country: pop[i]["__EMPTY"],
                type: pop[i]["__EMPTY_1"],
                year: pop[i]["__EMPTY_2"],
                pop: [],
                mort: [],
                fert: []
            }

            obj.pop.push(pop[i]["Total population by single age, both sexes combined (thousands)"])
            for (let j = 3; j < 103; j++) {
                obj.pop.push(pop[i]["__EMPTY_" + j]);
            }
            data.push(obj)
        }
    }



    return data;
}

function simulateYear(countries, birth_rate = 0.06605) {
    countries.forEach((country) => {
        country.year++

        for (let i = country.pop.length - 2; i >= 0; i--) {
            country.pop[i + 1] = country.pop[i] * (1 - 0.0075)
        }

        // 0 age
        country.pop[0] = getChildbearingWomen(country.pop, fert) * birth_rate
    })

    return countries;
}

function getChildbearingWomen(population) {
    let all = 0;

    population.forEach((age, i) => {
        if (i >= 15 && i <= 49) {
            all += age / 2
        }
    })

    console.log(all)

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