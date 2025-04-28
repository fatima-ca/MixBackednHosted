//* 2. Handler Contacts

import { Request, Response, NextFunction } from 'express';
import ContactController from '@/controllers/contacts';
import Contact from '@/types/db/ContactDB';

export default class ContactHTTPHandler {
    private contactController: ContactController;

    constructor() {
        this.contactController = new ContactController();
    }

    getContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userEmail = "ana.gomez@empresa.com";
            const contacts = await this.contactController.getAllContacts(userEmail);
            res.json(contacts);
        } catch (error) {
            next(error);
        }
    };

    getContactById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userEmail = "ana.gomez@empresa.com";
            const contactID = Number(req.params.id);
            const contact = await this.contactController.getContactById(userEmail, contactID);
            res.json(contact);
        } catch (error) {
            next(error);
        }
    };

    getContactByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userEmail = "ana.gomez@empresa.com";
            const contactName = req.params.name;
            const contact = await this.contactController.getContactByName(userEmail, contactName);
            res.json(contact);
        } catch (error) {
            next(error);
        }
    };

    getContactByEnterprise = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userEmail = "ana.gomez@empresa.com";
            const contactEnterprise = req.params.enterprise;
            const contact = await this.contactController.getContactByEnterprise(userEmail, contactEnterprise);
            res.json(contact);
        } catch (error) {
            next(error);
        }
    };

    createContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userEmail = "ana.gomez@empresa.com";
            const contactData: Contact = req.body;
            await this.contactController.createContact(userEmail, contactData);
            res.json({ message: 'Contact created successfully' });
        } catch (error) {
            next(error);
        }
    };

    updateContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contactID = Number(req.params.id);
            const contactData: Contact = req.body;
            await this.contactController.updateContact(contactID, contactData);
            res.json({ message: 'Contact updated successfully' });
        } catch (error) {
            next(error);
        }
    };

    deleteContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contactID = Number(req.params.id);
            await this.contactController.deleteContact(contactID);
            res.json({ message: 'Contact deleted successfully' });
        } catch (error) {
            next(error);
        }
    };
}