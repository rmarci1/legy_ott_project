import {Review} from "../../Types/Review.ts";
import {FaStar} from "react-icons/fa";

interface reviewCardProps{
    review: Review
}

export default function ReviewCard({review} : reviewCardProps){
    return <>
        <div className="flex flex-col w-full bg-blue-600/25 rounded-3xl">
            <div className="p-5">
                <div className="flex flex-row w-full justify-between align-middle">
                    <p className="font-medium">
                        {review.reviewer_un}
                    </p>
                    <p className="flex flex-row items-center gap-1">
                        {review.review}
                        <FaStar size={20} color={"yellow"}/>
                    </p>
                </div>
                <div className="text-gray-300 pl-1 break-words">
                    {review.desc}
                </div>
            </div>
        </div>
    </>
}