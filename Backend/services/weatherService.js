import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ✅ CENTRAL MOCK WEATHER (single source of truth)
const MOCK_WEATHER = {
  temperature: 26,
  humidity: 70,
  rainfall: 120,
  location: "Mock-Weather"
};

export async function getWeatherData(lat, lon) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    // 🔐 If API key missing → use mock
    if (!apiKey) {
      console.warn("⚠ WEATHER_API_KEY missing, using mock weather");
      return MOCK_WEATHER;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);

    // ❌ Unexpected response → fallback
    if (!response?.data?.main) {
      console.warn("⚠ Invalid weather response, using mock weather");
      return MOCK_WEATHER;
    }

    const data = response.data;

    let rainfallValue = 0;
    if (data.rain) {
      rainfallValue = data.rain["1h"] || data.rain["3h"] || 0;
    }

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: rainfallValue,
      location: data.name || "Unknown"
    };

  } catch (error) {
    console.error("Weather API Error:", error.message);
    console.warn("⚠ Falling back to mock weather");
    return MOCK_WEATHER;
  }
}
