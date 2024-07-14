async function getWeather() {
  // Get the value from the search input field
  let searchInput = document.getElementById('search').value;

  // Get the weather data section element
  const weatherDataSection = document.getElementById("weather-data");

  // Ensure weather data section is visible
  weatherDataSection.style.display = "block";

  // Replace with your actual OpenWeatherMap API key
  const apiKey = "YOUR_API_KEY";

  // Validate if search input is empty
  if (searchInput == "") {
    // Display a message in the weather data section for empty input
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please enter a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  // Function to fetch latitude and longitude coordinates via Geocoding API
  async function getLonAndLat() {
    const countryCode = 1; // Replace with the actual country code you want to use
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

    // Fetch geolocation data
    const response = await fetch(geocodeURL);

    // Check if response is okay
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    
    // Parse response JSON data
    const data = await response.json();

    // Handle cases where no data is returned
    if (data.length == 0) {
      console.log("Something went wrong here.¯\\_(ツ)_/¯");
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return;
    } else {
      return data[0]; // Return the first item in the data array
    }
  }

  
  // Function to fetch weather data using latitude and longitude
  async function getWeatherData(lon, lat) {
    // Construct the weather API URL
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch weather data
    const response = await fetch(weatherURL);

    // Parse the weather data from the API response
    const data = await response.json();

    // Display the weather data in the weatherDataSection element
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" 
           alt="${data.weather[0].description}" 
           width="100" 
           style="border: 2px solid black;">
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }

  // Clear the search input field after submitting the search
  document.getElementById("search").value = "";

  // Get the geolocation data and then fetch the weather data
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);
}
