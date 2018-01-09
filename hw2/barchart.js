function barchartPerformance(d3SelectedRootElement, state) {
    let colorSpectrum = {Asia: "yellow", Americas: "red", Oceania: "green", Europe: "blue", Africa: "black"};

    d3.select('svg.barchartData').remove();
    d3SelectedRootElement.selectAll('br').data([1, 2]).enter().append('br');

    let selectedData = state.select();
    let margin = {top: 50, bottom: 10, left: 100, right: 40};
    let width = 1600 - margin.left - margin.right;
    let barHeight = 15;
    let height = barHeight * selectedData.length;// - margin.top - margin.bottom;
    //
    let xScale = d3.scaleLinear().range([0, width]);
    let yScale = d3.scaleBand().rangeRound([0, height], .8, 0);

    let max = d3.max(selectedData, d => d[state.encodeField]);
    let min = 0;
    xScale.domain([min, max]);
    yScale.domain(selectedData.map(d => d.name));

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
    yAxis.tickFormat(s => s.length > 10 ? s.substr(0, 12)+"..." : s )

    let tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let svg = d3SelectedRootElement.append("svg")
        .attr('class', 'barchartData')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform",
            `translate(${margin.left},${0})`)
        .call(yAxis)

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform",
            `translate(${margin.left},${height})`)
        .call(xAxis)

    let g =svg.append("g")
        .attr("class", "body")
        .attr("transform",
            `translate(${margin.left},${0})`);
    g.selectAll("rect.bar")
        .data(selectedData)
        .enter()
        .append('g')
        .attr('class', 'gContainer')
        .on("mouseover", function(d) {
            tip.transition()
                .duration(200)
                .style("opacity", .9);
            tip.html(d.name)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .append("rect").transition().duration(1000)
        .attr("class", "bar")
        .attr("y", d => yScale(d.name))
        .attr('height', barHeight-1)
        .attr("width", d => xScale(d[state.encodeField]))
        .style('fill', d => colorSpectrum[d.continent])
        // .style('stroke', 'orange');
}
