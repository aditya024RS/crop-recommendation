const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

// Import your Express app (adjust path if needed)
const app = require('../server'); 

describe('Crop Recommendation API', () => {
  it('should return recommended crop and top 3 crops for valid input', async () => {
    const res = await request(app)
      .post('/api/crop/recommend')   // your backend route
      .send({
        nitrogen: 90,
        phosphorous: 42,
        potassium: 43,
        temperature: 20.8,
        humidity: 82,
        ph: 6.5,
        rainfall: 202
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('recommended_crop');
    expect(res.body).to.have.property('top_3_crops');
    expect(res.body.top_3_crops).to.be.an('array');
  });

  it('should return 400 for missing input', async () => {
    const res = await request(app)
      .post('/api/crop/recommend')
      .send({}); // empty payload

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
