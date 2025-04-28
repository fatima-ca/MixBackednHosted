export default interface ContactDB {
    ID: number | null;
    Name: string;
    LastName: string;
    Email?: string | null;
    PhoneNumber?: string | null;
    EnterpriseName: string;
    CreationDate?: Date | null;
}