//weather Api ending 8f22ad49c151f0bf1918e3b3dbe2b739
// "https://api.openweathermap.org/data/2.5/weather?q=MIAMI&appid=8f22ad49c151f0bf1918e3b3dbe2b739"
var apiKey = "8f22ad49c151f0bf1918e3b3dbe2b739";
var userFormEl = $("#user-form");
var buttonUserFormEl = $("#user-form .btn")
var cityNameInputEl = $("#city-name");
var apiUrlCoordinates = "http://api.openweathermap.org/geo/1.0/direct?q=miami&limit=1&appid=8f22ad49c151f0bf1918e3b3dbe2b739"
// var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"
var latitude;
var longitude;

// function to get the city check for errors and if none run getting data for it.
var formSubmitHandler = function (event) {
    event.preventDefault();
    console.log("submitted");
    // takes city name as a string 
    var city = cityNameInputEl.val().trim();
    console.log(city);

    if (city) {
        getCoordinates(city);
        // add city for the search history here
        cityNameInputEl.val("");
    } else {
        alert("Please enter a city you would like to look up weather for");
    }
}

var getCoordinates = function (cityName) {
    // var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;

    $.get(apiUrl, function (data) {
        console.log(data)
        latitude = data[0].lat;
        console.log(latitude);
        longitude = data[0].lon;
        getCityWeatherRepo(latitude, longitude);
        getFiveDayForecast(latitude,longitude);
    })
};

var getCityWeatherRepo = function (latitude, longitude) {
    // console.log(latitude)
    // console.log(longitude)

    var weatherApi = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=' + apiKey;
    $.get(weatherApi, function (data) {
        console.log(data);
        // need display 
        //city name
        //date 
        //icon of the weather
        //temperature
        // humidity
        // wind speed
        //uv index - should be color coded with favorable - green moderate - yellow and severe - red.
    })
};
// gets data for 8 days need to iterate just for 5 0<5
var getFiveDayForecast = function (latitude, longitude) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    $.get(weatherApi, function(data){
        console.log(data);
        // iterate through 5 items and append as cards to the fivedayforecast 
        //date
        // icon of the weather
        // temperature
        // wind speed
        // humidity
    })
};


// add a click event for old search saved cities to direct to the same formsubmitHandler with their information.
userFormEl.on("submit", formSubmitHandler);

