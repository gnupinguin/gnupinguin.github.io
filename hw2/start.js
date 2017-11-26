window.onload = () => {
    let state = {
        sortedField: 'name',
        select: null,
        dataService: null,
        aggregationField: 'name',
        filterContinents: {},
        year: 0,
        columns: ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'],
        encodeField: 'population',
        updatePerformance: null,
    };

    d3.json("data/countries_1995_2012.json", function (error, data) {
        state.dataService = new DataService(data);
        state.filterContinents = state.dataService.getContinents().reduce((map, cont) => {map[cont] = false; return map;}, {});
        state.select = () => state.dataService.select(state.year, state.aggregationField, state.sortedField, state.filterContinents);
        let minYear = state.year = d3.min(state.dataService.years());
        let maxYear = d3.max(state.dataService.years());

        d3.select('body')
            .append('div')
            .attr('class', 'performance')
            .text('Performance: ');

        d3.select('div.performance')
            .selectAll('input[type=radio]')
            .data(['table', 'barchart'])
            .enter()
            .append('input')
            .attr('type', 'radio')
            .attr('name', 'details')
            .attr('value', d => d )
            .on('change', function (performance) {
                let root = d3.select('div.root');
                root.html(""); //delete all children
                if (performance === 'barchart'){
                    d3.select('div.sort').style('visibility', 'visible');
                    d3.select('div.encode').style('visibility', 'visible');
                    state.updatePerformance = () => barchartPerformance(root, state);
                } else {
                    d3.select('div.sort').style('visibility', 'hidden');
                    d3.select('div.encode').style('visibility', 'hidden');
                    state.updatePerformance = () => tablePerfomance(root, state);
                }
                state.updatePerformance();
            });
        d3.select('div.performance')
            .selectAll('input[type=radio]')
            .each(function(value) {
                let span = document.createElement('span')
                switch(value) {
                    case 'table':
                        span.textContent = 'Table';
                        // d3.select(this).property('checked', true);
                        break;
                    case 'barchart':
                        span.textContent = 'Bar chart';
                        break;
                }
                this.parentNode.insertBefore(span, this.nextSibling);
            });


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
                state.updatePerformance();
            })
        ;
        d3.select('div.slider')
            .append('span')
            .text(maxYear)
            .append('br');


        d3.select('body')
            .append('div')
            .attr('class', 'aggregation')
            .text('Aggregation: ');

        d3.select('div.aggregation')
            .selectAll('input[type=radio]')
            .data(['country', 'continent'])
            .enter()
            .append('input')
            .attr('type', 'radio')
            .attr('name', 'aggregation')
            .attr('value', d => d )
            .on('change', function () {
                state.aggregationField = d3.select(this).attr('value');
                state.updatePerformance();
            });

        d3.select('div.aggregation')
            .selectAll('input[type=radio]')
            .each(function(value) {
                let span = document.createElement('span');
                if (value ==='country'){
                    d3.select(this).property('checked', true);
                    span.textContent = 'None';
                }else{
                    span.textContent = 'By Continent';
                }
                this.parentNode.insertBefore(span, this.nextSibling);
            });

        d3.select('body')
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
                state.updatePerformance();
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
            .attr('class', 'sort')
            .text('Sort bars by: ');

        d3.select('div.sort')
            .selectAll('input[type=radio]')
            .data(['name', 'population', 'gdp', 'life_expectancy'])
            .enter()
            .append('input')
            .attr('type', 'radio')
            .attr('name', 'sort')
            .attr('value', d => d )
            .on('change',  () => {
                state.sortedField = d3.select("div.sort")
                    .selectAll("input[type=radio]")
                    .filter(function(){return d3.select(this).property('checked')})
                    .attr('value');
                state.updatePerformance();
            });
        d3.select('div.sort')
            .selectAll('input[type=radio]')
            .each(function(value) {
                let span = document.createElement('span');
                switch(value){
                    case 'population':
                        span.textContent = 'Population';
                        break;
                    case 'gdp':
                        span.textContent = 'GDP';
                        break;
                    case 'name':
                        span.textContent = 'Name';
                        d3.select(this).property('checked', true);
                        break;
                    case 'life_expectancy':
                        span.textContent = 'Life expectancy';

                        break;
                }
                this.parentNode.insertBefore(span, this.nextSibling);
            });

        d3.select('body')
            .append('div')
            .attr('class', 'encode')
            .text('Encode bars by: ');

        d3.select('div.encode')
            .selectAll('input[type=radio]')
            .data(['population', 'gdp', 'life_expectancy'])
            .enter()
            .append('input')
            .attr('type', 'radio')
            .attr('name', 'encode')
            .attr('value', d => d )
            .on('change', function () {
                state.encodeField = d3.select(this).attr('value');
                state.updatePerformance();
            });
        d3.select('div.encode')
            .selectAll('input[type=radio]')
            .each(function(value) {
                let span = document.createElement('span');
                switch(value){
                    case 'population':
                        span.textContent = 'Population';
                        d3.select(this).property('checked', true);
                        break;
                    case 'gdp':
                        span.textContent = 'GDP';
                        break;
                    case 'life_expectancy':
                        span.textContent = 'Life expectancy';
                        break;
                }
                this.parentNode.insertBefore(span, this.nextSibling);
            });

        d3.select('body')
            .append('div')
            .attr('class', 'root');

        d3.select('div.performance')
            .selectAll('input')
            .filter(v => v === 'table')
            .property('checked',true)
            .on('change')('table')
    })

}