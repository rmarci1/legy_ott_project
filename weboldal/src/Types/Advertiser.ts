import {Review} from "./Review.ts";
/**
 * Egy hirdető profilját reprezentáló objektum.
 * */
export interface Advertiser{
    /** A hirdető profil azonosítója */
    id: number;
    /** A hirdető profil tulajdonosának a felhasználóneve */
    username: string;
    /** A hirdető profil tulajdonosának a neve */
    name: string;
    /** A hirdető profil képének az URL-je */
    profileImg: string;
    /** A hirdető profil leírása */
    description: string;
    /** A hirdető profil átlagos értékelése */
    averageRating: number;
    /** A hirdető profilhoz tartozó értékeléseket tartalmazó lista */
    reviews: Review[];
}