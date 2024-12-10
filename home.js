// script.js

const apiKey = "9ea1fa0b6f05f7283c26d775af7a351a"; // Your OpenWeatherMap API Key
const defaultCity = "Livingstone";

function fetchWeather() {
    const weatherInfo = document.getElementById("weather-info");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const { main, weather, wind, clouds, sys, timezone } = data;
            const temp = main.temp;
            const feelsLike = main.feels_like;
            const humidity = main.humidity;
            const pressure = main.pressure;
            const cloudiness = clouds.all;
            const condition = weather[0].description;
            const windSpeed = wind.speed;
            const windDir = wind.deg;
            const sunrise = formatTime(sys.sunrise, timezone);
            const sunset = formatTime(sys.sunset, timezone);
            const localTime = formatTime(Math.floor(Date.now() / 1000), timezone);

            // Update the weather details in HTML
            document.getElementById("temp").textContent = temp;
            document.getElementById("feels-like").textContent = feelsLike;
            document.getElementById("humidity").textContent = humidity;
            document.getElementById("cloudiness").textContent = cloudiness;
            document.getElementById("condition").textContent = condition;
            document.getElementById("pressure").textContent = pressure;
            document.getElementById("wind-speed").textContent = windSpeed;
            document.getElementById("wind-dir").textContent = windDir;
            document.getElementById("sunrise").textContent = sunrise;
            document.getElementById("sunset").textContent = sunset;
            document.getElementById("local-time").textContent = localTime;

            // Optional: Update the weather summary text
            weatherInfo.textContent = `${defaultCity}: ${temp}°C, ${condition}`;
            setDynamicBackground(weather[0].icon);
        })
        .catch(() => {
            weatherInfo.textContent = "Unable to load weather data.";
        });
}

// Helper function to format Unix timestamp to local time
function formatTime(unixTime, timezone) {
    const date = new Date((unixTime + timezone) * 1000);
    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
}

// Fetch weather details on load
fetchWeather();

function setDynamicBackground(icon) {
    const bgMap = {
        "01d": "sunny.jpg",       // Clear sky day
        "01n": "clear-night.jpg", // Clear sky night
        "02d": "cloudy-day.jpg",  // Few clouds day
        "02n": "cloudy-night.jpg",// Few clouds night
        // Add more icon mappings as needed
    };

    const bgImage = bgMap[icon] || "default-weather.jpg";
    document.getElementById("homepage").style.backgroundImage = `url('images/${bgImage}')`;
}

// Initialize the homepage
fetchWeather();

function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format the time as HH:MM:SS
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Initialize the clock and update it every second
setInterval(updateClock, 1000);
updateClock(); // Call immediately to avoid 1-second delay

function redirectToMain() {
    window.location.href = "index.html"; // Redirects to the main page
}

