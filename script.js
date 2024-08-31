const weatherApiKey = '72dd987cf2037f2084b6ffb390f93629';
const savedCitiesKey = 'savedCities';

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeatherData(city);
        saveCity(city);
    }
}

async function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                displayWeather(data);
                sendWeatherDetails(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                displayInstructions('Unable to fetch weather data. Please try again.');
            }
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            sendWeatherDetails(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            displayInstructions('Unable to fetch weather data. Please try again.');
        });
}

function displayWeather(data) {
    const weatherDetails = document.getElementById('weatherDetails');
    const { name, main, weather, wind } = data;

    weatherDetails.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Condition: ${weather[0].description}</p>
    `;
}

function sendWeatherDetails(data) {
    const weatherCondition = data.weather[0].description.toLowerCase();
    const advice = getFashionAdvice(weatherCondition);
    displayInstructions(advice);
}

function getFashionAdvice(weatherCondition) {
    let advice = '';
    if (weatherCondition.includes('rain')) {
        advice = 'Carry an umbrella and wear waterproof clothing.';
        addShoppingLinks('rain');
    } else if (weatherCondition.includes('sunny')) {
        advice = 'Wear sunglasses and light, breathable clothing.';
        addShoppingLinks('sunny');
    } else if (weatherCondition.includes('cloudy')) {
        advice = 'A light jacket might be needed.';
        addShoppingLinks('cloudy');
    } else if (weatherCondition.includes('snow')) {
        advice = 'Wear warm clothes and a heavy coat.';
        addShoppingLinks('snow');
    } else if (weatherCondition.includes('fog')) {
        advice = 'Drive safely and wear layers to stay warm.';
        addShoppingLinks('fog');
    } else if (weatherCondition.includes('mist')) {
        advice = 'Wear layers and be cautious while driving.';
        addShoppingLinks('mist');
    } else if (weatherCondition.includes('thunderstorm')) {
        advice = 'Stay indoors and avoid using electrical appliances.';
        addShoppingLinks('thunderstorm');
    } else if (weatherCondition.includes('haze')) {
        advice = 'Wear a mask and avoid outdoor activities if possible.';
        addShoppingLinks('haze');
    } else {
        advice = 'Check the weather and dress accordingly.';
    }
    return advice;
}

function addShoppingLinks(condition) {
    const fashionAdvice = document.getElementById('fashionAdvice');
    let links = '';
    if (condition === 'rain') {
        links = `
            <p><a href="https://www.amazon.com/s?k=rain+coat" target="_blank">Shop Rain Coats on Amazon</a></p>
            <p><a href="https://www.myntra.com/rain-coat" target="_blank">Shop Rain Coats on Myntra</a></p>
        `;
    } else if (condition === 'sunny') {
        links = `
            <p><a href="https://www.flipkart.com/sunglasses" target="_blank">Shop Sunglasses on Flipkart</a></p>
            <p><a href="https://www.ajio.com/sunglasses" target="_blank">Shop Sunglasses on Ajio</a></p>
        `;
    } else if (condition === 'cloudy') {
        links = `
            <p><a href="https://www.amazon.com/s?k=light+jacket" target="_blank">Shop Light Jackets on Amazon</a></p>
            <p><a href="https://www.myntra.com/light-jacket" target="_blank">Shop Light Jackets on Myntra</a></p>
        `;
    } else if (condition === 'snow') {
        links = `
            <p><a href="https://www.amazon.com/s?k=heavy+coat" target="_blank">Shop Heavy Coats on Amazon</a></p>
            <p><a href="https://www.myntra.com/heavy-coat" target="_blank">Shop Heavy Coats on Myntra</a></p>
        `;
    } else if (condition === 'fog') {
        links = `
            <p><a href="https://www.amazon.com/s?k=warm+layers" target="_blank">Shop Warm Layers on Amazon</a></p>
            <p><a href="https://www.myntra.com/layered-clothing" target="_blank">Shop Layered Clothing on Myntra</a></p>
        `;
    } else if (condition === 'mist') {
        links = `
            <p><a href="https://www.amazon.com/s?k=warm+clothing" target="_blank">Shop Warm Clothing on Amazon</a></p>
            <p><a href="https://www.myntra.com/winter-wear" target="_blank">Shop Winter Wear on Myntra</a></p>
        `;
    } else if (condition === 'thunderstorm') {
        links = `
            <p><a href="https://www.amazon.com/s?k=indoor+games" target="_blank">Shop Indoor Games on Amazon</a></p>
            <p><a href="https://www.flipkart.com/indoor-games" target="_blank">Shop Indoor Games on Flipkart</a></p>
        `;
    } else if (condition === 'haze') {
        links = `
            <p><a href="https://www.amazon.com/s?k=face+mask" target="_blank">Shop Face Masks on Amazon</a></p>
            <p><a href="https://www.myntra.com/face-masks" target="_blank">Shop Face Masks on Myntra</a></p>
        `;
    }
    fashionAdvice.innerHTML += links;
}

function displayInstructions(instructions) {
    const fashionAdvice = document.getElementById('fashionAdvice');
    fashionAdvice.innerHTML = `<h3>Instructions:</h3><p>${instructions}</p>`;
}

function saveCity(city) {
    let savedCities = JSON.parse(localStorage.getItem(savedCitiesKey)) || [];
    if (!savedCities.includes(city)) {
        savedCities.push(city);
        localStorage.setItem(savedCitiesKey, JSON.stringify(savedCities));
        displaySavedCities();
    }
}

function deleteCity(city) {
    let savedCities = JSON.parse(localStorage.getItem(savedCitiesKey)) || [];
    savedCities = savedCities.filter(savedCity => savedCity !== city);
    localStorage.setItem(savedCitiesKey, JSON.stringify(savedCities));
    displaySavedCities();
}

function displaySavedCities() {
    const savedCities = JSON.parse(localStorage.getItem(savedCitiesKey)) || [];
    const savedCitiesList = document.getElementById('savedCities');
    savedCitiesList.innerHTML = '';

    savedCities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteCity(city);

        li.appendChild(deleteButton);
        savedCitiesList.appendChild(li);

        li.addEventListener('click', () => {
            fetchWeatherData(city);
        });
    });
}

window.onload = function() {
    displaySavedCities();
}


