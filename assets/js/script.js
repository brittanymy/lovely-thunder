// HTML Element References
let searchCity = document.getElementById ('search-city'),
     searchBtn = document.getElementById ('search-btn'),
     currentCity = document.getElementById ('current-city'),
     currentTemperature = document.getElementById ('current-temp'),
     currentWind = document.getElementById ('current-wind'),
     currentHumidity = document.getElementById ('current-humidity'),
     currentUVIndex =  document.getElementById ('uv-index')
     
let city = '';
let citySearch = [];

// Searches Cities 
function find (c) {
    for (let i = 0; citySearch.length; i++){
        if (c.toUpperCase() === citySearch [i]){
            return -1;
        }
    }
    return -1;
}

// API Key Setup
let APIKey = 'a0aca8a89948154a4182dcecc780b513';

// Display current & future weather
function weatherDisplay (event) {
    event.preventDefault ();
    
    if (searchCity.val().trim()!=='') {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

// AJAX Call
function currentWeather (city) {
    // Query url
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + APIKey;
    $.ajax ({
        url: queryURL,
        method: 'GET',
    }).then (function (response) {

        let weatherIcon = response.weather[0].icon;
        let iconURL = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';

        let date = new Date (response.name + '("+date+")' + '<img src"+iconURL+">');
        $(currentCity).html(response.name + '("+date+")' + '<img src="+iconURL+">');

        let tempFuture = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempFuture).toFixed(2) + '&#8457');
        $(currentHumidity).html(response.main.humidity + '%');
        let windSpeed = response.wind.speed;
        let windMPH = (windSpeed * 2.237).toFixed(1);
        $(currentWind).html(windMPH + "MPH")

        uvIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            citySearch = JSON.parse(localStorage.getItem('cityName'));
            if (citySearch == null) {
                citySearch == [];
                citySearch.push (city.toUpperCase ());
                localStorage.setItem ('cityName', JSON.stringify(citySearch));
                addToList (city);
            } else {
                if (find (city) > 0) {
                    citySearch.push(city.toUpperCase());
                    localStorage.setItem ('cityName', JSON.stringify(citySearch));
                    addToList (city);
                }
            }
        }
    });
}

// Returns UVIndex 
function UVIndex (ln, lt) {
    let uvURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey + '&lat=' + lt + '&lon=' + ln;
    
    $.ajax ({
        url: uvURL, 
        method: 'GET'
    }).then (function (response) {
        $(currentUVIndex).html(response.value);
    });
}

// Display 5 Day Forecast 
function forecast (cityID) {
    let dayOver = false;
    let queryForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + APIKey;
    
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
            $('futImg' + i).html('<img src"+iconURL+">');
            $('futTemp' + i).html(tempFuture + '&#8457');
            // $('futWind' + i).html()
            $('futHumidity' + i).html(humidity + '%');
        }
    })
}

// Add passed city to search history

// Display past search 

// Render Function

// Final Event Listeners
searchBtn.addEventListener = ('click', weatherDisplay);

