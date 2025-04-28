export default interface Contact {
    ID: number;
    Name: string;
    LastName: string;
    EnterpriseName: string;
    Status: boolean;
    PhoneNumber?: string | '';
    Email?: string | '';
    CreationDate: Date;
}