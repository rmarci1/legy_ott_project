import "../index.css"
import {useAuth} from "./Context/AuthContext.tsx";
import {Job} from "../Types/Job.ts";
import JobCard from "./JobCard/JobCard.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router";
import { getUser } from "../api.ts";

export default function MainPage() {
    const { allJobs, getAll, jobs, user, bejelentkezes } = useAuth();
    const navigate = useNavigate()



    useEffect(() => {
        const checkUser = async () => {
            const user = await getUser().then((res) => { return res.profile })
            bejelentkezes(user);
        }
        checkUser()
    }, []);

    useEffect(() => {
        if (!user) {
            getAll();
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-wrap h-screen w-dvw justify-center overflow-y-scroll">
            {
                user?
                    (jobs.map((item: Job) => (
                        <JobCard key={item.id} Job={item}/>
                    )))
                :(allJobs.map((item: Job) => (
                    <JobCard key={item.id} Job={item}/>
                )))
            }
        </div>


    );
}