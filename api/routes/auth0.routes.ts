import { Router } from "express";
import { Auth0HttpHandler } from "../handlers/auth0.handler";
import { wrapAsync } from "../utils/wrapAsync";

const router = Router();
const handler = new Auth0HttpHandler();

router.post("/login", wrapAsync(handler.loginWithEmailPassword.bind(handler)));
router.get("/users/exists", handler.exists);

export default router;