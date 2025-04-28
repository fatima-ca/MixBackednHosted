//* 4. DB Contact

import sql from 'mssql';
import config from '@/db/config';
import ContactDB from '@/types/db/ContactDB';
import Contact from '@/types/controller/Contact';
import EnterpriseDB from '@/types/db/EnterpriseDB';
import Enterprise from '@/types/controller/Enterprise';

export default class ContactService {
  private pool: sql.ConnectionPool;

  constructor() {
    this.pool = new sql.ConnectionPool(config);
    // Conectar al pool una sola vez al crear la instancia
    this.pool.connect().catch(err => {
      console.error('Error connecting to the database', err);
    });
  }

  async closePool(): Promise<void> {
    try {
      await this.pool.close();
    } catch (err) {
      console.error('Error closing connection pool', err);
    }
  }

  async getAllContacts(userID: string): Promise<Contact[]> {
    const result = await this.pool
      .request()
      .input('idUser', sql.VarChar, userID)
      .query(
        `SELECT 
          c.ID, 
          c.Name, 
          c.LastName, 
          e.Name AS EnterpriseName,
          CASE 
            WHEN EXISTS (
              SELECT 1
              FROM Sale s
              WHERE s.IDContact = c.ID
                AND MONTH(s.StartDate) = MONTH(GETDATE())
                AND YEAR(s.StartDate) = YEAR(GETDATE())
                AND s.IDPhase NOT IN (5, 6)
            ) THEN CAST(1 AS bit)
            ELSE CAST(0 AS bit)
          END AS Status,
          c.PhoneNumber,
          c.Email, 
          c.CreationDate
        FROM Contact c
        JOIN Enterprise e ON c.IDEnterprise = e.ID
        WHERE c.IDUser = @idUser
        ORDER BY c.Name ASC;`
      );
    return result.recordset;
  }

  async getContactById(userID: string, contactID: number): Promise<Contact[]> {
    const result = await this.pool.request()
      .input('idUser', sql.VarChar, userID)
      .input('id', sql.Int, contactID)
      .query(
        `SELECT 
          c.ID, 
          c.Name, 
          c.LastName, 
          e.Name AS EnterpriseName,
          CASE 
            WHEN EXISTS (
              SELECT 1
              FROM Sale s
              WHERE s.IDContact = c.ID
                AND MONTH(s.StartDate) = MONTH(GETDATE())
                AND YEAR(s.StartDate) = YEAR(GETDATE())
                AND s.IDPhase NOT IN (5, 6)
            ) THEN CAST(1 AS bit)
            ELSE CAST(0 AS bit)
          END AS Status,
          c.PhoneNumber,
          c.Email, 
          c.CreationDate
        FROM [Contact] c
        JOIN Enterprise e ON c.IDEnterprise = e.ID
        WHERE c.IDUser = @idUser AND c.ID = @id
        ORDER BY c.Name ASC;`
      );
    return result.recordset;
  }

  async getContactByName(userID: string, contactName: string): Promise<Contact[]> {
    const result = await this.pool.request()
      .input('name', sql.VarChar, `%${contactName}%`)
      .input('idUser', sql.VarChar, userID)
      .query(
        `SELECT 
            c.ID, 
            c.Name, 
            c.LastName, 
            e.Name AS EnterpriseName,
            CASE 
              WHEN EXISTS (
                SELECT 1
                FROM Sale s
                WHERE s.IDContact = c.ID
                  AND MONTH(s.StartDate) = MONTH(GETDATE())
                  AND YEAR(s.StartDate) = YEAR(GETDATE())
                  AND s.IDPhase NOT IN (5, 6)
              ) THEN CAST(1 AS bit)
              ELSE CAST(0 AS bit)
            END AS Status,
            c.PhoneNumber,
            c.Email, 
            c.CreationDate
          FROM [Contact] c
          JOIN Enterprise e ON c.IDEnterprise = e.ID
          WHERE c.IDUser = @idUser AND (c.Name LIKE @name OR c.LastName LIKE @name)
          ORDER BY c.Name ASC;`
      );
    return result.recordset;
  }

  async getContactByEnterprise(userID: string, enterprise: string): Promise<Contact[]> {
    const result = await this.pool.request()
      .input('idUser', sql.VarChar, userID)
      .input('enterprise', sql.VarChar, `%${enterprise}%`)
      .query(
        `SELECT 
          c.ID, 
          c.Name, 
          c.LastName,
          e.Name AS EnterpriseName,
          CASE 
            WHEN EXISTS (
              SELECT 1
              FROM Sale s
              WHERE s.IDContact = c.ID
                AND MONTH(s.StartDate) = MONTH(GETDATE())
                AND YEAR(s.StartDate) = YEAR(GETDATE())
                AND s.IDPhase NOT IN (5, 6)
            ) THEN CAST(1 AS bit)
            ELSE CAST(0 AS bit)
          END AS Status,
          c.PhoneNumber,
          c.Email, 
          c.CreationDate
        FROM [Contact] c
        JOIN [Enterprise] e ON c.IDEnterprise = e.ID
        WHERE c.IDUser = @idUser AND e.Name LIKE @enterprise;`
      );
    return result.recordset;
  }

  async getEnterprise(): Promise<Enterprise[]> {
    const result = await this.pool.request()
      .query(
        `SELECT 
          ID, 
          Name
        FROM [Enterprise];`
      );
    return result.recordset;
  }

  async createContact(userID: string, data: ContactDB): Promise<void> {
    await this.pool.request()
      .input('idUser', sql.VarChar, userID)
      .input('name', sql.VarChar, data.Name)
      .input('lastName', sql.VarChar, data.LastName)
      .input('email', sql.VarChar, data.Email)
      .input('phoneNumber', sql.VarChar, data.PhoneNumber)
      .input('nameEnterprise', sql.VarChar, data.EnterpriseName)
      .query(
        `INSERT INTO Contact (Name, LastName, Email, PhoneNumber, IDEnterprise, IDUser)
        VALUES (
            @name,
            @lastName,
            @email,
            @phoneNumber,
            (SELECT ID FROM Enterprise WHERE Name = @nameEnterprise),
            @idUser
        );`
      );
  }

  async createEnterprise(enterpriseData: EnterpriseDB): Promise<void> {
    await this.pool.request()
      .input('name', sql.VarChar, enterpriseData.Name)
      .input('description', sql.VarChar, enterpriseData.Description)
      .input('industry', sql.VarChar, enterpriseData.Industry)
      .input('website', sql.VarChar, enterpriseData.Website)
      .input('address', sql.VarChar, enterpriseData.Address)
      .query(
        `INSERT INTO Enterprise (Name, Description, Industry, WebPage, Location)
        VALUES (@name, @description, @industry, @website, @address);`
      );
  }

  async updateContact(id: number, data: ContactDB): Promise<void> {
    await this.pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, data.Name)
      .input('lastName', sql.VarChar, data.LastName)
      .input('email', sql.VarChar, data.Email)
      .input('phoneNumber', sql.VarChar, data.PhoneNumber)
      .input('enterpriseName', sql.VarChar, data.EnterpriseName)
      .query(
        `UPDATE [Contact]
        SET
          Name = @name,
          LastName = @lastName,
          Email = @email,
          PhoneNumber = @phoneNumber,
          IDEnterprise = (SELECT ID FROM Enterprise WHERE Name = @enterpriseName)
        WHERE ID = @id`
      );
  }

  async deleteContact(contactID: number): Promise<void> {
    await this.pool.request()
      .input('id', sql.Int, contactID)
      .query(
        'DELETE FROM Contact WHERE ID = @id'
      );
  }
}