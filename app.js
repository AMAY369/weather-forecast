const apiKey = 'a548e836e82c42b0a1135406242609';
const searchButton = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const currentLocation = document.getElementById("current-location-btn");
const currentWeather = document.querySelector('.current-weather');
const extendedForecast = document.querySelector('.extended-forecast');
const weatherData = document.querySelector('.right');
const recentCitiesContainer = document.getElementById('recent-cities-container');
const recentCitiesDropdown = document.getElementById('recent-cities');

loadRecentCities();

// event listener for search button 
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    fetchExtendedForecast(city);
    saveCityToLocalStorage(city);
    cityInput.value = '';
  }
  else{
    alert("Enter City Name")
  }
});

// event listener for current location button 
currentLocation.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoordinates(latitude, longitude);
    }, error => {
      console.error('Error retrieving location:', error);
    });
  } else {
      alert('Geolocation is not supported by this browser.');
  }
});

// event listner for recently searched cities 
recentCitiesDropdown.addEventListener('change', () => {
  const selectedCity = recentCitiesDropdown.value;
  if (selectedCity) {
    fetchWeatherData(selectedCity);
    fetchExtendedForecast(selectedCity);
  }
});


// function for fetching weather data by coordinates 
async function getWeatherByCoordinates(lat, lon) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayCurrentWeather(data);
    fetchExtendedForecast(data.location.name);
  } catch (error) {
      alert(error.message);
  }
}


// function for fetching data by city name
async function fetchWeatherData(city) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayCurrentWeather(data);
  } catch (error) {
    alert(error.message);
  }
}


// function for fetching extended weather forecast data 
async function fetchExtendedForecast(city) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
    if (!response.ok) {
      throw new Error("Forecast data not found");
    }
    const data = await response.json();
    displayExtendedForecast(data);
  } 
  catch (error) {
    console.error(error.message);
  }
}


// function for displaying current weather 
function displayCurrentWeather(data) {
  const { location, current } = data;
  const { name, region, country } = location;
  const { temp_c, humidity, wind_kph, condition } = current;

  const html = `
    <div class="flex justify-between">
      <div>
        <h2 class="text-2xl font-semibold">${name}, ${region}, ${country}</h2>
        <p>Temperature: ${temp_c}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind_kph} km/h</p>
      </div>
      <div class="flex flex-col justify-between">
        <p><span class="font-bold">${condition.text}</span></p>
        <img src="${condition.icon}" alt="${condition.text}">
      </div>
    </div>
  `;
  currentWeather.innerHTML = html;
  weatherData.classList.remove('hidden');
  weatherData.classList.remove('md:hidden');
}


// function for displaying extended weather forecast 
function displayExtendedForecast(data) {
  extendedForecast.innerHTML = '';
  data.forecast.forecastday.forEach(forecast => {
    const { date, day } = forecast;
    const { avgtemp_c, avghumidity, maxwind_kph, condition } = day;
    const html = `
      <div class="bg-white bg-opacity-70 text-black p-3 rounded-md shadow-md mb-2">
        <p class="font-semibold">${date}</p>
        <img src="${condition.icon}" alt="${condition.text}">
        <p>Temp: ${avgtemp_c}°C</p>
        <p>Wind: ${maxwind_kph} km/h</p>
        <p>Humidity: ${avghumidity}%</p>
      </div>
    `;
    extendedForecast.innerHTML += html;
  });
}


// function for saving city name in localStorage 
function saveCityToLocalStorage(city) {
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    loadRecentCities();
  }
}


// function for loading city name for recent searched city dropdown 
function loadRecentCities() {
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (recentCities.length > 0) {
    recentCitiesContainer.classList.remove('hidden');
    recentCitiesDropdown.innerHTML = recentCities.map(city => `<option value="${city}">${city}</option>`).join('');
  }
}
