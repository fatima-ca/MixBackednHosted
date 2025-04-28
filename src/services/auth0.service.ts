import axios from "axios";
import { auth0Config } from "@/config/auth0";
import { Auth0User } from "@/types/controller/auth0";

export class Auth0Service {
  private domain = auth0Config.domain;
  private clientId = auth0Config.clientId;
  private clientSecret = auth0Config.clientSecret;
  private audience = auth0Config.audience;
  private managementAudience = auth0Config.audienceManagement;
  private connectionId = auth0Config.connectionId;

  private async getAccessToken(audience1: string): Promise<string> {
    if (!audience1 || !audience1.startsWith("https://") || !audience1.includes("/api/v2")) {
      throw new Error(`Invalid audience passed to getAccessToken: "${audience1}"`);
    }
  
    const response = await axios.post(`https://${this.domain}/oauth/token`, {
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: audience1,
    });
  
    return response.data.access_token;
  }

  public async createUser(email: string, password: string): Promise<Auth0User> {
    const token = await this.getAccessToken(this.managementAudience);

    const response = await axios.post(
      `https://${this.domain}/api/v2/users`,
      {
        email,
        password,
        connection: "Username-Password-Authentication",
        verify_email: false
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { email_verified, user_id } = response.data;
    return { email_verified, user_id };
  }

  public async userExists(email: string): Promise<boolean> {
    const token = await this.getAccessToken(this.managementAudience);

    const response = await axios.get(
      `https://${this.domain}/api/v2/users-by-email`,
      {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.length > 0;
  }

  public async loginWithEmailPassword(email: string, password: string) {
    const response = await axios.post(`https://${this.domain}/oauth/token`, {
      grant_type: "password",
      username: email,
      password,
      audience: this.audience,
      client_id: auth0Config.clientIdFront,
      client_secret: auth0Config.clientSecretFront,
      scope: "openid profile email",
      connection: "Username-Password-Authentication"
    });

    return response.data; // access_token, id_token, etc.
  }
  public async getUserBySub(sub: string): Promise<{ email: string; email_verified: boolean }> {
    const token = await this.getAccessToken(this.managementAudience);
  
    const response = await axios.get(
      `https://${this.domain}/api/v2/users/${sub}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { 
      email: response.data.email,
      email_verified: response.data.email_verified, 
    };
  }

  public async sendVerificationEmail(sub: string): Promise<void> {
    const token = await this.getAccessToken(this.managementAudience);

    await axios.post(
      `https://${this.domain}/api/v2/jobs/verification-email`,
      {
        client_id: this.clientId,
        user_id: sub
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  public async linkPasswordResetEmail(email: string): Promise<{ ticket: string }> {
    const token = await this.getAccessToken(this.managementAudience);
    
    try {
    const res = await axios.post(`https://${this.domain}/api/v2/tickets/password-change`, {
      email,
      connection_id: this.connectionId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
    } catch (error: any) {
      console.error("Auth0 Error Details:", error.response?.data || error.message);
      throw error;
    }
  }

}