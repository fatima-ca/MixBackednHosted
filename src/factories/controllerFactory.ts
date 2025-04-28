import { auth0Service, emailService } from "@/services/index";
import { pool } from "@/db/config";
import { UserDbService } from "@/db/user";
import { UserController } from "@/controllers/user.controller";

export const userControllerPromise = pool.then(
  (db) => new UserController(auth0Service, new UserDbService(db), emailService)
);