//weather personal APIKey ending 8f22ad49c151f0bf1918e3b3dbe2b739
var apiKey = "8f22ad49c151f0bf1918e3b3dbe2b739";

// jquery references
var userFormEl = $("#user-form");
var buttonUserFormEl = $("#user-form .btn");
var cityNameInputEl = $("#city-name");
var searchedCitiesEl = $(".searched-cities");
var displayCityNameEl = $(".display-city-name");
var cityButtonEl = $(".searched-city-button");

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
    searchedCitiesEl.append(cityButton);

    searchedCitiesEl.on("click", "button", function (event) {
        event.preventDefault();

        console.log("Clicked");
        var i = $(this).text().trim();
        getCoordinates(i);

    });

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
        getFiveDayForecast(latitude, longitude);
    })
};

// gets data for 8 days need to iterate just for 5 0<5
var getFiveDayForecast = function (latitude, longitude) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    $.get(weatherApi, function (data) {
        console.log(data);
        // iterate through 5 items and append as cards to the fivedayforecast 
        for (var day = 0; day < 5; day++) {
            // variable for easy display
            var dayToDisplay = data.daily[day]
            var cityName = cityNameFromInput;
            var date = dateConvert(dayToDisplay.dt);
            var condition = capitalizeString(dayToDisplay.weather[0].description);
            var iconLink = 'http://openweathermap.org/img/wn/' + dayToDisplay.weather[0].icon + '.png'
            var temp = Math.round(dayToDisplay.temp.day);
            var windSpeed = dayToDisplay.wind_speed;
            var humidity = dayToDisplay.humidity;
            var uvIndex = dayToDisplay.uvi;

            console.log(dayToDisplay)
            // need display 
            //city name
            console.log("City name : ");
            console.log(cityName);
            displayCityNameEl.html(cityName);

            //date
            console.log("The day of : ");
            console.log(date);


            // text of the condition
            console.log("Condition on the street is :");
            // var conditionDiscription = capitalizeString(dayToDisplay.weather[0].description);
            console.log(condition);
            // icon of the weather
            console.log(iconLink);
            // temperature day temp
            console.log("Temperature");
            console.log(temp);
            // wind speed
            console.log("Wind speed");
            console.log(windSpeed);
            // humidity
            console.log("Humidity");
            console.log(humidity);
            // uv index
            console.log("UV index");
            console.log(uvIndex);





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

// uploadd cities stored in local storage
loadCities();
// add a click event for old search saved cities to direct to the same formsubmitHandler with their information.
userFormEl.on("submit", formSubmitHandler);
// cityButtonEl.on("click", getCoordinates($(this.val())));

// searchedCitiesEl.on("click", "button", function (event) {
//     event.preventDefault();

//     console.log("Clicked");
//     var i = $(this).text().trim();
//     getCoordinates(i);

// });

// i need to fix click on button should display the information for this button city.