import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.tsx";
import ListingComponent from "../components/ListingComponent.tsx";
import {useNavigate} from "react-router";

export default function InteractedJobs(){
    const [saved, setSaved] = useState(false)
    const [jobs, setJobs] = useState(true);
    const [ads, setAds] = useState(false);
    const navigate = useNavigate();
    const { user, savedJobs, archivedJobs, archivedAds, checkUser } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            await checkUser();
        };
        fetchUser();
    }, []);

    return <>
        {
            user ? (
                <div className=" w-dvw flex flex-col h-screen p-5 overflow-auto">
                    <ListingComponent show={saved} title={"Elmentett munkák"}  setShow={setSaved} jobs={savedJobs}/>
                    <ListingComponent show={jobs} title={"Archivált munkák"} setShow={setJobs} jobs={archivedJobs}/>
                    <ListingComponent show={ads} title={"Archivált hírdetések"} setShow={setAds} jobs={archivedAds}/>
                </div>
            ):
                (
                    <div className=" w-dvw flex flex-col h-screen p-5 items-center justify-center cursor-default">
                        <h1 className="font-bold text-3xl">
                            Nincsen elérhető adat.
                        </h1>
                        <h3 className="font-light text-xl cursor-pointer hover:font-normal" onClick={() => navigate('/login')}>
                            Kérem jelentkezzen be!
                        </h3>
                    </div>
                )
        }

    </>
}