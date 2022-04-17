//weather personal APIKey ending 8f22ad49c151f0bf1918e3b3dbe2b739
var apiKey = "8f22ad49c151f0bf1918e3b3dbe2b739";
// ! jquery references--
var userFormEl = $("#user-form");
var buttonUserFormEl = $("#user-form .btn");
var cityNameInputEl = $("#city-name");
var searchedCitiesEl = $(".searched-cities");
var displayCityNameEl = $(".display-city-name");
var cityButtonEl = $(".searched-city-button");
var oneDayForecastEl = $('.one-day-forecast')
var currentWeatherEl = $("#current-weather");
var fiveDayEl = $("#five-day");
// ! variables--
var latitude;
var longitude;
var cityNameFromInput;
var cities = [];
// ! --functions--
var loadCities = function () {
    // get an array with cities key from localStorage
    var citiesLoad = localStorage.getItem("cities");
    // if we don't have any cities keys in localStorage
    if (!citiesLoad) {
        // finish the call
        return false;
    } else {
        citiesLoad = JSON.parse(citiesLoad);
        for (var i = 0; i < citiesLoad.length; i++) {
            // need to display the buttons inside searched cities
            if (!cities.includes(citiesLoad[i])) {
                displaySearchedCities(citiesLoad[i])
                cities.push(citiesLoad[i]);
            }
        }
    }
};

// save to local storage the city search
var saveCities = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};
// function to display cities as buttons
var displaySearchedCities = function (city) {

    var cityButton = "<button class='searched-city-button button is-light'>" + city + "</button>"
    // add city for the search history here
    displayCityNameEl.html(city);
    searchedCitiesEl.append(cityButton);
}


// function to get the city check for errors and if none run getting data for it.
var formSubmitHandler = function (event) {
    event.preventDefault();
    console.log("city entered");
    // takes city name as a string makes it to upper case to handle future errors with same names in camelcase or in lowercase
    var city = cityNameInputEl.val().trim().toUpperCase();
    cityNameFromInput = city;
    console.log("It is " + city);
    console.log("calling loadCities");
    loadCities();
    if (city) {
        // if the same city in array and city search already exists
        console.log("checking if city was entered already in citiesArray")
        if (!cities.includes(city)) {
            cities.push(city);
            saveCities();
            console.log(" in !previous " + cities);
            // var cityButton = "<button class='searched-city-button button is-light'>" + city + "</button>"
            // // add city for the search history here
            // searchedCitiesEl.append(cityButton);

            // getCoordinates(city);

            getCoordinates(city);
            displaySearchedCities(city);

            cityNameInputEl.val("");

        } else {
            alert("Please enter a new city");
            // add remove values from input line
            cityNameInputEl.val("");
        }
        //add if city doesn't exist error handler
        // needs to display the same as clicked with its name as a city parameter
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
        getForecast(latitude, longitude, cityName);
    })
};

// gets data for 8 days need to iterate just for 5 0<5
var getForecast = function (latitude, longitude, cityName) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    $.get(weatherApi, function (data) {
        console.log("Data of the latitude longitude " + latitude + " and " + longitude)
        console.log(data);
        displayCurrentWeather(data, cityName);
        displayFiveDayForecast(data, cityName);
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


var displayCurrentWeather = function (data, cityName) {
    // ! variables --
    var day = 0;
    var dayToDisplay = data.daily[day]
    var date = dateConvert(dayToDisplay.dt);
    var condition = capitalizeString(dayToDisplay.weather[0].description);
    var iconLink = 'http://openweathermap.org/img/wn/' + dayToDisplay.weather[0].icon + '.png'
    var temp = Math.round(dayToDisplay.temp.day);
    var wind = dayToDisplay.wind_speed;
    var humidity = dayToDisplay.humidity;
    var uv = dayToDisplay.uvi;
    // ! references --

    if (!currentWeatherEl.children(".city").length) {
        currentWeatherEl.append('<h3 class="city">' + cityName + '</h3>');
        currentWeatherEl.append('<span class="date">(' + date + ')</span>');
        currentWeatherEl.append('<img class="icon" src="' + iconLink + '" alt="' + condition + '"></ >');
        currentWeatherEl.append('<div class="one-day"></div>');
        var oneDay = currentWeatherEl.children(".one-day");
        oneDay.append('<p class="temp">Temp: ' + temp + ' F</p>');
        oneDay.append('<p class="wind">Wind: ' + wind + ' MPH</p>');
        oneDay.append('<p class="humidity">Humidity: ' + humidity + ' %</p>');
        oneDay.append('<p class="uv">UV Index: ' + uv + '</p>');      
    } else {
        currentWeatherEl.children(".city").html(cityName);
        currentWeatherEl.children(".date").html("("+date+")");
        currentWeatherEl.children(".icon").attr("src", iconLink).attr("alt", condition);
        currentWeatherEl.children(".one-day").children(".temp").html('Temp: ' + temp + ' F');
        currentWeatherEl.children(".one-day").children(".wind").html('Wind: ' + wind + ' MPH');
        currentWeatherEl.children(".one-day").children(".humidity").html('Humidity: ' + humidity + ' %');
        currentWeatherEl.children(".one-day").children(".uv").html('UV Index: ' + uv);
    }
}
var displayFiveDayForecast = function (data, cityName) {
    for (var day = 1; day < 6; day++) {
        // create a variable 
        var dayToDisplay = data.daily[day];
        var date = dateConvert(dayToDisplay.dt);
        var condition = capitalizeString(dayToDisplay.weather[0].description);
        var iconLink = 'http://openweathermap.org/img/wn/' + dayToDisplay.weather[0].icon + '.png';
        var temp = Math.round(dayToDisplay.temp.day);
        var wind = dayToDisplay.wind_speed;
        var humidity = dayToDisplay.humidity;
        var uv = dayToDisplay.uvi;
        var id = "#card-" + day;
        // if first time run
        if (!fiveDayEl.children("#card-5").length) {
            if (!fiveDayEl.children(".title").length) {
                fiveDayEl.append('<h3 class="title">5-Day Forecast</h3>');
            }
            fiveDayEl.append('<div id="card-' + day + '" class="card"></div>');
            $(id).append('<p class="date">' + date + '</p>');
            $(id).append('<img class="icon" src="' + iconLink + '" alt="' + condition + '"></ >');
            $(id).append('<div class="one-day"></div>');
            $(id).append('<p class="temp">Temp: ' + temp + ' F</p>');
            $(id).append('<p class="wind">Wind: ' + wind + ' MPH</p>');
            $(id).append('<p class="humidity">Humidity: ' + humidity + ' %</p>');
            $(id).append('<p class="uv">UV Index: ' + uv + '</p>');
        } else {
            $(id).children('.date').html(date);
            $(id).children('.icon').html(date);
            $(id).children('.temp').html('Temp: ' + temp + ' F');
            $(id).children('.wind').html('Wind: ' + wind + ' MPH');
            $(id).children('.humidity').html('Humidity: ' + humidity + ' %');
            $(id).children('.uv').html('UV Index: ' + uv);
        }

        // var fiveDFEl = $(".five-day-forecast")
        // // need display 

        // //date
        // fiveDFEl.children(".date").html(date);
        // // text of the condition
        // // var conditionDiscription = capitalizeString(dayToDisplay.weather[0].description);
        // // icon of the weather
        // fiveDFEl.children(".condition").attr('src', iconLink).attr('alt', condition);
        // // temperature day temp
        // fiveDFEl.children(".temp").html('Temp: ' + temp + ' F')
        // // wind speed
        // fiveDFEl.children(".wind").html('Wind: ' + wind + ' MPH')
        // // humidity
        // fiveDFEl.children(".humidity").html('Humidity: ' + humidity + ' %')
        // // uv index
        // fiveDFEl.children(".uv-index").html('UV Index: ' + uv)
    }
}


// upload cities stored in local storage
loadCities();
// add a click event for old search saved cities to direct to the same formSubmitHandler with their information.
// remove line with city if none was called yet
displayCityNameEl.html("");
userFormEl.on("submit", formSubmitHandler);

searchedCitiesEl.on("click", "button", function (event) {
    event.preventDefault();

    console.log("Clicked");
    var city = $(this).text().trim();
    console.log(city);
    // need to fix this to target button text it clicked and bring it data
    getCoordinates(city);

});