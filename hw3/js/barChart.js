/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
        let data = this.chooseData(selectedDimension)

        d3.select('svg.barchartData').remove();

        let margin = {top: 50, bottom: 10, left: 100, right: 40};
        let width = 1600 - margin.left - margin.right;
        let barHeight = 15;
        let height = barHeight * data.length;// - margin.top - margin.bottom;
        //
        let xScale = d3.scaleLinear().range([0, width]);
        let yScale = d3.scaleBand().rangeRound([0, height], .8, 0);

        let max = d3.max(data);
        let min = 0;
        xScale.domain([min, max]);
        yScale.domain(d3.range([1, data.length]));

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);


        let svg = d3.select('#').append("svg")
            .attr('class', 'barchartData')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.append("g")

            .attr("class", "y-axis")
            .attr("transform", // сдвиг оси вниз и вправо на margin
                `translate(${margin.left},${0})`)
            .call(yAxis)

        let g =svg.append("g")
            .attr("class", "body")
            .attr("transform",  // сдвиг объекта вправо
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
            .style('stroke', 'orange');

        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)




        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData(selectedDimension) {

        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        return this.allData.map(e => e[selectedDimension.toUpperCase()])

    }
}