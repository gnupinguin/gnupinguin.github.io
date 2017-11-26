
function tablePerfomance(d3SelectedRootElement, state) {

    let colorSpectrum = {white: "lightgrey", lightgrey: "white"};

    function createTable(tdTextFormatter) {
        let table = document.createElement('table');
        let thead = createThead();

        table.appendChild(thead);
        table.appendChild(document.createElement('tbody'));
        updateTable(d3.select(table).attr('class', 'dataTable'), tdTextFormatter);

        d3.select(thead)
            .selectAll('tr')
            .selectAll('th')
            .on('click', function (header) {
                state.sortedField = header;
                updateTable(d3.select(table), cellTextFormatter)
            });

        return table;
    }

    function createThead(){
        let thead = d3.select(document.createElement('thead')).attr('class', 'theadTableData');

        thead.append("tr").selectAll("th")
            .data(state.columns)
            .enter()
            .append("th")
            .text(d => d);
        return thead.node();
    }

    function updateTable(selectedTable, tdTextFormatter){
        selectedTable
            .select('tbody')
            .selectAll('tr')
            .remove();
        appendRows(selectedTable.select('tbody'), tdTextFormatter);

        paintToZebra(selectedTable);
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

    function paintToZebra(selectedTable) {
        let counter = 0;
        selectedTable.
            selectAll('tr')
            .style('background-color', () => Object.keys(colorSpectrum)[(counter++) % 2]);
    }

    let table = d3SelectedRootElement.select('table.dataTable');
    if (table.empty()) {
        d3SelectedRootElement.node().appendChild(createTable(cellTextFormatter))
    }else {
        updateTable(table, cellTextFormatter)
    }

};