const API_KEY = '9d14035118f75d4cf904666a87a7d276';

document.getElementById('city-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    getCoordinates(city);
});

function getCoordinates(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            getWeather(lat, lon, city);
            saveSearchHistory(city);
        })
        .catch(error => alert('City not found'));
}

function getWeather(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => displayWeather(data, city));
}

function displayWeather(data, city) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `<h2>${city}</h2>`;

    // Current Weather
    const currentWeather = data.list[0];
    weatherInfo.innerHTML += createWeatherCard(currentWeather, 'Current Weather', 'current-weather');

    // 5 Day Forecast
    weatherInfo.innerHTML += '<h3>5-Day Forecast</h3>';
    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');
    for (let i = 1; i < data.list.length; i += 8) {
        forecastContainer.innerHTML += createWeatherCard(data.list[i], '', 'forecast-weather');
    }
    weatherInfo.appendChild(forecastContainer);
}

function createWeatherCard(weather, title, additionalClass) {
    const date = new Date(weather.dt * 1000).toLocaleDateString();
    const temp = (weather.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;
    const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    return `
        <div class="weather-card ${additionalClass}">
            <h4>${title || date}</h4>
            <img src="${icon}" class="weather-icon" alt="Weather icon">
            <p>Temperature: ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
    `;
}

function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    displaySearchHistory();
}

function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryEl = document.getElementById('search-history');
    searchHistoryEl.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => getCoordinates(city));
        searchHistoryEl.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', displaySearchHistory);
