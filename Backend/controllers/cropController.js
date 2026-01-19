const axios = require("axios");

exports.recommendCrop = async (req, res) => {
  const { nitrogen, phosphorous, potassium, temperature, humidity, ph, rainfall } = req.body;

  // Validate input before calling ML service
  if (
    nitrogen === undefined ||
    phosphorous === undefined ||
    potassium === undefined ||
    temperature === undefined ||
    humidity === undefined ||
    ph === undefined ||
    rainfall === undefined
  ) {
    return res.status(400).json({ error: "Missing input data" });
  }

  try {
    const response = await axios.post(
      "http://localhost:8000/predict",
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "ML service error" });
  }
};
