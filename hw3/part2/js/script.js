    /**
     * Loads in the table information from fifa-matches.json 
     */


// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    let numericHeaders = ["Goals Made", "Goals Conceded", "Delta Goals", "Wins", "Losses"];
    matchesCSV.forEach(e => numericHeaders.forEach(k => e[k] = Number(e[k])));

    let data = d3.nest()
        .key(d => d.Team)
        .rollup(matches => {
            let result = matches.reduce((prev, curr) => {
                numericHeaders.forEach(e => prev[e] += curr[e])
                prev.type = 'aggregate';

                let game = {key: curr.Opponent, value: {
                        "Goals Made": curr["Goals Made"],
                        "Goals Conceded": curr["Goals Conceded"],
                        "Delta Goals": [],
                        "Wins": [],
                        "Losses": [],
                        "type": "game",
                        "Opponent": curr.Team,
                        "Result": {label: curr["Result"], "ranking": ranking(curr["Result"])}
                    }};
                prev.games ? prev.games.push(game) : prev.games = [game];

                if ( typeof(prev.Result) === "string"){
                    prev.Result = {label: prev.Result, ranking: ranking(prev.Result)}
                }

                prev.Result = game.value.Result.ranking > prev.Result.ranking? game.value.Result: prev.Result;
                return prev;
            });
            result.TotalGames = result.games.length;
            delete result.Team;
            delete result.Opponent;
            result.type = 'aggregate';
            return result;
        })
        .entries(matchesCSV);


    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {
        //Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();

    });

});
function ranking(result) {
    let rank = {
        "Winner": 7,
        "Runner-Up":6,
        "Third Place": 5,
        "Semi Finals": 3,
        "Fourth Place": 4,
        "Quarter Finals": 2,
        "Round of Sixteen": 1,
        "Group": 0,
    };
    return rank[result];
}
// // ********************** END HACKER VERSION ***************************
