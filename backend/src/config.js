const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0Audience: process.env.AUTH0_AUDIENCE,
  auth0ClientId: process.env.AUTH0_CLIENT_ID,
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  footballDataApiKey: process.env.FOOTBALL_DATA_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  testMode: process.env.PAYMENTS_TEST_MODE === 'true'
};
