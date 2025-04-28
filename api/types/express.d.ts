import { CustomAuthClaims } from "./auth0";

declare global {
  namespace Express {
    interface Request {
      auth?: CustomAuthClaims;
    }
  }
}