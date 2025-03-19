export interface User{
    id: number;
    username: string;
    name: string;
    email: string;
    password: string; 
    profileImg: string;
    description: string;
    bejelentkezett?: boolean;
    isAdmin: boolean;
    created : Date,
}