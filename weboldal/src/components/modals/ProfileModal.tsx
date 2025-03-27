import { User } from "../../Types/User.ts";
import { useEffect, useState} from "react";
import { FaStar } from "react-icons/fa";
import ReviewCard from "../cards/ReviewCard.tsx";
import {IoClose} from "react-icons/io5";
import {canReview} from "../../lib/api.ts";
import WriteReview from "../WriteReview.tsx";
import {Review} from "../../Types/Review.ts";
import { useRef } from "react";
import {Advertiser} from "@/Types/Advertiser.ts";

interface ProfileModalProps {
    user?: User;
    setModal: (value: boolean) => void;
    setJobModal: (value: boolean) => void;
    advertiser: Advertiser;
}

export default function ProfileModal({ setModal, setJobModal, advertiser }: ProfileModalProps) {
    const [canRev, setCanRev] = useState(false);
    const [reviewList, setReviewList] = useState<Review[]>([])
    const myRef = useRef<HTMLDivElement>(null);
    const isInitialRender = useRef(true);
    const manuallyAddedReview = useRef(false);


    useEffect(() => {
        setJobModal(false);
        if (!advertiser) {
            alert("Nem létezik ilyen profil!");
            setModal(false);
            setJobModal(true);
        }
        else{
            canReview(advertiser.username).then((res: boolean) => {
                setCanRev(res)
            })
            setReviewList(advertiser.reviews);
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModal(false);
                setJobModal(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
            document.addEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        if (manuallyAddedReview.current) {
            manuallyAddedReview.current = false;
            if (myRef.current) {
                myRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [reviewList]);

    if (!advertiser) return null;



    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white z-50"
                onClick={() => {
                    setModal(false);
                    setJobModal(true);
                }}
            >
                <div
                    className="relative bg-indigo-950 rounded-lg shadow-sm p-6 w-full max-w-2xl h-fit max-h-4xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <img src={advertiser.profileImg} alt="Profile picture" className="w-16 h-16 object-cover rounded-full"/>
                            <div className="ml-4">
                                <h3 className="text-xl font-semibold text-white break-words">{advertiser.name}</h3>
                                <p className="text-gray-400">@{advertiser.username}</p>
                                <div className="flex items-center">
                                    <p className="text-white">{Math.round(advertiser.averageRating*10)/10}</p>
                                    <FaStar size={20} color={"yellow"} className="ml-1"/>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8  hover:bg-gray-600 hover:text-white"
                            onClick={() => {
                                setModal(false)
                                setJobModal(true)
                            }}
                        >
                            <IoClose className="place-self-center" size={25}/>
                        </button>
                    </div>
                    <p className="text-white break-words">{advertiser.description}</p>
                    <div className="w-full my-4 border-t border-gray-600"></div>
                    <p className="font-medium text-xl text-white mb-2">Értékelések</p>
                    <div className="w-full overflow-y-auto h-full max-h-64
                                      [&::-webkit-scrollbar]:w-1
                                      [&::-webkit-scrollbar-track]:rounded-full
                                      [&::-webkit-scrollbar-track]:bg-gray-600/25
                                      [&::-webkit-scrollbar-thumb]:rounded-full
                                      [&::-webkit-scrollbar-thumb]:bg-gray-700/30">
                        {
                            reviewList.length > 0 ? (
                                <>
                                    <ul>
                                        {reviewList.map((item, index) => (
                                            <li key={index} className="m-1 list-none">
                                                <ReviewCard review={item}/>
                                            </li>
                                        ))}
                                    </ul>
                                    <div ref={myRef}></div>
                                </>
                            ):
                                (
                                    <p className="text-gray-300 italic">Még nincsenek értékelések</p>
                                )
                        }
                    </div>

                    {
                         canRev && (
                            <WriteReview advertiser={advertiser} manuallyAddedReview={manuallyAddedReview} setReviewList={setReviewList}/>
                        )
                    }

                </div>
            </div>
        </>
    );
}
