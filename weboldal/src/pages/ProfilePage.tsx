import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "../context/AuthContext.tsx";
import JobCard from "../components/cards/JobCard.tsx";
import {Job} from "../Types/Job.ts";
import ChangeProfilePicModal from "../components/modals/ChangeProfilePicModal.tsx";

export default function ProfilePage(){
    const {user, checkUser, isLoading, selectedJobs, ads} = useAuth();
    const [mode, setMode] = useState<1|2>(1)
    const [profilePicChangeModal, setProfilePicChangeModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            await checkUser();
        };
        fetchUser();
    }, []);

    useEffect(() => {
        console.log("Effect Triggered → User:", user, "isLoading:", isLoading);

        if (isLoading || user === undefined) return;

        if (user === null) {
            console.log("Redirecting to login...");
            navigate('/login');
        }
    }, [user, isLoading]);
    return <>
        <div className="w-dvw flex flex-wrap h-fit p-3 justify-center overflow-auto">
            <div className="flex w-fit">
                <div className="w-fit relative text-center rounded-full group cursor-pointer" onClick={() => setProfilePicChangeModal(true)}>
                        <img className="w-28 h-auto rounded-full drop-shadow-lg transition-all duration-300 group-hover:brightness-50" src={user?.profileImg}></img>
                        <p className="text-sm text-white invisible group-hover:visible absolute top-1/3 bottom-1/2 right-1/4 left-1/4 transform:translate-x-1/2 transform:translate-y-1/2">Fénykép feltöltése</p>
                </div>
                {
                    profilePicChangeModal && (
                        <ChangeProfilePicModal setModal={setProfilePicChangeModal}/>
                    )
                }

                <div className="justify-center content-center p-3">
                    <h2 className="font-black text-2xl">{user?.name}</h2>
                    <h3>@{user?.username}</h3>
                </div>
            </div>
            <div className="basis-full p-3"></div>
            <div className=" bg-indigo-950 h-px w-2/4"></div>
            <div className="basis-full p-3"></div>
            <div className="flex text-2xl flex-row text-center w-1/3">
                <p className="cursor-pointer grow-0 flex-none hover:underline decoration-indigo-950 decoration-1 underline-offset-4" onClick={() => setMode(1)}>Önkéntes</p>
                <p className="text-indigo-950 font-thin grow cursor-default">|</p>
                <p className="cursor-pointer grow-0 flex-none hover:underline decoration-indigo-950 decoration-1 underline-offset-4" onClick={() => setMode(2)}>Hírdetés</p>
            </div>

            {
                mode == 1 ?
                    //TODO: style
                (<div className="flex flex-wrap w-dvw justify-center h-screen">
                    {
                        (selectedJobs.map((item: Job) => (
                            <JobCard key={item.id} attending={true} Job={item}/>
                        )))
                    }
                </div>)
                :
                    (<div className="flex flex-wrap w-dvw justify-center h-screen">
                        {
                            (ads.map((item: Job) => (
                                <JobCard key={item.id} attending={true} Job={item}/>
                            )))
                        }
                    </div>)

            }
        </div>        
    </>
}