class DataService {
    /*convert  to
    { 1995:[{name, continent, population, gdp, year},...],...}
    */
    constructor(data){
        let continentsMap = {};
        this.data = {};
        data[0].years.forEach( e => this.data[e.year] = []);
        data.forEach( country => {
            continentsMap[country.continent] = country.continent;
            country.years.forEach(e => {
                this.data[e.year].push({
                    name: country.name,
                    continent: country.continent,
                    gdp: e.gdp,
                    life_expectancy: e.life_expectancy,
                    population: e.population,
                    year: e.year
                })
            })
        });
        this.continents = d3.keys(continentsMap);
    }

    getContinents(){
        return this.continents;
    }

    years(){
        return d3.keys(this.data);
    }

    select(year, aggregationField, sortedField, /*{continent: isNeedToFilter}*/filterContinents){
        return this.sort(sortedField,
            this.aggregate(aggregationField,
                this.data[year].filter(country => !d3.values(filterContinents).includes(true) || filterContinents[country.continent]))
        );
    }

    aggregate(field, data){
        data = data ? data : this.data;
        if (field !== 'continent') return data;

        let nested_rows =  d3.nest()
            .key(d => d['continent'])
            .rollup(leaves => {
                let initial = JSON.parse(JSON.stringify(leaves[0]));
                d3.keys(initial).forEach(key => initial[key] = 0);
                initial.name = initial.continent = leaves[0].continent;
                initial.year = leaves[0].year;

                return leaves.reduce( (prev, curr) => {
                    let ans = {};
                    d3.keys(prev).forEach(key => {
                        switch (key) {
                            case 'gdp':
                            case 'population':
                                ans[key] = prev[key] += curr[key];
                                break;
                            case 'life_expectancy':
                                ans[key] = prev[key] += curr[key] / leaves.length;
                                break;
                            default:
                                ans[key] = prev[key];
                        }
                    });
                    return ans;
                } , initial);
            },)
            .entries(data);
        return nested_rows.map(e => e.value);
    }

    sort(field, data){
        data = data ? data : this.data;
        return data.sort(this.rowsComparableCondition(field));
    }

    rowsComparableCondition(header){
        switch (header){
            case 'name': return (r1, r2) => r1[header].localeCompare(r2[header]);
            case 'continent':
                return (r1, r2) => {
                    let result = r1[header].localeCompare(r2[header]);
                    if (!result) {
                        result = r1['name'].localeCompare(r2['name']);
                    }
                    return result;
                };
            default: return (r1, r2) =>  d3.descending(r1[header], r2[header]);
        }
    }
}