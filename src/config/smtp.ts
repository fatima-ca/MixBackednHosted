import dotenv from "dotenv";
dotenv.config();

export const smtpConfig = {
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT!),
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
  from: process.env.FROM_EMAIL!,
};