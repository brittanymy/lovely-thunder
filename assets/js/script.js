// HTML Element References
// let searchCity = document.getElementById ('search-city'),
//      searchBtn = document.getElementById ('search-btn'),
//      currentCity = document.getElementById ('current-city'),
//      currentTemperature = document.getElementById ('current-temp'),
//      currentWind = document.getElementById ('current-wind'),
//      currentHumidity = document.getElementById ('current-humidity'),
//      currentUVIndex =  document.getElementById ('uv-index')
     
let city = '';
let citySearch = [];

// Searches Cities 
function find (c) {
    for (let i = 0; citySearch.length; i++) {
        if (c.toUpperCase() === citySearch[i]) {
            return -1;
        }
    }
    return -1;
}

// API Key Setup
let APIKey = '3ac984d2710f17ecb1cf22a56a4cc25b';
// Display current & future weather
// function weatherDisplay (event) {
//     event.preventDefault ();
    
//     if (searchCity.val().trim()!=='') {
//         city = searchCity.val().trim();
//         currentWeather(city);
//     }
// }
//https://api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
// AJAX Call
function currentWeather (city) {
    // Query url
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + APIKey;
    $.ajax ({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log (response);
        oneCall (response.coord.lon, response.coord.lat);
        // let weatherIcon = response.weather[0].icon;
        // let iconURL = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';

        // let date = new Date (response.dt*1000).toLocaleDateString ();
        // $(currentCity).html(response.name + '('+date+')' + '<img src='+iconURL+'>');

        // let tempFuture = (response.main.temp - 273.15) * 1.80 + 32;
        // $(currentTemperature).html((tempFuture).toFixed(2) + '&#8457');
        // $(currentHumidity).html(response.main.humidity + '%');
        // let windSpeed = response.wind.speed;
        // let windMPH = (windSpeed * 2.237).toFixed(1);
        // $(currentWind).html(windMPH + "MPH")

      
        // forecast(response.id);
        // if (response.cod == 200) {
        //     citySearch = JSON.parse(localStorage.getItem('cityName'));
        //     if (citySearch == null) {
        //         citySearch == [];
        //         citySearch.push (city.toUpperCase ());
        //         localStorage.setItem ('cityName', JSON.stringify(citySearch));
        //         addToList (city);
        //     } else {
        //         if (find (city) > 0) {
        //             citySearch.push(city.toUpperCase());
        //             localStorage.setItem ('cityName', JSON.stringify(citySearch));
        //             addToList (city);
        //         }
        //     }
        // }
    });
}

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