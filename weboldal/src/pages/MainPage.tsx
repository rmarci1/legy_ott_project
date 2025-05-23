import "../index.css"
import {useAuth} from "../context/AuthContext.tsx";
import {Job} from "../Types/Job.ts";
import JobCard from "../components/cards/JobCard.tsx";
import {useEffect, useState} from "react";
import {getAllJobs, getAvailableJobs} from "@/lib/api.ts";

/**
 * `MainPage` komponens – az alkalmazás főoldala.
 *
 * Megjeleníti az állásokat a felhasználó bejelentkezési állapota alapján:
 * - **Bejelentkezett felhasználó** esetén: csak a személyre szabott állások (`jobs`) jelennek meg.
 * - **Nem bejelentkezett felhasználó** esetén: minden nyilvános állás (`allJobs`) megjelenik.
 *
 * Az állások `JobCard` komponensekként jelennek meg egy görgethető rácsban.
 *
 * @component
 * @returns {JSX.Element} Az állások `JobCard` komponensekként jelennek meg egy görgethető rácsban.
 */
export default function MainPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const { user, checkUser } = useAuth();

    /**
     * Ellenőrzi a felhasználó bejelentkezési állapotát a komponens betöltésekor.
     */
    useEffect(() => {
        checkUser()

    }, []);

    useEffect(() => {
            fetchJobs();
    }, [user]);

    const fetchJobs = async () => {
        if(user != null){
            setJobs(await getAvailableJobs());
        }
        else{
            setJobs(await getAllJobs());
        }
    }

    return (
        <div className="flex flex-wrap h-full w-full justify-center overflow-y-auto overflow-x-hidden md:overflow-auto
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300 cursos-default">
            {
                    // A felhasználónak ajánlott lehetőségek
                    jobs.map((item: Job) => (
                        <JobCard setJobs={setJobs} key={item.id} canSaveForLater={true} Job={item}/>
                    ))
            }
        </div>
    );
}