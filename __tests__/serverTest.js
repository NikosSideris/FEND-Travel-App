const request = require('supertest');
// import { app }from '../src/server/server'
const app=require('../src/server/server');

describe('Server is running', () => {
  it('should return 200', async () => {
    const res = await request(app)
      .get('/')
      .send('../src/client/views.index.html')
    expect(res.statusCode).toEqual(200);
  })
})