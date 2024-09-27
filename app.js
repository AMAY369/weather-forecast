const apiKey = 'a548e836e82c42b0a1135406242609';

async function fetchWeatherData(city) {
  try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      console.log(data);
      
  } catch (error) {
      alert(error.message);
  }
}

fetchWeatherData('Shimla')