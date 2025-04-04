/**
 * Egy üzenetet reprezentáló objektum.
 */
export interface Message{
    /** Az üzenet azonosítója*/
    id: number,
    /** Az üzenet feladójának azonosítója*/
    senderId: number,
    /** Az üzenet fogasójának azonosítója*/
    receiverId : number,
    /** Az üzenet tartalma*/
    content : string,
    /** Az üzenet küldésének dátuma*/
    createdAt : string
}