const key = "eb3cb13f1dbdafda62142b6699ac4aa6";
var city = '';

function getWeather() {
    city = $('#search-city').val();
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + key;
    fetch(url)
    .then((response) => {
         return response.json();
    })
    .then((data) => {
        console.log(data.main.temp);
        let currentWeatherHTML = `
            <h3>${data.name}</h3>
            <ul class="list-unstyled">
                <li>Temperature: ${data.main.temp}&#8457;</li>
                <li>Humidity: ${data.main.humidity}%</li>
                <li>Wind Speed: ${data.wind.speed} mph</li>
            </ul>`;
        // Append the results to the DOM
        $('#current-weather').html(currentWeatherHTML);
    })


} 

// getWeather();
// city search button event listener
$('#search-button').on("click", (event) => {
    event.preventDefault();
    city = $('#search-city').val();
    getWeather(event);
    });