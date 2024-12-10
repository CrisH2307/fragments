// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));
  //test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(500));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // Test retrieval of non-existent fragment
  test('returns 404 for non-existent fragment', async () => {
    const res = await request(app)
      .get('/v1/fragments/c07bf87b-bfdd-4cb3-8b71-b21c77e73a000')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});
describe('POST /v1/fragments', () => {
  // Test for unauthenticated requests
  test('unauthenticated requests are denied', () =>
    request(app).post('/v1/fragments').send('This is a fragment').expect(401));

  // Test for incorrect credentials
  test('incorrect credentials are denied', () =>
    request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .send('This is a fragment')
      .expect(401));

  // Test for authenticated users creating a plain text fragment
  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment')
      .set('Content-Type', 'text/plain');

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('type', 'text/plain');
    expect(res.body.fragment.size).toBe('This is a fragment'.length);
    expect(res.body.fragment.ownerId).toBe(
      '11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a'
    );
  });

  // Test for Location header in POST response
  test('POST response includes a Location header with a full URL to GET the created fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('This is another fragment')
      .set('Content-Type', 'text/plain');

    expect(res.statusCode).toBe(201);
    expect(res.headers).toHaveProperty('location');
    const fragmentId = res.body.fragment.id; // Assuming id is returned in the body
    expect(res.headers.location).toBe(`http://localhost:8080/v1/fragments/${fragmentId}`); // Adjust the base URL if necessary
  });

  // Test for creating a fragment with an unsupported type
  test('trying to create a fragment with an unsupported type returns an error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('This is an unsupported fragment')
      .set('Content-Type', 'application/xml'); // Assuming this is unsupported

    expect(res.statusCode).toBe(415); // 415 Unsupported Media Type
  });

  test('check if expand == 1 and is Id in Idlist', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });
});

describe('Checking fragments/:id/info', () => {
  test('Check get success id', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(200);
  });

  test('Check get failed due to not valid id', async () => {
    const res = await request(app)
      .get(`/v1/fragments/999/info`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(404);
  });
});

// Valid Conversion

describe('get valid convert', () => {
  test('Check validConversion() pass', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res.status).toBe(200);
  });

  test('Check validConversions() fail', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.png`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('new fragment');
    expect(res.status).toBe(415);
  });

  test('Check validConversions() text no ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(200);
  });

  test('Check validConversion() markdown with ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(200);
  });

  test('Check validConversions() markdown no ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(200);
  });

  test('Check validConversion() html having ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(200);
  });

  test('Check validConversion() markdown to html having ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(200);
  });

  test('Invalid ID', async () => {
    const res = await request(app)
      .get(`/v1/fragments/1234`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(404);
  });

  test('Check validConversion() test png', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.png`)
      .auth('user1@email.com', 'password1')
      .send('new fragment');
    expect(res.status).toBe(200);
  });

  test('trying to convert unsupported formats returns 415', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.png`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(415);
  });

  test('missing fragment returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid-id')
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(404);
  });

  // .html conversion test
  test("authenticated users are able to do '.html' conversions for supported type", async () => {
    // POST a html fragment with text/html content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('This is a HTML fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // POST a markdwon fragment with text/markdown content type
    const postRes2 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a markdown fragment');
    expect(postRes2.statusCode).toBe(201);
    const id2 = JSON.parse(postRes2.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert html fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.html')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('text/html');

    // Try to convert markdown fragment using Get v1/fragment/:id:.ext
    const getRes2 = await request(app)
      .get('/v1/fragments/' + id2 + '.html')
      .auth('user1@email.com', 'password1');
    expect(getRes2.statusCode).toBe(200);
    expect(getRes2.header['content-type']).toBe('text/html; charset=utf-8');
  });

  // .md conversion test
  test("authenticated users are able to do '.md' conversions for supported type", async () => {
    // POST a markdown fragment with text/html content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a markdown fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert markdown fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.md')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('text/markdown');
  });

  // .JSON conversion test
  test("authenticated users are able to do '.json' conversions for supported type", async () => {
    // POST a JSON fragment with application/json content type
    const postData1 = { name: 'JSON' };
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(postData1);
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert JSON fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.json')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.header['content-type']).toBe('application/json');
  });

  // Cannot convert unsupported type to .html
  test("authenticated users are unableable to do '.html' conversions for unsupported type", async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert html fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.html')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .md
  test("authenticated users are unableable to do '.md' conversions for unsupported type", async () => {
    // POST a plain fragment with image/png content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert md fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.md')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .json
  test("authenticated users are unableable to do '.json' conversions for unsupported type", async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert json fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.json')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .csv
  test("authenticated users are unableable to do '.csv' conversions for unsupported type", async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert csv fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.csv')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  test('return 415 for unsupported content type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/random')
      .send('This is a fragment');
    expect(postRes.statusCode).toBe(415);
  });
});
