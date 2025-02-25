import { Job } from "../../Types/Job.ts";
import { useState} from "react";
import { PiHeartLight, PiHeartFill } from "react-icons/pi";
import {useAuth} from "../Context/AuthContext.tsx";
import JobModal from "./Modals/JobModal.tsx";
import ProfileModal from "./Modals/ProfileModal.tsx";

interface jobProps{
    Job: Job
}

export default function JobCard({Job}: jobProps){
    const [jobModal, setJobModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const {user, setSave, attendJob} = useAuth();

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
                    onClick={() => setJobModal(true)}>
                    További információ
                </button>
            </div>

            {jobModal && (
                user? (
                        <JobModal job={Job} user={user} setModal={setJobModal} attendJob={attendJob} setProfileModal={setProfileModal}/>
                    ):
                    (
                        <JobModal job={Job} setModal={setJobModal} attendJob={attendJob} setProfileModal={setProfileModal}/>
                    )
            )}

            {
                profileModal && (
                    user? (
                        <ProfileModal user={user} setModal={setProfileModal} setJobModal={setJobModal} username={Job.from}/>
                    ):
                    (
                        <ProfileModal setModal={setProfileModal} setJobModal={setJobModal} username={Job.from}/>
                    )
                )
            }


        </div>
    </>
}