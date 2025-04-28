import { Response } from "express";
import { nodeConfig } from "@/config/cookies";

const isProd = nodeConfig.env === "production";

export const setAuthCookies = (
  res: Response,
  tokens: { access_token: string; refresh_token?: string }
): void => {
  res.cookie("access_token", tokens.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutos
    path: "/",
  });

  if (tokens.refresh_token) {
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      path: "/",
    });
  }
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
  });
};
