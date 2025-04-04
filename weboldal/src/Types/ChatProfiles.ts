/**
 * Egy üzenő profilt reprezentáló objektum.
 */
export interface ChatProfiles{
    /** Az üzenetet küldő profil azonosítója */
    id: number,
    /** Az üzenetet küldő profil tulajdonosának neve */
    name: string,
    /** Az üzenetet küldő profil tulajdonosának felhasználóneve */
    username: string,
    /** Az üzenetet küldő profil képének URL-je */
    profileImg: string,
    /** Az üzenetet küldő profil utolsó üzenete*/
    lastMessage : string,
    /** Az üzenetet küldő profil utolsó üzenetének dátuma */
    lastMessageDate : string,
}