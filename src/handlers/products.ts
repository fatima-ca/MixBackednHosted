//* 2. Handler Products

import { Request, Response, NextFunction } from 'express';
import ProductController from '@/controllers/products';

export default class ProductHTTPHandler {
    private productController: ProductController;

    constructor() {
        this.productController = new ProductController();
    }

    

    getProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productController.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            next(error);
        }
    };

    getProductByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productController.getProductByName(req.params.name);
            res.json(product);
        } catch (error) {
            next(error);
        }
    };

    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.productController.createProduct(req.body);
            res.json({ message: 'Product created successfully' });
        } catch (error) {
            next(error);
        }
    };

    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.productController.updateProduct(req.params.id, req.body);
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.productController.deleteProduct(req.params.id);
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    };
}