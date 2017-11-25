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

    };
    let colorSpectrum = {Asia: "yellow", Americas: "red", Oceania: "green", Europe: "blue", Africa: "black"};

    d3.json("data/countries_1995_2012.json", function (error, data) {
        state.dataService = new DataService(data);
        state.filterContinents = state.dataService.getContinents().reduce((map, cont) => {
            map[cont] = false;
            return map;
        }, {});
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
                // updateTable(d3.select('table'), cellTextFormatter);
                d3.select("svg").remove();
                createBarChart();
            })
        ;
        d3.select('div.slider')
            .append('span')
            .text(maxYear)
            .append('br');

        d3.select('body')
            .append('div')
            .attr('class', 'encode')
            .text('Encode bars by: ');

        d3.select('div.encode')
            .selectAll('input[type=radio]')
            .data(['population', 'gdp'])
            .enter()
            .append('input')
            .attr('type', 'radio')
            .attr('name', 'encode')
            .attr('value', d => d )
            .on('change', function () {
                if (!d3.select(this).property('checked') && d3.select(this).attr('value') === 'gdp' ||
                    d3.select(this).property('checked') && d3.select(this).attr('value') === 'population' ){
                    state.encodeField = 'population'
                }else{
                    state.encodeField = 'country';
                }
                // updateTable(d3.select('table'), cellTextFormatter)
                d3.select("svg").remove();
                createBarChart();
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
                }
                this.parentNode.insertBefore(span, this.nextSibling);
            });


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
                d3.select("svg").remove();
                createBarChart();
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
            .attr('name', 'aggregation')
            .attr('value', d => d )
            .on('change', function () {
                if (!d3.select(this).property('checked') && d3.select(this).attr('value') === 'none' ||
                    d3.select(this).property('checked') && d3.select(this).attr('value') === 'continent' ){
                    state.aggregationField = 'continent'
                }else{
                    state.aggregationField = 'country';
                }
                // updateTable(d3.select('table'), cellTextFormatter)
                d3.select("svg").remove();
                createBarChart();
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

        d3.select('body')
            .append('div')
            .attr('class', 'sort')
            .text('Sort bars by: ');

        d3.select('div.sort')
            .selectAll('input[type=radio]')
            .data(['name', 'population', 'gdp'])
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
                d3.select("svg").remove();
                createBarChart();
                // console.log( state.sortedField);
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
                }
                this.parentNode.insertBefore(span, this.nextSibling);
            });
        d3.select("body").append("br")
        createBarChart();
    });


    
    function createBarChart(){
        let selectedData = state.select();
        let margin = {top: 50, bottom: 10, left:50, right: 40};
        let width = 1000 - margin.left - margin.right;
        let bar_height = 16;
        let height = bar_height*selectedData.length //- margin.top - margin.bottom;

        let xScale = d3.scaleLinear().range([0, width]);
        let yScale = d3.scaleBand().rangeRound([0, height], .8, 0);

        let svg = d3.select("body").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom);

        let max = d3.max(selectedData, d => d[state.encodeField] );
        let min = 0;

        xScale.domain([min, max]);
        yScale.domain(selectedData.map(d => d.name));

        let bar = svg.selectAll('g')
            .data(selectedData)
            .enter().append('g')
            .attr('transform', (d, i) => "translate(0," + i * bar_height + ")");

        bar.append('rect').transition().duration(1000)
            .attr('width', d => xScale(d[state.encodeField]))
            .attr('height', bar_height)
            .attr('x', 150)
            .attr('fill', d => colorSpectrum[d.continent]);

        bar.append('text')
            .text(d => d.name)
            .attr('y', function(d, i){
                return i + 9;
            });
    }

};
