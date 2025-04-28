import sql from 'mssql';

import config from '@/db/config';
import Product from '@/types/controller/Product';
import ProductDB from '@/types/db/ProductDB';

export default class ProductService {
  private pool: sql.ConnectionPool;

  constructor() {
    this.pool = new sql.ConnectionPool(config);
    // Conectar al pool una sola vez al crear la instancia
    this.pool.connect().catch(err => {
      console.error('Error connecting to the database', err);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    const result = await this.pool.request().query(
      'SELECT * FROM Product ORDER BY RefNum ASC;'
    );
    return result.recordset;
  }

  async getProductById(id: string): Promise<Product[]> {
    const result = await this.pool.request()
      .input('id', sql.VarChar, `%${id}%`)
      .query(
        'SELECT * FROM Product WHERE RefNum LIKE @id ORDER BY RefNum ASC;'
      );
    return result.recordset;
  }

  async getProductByName(name: string): Promise<Product[]> {
    const result = await this.pool.request()
      .input('name', sql.VarChar, `%${name}%`)
      .query(
        'SELECT * FROM Product WHERE name LIKE @name ORDER BY RefNum ASC;'
      );
    return result.recordset;
  }

  async createProduct(data: ProductDB): Promise<void> {
    const result = await this.pool.request()
      .input('refNum', sql.VarChar, data.RefNum)
      .input('name', sql.VarChar, data.Name)
      .input('description', sql.VarChar, data.Description)
      .input('unitaryPrice', sql.Float, data.UnitaryPrice)
      .input('commission', sql.Float, data.Commission)
      .input('productSheetURL', sql.VarChar, data.ProductSheetURL)
      .query(
              `INSERT INTO Product (RefNum, Name, Description, UnitaryPrice, Commission, ProductSheetURL)
              VALUES (@refNum, @name, @description, @unitaryPrice, @commission, @productSheetURL);`
            );
  }

  async updateProduct(id: string, data: ProductDB): Promise<void> {
    const result = await this.pool.request()
      .input('id', sql.VarChar, id)
      .input('name', sql.VarChar, data.Name)
      .input('description', sql.VarChar, data.Description)
      .input('unitaryPrice', sql.Float, data.UnitaryPrice)
      .input('commission', sql.Float, data.Commission)
      .input('productSheetURL', sql.VarChar, data.ProductSheetURL)
      .query(`UPDATE Product
              SET
                Name = @name,
                Description = @description,
                UnitaryPrice = @unitaryPrice,
                Commission = @commission,
                ProductSheetURL = @productSheetURL
              WHERE RefNum = @id;`
            );
  }

  async deleteProduct(id: string): Promise<void> {
    await this.pool.request()
      .input('id', sql.VarChar, id)
      .query(
        'DELETE FROM Product WHERE RefNum = @id;'
      );
  }
}