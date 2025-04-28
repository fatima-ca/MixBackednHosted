import { sql } from "@/db/config";
import { UserDTO } from "@/types/db/user";
import { Auth0User } from "@/types/controller/auth0";

export class UserDbService {
  constructor(private db: sql.ConnectionPool) {}

  public async createUser(user: UserDTO & Pick<Auth0User, "email_verified">): Promise<void> {
    const bufferPic = user.ProfilePic
      ? Buffer.from(user.ProfilePic.replace(/^data:image\/\w+;base64,/, ""), "base64")
      : null;

    await this.db.request()
      .input("name", sql.NVarChar, user.Name)
      .input("lastName", sql.NVarChar, user.LastName)
      .input("email", sql.NVarChar, user.Email)
      .input("emailVerified", sql.Bit, user.email_verified)
      .input("phoneNumber", sql.NVarChar, user.PhoneNumber)
      .input("birthDate", sql.Date, user.BirthDate)
      .input("education", sql.NVarChar, user.Education)
      .input("profilePic", sql.VarBinary(sql.MAX), bufferPic)
      .input("idJobPosition", sql.Int, user.IDJobPosition ? parseInt(user.IDJobPosition) : null)
      .query(`
        INSERT INTO [User] (
          Name, LastName, IDEmail, EmailVerified,
          PhoneNumber, BirthDate, Education,
          ProfilePic, IDJobPosition
        ) VALUES (
          @name, @lastName, @email, @emailVerified,
          @phoneNumber, @birthDate, @education,
          @profilePic, @idJobPosition
        )
      `);
  }

  public async getUserByEmail(email: string): Promise<UserDTO | null> {
    const isAdmin = await this.isUserAdmin(email);
    const result = await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .query(`
        SELECT 
          u.IDEmail,
          u.Name,
          u.LastName,
          u.PhoneNumber,
          u.JoiningDate,
          u.Education,
          u.EmailVerified,
          jp.Name AS JobPositionName,
          u.ProfilePic
        FROM [User] u
        INNER JOIN [JobPosition] jp ON u.IDJobPosition = jp.ID
        WHERE LOWER(u.IDEmail) = @email
      `);

    const user = result.recordset[0];
    if (!user) return null;

    return {
      ...user,
      EmailVerified: user.EmailVerified,
      ProfilePic: user.ProfilePic 
        ? `data:image/png;base64,${user.ProfilePic.toString("base64")}` 
        : null,
      isAdmin,
    };
  }

  public async updateEmailVerified(email: string, email_verified: boolean): Promise<void> {
    await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .input("emailVerified", sql.Bit, email_verified)
      .query(`
        UPDATE [User]
        SET EmailVerified = @emailVerified
        WHERE LOWER(IDEmail) = @email
      `);
  }

  public async getLastVerificationSent(email: string): Promise<Date | null> {
    const result = await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .input("emailTypeId", sql.Int, 1)
      .query(`
        SELECT TOP 1 [SentAt]
        FROM [EmailSend]
        WHERE LOWER([Email]) = @email
          AND [EmailTypeID] = @emailTypeId
        ORDER BY [SentAt] DESC
      `);
  
    return result.recordset[0]?.SentAt ?? null;
  }

  public async insertVerificationEmail(email: string): Promise<void> {
    await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .input("emailTypeId", sql.Int, 1)
      .query(`
        INSERT INTO [EmailSend] ([Email], [EmailTypeID])
        VALUES (@email, @emailTypeId)
      `);
  }

  public async isUserAdmin(email: string): Promise<boolean> {
    const result = await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .query(`
        SELECT 1
        FROM [Admin]
        WHERE IDUser = @email
      `);
  
    return result.recordset.length > 0;
  }
  
  public async getLastForgotPasswordSent(email: string): Promise<Date | null> {
    const result = await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .input("emailTypeId", sql.Int, 2)
      .query(`
        SELECT TOP 1 [SentAt]
        FROM [EmailSend]
        WHERE LOWER([Email]) = @email
          AND [EmailTypeID] = @emailTypeId
        ORDER BY [SentAt] DESC
      `);
  
    return result.recordset[0]?.SentAt ?? null;
  }
  
  public async insertForgotPasswordEmail(email: string): Promise<void> {
    await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .input("emailTypeId", sql.Int, 2)
      .query(`
        INSERT INTO [EmailSend] ([Email], [EmailTypeID])
        VALUES (@email, @emailTypeId)
      `);
  }

  public async updateProfilePictureInDb(email: string, buffer: Buffer): Promise<void> {
    await this.db.request()
      .input("email", sql.NVarChar, email.toLowerCase())
      .input("profilePic", sql.VarBinary(sql.MAX), buffer)
      .query(`
        UPDATE [User]
        SET ProfilePic = @profilePic
        WHERE LOWER(IDEmail) = @email
      `);
  }
  
}
