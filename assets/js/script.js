// HTML element reference
const searchBtn = document.getElementById ("search-btn")
     searchHistoryBtn = document.getElementById ("search-history")
     cityInput = document.getElementById ("city-input"),
     cityName = document.getElementById ("city-name"),
     cityDate = document.getElementById ("date"),
     weatherIcon = document.getElementById ("icon"),
     temperature = document.getElementById ("temperature"),
     windSpeed = document.getElementById ("wind"),
     humidity = document.getElementById ("humidity"),
     uvIndex = document.getElementById ("uv-index"),
     forecastWrapper = document.getElementById ("forecast-wrapper"),
     weeklyForecast = document.getElementById ("weekly-forecast")
       
let cityList = [];

// Form submission
const formSubmission = function (event) {
    event.preventDefault();

    let city = cityInput.value.trim();

    if (city) {
        getCoordinates (city);
        cityInput.value = "";
    } else {
        alert ("Enter a city name!")
    } 
    keepSearchedCity (city);
    cityLoadIn(); 
};

// Grab city name 
const cityCoordinates = function (city) {
    let coordURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=a0c2e4175139a11ef4d0913ba3bef922`;

    fetch (coordURL)
    .then(function (response) {
        if (response.ok) {
            response.JSON().then(function (data) {
                lon = data[0].lon;
                lat = data[0].lat;
                cityName.textContent = data[0].name;
                grabWeather(lon, lat);
            });
        } else {
            alert("City not found.")
        }
    })
    .catch(function (error) {
        alert("Cannot connect to server.")
    });
};

// Grab weather
const grabWeather = function (lon, lat) {
    let cityURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=a0c2e4175139a11ef4d0913ba3bef922&units=imperial`;

    fetch(cityURL) 
    .then(function (response) {
        if (response.ok) {
        response.JSON().then(function (data) {
            displayWeather(data);
        });
    } else {
        alert("City not found.");
    }
    })
    .catch(function (error) {
        alert("Cannot connect to server.");
    });
};  

// Display weather 
const displayWeather = function (data) {
    forecastWrapper.textContent = "";

    let currentDate = data.current.dt;
    let date = new Date(currentDate * 1000);
    let month = date.getMonth ();
    let year = date.getFullYear ();

    let currentTime = parseInt(month) + 1 + "/" + day + "/" + year;

    cityDate.textContent = currentTime;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png"/>`;
    temperature.textContent = `Current temperature: ${data.current.temp}°F`;
    windSpeed.textContent = `Current windspeed: ${data.current.wind_speed} mph`;
    humidity.textContent = `Current humidity: ${data.current.humidity}%`;
    uvIndex.textContent = `Current UV index: ${data.current.uvi}`;

    if (data.current.uvi <= 4) {
        uvIndex.setAttribute ("class", "uv-low");
    } else if (data.current.uvi <= 7) {
        uvIndex.setAttribute ("class", "uv-mid");
    } else uvIndex.setAttribute ("class", "uv-high");

    forecastWrapper.textContent = "5-Day Forecast";

    for (let i = 1; 1 < 6; i++) {
        let forecastDates = data.daily[i].dt;

        let date = new Date(forecastDates * 1000);
        let month = date.getMonth ();
        let day = date.getDate ();
        let year = date.getFullYear ();

        let forecastTime = parseInt(month) + 1 + "/" + day + "/" + year;

        let forecastDay = document.createElement ("div");
        let forecastDate = document.createElement ("p");
        let forecastIcon = document.createElement ("p");
        let forecastTemperature = document.createElement ("p");
        let forecastWindSpeed = document.createElement ("p");
        let forecastHumidity = document.createElement ("p");

        forecastDate.textContent = forecastTime;
        forecastIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png"/>`;
        forecastTemperature.textContent = `Temp: ${data.daily[i].temp.day}°F`;
        forecastWindSpeed.textContent = `Windspeed: ${data.daily[i].wind_speed} mph`;
        forecastHumidity.textContent = `Humidity: ${data.daily[i].humidity}%`;

        forecastDay.setAttribute ("class", "forecast-days");

        forecastDay.appendChild(forecastDate);
        forecastDay.appendChild(forecastIcon);
        forecastDay.appendChild(forecastTemperature);
        forecastDay.appendChild(forecastWindSpeed);
        forecastDay.appendChild(forecastHumidity);
        forecastWrapper.appendChild(forecastDay);
    }
};

// API Key Setup
let APIKey = '3ac984d2710f17ecb1cf22a56a4cc25b';

// Returns UVIndex 
function oneCall (ln, lt) {
    let uvURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lt}&lon=${ln}&exclude=hourly&appid=${APIKey}&units=imperial`
    console.log(uvURL)
    $.ajax ({
        url: queryURL, 
        method: 'GET'
    }).then(function (response) {
       console.log (response);
    });
}

// Display 5 Day Forecast 
function forecast (cityId) {
    let dayOver = false;
    let queryForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?id=' + cityId + '&appid=' + APIKey;
    
    $.ajax ({
        url: queryForecastURL,
        method: 'GET'
    }).then (function (response) {

        for (i = 0; i < 5; i++) {
            let date = new Date ((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString(); 
            let iconCode = response.list[((i+1)*8)-1].weather[0].icon;
            let iconURL = 'https://openweathermap.org/img/wn/' + iconCode + '.png';
            let tempK = response.list[((i+1)*8)-1].main.temp;
            let tempFuture = (((tempK-273.5)*1.80)+32).toFixed(2);
            // let windFuture = (());
            let humidity = response.list[((i+1)*8)-1].main.humidity;

            $('futDate' + i).html(date);
            $('futImg' + i).html('<img src='+iconURL+'>');
            $('futTemp' + i).html(tempFuture + '&#8457');
            // $('futWind' + i).html()
            $('futHumidity' + i).html(humidity + '%');
        }
    })
}

// Add passed city to search history
function addToList (c) {
    let listEl = $('<li>' + c.toUpperCase() + '</li>');
    $(listEl).attr('class', 'list-group-item');
    $(listEl).attr('data-value', c.toUpperCase());
    $('.list-group').append(listEl);
}

// Display past search
function pastSearch (event) {
    let liEl = event.target;
    if (event.target.matches('li')) {
        city = liEl.textContent.trim ();
        currentWeather (city);
    }
} 

// Render Function
function loadCity () {
    $('ul').empty();
    let citySearch = JSON.parse (localStorage.getItem('cityName'));
    if (!citySearch == null) {
        citySearch = JSON.parse(localStorage.getItem('cityName'));
        for (i = 0; i < citySearch.length; i++) {
            addToList (citySearch[i]);
        }
        city = citySearch [i-i];
        currentWeather (city);
    }
}

// Final Event Listeners
$("#search-btn").on('click', function(event){
    event.preventDefault()
    let city = $("#search-city").val()
    currentWeather(city);

});
$(document).on('click', pastSearch);
$(window).on('load', loadCity);