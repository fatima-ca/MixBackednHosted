import { Request, Response } from "express";
import { Auth0Service } from "@/services/auth0.service";
import { UserDTO } from "@/types/db/user";
import { UserDbService } from "@/db/user";
import { EmailService } from "@/services/email.service";
import { AuthRequest } from "@/types/controller/auth0";
import { setAuthCookies, clearAuthCookies } from "@/utils/cookieManager";

export class UserController {
  constructor(
    private auth0Service: Auth0Service,
    private userDbService: UserDbService,
    private emailService: EmailService
  ) {}

  public async signup(req: Request, res: Response): Promise<Response> {
    const userData: UserDTO = req.body;
    const { Email, Password } = userData;
  
    const normalizedEmail = Email?.toLowerCase();
  
    if (!normalizedEmail || !Password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    try {
      const auth0User = await this.auth0Service.createUser(normalizedEmail, Password);
      await this.auth0Service.sendVerificationEmail(auth0User.user_id);
  
      await this.userDbService.createUser({
        ...userData,
        Email: normalizedEmail,
        email_verified: auth0User.email_verified,
      });
  
      const tokens = await this.auth0Service.loginWithEmailPassword(normalizedEmail, Password);
      setAuthCookies(res, tokens);
  
      await this.userDbService.insertVerificationEmail(normalizedEmail);
  
      return res.status(201).json({ message: "User created and logged in" });
    } catch (error: any) {
      console.error("Error creating Auth0 user:", error.response?.data || error.message);
      return res.status(500).json({ error: "Error creating user" });
    }
  }
  

  public async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    const sub = req.auth?.sub;
    if (!sub) return res.status(400).json({ error: "Token without sub" });

    try {
      const { email, email_verified } = await this.auth0Service.getUserBySub(sub);

      await this.userDbService.updateEmailVerified(email, email_verified);

      const user = await this.userDbService.getUserByEmail(email);
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json({
        ...user, 
        email_verified,
      });
    } catch (err: any) {
      console.error("Error in getProfile():", err.message);
      return res.status(500).json({ error: "Intern error" });
    }
  }

  public async resendVerificationEmail(req: AuthRequest, res: Response): Promise<Response> {
    const sub = req.auth?.sub;
    if (!sub) return res.status(400).json({ error: "Token without sub" });
  
    try {
      const { email } = await this.auth0Service.getUserBySub(sub);
  
      const lastSent = await this.userDbService.getLastVerificationSent(email);
      const now = new Date();
      const cooldownMs = 10 * 60 * 1000;
  
      if (lastSent) {
        const elapsed = now.getTime() - new Date(lastSent).getTime();
        const remainingMs = Math.max(0, cooldownMs - elapsed);
  
        if (remainingMs > 0) {
          const secondsLeft = Math.ceil(remainingMs / 1000);
          return res.status(429).json({ secondsLeft });
        }
      }
  
      await this.auth0Service.sendVerificationEmail(sub);
      await this.userDbService.insertVerificationEmail(email);
  
      return res.status(200).json({ message: "Verification email resent", secondsLeft: Math.ceil(cooldownMs / 1000) });
    } catch (err: any) {
      console.error("Error resending verification email:", err.message);
      return res.status(500).json({ error: "Failed to resend verification email" });
    }
  }
  
  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    const email = req.body.email?.toLowerCase();
  
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }
  
    try {
      const lastSent = await this.userDbService.getLastForgotPasswordSent(email);
      const now = new Date();
      const cooldownMs = 10 * 60 * 1000;
  
      if (lastSent) {
        const elapsed = now.getTime() - new Date(lastSent).getTime();
        const remainingMs = Math.max(0, cooldownMs - elapsed);
  
        if (remainingMs > 0) {
          const secondsLeft = Math.ceil(remainingMs / 1000);
          return res.status(429).json({ secondsLeft });
        }
      }
  
      const resetLink = (await this.auth0Service.linkPasswordResetEmail(email)).ticket;
      await this.emailService.sendResetPassword(email, resetLink);
      await this.userDbService.insertForgotPasswordEmail(email);
  
      return res.status(200).json({ message: "Password reset email sent", secondsLeft: Math.ceil(cooldownMs / 1000) });
  
    } catch (error: any) {
      console.error("Error sending forgot password:", error.message);
      return res.status(500).json({ error: "Failed to send password reset" });
    }
  }
  
  public async getEmailStatus(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const sub = req.auth?.sub;
      if (!sub) {
        return res.status(200).json({ email: null, email_verified: false });
      }
  
      const { email, email_verified } = await this.auth0Service.getUserBySub(sub);
      return res.status(200).json({ email, email_verified });
    } catch (err: any) {
      console.error("Error fetching email status:", err.message);
      return res.status(200).json({ email: null, email_verified: false });
    }
  }
  

  public logout(req: Request, res: Response): void {
    clearAuthCookies(res);
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  }

  public async updateProfilePicture(req: AuthRequest, res: Response): Promise<Response> {
    const { ProfilePic } = req.body;
    if (!ProfilePic || typeof ProfilePic !== "string") {
      return res.status(400).json({ error: "ProfilePic is required" });
    }
  
    const base64Data = ProfilePic.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
  
    const sub = req.auth?.sub;
    if (!sub) return res.status(400).json({ error: "Token without sub" });
  
    const { email } = await this.auth0Service.getUserBySub(sub);
  
    await this.userDbService.updateProfilePictureInDb(email, buffer);
  
    return res.status(200).json({ message: "Profile picture updated successfully" });
  }  

}
