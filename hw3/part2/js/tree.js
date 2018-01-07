/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300. 


        //Create a root for the tree using d3.stratify(); 


        //Add nodes and links to the tree.


        let root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.ParentGame ? treeData[d.ParentGame].id : null)
            (treeData);


        let height = 800, width = 300;

        let tree = d3.tree()
            .size([height, width]);

        let nodes = d3.hierarchy(root, d => d.children)

        // maps the node data to the tree layout
        nodes = tree(nodes);


        let g = d3.select('#tree')
            .attr("transform",
                "translate(" + 100 + "," + 0 + ")");

        // adds the links between the nodes
        let link = g.selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        // adds each node as a group
        let node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", d => "node")
            .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

        // adds the circle to the node
        node.append("circle")
            .attr("r", 10)
            .filter(d => d.data.data.Wins == 1)
            .style('fill', '#364e74')

        // adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", d => d.children ? -13 : 13)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.data.Team);


    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        let isAggregate = row.value.type === 'aggregate';
        let gameTeams;
        if (!isAggregate) gameTeams = [row.key, row.value.Opponent];

        d3.select('#tree').selectAll('.link')
            .filter(d => isAggregate ?
                d.parent && d.parent.data.data.Team === row.key && d.data.data.Team === row.key :
                gameTeams.includes(d.data.data.Team) && gameTeams.includes(d.data.data.Opponent))
            .attr('class', function () {
                return d3.select(this).attr('class') + ' selected';
            });

        d3.select('#tree').selectAll('text')
            .filter(d => isAggregate ?
                d.data.data.Team === row.key :
                gameTeams.includes(d.data.data.Team) && gameTeams.includes(d.data.data.Opponent))
            .attr('class', function () {
                return d3.select(this).attr('class') + ' selectedLabel';
            })


}

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        d3.selectAll('.selected, .selectedLabel')
            .classed('selected', false)
            .classed('selectedLabel', false)

    }
}
