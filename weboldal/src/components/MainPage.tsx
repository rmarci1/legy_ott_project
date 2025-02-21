import "../index.css"
import {useAuth} from "./Context/AuthContext.tsx";
import {Job} from "../Types/Job.ts";
import JobCard from "./JobCard/JobCard.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router";

export default function MainPage() {
    const { allJobs, getAll, user } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (user){
            navigate('/home')
        }
        else{
            getAll()
        }
    }, []);

    return (
        <div className="flex flex-wrap h-screen w-dvw justify-center overflow-y-scroll">
            {
                allJobs.map((item: Job) => (
                    <JobCard key={item.id} Job={item}/>
                ))
            }
        </div>


    );
}