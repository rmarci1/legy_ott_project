import {useState} from "react";
import {useAuth} from "../Context/AuthContext.tsx";
import ListingComponent from "./Component/ListingComponent.tsx";

export default function InteractedJobs(){
    const [saved, setSaved] = useState(false)
    const [jobs, setJobs] = useState(false);
    const [ads, setAds] = useState(false);
    const { savedJobs, archivedJobs, archivedAds } = useAuth();

    return <>
        <div className=" w-dvw flex flex-col h-screen p-5 overflow-y-scroll overflow-x-none">
            <ListingComponent show={saved} title={"Elmentett munkák"} setShow={setSaved} jobs={savedJobs}/>
            <ListingComponent show={jobs} title={"Archivált munkák"} setShow={setJobs} jobs={archivedJobs}/>
            <ListingComponent show={ads} title={"Archivált hírdetések"} setShow={setAds} jobs={archivedAds}/>
        </div>
    </>
}