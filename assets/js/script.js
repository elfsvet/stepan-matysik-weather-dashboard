//weather personal APIKey ending 8f22ad49c151f0bf1918e3b3dbe2b739
var apiKey = "8f22ad49c151f0bf1918e3b3dbe2b739";

// jquery references
var userFormEl = $("#user-form");
var buttonUserFormEl = $("#user-form .btn");
var cityNameInputEl = $("#city-name");
var searchedCitiesEl = $(".searched-cities");
var displayCityNameEl = $(".display-city-name");
var cityButtonEl = $(".searched-city-button");
var oneDayForecastEl = $('.one-day-forecast')
// variables
var latitude;
var longitude;
var cityNameFromInput;

var cities = [];

var loadCities = function () {
    // get an array with cities key from localStorage
    var citiesLoad = localStorage.getItem("cities");
    // if we don't have any cities keys in localStorage
    if (!citiesLoad) {
        console.log("nothing to load, exit loadCities")
        // finish the call
        return false;
    } else {
        console.log("parsing the localstorage")
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
    // create this button using jquery
    // searchedCitiesEl.add("button", city).addClass("searched-city-button button is-light");

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


            displaySearchedCities(city);

            cityNameInputEl.val("");

        } else {
            // and don't add it to button
            alert("Please enter a new city");
            // add remove values
            cityNameInputEl.val("");
        }
        //add if city doesn't exist error handler
        // needs to display the same as clicked with its name as a city parameter

        console.log("in form submit " + cities)

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
        getFiveDayForecast(latitude, longitude, cityName);
    })
};

// gets data for 8 days need to iterate just for 5 0<5
var getFiveDayForecast = function (latitude, longitude, cityName) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    $.get(weatherApi, function (data) {
        console.log("Data of the latitude longitude " + latitude + " and " + longitude)
        console.log(data);
        displayCurrentWeather(data, cityName);
        displayFiveDayForecast(data, cityName);
        // iterate through 5 items and append as cards to the fivedayforecast 
        // for (var day = 0; day < 6; day++) {
        //     displayCityNameEl.html(cityName);

        //     // variable for easy display
        //     var dayToDisplay = data.daily[day]
        //     var date = dateConvert(dayToDisplay.dt);
        //     var condition = capitalizeString(dayToDisplay.weather[0].description);
        //     var iconLink = 'http://openweathermap.org/img/wn/' + dayToDisplay.weather[0].icon + '.png'
        //     var temp = Math.round(dayToDisplay.temp.day);
        //     var windSpeed = dayToDisplay.wind_speed;
        //     var humidity = dayToDisplay.humidity;
        //     var uvIndex = dayToDisplay.uvi;


        //     // to display current weather
        //     if (day === 0) {
        //         // i should display city name + (date) + icon condition in a board box
        //         //city name
        //         // console.log("City name : " + cityName);

        //         var currentWthr = $("#current-weather");

        //         displayCityNameEl.html(cityName);


        //         currentWthr.children(".date").html(date);

        //         // icon of the weather
        //         currentWthr.children(".condition").attr('src', iconLink).attr('alt', condition);

        //         var oneDF = currentWthr.children(".one-day-forecast");


        //         oneDF.children('.temp').html('Temp: ' + temp + ' F');
        //         oneDF.children(".wind").html('Wind: ' + windSpeed + ' MPH')

        //         oneDF.children(".humidity").html('Humidity: ' + humidity + ' %')
        //         // uv index
        //         oneDF.children(".uv-index").html('UV Index: ' + uvIndex)







        //         // oneDayForecastEl.html(dayToDisplay);
        //         //display (date)
        //         // oneDayForecastEl.add("div").addClass("date").html(dayToDisplay)


        //     }
        //     else {
        //         // else display the rest days in 5 day forecast:
        //         //should be column of date + icon condition + temp: 00.00 F + wind: 00.00 MPH + humidity: 00 %
        //         console.log(dayToDisplay)
        //         var fiveDF = $(".five-day-forecast")
        //         // need display 

        //         //date
        //         console.log("The day of : ");
        //         fiveDF.children(".date").html(date);
        //         console.log(date);
        //         // text of the condition
        //         console.log("Condition on the street is :");
        //         // var conditionDiscription = capitalizeString(dayToDisplay.weather[0].description);
        //         console.log(condition);
        //         // icon of the weather
        //         fiveDF.children(".condition").attr('src', iconLink).attr('alt', condition);
        //         console.log(iconLink);
        //         // temperature day temp
        //         console.log("Temperature");
        //         fiveDF.children(".temp").html('Temp: ' + temp + ' F')
        //         console.log(temp);
        //         // wind speed
        //         console.log("Wind speed");
        //         fiveDF.children(".wind").html('Wind: ' + windSpeed + ' MPH')
        //         console.log(windSpeed);
        //         // humidity
        //         console.log("Humidity");
        //         fiveDF.children(".humidity").html('Humidity: ' + humidity + ' %')
        //         console.log(humidity);
        //         // uv index
        //         console.log("UV index");
        //         fiveDF.children(".uv-index").html('UV Index: ' + uvIndex)
        //         console.log(uvIndex);
        //     }




        // }
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

    var day = 0;
    displayCityNameEl.html(cityName);
    var dayToDisplay = data.daily[day]
    var date = dateConvert(dayToDisplay.dt);
    var condition = capitalizeString(dayToDisplay.weather[0].description);
    var iconLink = 'http://openweathermap.org/img/wn/' + dayToDisplay.weather[0].icon + '.png'
    var temp = Math.round(dayToDisplay.temp.day);
    var windSpeed = dayToDisplay.wind_speed;
    var humidity = dayToDisplay.humidity;
    var uvIndex = dayToDisplay.uvi;

    var currentWthrEl = $("#current-weather");

    displayCityNameEl.html(cityName);


    currentWthrEl.children(".date").html(date);

    // icon of the weather
    currentWthrEl.children(".condition").attr('src', iconLink).attr('alt', condition);

    var oneDFEl = currentWthrEl.children(".one-day-forecast");


    oneDFEl.children('.temp').html('Temp: ' + temp + ' F');
    oneDFEl.children(".wind").html('Wind: ' + windSpeed + ' MPH')

    oneDFEl.children(".humidity").html('Humidity: ' + humidity + ' %')
    // uv index
    oneDFEl.children(".uv-index").html('UV Index: ' + uvIndex)


}

var displayFiveDayForecast = function (data, cityName) {
    for (var day = 1; day < 6; day++) {
        displayCityNameEl.html(cityName);
        var dayToDisplay = data.daily[day]
        var date = dateConvert(dayToDisplay.dt);
        var condition = capitalizeString(dayToDisplay.weather[0].description);
        var iconLink = 'http://openweathermap.org/img/wn/' + dayToDisplay.weather[0].icon + '.png'
        var temp = Math.round(dayToDisplay.temp.day);
        var windSpeed = dayToDisplay.wind_speed;
        var humidity = dayToDisplay.humidity;
        var uvIndex = dayToDisplay.uvi;


        var fiveDFEl = $(".five-day-forecast")
        // need display 

        //date
        fiveDFEl.children(".date").html(date);
        // text of the condition
        // var conditionDiscription = capitalizeString(dayToDisplay.weather[0].description);
        // icon of the weather
        fiveDFEl.children(".condition").attr('src', iconLink).attr('alt', condition);
        // temperature day temp
        fiveDFEl.children(".temp").html('Temp: ' + temp + ' F')
        // wind speed
        fiveDFEl.children(".wind").html('Wind: ' + windSpeed + ' MPH')
        // humidity
        fiveDFEl.children(".humidity").html('Humidity: ' + humidity + ' %')
        // uv index
        fiveDFEl.children(".uv-index").html('UV Index: ' + uvIndex)









    }
}


// uploadd cities stored in local storage
loadCities();
// add a click event for old search saved cities to direct to the same formsubmitHandler with their information.
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