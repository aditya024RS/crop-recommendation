const request = require("supertest");
const chai = require("chai");
const sinon = require("sinon");
const axios = require("axios");

const app = require("../server");
const weatherService = require("../services/weatherService");

const expect = chai.expect;

describe("🌾 Crop Recommendation API", () => {

  beforeEach(() => {
    // ✅ Mock Python ML service
    sinon.stub(axios, "post").resolves({
      data: {
        recommended_crop: "Rice",
        top_3_crops: ["Wheat", "Maize", "Barley"]
      }
    });

    // ✅ CORRECT way to mock weather service
    sinon.stub(weatherService, "getWeatherData").resolves({
      temperature: 26,
      humidity: 70,
      rainfall: 120,
      location: "Delhi"
    });
  });

  afterEach(() => {
    sinon.restore(); // IMPORTANT
  });

  it("✅ should return crop prediction using manual inputs", async () => {
    const res = await request(app)
      .post("/api/crop/recommend")
      .send({
        N: 90,
        P: 42,
        K: 43,
        ph: 6.5,
        temperature: 25,
        humidity: 60,
        rainfall: 100
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.prediction).to.equal("Rice");
    expect(res.body.top_alternatives).to.be.an("array");
    expect(res.body.market_price).to.exist;

    expect(res.body.weather_used.source).to.equal("Manual Input");
    expect(res.body.weather_used.temp).to.equal(25);
    expect(res.body.weather_used.humid).to.equal(60);
    expect(res.body.weather_used.rain).to.equal(100);
  });

  it("✅ should auto-fetch weather when lat/lon are provided", async () => {
    const res = await request(app)
      .post("/api/crop/recommend")
      .send({
        N: 90,
        P: 42,
        K: 43,
        ph: 6.5,
        lat: 28.6,
        lon: 77.2
      });

    expect(res.status).to.equal(200);
    expect(res.body.weather_used.source).to.include("OpenWeatherMap");
    expect(res.body.weather_used.temp).to.equal(26);
    expect(res.body.weather_used.humid).to.equal(70);
    expect(res.body.weather_used.rain).to.equal(120);
  });

  it("❌ should return 500 if Python ML service fails", async () => {
    axios.post.restore();
    sinon.stub(axios, "post").rejects(new Error("ML server down"));

    const res = await request(app)
      .post("/api/crop/recommend")
      .send({
        N: 90,
        P: 42,
        K: 43,
        ph: 6.5
      });

    expect(res.status).to.equal(500);
    expect(res.body.error).to.exist;
  });
});
