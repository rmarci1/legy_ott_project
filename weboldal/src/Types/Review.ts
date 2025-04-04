/**
 * Egy értékelést reprezentáló objektum.
 */
export interface Review{
    /**Az értékelés azonosítója*/
    id: number
    /**Az értékelt profil felhasználóneve*/
    reviewed_un: string
    /**Az értékelő profil felhasználóneve*/
    reviewer_un: string
    /**Az értékelés 1-től 5-ig számszerint*/
    review: number
    /**Az értékelés leírása*/
    desc: string
}