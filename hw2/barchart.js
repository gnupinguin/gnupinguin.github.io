function barchartPerformance(d3SelectedRootElement, state) {
    let colorSpectrum = {Asia: "yellow", Americas: "red", Oceania: "green", Europe: "blue", Africa: "black"};

    d3.select('svg.barchartData').remove();
    d3SelectedRootElement.selectAll('br').data([1, 2]).enter().append('br');

    let selectedData = state.select();
    let margin = {top: 50, bottom: 10, left: 50, right: 40};
    let width = 1000 - margin.left - margin.right;
    let barHeight = 15;
    let height = barHeight * selectedData.length - margin.top - margin.bottom;

    let xScale = d3.scaleLinear().range([0, width]);
    let yScale = d3.scaleBand().rangeRound([0, height], .8, 0);

    let svg = d3SelectedRootElement.append("svg")
        .attr('class', 'barchartData')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let max = d3.max(selectedData, d => d[state.encodeField]);
    let min = 0;

    xScale.domain([min, max]);
    yScale.domain(selectedData.map(d => d.name));

    let bar = svg.selectAll('g')
        .data(selectedData)
        .enter()
        .append('g')
        .attr('transform', (d, i) => "translate(0," + i * barHeight + ")");

    bar.append('rect').transition().duration(1000)
        .attr('width', d => xScale(d[state.encodeField]))
        .attr('height', barHeight-1)
        .attr('x', 150)
        .style('fill', d => colorSpectrum[d.continent]);

    bar.append('text')
        .text(d => d.name)
        .attr('y', (d, i) => i + 9);

}