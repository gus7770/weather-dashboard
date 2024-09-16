const apiKey = 'be39efe45dab6d80fa1c029d44b0187a'; // Your OpenWeather API key

// Event listener for manual search
document.getElementById('search-btn').addEventListener('click', function () {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    }
});

// Event listeners for preset city buttons
document.querySelectorAll('.preset-city').forEach(button => {
    button.addEventListener('click', function () {
        const city = this.getAttribute('data-city');
        getWeather(city);
    });
});

function getWeather(city) {
    const geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    
    fetch(geocodeURL)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                fetchWeather(lat, lon, city);
            }
        });
}

function fetchWeather(lat, lon, city) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data, city);
            displayForecast(data);
            saveToHistory(city);
        });
}

function displayCurrentWeather(data, city) {
    const currentWeather = data.list[0];
    const weatherHTML = `
        <h3>${city} (${new Date(currentWeather.dt_txt).toLocaleDateString()}) <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png"></h3>
        <p>Temp: ${currentWeather.main.temp}°F</p>
        <p>Wind: ${currentWeather.wind.speed} MPH</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
    `;
    document.getElementById('current-weather').innerHTML = weatherHTML;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    
    for (let i = 1; i < data.list.length; i += 8) { // Adjust for each day forecast
        const forecast = data.list[i];
        const forecastHTML = `
            <div class="card p-2">
                <h5>${new Date(forecast.dt_txt).toLocaleDateString()}</h5>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">
                <p>Temp: ${forecast.main.temp}°F</p>
                <p>Wind: ${forecast.wind.speed} MPH</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastHTML;
    }
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('history', JSON.stringify(history));
        displayHistory();
    }
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';
    history.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => getWeather(city));
        historyContainer.appendChild(button);
    });
}

window.onload = function () {
    displayHistory();
};