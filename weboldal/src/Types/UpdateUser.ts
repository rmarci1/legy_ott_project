/**
 * Egy felhasználói profil adatait frissíteni kívánó objektum.
 */
export interface UpdateUser{

    /** A felhasználó azonosítója*/
    id?: number;
    /** A felhasználó felhasználóneve*/
    username?: string;
    /** A felhasználó teljes neve*/
    name?: string;
    /** A felhasználó email címe*/
    email?: string;
    /** A felhasználó jelszava*/
    password?: string;
    /** A felhasználó profilképének az URL-je*/
    profileImg?: string;
    /** A felhasználó leírása (bio)*/
    description?: string;
    /** A felhasználó bejelentkezett-e már*/
    bejelentkezett?: boolean;
    /** A felhasználó admin-e*/
    isAdmin?: boolean;
    /** Mikor regisztrált a felhasználó*/
    created?: Date,
}