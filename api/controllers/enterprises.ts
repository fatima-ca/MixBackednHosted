//* 3. Controller Conctacts

import EnterpriseService from '../db/enterprises';
import Enterprise from '../types/controller/Enterprise';
import EnterpriseDB from '../types/db/EnterpriseDB';

export default class ContactController {
    private service = new EnterpriseService;

    async getEnterprise(): Promise<Enterprise[]> {
        return this.service.getEnterprise();
    }

    async createEnterprise(enterpriseData: EnterpriseDB): Promise<void> {
        return this.service.createEnterprise(enterpriseData);
    }
}