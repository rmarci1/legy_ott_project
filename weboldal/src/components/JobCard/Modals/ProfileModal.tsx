import {User} from "../../../Types/User.ts";
import {useEffect} from "react";
import {useAuth} from "../../Context/AuthContext.tsx";
import { FaStar } from "react-icons/fa";

interface profileModalProps {
    user?: User,
    setModal: (value: boolean) => void,
    setJobModal: (value: boolean) => void,
    username: string
}

export default function ProfileModal({user, setModal, setJobModal, username}: profileModalProps){
    const {advertiser} = useAuth();

    //TODO: Implement reviews

    useEffect(() => {
        setJobModal(false);
        if (!advertiser){
            alert('Nem létezik ilyen profil!')
            setModal(false);
            setJobModal(true);
        }
    }, []);

    return <>
        {
            advertiser &&(
        <div tabIndex={-1}
             className="overflow-y-auto text-white overflow-x-hidden fixed justify-center items-center w-fit h-fit justify-self-center md:inset-0 max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-indigo-950 rounded-lg shadow-sm ">
                    <div className="flex flex-col items-center justify-between p-4 md:p-5 rounded-t">
                        <div className="flex flex-row w-full items-center">
                            <img src={advertiser.profileImg} alt="profile picture" className="w-1/5 rounded-full"/>
                            <div className="flex flex-col pl-2">
                                <h3 className="text-xl font-semibold">
                                    {advertiser.name}
                                </h3>
                                <p className="text-gray-400">
                                    @{advertiser.username}
                                </p>
                                <div className="flex flex-row items-center">
                                    <p>
                                        3.5
                                    </p>
                                    <FaStar size={20} color={"yellow"}/>
                                </div>
                            </div>
                            <button type="button"
                                    className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                                    onClick={() => {
                                        setModal(false)
                                        setJobModal(true)
                                    }}>
                                <svg className="w-3 h-3" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                        <div>
                            <p>
                                {advertiser.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            )}
    </>
}