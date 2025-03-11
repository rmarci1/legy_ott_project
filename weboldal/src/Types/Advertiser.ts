import {Review} from "./Review.ts";

export interface Advertiser{
    id: number;
    username: string;
    name: string;
    profileImg: string;
    description: string;
    averageRating: number;
    reviews: Review[];
}