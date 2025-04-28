import { Request, Response } from "express";
import { Auth0Service } from "../services/auth0.service";
import { setAuthCookies } from "../utils/cookieManager";

export class AuthController {
  private auth0Service: Auth0Service;

  constructor(auth0Service: Auth0Service) {
    this.auth0Service = auth0Service;
  }

  public async loginWithEmailPassword(req: Request, res: Response) {
    const { email, password } = req.body;
  
    if (!email || !password)
      return res.status(400).json({ message: "Email y password son requeridos" });
  
    try {
      const tokens = await this.auth0Service.loginWithEmailPassword(email, password);
  
      setAuthCookies(res, tokens);
  
      return res.status(200).json({ message: "Login correcto" });
    } catch (error: any) {
      console.error("Error login:", error.response?.data || error.message);
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
  }

  public async exists(req: Request, res: Response): Promise<Response> {
    const email = req.query.email;
  
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email query param required" });
    }
  
    try {
      const exists = await this.auth0Service.userExists(email);
      return res.status(200).json({ exists });
    } catch (error: any) {
      console.error("Error checking if user exists:", error.message);
      return res.status(500).json({ error: "Error verifying email" });
    }
  }
  
}