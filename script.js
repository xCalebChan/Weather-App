function toggleDayNight() {
    const sunIcon = document.getElementById('SunIcon');
    const body = document.body;

    if (sunIcon.src.includes('icon.png')) {
        sunIcon.src = 'moon.png';
        body.style.background = 'linear-gradient(to bottom, #001f3f, #003366, #003f5c, #004d66)'; // Night gradient
    } else {
        sunIcon.src = 'icon.png';
        body.style.background = 'linear-gradient(to bottom, #ff6e7f, #ffcc83, #ff9a8b, #ff6f61)'; // Day gradient
    }
}

function getWeather() {
    const apiKey = 'abd8548ba25e4c086762a92a98f21bfe';
    const city = document.getElementById('SearchBox').value;
    const error = document.getElementById('errorMessage');

    if (!city) {
        error.style.display = 'block';
        return;
    }
    error.style.display = 'none';

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            error.style.display = 'block';
            error.textContent = 'Error fetching current weather data. Please try again';
        });

    fetch(forecastURL) 
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            error.style.display = 'block';
            error.textContent = 'Error fetching hourly forecast data. Please try again';
        });
}

function displayWeather(data) {
    const currTemp = document.getElementById('currentTemperature');
    const currConditions = document.getElementById('currentConditions');
    const currIcon = document.getElementById('currentWeatherIcon');
    const currCity = document.getElementById('currentCity');
    const container = document.getElementById('currentWeather');

    if (data.cod === '404') {
        currTemp.textContent = 'Error';
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        currIcon.src = iconURL;
        currIcon.alt = description;
        currTemp.textContent = `${temperature}°C`;
        currConditions.textContent = capitalizeWords(description);
        currCity.textContent = cityName;
        container.style.display = 'flex';

        showImage();
    }
}

function displayHourlyForecast(data) {
    const hourlyForecast = document.getElementById('hourlyForecast');
    hourlyForecast.innerHTML = '';
    const container = document.getElementById('weatherForecast');
    const next24Hours = data.slice(0, 8);

    if (data.cod === '404') {
        return;
    } else {
        container.style.display = 'flex';
        next24Hours.forEach(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temperature = Math.round(item.main.temp);
            const iconCode = item.weather[0].icon;
            const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const hourlyItemHtml = `
                <div class="hourly-item">
                    <span>${hour}:00</span>
                    <img src="${iconURL}" alt="Hourly Weather Icon">
                    <span>${temperature}°C</span>
                </div>
            `;
            hourlyForecast.innerHTML += hourlyItemHtml;
        });
    }
}

function showImage() {
    const weatherIcon = document.getElementById('currentWeatherIcon');
    weatherIcon.style.display = 'block';
}

function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(' '); 
}
