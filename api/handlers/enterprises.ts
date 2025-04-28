//* 2. Handler Enterprises

import { Request, Response, NextFunction } from 'express';
import EnterpriseController from '../controllers/enterprises';
import EnterpriseDB from '../types/db/EnterpriseDB';

export default class EnterpriseHTTPHandler {
    private contactController: EnterpriseController;

    constructor() {
        this.contactController = new EnterpriseController();
    }

    getEnterprise = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const enterprise = await this.contactController.getEnterprise();
            res.json(enterprise);
        } catch (error) {
            next(error);
        }
    };

    createEnterprise = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const enterpriseData:EnterpriseDB = req.body;
            await this.contactController.createEnterprise(enterpriseData);
            res.json({ message: 'Enterprise created successfully' });
        } catch (error) {
            next(error);
        }
    };
}