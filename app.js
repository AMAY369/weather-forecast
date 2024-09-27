const apiKey = 'a548e836e82c42b0a1135406242609';
const searchButton = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const currentLocation = document.getElementById("current-location-btn");
const currentWeather = document.querySelector('.current-weather');
const extendedForecast = document.querySelector('.extended-forecast');
const weatherData = document.querySelector('.right');

searchButton.addEventListener('click',()=>{
  
  weatherData.classList.remove('sm:hidden')
  extendedForecast.innerHTML = '';
  const city = cityInput.value.trim();
  if(city){
    fetchWeatherData(city);
    fetchExtendedForecast(city);
    cityInput.value = '';
  }
})

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

async function fetchExtendedForecast(city){
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
    if(!response.ok){
      throw new Error("Forecast data not found");
    }
    const data = await response.json();
    displayExtendedForecast(data);

  }
  catch (error) {
    throw new Error(error.message);
  }

}

function displayCurrentWeather(data){
  const {location, current} = data;
  const {name, region, country} = location;
  const {temp_c, humidity, wind_kph, condition} = current;

  html = `
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
}

function displayExtendedForecast(data){
  // const forecastContainer = document.createElement('div');
  // forecastContainer.classList.add('mt-5');

  data.forecast.forecastday.forEach(forecast => {
    const {date, day} = forecast;
    const {avgtemp_c, avghumidity, maxwind_kph, condition} = day;
    const html = `
      <div class="bg-gray-200 p-3 rounded-md shadow-md mb-2">
      <p class="font-semibold">${date}</p>
      <img src="${condition.icon}" alt="${condition.text}">
        <p>Temp: ${avgtemp_c}°C</p>
        <p>Humidity: ${avghumidity}%</p>
        <p>Wind: ${maxwind_kph} km/h</p>
      </div>
    `
    extendedForecast.innerHTML += html;
  });

  // extendedForecast.appendChild(forecastContainer);

}