/**
 * Egy profilt reprezentáló objektum.
 */
export interface Profile{
    /** A profil azonosítója */
    id: number,
    /** A profil tulajdonosának a neve */
    name: string,
    /** A profil tulajdonosának a felhasználóneve */
    username: string,
    /** A profilhoz tartozó kép URL-je */
    profileImg: string,
}