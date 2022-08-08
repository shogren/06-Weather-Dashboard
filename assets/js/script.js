// api key
const key = "eb3cb13f1dbdafda62142b6699ac4aa6";
var city = '';

// given a city name, save the city and post the current weather to the page
function getWeather() {
    city = $('#search-city').val();
    if (city === '') {
        alert("Search field cannot be left blank");
        return;
    }
    save(city.toLowerCase());

    // build the query URL
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + key;
    
    // fetch the data and build respsonse
    fetch(url)
    .then((response) => {
         return response.json();
    })
    .then((data) => {
        console.log(data.main.temp);
        let weatherHTML = `
            <h3>${data.name}</h3>
            <ul class="list-unstyled">
                <li>Temperature: ${data.main.temp}&#8457;</li>
                <li>Humidity: ${data.main.humidity}%</li>
                <li>Wind Speed: ${data.wind.speed} mph</li>
            </ul>`;
        // print the results to the html
        $('#current-weather').html(weatherHTML);
    })
} 

// save searched cities, unless the city already exists 
function save(city) {
    let exists = false;
    // does city exist in local storage
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === city) {
            exists = true;
            break;
        }
    }
    // Save to localStorage if city is new
    if (exists === false) {
        localStorage.setItem('cities' + localStorage.length, city);
    }
}

function showSearches() {
    for (let i = 0; i < localStorage.length; i++) {
        let searchedCity = localStorage.getItem("cities" + i);
        let cityEl = `<li><button type="button" class="list-group-item list-group-item-action">${searchedCity}</button></li>`;
        // Append city to page
        $('#previous-searches').prepend(cityEl);
    }
}

// city search button event listener
$('#search-button').on("click", (event) => {
    event.preventDefault();
    city = $('#search-city').val();
    getWeather(event);
    });

    showSearches();