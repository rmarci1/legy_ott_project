import "../index.css"
import {useEffect} from "react";
import {useAuth} from "./Context/AuthContext.tsx";
import {useNavigate} from "react-router";
import {Job} from "../Types/Job.ts";
import JobCard from "./JobCard.tsx";

export default function Home() {

    const navigate = useNavigate();
    const {user, jobs} = useAuth();

    useEffect(() => {
        if(!user){
            alert("Nincs bejelentkezve!");
            navigate('/login');
        }
    }, [])

    return (
        <>
            <div className="w-fit h-screen">
            {
                jobs.map((item: Job) => (
                    <JobCard key={item.id} Job={item}/>
                ))
            }
            </div>

        </>
    );
}