import { Job } from "../Types/Job";
import {useEffect, useState} from "react";
import { PiHeartLight, PiHeartFill } from "react-icons/pi";

interface jobProps{
    Job: Job
}

export default function JobCard({Job}: jobProps){
    //TODO: Get saved state from database
    const [saved, setSaved] = useState<boolean>(false);
    useEffect(() => {
        console.log("miezmiertnemmukodik")
    }, []);

    return(<>
        <div className="rounded-lg shadow-secondary-1 bg-surface-dark w-1/3 m-4">
            <img className="rounded-t-lg" src={Job.img} alt="Job picture"/>
            <div className="p-6 text-surface border-2">
                <h5 className="mb-2 text-xl font-medium leading-tight">{Job.name}</h5>
                <span>{saved? <PiHeartFill size={10} color="red" onClick={() => setSaved(false)}/> : <PiHeartLight size={10} onClick={() => setSaved(true)}/>}</span>
                <p className="mb-4 text-base">
                    {Job.description}
                </p>
                <button
                type="button"
                className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out shadow-black/30 hover:shadow-dark-strong focus:shadow-dark-strong active:shadow-dark-strong">
                    További információ
                </button>
            </div>
        </div>
    </>)
}