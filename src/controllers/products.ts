//* 3. Controller Products

import ProductService from '@/db/products';
import Product from '@/types/controller/Product';
import ProductDB from '@/types/db/ProductDB';

export default class ProductController {
    private service = new ProductService;

    async getAllProducts(): Promise<Product[]> {
        return this.service.getAllProducts();
    }

    async getProductById(id: string): Promise<Product[]> {
        return this.service.getProductById(id);
    }

    async getProductByName(name: string): Promise<Product[]> {
        return this.service.getProductByName(name);
    }

    async createProduct(data: ProductDB): Promise<void> {
        return this.service.createProduct(data);
    }

    async updateProduct(id: string, data: ProductDB): Promise<void> {
        return this.service.updateProduct(id, data);
    }

    async deleteProduct(id: string): Promise<void> {
        return this.service.deleteProduct(id);
    }
}