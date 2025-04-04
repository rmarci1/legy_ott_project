/**
 * Egy kapott üzenetet reprezentáló objektum.
 */
export interface ReceivedMessage{
    /** Az üzenet feladójának azonosítója*/
    senderId: number,
    /** Az üzenet fogasójának azonosítója*/
    receiverId : number,
    /** Az üzenet tartalma*/
    content : string,
    /** Az üzenet küldésének dátuma*/
    createdAt : string
}