export interface IUser {
    id: number;
    name: string;
    email?: string | null; // optional property, can be undefined or null.
    password: string;
    adminLevel: number;
}