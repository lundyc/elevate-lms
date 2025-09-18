import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DATABASE_URL,
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  },
  stripe: {
    secret: process.env.STRIPE_SECRET_KEY,
    public: process.env.STRIPE_PUBLIC_KEY,
  },
  footballData: {
    apiKey: process.env.FOOTBALL_DATA_API_KEY,
  },
  email: {
    from: process.env.EMAIL_FROM,
  },
  testMode: process.env.PAYMENTS_TEST_MODE === "true",
};
