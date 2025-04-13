import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "../context/AuthContext.tsx";
import JobCard from "../components/cards/JobCard.tsx";
import {Job} from "../Types/Job.ts";
import ChangeProfilePicModal from "../components/modals/ChangeProfilePicModal.tsx";
import {getAdvertised, getSelectedJobs, logout} from "../lib/api.ts";
import UpdateProfileModal from "@/components/modals/UpdateProfileModal.tsx";

/**
 * A ProfilePage komponens a felhasználó profiloldalát jeleníti meg.
 *
 * - Betölti a felhasználó kiválasztott és hirdetett munkáit.
 * - Lehetőséget biztosít a profilkép módosítására és a profil szerkesztésére.
 * - Kijelentkezési opciót kínál.
 * - Aszinkron adatlekéréseket végez az API-ból.
 *
 * @component
 */
export default function ProfilePage(){
    const {user, isLoading, kijelentkezes} = useAuth();
    const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
    const [ads, setAds] = useState<Job[]>([]);
    /**
     * 1: önkéntes munkák nézet
     * 2: saját hirdetések nézet
     */
    const [mode, setMode] = useState<1|2>(1)
    const [profilePicChangeModal, setProfilePicChangeModal] = useState(false);
    const navigate = useNavigate();
    const [isProfilePicLoading, setIsProfilePicLoading] = useState<boolean>(false);
    const [updateProfileModal, setUpdateProfileModal] = useState<boolean>(false);

    /**
     * Aszinkron függvény, amely lekéri a felhasználóhoz tartozó munkákat az API-ból.
     */
    const fetchJobs = async () => {
        setSelectedJobs(await getSelectedJobs().then((res) => {
            return res
        }))
        setAds(await getAdvertised());
    }

    useEffect(() => {
        fetchJobs();
    }, []);

    /**
     * Figyeli, hogy a felhasználó be van-e jelentkezve. Ha nincs, akkor átirányít a bejelentkezési oldalra.
     */
    useEffect(() => {
        if (!isLoading && user === null) {
            navigate('/login');
        }
    }, [user, isLoading]);

    /**
     * Kijelentkezteti a felhasználót.
     */
    const handleLogout = async () => {
        await logout();
        kijelentkezes();
    }

    return <>
        {
            !isLoading?(
                <div className="md:min-h-screen flex w-full flex-col p-3  overflow-y-scroll  [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                    {/* Profil fejléc és kép */}
                    <div className=" flex flex-col w-full p-3 items-center text-center ">

                        <div className="flex items-center text-center">
                        {
                            !isProfilePicLoading?(
                                <div className="w-28 h-28 relative text-center rounded-full group cursor-pointer "
                                     onClick={() => setProfilePicChangeModal(true)}>
                                    <img
                                        className="w-full h-full object-cover rounded-full drop-shadow-lg transition-all duration-300 group-hover:brightness-50"
                                        src={user?.profileImg}></img>
                                    <p className="text-sm text-white invisible group-hover:visible absolute top-1/3 bottom-1/2 right-1/4 left-1/4 transform:translate-x-1/2 transform:translate-y-1/2">Fénykép
                                        feltöltése</p>
                                </div>
                            ): (
                                <div className="flex justify-center md:items-center align-center">
                                    <div
                                        className="animate-spin  rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            )
                        }
                            {
                                profilePicChangeModal && (
                                    <ChangeProfilePicModal setIsLoading={setIsProfilePicLoading} setModal={setProfilePicChangeModal}/>
                                )
                            }

                            {
                                updateProfileModal && (
                                    <UpdateProfileModal setModal={setUpdateProfileModal}/>
                                )
                            }

                            <div className="justify-center content-center p-3">
                                <h2 className="font-black text-2xl">{user?.name}</h2>
                                <h3>@{user?.username}</h3>
                                <button onClick={() => setUpdateProfileModal(true)}>Profil szerkesztése</button>
                                <br/>
                                <button className="text-red-600" onClick={handleLogout}>Kijelentkezés</button>
                            </div>
                        </div>
                        <div className=" bg-indigo-950 h-px w-4/5  my-6"></div>
                        {/* Nézet váltó */}
                        <div
                            className="flex text-2xl flex-row text-center md:w-1/3 md:min-w-fit min-w-[60%] justify-between">
                            <p className="cursor-pointer grow-0 flex-none hover:underline decoration-indigo-950 decoration-1 underline-offset-4"
                               onClick={() => setMode(1)}>Önkéntes</p>
                            <p className="text-indigo-950 font-thin grow cursor-default">|</p>
                            <p className="cursor-pointer grow-0 flex-none hover:underline decoration-indigo-950 decoration-1 underline-offset-4"
                               onClick={() => setMode(2)}>Hírdetés</p>
                        </div>
                    </div>
                    {/* Tartalom */}
                    {
                        mode == 1 ?
                            (<div className="flex flex-wrap justify-center">
                                {
                                    (selectedJobs.map((item: Job) => (
                                        <JobCard setJobs={setSelectedJobs} key={item.id} canSaveForLater={true} Job={item}/>
                                    )))
                                }
                            </div>)
                            :
                            (<div className="flex flex-wrap justify-center">
                                {
                                    (ads.map((item: Job) => (
                                        <JobCard setJobs={setAds} key={item.id} canSaveForLater={false} Job={item}/>
                                    )))
                                }
                            </div>)

                    }
                </div>):
                (
                    <div className="flex justify-center w-dvw md:items-center align-center">
                        <div className="animate-spin  rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )
        }
    </>
}