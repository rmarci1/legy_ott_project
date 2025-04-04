/**
 * Egy munka adatait frissíteni kívánó objektum.
 */
export interface UpdateJob{
    /** A munka azonosítója*/
    id?: number
    /** A munka neve*/
    name?: string
    /** A munka készítőjének felhasználóneve*/
    from?: string
    /** Mikor esedékes a munka*/
    date?: Date
    /** A munka képének URL-je*/
    img?: string
    /** A munka leírása*/
    description?: string
    /** A munkán maximum résztvevők száma*/
    max_attending?: number
    /** A munkára jelenleg jelentkezettek száma*/
    current_attending?: number
    /** A munka címe*/
    address?: string
    /** A munkára jelentkezettek, és vagy későbbre elmentette profilok listája*/
    profiles?: [{
        /** A munkát el-e mentette a jelentkező*/
        saveForLater: boolean
        /** A munkára jelentkezett-e már*/
        isApplied: boolean
    }]
}