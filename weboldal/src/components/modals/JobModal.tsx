import { Job } from "../../Types/Job.ts";
import { User } from "../../Types/User.ts";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { IoClose } from "react-icons/io5";
import {toast, ToastContainer} from "react-toastify";

interface JobModalProps {
    job: Job;
    user?: User;
    attending: boolean;
    setModal: (value: boolean) => void;
    setProfileModal: (value: boolean) => void;
    attendJob: (id: number, value: boolean) => void;
}

export default function JobModal({ job, user, attending, setModal, attendJob, setProfileModal }: JobModalProps) {
    const date = new Date(job.date);
    const today = new Date();
    const { getAdvertiserProfile, deleteJobById } = useAuth();

    useEffect(() => {
        getAdvertiserProfile(job.from);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModal(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
            document.addEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleDelete = async () => {
        deleteJobById(job.id, job.from)
        toast('Sikeresen törölve lett!')
        setModal(false);
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={() => setModal(false)}
            >
                <div
                    className="relative bg-indigo-950 rounded-lg flex flex-col shadow-sm max-h-[95%] p-6 w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row justify-between items-center mb-4 whitespace-pre-wrap break-words">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-white ">{job.name}</h3>
                            <p
                                onClick={() => {
                                    setModal(false);
                                    setProfileModal(true);
                                }}
                                className="text-gray-400 cursor-pointer hover:text-gray-50"
                            >
                                @{job.from}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8  hover:bg-gray-600 hover:text-white"
                            onClick={() => setModal(false)}
                        >
                            <IoClose className="place-self-center" size={25}/>
                        </button>
                    </div>

                    <img className="rounded mt-3 mb-2 h-40 place-self-center" src={job.img}
                         alt="Job picture"/>

                    <div className="overflow-auto
                                      [&::-webkit-scrollbar]:w-1
                                      [&::-webkit-scrollbar-track]:rounded-full
                                      [&::-webkit-scrollbar-track]:bg-gray-600/25
                                      [&::-webkit-scrollbar-thumb]:rounded-full
                                      [&::-webkit-scrollbar-thumb]:bg-gray-700/30">
                        <p className="text-white break-words whitespace-pre-line">{job.description}</p>
                    </div>

                    <p className="text-gray-300 mt-2 break-words">Helyszín: {job.address}</p>

                    {user && !attending && (
                        <div className=" flex mt-4 justify-center w-full">
                            <button type="button" onClick={() => attendJob(job.id, true)}
                                    className="bg-green-700 rounded p-2 w-2/3 text-white">
                                Jelentkezés
                            </button>
                        </div>
                    )}

                    {user && job.from == user.username && date > today && (
                        <div className=" flex mt-4 justify-center w-full">
                            <button type="button"
                                    onClick={() => {
                                        handleDelete()
                                    }}
                                    className="bg-red-800 rounded p-2 w-2/3 text-white">
                                Törlés
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <p className="text-gray-300">Résztvevők:</p>
                            <p className="text-white">{job.current_attending}/{job.max_attending}</p>
                        </div>
                        <p className="text-gray-300">{date.toLocaleDateString()}</p>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </>
    );
}
