export interface UserDTO {
    Name: string;
    LastName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    BirthDate: string;
    Education: string;
    ProfilePic: string | null;
    EmailVerified: boolean;
    IDJobPosition: string | null;
}