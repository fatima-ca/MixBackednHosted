import nodemailer from "nodemailer";
import { smtpConfig } from "@/config/smtp";

export class EmailService {
    private transporter: nodemailer.Transporter;
    private host = smtpConfig.host;
    private port = smtpConfig.port;
    private auth = smtpConfig.auth;

    constructor() {
        this.transporter = nodemailer.createTransport({
          host: this.host,
          port: this.port,
          secure: this.port === 465,
          auth: this.auth,
        });
      }

    async sendResetPassword(toEmail: string, resetLink: string): Promise<void> {
        const mailOptions = {
            from: smtpConfig.from,
            to: toEmail,
            subject: "Reset your password",
            html: `
            <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #ffffff; color: #222222; padding: 20px;">

                <h2 style="text-align: center; color: #2E7D32;">Reset Your Password</h2>

                <p>Hello,</p>
                <p>We received a request to reset your password. If you made this request, please click the button below to create a new password:</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                      style="background-color: #2E7D32; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                      Reset Password
                    </a>
                </div>

                <p>If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.</p>

                <hr style="margin: 40px 0; border: none; border-top: 1px solid #cccccc;">

                <p style="font-size: 12px; color: #555555;">
                    For your security, it is important that you please always verify that this email was sent from: <strong>raydevcompany@gmail.com</strong>.
                </p>

                <div style="margin-top: 40px; font-size: 12px; color: #888888; text-align: center;">
                    ${new Date().getFullYear()} MIX by RayDev.
                </div>
            </div>
            `
            ,
        };

        await this.transporter.sendMail(mailOptions);
    }
}