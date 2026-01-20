import axios from "axios";
import dotenv from "dotenv";

import { getWeatherData } from "../services/weatherService.js";
import { getMarketPrice } from "../services/marketService.js";

dotenv.config();

export async function recommendCrop(req, res) {
  try {
    let { N, P, K, ph, lat, lon, ...otherInputs } = req.body;

    // Default values
    let finalTemperature = parseFloat(otherInputs.temperature) || 25.0;
    let finalHumidity = parseFloat(otherInputs.humidity) || 50.0;
    let finalRainfall = parseFloat(otherInputs.rainfall) || 100.0;
    let weatherSource = "Manual Input";

    // Fetch live weather if coordinates exist
    if (lat && lon) {
      const weather = await getWeatherData(lat, lon);

      if (weather) {
        finalTemperature = weather.temperature;
        finalHumidity = weather.humidity;
        finalRainfall = weather.rainfall;
        weatherSource = `OpenWeatherMap (${weather.location})`;
      }
    }

    // Payload for Python ML service
    const aiPayload = {
      nitrogen: parseFloat(N),
      phosphorous: parseFloat(P),
      potassium: parseFloat(K),
      ph: parseFloat(ph),
      temperature: finalTemperature,
      humidity: finalHumidity,
      rainfall: finalRainfall
    };

    // Call Python ML server
    const mlResponse = await axios.post(
      process.env.ML_SERVER_URL || "http://localhost:8000/predict",
      aiPayload
    );

    const { recommended_crop, top_3_crops } = mlResponse.data;

    const estimatedPrice = getMarketPrice(recommended_crop);

    res.json({
      success: true,
      prediction: recommended_crop,
      top_alternatives: top_3_crops,
      market_price: estimatedPrice,
      currency: "INR/Quintal",
      weather_used: {
        source: weatherSource,
        temp: finalTemperature,
        humid: finalHumidity,
        rain: finalRainfall
      }
    });

  } catch (err) {
    console.error("Error in recommendation flow:", err.message);
    res.status(500).json({ error: "Failed to process crop recommendation" });
  }
}
