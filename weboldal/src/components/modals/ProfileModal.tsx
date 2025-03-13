import { User } from "../../Types/User.ts";
import { useEffect, useState} from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { FaStar } from "react-icons/fa";
import ReviewCard from "../cards/ReviewCard.tsx";
import {IoClose} from "react-icons/io5";
import {canReview} from "../../lib/api.ts";
import WriteReview from "../WriteReview.tsx";

interface ProfileModalProps {
    user?: User;
    setModal: (value: boolean) => void;
    setJobModal: (value: boolean) => void;
}

export default function ProfileModal({ setModal, setJobModal }: ProfileModalProps) {
    const { advertiser } = useAuth();
    const [canRev, setCanRev] = useState(false);


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
                            <img src={advertiser.profileImg} alt="profile picture" className="w-16 h-16 object-cover rounded-full"/>
                            <div className="ml-4">
                                <h3 className="text-xl font-semibold text-white">{advertiser.name}</h3>
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
                    <p className="text-white">{advertiser.description}</p>
                    <div className="w-full my-4 border-t border-gray-600"></div>
                    <p className="font-medium text-xl text-white mb-2">Értékelések</p>
                    <div className="w-full overflow-y-auto h-full max-h-64">
                        {
                            advertiser.reviews.length > 0 ? (
                                <ul>
                                    {advertiser.reviews.map((item, index) => (
                                        <li key={index} className="m-1 list-none">
                                            <ReviewCard review={item}/>
                                        </li>
                                    ))}
                                </ul>
                            ):
                                (
                                    <p className="text-gray-300 italic">Még nincsenek értékelések</p>
                                )
                        }
                    </div>

                    {
                         canRev && (
                            <WriteReview advertiser={advertiser}/>
                        )
                    }

                </div>
            </div>
        </>
    );
}
