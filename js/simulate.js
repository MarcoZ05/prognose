function simulateYear(countries) {
    return countries
}

function simulateYears(years, countries) {
    for (let i = 0; i < 100; i++) {
        countries = simulateYear(countries)
    }
    return countries
}

export { simulateYear, simulateYears }