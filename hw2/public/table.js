window.onload = () =>{
        let colorSpectrum = {white: "lightgrey", lightgrey: "white"};

        d3.json("countries_2012.json", function(error, data){

        // data.forEach(element => ['alpha2_code', 'latitude', 'longitude'].forEach(field => delete element[field]));//exclude extra fields
        let excludeFields = ['alpha2_code', 'latitude', 'longitude'];
        let excludeContinents = [];
        let columns = Object.keys(data[0]).filter(element => !excludeFields.includes(element)).sort((a, b) => {
          if (a === 'name') return 0;
          if (b === 'name') return 1;
          return a.localeCompare(b);
        });


        let table = d3.select("body").append("table"),
          thead = table.append("thead")
                       .attr("class", "thead");
          tbody = table.append("tbody");

        table.append("caption")
          .html("World Countries Ranking");

        thead.append("tr").selectAll("th")
          .data(columns)
        .enter()
          .append("th")
          .text(function(d) { return d; })
          .on("click", function(header, i) {
            if (header === 'continent'){
                tbody.selectAll("tr").sort(smartSortContinents);
            }else{
              tbody.selectAll("tr").sort(function(a, b) {
                return d3.descending(a[header], b[header]);
              });
            }
            createZebra();
          });

        let rows = tbody.selectAll("tr.row")
          .data(data)
          .enter()
          .append("tr").attr("class", "row");

        let gdpFormatter = d3.formatPrefix(",.1", 1e+9);
        let populationFormatter = d3.format(",")
        let lifeExpectancyFormatter = d3.format(",.1f");

        let cells = rows.selectAll("td")
          .data(function(row) {
              return columns.map(columnName => {
                let cellValue = row[columnName];
                switch (columnName){
                  case 'gdp': return gdpFormatter(cellValue);
                  case 'population': return populationFormatter(cellValue);
                  case 'life_expectancy': return lifeExpectancyFormatter(cellValue);
                  default: return cellValue;
              }
            });
          })
          .enter()
          .append("td")
          .text(function(d) { return d; })
          .on("mouseover", function(d, i) {

            d3.select(this.parentNode)
              .style("background-color", "#F3ED86");
        
          }).on("mouseout", (elemText, index , row) =>{
            

            let neighbourTrNode = row[0].parentNode.previousSibling? 
              row[0].parentNode.previousSibling:
              row[0].parentNode.nextSibling;

              d3.select(row[0].parentNode)
              .style("background-color", colorSpectrum[d3.select(neighbourTrNode).style("background-color")])
          });

          createZebra();
      });

  function createZebra(){
    let counter = 0;
    d3.selectAll("tr.row").style('background-color', () => Object.keys(colorSpectrum)[(counter++)%2] );
  }

  function smartSortContinents(r1, r2){
    let result = r1['continent'].localeCompare(r2['continent']);
    if (!result){
      result = r1['name'].localeCompare(r2['name']);
    }
    return result;
  }
};

function createTable(data){

}