
window.onload = () => {
    let state = {
        sortedField: 'name',
        select: null,
        dataService: null,
        aggregationField: 'name',
        filterContinents: {},
        year: 0,
        columns: ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'],

    };
    let colorSpectrum = {white: "lightgrey", lightgrey: "white"};

    d3.json("data/countries_1995_2012.json", function (error, data) {
        state.dataService = new DataService(data);
        state.filterContinents = state.dataService.getContinents().reduce((map, cont) => {map[cont] = false; return map;}, {});
        state.select = () => state.dataService.select(state.year, state.aggregationField, state.sortedField, state.filterContinents);
        let minYear = state.year = d3.min(state.dataService.years());
        let maxYear = d3.max(state.dataService.years());

        d3.select('body')
            .append('div')
            .attr('class', 'slider')
            .text('Time update: ' + minYear)
            .append('input')
            .attr('type', "range")
            .attr('min', minYear)
            .attr('max', maxYear)
            .attr('step', 1)
            .attr('value', minYear)
            .on('input', function () {
                state.year = this.value;
                updateTable(d3.select('table'), cellTextFormatter);
            })
        ;
        d3.select('div.slider')
            .append('span')
            .text(maxYear)
            .append('br');


        d3.select("body")
            .append('div')
            .attr('class', 'filter')
            .text('Filter by: ')
            .selectAll("label")
            .data(d3.keys(state.filterContinents))
            .enter()
            .append('input')
            .attr('type', 'checkbox')
            .attr('value', d => d)
            .on('change', function(continent) {
                state.filterContinents[continent] = d3.select(this).property('checked');
                updateTable(d3.select("table"), cellTextFormatter);
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
                    state.aggregationField = 'continent'
                }else{
                    state.aggregationField = 'country';
                }
                updateTable(d3.select('table'), cellTextFormatter)
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

        document.body.appendChild(createTable(cellTextFormatter));
        d3.select("table")
            .select('thead')
            .select('tr')
            .selectAll('th')
            .on('click', (headerName, index, array) => {
                let tbody = d3.select(array[index].parentNode.parentNode.nextSibling);//th->tr->thead, tbody
                tbody.selectAll("tr").sort(state.dataService.rowsComparableCondition(headerName));
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

    function createTable(tdTextFormatter) {
        let table = document.createElement('table');
        table.appendChild(createThead());
        table.appendChild(document.createElement('tbody'));
        updateTable(d3.select(table), tdTextFormatter);
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

    function updateTable(selectedTable, tdTextFormatter){
        selectedTable
            .select('tbody')
            .selectAll('tr')
            .remove();
        appendRows(selectedTable.select('tbody'), tdTextFormatter);

        paintToZebra();
    }


    function appendRows(selectedTbody, /*function(columnName, cellValue)*/tdTextFormatter ){
        let rows = selectedTbody.selectAll("tr")
            .data(state.select())
            .enter()
            .append("tr");

        rows.selectAll("td")
            .data(row => state.columns.map(columnName => tdTextFormatter(columnName, row[columnName])))
            .enter()
            .append("td")
            .text(d => d);

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

};