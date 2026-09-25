const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');

describe('Application HTTP endpoints', () => {
  it('returns the original greeting', async () => {
    await request(app)
      .get('/')
      .expect('Content-Type', /text\/plain/)
      .expect(200, 'Hello World!');
  });

  it('returns a healthy status', async () => {
    await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200, { status: 'ok' });
  });

  it('returns 404 for an unknown route', async () => {
    await request(app)
      .get('/missing-route')
      .expect(404);
  });

  it('does not advertise the Express framework', async () => {
    const response = await request(app).get('/').expect(200);

    assert.equal(response.headers['x-powered-by'], undefined);
  });
});