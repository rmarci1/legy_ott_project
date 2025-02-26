import "../index.css"
import {useAuth} from "./Context/AuthContext.tsx";
import {Job} from "../Types/Job.ts";
import JobCard from "./JobCard/JobCard.tsx";
import {useEffect} from "react";

export default function MainPage() {
    const { allJobs, jobs, user, checkUser } = useAuth();

    useEffect(() => {
        checkUser()
    }, []);

    return (
        <div className="flex flex-wrap h-screen w-dvw justify-center overflow-auto">
            {
                user?
                    (jobs.map((item: Job) => (
                        <JobCard key={item.id} attending={false} Job={item}/>
                    )))
                :(allJobs.map((item: Job) => (
                    <JobCard key={item.id} attending={false} Job={item}/>
                )))
            }
        </div>
    );
}