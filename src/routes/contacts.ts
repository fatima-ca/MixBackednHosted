//* 1. Routes Contacts

import express from 'express';
import ContactHTTPHandler from '@/handlers/contacts';

const router = express.Router();
const contactHandler = new ContactHTTPHandler();

router.get('/', contactHandler.getContacts);
router.get('/id/:id', contactHandler.getContactById);
router.get('/name/:name', contactHandler.getContactByName);
router.get('/enterprise/:enterprise', contactHandler.getContactByEnterprise);

router.post('/', contactHandler.createContact);
router.put('/:id', contactHandler.updateContact);
router.delete('/:id', contactHandler.deleteContact);

export default router;