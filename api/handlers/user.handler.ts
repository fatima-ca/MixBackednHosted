import { Request, Response, NextFunction } from "express";
import { userControllerPromise } from "../factories/controllerFactory";


export class UserHttpHandler {
  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controller = await userControllerPromise;
      await controller.signup(req, res);
    } catch (error) {
      next(error);
    }
  }

  public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controller = await userControllerPromise;
      await controller.getProfile(req as any, res);
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controller = await userControllerPromise;
      controller.logout(req, res);
    } catch (error) {
      next(error);
    }
  }

  public async resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controller = await userControllerPromise;
      await controller.resendVerificationEmail(req as any, res);
    } catch (error) {
      next(error);
    }
  }


  public async getEmailStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controller = await userControllerPromise;
      await controller.getEmailStatus(req as any, res);
    } catch (error) {
      next(error);
    }
  }

  public async sessionStatus(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ authenticated: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controller = await userControllerPromise;
      await controller.forgotPassword(req, res);
    } catch (error) {
      next(error);
    }
  }

  public async uploadProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const controller = await userControllerPromise;
      await controller.updateProfilePicture(req as any, res);
    } catch (error) {
      next(error);
    }
  }
  
}
