function formatDate(timestamp) {
  let now = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Firday",
    "Saturday",
    "Sunday",
  ];
  let day = days[now.getDay()];
  let minutes = now.getMinutes();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}
function getForecast(coordinates) {
  let apiKey = "f4406d0fa0ff8b4act21f580342802od";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let descriptionElement = document.querySelector("#description");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let cityElement = document.querySelector("#city");
  celsiusTemperature = response.data.temperature.current;

  getForecast(response.data.coordinates);

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  descriptionElement.innerHTML = response.data.condition.description;
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  cityElement.innerHTML = response.data.city;
}
function search(city) {
  let apiKey = "f4406d0fa0ff8b4act21f580342802od";

  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");

  search(cityInputElement.value);
}
search("New York");

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSubmit);

function displayCelsiusTemperature(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

let celsiusLinkElement = document.querySelector("#celsius-link");
celsiusLinkElement.addEventListener("click", displayCelsiusTemperature);

function formatDay(timestamp) {
  let now = new Date(timestamp * 1000);
  let day = now.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayWeatherForecast(response) {
  let dailyForecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecast = `<div class="row">`;

  dailyForecast.forEach(function (daily, index) {
    if (index < 6) {
      forecast =
        forecast +
        ` <div class="col-2">
               <div class="weather-day"> ${formatDay(daily.time)}
</div>
                <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  daily.condition.icon
                }.png" alt="weather-icon">
                <div class="weather-forecast-temperatures"> ${Math.round(
                  daily.temperature.maximum
                )}°
                    ${Math.round(daily.temperature.minimum)}°
                </div>
                </div>
            `;
    }
  });
  forecast = forecast + `</div>`;
  forecastElement.innerHTML = forecast;
}
