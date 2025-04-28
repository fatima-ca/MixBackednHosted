import { Request } from "express";

export interface Auth0User {
    email_verified: boolean;
    user_id: string;
}

export interface CustomAuthClaims {
    sub: string;
    email: string;
    email_verified: boolean;
    iat?: number;
    exp?: number;
    [key: string]: any;
}

export interface AuthRequest extends Request {
    auth?: CustomAuthClaims
}