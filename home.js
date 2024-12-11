// script.js

const apiKey = "9ea1fa0b6f05f7283c26d775af7a351a"; // Your OpenWeatherMap API Key
const defaultCity = "Livingstone";

function fetchWeather() {
    const weatherInfo = document.getElementById("weather-info");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather Data:", data); // Log the API response for debugging

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

            // Set the background dynamically based on weather icon
            setDynamicBackground(weather[0].icon);
        })
        .catch((error) => {
            weatherInfo.textContent = "";
            console.error("Error fetching weather data:", error);
        });
}

// Helper function to format Unix timestamp to local time
function formatTime(unixTime, timezone) {
    const date = new Date((unixTime + timezone) * 1000);
    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
}

// Array of background image URLs (natural and weather-themed)
// Array of background image URLs (natural and weather-themed)
const backgrounds = [
  'https://images.pexels.com/photos/29706349/pexels-photo-29706349/free-photo-of-winter-landscape-of-lake-turgoyak-russia.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.unsplash.com/photo-1561489183-2294f748760c', // Stormy Weather
  'https://images.pexels.com/photos/20285511/pexels-photo-20285511/free-photo-of-snow-on-hill-and-trees-in-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/22766846/pexels-photo-22766846/free-photo-of-dramatic-cloud-formation-and-blue-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/8246189/pexels-photo-8246189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/29703128/pexels-photo-29703128/free-photo-of-dramatic-sunset-sky-with-vivid-orange-clouds.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

// Index to keep track of the current background
let currentIndex = 0;

// Function to change the background
function changeBackground() {
  // Update the background image
  document.body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;

  // Move to the next background in the array
  currentIndex = (currentIndex + 1) % backgrounds.length; // Loop back to the start
}

// Set the initial background
changeBackground();

// Change the background every 10 seconds
setInterval(changeBackground, 3000);

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


// Function to update the local time for the current city
function updateCityTime(cityTimeZone) {
    // Get the current time in the specified time zone
    const now = new Date();
    const options = {
        timeZone: cityTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Use false for 24-hour format
    };
    const localTime = new Intl.DateTimeFormat('en-US', options).format(now);

    // Display the time in the HTML element
    document.getElementById("local-time").textContent = localTime;
}

// Example: Replace 'America/New_York' with the desired city's time zone
const cityTimeZone = "Africa/Lusaka"; // Change to the desired city timezone

// Update the time every second
setInterval(() => updateCityTime(cityTimeZone), 1000);

// Call it immediately to avoid a delay
updateCityTime(cityTimeZone);