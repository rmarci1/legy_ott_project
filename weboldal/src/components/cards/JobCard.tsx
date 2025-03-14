import { Job } from "../../Types/Job.ts";
import {useEffect, useState} from "react";
import { PiHeartLight, PiHeartFill } from "react-icons/pi";
import {useAuth} from "../../context/AuthContext.tsx";
import JobModal from "../modals/JobModal.tsx";
import ProfileModal from "../modals/ProfileModal.tsx";

interface jobProps{
    Job: Job,
    attending: boolean
}

export default function JobCard({Job, attending}: jobProps){
    const [jobModal, setJobModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const {user, setSave, attendJob} = useAuth();

    const trimmedText = (text: string) => {
        const lines = text.split('\n');
        const limitedText = lines.slice(0, 3).join('\n');

        return limitedText.length > 150 ? limitedText.slice(0, 150) + "..." : text;
    };

    useEffect(() => {
    }, []);

    return<>
        <div className="rounded-lg shadow-secondary-1 bg-surface-dark m-2 cursor-default">
            <div className="p-6 text-surface flex flex-col border-2 h-[300px] w-[500px]">
                <div className="flex flex-row flex-grow w-full items-center">
                    <h5 className="mb-2 text-xl font-medium leading-tight flex-grow whitespace-pre-wrap break-words">
                        {Job.name}
                    </h5>
                    <img
                        className="rounded mt-3 mb-2 h-24 object-cover aspect-square place-self-center"
                        src={Job.img}
                        alt="Job picture"
                    />
                </div>
                <span className="mb-4  text-base flex-grow font-light whitespace-pre-wrap break-words">
                    <p className="line-clamp-3">
                        {
                            trimmedText(Job.description)
                        }
                    </p>
                </span>
                <div className="flex flex-row justify-between ">
                    {user && !attending && (
                        <span className="flex-none cursor-pointer">
                            {Job.profiles && Job.profiles[0] && Job.profiles[0].saveForLater ?
                                <PiHeartFill size={40} color="red"
                                             onClick={() => setSave(Job, false)}/> :
                                <PiHeartLight size={40} onClick={() => setSave(Job, true)}/>}
                        </span>
                    )}
                    <button
                        type="button"
                        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out shadow-black/30 hover:shadow-dark-strong focus:shadow-dark-strong active:shadow-dark-strong"
                        onClick={() => setJobModal(true)}>
                        További információ
                    </button>
                </div>

            </div>

            {jobModal && (
                user? (
                        <JobModal job={Job} user={user} setModal={setJobModal} attending={attending} attendJob={attendJob} setProfileModal={setProfileModal}/>
                    ):
                    (
                        <JobModal job={Job} setModal={setJobModal} attending={attending} attendJob={attendJob} setProfileModal={setProfileModal}/>
                    )
            )}

            {
                profileModal && (
                    user? (
                        <ProfileModal user={user} setModal={setProfileModal} setJobModal={setJobModal}/>
                    ):
                    (
                        <ProfileModal setModal={setProfileModal}  setJobModal={setJobModal}/>
                    )
                )
            }

        </div>
    </>
}