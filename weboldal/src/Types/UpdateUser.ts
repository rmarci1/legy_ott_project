export interface UpdateUser{
    id?: number;
    username?: string;
    name?: string;
    email?: string;
    password?: string; 
    profileImg?: string;
    bejelentkezett?: boolean;
    isAdmin?: boolean;
    created? : Date,
}