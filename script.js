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
const cities = ["Sinazeze", "Mazabuka", "Monze","Livingstone","Kazungula","Choma","Siavonga","Maamba","Sinazongwe",];
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



    // Construct the weather information display


function displayCurrentWeather(cityName, data) {
    const weatherDisplay = document.getElementById('dailyDisplay');

    const temperature = unitData[currentUnit].temperature(data.main?.temp ?? 0);
    const feelsLike = unitData[currentUnit].temperature(data.main?.feels_like ?? 0);
    const windSpeed = unitData[currentUnit].windSpeed(data.wind?.speed ?? 0);
    const visibility = unitData[currentUnit].rainfall(data.visibility ?? 0);

    const sunriseTime = new Date(data.sys?.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(data.sys?.sunset * 1000).toLocaleTimeString();

    const weatherIcon = data.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        : '';

    weatherDisplay.innerHTML = `
        <h2>Weather in ${cityName}</h2>
        ${weatherIcon ? `<img src="${weatherIcon}" alt="${data.weather[0].description}" title="${data.weather[0].description}" />` : ''}
        <p>Temperature: ${temperature}</p>
        <p>Feels Like: ${feelsLike}</p>
        <p>Condition: ${data.weather?.[0]?.description ?? 'N/A'}</p>
        <p>Humidity: ${data.main?.humidity ?? 'N/A'}%</p>
        <p>Wind Speed: ${windSpeed}</p>
        <p>Pressure: ${data.main?.pressure ?? 'N/A'} hPa</p>
        <p>Visibility: ${visibility}</p>
        <p>Sunrise: ${sunriseTime}</p>
        <p>Sunset: ${sunsetTime}</p>
    `;
}

window.onload = function (Livingstone) {
    handleDefaultCity('livingstone');
    updateUnits('meteric'); // Initialize units based on the default unit
};

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

 // Initialize an empty chart
    const ctx = document.getElementById("myWeatherChart").getContext("2d");
    const weatherChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], // Days or times will go here
            datasets: [{
                label: "Temperature (°C)",
                data: [], // Temperature data will go here
                borderColor: "blue",
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: "top" },
                tooltip: { enabled: true }
            },
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Temperature (°C)" } }
            }
        }
    });

    // Function to update the chart dynamically
    function updateWeatherChart(weatherData) {
        const labels = weatherData.map(data => data.time); // Replace with your time labels
        const temperatures = weatherData.map(data => data.temperature);

        // Update chart data
        weatherChart.data.labels = labels;
        weatherChart.data.datasets[0].data = temperatures;
        weatherChart.update(); // Refresh the chart
    }

    // Fetch weather data from OpenWeatherMap API
    async function fetchWeatherData() {
        const apiKey = "5acc976ebe4ab27765351cf4d7fb98e2"; // Your API key
        const city = "city"; // Replace with dynamic user input if needed
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Transform the data into a format suitable for the chart
            const weatherData = data.list.slice(0, 7).map(item => ({
                time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                temperature: item.main.temp
            }));

            // Update the chart
            updateWeatherChart(weatherData);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    // Call the function to fetch and update the chart
    fetchWeatherData();

    // Optionally, refresh the data every hour
    setInterval(fetchWeatherData, 3600000); // 1 hour in milliseconds



 // Initialize the map with default coordinates
    const map = L.map('map').setView([51.505, -0.09], 10); // Default to London coordinates

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Marker to represent the weather location
    const marker = L.marker([51.505, -0.09]).addTo(map);
    marker.bindPopup("Weather details will appear here.").openPopup();

    // Function to update the map and weather details
    async function updateWeatherAndMap(city) {
        const apiKey = "5acc976ebe4ab27765351cf4d7fb98e2"; // Your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        try {
            // Fetch weather data
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Extract relevant data
            const { coord: { lat, lon }, main: { temp, humidity }, weather } = data;

            // Update map view and marker
            map.setView([lat, lon], 10);
            marker.setLatLng([lat, lon]);
            marker.bindPopup(`
                <strong>${city}</strong><br>
                Temperature: ${temp}°C<br>
                Humidity: ${humidity}%<br>
                Weather: ${weather[0].description}
            `).openPopup();

            // Trigger additional updates (e.g., charts or other sections)
            updateWeatherChart([{ time: "Now", temperature: temp }]); // Example integration
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    // Example city update (this could be dynamic based on user input)
    updateWeatherAndMap("currentCity");

    // Optional: Add an input box to dynamically update the map
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter city name";
    input.style.marginTop = "10px";
    input.addEventListener("change", () => updateWeatherAndMap(input.value));
    document.getElementById("mapDisplay").appendChild(input);



// Settings Section
document.getElementById("saveSettings").addEventListener("click", () => {
    const location = document.getElementById("locationInput").value;
    const unit = document.getElementById("unitSelect").value;
    updateWeatherAndMap(location); // Reuse the weather map function
    console.log(`Settings saved: Location - ${location}, Unit - ${unit}`);
});



// Function to handle form submission
document.getElementById("feedbackForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get user feedback and name
    const feedbackInput = document.getElementById("feedbackInput").value.trim();
    const userName = document.getElementById("userName").value.trim() || "Anonymous";

    if (!feedbackInput) {
        alert("Please enter your feedback.");
        return;
    }

    // Add feedback to the list
    const feedbackList = document.getElementById("feedbackList");
    const feedbackItem = document.createElement("li");
    feedbackItem.innerHTML = `<strong>${userName}:</strong> ${feedbackInput}`;
    feedbackList.prepend(feedbackItem); // Add to the top of the list

    // Clear the form
    document.getElementById("feedbackInput").value = "";
    document.getElementById("userName").value = "";

    alert("Thank you for your feedback!");
});

// Optional: Load existing feedback from localStorage
function loadFeedback() {
    const feedbackList = document.getElementById("feedbackList");
    const savedFeedback = JSON.parse(localStorage.getItem("userFeedback")) || [];
    savedFeedback.forEach(({ name, feedback }) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.innerHTML = `<strong>${name}:</strong> ${feedback}`;
        feedbackList.appendChild(feedbackItem);
    });
}

// Optional: Save feedback to localStorage
function saveFeedback(name, feedback) {
    const savedFeedback = JSON.parse(localStorage.getItem("userFeedback")) || [];
    savedFeedback.push({ name, feedback });
    localStorage.setItem("userFeedback", JSON.stringify(savedFeedback));
}





const languageContent = {
    en: {
        title: "Southern Sky",
        headerTitle: "Southern Sky",
        menu: "☰ Menu",
        changeLanguage: "Change Language",
        toggleUnits: "Toggle Units",
        about: "About",
        contact: "Contact Details",
        setDefaultCity: "Set a Default City",
        saveDefaultCity: "Set Default City",
        cities: "Cities",
        searchButton: "Search",
        todayWeatherTitle: "Today's Weather",
        todayWeatherText: "Select a city to view the weather.",
        forecastTitle: "5-Day Forecast",
        forecastText: "Select a city to view the forecast.",
    },
    fr: {
        title: "Ciel Austral",
        headerTitle: "Ciel Austral",
        menu: "☰ Menu",
        changeLanguage: "Changer de langue",
        toggleUnits: "Basculer les unités",
        about: "À propos",
        contact: "Détails du contact",
        setDefaultCity: "Définir une ville par défaut",
        saveDefaultCity: "Définir la ville par défaut",
        cities: "Villes",
        searchButton: "Rechercher",
        todayWeatherTitle: "Météo d'aujourd'hui",
        todayWeatherText: "Sélectionnez une ville pour voir la météo.",
        forecastTitle: "Prévisions sur 5 jours",
        forecastText: "Sélectionnez une ville pour voir les prévisions.",
    },
};

let currentLanguage = "en";

// Update all elements based on the selected language
function updateLanguage() {
    document.querySelectorAll("[data-lang-key]").forEach((element) => {
        const key = element.getAttribute("data-lang-key");
        element.textContent = languageContent[currentLanguage][key];
    });
}

// Show or hide the language options dropdown
document.getElementById("changeLanguage").addEventListener("click", (e) => {
    e.preventDefault();
    const languageOptions = document.getElementById("languageOptions");
    languageOptions.style.display = languageOptions.style.display === "none" ? "block" : "none";
});

// Handle language selection
document.querySelectorAll(".language-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        currentLanguage = e.target.getAttribute("data-language");
        updateLanguage();

        // Hide the language options dropdown after selection
        document.getElementById("languageOptions").style.display = "none";
    });
});

// Initialize the language when the page loads
updateLanguage();

let currentUnit = "metric"; // Default to Celsius

// Sample data for different unit values
const unitData = {
    metric: {
        temperature: (value) => `${value}°C`,
        windSpeed: (value) => `${value} km/h`,
        rainfall: (value) => `${value} mm`,
    },
    imperial: {
        temperature: (value) => `${Math.round(value * (9 / 5) + 32)}°F`,
        windSpeed: (value) => `${Math.round(value * 0.621371)} mph`,
        rainfall: (value) => `${(value * 0.0393701).toFixed(2)} in`,
    },
};

// Function to update all unit-based elements
function updateUnits() {
    document.querySelectorAll("[data-unit-key]").forEach((element) => {
        const key = element.getAttribute("data-unit-key");
        const rawValue = parseFloat(element.textContent.match(/-?\d+(\.\d+)?/)); // Extract numeric value
        if (!isNaN(rawValue) && unitData[currentUnit][key]) {
            element.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                unitData[currentUnit][key](rawValue)
            }`;
        }
    });
}

// Show or hide the unit options dropdown
document.getElementById("toggleUnits").addEventListener("click", (e) => {
    e.preventDefault();
    const unitOptions = document.getElementById("unitOptions");
    unitOptions.style.display = unitOptions.style.display === "none" ? "block" : "none";
});

// Handle unit selection
document.querySelectorAll(".unit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        currentUnit = e.target.getAttribute("data-unit"); // Get the selected unit
        updateUnits(); // Update all unit-dependent elements

        // Hide the unit options dropdown after selection
        document.getElementById("unitOptions").style.display = "none";
    });
});

// Initialize the unit-based elements
updateUnits();

const aboutLink = document.getElementById('about-link');
const aboutContainer = document.getElementById('about-container');





async function updateWeatherAndSections(city) {
    const apiKey = "9ea1fa0b6f05f7283c26d775af7a351a";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(weatherApiUrl);
        const weatherData = await response.json();
        const { coord: { lat, lon } } = weatherData;

        // Update all sections
        updateSunriseSunset(weatherData);
        updateWindConditions(weatherData);
        fetchUVIndex(lat, lon);
        fetchHourlyForecast(city);
        updateWeatherRadar(lat, lon);
        updateFeelsLike(weatherData);
    } catch (error) {
        console.error("Error updating weather sections:", error);
    }
}

<!-- Southern Sky info -->

    const aboutBtn = document.getElementById("aboutBtn");
    const helpBtn = document.getElementById("helpBtn");
    const contactBtn = document.getElementById("contactBtn");
    const infoModal = document.getElementById("infoModal");
    const infoText = document.getElementById("infoText");
    const closeModal = document.getElementById("closeModal");

   // About content including Mission, Vision, Engineer Information, and Technology
const aboutContent = `
    <p>Welcome to Southern Sky! We are your trusted source for accurate, up-to-date weather information, ensuring that you stay informed and prepared for all weather conditions. Whether you're planning your day, organizing an outdoor event, or simply staying safe during severe weather, Southern Sky is here to guide you.</p>
    <p>At Southern Sky, we understand that the weather plays a vital role in everyday life. That’s why we provide real-time updates, weekly forecasts, and severe weather alerts tailored to your location. Our user-friendly interface and interactive features make accessing weather information seamless and intuitive.</p>
    <p>Powered by advanced technology, Southern Sky uses the OpenWeatherMap API to deliver reliable and precise data from trusted global sources. We aim to empower individuals, families, and communities by keeping them informed and helping them make decisions confidently.</p>
    <p>Beyond just providing weather updates, Southern Sky is committed to promoting environmental awareness. As climate change continues to impact weather patterns, we aim to educate and inspire users to take action for a sustainable future.</p>

    <!-- Mission Section -->
    <h3>Our Mission</h3>
    <p>Our mission is to provide reliable, real-time weather information to individuals and communities worldwide. We strive to empower users by delivering accurate data through an accessible platform that helps people plan, prepare, and make informed decisions based on weather conditions. We are committed to enhancing the safety and well-being of our users by offering timely weather alerts and fostering environmental awareness for a sustainable future.</p>

    <!-- Vision Section -->
    <h3>Our Vision</h3>
    <p>Our vision is to become a global leader in weather information services, known for accuracy, innovation, and user-centric solutions. We aim to create a world where people are better informed about the weather, leading to safer and more sustainable communities. We believe that by harnessing the power of technology and data, we can make weather information more accessible and useful to everyone.</p>

    <!-- About the Engineer Section -->
    <p>Southern Sky was created by Henry Mukuka, a student of Electrical and Electronics Engineering at Information and Communication University (ICU). Henry’s passion for technology and innovation led to the development of this platform to make weather information accessible and accurate for everyone.</p>

    <p>Thank you for choosing Southern Sky. Explore our platform and experience weather tracking like never before.</p>

    <!-- Technology Section -->
    <h3>Technology Used</h3>
    <p>Southern Sky is built using a combination of modern web technologies to provide a seamless and interactive user experience. Here are the key technologies used:</p>

        <p><strong>HTML (Hypertext Markup Language):</strong> The backbone of the website's structure, HTML is used to define the content and elements of each page.</p>
        <p><strong>CSS (Cascading Style Sheets):</strong> CSS is used to style the layout, colors, fonts, and overall visual appearance of the website, ensuring a responsive and visually appealing experience across all devices.</p>
        <p><strong>JavaScript:</strong> JavaScript powers the interactive elements of Southern Sky, enabling real-time weather updates, dynamic content changes, and seamless user interactions. It is also used to handle user inputs and API requests.</p>
        <p><strong>OpenWeatherMap API:</strong> We use the OpenWeatherMap API to fetch accurate, real-time weather data from trusted global sources, allowing us to display forecasts, weather conditions, and severe weather alerts.</p>
        <p><strong>Responsive Design:</strong> The website is designed to be fully responsive, meaning it automatically adjusts to different screen sizes, ensuring an optimal user experience on desktop, tablet, and mobile devices.</p>
        <p><strong>Web Hosting & Deployment:</strong> Southern Sky is hosted on a reliable web hosting platform, ensuring fast loading times and uptime for users accessing the site from all around the world.</p>

    <p>These technologies allow us to deliver a robust, user-friendly, and efficient weather platform that meets the needs of our users worldwide.</p>
`;

    // Help content including FAQs and Problem Submission Form
const helpContent = `
    <p>If you need assistance navigating Southern Sky, here are some common questions and solutions:</p>

    <p><strong>1. How do I use the weather features?</strong></p>
    <p>To check the weather for your location, simply enter your city or allow location permissions to view weather updates for your area. You can also add multiple cities to your list to track the weather in different locations.</p>

    <p><strong>2. How can I set a default city?</strong></p>
    <p>Under the “Cities” menu, select “Set as Default” for any city you prefer. This will ensure that the weather for this city is displayed by default when you visit the site.</p>

    <p><strong>3. Where do the weather data and forecasts come from?</strong></p>
    <p>We use the OpenWeatherMap API to provide accurate and real-time weather data. OpenWeatherMap is a trusted global data provider that gives us up-to-date forecasts and information.</p>

    <p><strong>4. How can I report incorrect weather data?</strong></p>
    <p>If you notice incorrect weather information, please contact our support team via the Contact Us section. We work hard to ensure accuracy and rely on OpenWeatherMap for the majority of our data.</p>

    <p><strong>5. How do I get severe weather alerts?</strong></p>
    <p>Severe weather alerts will appear in the "Severe Weather Alerts" section. You can also enable location-based alerts to receive notifications for your area during extreme weather events.</p>

    <!-- Problem Submission Form -->
    <h4>Submit Your Issue</h4>
    <p>If you are experiencing any issues or need help with the platform, please describe your problem below and submit it to us. We'll get back to you as soon as possible.</p>

    <form id="problemForm">
        <label for="userName">Your Name:</label><br>
        <input type="text" id="userName" name="userName" placeholder="Enter your name" required><br><br>

        <label for="userEmail">Your Email:</label><br>
        <input type="email" id="userEmail" name="userEmail" placeholder="Enter your email" required><br><br>

        <label for="userProblem">Describe Your Problem:</label><br>
        <textarea id="userProblem" name="userProblem" placeholder="Describe the problem you're facing" rows="4" required></textarea><br><br>

        <button type="submit">Submit</button>
    </form>

    <p>Your issue will be reviewed, and we will respond to you as soon as possible. Thank you for your patience!</p>
`;

    // Contact Us content 
const contactContent = `
    <h3>Contact Us</h3>
    <p>If you have any questions, feedback, or inquiries, feel free to reach out to us through the following options:</p>
    
    <!-- WhatsApp Link -->
    <p><strong>Message Mr. Mukuka on WhatsApp:</strong> <a href="https://wa.me/message/EOAD4Y3FKY7OJ1" target="_blank">Click here to chat</a></p>

    <!-- Email -->
    <p><strong>Email:</strong> <a href="mailto:mukukahenry3@gmail.com">mukukahenry3@gmail.com</a></p>

    <!-- Phone Numbers -->
    <p><strong>Contact Numbers:</strong></p>
    <ul>
<p><strong></strong> <a href="call:+260965777362">+260965777362</a></p>
<p><strong></strong> <a href="call:+260979911690">+260979911690</a></p>
<p><strong></strong> <a href="call:+260951277012">+260951277012</a></p>

</ul>

    <!-- Social Media Links -->
    <h4>Follow Us on Social Media</h4>
    <p>Stay connected and updated by following us on social media:</p>
    <ul>
        <p><strong>Facebook:</strong> <a href="https://www.facebook.com/yourpage" target="_blank">Follow us on Facebook</a></p>
        <p><strong>Twitter:</strong> <a href="https://twitter.com/yourprofile" target="_blank">Follow us on Twitter</a></p>
        <p><strong>Instagram:</strong> <a href="https://instagram.com/yourprofile" target="_blank">Follow us on Instagram</a></p>
    </ul>
    
    <p>We look forward to hearing from you!</p>
`;

    // Function to show modal with the respective content
    function showInfo(type) {
        if (type === 'about') {
            infoText.innerHTML = aboutContent; // Inject About content into the modal
        } else if (type === 'help') {
            infoText.innerHTML = helpContent; // Inject Help content into the modal
        } else if (type === 'contact') {
            infoText.innerHTML = contactContent; // Inject Contact Us content into the modal
        } else {
            infoText.textContent = 'Content not available.';
        }
        infoModal.classList.add("show");
    }

    // Event Listeners for buttons
    aboutBtn.addEventListener("click", () => showInfo("about"));
    helpBtn.addEventListener("click", () => showInfo("help"));
    contactBtn.addEventListener("click", () => showInfo("contact"));

    // Close modal when clicking on close button or outside the content
    closeModal.addEventListener("click", () => infoModal.classList.remove("show"));
    window.addEventListener("click", (event) => {
        if (event.target === infoModal) {
            infoModal.classList.remove("show");
        }
    });

// Handle form submission (example using a basic alert or custom logic)
document.getElementById('problemForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userProblem = document.getElementById('userProblem').value;

    // Example: You can send the data to a server or email service here
    alert(`Problem Submitted:\nName: ${userName}\nEmail: ${userEmail}\nProblem: ${userProblem}`);

    // Clear form fields after submission
    document.getElementById('problemForm').reset();
});



