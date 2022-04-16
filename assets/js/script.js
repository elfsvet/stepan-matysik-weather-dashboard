//weather personal APIKey ending 8f22ad49c151f0bf1918e3b3dbe2b739
var apiKey = "8f22ad49c151f0bf1918e3b3dbe2b739";

// jquery references
var userFormEl = $("#user-form");
var buttonUserFormEl = $("#user-form .btn");
var cityNameInputEl = $("#city-name");
var searchedCitiesEl = $(".searched-cities");
var displayCityNameEl =   $(".display-city-name");
var cityButtonEl = $(".searched-city-button");

// variables
var latitude;
var longitude;
var cityNameFromInput

var cityVariables = [];


// function to get the city check for errors and if none run getting data for it.
var formSubmitHandler = function (event) {
    event.preventDefault();
    // console.log("submitted");
    // takes city name as a string 
    var city = cityNameInputEl.val().trim();
    cityNameFromInput = city;
    console.log(city);

    if (city) {
        cityVariables.push({city:city});
        console.log(cityVariables);
        localStorage.setItem(city,city);
        //add if city doesn't exist error handler
        // and don't add it to button
        // add city for the search history here
        // if the same button and city search already exists
        // save to local storage the city search
        // add remove values
        var cityButton = "<button class='searched-city-button button is-light'>"+ city + "</button>"
        searchedCitiesEl.append(cityButton);
        // needs to display the same as clicked with its name as a city parameter



        getCoordinates(city);

        cityNameInputEl.val("");

    } else {
        alert("Please enter a city you would like to look up weather for");
    }
}

var getCoordinates = function (cityName) {
    // var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;

    $.get(apiUrl, function (data) {
        // console.log(data)
        latitude = data[0].lat;
        // console.log(latitude);
        longitude = data[0].lon;
        // getCityWeatherRepo(latitude, longitude);
        getFiveDayForecast(latitude, longitude);
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
        console.log("City name : ");
        console.log(data.name);

        //date 
        console.log("The day of : ");
        console.log(dateConvert(data.dt));

        console.log("Condition on the street is :");
        //icon of the weather
        console.log(data.weather[0].icon);
        //temperature
        console.log("Temperature");
        console.log(data.main.temp);
        // humidity
        console.log("Humidity");
        console.log(data.main.humidity);
        // wind speed
        console.log("Wind speed");
        console.log(data.wind.speed);
        //uv index - should be color coded with favorable - green moderate - yellow and severe - red.
        console.log("UV index");
        // console.log(data.uvi);



    })
};
// gets data for 8 days need to iterate just for 5 0<5
var getFiveDayForecast = function (latitude, longitude) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    $.get(weatherApi, function (data) {
        console.log(data);
        // iterate through 5 items and append as cards to the fivedayforecast 
        for (var day = 0; day < 5; day++) {

            var dayToDisplay = data.daily[day]
            console.log(data.daily[day])
// need display 
        //city name
        console.log("City name : ");
        console.log(cityNameFromInput);
        displayCityNameEl.html(cityNameFromInput);

            //date
            console.log("The day of : ");
            console.log(dateConvert(dayToDisplay.dt));


            // text of the condition
            console.log("Condition on the street is :");
            var conditionDiscription = capitalizeString(dayToDisplay.weather[0].description);
            console.log(conditionDiscription);
            // icon of the weather
            var iconLink = 'http://openweathermap.org/img/wn/' + dayToDisplay.weather[0].icon + '.png'
            console.log(iconLink);
            // temperature day temp
            console.log("Temperature");
            console.log(dayToDisplay.temp.day);
            // wind speed
            console.log("Wind speed");
            console.log(dayToDisplay.wind_speed);
            // humidity
            console.log("Humidity");
            console.log(dayToDisplay.humidity);
            // uv index
            console.log("UV index");
            console.log(dayToDisplay.uvi);





        }
    })
};

// convert date from unix time 
var dateConvert = function (unix) {
    var date = new Date(unix * 1000);
    var strDate = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    return strDate;
}

var capitalizeString = function (str) {
    var stringCapitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return stringCapitalized;
}

// add a click event for old search saved cities to direct to the same formsubmitHandler with their information.
userFormEl.on("submit", formSubmitHandler);
// cityButtonEl.on("click", getCoordinates($(this.val())));

searchedCitiesEl.on("click","button", function(event) {
    event.preventDefault();

    console.log("Clicked");
    var i = $(this).text().trim();
    getCoordinates(i);

});