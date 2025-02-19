import { Job } from "../Types/Job";
import {useEffect, useState} from "react";
import { PiHeartLight, PiHeartFill } from "react-icons/pi";
import {useAuth} from "./Context/AuthContext.tsx";

interface jobProps{
    Job: Job
}

export default function JobCard({Job}: jobProps){
    const [modal, setModal] = useState(false);
    const {user, setSave} = useAuth();
    const date = new Date(Job.date);
    useEffect(() => {
    }, []);

    return<>
        <div className="rounded-lg shadow-secondary-1 bg-surface-dark w-1/3 m-4">
            <img className="rounded-t-lg" src={Job.img} alt="Job picture"/>
            <div className="p-6 text-surface border-2">
                <div className="flex flex-row w-full">
                    <h5 className="mb-2 text-xl font-medium leading-tight flex-grow">{Job.name}</h5>
                    {user && (
                        <span className="flex-none">
                        {Job.profiles[0] && Job.profiles[0].saveForLater ?
                            <PiHeartFill size={40} color="red"
                                         onClick={() => setSave(Job, user, false)}/> :
                            <PiHeartLight size={40} onClick={() => setSave(Job, user, true)}/>}
                    </span>
                    )}
                </div>
                <p className="mb-4 text-base">
                    {Job.description}
                </p>
                <button
                    type="button"
                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out shadow-black/30 hover:shadow-dark-strong focus:shadow-dark-strong active:shadow-dark-strong"
                    onClick={() => setModal(true)}>
                    További információ
                </button>
            </div>

            {modal && (
                <div tabIndex={-1}
                     className="overflow-y-auto text-white overflow-x-hidden fixed justify-center items-center w-fit h-fit justify-self-center md:inset-0 max-h-full">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-indigo-950 rounded-lg shadow-sm ">
                            <div className="flex flex-col items-center justify-between p-4 md:p-5 rounded-t">
                                <div className="flex flex-row w-full">
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-semibold">
                                            {Job.name}
                                        </h3>
                                        <p className="text-gray-400">
                                            {Job.from}
                                        </p>
                                    </div>
                                    <button type="button"
                                            className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                                            onClick={() => setModal(false)}>
                                        <svg className="w-3 h-3" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round"
                                                  strokeLinejoin="round" strokeWidth="2"
                                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    <p>
                                        {Job.description}
                                    </p>
                                </div>
                                <div className="">
                                    <p className="">
                                        Helyszín: {Job.address}
                                    </p>
                                </div>
                                <div className="grow">
                                    <button type={"button"} className="bg-green-700 rounded p-2">
                                        Jelentkezés
                                    </button>
                                </div>
                                <div className="flex flex-row w-full justify-center content-center">
                                    <div className="grow flex flex-col">
                                        <p>
                                            Résztvevők:
                                        </p>
                                        <p>
                                            {Job.current_attending}/{Job.max_attending}
                                        </p>
                                    </div>
                                    <p className="grow-0 place-self-end">
                                        {date.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
}