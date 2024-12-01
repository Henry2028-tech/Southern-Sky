var ApiKey = '5acc976ebe4ab27765351cf4d7fb98e2';

// Toggle dropdown functionality
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', () => {
        const dropdownContent = button.nextElementSibling;
        const isVisible = dropdownContent.style.display === 'block';

        // Close all dropdowns
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.style.display = 'none';
        });

        // Toggle current dropdown
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', event => {
    if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.style.display = 'none';
        });
    }
});

// Toggle visibility of cities dropdown
document.querySelectorAll('.cities-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to the document
        const citiesDropdown = button.nextElementSibling;
        const isVisible = citiesDropdown.style.display === 'block';

        // Close all dropdowns
        document.querySelectorAll('.cities-content').forEach(content => {
            content.style.display = 'none';
        });

        // Toggle the current dropdown
        citiesDropdown.style.display = isVisible ? 'none' : 'block';
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('#citiesDropdown')) {
        document.querySelectorAll('.cities-content').forEach(content => {
            content.style.display = 'none';
        });
    }
});
// Populate the city dropdown menu
const cities = ["Lusaka", "Ndola", "Kabwe"];
const cityDropdown = document.getElementById("cityDropdown");

cities.forEach(city => {
    const cityOption = document.createElement("a");
    cityOption.textContent = city;
    cityOption.href = "#";
    cityOption.onclick = () => getWeather(city);
    cityDropdown.appendChild(cityOption);
});

// Function to get and fetch weather for the default city or fallback
function handleDefaultCity() {
    // Check if a user-selected default city exists in localStorage
    const savedCity = localStorage.getItem('defaultCity') || 'Livingstone'; // Default fallback is Livingstone
    getWeather(savedCity).catch((error) => {
        console.warn(`Failed to fetch weather for ${savedCity}: ${error.message}`);
        if (savedCity !== 'Livingstone') {
            console.log('Falling back to Livingstone...');
            getWeather('Livingstone').catch((fallbackError) => {
                console.error(`Failed to fetch weather for Livingstone: ${fallbackError.message}`);
                alert('Unable to fetch weather for the default city or Livingstone.');
            });
        }
    });
}

// References to DOM elements
const setDefaultCityDiv = document.getElementById('setDefaultCity');
const showDefaultCityInput = document.getElementById('showDefaultCityInput');
const saveDefaultCityButton = document.getElementById('saveDefaultCity');
const newCityInput = document.getElementById('newCityInput');

// Function to toggle the visibility of the input box
function toggleSetDefaultCity(event) {
    event.preventDefault(); // Prevent anchor default behavior
    const isVisible = setDefaultCityDiv.style.display === 'block';
    setDefaultCityDiv.style.display = isVisible ? 'none' : 'block';
}

// Hide the input box when clicking outside or selecting a city
function hideSetDefaultCity(event) {
    if (
        !setDefaultCityDiv.contains(event.target) && // Clicks outside the input box
        event.target !== showDefaultCityInput // Not the dropdown link
    ) {
        setDefaultCityDiv.style.display = 'none';
    }
}

// Save the default city and hide the input box
saveDefaultCityButton.addEventListener('click', () => {
    const newCity = newCityInput.value.trim();
    if (newCity) {
        setDefaultCity(newCity); // Use your setDefaultCity function
        setDefaultCityDiv.style.display = 'none'; // Hide input box after selection
    } else {
        alert('Please enter a valid city.');
    }
});

// Toggle the input box when "Set a Default City" is clicked
showDefaultCityInput.addEventListener('click', toggleSetDefaultCity);

// Hide the input box when clicking outside it
document.addEventListener('click', hideSetDefaultCity);

window.onload = function () {
    handleDefaultCity();
};


// Fetch and display weather for a city
function getWeather(cityName) {
    const cityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${ApiKey}&units=metric`;

    fetch(cityWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching weather data for ${cityName}`);
            }
            return response.json();
        })
        .then(data => {
            // Display current weather
            displayCurrentWeather(cityName, data);

            // Get 5-day forecast using coordinates
            if (data.coord) {
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                fetch5DayForecast(lat, lon);
            } else {
                throw new Error("Coordinates not available for the selected city.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Unable to fetch weather data. Please try again later.');
        });
}

function displayCurrentWeather(cityName, data) {
    const weatherDisplay = document.getElementById('dailyDisplay');

    // Extract sunrise and sunset times (convert from UNIX timestamp)
    const sunriseTime = new Date(data.sys?.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(data.sys?.sunset * 1000).toLocaleTimeString();

    // Get the weather icon URL
    const weatherIcon = data.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        : '';

    // Construct the weather information display
    weatherDisplay.innerHTML = `
        <h2>Weather in ${cityName}</h2>
        ${weatherIcon ? `<img src="${weatherIcon}" alt="${data.weather[0].description}" title="${data.weather[0].description}" />` : ''}
        <p>Temperature: ${data.main?.temp ?? 'N/A'}°C</p>
        <p>Feels Like: ${data.main?.feels_like ?? 'N/A'}°C</p>
        <p>Condition: ${data.weather?.[0]?.description ?? 'N/A'}</p>
        <p>Humidity: ${data.main?.humidity ?? 'N/A'}%</p>
        <p>Wind Speed: ${data.wind?.speed ?? 'N/A'} m/s</p>
        <p>Pressure: ${data.main?.pressure ?? 'N/A'} hPa</p>
        <p>Visibility: ${data.visibility ? data.visibility / 1000 : 'N/A'} km</p>
        <p>Sunrise: ${sunriseTime}</p>
        <p>Sunset: ${sunsetTime}</p>
    `;
}

function fetch5DayForecast(lat, lon) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`;

    fetch(forecastApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching 5-day forecast data');
            }
            return response.json();
        })
        .then(forecastData => {
            // Display the 5-day forecast
            display5DayForecast(forecastData.list);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('failed');
        });
}


function display5DayForecast(forecastList) {
    const forecastDisplay = document.getElementById('fiveDayWeather');
    forecastDisplay.innerHTML = '<h3>5-Day Forecast</h3>';  
 
    const groupedForecasts = groupForecastsByDate(forecastList);

    Object.keys(groupedForecasts).forEach(date => {
        const dayForecasts = groupedForecasts[date];
        
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');

        forecastDay.innerHTML = `<h4>${date}</h4>`;

        dayForecasts.forEach(forecast => {
            const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');

            forecastItem.innerHTML = `
                <p><strong>${time}</strong></p>
                <p>Temp: ${forecast.main.temp}°C</p>
                <p>${forecast.weather[0].description}</p>
            `;

            forecastDay.appendChild(forecastItem);
        });

        forecastDisplay.appendChild(forecastDay);
    });
}


function groupForecastsByDate(forecastList) {
    const groupedForecasts = {};

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!groupedForecasts[date]) {
            groupedForecasts[date] = [];
        }
        groupedForecasts[date].push(forecast);
    });

    return groupedForecasts;
}




// Fetch weather data by Geolocation 
function fetchWeatherByCoordinates(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.name, data);
            fetch5DayForecast(lat, lon); // Fetch 5-day forecast data
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Unable to fetch weather data for your location.');
        });
}

// Search for city weather
document.getElementById('searchButton').addEventListener('click', () => {
    const cityName = document.getElementById('citySearch').value.trim();
    if (cityName) {
        getWeather(cityName);
    } else {
        alert('Please enter a city name.');
    }
});

// Fetch and display weather (from the provided code)
function getWeather(cityName) {
    const cityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${ApiKey}&units=metric`;

    fetch(cityWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching weather data for ${cityName}`);
            }
            return response.json();
        })
        .then(data => {
            // Display current weather
            displayCurrentWeather(cityName, data);

            // Fetch 5-day forecast using coordinates
            if (data.coord) {
                fetch5DayForecast(data.coord.lat, data.coord.lon);
            } else {
                throw new Error('Coordinates not available for the selected city.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const weatherDisplay = document.getElementById('dailyDisplay');
            weatherDisplay.innerHTML = `<p style="color: red;">Unable to fetch weather data: ${error.message}</p>`;
        });
}



