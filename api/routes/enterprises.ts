//* 1. Routes Enterprises

import express from 'express';
import EnterpriseHTTPHandler from '../handlers/enterprises';

const router = express.Router();
const enterpriseHandler = new EnterpriseHTTPHandler();

router.get('/', enterpriseHandler.getEnterprise);

router.post('/', enterpriseHandler.createEnterprise);

export default router;