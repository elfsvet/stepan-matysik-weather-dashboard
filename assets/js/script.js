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

    var cityButton = "<button type='button' class='searched-city-button col-12 btn  btn-info my-2'>" + city + "</button>"
    // add city for the search history here
    displayCityNameEl.html(city);
    searchedCitiesEl.append(cityButton);
}


// function to get the city check for errors and if none run getting data for it.
var formSubmitHandler = function (event) {
    event.preventDefault();
    // takes city name as a string makes it to upper case to handle future errors with same names in camelcase or in lowercase
    var city = cityNameInputEl.val().trim().toUpperCase();
    cityNameFromInput = city;
    loadCities();
    if (city) {
        // if the same city in array and city search already exists
        console.log("checking if city was entered already in citiesArray")
        if (!cities.includes(city)) {
            //would need to add check if the city is a city then do function if not return alert
            cities.push(city);
            saveCities();
            getCoordinates(city);
            displaySearchedCities(city);
            // clean the input line
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
// get coordinates needed for geo use in api
var getCoordinates = function (cityName) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
    // retrive data from the link we provided and assign values for variables we declared earlier
    $.get(apiUrl, function (data) {
        if (data.length) {
            console.log("erroe should be here");
            console.log(data);
            latitude = data[0].lat;
            longitude = data[0].lon;
            // call function getForecast to get weather information for 8 days from which we will use only 6
            getForecast(latitude, longitude, cityName);

        } else {
            alert("No such city in our records");
        }
    })
};

// gets data for 8 days need to iterate just for 6 0<6
var getForecast = function (latitude, longitude, cityName) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    $.get(weatherApi, function (data) {
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

// display weather for today
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
    // create new elements inside div - current weather
    if (!currentWeatherEl.children(".city").length) {
        currentWeatherEl.addClass("col-12 border border-secondary")
        currentWeatherEl.append('<h3 class="city m-2 d-inline">' + cityName + '</h3>');
        currentWeatherEl.append('<span class="date m-2">' + date + '</span>');
        currentWeatherEl.append('<img class="icon m-2" src="' + iconLink + '" alt="' + condition + '"></ >');
        currentWeatherEl.append('<div class="one-day"></div>');
        var oneDay = currentWeatherEl.children(".one-day");
        oneDay.append('<p class="temp m-2">Temp: ' + temp + ' F</p>');
        oneDay.append('<p class="wind m-2">Wind: ' + wind + ' MPH</p>');
        oneDay.append('<p class="humidity m-2">Humidity: ' + humidity + ' %</p>');
        oneDay.append('<p class="uv m-2">UV Index: ' + uv + '</p>');
    } else {
        // if we change the city and we had information on the page. refresh it.
        currentWeatherEl.children(".city").html(cityName);
        currentWeatherEl.children(".date").html(date);
        currentWeatherEl.children(".icon").attr("src", iconLink).attr("alt", condition);
        currentWeatherEl.children(".one-day").children(".temp").html('Temp: ' + temp + ' F');
        currentWeatherEl.children(".one-day").children(".wind").html('Wind: ' + wind + ' MPH');
        currentWeatherEl.children(".one-day").children(".humidity").html('Humidity: ' + humidity + ' %');
        currentWeatherEl.children(".one-day").children(".uv").html('UV Index: ' + uv);
    }
}
// display weather for tomorrow and + 4 more days
var displayFiveDayForecast = function (data, cityName) {
    // loop to not repeat myself and display all in one run
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
        // for easy reference with jquery new id var day will update with iteration
        var id = "#card-" + day;
        // if first time run
        if (!fiveDayEl.children("#card-5").length) {
            // if we don't have heading, display it
            if (!fiveDayEl.children(".title").length) {
                fiveDayEl.append('<h3 class="title fs-4 my-2">5-Day Forecast:</h3>');
            }
            // create new card with all information
            fiveDayEl.append('<div id="card-' + day + '" class="col m-1 rounded text-white bg-secondary bg-gradient"></div>');
            $(id).append('<p class="date">' + date + '</p>');
            $(id).append('<img class="icon" src="' + iconLink + '" alt="' + condition + '"></ >');
            $(id).append('<div class="one-day"></div>');
            $(id).append('<p class="temp">Temp: ' + temp + ' F</p>');
            $(id).append('<p class="wind">Wind: ' + wind + ' MPH</p>');
            $(id).append('<p class="humidity">Humidity: ' + humidity + ' %</p>');
            $(id).append('<p class="uv">UV Index: ' + uv + '</p>');
        } else {
            // if we change the city and we had information on the page. refresh it.
            $(id).children('.date').html(date);
            $(id).children('.icon').attr("src", iconLink).attr("alt", condition);
            $(id).children('.temp').html('Temp: ' + temp + ' F');
            $(id).children('.wind').html('Wind: ' + wind + ' MPH');
            $(id).children('.humidity').html('Humidity: ' + humidity + ' %');
            $(id).children('.uv').html('UV Index: ' + uv);
        }
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
    var city = $(this).text().trim();
    // need to fix this to target button text it clicked and bring it data
    getCoordinates(city);

});