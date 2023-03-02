const fs = require('fs')

const data_pop = fs.readFileSync('./data/pop.json')
const data_mort = fs.readFileSync('./data/mort.json')
const data_hdi = fs.readFileSync('./data/hdi.json')

const pop = JSON.parse(data_pop)
const mort = JSON.parse(data_mort)
const hdi = JSON.parse(data_hdi)
pop.shift()
mort.shift()

let startYear = 2021
const endYear = 2100
const countries = ['WORLD']

const popArr = []


let data = initPopData(startYear.toString(), countries)


const interval = setInterval(() => {
    if (endYear <= startYear) clearInterval(interval)
    const newData = simulateYear(JSON.parse(JSON.stringify(data)))
    popArr.push({ pop: getTotalPopulation(newData[0]), year: startYear })
    fs.writeFileSync(
        './data/data.js',
        'export default ' + JSON.stringify(newData)
    )
    data = newData

    fs.writeFileSync("./data/pop.js", "export default " + JSON.stringify(popArr));

    startYear++
}, 500)


function initPopData(year = '2021', countries = undefined) {
    let data = []

    // population
    for (let i = 0; i < pop.length; i++) {
        if (
            pop[i]['__EMPTY_2'] == year &&
            (countries === undefined || countries.includes(pop[i]['__EMPTY']))
        ) {
            let obj = {
                country: pop[i]['__EMPTY'],
                type: pop[i]['__EMPTY_1'],
                year: pop[i]['__EMPTY_2'],
                pop: [],
                mort: [],
                fert: []
            }

            obj.pop.push(
                pop[i][
                'Total population by single age, both sexes combined (thousands)'
                ]
            )
            for (let j = 3; j < 103; j++) {
                obj.pop.push(pop[i]['__EMPTY_' + j])
            }
            data.push(obj)
        }
    }

    // mortality
    for (let i = 0; i < mort.length; i++) {
        let obj = {
            country: mort[i]['__EMPTY_2'],
            year: mort[i]['__EMPTY_10']
        }

        const newData = data.find(e => {
            return e.country == obj.country
        })
        if (
            obj.year == year &&
            (countries === undefined || countries.includes(obj.country))
        ) {
            newData.mort.push(
                mort[i][
                'Total population by single age, both sexes combined (thousands)'
                ]
            )
            for (let j = 11; j < 110; j++) {
                newData.mort.push(mort[i]['__EMPTY_' + j] / newData.pop[i])
            }
        }
    }

    // hdi
    for (let i = 0; i < hdi.lenght; i++) {
        let obj = {
            country: hdi[i]['Country'],
            hdi: hdi[i]['HDI']
        }

        if ((countries === undefined || countries.includes(obj.country))) {
            const newData = data.find(e => {
                return e.country == obj.country
            })

            newData.hdi = obj.hdi
        }
    }

    return data
}

function simulateYear(countries) {
    countries.forEach(country => {
        country.year++

        for (let i = country.pop.length - 2; i >= 0; i--) {
            country.pop[i + 1] = Math.round(
                Math.abs(country.pop[i] * (1 - country.mort[i]))
            )
            if (country.pop[i + 1] < 0) country.pop[i + 1] = 0
        }

        // if (country.country == "WORLD")
        //     country.pop[1] = country.pop[0] * (1 - Math.abs((country.year <= 2044 ? 0.00404 : (-1.34 * country.year + 2743) / 1000)))
        // if (country.hdi > 0.85)
        //     country.pop[1] = country.pop[0] * (1 - 0.0049)
        // if (country.hdi > 0.7)
        //     country.pop[1] = country.pop[0] * (1 - 0.0052)
        // if (country.hdi > 0.55)
        //     country.pop[1] = country.pop[0] * (1 - Math.abs((country.year <= 2029 ? 0.0049 : (-2.12 * country.year + 4351) / 1000)))
        // else
        //     country.pop[1] = country.pop[0] * (1 - Math.abs((country.year <= 2129 ? 0.0049 : (-country.year + 2178) / 1000)))

        country.pop[0] =
            getChildbearingWomen(country.pop) *
            (-0.000427 * country.year + 0.931 <= 0.049
                ? 0.049
                : -0.000427 * country.year + 0.931)
        if (country.pop[0] < 0) country.pop[0] = 0
    })

    return countries
}

function getChildbearingWomen(population) {
    let all = 0

    population.forEach((age, i) => {
        if (i >= 15 && i <= 49) {
            all += age / 2
        }
    })

    return all
}

function getTotalPopulation(country) {
    let population = 0

    country.pop.forEach(age => {
        population += age
    })

    return population
}
