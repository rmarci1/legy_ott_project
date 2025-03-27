import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.tsx";
import ListingComponent from "../components/ListingComponent.tsx";
import {useNavigate} from "react-router";
import {Job} from "@/Types/Job.ts";
import {getArchivedAds, getArchivedJobs} from "@/lib/api.ts";

export default function InteractedJobs(){
    const [saved, setSaved] = useState(false)
    const [jobs, setJobs] = useState(true);
    const [ads, setAds] = useState(false);
    const [archivedJobs, setArchivedJobs] = useState<Job[]>([])
    const [archivedAds, setArchivedAds] = useState<Job[]>([])
    const navigate = useNavigate();
    const { user, savedJobs, checkUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            await checkUser();
            setArchivedJobs(await getArchivedJobs());
            setArchivedAds(await getArchivedAds());
        };
        fetchData();
    }, []);

    return <>
        {
            user ? (
                <div className=" w-dvw flex flex-col h-screen p-5 overflow-auto [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
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