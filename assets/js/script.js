//weather Api ending 8f22ad49c151f0bf1918e3b3dbe2b739
var userFormEl = document.querySelector("#user-form")
var cityNameInputEl = document.querySelector("#city-name");
var apiUrlCoordinates = "http://api.openweathermap.org/geo/1.0/direct?q=miami&limit=1&appid=8f22ad49c151f0bf1918e3b3dbe2b739"
var apiUrl = 
console.log(cityNameInputEl);

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log("submitted");
    $.get(apiUrl,function(data){
        console.log(data);
    })
}

var getCoordinates = function(cityName){
    var latitude = '' + cityName + '';
    var longitude = '' + cityName + '';
    $.get(apiUrlCoordinates,function(data){
        console.log(data)
        latitude = data.lat;
        longitude = data.lon;
    })
    return [latitude,longitude];
}


userFormEl.addEventListener("submit", formSubmitHandler);