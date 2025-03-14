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
        <div className="flex flex-wrap h-full w-full justify-center overflow-auto
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300 cursos-default">
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