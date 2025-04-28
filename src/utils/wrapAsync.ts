import { RequestHandler } from "express";

export const wrapAsync = (fn: (...args: any[]) => Promise<any>): RequestHandler =>
  (req, res, next) => fn(req, res, next).catch(next);