
window.onload = () => {
    let state = {
        sortedField: 'continent',
        filteringContinents: {},
        aggregationFunction: aggregateByCountry,
        years: {
            min: 0,
            max: 1,
            current: 0
        },
        columns: ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'],

    };
    let colorSpectrum = {white: "lightgrey", lightgrey: "white"};

    d3.json("data/countries_1995_2012.json", function (error, data) {
        let preparedData  = prepareData(data);
        data = preparedData.data;
        state.filteringContinents = preparedData.filteringContinents;
        let sortedYears = d3.keys(data[0].years).sort();
        state.years.min = state.years.current = sortedYears[0];
        state.years.max = sortedYears[sortedYears.length-1];

        d3.select('body')
            .append('div')
            .attr('class', 'slider')
            .text('Time update: ' + state.years.min)
            .append('input')
            .attr('type', "range")
            .attr('min', state.years.min)
            .attr('max', state.years.max)
            .attr('step', 1)
            .attr('value', state.years.min)
            .on('input', function () {
                state.years.current = this.value;
                updateTable(d3.select('table'), data, cellTextFormatter);
            })
        ;
        d3.select('div.slider')
            .append('span')
            .text(state.years.max)
            .append('br');


        d3.select("body")
            .append('div')
            .attr('class', 'filter')
            .text('Filter by: ')
            .selectAll("label")
            .data(Object.keys(state.filteringContinents))
            .enter()
            .append('input')
            .attr('type', 'checkbox')
            .attr('value', d => d)
            .on('change', function(continent) {
                state.filteringContinents[continent] = d3.select(this).property('checked');
                updateTable(d3.select("table"), data, cellTextFormatter);
            });
        d3.select('div.filter')
            .selectAll('input[type=checkbox]')
            .each(function(value) {
                let span = document.createElement('span');
                span.textContent = value;
                this.parentNode.insertBefore(span, this.nextSibling);
            });

        d3.select('body')
            .append('div')
            .attr('class', 'aggregation')
            .text('Aggregation: ');

        d3.select('div.aggregation')
            .selectAll('input[type=radio]')
            .data(['none', 'continent'])
            .enter()
            .append('input')
            .attr('type', 'radio')
            .attr('name', 'details')
            .attr('value', d => d )
            .on('change', function () {
                if (!d3.select(this).property('checked') && d3.select(this).attr('value') === 'none' ||
                    d3.select(this).property('checked') && d3.select(this).attr('value') === 'continent' ){
                    state.aggregationFunction = aggregateByContinent;
                }else{
                    state.aggregationFunction = aggregateByCountry;
                }
                updateTable(d3.select('table'), data, cellTextFormatter)
            });

        d3.select('div.aggregation')
            .selectAll('input[type=radio]')
            .each(function(value) {
                let span = document.createElement('span')
                if (value ==='none'){
                    d3.select(this).property('checked', true);
                    span.textContent = 'None';
                }else{
                    span.textContent = 'By Continent';
                }
                this.parentNode.insertBefore(span, this.nextSibling);
            });

        document.body.appendChild(createTable(data, cellTextFormatter));
        d3.select("table")
            .select('thead')
            .select('tr')
            .selectAll('th')
            .on('click', (headerName, index, array) => {
                let tbody = d3.select(array[index].parentNode.parentNode.nextSibling);//th->tr->thead, tbody
                tbody.selectAll("tr").sort(rowsComparableCondition(headerName));
                state.sortedField = headerName;
                paintToZebra();
            });

        d3.select("table")
            .select('tbody')
            .selectAll('tr')
            .selectAll('td')
            .on("mouseover", (elemText, index, row) => {
                d3.select(row[index].parentNode )
                    .style("background-color", "#F3ED86");

            }).on("mouseout", (elemText, index, row) => {
                let neighbourTrNode = row[0].parentNode.previousSibling ?
                row[0].parentNode.previousSibling :
                row[0].parentNode.nextSibling;

                d3.select(row[0].parentNode)
                    .style("background-color", colorSpectrum[d3.select(neighbourTrNode).style("background-color")])
        });
        paintToZebra();

        let margin = {top: 50, bottom: 10, left:300, right: 40};
        let width = 900 - margin.left - margin.right;
        let height = 900 - margin.top - margin.bottom;

        let xScale = d3.scaleLinear().range([0, width]);
        let yScale = d3.scaleBand().rangeRound([0, height], .8, 0);

        let svg = d3.select("body").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom);

        let g = svg.append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");

        // d3.json("countries_2012.json", function(data) {
        //
        let selectedData = selectFromDb(data);
            let max = d3.max(selectedData, d => d.population );
            let min = 0;
        //
            xScale.domain([min, max]);
            yScale.domain(selectedData.map(d => d.name));
        //
            let groups = g.append("g")
                .selectAll("text")
                .data(selectedData)
                .enter()
                .append("g");
        //
            let bars = groups
                .append("rect")
                .attr("width", function(d) { return xScale(d.population); })
                .attr("height", 5)
                .attr("x", xScale(min))
                .attr("y", function(d) { return yScale(d.name); })
        // });

    });

    function createTable(data, tdTextFormatter) {
        let table = document.createElement('table');
        table.appendChild(createThead());
        table.appendChild(document.createElement('tbody'));
        updateTable(d3.select(table), data, tdTextFormatter);
        return table;
    }

    function createThead(){
        let thead = d3.select(document.createElement('thead'));

        thead.append("tr").selectAll("th")
            .data(state.columns)
            .enter()
            .append("th")
            .text(function (d) {
                return d;
            });
        return thead.node();
    }

    function updateTable(selectedTable, data, tdTextFormatter){
        selectedTable
            .select('tbody')
            .selectAll('tr')
            .remove();
        appendRows(selectedTable.select('tbody'), selectFromDb(data), tdTextFormatter);

        selectedTable
            .select('tbody')
            .selectAll('tr').sort(rowsComparableCondition(state.sortedField));

        paintToZebra();
    }

    function selectFromDb(data) {
        let podData = data.map(d => {
            let ans = {name: d.name, continent: d.continent, year: state.years.current};
            d3.keys(d.years[state.years.current]).forEach(key => ans[key] = d.years[state.years.current][key]);
            return ans;
        });
        return state.aggregationFunction(podData, Object.keys(state.filteringContinents))
            .filter(e => d3.values(state.filteringContinents).includes(true)?
                state.filteringContinents[e['continent']]:
                true
            );

    }

    /*convert  to
    {
        name,
        continent,
        years:{
            1995:{population, gdp, ...},
            ...
        }
    }*/
    function prepareData(data){
        data = JSON.parse(JSON.stringify(data));
        let filteringContinents = {};
        let newData = data.map((country) => {
            filteringContinents[country.continent] = false;
            let newCountry = {name: country.name, continent: country.continent, years: {}};
            country.years.forEach(dataByYear => {
                newCountry.years[dataByYear.year] = dataByYear;
                let year =  dataByYear.year;
                delete newCountry.years[dataByYear.year].year;
                d3.keys(newCountry.years[year])
                    .filter(key => !state.columns.includes(key))
                    .forEach(key => delete newCountry.years[year][key])
            } );
            return newCountry;
        });
        return {data: newData, filteringContinents: filteringContinents};
    }

    function appendRows(selectedTbody, data, /*function(columnName, cellValue)*/tdTextFormatter ){
        let rows = selectedTbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        rows.selectAll("td")
            .data(row => state.columns.map(columnName => tdTextFormatter(columnName, row[columnName])))
            .enter()
            .append("td")
            .text(d => d);

    }

    function aggregateByContinent(data){
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

    function aggregateByCountry(data){
        return data;
    }


    function cellTextFormatter(columnName, cellValue){
        let gdpFormatter = d3.formatPrefix(",.1", 1e+9);
        let populationFormatter = d3.format(",");
        let lifeExpectancyFormatter = d3.format(",.1f");
        switch (columnName) {
            case 'gdp':
                return gdpFormatter(cellValue);
            case 'population':
                return populationFormatter(cellValue);
            case 'life_expectancy':
                return lifeExpectancyFormatter(cellValue);
            default:
                return cellValue;
        }
    }

    function paintToZebra() {
        let counter = 0;
        d3.selectAll("tr").style('background-color', () => Object.keys(colorSpectrum)[(counter++) % 2]);
    }

    function rowsComparableCondition(header){
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
};