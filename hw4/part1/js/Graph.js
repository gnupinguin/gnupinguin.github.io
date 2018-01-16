class Graph {
    constructor(data) {
        this.nodes = data;

        let svg = d3.select('svg');

        this.side = {width: +svg.attr('width'), height: +svg.attr('height')};

        let yScale = d3.scaleBand().domain(this.nodes.map(d => d.name)).rangeRound([0, this.side.height],  .8, 0);

        this.simulation = d3.forceSimulation(this.nodes)
            .force('charge', d3.forceManyBody().strength(-1))
            // .velocityDecay(0.1)
            .force('center', d3.forceCenter(this.side.width *0.5, this.side.height *0.5))
            // // .force('collision', d3.forceCollide().radius(d => 5))
            .force('x', d3.forceX().x(d => this.side.width/2))
            .force('y', d3.forceY().y(d => yScale(d.name)))
            .on('tick', () =>this.update(100));
    }

    updateRank(rankStatus, field) {
        this.simulation.stop()
        let yScale;
        if (rankStatus) {
            yScale = d3.scaleLinear()
                .range([this.side.height-15, 0+15])
                .domain([d3.min(this.nodes, d => d[field]), d3.max(this.nodes, d => d[field])]);
            // this.nodes = this.nodes.sort((a, b) => d3.descending(a[field], b[field]));
        }else {
            yScale = d3.scaleBand().domain(this.nodes.map(d => d.name)).rangeRound([0, this.side.height],  .8, 0);
            // this.nodes = this.nodes.sort((a, b) => d3.ascending(a.name, b.name));
            field = 'name';
        }

        this.nodes.forEach(d => {d.x = this.side.width/2; d.y = yScale(d[field]);
            console.log(d.name, yScale(d[field]))});
        // this.simulation.nodes(this.nodes)
        this.update(1000)
    }

    update(duration) {
        let old = d3.select('svg')
            .selectAll('g')
            .data(this.nodes);

        let young = old.enter()
            .append('g')
            .attr('class', 'node');
        young
            .append('circle')
            // .attr('class', 'node')
            .attr('r', 5);
        young.append('text')
            // .attr('class', 'node')
            .attr("dy", "3")
            .attr("dx", "7")
            .style('font-family', 'sans-serif')
            .style('font-size', '10px')
            .text(d => d.name)



        old = old
            .merge(old)

        d3.selectAll('g.node')
            .transition().duration(duration)
            .attr('transform', d => `translate(${d.x},${d.y})`)


        old.exit().remove()
    }
}