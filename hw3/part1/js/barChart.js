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
            .attr("transform",
                `translate(${margin.left},${height + margin.top})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', `rotate(${-90})`)
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em");


        svg.select('#yAxis')
            .attr("transform",
                `translate(${margin.left},${margin.top})`)
            .transition()
            .duration(2000)
            .delay(200)
            .call(yAxis);


        svg.select('#bars')
            .attr("transform",
                `translate(${0},${margin.top})`);

        let barWidth = xScale.range()[1]/data.length - 2;

        let rect = svg.select('#bars').selectAll('rect').data(data);
        this.rectConfig(rect, xScale, yScale, margin, height, barWidth);
        rect = rect.enter().append('rect');

        this.rectConfig(rect, xScale, yScale, margin, height,barWidth);



        rect.on('click', (elem, i, arr) => {
            // rect.style("fill", "steelblue");
            rect.classed('selected', false)
            d3.select(arr[i]).attr("class", 'selected');
            // d3.select(arr[i]).classed('selected', true);

            let worldCupData = this.selectByYear(elem.year);

            this.infoPanel.updateInfo(worldCupData);
            this.worldMap.updateMap(worldCupData)
        })

    }

    rectConfig(selectedRect, xScale, yScale, margin, height, barWidth){
        let colorScale = d3.scaleLinear()
            .domain(yScale.domain())
            .range(['#034e7b', '#61c3ff', ])
            .interpolate(d3.interpolateRgb);

        selectedRect.attr('x' , d => margin.left + xScale(d.year))
            .attr('y', d => yScale(d.value))
            //rotate rect near own center
            .attr('transform', d => `rotate(180 ${margin.left + xScale(d.year)+ barWidth/2} ${ yScale(d.value) + (height - yScale(d.value))/2})`)
            .transition()
            .duration(2000)
            .delay(200)
            .attr("width", barWidth)
            .attr('height', d => height - yScale(d.value))
            .attr("fill", d => colorScale(d.value))
    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData(selectedDimension) {
        return this.allData.map(e =>
        {return {year: Number(e['YEAR']), value: Number(e[selectedDimension])}}).sort((a, b) => a.year - b.year);
    }

    selectByYear(year){
        return this.allData.filter(e => e['YEAR'] == year)[0];
    }
}