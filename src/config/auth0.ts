import dotenv from "dotenv";
dotenv.config();

export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  audience: process.env.AUTH0_AUDIENCE!,
  clientIdFront: process.env.AUTH0_CLIENT_ID_FRONT!,
  clientSecretFront: process.env.AUTH0_CLIENT_SECRET_FRONT!,
  audienceManagement: process.env.AUTH0_AUDIENCE_MANAGEMENT!,
  connectionId: process.env.AUTH0_CONNECTIONID!
};