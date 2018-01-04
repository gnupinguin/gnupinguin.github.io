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
        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)

        let data = this.chooseData(selectedDimension);
        let svg = d3.select('#barChart');

        let margin = {top: 50, bottom: 10, left: 60, right: 40};
        let width = svg.attr('width')-100;
        let height = svg.attr('height')-100;

        let yScale = d3.scaleLinear().range([0, height]);

        let xScale = d3.scaleBand().rangeRound([0, width], .8, 0);

        let max = d3.max(data.map(e => e.value));
        let min = 0;
        xScale.domain(data.map(e => e.year).sort());
        yScale.domain([max, min]);

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        svg.select('#xAxis')
            .attr("transform", // сдвиг оси вниз и вправо на margin
                `translate(${margin.left},${height + margin.top})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', `rotate(${-90})`)
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")


        svg.select('#yAxis')
            .attr("transform", // сдвиг оси вниз и вправо на margin
                `translate(${margin.left},${margin.top})`)
            .call(yAxis);

        svg.select('#bars')
            .attr("transform",  // сдвиг объекта вправо
                `translate(${0},${margin.top})`)
            .selectAll('g').remove();

        let bars = svg.select('#bars').selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .append('rect')
            .style("fill", "steelblue")
            .attr('x' , d => margin.left + xScale(d.year))
            .attr('y', d => yScale(d.value))
            .attr('height', d => 300 - yScale(d.value))
            .attr("width", xScale.range()[1]/data.length -2)
            .text(d => d.value)


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

        bars.on('click', (elem, i, arr) => {
            bars.style("fill", "steelblue")
            d3.select(arr[i]).style("fill", 'orange')

            let worldCupData = this.selectByYear(elem.year);

            this.infoPanel.updateInfo(worldCupData);
            this.worldMap.updateMap(worldCupData)
        })

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

        // if (selectedDimension === 'attendance'){
        //     selectedDimension = 'average_' + selectedDimension;
        // }
        // selectedDimension = selectedDimension.toUpperCase();

        return this.allData.map(e => {return {year: Number(e['YEAR']), value: Number(e[selectedDimension])}}).sort((a, b) => a.year - b.year);
    }

    selectByYear(year){
        return this.allData.filter(e => e['YEAR'] == year)[0];
    }
}