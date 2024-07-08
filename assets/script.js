var APIKey = "82cbf5d4f606264228a86a468866ea1b";

//query selectors to manipulate htlm classes and IDS
var searchForm = document.querySelector("#city-search-form");
var cityInput = document.querySelector("#city-input");
var searchedCity = document.querySelector("#searched-city");

var currentWeather = document.querySelector("#current-weather-container");

var forecastTitle = document.querySelector("#forecast-title");
var forecastWeather = document.querySelector("#forecast-container");

var pastSearchBtn = document.querySelector("#past-search-buttons");
var pastSearchesArray = [];

// function that calls current weather (getWeather) and forecast (getForecast), along with saving the search (saveSearch) and creating a button for previous searches (searchHistory)
function searchFormSubmit(event) {
  event.preventDefault();

  // Get the trimmed value of the city input
  const city = cityInput.value.trim();

  if (city) {
    // Fetch the current weather and forecast for the entered city
    getWeather(city);
    getForecast(city);

    // Add the city and its input value
    pastSearchesArray.unshift(city);
    cityInput.value = "";
  } else {
    alert("Enter a City to Search");
  }

  // Save the search and update the search history
  saveSearch();
  searchHistory(city);
}

function saveSearch() {
  localStorage.setItem("pastSearchesArray", JSON.stringify(pastSearchesArray));
}

// api call for current weather and CurrentWeather
function getWeather(city) {
  var APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

  fetch(APIURL).then(function (response) {
    response
      .json()

      .then(function (data) {
        displayCurrentWeather(data, city);
      });
  });
}

// function that displays current weather
function displayCurrentWeather(weather, searchCity) {
  // deletes previous text
  currentWeather.textContent = "";
  searchedCity.textContent = searchCity;

  // creates date element
  var currentDate = document.createElement("div");
  currentDate.textContent = moment(weather.dt.value).format("MMM D, YYYY");
  searchedCity.appendChild(currentDate);

  // use back tick to retriev weather img
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  searchedCity.appendChild(weatherIcon);

  // creates a div element to hold temperature data
  var temperature = document.createElement("div");
  temperature.textContent = "Temperature: " + weather.main.temp + " °F";
  temperature.classList = "list-group-item";

  // creates a div element to hold humidity data
  var humidity = document.createElement("div");
  humidity.textContent = "Humidity: " + weather.main.humidity + " %";
  humidity.classList = "list-group-item";

  // creates a div element to hold wind data
  var windSpeed = document.createElement("div");
  windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeed.classList = "list-group-item";

  // appends to current weather container
  currentWeather.appendChild(temperature);
  currentWeather.appendChild(humidity);
  currentWeather.appendChild(windSpeed);
}

// api call for forecast weather and its display
function getForecast(city) {
  var APIURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;

  fetch(APIURL).then(function (response) {
    response
      .json()

      .then(function (data) {
        displayForecast(data);
      });
  });
}

// function that displays forecast weather
function displayForecast(weather) {
  forecastTitle.textContent = "Five Day Forecast";
  forecastWeather.innerHTML = "";

  // list for the forecast
  for (let i = 5; i < weather.list.length; i += 8) {
    const dailyForecast = weather.list[i];

    // Create forecast and append
    const forecastEl = document.createElement("div");
    forecastEl.classList.add("card", "bg-primary", "text-light", "m-2");
    const forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList.add("card-header", "text-center");
    forecastEl.appendChild(forecastDate);

    const weatherIcon = document.createElement("img");
    weatherIcon.classList.add("card-body", "text-center");
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}.png`
    );

    forecastEl.appendChild(weatherIcon);

    const forecastTemp = document.createElement("div");
    forecastTemp.classList.add("card-body", "text-center");
    forecastTemp.textContent = `Temp: ${dailyForecast.main.temp} °F`;
    forecastEl.appendChild(forecastTemp);

    const forecastHumidity = document.createElement("div");
    forecastHumidity.classList.add("card-body", "text-center");
    forecastHumidity.textContent = `Humidity: ${dailyForecast.main.humidity} %`;
    forecastEl.appendChild(forecastHumidity);
    const forecastWindSpeed = document.createElement("div");
    forecastWindSpeed.classList.add("card-body", "text-center");
    forecastWindSpeed.textContent = `Wind Speed: ${dailyForecast.wind.speed} MPH`;
    forecastEl.appendChild(forecastWindSpeed);

    forecastWeather.appendChild(forecastEl);
  }
}

// creates buttons for previous searches and append
function searchHistory(searchHistory) {
  pastSearchBtn = document.createElement("button");
  pastSearchBtn.textContent = searchHistory;
  pastSearchBtn.classList = "d-flex w-100 btn-light border p-2";
  pastSearchBtn.setAttribute("data-city", searchHistory);
  pastSearchBtn.setAttribute("type", "submit");
  pastSearchBtn.prepend(pastSearchBtn);
}

// function thats calls current weather (getWeather) and forecast (getForecast) for past searches
function pastSearchView(event) {
  var city = event.target.getAttribute("data-city");

  if (city) {
    getWeather(city);
    getForecast(city);
  }
}

searchForm.addEventListener("submit", searchFormSubmit);
pastSearchBtn.addEventListener("click", pastSearchView);
