/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = null; //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.goalCell = {
            axisWidth: 200,
            width: 200 - this.cell.buffer*2
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains

        // Create the x axes for the goalScale.

        //add GoalAxis to header of col 1.

        let minGoals = 0;
        let maxGoals = d3.max(this.teamData.map(e => e.value[this.goalsMadeHeader]));


        this.goalScale = d3.scaleLinear()
            .range([0, this.goalCell.width])
            .domain([minGoals, maxGoals]);

        this.goalColorScale = d3.scaleLinear()
            .domain([minGoals, maxGoals])
            .range(['#cb181d', '#034e7b'])
            .interpolate(d3.interpolateRgb);

        let minGames = 0;
        let maxGames = d3.max(this.teamData.map(e => e.value.TotalGames));

        this.gameScale = d3.scaleLinear()
            .range([0, this.cell.width])
            .domain([minGames, maxGames]);

        this.aggregateColorScale = d3.scaleLinear()
            .domain([minGames, maxGames])
            .range(['#ece2f0', '#016450'])
            .interpolate(d3.interpolateRgb);


        let goalAxis = d3.axisTop(this.goalScale);

        d3.select('#goalHeader')
            .append('svg')
            .attr('width', this.goalCell.axisWidth)
            .attr('height', this.cell.height)
            .append('g')
            .attr('transform', `translate(${this.cell.buffer},${this.cell.buffer + 2})`)
            .call(goalAxis);

        this.tableElements = this.teamData.slice()


        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable().

        d3.select('#matchTable').select('thead').select('tr')
            .selectAll('th, td')
            .on('click', (elem, i, arr) => {
                //elem is undefined because it is not binding with data
                let field = d3.select(arr[i]).text();
                this.collapseList()
                this.tableElements = this.tableElements.sort(this.sortingFunctionByField(field))
                this.updateTable()
            })
            .on('dblclick',(elem, i, arr) => {
                //elem is undefined because it is not binding with data
                let field = d3.select(arr[i]).text();
                this.collapseList()
                this.tableElements = this.tableElements.sort((a, b) => -1 * this.sortingFunctionByField(field)(a, b))
                this.updateTable()
            })


    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows

        //Append th elements for the Team Names

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray


        let tbody = d3.select('#matchTable')
            .select('tbody');
        tbody.selectAll('tr').remove();

        let tr = tbody.selectAll('tr')
            .data(this.tableElements).enter()
            .append('tr');

        let td = tr.selectAll("td").data(d => {
            let team = {type: d.value.type, vis: 'text', value: d.key};
            let goals = {
                type:  d.value.type,
                vis: 'goals',
                value: {
                    'Goals Conceded': d.value[this.goalsConcededHeader],
                    'Goals Made': d.value[this.goalsMadeHeader]
                }
            };

            let roundResult = {type:  d.value.type, vis: 'text', value: d.value.Result.label};
            let wins = {type:  d.value.type, vis: 'bar', value: d.value.Wins};
            let losses = {type:  d.value.type, vis: 'bar', value: d.value.Losses};
            let total = {type:  d.value.type, vis: 'bar', value: d.value.TotalGames};

            return [team, goals, roundResult, wins, losses, total];
        }).enter().append('td');

        //add games bars
        let g = td.filter(d => d.vis === 'bar')
            .append('svg')
            .attr('width', this.cell.width)
            .attr('height', this.cell.height)
            .append('g');

        g.append('rect').filter(isAggregate)
            .attr("fill", d => this.aggregateColorScale(d.value))
            .attr('height', this.bar.height)
            .attr("width", d => this.gameScale(d.value))

        g.filter(isAggregate).append('text').text(d => d.value)
            .style('fill', 'white')
            .attr("text-anchor", "middle")
            .attr("dy", '1em')
            .attr("x", d => this.gameScale(d.value) - 9)

        //add text cells
        td.filter(d => d.vis === 'text')
            .text(d => d.value)
            .filter((elem, i, arr) => i === 0)
            .text(d => isAggregate(d)? d.value : 'x' + d.value)
            .attr('class', d => d.type);

        g = td.filter(d => d.vis === 'goals')
            .append('svg')
            .attr('width', this.goalCell.axisWidth)
            .attr('height', this.cell.height)
            .append('g');

        //tbody.td has padding 5, thead.td has padding 1 and goalAxis has translate on this.cell.buffer
        let xOffset = this.cell.buffer + 1 - 5;

        //for vertical rect position
        let yOffset = this.cell.buffer/2;

        let circleRadius = this.bar.height / 4;

        let cyPosition = this.bar.height / 4 + yOffset;

        //add rect
        g.append('rect')
            .attr('height', d => isAggregate(d)? this.bar.height / 2 : this.bar.height / 4)
            .attr("width", d => {
                let width = this.goalScale(Math.abs(d.value[this.goalsMadeHeader] - d.value[this.goalsConcededHeader]));
                return isAggregate(d)? width : width - 2*circleRadius;
            })
            .attr('x', d => {
                let x = xOffset + this.goalScale(d3.min([d.value[this.goalsMadeHeader], d.value[this.goalsConcededHeader]]));
                return isAggregate(d)? x : x + circleRadius;
            })
            .attr('y', d => isAggregate(d)? cyPosition - circleRadius : cyPosition - circleRadius/2)
            .attr('class', 'goalBar')
            .attr('fill', d => d.value[this.goalsMadeHeader] - d.value[this.goalsConcededHeader] > 0 ? '#034e7b':'#cb181d' )

        //if goals difference is not 0
        let gNotNullDifference = g.filter(d => d.value[this.goalsMadeHeader] - d.value[this.goalsConcededHeader]);

        let gNullDifference = g.filter(d => !(d.value[this.goalsMadeHeader] - d.value[this.goalsConcededHeader]));

        //add circles

        gNotNullDifference
            .append('circle')
            .attr('cx', d => this.goalScale(d.value[this.goalsMadeHeader]) + xOffset)
            .attr('cy', cyPosition)
            .attr('r', circleRadius)
            .style('fill', d => isAggregate(d)? '#034e7b' : 'none')
            .style('stroke', d => isAggregate(d)? 'none' : '#034e7b')
            .style('stroke-width', d => isAggregate(d)? 'none' : 2);

        gNotNullDifference
            .append('circle')
            .attr('cx', d => this.goalScale(d.value[this.goalsConcededHeader]) + xOffset)
            .attr('cy', cyPosition)
            .attr('r', circleRadius)
            .style('fill', d => isAggregate(d)? '#cb181d' : 'none')
            .style('stroke', d => isAggregate(d)? 'none' : '#cb181d')
            .style('stroke-width', d => isAggregate(d)? 'none' : 2);

        gNullDifference
            .append('circle')
            .attr('cx', d => this.goalScale(d.value[this.goalsMadeHeader]) + xOffset)
            .attr('cy', cyPosition)
            .attr('r', circleRadius)
            .style('fill', d => isAggregate(d)? 'grey' : 'none')
            .style('stroke', d => isAggregate(d)? 'none' : 'grey')
            .style('stroke-width', d => isAggregate(d)? 'none' : 2);


        tr.on('click', (elem, i, arr) => {
            if (isAggregate(elem.value)){
                this.updateList(i);
                this.updateTable();

            }
        })
            .on("mouseover", d => this.tree.updateTree(d))
            .on("mouseout", d => this.tree.clearTree())
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        if (this.tableElements[i+1] && !isAggregate(this.tableElements[i+1].value)){
            this.tableElements.splice(i+1, this.tableElements[i].value.games.length )
        }else {
            this.tableElements.splice(i+1, 0, ...this.tableElements[i].value.games.slice());
        }
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        this.tableElements = this.tableElements.filter(e => isAggregate(e.value))
    }

    sortingFunctionByField(field){
        switch(field) {
            case 'Team':
                return (a, b) => b.key.localeCompare(a.key);
            case 'Goals':
                return (a, b) => b.value[this.tableHeaders[0]] - a.value[this.tableHeaders[0]];
            case 'Round/Result':
                    return (a, b) => b.value[this.tableHeaders[1]].ranking - a.value[this.tableHeaders[1]].ranking;
            case 'Wins':
                return (a, b) => b.value[this.tableHeaders[2]] - a.value[this.tableHeaders[2]];
            case 'Losses':
                return (a, b) => b.value[this.tableHeaders[3]] - a.value[this.tableHeaders[3]];
            case 'Total Games':
                return (a, b) => b.value[this.tableHeaders[4]] - a.value[this.tableHeaders[4]];

        }
    }


}

function isAggregate(d) {
    return d.type === 'aggregate';
}

