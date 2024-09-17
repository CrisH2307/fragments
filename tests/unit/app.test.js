// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('404 Handler', () => {
  test('Should return 404 for non-existent routes', async () => {
    const res = await request(app).get('/non');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
