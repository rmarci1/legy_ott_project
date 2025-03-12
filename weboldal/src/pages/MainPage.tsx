import "../index.css"
import {useAuth} from "../context/AuthContext.tsx";
import {Job} from "../Types/Job.ts";
import JobCard from "../components/cards/JobCard.tsx";
import {useEffect} from "react";

export default function MainPage() {
    const { allJobs, jobs, user, checkUser } = useAuth();

    useEffect(() => {
        checkUser()
    }, []);

    return (
        <div className="flex flex-wrap h-screen w-dvw justify-center overflow-auto cursos-default">
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