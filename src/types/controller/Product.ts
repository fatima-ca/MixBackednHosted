export default interface Product {
    RefNum: string;
    Name: string;
    Description: string;
    UnitaryPrice: number;
    Commission: number;
    ProductSheetURL: string;
    CreationDate?: Date | null;
}