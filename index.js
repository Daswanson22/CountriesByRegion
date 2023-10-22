$(function() {
    fetchRegionOptions();
    changeRegion();

    $("#searchBtn").click(function() {
        // get string
        let userSearch = $("#searchInput").val();
        // get region string for URL
        let selectedRegion = $("#regions").find(":selected").val();
        const URL = `https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/region/${selectedRegion}`;
        // filter by countries by string input
        // create new array
        $.get(URL, function(data){
            let countriesArr = JSON.parse(data);
            let searchedCountries = countriesArr.filter(c => {
                const regex = new RegExp(userSearch, "i");
                return regex.test(c.name) || regex.test(c.capital);
            });
            // display data
            displayRegionData(searchedCountries);
        })
        $("#searchInput").val("");
    });

});

function fetchRegionOptions(){
    /* Retrieves region information then creates 
    options for the user to choose from. */
   $.get("https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/regions",
   function(data) {
        let regionsArr = JSON.parse(data);
        
        regionsArr.forEach(r =>{
            let option = $(`<option value="${r}">${r}</option>`);
            $("#regions").append(option);
        });
    });
}

function changeRegion(){
    $("#regions").on("change", function() {
        let selectedRegion = $("#regions").find(":selected").val();
        const URL = `https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/region/${selectedRegion}`;

        $.get(URL, function(data){
            console.log("RETRIEVING DATA");
            let countriesArr = JSON.parse(data);
            displayRegionData(countriesArr);
        });
    });
}

function displayRegionData(region) {
    // Empty HTML in table to reset
    $("tbody").html(" "); 

    region.forEach(country => {
        // Create TABLE row for each country
        let density = country.population / country.area;
        let rowHTML = `
        <tr>
        <td>${country.code}</td>
        <td><img src="${country.flag}" alt="${country.code} flag"></td>
        <td>${country.name}</td>
        <td>${country.capital ? country.capital: "N/A"}</td>
        <td>${country.population.toLocaleString()}</td>
        <td>${country.area ? country.area.toLocaleString() : "N/A"}</td>
        <td>${density.toFixed(1)}</td>
        </tr>
        `

        $("tbody").append(rowHTML);
    })

    displayBasicInfo(region);
}

function displayBasicInfo(region){
    // Create a separate array with population and name
    let popArr = region.map(c => ({population: c.population, name:c.name}));
    // Sort it by population
    popArr.sort((a,b) => b.population - a.population)

    // Displays number of countries
    $("#infoContainer p:nth-child(1) span").text(region.length);
    // Displays name of largest country
    $("#infoContainer p:nth-child(2) span").text(popArr[0].name);
    // Displays Highest Populated Country
    $("#infoContainer p:nth-child(3) span").text(popArr[0].population.toLocaleString());
}

