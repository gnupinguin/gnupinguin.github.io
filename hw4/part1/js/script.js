d3.json('data/countries_2012.json', (error, data) => {

    window.graph = new Graph(data);

    d3.select('#isRanking')
        .selectAll('input')
        .on('change', function(d){
            graph.updateRank(+this.value, d3.select('#rank').property('value'))
        })

    d3.select('#rank')
        .on('change', function(d){
            let checked = d3.select('#isRanking').selectAll('input').filter(function(){return d3.select(this).property('checked')});
            if (checked.property('value') == 1){
                graph.updateRank(1, this.value);
            }
        })

    // let yScale = d3.scaleBand().domain(nodes.map(d => d.name)).rangeRound([0, height],  .8, 0);
    // let simulation = d3.forceSimulation(nodes)
    //     .force('charge', d3.forceManyBody().strength(0))
    //     .force('center', d3.forceCenter(width / 2, height / 2))
    //     // .force('collision', d3.forceCollide().radius(d => 10))
    //     .force('x', d3.forceX().x(d => width/2))
    //     .force('y', d3.forceY().y(d => yScale(d.name)))
    //     .on('tick', ticked);

});