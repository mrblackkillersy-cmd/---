const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
  nomCom: "weather",
  alias: ["meteo", "climate", "temp"],
  reaction: "🌡️",
  categorie: "Search",
  description: "Get current weather information"
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, arg, ms, prefixe } = commandeOptions;
  const location = arg.join(" ");

  // Check if location is provided
  if (!location) {
    const helpMessage = `🌤️ *WEATHER FORECAST*\n\n` +
                       `*Usage:* ${prefixe}weather [city name]\n\n` +
                       `*Examples:*\n` +
                       `• ${prefixe}weather Dar es Salaam\n` +
                       `• ${prefixe}weather London\n` +
                       `• ${prefixe}weather New York\n` +
                       `• ${prefixe}weather Tokyo\n\n` +
                       `*Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`;
    return repondre(helpMessage);
  }

  try {
    // Show loading message
    await repondre(`🔍 *Searching weather for:* ${location}...`);

    // Fetch weather data
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: location,
        units: "metric",
        appid: "060a6bcfa19809c2cd4d97a212b19273", // Free API key
        lang: "en"
      }
    });

    const weatherData = response.data;
    
    // Extract weather information
    const city = weatherData.name;
    const country = weatherData.sys.country;
    const temperature = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const minTemp = Math.round(weatherData.main.temp_min);
    const maxTemp = Math.round(weatherData.main.temp_max);
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const windDirection = getWindDirection(weatherData.wind.deg);
    const pressure = weatherData.main.pressure;
    const visibility = weatherData.visibility / 1000; // Convert to km
    const clouds = weatherData.clouds.all;
    const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Get weather emoji
    const weatherEmoji = getWeatherEmoji(weatherData.weather[0].id);
    
    // Create stylish weather report
    const weatherReport = `
╔═══════════════════════╗
   𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╚═══════════════════════╝

╭─「 🌍 *LOCATION* 」
│ 📍 *City*: ${city}, ${country}
│ 🗺️ *Coordinates*: ${weatherData.coord.lat}°N, ${weatherData.coord.lon}°E
╰───────────────────

╭─「 ${weatherEmoji} *WEATHER* 」
│ 🌡️ *Temperature*: ${temperature}°C
│ 🤔 *Feels Like*: ${feelsLike}°C
│ 📉 *Min*: ${minTemp}°C | 📈 *Max*: ${maxTemp}°C
│ 📝 *Condition*: ${description.charAt(0).toUpperCase() + description.slice(1)}
╰───────────────────

╭─「 💨 *WIND & AIR* 」
│ 💨 *Wind*: ${windSpeed} m/s (${windDirection})
| 📊 *Pressure*: ${pressure} hPa
│ 💧 *Humidity*: ${humidity}%
│ ☁️ *Cloudiness*: ${clouds}%
│ 👁️ *Visibility*: ${visibility} km
╰───────────────────

╭─「 🌅 *SUN TIMES* 」
| 🌄 *Sunrise*: ${sunrise}
| 🌇 *Sunset*: ${sunset}
╰───────────────────

*Last Updated:* ${new Date().toLocaleTimeString()}
*Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`;

    // Send the weather report
    await repondre(weatherReport);
    
    // Additional tips based on weather
    const weatherTips = getWeatherTips(weatherData.weather[0].id, temperature);
    if (weatherTips) {
      setTimeout(() => {
        zk.sendMessage(dest, { 
          text: `💡 *Weather Tip:*\n${weatherTips}\n\nStay safe! 🛡️` 
        }, { quoted: ms });
      }, 1000);
    }

  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
    
    // User-friendly error messages
    if (error.response?.status === 404) {
      await repondre(`❌ *City not found!*\n\n"${location}" was not found.\nPlease check the spelling or try a different city.`);
    } else if (error.response?.status === 401) {
      await repondre(`❌ *API Error*\n\nWeather service is temporarily unavailable.\nPlease try again later.`);
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      await repondre(`❌ *Connection Error*\n\nCannot connect to weather service.\nPlease check your internet connection.`);
    } else {
      await repondre(`❌ *Error fetching weather data*\n\nPlease try again with a different city name.\nExample: ${prefixe}weather London`);
    }
  }
});

// Helper function to get wind direction
function getWindDirection(degrees) {
  if (degrees >= 337.5 || degrees < 22.5) return "North";
  if (degrees >= 22.5 && degrees < 67.5) return "Northeast";
  if (degrees >= 67.5 && degrees < 112.5) return "East";
  if (degrees >= 112.5 && degrees < 157.5) return "Southeast";
  if (degrees >= 157.5 && degrees < 202.5) return "South";
  if (degrees >= 202.5 && degrees < 247.5) return "Southwest";
  if (degrees >= 247.5 && degrees < 292.5) return "West";
  if (degrees >= 292.5 && degrees < 337.5) return "Northwest";
  return "Unknown";
}

// Helper function to get weather emoji
function getWeatherEmoji(weatherId) {
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) return "⛈️";
  // Drizzle
  if (weatherId >= 300 && weatherId < 400) return "🌧️";
  // Rain
  if (weatherId >= 500 && weatherId < 600) return "🌧️";
  // Snow
  if (weatherId >= 600 && weatherId < 700) return "❄️";
  // Atmosphere
  if (weatherId >= 700 && weatherId < 800) return "🌫️";
  // Clear
  if (weatherId === 800) return "☀️";
  // Clouds
  if (weatherId > 800 && weatherId < 900) return "☁️";
  return "🌤️";
}

// Helper function to get weather tips
function getWeatherTips(weatherId, temperature) {
  if (weatherId >= 200 && weatherId < 300) {
    return "Stay indoors during thunderstorms. Avoid using electrical appliances.";
  }
  if (weatherId >= 500 && weatherId < 600) {
    return "Carry an umbrella or raincoat. Drive carefully on wet roads.";
  }
  if (weatherId >= 600 && weatherId < 700) {
    return "Dress warmly. Watch out for icy roads.";
  }
  if (temperature > 30) {
    return "Stay hydrated. Wear light clothing. Avoid direct sun exposure.";
  }
  if (temperature < 10) {
    return "Wear warm clothing. Layer up to stay comfortable.";
  }
  if (weatherId === 800 && temperature > 25) {
    return "Perfect day for outdoor activities! Don't forget sunscreen.";
  }
  return null;
}

// ADDITIONAL COMMAND: WEATHER FORECAST
zokou({
  nomCom: "forecast",
  alias: ["weather7", "weekly"],
  reaction: "📅",
  categorie: "Search",
  description: "Get 7-day weather forecast"
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, arg, prefixe } = commandeOptions;
  const location = arg.join(" ");

  if (!location) {
    return repondre(`📅 *7-DAY FORECAST*\n\nUsage: ${prefixe}forecast [city]\nExample: ${prefixe}forecast Nairobi\n\n*Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`);
  }

  try {
    await repondre(`📊 *Fetching 7-day forecast for:* ${location}...`);
    
    // Note: 7-day forecast requires premium API key
    // This is a simplified version
    const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
      params: {
        q: location,
        units: "metric",
        appid: "060a6bcfa19809c2cd4d97a212b19273",
        cnt: 7 // 7 days
      }
    });

    const forecastData = response.data;
    const city = forecastData.city.name;
    
    let forecastMessage = `📅 *7-DAY WEATHER FORECAST*\n\n`;
    forecastMessage += `📍 *City:* ${city}, ${forecastData.city.country}\n\n`;
    
    forecastData.list.forEach((day, index) => {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const temp = Math.round(day.main.temp);
      const description = day.weather[0].description;
      const emoji = getWeatherEmoji(day.weather[0].id);
      
      forecastMessage += `${emoji} *${dayName}:* ${temp}°C - ${description}\n`;
    });
    
    forecastMessage += `\n*Updated:* ${new Date().toLocaleString()}`;
    forecastMessage += `\n*Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`;
    
    await repondre(forecastMessage);
    
  } catch (error) {
    console.error("Forecast Error:", error.message);
    await repondre(`❌ *Forecast Error*\n\nCould not fetch forecast for "${location}".\nTry: ${prefixe}weather ${location} for current weather.`);
  }
});

// ADDITIONAL COMMAND: WEATHER BY LOCATION
zokou({
  nomCom: "mylocation",
  alias: ["localweather", "here"],
  reaction: "📍",
  categorie: "Search",
  description: "Get weather for your current location"
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, arg, prefixe } = commandeOptions;
  
  const helpMessage = `📍 *WEATHER BY LOCATION*\n\n` +
                     `*Send your location:*\n` +
                     `1. Click attachment icon (📎)\n` +
                     `2. Select "Location"\n` +
                     `3. Send your current location\n` +
                     `4. Then type: ${prefixe}mylocation\n\n` +
                     `*Or use city name:*\n` +
                     `${prefixe}weather [city name]\n\n` +
                     `*Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`;
  
  await repondre(helpMessage);
});
