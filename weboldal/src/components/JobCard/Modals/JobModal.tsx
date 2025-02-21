import {Job} from "../../../Types/Job.ts";
import {User} from "../../../Types/User.ts";
import {useEffect} from "react";
import {useAuth} from "../../Context/AuthContext.tsx";

interface JobModalProps{
    job: Job,
    user?: User
    setModal: (value: boolean) => void,
    setProfileModal: (value: boolean) => void,
    attendJob: (id: number, username: string, value: boolean) => void
}

export default function JobModal({job, user, setModal, attendJob, setProfileModal}: JobModalProps){
    const date = new Date(job.date);
    const { getAdvertiserProfile } = useAuth();
    useEffect(() => {
        getAdvertiserProfile(job.from);
    }, []);
    return <>
        <div tabIndex={-1}
             className="overflow-y-auto text-white overflow-x-hidden fixed justify-center items-center w-fit h-fit justify-self-center md:inset-0 max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-indigo-950 rounded-lg shadow-sm ">
                    <div className="flex flex-col items-center justify-between p-4 md:p-5 rounded-t">
                        <div className="flex flex-row w-full">
                            <div className="flex flex-col">
                                <h3 className="text-xl font-semibold">
                                    {job.name}
                                </h3>
                                <p onClick={() => {setModal(false); setProfileModal(true)}} className="text-gray-400 cursor-pointer hover:text-gray-50">
                                    @{job.from}
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
                                {job.description}
                            </p>
                        </div>
                        <div className="">
                            <p className="">
                                Helyszín: {job.address}
                            </p>
                        </div>
                        {
                            user &&
                            (<div className="grow">
                                <button type={"button"} onClick={() => attendJob(job.id, user.username, true)}
                                        className="bg-green-700 rounded p-2">
                                    Jelentkezés
                                </button>
                            </div>)
                        }
                        <div className="flex flex-row w-full justify-center content-center">
                            <div className="grow flex flex-col">
                                <p>
                                    Résztvevők:
                                </p>
                                <p>
                                    {job.current_attending}/{job.max_attending}
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
    </>
}