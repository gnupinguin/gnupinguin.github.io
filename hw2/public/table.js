
window.onload = () => {
    let state = {sortedField: 'continent', filteringContinents: {}, aggregationFunction: aggregateByCountry};
    let colorSpectrum = {white: "lightgrey", lightgrey: "white"};

    d3.json("countries_2012.json", function (error, data) {
        data.forEach(element => {
            ['alpha2_code', 'latitude', 'longitude'].forEach(field => delete element[field]);
            state.filteringContinents[element['continent']] = false;
        });//exclude extra fields

        let columns = Object.keys(data[0]).sort((a, b) => {
            if (a === 'name') return 0;
            if (b === 'name') return 1;
            return a.localeCompare(b);
        });

        d3.select("body")
            // .append('span', 'Filter by: ')
            .selectAll("label")
            .data(Object.keys(state.filteringContinents))
            .enter()
            .append('label')
            .text(d => d + ": ")
            .append('input')
            .attr('type', 'checkbox')
            .attr('value', d => d)
            .on('change', function(continent) {
                state.filteringContinents[continent] = d3.select(this).property('checked');
                    d3.select("table")
                        .select('tbody')
                        .selectAll('tr')
                        .remove();
                    appendRows(d3.select("table").select('tbody'),
                        columns,
                        data.filter(e => Object.values(state.filteringContinents).includes(true)?
                            state.filteringContinents[e['continent']]:
                            true
                        ),
                        cellTextFormatter);
                d3.select("table")
                    .select('tbody')
                    .selectAll('tr')
                    .sort(rowsComparableCondition(state.sortedField));

                paintToZebra()
            });

        d3.select('body')
            .append('br');
        d3.select('body')
            .append('span')
            .text('Aggregation: ');

        d3.select('body')
            .selectAll('input[type=radio]')
            .data(['None', 'By Continent'])
            .enter()
            .append('label')
            .text(d => d)
            .append('input')
            .attr('type', 'radio')
            .attr('name', 'details')
            .attr('value', d => d === 'None' ? 'none' : 'continent')
            .on('change', function () {
                if (!d3.select(this).property('checked') && d3.select(this).attr('value') === 'none' ||
                    d3.select(this).property('checked') && d3.select(this).attr('value') === 'continent' ){
                    state.aggregationFunction = aggregateByContinent;
                }else{
                    state.aggregationFunction = aggregateByCountry;
                }
                updateTable(d3.select('table'), columns, data, cellTextFormatter)


            });


        document.body.appendChild(createTable(columns, data,));
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

    });

    function createTable(columns, data) {
        let table = document.createElement('table');
        table.appendChild(createThead(columns, null, 'thead'));

        table.appendChild(createTbody(columns, data, cellTextFormatter));
        return table;
    }

    function createThead(columns){
        let thead = d3.select(document.createElement('thead'));

        thead.append("tr").selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function (d) {
                return d;
            });
        return thead.node();
    }

    function createTbody(columns, data, /*function(columnName, cellValue)*/tdTextFormatter) {
        let tbody = d3.select(document.createElement('tbody'));
        // tbody.selectAll('tr').data([]).enter();
        appendRows(tbody, columns, data, tdTextFormatter);
        return tbody.node();
    }

    function updateTable(selectedTable, columns, data, tdTextFormatter){
        selectedTable
            .select('tbody')
            .selectAll('tr')
            .remove();
        appendRows(selectedTable.select('tbody'),
            columns,
            state.aggregationFunction(data, Object.keys(state.filteringContinents)),
            tdTextFormatter);

        selectedTable
            .select('tbody')
            .selectAll('tr').sort(rowsComparableCondition(state.sortedField));

        paintToZebra();
    }

    function appendRows(selectedTbody, columns, data, /*function(columnName, cellValue)*/tdTextFormatter ){
        let rows = selectedTbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        rows.selectAll("td")
            .data(row => columns.map(columnName => tdTextFormatter(columnName, row[columnName])))
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
        // console.log(nested_rows.map(e => e.value))
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