// src/auth/index.test.js

const mockCognito = jest.mock('../../src/auth/cognito', () => ({}), { virtual: true });
const mockBasicAuth = jest.mock('../../src/auth/basic-auth', () => ({}), { virtual: true });

// Clear env variables before each test
beforeEach(() => {
  jest.resetModules(); // Clear previous imports
  delete process.env.AWS_COGNITO_POOL_ID;
  delete process.env.AWS_COGNITO_CLIENT_ID;
  delete process.env.HTPASSWD_FILE;
  delete process.env.NODE_ENV;
});

test('throws an error when no authentication configuration is available', () => {
  // No environment variables are set

  expect(() => require('../../src/auth/index')).toThrowError(
    'missing env vars: no authorization configuration found'
  );
});
