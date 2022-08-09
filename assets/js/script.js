// api key
const key = "eb3cb13f1dbdafda62142b6699ac4aa6";
var city = '';

// given a city name, save the city and post the current weather to the page
function getWeather(event) {
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
        console.log("Current temp: " + data.main.temp);
        let weatherHTML = `
            <h2>${data.name}</h2>
            <h3>${moment().format("dddd, MMMM Do YYYY")}</h3>
            <ul class="list-unstyled">
                <li>Temperature: ${data.main.temp}&#8457;</li>
                <li>Humidity: ${data.main.humidity}%</li>
                <li>Wind Speed: ${data.wind.speed} mph</li>
            </ul>`;
        // print the results to the html
        $('#current-weather').html(weatherHTML);

        fiveDayForcast(event);
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


function fiveDayForcast(event) {
    let city = $('#search-city').val();
    let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=" + key;

    fetch(url)
        .then((response) => {
            return response.json();
        })

        .then((response) => {
        let forecastHTML = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDay" class="d-inline-flex flex-wrap ">`;
        
        for (let i = 0; i < response.list.length; i++) {
            let day = response.list[i];
            let icon = "https://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
            let time = day.dt;
            let timeZone = response.city.timezone;
            let timeZoneOffset = timeZone / 60 / 60;
            let currentTime = moment.unix(time).utc().utcOffset(timeZoneOffset);

            // the API returns the 5-Day forcast in 3 hour intervals, this should make sure that at least one is grabbed for the day
            if (currentTime.format("HH:mm:ss") === "10:00:00" || currentTime.format("HH:mm:ss") === "11:00:00" || currentTime.format("HH:mm:ss") === "12:00:00") {
                forecastHTML += `
                        <div class="weather-card card m-2 p0">
                            <ul class="list-unstyled p-3">
                                <li>${currentTime.format("MM/DD/YY")}</li>
                                <li class="weather-icon"><img src="${icon}"></li>
                                <li>Temp: ${day.main.temp}&#8457;</li>
                                <br>
                                <li>Humidity: ${day.main.humidity}%</li>
                                <br>
                                <li>Wind Speed: ${day.wind.speed}%</li>

                            </ul>
                        </div>`;
            }   


        }

        forecastHTML += `</div>`;
        $('#five-day-forecast').html(forecastHTML);

    })
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

$('#previous-searches').on("click", (event) => {
    event.preventDefault();
    $('#search-city').val(event.target.textContent);
    city=$('#search-city').val();
    getWeather(event);
});

showSearches();