class CountryInfoPanel {
    constructor(data) {
        this.data = data;
    }

    updateCountryInfo(country){
        d3.select('#countryName').text(country);

        d3.select('#countryCups').select('ul').remove();
        d3.select('#countryCups')
            .append('ul')
            .selectAll('li')
            .data(this.data.filter(d => d['TEAM_NAMES'].includes(country)).sort((a, b) => a.YEAR - b.YEAR))
            .enter()
            .append('li')
            .text(d => {
                if (d.runner_up === country) return d.YEAR + " - Runner up";
                if (d.winner === country) return d.YEAR + " - Winner";
                return d.YEAR;
            } )
    }
}