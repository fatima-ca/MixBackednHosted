import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { auth0Config } from "../config/auth0";

export const jwtCheckFromCookie = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Config.domain}/.well-known/jwks.json`,
  }),
  algorithms: ["RS256"],
  audience: [
    `https://${auth0Config.domain}/api/v2/`,
    `https://${auth0Config.domain}/userinfo`,
  ],
  issuer: `https://${auth0Config.domain}/`,
  credentialsRequired: false,
  getToken: (req) => {
    return req.cookies?.access_token || null;
  },
});